-- 将所有现有产品的状态更新为 published
UPDATE products
SET status = 'published'
WHERE status IS NULL OR status = 'draft';

-- 检查是否有产品数据
SELECT COUNT(*) as product_count FROM products;
