-- 修复 posts 表的 SQL 脚本
-- 请在 Supabase Dashboard > SQL Editor 中执行此脚本

-- 1. 删除现有的 posts 表（如果存在且有问题）
-- 注意：这会删除所有现有数据！如有重要数据请先备份
DROP TABLE IF EXISTS posts CASCADE;

-- 2. 重新创建 posts 表
CREATE TABLE posts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    slug TEXT UNIQUE NOT NULL,
    title JSONB NOT NULL,
    summary JSONB,
    content JSONB NOT NULL,
    cover_image TEXT,
    tags TEXT[],
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 启用 RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 4. 创建策略
-- 公开可以查看已发布的文章
DROP POLICY IF EXISTS "Public can view published posts" ON posts;
CREATE POLICY "Public can view published posts" ON posts 
    FOR SELECT 
    USING (published_at <= NOW());

-- 管理员拥有完全访问权限
DROP POLICY IF EXISTS "Admins have full access to posts" ON posts;
CREATE POLICY "Admins have full access to posts" ON posts 
    FOR ALL 
    TO authenticated 
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

-- 5. 插入测试数据（可选）
INSERT INTO posts (slug, title, summary, content, published_at) VALUES
(
    'welcome-to-nexus',
    '{"hk": "歡迎來到 NEXUS", "cn": "欢迎来到 NEXUS", "en": "Welcome to NEXUS"}',
    '{"hk": "探索AI算力基礎設施的未來", "cn": "探索AI算力基础设施的未来", "en": "Explore the Future of AI Computing Infrastructure"}',
    '{"hk": "# 歡迎\n\n這是我們的第一篇文章。", "cn": "# 欢迎\n\n这是我们的第一篇文章。", "en": "# Welcome\n\nThis is our first post."}',
    NOW()
);

-- 完成！
SELECT 'Posts table fixed successfully!' AS status;
