-- ========================================
-- 后台功能增强 - 数据库初始化脚本
-- ========================================
-- 此脚本创建操作日志表并设置相关权限
-- 请在 Supabase SQL Editor 中执行此脚本
-- ========================================

-- 1. 创建管理员操作日志表
CREATE TABLE IF NOT EXISTS admin_logs (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL, -- create, update, delete, bulk_delete, export
    resource_type TEXT NOT NULL, -- products, posts, inquiries, etc.
    resource_id BIGINT,
    details JSONB, -- 包含更多详细信息
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 添加表注释
COMMENT ON TABLE admin_logs IS '管理员操作日志表';
COMMENT ON COLUMN admin_logs.user_id IS '操作用户ID';
COMMENT ON COLUMN admin_logs.user_email IS '操作用户邮箱';
COMMENT ON COLUMN admin_logs.action IS '操作类型: create, update, delete, bulk_delete, bulk_update, export';
COMMENT ON COLUMN admin_logs.resource_type IS '资源类型: products, posts, inquiries, solutions, site_config';
COMMENT ON COLUMN admin_logs.resource_id IS '资源ID（批量操作时为NULL）';
COMMENT ON COLUMN admin_logs.details IS '操作详情（JSON格式，包含批量操作的ID数组等）';
COMMENT ON COLUMN admin_logs.ip_address IS '请求IP地址';
COMMENT ON COLUMN admin_logs.user_agent IS '用户代理（浏览器标识）';

-- 3. 启用行级安全 (RLS)
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- 4. 创建策略 - 只有管理员可以查看日志
DROP POLICY IF EXISTS "Admins can view admin_logs" ON admin_logs;
CREATE POLICY "Admins can view admin_logs" ON admin_logs 
FOR SELECT TO authenticated 
USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 5. 创建策略 - 系统可以插入日志（通过 service role）
DROP POLICY IF EXISTS "System can insert admin_logs" ON admin_logs;
CREATE POLICY "System can insert admin_logs" ON admin_logs 
FOR INSERT 
WITH CHECK (true);

-- 6. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_admin_logs_user_id 
ON admin_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_admin_logs_resource_type 
ON admin_logs(resource_type);

CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at 
ON admin_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_logs_action 
ON admin_logs(action);

-- 7. 创建复合索引用于常见查询
CREATE INDEX IF NOT EXISTS idx_admin_logs_type_date 
ON admin_logs(resource_type, created_at DESC);

-- ========================================
-- 验证安装
-- ========================================
-- 执行以下查询验证表是否创建成功

-- 查看表结构
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'admin_logs';

-- 查看索引
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'admin_logs';

-- 查看策略
-- SELECT policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'admin_logs';

-- ========================================
-- 完成
-- ========================================
-- 表创建完成！现在可以使用后台管理功能了。
