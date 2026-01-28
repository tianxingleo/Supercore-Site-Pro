# 富文本编辑器升级日志

## 升级日期

2026-01-27

## 升级内容

### 1. 安装依赖

```bash
npm install @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-text-align
```

### 2. 新增文件

- `components/admin/RichTextEditor.vue` - 富文本编辑器组件
- `docs/RICH_TEXT_EDITOR_GUIDE.md` - 使用说明文档

### 3. 修改文件

#### `pages/admin/news/[id].vue`

- 将基础 textarea 替换为 `RichTextEditor` 组件
- 标签从"正文 (Markdown)"改为"正文 (富文本)"

#### `pages/news/[slug].vue`

- 修改 `renderedContent` 计算属性
- 支持同时渲染 HTML 和 Markdown 格式
- 向后兼容旧 Markdown 内容

#### `components/news/NewsCard.vue`

- 添加 `extractTextPreview` 函数
- 智能提取 HTML 或 Markdown 内容的纯文本预览
- 防止 HTML 标签被截断导致显示异常

## 技术实现

### 编辑器特性

- 基于 Tiptap 的无头编辑器架构
- 完全可定制的 UI
- 瑞士设计风格
- 支持多语言内容编辑

### 工具栏功能

- 文本格式：粗体、斜体、删除线
- 标题层级：H1、H2、H3、段落
- 列表：无序、有序
- 对齐：左对齐、居中、右对齐
- 历史记录：撤销、重做
- 图片粘贴：直接粘贴图片到编辑器
- 链接插入：选中文本添加链接

### 数据格式

- **输入**：v-model 绑定 HTML 字符串
- **输出**：编辑器返回 HTML 格式内容
- **存储**：HTML 格式存储到数据库

### 向后兼容

- 自动检测内容格式（HTML vs Markdown）
- HTML 内容直接渲染
- Markdown 内容使用 `marked` 转换后渲染
- 新闻卡片智能提取纯文本预览

## 使用示例

### 编辑器组件使用

```vue
<template>
  <RichTextEditor v-model="content" />
</template>

<script setup>
import RichTextEditor from '~/components/admin/RichTextEditor.vue'

const content = ref('<p>Hello, <strong>world</strong>!</p>')
</script>
```

### 内容渲染

```vue
<template>
  <div v-html="content" class="prose"></div>
</template>
```

## 样式定制

### 编辑器样式

- 工具栏：`bg-swiss-bg-soft` + 简洁图标按钮
- 编辑区：`prose prose-sm max-w-none` + 瑞士设计排版
- 焦点状态：`ring-2 ring-swiss-accent-blue`

### 内容渲染样式

```css
.news-content {
  /* 标题样式 */
  h1,
  h2,
  h3 {
    color: #000;
    font-weight: bold;
  }

  /* 段落样式 */
  p {
    line-height: 1.8;
    margin-bottom: 2rem;
  }

  /* 图片样式 */
  img {
    width: 100%;
    margin: 3rem 0;
  }
}
```

## 已知问题

1. **类型检查错误**
   - 部分文件存在 TypeScript 类型错误
   - 不影响运行时功能
   - 计划在后续版本修复

2. **图片大小**
   - 粘贴图片转换为 Base64
   - 大图可能影响性能
   - 建议图片大小 < 2MB

3. **格式兼容**
   - 从 Word 复制内容可能丢失格式
   - 建议在编辑器中重新格式化

## 测试清单

- [x] 编辑器组件正常加载
- [x] 工具栏按钮功能正常
- [x] 内容输入和保存
- [x] HTML 内容渲染
- [x] Markdown 内容兼容
- [x] 新闻卡片预览显示
- [x] 多语言编辑
- [x] 图片粘贴功能
- [x] 链接插入功能
- [ ] 类型检查全部通过（待修复）

## 后续优化

1. **性能优化**
   - [ ] 图片上传到服务器（而非 Base64）
   - [ ] 内容懒加载
   - [ ] 编辑器性能优化

2. **功能增强**
   - [ ] 代码块语法高亮
   - [ ] 表格插入和编辑
   - [ ] 引用块样式
   - [ ] 媒体库集成
   - [ ] Markdown 源代码视图

3. **用户体验**
   - [ ] 自动保存草稿
   - [ ] 内容预览模式
   - [ ] 快捷键提示
   - [ ] 移动端优化

4. **开发体验**
   - [ ] 完善 TypeScript 类型定义
   - [ ] 添加单元测试
   - [ ] 性能监控和优化

## 参考资料

- [Tiptap 官方文档](https://tiptap.dev/)
- [Tiptap Vue 3 指南](https://tiptap.dev/guide/vue)
- [项目代码库](https://github.com/ueberdosis/tiptap)

## 联系方式

如有问题或建议，请联系开发团队。
