-- supabase/migrations/002_add_anonymous_user_id.sql
-- 添加匿名用户 ID 字段到 chat_sessions 表
-- 用于在没有登录系统的情况下隔离不同用户的数据

-- 添加 anonymous_user_id 字段
ALTER TABLE chat_sessions
ADD COLUMN IF NOT EXISTS anonymous_user_id TEXT;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_chat_sessions_anonymous_user_id
ON chat_sessions(anonymous_user_id);

-- 添加注释
COMMENT ON COLUMN chat_sessions.anonymous_user_id IS '匿名用户 ID，用于在没有登录系统的情况下隔离用户数据（存储在浏览器 localStorage）';

-- 为现有数据生成匿名 ID（可选，如果需要保留旧数据）
-- UPDATE chat_sessions
-- SET anonymous_user_id = 'legacy_' || MD5(id::TEXT || created_at::TEXT)
-- WHERE anonymous_user_id IS NULL;
