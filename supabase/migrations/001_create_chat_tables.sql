-- =====================================================
-- AI Chat Database Schema Migration
-- Version: 001
-- Description: 创建聊天会话、消息、反馈和统计表
-- =====================================================

-- 1. 聊天会话表
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    session_id TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_title TEXT NOT NULL DEFAULT '新對話',
    language TEXT DEFAULT 'zh-HK', -- 'zh-HK', 'zh-CN', 'en'
    status TEXT DEFAULT 'active', -- 'active', 'archived', 'deleted'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 会话表索引
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON public.chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON public.chat_sessions(created_at DESC);

-- 会话表 RLS 策略
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- 所有人可以查看会话（包括匿名用户）
CREATE POLICY "Anyone can view sessions" ON public.chat_sessions
    FOR SELECT TO public
    USING (true);

-- 所有人可以创建会话
CREATE POLICY "Anyone can create sessions" ON public.chat_sessions
    FOR INSERT TO public
    WITH CHECK (true);

-- 所有人可以更新自己的会话
CREATE POLICY "Anyone can update own sessions" ON public.chat_sessions
    FOR UPDATE TO public
    USING (true);

-- 所有人可以删除会话
CREATE POLICY "Anyone can delete sessions" ON public.chat_sessions
    FOR DELETE TO public
    USING (true);

-- 2. 聊天消息表
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    session_id BIGINT NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}', -- 存储token数量、模型版本、搜索结果等
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 消息表索引
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- 消息表 RLS 策略
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 所有人可以查看消息
CREATE POLICY "Anyone can view messages" ON public.chat_messages
    FOR SELECT TO public
    USING (true);

-- 所有人可以创建消息
CREATE POLICY "Anyone can create messages" ON public.chat_messages
    FOR INSERT TO public
    WITH CHECK (true);

-- 3. 消息反馈表
CREATE TABLE IF NOT EXISTS public.chat_feedback (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    message_id BIGINT NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating TEXT NOT NULL, -- 'thumbs_up', 'thumbs_down'
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 反馈表索引
CREATE INDEX IF NOT EXISTS idx_chat_feedback_message_id ON public.chat_feedback(message_id);
CREATE INDEX IF NOT EXISTS idx_chat_feedback_rating ON public.chat_feedback(rating);

-- 反馈表 RLS 策略
ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;

-- 所有人可以创建反馈
CREATE POLICY "Anyone can create feedback" ON public.chat_feedback
    FOR INSERT TO public
    WITH CHECK (true);

-- 所有人可以查看反馈
CREATE POLICY "Anyone can view feedback" ON public.chat_feedback
    FOR SELECT TO public
    USING (true);

-- 4. AI 使用统计表
CREATE TABLE IF NOT EXISTS public.ai_usage_stats (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_messages BIGINT DEFAULT 0,
    total_tokens BIGINT DEFAULT 0,
    total_cost DECIMAL(10, 6) DEFAULT 0.000000,
    avg_response_time INTEGER, -- 毫秒
    unique_sessions BIGINT DEFAULT 0,
    satisfied_count BIGINT DEFAULT 0, -- 👍 数量
    unsatisfied_count BIGINT DEFAULT 0, -- 👎 数量
    model_version TEXT DEFAULT 'qwen-plus',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date, model_version)
);

-- 统计表索引
CREATE INDEX IF NOT EXISTS idx_ai_usage_stats_date ON public.ai_usage_stats(date DESC);

-- 统计表 RLS 策略（仅管理员可访问）
ALTER TABLE public.ai_usage_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view usage stats" ON public.ai_usage_stats
    FOR SELECT TO public
    USING (true); -- 暂时开放，生产环境应限制为管理员

-- 5. 快捷回复表
CREATE TABLE IF NOT EXISTS public.chat_suggestions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    text TEXT NOT NULL,
    icon TEXT,
    language TEXT DEFAULT 'zh-HK',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 快捷回复表 RLS 策略
ALTER TABLE public.chat_suggestions ENABLE ROW LEVEL SECURITY;

-- 所有人可以查看快捷回复
CREATE POLICY "Anyone can view suggestions" ON public.chat_suggestions
    FOR SELECT TO public
    USING (true);

-- 所有人可以创建快捷回复
CREATE POLICY "Anyone can create suggestions" ON public.chat_suggestions
    FOR INSERT TO public
    WITH CHECK (true);

-- 所有人可以更新快捷回复
CREATE POLICY "Anyone can update suggestions" ON public.chat_suggestions
    FOR UPDATE TO public
    USING (true);

-- 所有人可以删除快捷回复
CREATE POLICY "Anyone can delete suggestions" ON public.chat_suggestions
    FOR DELETE TO public
    USING (true);

-- 6. 插入默认快捷回复数据
INSERT INTO public.chat_suggestions (text, display_order, language) VALUES
    ('查看服務器產品規格', 1, 'zh-HK'),
    ('聯繫技術支持', 2, 'zh-HK'),
    ('查看最新產品', 3, 'zh-HK'),
    ('關於定價信息', 4, 'zh-HK')
ON CONFLICT DO NOTHING;

-- 7. 创建更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要的表添加更新时间戳触发器
CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_suggestions_updated_at
    BEFORE UPDATE ON public.chat_suggestions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_usage_stats_updated_at
    BEFORE UPDATE ON public.ai_usage_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. 创建统计数据自动更新函数（可选 - 用于增量更新）
CREATE OR REPLACE FUNCTION update_chat_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'assistant' THEN
        -- 更新当日统计
        INSERT INTO public.ai_usage_stats (date, total_messages, model_version)
        VALUES (
            CURRENT_DATE,
            1,
            'qwen-plus'
        )
        ON CONFLICT (date, model_version)
        DO UPDATE SET
            total_messages = ai_usage_stats.total_messages + 1,
            updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器（可选 - 根据需要启用）
-- CREATE TRIGGER chat_stats_trigger
--     AFTER INSERT ON public.chat_messages
--     FOR EACH ROW
--     EXECUTE FUNCTION update_chat_stats();

-- 完成
SELECT 'Chat tables migration completed successfully' as status;
