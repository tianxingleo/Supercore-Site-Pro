/**
 * 从博迩官网下载所有官方产品图片
 * 严格按照官网产品分类和型号
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 官网产品图片URL（严格按照官网）
const OFFICIAL_PRODUCTS = {
  // ========== 通用计算 (5个产品) ==========
  'bc120g3': {
    url: 'https://img.wanwang.xin/contents/sitefiles2067/10336457/images/50829785.png',
    name: 'BC120G3',
    category: '通用计算',
    desc: '1U通用计算型服务器'
  },
  'bc120g3-h': {
    url: 'https://img.wanwang.xin/contents/sitefiles2067/10336457/images/50634496.png',
    name: 'BC120G3-H',
    category: '通用计算',
    desc: '1U通用计算型服务器'
  },
  'bc220g3': {
    url: 'https://img.wanwang.xin/contents/sitefiles2067/10336457/images/50689845.png',
    name: 'BC220G3',
    category: '通用计算',
    desc: '2U通用计算型服务器'
  },
  'bc220g3-h': {
    url: 'https://img.wanwang.xin/contents/sitefiles2067/10336457/images/50634872.png',
    name: 'BC220G3-H',
    category: '通用计算',
    desc: '2U通用计算型服务器'
  },
  'bc220g3-s': {
    url: 'https://img.wanwang.xin/contents/sitefiles2067/10336457/images/50692852.png',
    name: 'BC220G3-S',
    category: '通用计算',
    desc: '2U通用计算型服务器'
  },

  // ========== 通用存储 (3个产品) ==========
  'bs450g3': {
    url: 'https://img.wanwang.xin/contents/sitefiles2067/10336457/images/50741641.png',
    name: 'BS450G3',
    category: '通用存储',
    desc: '4U通用存储型服务器'
  },
  'bs450g3-s': {
    url: 'https://img.wanwang.xin/contents/sitefiles2067/10336457/images/50641566.png',
    name: 'BS450G3-S',
    category: '通用存储',
    desc: '4U通用存储型服务器'
  },
  'bs450g3-h': {
    url: 'https://img.wanwang.xin/contents/sitefiles2067/10336457/images/50641561.png',
    name: 'BS450G3-H',
    category: '通用存储',
    desc: '4U通用存储型服务器'
  },

  // ========== 高性能计算 (5个产品) ==========
  'bc440g3-p': {
    url: 'https://img.wanwang.xin/contents/sitefiles2067/10336457/images/50705599.png',
    name: 'BC440G3-P',
    category: '高性能计算',
    desc: '4U高性能计算型GPU服务器'
  },
  'bc440g3-n': {
    url: 'https://img.wanwang.xin/contents/sitefiles2067/10336457/images/50711031.png',
    name: 'BC440G3-N',
    category: '高性能计算',
    desc: '4U高性能计算型GPU服务器'
  },
  'bc440g3-t': {
    url: 'https://img.wanwang.xin/contents/sitefiles2067/10336457/images/50714113.png',
    name: 'BC440G3-T',
    category: '高性能计算',
    desc: '4U高性能计算型塔式GPU服务器'
  },
  'bc445g3-p': {
    url: 'https://img.wanwang.xin/contents/sitefiles2067/10336457/images/50737489.png',
    name: 'BC445G3-P',
    category: '高性能计算',
    desc: '4U高性能计算型GPU服务器'
  },
  'bc445g3-n': {
    url: 'https://img.wanwang.xin/contents/sitefiles2067/10336457/images/50640396.png',
    name: 'BC445G3-N',
    category: '高性能计算',
    desc: '4U高性能计算型GPU服务器'
  },

  // ========== 高性能存储 (2个产品) ==========
  'bs270g3': {
    url: 'https://img.wanwang.xin/contents/sitefiles2067/10336457/images/50643888.png',
    name: 'BS270G3',
    category: '高性能存储',
    desc: '2U高性能存储型服务器'
  },
  'bs270g3-d': {
    url: 'https://img.wanwang.xin/contents/sitefiles2067/10336457/images/50642306.png',
    name: 'BS270G3-D',
    category: '高性能存储',
    desc: '2U高性能双节点存储型服务器'
  },
};

// 目标目录
const OUTPUT_DIR = path.join(__dirname, '../../public/images/official-products');

/**
 * 下载单个图片
 */
async function downloadImage(id, product) {
  const filename = `${id}.png`;
  const filepath = path.join(OUTPUT_DIR, filename);

  // 检查文件是否已存在
  if (fs.existsSync(filepath)) {
    const stats = fs.statSync(filepath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`[SKIP] ${product.name} - 已存在 (${sizeKB} KB)`);
    return;
  }

  try {
    console.log(`[DOWNLOAD] ${product.name} (${product.category})`);
    console.log(`  URL: ${product.url}`);

    const response = await axios.get(product.url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.boer.cn/'
      },
      timeout: 30000
    });

    // 检查内容类型
    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.startsWith('image/')) {
      console.log(`  [ERROR] 非图片: ${contentType}`);
      return;
    }

    // 保存文件
    fs.writeFileSync(filepath, response.data);

    const sizeKB = (response.data.length / 1024).toFixed(1);
    console.log(`  [OK] ${sizeKB} KB ✓`);
  } catch (error) {
    console.log(`  [ERROR] ${error.message}`);
  }
}

/**
 * 下载所有产品
 */
async function downloadAllProducts() {
  console.log('='.repeat(70));
  console.log('博迩官网产品图片下载器');
  console.log('='.repeat(70));
  console.log(`\n保存目录: ${OUTPUT_DIR}\n`);

  // 创建输出目录
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`[OK] 创建目录: ${OUTPUT_DIR}\n`);
  }

  let successCount = 0;
  let failCount = 0;

  // 按分类统计
  const categoryStats = {};

  // 下载所有产品
  for (const [id, product] of Object.entries(OFFICIAL_PRODUCTS)) {
    // 统计
    if (!categoryStats[product.category]) {
      categoryStats[product.category] = { count: 0, success: 0 };
    }
    categoryStats[product.category].count++;

    try {
      await downloadImage(id, product);
      successCount++;
      categoryStats[product.category].success++;
    } catch (error) {
      console.log(`[ERROR] 下载失败: ${error.message}`);
      failCount++;
    }
    console.log();

    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // 打印统计
  console.log('='.repeat(70));
  console.log('下载统计');
  console.log('='.repeat(70));

  for (const [category, stats] of Object.entries(categoryStats)) {
    console.log(`\n[${category}]`);
    console.log(`  总数: ${stats.count}`);
    console.log(`  成功: ${stats.success}`);
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log(`总计: ${successCount} 成功, ${failCount} 失败`);
  console.log(`文件保存在: ${OUTPUT_DIR}`);
  console.log('='.repeat(70));
}

// 运行下载
downloadAllProducts().catch(error => {
  console.error('\n[ERROR]', error.message);
  process.exit(1);
});
