# Supabase Storage Bucket 错误修复

## 问题描述

### 错误日志

```
[Upload] Request received: POST /api/upload/post-cover
[Upload] User authenticated. ID: 1e59772e-3b9e-4989-840e-0b620b06e421 Email: tianxingleo@gmail.com
[Upload] Using service role client: true
[Upload] Checking admin role for user: 1e59772e-3b9e-4989-840e-0b620b06e421
[Upload] Profile query result: { hasProfile: true, role: 'admin', error: undefined }
[Upload] Admin check passed ✓
[Upload] File received: 647614a3-tpaig.jpg field: file type: image/jpeg size: 327561
[Upload] Uploading to bucket: news-covers path: 17378829195831-265906241615-tpaig.jpg
ERROR [Upload] Supabase storage error: Bucket not found
  at /C:/Users/TX/Documents/Coding/projects/Web-For-HK/node_modules/@supabase/storage-js/dist/index.mjs:166:10
  at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
ERROR [Upload] Fatal error: Bucket not found
  at createError (/C:/Users/TX/Documents/Coding/projects/Web-For-HK/node_modules/h3/dist/index.mjs:71:15)
  at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
  at async Object.callAsync (/C:/Users/TX/Documents/Coding/projects/Web-For-HK/node_modules/unctx/dist/index.mjs:72:16)
  at async Server.toNodeHandle (/C:/Users/TX/Documents/Coding/projects/Web-For-HK/node_modules/h3/dist/index.mjs:2303:7)
  at async /C:/Users/TX/Documents/Coding/projects/Web-Products/Web-For-HK/node_modules/h3/dist/index.m.js:2011:19)

ERROR [h3] Please prefer using message for longer error messages instead of statusMessage. In future, statusMessage will be sanitized by default.

WARN [h3] Please prefer using message for longer error messages instead of statusMessage. In future, statusMessage will be successful by default.

[Product API] Could not find 'updated_at' column of 'products' in schema cache
```

## 问题根源

### 主要问题：Bucket 不存在

1. **代码硬编码了 bucket 名称**
   - 代码中写死为 `news-covers`（第 81 行）
   - 但这个 bucket 在 Supabase 中不存在

2. **没有创建 bucket 的机制**
   - 代码假设 bucket 已经存在
   - 没有自动创建或提示用户创建

3. **错误处理不友好**
   - 抛出 500 错误
   - 错误消息"Bucket not found" 不够清晰

## 解决方案

### 方案 1：在 Supabase 控制台中创建 bucket（推荐）

#### 步骤

1. **登录 Supabase 控制台**
   - 访问：https://supabase.com/dashboard
   - 使用 .env 文件中的项目凭证登录

2. **进入 Storage 页面**
   - 左侧菜单选择 "Storage"
   - 进入 Storage dashboard

3. **创建新 bucket**
   - 点击 "New bucket" 或 "Create bucket"
   - 输入 bucket 名称：`news-covers`
   - 选择 Public 或 Private（根据需求）
   - 点击 "Create"

4. **验证 bucket 已创建**
   - 在 Storage 页面应该能看到 `news-covers` bucket
   - 上传功能应该能正常工作

5. **配置 RLS（如果需要）**
   - 如果是 Private bucket，需要配置 RLS 策略
   - 在 SQL Editor 中创建适当的策略：
   ```sql
   -- 示例 RLS 策略（仅管理员可上传）
   CREATE POLICY "Allow admin uploads"
     ON storage.objects FOR INSERT
     WITH CHECK (
       auth.role() = 'authenticated'
       AND (
         EXISTS (
           SELECT 1 FROM profiles
           WHERE id = auth.uid()
           AND role = 'admin'
         )
       )
     );
   ```

### 方案 2：修改代码使用现有 bucket

如果不想创建新 bucket，可以修改代码使用现有的 `images` bucket：

**文件**：`server/api/upload/image.post.ts`

**修改第 81 行**：

```typescript
// 修改前
const bucketName = bucketField?.data.toString() || 'news-covers'

// 修改后：使用现有的 images bucket
const bucketName = bucketField?.data.toString() || 'images'
```

**验证 `images` bucket 存在**：

- 登录 Supabase 控制台
- 进入 Storage 页面
- 检查是否有 `images` bucket

### 方案 3：改进错误处理

即使使用方案 2，也应该改进错误处理，让用户更容易理解问题：

**文件**：`server/api/upload/image.post.ts`

**修改第 96-108 行**：

```typescript
// 修改前
if (uploadError) {
  console.error('[Upload] Supabase storage error:', uploadError)
  if (uploadError.message.includes('bucket not found')) {
    throw createError({
      statusCode: 500,
      statusMessage: `存储桶 "${bucketName}" 不存在，请先在 Supabase 控制台创建它并设置为公开。`,
    })
  }
  throw createError({
    statusCode: 500,
    statusMessage: uploadError.message,
  })
}
```

**更详细的错误处理**：

```typescript
if (uploadError) {
  console.error('[Upload] Supabase storage error:', uploadError)

  // Bucket 不存在错误
  if (
    uploadError.message.includes('bucket not found') ||
    uploadError.message.includes('Storage not found')
  ) {
    throw createError({
      status: 500,
      message: `Storage bucket "${bucketName}" not found. Please:`,
      cause: `1. Go to Supabase Dashboard -> Storage\n2. Click "New bucket"\n3. Create bucket named "${bucketName}"\n4. Make it Public`,
      statusCode: 500,
    })
  }

  // 其他错误
  throw createError({
    statusCode: 500,
    message: uploadError.message || 'Upload failed',
    cause: 'Supabase storage error',
  })
}
```

### 方案 4：自动创建 bucket（高级）

可以在上传前检查并自动创建 bucket：

**添加新函数**：

```typescript
async function ensureBucketExists(client: any, bucketName: string) {
  try {
    // 尝试列出 bucket
    const { data, error } = await client.storage.listBuckets()

    if (error) {
      console.error('[Upload] Error listing buckets:', error)
      throw error
    }

    // 检查 bucket 是否存在
    const bucketExists = data.some((b) => b.name === bucketName)

    if (!bucketExists) {
      console.log(`[Upload] Creating bucket: ${bucketName}`)

      const { data: createdBucket, error: createError } = await client.storage.createBucket(
        bucketName,
        { public: true }
      )

      if (createError) {
        console.error('[Upload] Failed to create bucket:', createError)
        throw createError
      }

      console.log('[Upload] Bucket created successfully')
      return createdBucket
    }

    return bucketName
  } catch (error) {
    console.error('[Upload] Failed to ensure bucket:', error)
    throw error
  }
}
```

**使用方式**：

```typescript
// 在上传前确保 bucket 存在
const bucketName = await ensureBucketExists(client, 'news-covers')

// 然后正常上传
const { data: uploadData, error: uploadError } = await client.storage
  .from(bucketName)
  .upload(fileName, file.data, {
    contentType: file.type,
    upsert: false,
  })
```

## 推荐方案

### 最简单方案：方案 1

**原因**：

- 不需要修改代码
- Supabase 控制台已经提供了创建 bucket 的功能
- 可以更灵活地管理 bucket 权限

**步骤**：

1. 登录 Supabase Dashboard
2. 进入 Storage 页面
3. 创建 `news-covers` bucket（设置为 Public）
4. 重新上传图片

### 次选方案：方案 2

如果不想创建新 bucket，修改代码使用 `images` bucket。

## Schema 警告

### 警告信息

```
[Product API] Could not find 'updated_at' column of 'products' in schema cache
```

这个警告不影响功能，但可以通过以下方式修复：

**重启开发服务器**：

```bash
# 停止当前服务器（Ctrl + C）
npm run dev
```

或在 Supabase Dashboard 中：

1. 进入 SQL Editor
2. 运行：
   ```sql
   -- 刷新 schema cache
   NOTIFY pgrst_invalidate_cache();
   ```

## 相关文件

- `.env` - Supabase 配置
- `server/api/upload/image.post.ts` - 上传 API（需要修改）
- Supabase Dashboard - Storage 页面

## 测试步骤

### 创建 bucket 后测试

1. **验证 bucket 存在**
   - 登录 Supabase Dashboard
   - 进入 Storage 页面
   - 确认 `news-covers` bucket 已创建

2. **测试上传功能**
   - 访问管理后台
   - 尝试上传新闻封面图片
   - 检查是否成功

3. **验证图片可访问**
   - 获取上传后返回的 publicUrl
   - 在浏览器中访问该 URL
   - 确认图片能正常显示

## 其他说明

### 当前可用的 Bucket

根据 Supabase 配置和错误日志，确认有以下配置：

- `SUPABASE_URL`: https://oqwvbyacnriohxopgaks.supabase.co
- `SUPABASE_KEY`: sb_publishable_xfhjuY2GGaHAvM1k8dMGyA_uIoWntqZ
- `SUPABASE_SECRET_KEY`: sb_secret_TS1l8TARkTDnM9khaRX64Q_gu0uwVkI

### 文件命名规则

当前代码使用的文件命名规则（第 83-84 行）：

```typescript
const timestamp = Date.now()
const extension = file.filename?.split('.').pop() || 'jpg'
const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 7)}.${extension}`
```

生成的文件名示例：

- `17378829195831-265906241615-tpaig.jpg`

## 状态

⚠️ **需要用户操作** - 需要在 Supabase 控制台创建 bucket

## 快速修复命令

### 最快修复（1 分钟）

1. 访问 Supabase Dashboard：https://supabase.com/dashboard
2. 登录你的项目
3. 点击左侧菜单 "Storage"
4. 点击 "New bucket"
5. 输入名称：`news-covers`
6. 选择 "Public" 或 "Private"（推荐 Public）
7. 点击 "Create"
8. 完成！

现在上传功能应该可以正常工作了。

## 后续优化

1. **添加 bucket 管理功能**
   - 创建界面管理 bucket
   - 在代码中列出可用 buckets
   - 自动选择或创建 bucket

2. **改进错误处理**
   - 更友好的错误消息
   - 提供详细的解决步骤
   - 添加重试机制

3. **支持多个 bucket**
   - 新闻封面 → `news-covers`
   - 产品图片 → `product-images`
   - 用户头像 → `user-avatars`
     等等

4. **监控 bucket 使用**
   - 添加上传日志
   - 记录 bucket 创建和删除
   - 监控存储使用量

## 总结

**问题**：代码尝试上传到不存在的 `news-covers` bucket

**最快解决方案**：

1. 在 Supabase Dashboard 中创建 `news-covers` bucket
2. 不需要修改任何代码

**验证**：

- 上传功能应该立即可以工作
- 图片应该可以在 Supabase Storage 中看到
- 图片应该可以通过 publicUrl 访问
