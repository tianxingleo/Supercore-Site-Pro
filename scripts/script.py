import os
import asyncio
import re
from urllib.parse import urljoin, urlparse
from playwright.async_api import async_playwright

# --- 配置区 ---
START_URL = "https://www.boer.cn"
DOMAIN = urlparse(START_URL).netloc
SAVE_DIR = "boer_deep_mirror"
# 关键修改：将深度增加到 5，确保能深入到产品详情页
MAX_DEPTH = 5

# 用于记录已访问的页面（标准化后的 URL）
visited_keys = set()

def get_url_key(url):
    """
    生成标准化的 URL key，用于去重。
    忽略 http/https 差异，忽略末尾斜杠
    """
    parsed = urlparse(url)
    # 去掉 scheme (http/https)，只保留 netloc 和 path
    # 比如 https://www.boer.cn/ 和 http://www.boer.cn 都会变成 www.boer.cn
    clean_path = parsed.path.rstrip('/')
    return f"{parsed.netloc}{clean_path}"

def get_safe_dir_name(url):
    """生成安全的文件夹名"""
    parsed = urlparse(url)
    path = parsed.path.strip('/')
    if not path:
        path = "home"
    # 将 productinfo/123.html 变成 productinfo_123_html
    safe_name = re.sub(r'[\\/:*?"<>|]', '_', path)
    # 限制文件名长度，防止 Windows 报错
    return safe_name[:100]

async def crawl(browser_context, url, depth=0):
    # 1. 预检查
    if not url.startswith('http'):
        return

    # 检查域名是否跑偏
    if DOMAIN not in urlparse(url).netloc:
        return

    # 2. 智能去重检查
    url_key = get_url_key(url)
    if url_key in visited_keys:
        return

    # 如果深度超标，且不是我们特别想要的产品页，则停止
    # (这里做了一个小优化：如果是 productinfo 页面，即使稍微深一点也允许爬)
    if depth > MAX_DEPTH:
        return

    visited_keys.add(url_key)

    # 3. 准备文件夹
    page_folder_name = get_safe_dir_name(url)
    page_dir = os.path.join(SAVE_DIR, page_folder_name)
    media_dir = os.path.join(page_dir, "media")
    os.makedirs(media_dir, exist_ok=True)

    page = await browser_context.new_page()

    # 4. 媒体拦截器
    async def save_page_resource(response):
        try:
            res_url = response.url
            # 只下载图片
            if response.status == 200 and any(res_url.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']):
                filename = os.path.basename(urlparse(res_url).path)
                if not filename: filename = f"res_{hash(res_url)}.png"

                local_path = os.path.join(media_dir, filename)
                # 简单去重：如果文件已存在且大小不为0，跳过
                if not (os.path.exists(local_path) and os.path.getsize(local_path) > 0):
                    content = await response.body()
                    with open(local_path, "wb") as f:
                        f.write(content)
        except:
            pass

    page.on("response", save_page_resource)

    try:
        print(f"[{depth}] 正在爬取: {url}")

        # 访问页面，超时设为 45秒
        await page.goto(url, wait_until="domcontentloaded", timeout=45000)

        # 稍微等待 JS 执行，如果页面有特定懒加载逻辑，可以在这里加
        await asyncio.sleep(1)

        # 保存 HTML
        html_path = os.path.join(page_dir, "index.html")
        content = await page.content()
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(content)

        # 5. 提取链接并递归
        # 只有当没达到最大深度时，才去解析子链接，节省资源
        if depth < MAX_DEPTH:
            links = await page.eval_on_selector_all("a", "elements => elements.map(e => e.href)")
            await page.close() # 先关闭当前页，释放内存，再进行递归

            for link in links:
                # 去除锚点
                clean_link = link.split('#')[0]
                # 递归调用
                await crawl(browser_context, clean_link, depth + 1)
        else:
            await page.close()

    except Exception as e:
        print(f"  [X] 失败 {url}: {e}")
        if not page.is_closed():
            await page.close()

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )

        print(f"开始爬取，最大深度: {MAX_DEPTH}...")
        await crawl(context, START_URL)

        await browser.close()
        print(f"\n任务完成！请查看文件夹: {SAVE_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
