-- 修复数据库表中缺失的 updated_at 列
-- 请在 Supabase Dashboard > SQL Editor 中执行此脚本

-- 1. 修复 products 表
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. 修复 inquiries 表
ALTER TABLE inquiries 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. 修复 solutions 表（如果已存在）
DO $$ 
BEGIN 
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'solutions') THEN
        ALTER TABLE solutions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- 更新现有记录的 updated_at 值为 created_at（如果为空）
UPDATE products SET updated_at = created_at WHERE updated_at IS NULL;
UPDATE inquiries SET updated_at = created_at WHERE updated_at IS NULL;

-- 完成提示
SELECT 'Database schema fixed successfully! updated_at columns added where missing.' AS status;
