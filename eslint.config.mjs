import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const nuxtConfigPath = join(process.cwd(), '.nuxt/eslint.config.mjs');
let config = [];

// 1. 显式定义忽略目录，防止 ESLint 检查自动生成的代码
const ignores = {
  ignores: [
    '.nuxt/**',
    '**/.nuxt/**',
    '0.0.0.0/**',
    'dist/**',
    'node_modules/**',
    'repomix-output.xml'
  ]
};

if (fs.existsSync(nuxtConfigPath)) {
  try {
    const { default: withNuxt } = await import(pathToFileURL(nuxtConfigPath).href);
    // 将 ignores 传入 withNuxt 或合并
    config = withNuxt([ignores]);
  } catch (e) {
    config = [ignores];
  }
} else {
  // 即使没有 Nuxt 配置，也要保证有忽略规则和基本导出
  config = [ignores, {}];
}

export default config;
