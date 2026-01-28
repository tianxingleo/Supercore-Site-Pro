-- 批量更新产品数据，添加 name, description, specs 等字段
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 首先检查并更新 BC120G3
UPDATE products 
SET 
  name = '{"cn": "BC120G3 双路通用服务器", "hk": "BC120G3 雙路通用服務器", "en": "BC120G3 Dual-Socket General Server"}'::jsonb,
  description = '{"cn": "双路第三代Intel® Xeon®可扩展处理器通用服务器，支持高性能计算和虚拟化应用", "hk": "雙路第三代Intel® Xeon®可擴展處理器通用服務器，支持高性能計算和虛擬化應用", "en": "Dual-socket 3rd Gen Intel® Xeon® Scalable general server for high-performance computing and virtualization"}'::jsonb,
  specs = '{"cpu": "双路 Intel® Xeon® 第三代可扩展处理器", "rackUnits": "2U"}'::jsonb,
  category = 'hpc'
WHERE slug = 'bc120g3';

-- 2. 更新 BC120G3-H
UPDATE products 
SET 
  name = '{"cn": "BC120G3-H 高性能计算服务器", "hk": "BC120G3-H 高性能計算服務器", "en": "BC120G3-H High-Performance Computing Server"}'::jsonb,
  description = '{"cn": "搭载双路第三代Intel® Xeon® Scalable处理器，专为AI训练和科学计算等高性能计算场景设计", "hk": "搭載雙路第三代Intel® Xeon® Scalable處理器，專為AI訓練和科學計算等高性能計算場景設計", "en": "Powered by dual-socket 3rd Gen Intel® Xeon® Scalable processors, designed for HPC scenarios like AI training and scientific computing"}'::jsonb,
  specs = '{"cpu": "双路 Intel® Xeon® 第三代可扩展处理器", "rackUnits": "2U"}'::jsonb,
  category = 'hpc'
WHERE slug = 'bc120g3-h';

-- 3. 更新 BC220G3
UPDATE products 
SET 
  name = '{"cn": "BC220G3 通用计算服务器", "hk": "BC220G3 通用計算服務器", "en": "BC220G3 General Compute Server"}'::jsonb,
  description = '{"cn": "2U通用计算型服务器，搭载第3代Intel Xeon Scalable处理器，支持高达4TB内存", "hk": "2U通用計算型服務器，搭載第3代Intel Xeon Scalable處理器，支持高達4TB內存", "en": "2U general-purpose compute server with 3rd Gen Intel Xeon Scalable processors, supports up to 4TB memory"}'::jsonb,
  specs = '{"cpu": "双路 Intel® Xeon® 第三代可扩展处理器", "rackUnits": "2U"}'::jsonb,
  category = 'hpc'
WHERE slug = 'bc220g3';

-- 4. 更新 BC220G3-H
UPDATE products 
SET 
  name = '{"cn": "BC220G3-H 高性能计算服务器", "hk": "BC220G3-H 高性能計算服務器", "en": "BC220G3-H High-Performance Computing Server"}'::jsonb,
  description = '{"cn": "2U高性能计算服务器，搭载双路第三代Intel® Xeon® Scalable处理器，支持Intel® Optane™持久内存", "hk": "2U高性能計算服務器，搭載雙路第三代Intel® Xeon® Scalable處理器，支持Intel® Optane™持久內存", "en": "2U HPC server with dual-socket 3rd Gen Intel® Xeon® Scalable processors, supports Intel® Optane™ persistent memory"}'::jsonb,
  specs = '{"cpu": "双路 Intel® Xeon® 第三代可扩展处理器", "rackUnits": "2U"}'::jsonb,
  category = 'hpc'
WHERE slug = 'bc220g3-h';

-- 5. 更新 BC220G3-S
UPDATE products 
SET 
  name = '{"cn": "BC220G3-S 存储服务器", "hk": "BC220G3-S 存儲服務器", "en": "BC220G3-S Storage Server"}'::jsonb,
  description = '{"cn": "2U存储型服务器，支持SAS/SATA/NVMe多种存储选项，适合数据密集型应用", "hk": "2U存儲型服務器，支持SAS/SATA/NVMe多種存儲選項，適合數據密集型應用", "en": "2U storage server with SAS/SATA/NVMe options, suitable for data-intensive applications"}'::jsonb,
  specs = '{"cpu": "双路 Intel® Xeon® 第三代可扩展处理器", "rackUnits": "2U"}'::jsonb,
  category = 'storage'
WHERE slug = 'bc220g3-s';

-- 6. 更新 BS450G3
UPDATE products 
SET 
  name = '{"cn": "BS450G3 高密度存储服务器", "hk": "BS450G3 高密度存儲服務器", "en": "BS450G3 High-Density Storage Server"}'::jsonb,
  description = '{"cn": "4U通用存储型服务器，配置双插槽第三代Intel® Xeon® Scalable处理器；支持16个ECC DDR4-3200内存插槽，36个热插拔SAS3/SATA3硬盘槽", "hk": "4U通用存儲型服務器，配置雙插槽第三代Intel® Xeon® Scalable處理器；支持16個ECC DDR4-3200內存插槽，36個熱插拔SAS3/SATA3硬盤槽", "en": "4U general-purpose storage server with dual-socket 3rd Gen Intel® Xeon® Scalable processors; supports 16 ECC DDR4-3200 memory slots and 36 hot-swap SAS3/SATA3 drive bays"}'::jsonb,
  specs = '{"cpu": "双路 Intel® Xeon® 第三代可扩展处理器", "rackUnits": "4U", "memory": "支持16个ECC DDR4-3200内存插槽", "storage": "36个热插拔SAS3/SATA3硬盘槽"}'::jsonb,
  category = 'storage',
  is_featured = true
WHERE slug = 'bs450g3';

-- 7. 更新 BS450G3-S
UPDATE products 
SET 
  name = '{"cn": "BS450G3-S 高密度存储服务器", "hk": "BS450G3-S 高密度存儲服務器", "en": "BS450G3-S High-Density Storage Server"}'::jsonb,
  description = '{"cn": "4U通用存储型服务器，配置双插槽第三代Intel® Xeon® Scalable处理器；支持16个ECC DDR4-3200内存插槽和2个Intel® Optane™持久内存专用插槽；36个热插拔SAS3/SATA3硬盘槽", "hk": "4U通用存儲型服務器，配置雙插槽第三代Intel® Xeon® Scalable處理器；支持16個ECC DDR4-3200內存插槽和2個Intel® Optane™持久內存專用插槽；36個熱插拔SAS3/SATA3硬盤槽", "en": "4U general-purpose storage server with dual-socket 3rd Gen Intel® Xeon® Scalable processors; supports 16 ECC DDR4-3200 memory slots, 2 Intel® Optane™ PMem slots, and 36 hot-swap SAS3/SATA3 drive bays"}'::jsonb,
  specs = '{"cpu": "双路 Intel® Xeon® 第三代可扩展处理器", "rackUnits": "4U", "memory": "支持16个ECC DDR4-3200内存插槽", "storage": "36个热插拔SAS3/SATA3硬盘槽"}'::jsonb,
  category = 'storage'
WHERE slug = 'bs450g3-s';

-- 8. 更新 BS450G3-H
UPDATE products 
SET 
  name = '{"cn": "BS450G3-H 高性能存储服务器", "hk": "BS450G3-H 高性能存儲服務器", "en": "BS450G3-H High-Performance Storage Server"}'::jsonb,
  description = '{"cn": "4U高性能存储型服务器，配置双插槽第三代Intel® Xeon® Scalable处理器；配备最多32个DIMM插槽，支持大容量NVMe存储", "hk": "4U高性能存儲型服務器，配置雙插槽第三代Intel® Xeon® Scalable處理器；配備最多32個DIMM插槽，支持大容量NVMe存儲", "en": "4U high-performance storage server with dual-socket 3rd Gen Intel® Xeon® Scalable processors; equipped with up to 32 DIMM slots, supports large capacity NVMe storage"}'::jsonb,
  specs = '{"cpu": "双路 Intel® Xeon® 第三代可扩展处理器", "rackUnits": "4U", "memory": "最多32个DIMM插槽", "storage": "支持NVMe存储"}'::jsonb,
  category = 'storage-hp',
  is_featured = true
WHERE slug = 'bs450g3-h';

-- 9. 更新 BS270G3
UPDATE products 
SET 
  name = '{"cn": "BS270G3 高性能存储服务器", "hk": "BS270G3 高性能存儲服務器", "en": "BS270G3 High-Performance Storage Server"}'::jsonb,
  description = '{"cn": "2U高性能存储型服务器，搭载第三代英特尔至强可扩展处理器与3200MHz ECC DDR4内存，最大可扩展至8TB的内存容量", "hk": "2U高性能存儲型服務器，搭載第三代英特爾至強可擴展處理器與3200MHz ECC DDR4內存，最大可擴展至8TB的內存容量", "en": "2U high-performance storage server with 3rd Gen Intel Xeon Scalable processors and 3200MHz ECC DDR4 memory, expandable up to 8TB"}'::jsonb,
  specs = '{"cpu": "双路 Intel® Xeon® 第三代可扩展处理器", "rackUnits": "2U", "memory": "最多32个DIMM插槽，最高8TB内存", "storage": "24个热插拔NVMe/SATA/SAS驱动器槽"}'::jsonb,
  category = 'storage-hp',
  is_featured = true
WHERE slug = 'bs270g3';

-- 10. 更新 BC440G3-P
UPDATE products 
SET 
  name = '{"cn": "BC440G3-P 通用服务器", "hk": "BC440G3-P 通用服務器", "en": "BC440G3-P General Server"}'::jsonb,
  description = '{"cn": "双路第三代Intel® Xeon® Scalable处理器通用服务器，适用于多种企业应用、数据库管理、虚拟化等应用场景", "hk": "雙路第三代Intel® Xeon® Scalable處理器通用服務器，適用於多種企業應用、數據庫管理、虛擬化等應用場景", "en": "Dual-socket 3rd Gen Intel® Xeon® Scalable general server for various enterprise applications, database management, and virtualization"}'::jsonb,
  specs = '{"cpu": "双路 Intel® Xeon® 第三代可扩展处理器", "rackUnits": "4U"}'::jsonb,
  category = 'hpc',
  is_featured = true
WHERE slug = 'bc440g3-p';

-- 11. 更新 BC440G3-N
UPDATE products 
SET 
  name = '{"cn": "BC440G3-N 通用服务器", "hk": "BC440G3-N 通用服務器", "en": "BC440G3-N General Server"}'::jsonb,
  description = '{"cn": "双路第三代Intel® Xeon® Scalable处理器通用服务器，支持多种PCIe扩展卡，适用于高性能计算和虚拟化场景", "hk": "雙路第三代Intel® Xeon® Scalable處理器通用服務器，支持多種PCIe擴展卡，適用於高性能計算和虛擬化場景", "en": "Dual-socket 3rd Gen Intel® Xeon® Scalable general server with multiple PCIe expansion card support, suitable for HPC and virtualization"}'::jsonb,
  specs = '{"cpu": "双路 Intel® Xeon® 第三代可扩展处理器", "rackUnits": "4U"}'::jsonb,
  category = 'hpc',
  is_featured = true
WHERE slug = 'bc440g3-n';

-- 12. 更新 BC440G3-T
UPDATE products 
SET 
  name = '{"cn": "BC440G3-T 通用服务器", "hk": "BC440G3-T 通用服務器", "en": "BC440G3-T General Server"}'::jsonb,
  description = '{"cn": "双路第三代Intel® Xeon® Scalable处理器通用服务器，支持热插拔存储和高速网络，适合数据中心部署", "hk": "雙路第三代Intel® Xeon® Scalable處理器通用服務器，支持熱插拔存儲和高速網絡，適合數據中心部署", "en": "Dual-socket 3rd Gen Intel® Xeon® Scalable general server with hot-swap storage and high-speed networking, suitable for data center deployment"}'::jsonb,
  specs = '{"cpu": "双路 Intel® Xeon® 第三代可扩展处理器", "rackUnits": "4U"}'::jsonb,
  category = 'hpc',
  is_featured = true
WHERE slug = 'bc440g3-t';

-- 13. 更新 BC445G3-P
UPDATE products 
SET 
  name = '{"cn": "BC445G3-P 存储服务器", "hk": "BC445G3-P 存儲服務器", "en": "BC445G3-P Storage Server"}'::jsonb,
  description = '{"cn": "4U存储型服务器，支持大容量热插拔硬盘，适合大规模数据存储和备份场景", "hk": "4U存儲型服務器，支持大容量熱插拔硬盤，適合大規模數據存儲和備份場景", "en": "4U storage server supporting large capacity hot-swap drives, suitable for large-scale data storage and backup scenarios"}'::jsonb,
  specs = '{"cpu": "双路 Intel® Xeon® 第三代可扩展处理器", "rackUnits": "4U"}'::jsonb,
  category = 'storage',
  is_featured = true
WHERE slug = 'bc445g3-p';

-- 14. 更新 BC445G3-N
UPDATE products 
SET 
  name = '{"cn": "BC445G3-N 存储服务器", "hk": "BC445G3-N 存儲服務器", "en": "BC445G3-N Storage Server"}'::jsonb,
  description = '{"cn": "4U存储型服务器，支持多种存储接口和RAID配置，适合企业级数据存储需求", "hk": "4U存儲型服務器，支持多種存儲接口和RAID配置，適合企業級數據存儲需求", "en": "4U storage server with multiple storage interfaces and RAID configurations, suitable for enterprise data storage needs"}'::jsonb,
  specs = '{"cpu": "双路 Intel® Xeon® 第三代可扩展处理器", "rackUnits": "4U"}'::jsonb,
  category = 'storage',
  is_featured = true
WHERE slug = 'bc445g3-n';

-- 验证更新
SELECT slug, name->>'cn' as name_cn, name->>'hk' as name_hk, category, is_featured 
FROM products 
WHERE status = 'published'
ORDER BY created_at DESC;
