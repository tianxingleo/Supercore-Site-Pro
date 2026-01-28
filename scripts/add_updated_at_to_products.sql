-- 为 products 表添加 missing 的 updated_at 列
-- 请在 Supabase Dashboard > SQL Editor 中执行此脚本

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- (可选) 更新现有记录的 updated_at 值为 created_at
UPDATE products 
SET updated_at = created_at 
WHERE updated_at IS NULL;
