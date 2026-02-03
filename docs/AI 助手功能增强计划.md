# AI 助手功能增强计划 (AI Assistant Enhancement Plan)

## 0. 项目概述 (Project Overview)
本计划旨在为 **Supercore AI 助手** 提供深度的用户体验增强、系统安全性加固以及全方位的管理分析功能。重点解决现有的 XSS 安全风险，并构建可持续的会话持久化方案。

### 核心目标
- **安全加固**: 彻底消除 Markdown 渲染中的 XSS 漏洞。
- **体验提升**: 优化交互细节，包括复制、反馈、快捷回复及打字机效果。
- **持久化**: 实现基于 Supabase 的完整会话与消息存储。
- **管理分析**: 提供专业的数据看板，监控 AI 使用成本、性能及用户满意度。

### 技术栈 (Tech Stack)
| 维度 | 技术选型 |
| :--- | :--- |
| **前端框架** | Nuxt 3 (Vue 3, Pinia) |
| **样式/组件** | Tailwind CSS, Swiss Design 风格 |
| **后端/数据库** | Nuxt Server Engines, Supabase (PostgreSQL + pgvector) |
| **AI 核心** | 阿里云通义千问 (Qwen-Plus), Vercel AI SDK |
| **安全加固** | DOMPurify, isomorphic-dompurify |
| **数据可视化** | Chart.js, vue-chartjs |

---

## 1. 第一阶段：安全性修复与基础体验 (Week 1-2)

### 1.1 安全性修复 ⚠️ [最高优先级]
**现状问题**: 当前直接使用 `v-html` 渲染 Markdown，存在严重的 XSS 注入风险。

#### 依赖安装
```bash
npm install isomorphic-dompurify
npm install -D @types/dompurify
```

#### 实现安全 Markdown 渲染器
**文件路径**: `composables/useSafeMarkdown.ts` (新建)
```typescript
import DOMPurify from 'isomorphic-dompurify'

export function useSafeMarkdown() {
  function renderMarkdown(content: string): string {
    const html = marked(content)
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'code', 'pre', 'blockquote',
        'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'
      ],
      ALLOWED_ATTR: ['href', 'class', 'target', 'rel']
    })
  }

  return { renderMarkdown }
}
```

#### 组件更新: `AiChat.vue`
- 集成 `useSafeMarkdown` 替换原有渲染逻辑。
- 对用户输入进行长度限制和前置消毒处理。

### 1.2 基础用户体验增强
- **一键复制**: 为每条消息模块添加复制按钮，使用 Clipboard API，配合 Toast 提示。
- **反馈系统**: 实现 👍/👎 评分功能，数据实时同步至 `chat_feedback` 表。
- **无障碍支持 (A11y)**:
  ```vue
  <div role="log" aria-live="polite" aria-atomic="false">
    <button aria-label="复制消息" @click="copy">
  </div>
  ```
- **全局快捷键**:
  - `Cmd/Ctrl + K`: 快速呼出/隐藏聊天。
  - `Escape`: 关闭对话框。
  - `Enter`: 发送消息（Shift+Enter 换行）。

---

## 2. 第二阶段：数据库架构与持久化 (Week 2-3)

### 2.1 数据库模式设计 (SQL)
**文件**: `supabase/migrations/001_create_chat_tables.sql`

```sql
-- 1. 聊天会话表 (Chat Sessions)
CREATE TABLE IF NOT EXISTS chat_sessions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    session_id TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_title TEXT NOT NULL DEFAULT '新對話',
    language TEXT DEFAULT 'zh-HK',
    status TEXT DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 聊天消息表 (Chat Messages)
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    session_id BIGINT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 消息反馈表 (Chat Feedback)
CREATE TABLE IF NOT EXISTS chat_feedback (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    message_id BIGINT NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating TEXT NOT NULL, -- 'like' / 'dislike'
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AI 使用统计表 (Usage Statistics)
CREATE TABLE IF NOT EXISTS ai_usage_stats (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_messages BIGINT DEFAULT 0,
    total_tokens BIGINT DEFAULT 0,
    total_cost DECIMAL(10, 6) DEFAULT 0.000000,
    avg_response_time INTEGER, -- 单位: ms
    unique_sessions BIGINT DEFAULT 0,
    satisfied_count BIGINT DEFAULT 0,
    unsatisfied_count BIGINT DEFAULT 0,
    model_version TEXT DEFAULT 'qwen-plus',
    UNIQUE(date, model_version)
);

-- 5. 快捷回复/建议表 (Suggestions)
CREATE TABLE IF NOT EXISTS chat_suggestions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    text TEXT NOT NULL,
    icon TEXT,
    language TEXT DEFAULT 'zh-HK',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- 性能索引
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_feedback_message_id ON chat_feedback(message_id);
CREATE INDEX idx_ai_usage_stats_date ON ai_usage_stats(date DESC);
```

### 2.2 服务端持久化逻辑
- **新建会话**: `POST /api/chat/sessions`
- **获取历史**: `GET /api/chat/sessions`
- **流式保存**: 修改 `server/api/chat/messages/index.post.ts`，在流结束后异步写入数据库并记录 Token 消耗。

---

## 3. 第三阶段：多会话管理中心 (Week 3-4)

### 3.1 会话侧边栏 (`ChatSidebar.vue`)
- **功能点**: 历史列表、新对话按钮、会话重命名、删除与归档、全文搜索。
- **状态管理**: 逻辑抽象至 Pinia Store。

### 3.2 状态存储 (`stores/chat.ts`)
```typescript
import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', () => {
  const currentSession = ref<ChatSession | null>(null)
  const sessions = ref<ChatSession[]>([])
  const messages = ref<Map<number, ChatMessage[]>>(new Map())

  async function loadSessions() { /* ... */ }
  async function createSession(language = 'zh-HK') { /* ... */ }
  async function switchSession(sessionId: number) { /* ... */ }
  async function loadMessages(sessionId: number) { /* ... */ }

  return { currentSession, sessions, messages, loadSessions, createSession, switchSession, loadMessages }
})
```

---

## 4. 第四阶段：AI 管理后台 (Week 5-6)

### 4.1 路由结构
- `pages/admin/chat/index.vue`: 核心指标看板 (KPIs)
- `pages/admin/chat/sessions.vue`: 会话列表管理
- `pages/admin/chat/sessions/[id].vue`: 交互式会话溯源
- `pages/admin/chat/analytics.vue`: 深度分析报告
- `pages/admin/chat/suggestions.vue`: 话术库配置

### 4.2 数据看板指标
- **关键指标 (StatsOverview)**:
  - 累计会话数 & 消息总数
  - 消耗 Tokens & 预估成本 ($)
  - 平均响应时长 (P95)
  - 满意度指数 (CSAT)

### 4.3 高级功能
- **导出能力**: 对话历史支持 JSON/CSV/Excel 导出。
- **实时监控**: API 调用趋势图表及模型性能分布。

---

## 5. 第五阶段：高级特性与细节优化 (Week 7-8)

### 5.1 智能辅助功能
- **快捷建议 (`ChatSuggestions.vue`)**: 基于上下文或预设显示高频问题。
- **消息内搜索**: 针对长会话提供关键词定位与高亮跳转。

### 5.2 极致体验优化
- **移动端适配**: 增强触摸手势，优化虚拟键盘弹出后的视口表现，支持全屏对话模式。
- **打字机效果 2.0 (`useTypewriterEffect.ts`)**:
  - 实现非线性的更自然的输出动画。
  - 优化流式数据块的合并逻辑，减少 DOM 更新压力。
  - 可定制化速度与光标样式。

---

## 6. 文件系统清单 (File Manifest)

### 核心修改件
- `components/ui/AiChat.vue`: 核心聊天 UI 重构
- `server/api/ai-chat.ts`: 逻辑迁移至模块化目录
- `layouts/admin.vue`: 导航集成
- `types/chat.d.ts`: 新增类型定义

### 新增工具/逻辑
- `composables/`: `useSafeMarkdown.ts`, `useTypewriterEffect.ts`, `useVirtualChat.ts`
- `components/chat/`: `ChatSidebar`, `ChatMessage`, `ChatInput`, `ChatSuggestions`, `FeedbackButtons`
- `stores/chat.ts`: Pinia 统一状态

### API 服务集
- `server/api/chat/sessions/`: `index.post`, `index.get`, `[id].get`, `[id].delete`
- `server/api/chat/admin/`: `stats.get`, `sessions.get`, `export.get`
- `server/api/chat/feedback/`: `index.post`

---

## 7. 瑞士设计风格指南 (Swiss Design Style Guide)
所有 AI 相关组件必须通过以下 CSS 规范保持视觉同步：

| 元素特性 | 规范细节 |
| :--- | :--- |
| **设计逻辑** | 极简主义，去除不必要的装饰，强调功能性 |
| **布局网格** | 严格遵循 24px 网格系统 |
| **配色** | 高对比度黑白 (#000000 / #FFFFFF)，背景使用 #F5F5F7 |
| **标题** | `font-bold tracking-tighter uppercase` |
| **边框** | 细边框 `1px Solid Black` 或 `White`，无圆角 (Round-0) |
| **标签** | `text-[9px] font-bold uppercase tracking-widest` |
| **阴影** | 硬阴影 `shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]` |

---

## 8. 实施与验证清单

### 研发计划 (Roadmap)
- [ ] **Week 1-2**: 安全性补丁 + 基础 UI 增强
- [ ] **Week 3-4**: Supabase 数据库整合 + Pinia 持久化
- [ ] **Week 5-6**: 完整管理后台 + 统计绘图集成
- [ ] **Week 7-8**: 全面性能优化 + 高级交互特性

### 验证标准 (Success Criteria)
- **[ ] 安全性**: 100% 拦截 XSS 攻击载荷，通过安全审计。
- **[ ] 稳定性**: 会话持久化可靠，刷新页面无丢包。
- **[ ] 性能**: 消息加载耗时 < 500ms，长对话滚动流畅。
- **[ ] 体验**: UI 严格符合 Swiss Design 规范，交互响应即时。
- **[ ] 分析**: 管理端能准确输出每日成本报告与满意度趋势。

---

> *Updated at: 2026-02-03*
> *Stayed in Plan Mode*