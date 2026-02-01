# SUPERCORE TECHNOLOGY LIMITED - API 文档

> 版本: v1.0.0
> 更新时间: 2026-01-30
> 基础URL: `https://www.supercore.hk/api`

---

## 📋 目录

- [API概览](#api概览)
- [认证说明](#认证说明)
- [通用规范](#通用规范)
- [Products API](#products-api)
- [News API](#news-api)
- [Inquiries API](#inquiries-api)
- [Admin API](#admin-api)
- [Upload API](#upload-api)
- [Solutions API](#solutions-api)
- [Stats API](#stats-api)
- [System API](#system-api)
- [错误处理](#错误处理)
- [数据模型](#数据模型)

---

## API概览

### 基础信息

- **基础URL**: `https://www.supercore.hk/api`
- **API版本**: v1.0.0
- **响应格式**: JSON
- **字符编码**: UTF-8

### API端点分类

| 模块 | 端点数量 | 认证要求 |
|------|---------|----------|
| Products | 9 | 部分需要 |
| News | 9 | 部分需要 |
| Inquiries | 6 | 部分需要 |
| Admin | 3 | 需要认证 |
| Upload | 1 | 需要认证 |
| Solutions | 1 | 无需认证 |
| Stats | 1 | 需要认证 |
| System | 2 | 无需认证 |
| **总计** | **32** | - |

---

## 认证说明

### 认证方式

本项目使用 **Supabase Auth** 进行身份验证。

### 认证流程

#### 1. 获取认证Token

**端点**: `https://oqwvbyacnriohxopgaks.supabase.co/auth/v1/token?grant_type=password`

**方法**: POST

**请求头**:
```
Content-Type: application/json
```

**请求体**:
```json
{
  "email": "admin@example.com",
  "password": "your_password"
}
```

**响应**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "your-refresh-token",
  "user": {
    "id": "user-id",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### 2. 使用Token访问API

**请求头**:
```
Authorization: Bearer <access_token>
apikey: <your_supabase_key>
```

### 权限说明

#### 公开端点（无需认证）
- `/api/products/public` - 公开产品列表
- `/api/products/:slug` - 产品详情
- `/api/news/public` - 公开新闻列表
- `/api/news/:slug` - 新闻详情
- `/api/inquiries` - 提交询盘
- `/api/solutions` - 解决方案列表
- `/api/system/ping` - 系统状态检查

#### 管理员端点（需要认证）
- `/api/products` - 产品管理
- `/api/products/admin/*` - 产品管理
- `/api/news` - 新闻管理
- `/api/news/admin/*` - 新闻管理
- `/api/inquiries/admin/*` - 询盘管理
- `/api/admin/*` - 管理员功能
- `/api/upload/*` - 文件上传
- `/api/stats` - 统计数据

---

## 通用规范

### 请求格式

#### 成功响应
```json
{
  "success": true,
  "data": { ... }
}
```

#### 错误响应
```json
{
  "success": false,
  "error": {
    "message": "错误描述",
    "code": "ERROR_CODE",
    "details": { }
  }
}
```

### HTTP状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 分页参数

```
?page=1&limit=20
```

- `page`: 页码（默认: 1）
- `limit`: 每页数量（默认: 20）

### 分页响应

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## Products API

### 1. 获取公开产品列表

**端点**: `/api/products/public`

**方法**: GET

**认证**: 无需认证

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | number | 否 | 限制返回数量，默认全部 |

**请求示例**:
```http
GET /api/products/public?limit=10
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slug": "supercore-g2-server",
      "name": {
        "zh-CN": "SUPERCORE G2 服务器",
        "zh-HK": "SUPERCORE G2 伺服器",
        "en": "SUPERCORE G2 Server"
      },
      "description": {
        "zh-CN": "专为AI训练设计的高性能服务器...",
        "zh-HK": "專為AI訓練設計的高性能伺服器...",
        "en": "High-performance server designed for AI training..."
      },
      "specs": {
        "cpu": "2x AMD EPYC",
        "ram": "2TB",
        "gpu": "8x H100"
      },
      "images": ["/images/server-1.png"],
      "category": "server",
      "is_featured": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 2. 获取产品详情

**端点**: `/api/products/:slug`

**方法**: GET

**认证**: 无需认证

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| slug | string | 是 | 产品slug |

**请求示例**:
```http
GET /api/products/supercore-g2-server
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "supercore-g2-server",
    "name": {...},
    "description": {...},
    "specs": {...},
    "images": [...],
    "category": "server",
    "is_featured": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 3. 获取所有产品（管理员）

**端点**: `/api/products`

**方法**: GET

**认证**: 需要管理员权限

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slug": "supercore-g2-server",
      "name": {...},
      "description": {...},
      "specs": {...},
      "images": [...],
      "category": "server",
      "is_featured": true,
      "status": "published",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 4. 创建产品

**端点**: `/api/products`

**方法**: POST

**认证**: 需要管理员权限

**请求头**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**:
```json
{
  "slug": "supercore-g2-server",
  "name": {
    "zh-CN": "SUPERCORE G2 服务器",
    "zh-HK": "SUPERCORE G2 伺服器",
    "en": "SUPERCORE G2 Server"
  },
  "description": {
    "zh-CN": "专为AI训练设计的高性能服务器",
    "zh-HK": "專為AI訓練設計的高性能伺服器",
    "en": "High-performance server designed for AI training"
  },
  "specs": {
    "cpu": "2x AMD EPYC",
    "ram": "2TB",
    "gpu": "8x H100"
  },
  "images": ["/images/server-1.png"],
  "category": "server",
  "is_featured": true,
  "status": "published"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "supercore-g2-server",
    "name": {...},
    "description": {...},
    "specs": {...},
    "images": [...],
    "category": "server",
    "is_featured": true,
    "status": "published",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 5. 更新产品

**端点**: `/api/products/admin/:id`

**方法**: PUT

**认证**: 需要管理员权限

**请求头**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 产品ID |

**请求体**: 与创建产品相同

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "supercore-g2-server",
    "name": {...},
    "description": {...},
    "specs": {...},
    "images": [...],
    "category": "server",
    "is_featured": true,
    "status": "published",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

---

### 6. 删除产品

**端点**: `/api/products/:id`

**方法**: DELETE

**认证**: 需要管理员权限

**请求头**:
```
Authorization: Bearer <token>
```

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 产品ID |

**响应示例**:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 7. 批量操作产品

**端点**: `/api/products/admin/bulk`

**方法**: POST

**认证**: 需要管理员权限

**请求头**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**:
```json
{
  "ids": [1, 2, 3],
  "action": "delete"
}
```

或

```json
{
  "ids": [1, 2, 3],
  "action": "update",
  "data": {
    "status": "published"
  }
}
```

**action 类型**:
- `delete`: 批量删除
- `update`: 批量更新

**响应示例**:
```json
{
  "success": true,
  "data": {
    "deleted": 3
  }
}
```

或

```json
{
  "success": true,
  "data": {
    "updated": 3
  }
}
```

---

### 8. 导出产品数据

**端点**: `/api/products/admin/export`

**方法**: GET

**认证**: 需要管理员权限

**请求头**:
```
Authorization: Bearer <token>
```

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| format | string | 否 | 导出格式：json 或 csv（默认: json） |

**请求示例**:
```http
GET /api/products/admin/export?format=json
```

**响应**: 文件下载

---

## News API

### 1. 获取公开新闻列表

**端点**: `/api/news/public`

**方法**: GET

**认证**: 无需认证

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | number | 否 | 限制返回数量，默认全部 |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slug": "company-news-001",
      "title": {
        "zh-CN": "公司荣获2024年度最佳AI基础设施奖",
        "zh-HK": "公司榮獲2024年度最佳AI基礎設施獎",
        "en": "Company Wins 2024 Best AI Infrastructure Award"
      },
      "summary": {
        "zh-CN": "Supercore荣获...",
        "zh-HK": "Supercore榮獲...",
        "en": "Supercore wins..."
      },
      "content": {...},
      "tags": ["AI", "Infrastructure"],
      "published_at": "2024-01-01T00:00:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 2. 获取新闻详情

**端点**: `/api/news/:slug`

**方法**: GET

**认证**: 无需认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "company-news-001",
    "title": {...},
    "summary": {...},
    "content": {
      "zh-CN": "# 新闻内容\n\n详细内容...",
      "zh-HK": "# 新聞內容\n\n詳細內容...",
      "en": "# News Content\n\nDetailed content..."
    },
    "tags": ["AI", "Infrastructure"],
    "published_at": "2024-01-01T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 3. 创建新闻

**端点**: `/api/news`

**方法**: POST

**认证**: 需要管理员权限

**请求头**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**:
```json
{
  "slug": "company-news-001",
  "title": {
    "zh-CN": "公司荣获2024年度最佳AI基础设施奖",
    "zh-HK": "公司榮獲2024年度最佳AI基礎設施獎",
    "en": "Company Wins 2024 Best AI Infrastructure Award"
  },
  "summary": {
    "zh-CN": "Supercore荣获...",
    "zh-HK": "Supercore榮獲...",
    "en": "Supercore wins..."
  },
  "content": {
    "zh-CN": "# 新闻内容\n\n详细内容...",
    "zh-HK": "# 新聞內容\n\n詳細內容...",
    "en": "# News Content\n\nDetailed content..."
  },
  "tags": ["AI", "Infrastructure"],
  "published_at": "2024-01-01T00:00:00Z"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "company-news-001",
    "title": {...},
    "summary": {...},
    "content": {...},
    "tags": ["AI", "Infrastructure"],
    "published_at": "2024-01-01T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 4. 更新新闻

**端点**: `/api/news/admin/:id`

**方法**: PUT

**认证**: 需要管理员权限

**请求体**: 与创建新闻相同

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

---

### 5. 删除新闻

**端点**: `/api/news/admin/:id`

**方法**: DELETE

**认证**: 需要管理员权限

**响应示例**:
```json
{
  "success": true,
  "message": "News deleted successfully"
}
```

---

### 6. 批量操作新闻

**端点**: `/api/news/admin/bulk`

**方法**: POST

**认证**: 需要管理员权限

**请求体**:
```json
{
  "ids": [1, 2, 3],
  "action": "delete"
}
```

---

### 7. 导出新闻数据

**端点**: `/api/news/admin/export`

**方法**: GET

**认证**: 需要管理员权限

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| format | string | 否 | 导出格式：json 或 csv（默认: json） |

---

## Inquiries API

### 1. 提交询盘

**端点**: `/api/inquiries`

**方法**: POST

**认证**: 无需认证

**请求头**:
```
Content-Type: application/json
```

**请求体**:
```json
{
  "email": "customer@example.com",
  "company": "Example Company",
  "message": "我们有兴趣了解您的AI服务器产品..."
}
```

**字段验证规则**:
| 字段 | 规则 |
|------|------|
| email | 必填，有效的email格式 |
| company | 可选 |
| message | 必填，最少10个字符 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "customer@example.com",
    "company": "Example Company",
    "message": "我们有兴趣了解您的AI服务器产品...",
    "status": "new",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 2. 获取询盘列表（管理员）

**端点**: `/api/inquiries`

**方法**: GET

**认证**: 需要管理员权限

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "customer@example.com",
      "company": "Example Company",
      "message": "我们有兴趣了解您的AI服务器产品...",
      "status": "new",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 3. 更新询盘状态

**端点**: `/api/inquiries/:id`

**方法**: PUT

**认证**: 需要管理员权限

**请求体**:
```json
{
  "status": "contacted"
}
```

**状态值**:
- `new`: 新询盘
- `contacted`: 已联系
- `closed`: 已关闭

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "contacted",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

---

### 4. 删除询盘

**端点**: `/api/inquiries/:id`

**方法**: DELETE

**认证**: 需要管理员权限

**响应示例**:
```json
{
  "success": true,
  "message": "Inquiry deleted successfully"
}
```

---

### 5. 批量操作询盘

**端点**: `/api/inquiries/admin/bulk`

**方法**: POST

**认证**: 需要管理员权限

**请求体**:
```json
{
  "ids": [1, 2, 3],
  "action": "update",
  "data": {
    "status": "contacted"
  }
}
```

---

### 6. 导出询盘数据

**端点**: `/api/inquiries/admin/export`

**方法**: GET

**认证**: 需要管理员权限

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| format | string | 否 | 导出格式：json 或 csv（默认: json） |

---

## Admin API

### 1. 获取仪表板数据

**端点**: `/api/admin/dashboard`

**方法**: GET

**认证**: 需要管理员权限

**响应示例**:
```json
{
  "success": true,
  "data": {
    "stats": {
      "products": 15,
      "posts": 8,
      "inquiries": 25
    },
    "recentInquiries": [
      {
        "id": 1,
        "email": "customer@example.com",
        "company": "Example Company",
        "message": "...",
        "status": "new",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "serverStatus": {
      "frontend": {
        "url": "https://www.supercore.hk",
        "status": "online",
        "responseTime": 120
      },
      "backend": {
        "url": "https://oqwvbyacnriohxopgaks.supabase.co",
        "status": "online",
        "responseTime": 85
      }
    }
  }
}
```

---

### 2. 获取管理员日志

**端点**: `/api/admin/logs`

**方法**: GET

**认证**: 需要管理员权限

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码（默认: 1） |
| limit | number | 否 | 每页数量（默认: 50） |
| type | string | 否 | 资源类型过滤 |
| userId | string | 否 | 用户ID过滤 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "user_id": "user-id",
        "action": "create",
        "resource_type": "products",
        "resource_id": 1,
        "details": {...},
        "ip": "192.168.1.1",
        "user_agent": "Mozilla/5.0...",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3
    }
  }
}
```

---

### 3. 全局搜索

**端点**: `/api/admin/search`

**方法**: GET

**认证**: 需要管理员权限

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| q | string | 是 | 搜索关键词 |
| type | string | 否 | 搜索类型（products/posts/inquiries/all，默认: all） |

**请求示例**:
```http
GET /api/admin/search?q=server&type=products
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "slug": "supercore-g2-server",
        "name": {...},
        "category": "server"
      }
    ],
    "posts": [...],
    "inquiries": [...]
  }
}
```

---

## Upload API

### 1. 上传图片

**端点**: `/api/upload/post-cover`

**方法**: POST

**认证**: 需要管理员权限

**请求头**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | 图片文件 |
| bucket | string | 否 | 存储桶名称（默认: news-covers） |

**文件限制**:
- 支持格式：JPG、PNG、WebP
- 最大文件大小：5MB
- 自动压缩：大于2MB的图片会自动压缩

**响应示例**:
```json
{
  "success": true,
  "data": {
    "publicUrl": "https://oqwvbyacnriohxopgaks.supabase.co/storage/v1/object/public/path/to/image.jpg",
    "path": "public/path/to/image.jpg"
  }
}
```

---

## Solutions API

### 1. 获取解决方案列表

**端点**: `/api/solutions`

**方法**: GET

**认证**: 无需认证

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "hpc",
      "icon": "ServerCrash",
      "title": "HPC Solutions",
      "description": "高性能计算集群解决方案",
      "features": [
        "GPU服务器",
        "分布式存储",
        "高速网络"
      ]
    }
  ]
}
```

---

## Stats API

### 1. 获取统计数据

**端点**: `/api/stats`

**方法**: GET

**认证**: 需要管理员权限

**响应示例**:
```json
{
  "success": true,
  "data": {
    "products": 15,
    "posts": 8,
    "inquiries": 25
  }
}
```

---

## System API

### 1. 系统状态检查

**端点**: `/api/system/ping`

**方法**: GET

**认证**: 无需认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "frontend": {
      "url": "https://www.supercore.hk",
      "status": "online",
      "responseTime": 120
    },
    "backend": {
      "url": "https://oqwvbyacnriohxopgaks.supabase.co",
      "status": "online",
      "responseTime": 85,
      "httpStatus": 200
    },
    "database": {
      "status": "connected",
      "latency": 12
    }
  }
}
```

---

### 2. 客户端错误报告

**端点**: `/api/errors/client`

**方法**: POST

**认证**: 无需认证

**请求体**:
```json
{
  "message": "Error message",
  "stack": "Error stack trace",
  "name": "Error name",
  "context": {
    "url": "/current/page",
    "userAgent": "Mozilla/5.0...",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "Error logged successfully"
}
```

---

## 错误处理

### 错误响应格式

```json
{
  "success": false,
  "error": {
    "message": "错误描述",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### 常见错误码

| 错误码 | HTTP状态码 | 说明 |
|--------|-----------|------|
| VALIDATION_ERROR | 400 | 请求参数验证失败 |
| UNAUTHORIZED | 401 | 未认证或认证失败 |
| FORBIDDEN | 403 | 权限不足 |
| NOT_FOUND | 404 | 资源不存在 |
| CONFLICT | 409 | 资源冲突（如slug重复） |
| INTERNAL_ERROR | 500 | 服务器内部错误 |

### 错误示例

#### 参数验证错误
```http
GET /api/products/public?limit=abc
```

```json
{
  "success": false,
  "error": {
    "message": "Invalid query parameter",
    "code": "VALIDATION_ERROR",
    "details": {
      "limit": "Must be a number"
    }
  }
}
```

#### 未认证错误
```http
GET /api/products
```

```json
{
  "success": false,
  "error": {
    "message": "Authentication required",
    "code": "UNAUTHORIZED"
  }
}
```

#### 资源不存在
```http
GET /api/products/non-existent
```

```json
{
  "success": false,
  "error": {
    "message": "Product not found",
    "code": "NOT_FOUND"
  }
}
```

---

## 数据模型

### Product（产品）

```typescript
interface Product {
  id: number
  slug: string // URL-friendly唯一标识
  name: {
    'zh-CN': string    // 简体中文
    'zh-HK': string    // 繁体中文（香港）
    'en': string       // 英文
  }
  description: {
    'zh-CN': string
    'zh-HK': string
    'en': string
  }
  specs: Record<string, string | number> // 规格参数（JSON对象）
  images: string[] // 图片URL数组
  category: string // 分类：server, storage, network
  is_featured: boolean // 是否推荐产品
  status: 'draft' | 'published' | 'archived' // 状态
  created_at: string // ISO 8601时间戳
  updated_at: string // ISO 8601时间戳
}
```

### Post（新闻）

```typescript
interface Post {
  id: number
  slug: string
  title: {
    'zh-HK': string
    'en': string
  }
  summary: {
    'zh-HK': string
    'en': string
  }
  content: {
    'zh-HK': string    // Markdown格式
    'en': string
  }
  tags: string[]
  published_at: string // ISO 8601时间戳
  created_at: string
  updated_at: string
}
```

### Inquiry（询盘）

```typescript
interface Inquiry {
  id: number
  email: string
  company: string
  message: string
  status: 'new' | 'contacted' | 'closed'
  created_at: string
}
```

### AdminLog（管理员日志）

```typescript
interface AdminLog {
  id: number
  user_id: string
  action: string // create, update, delete, bulk_delete, bulk_update, export
  resource_type: string // products, posts, inquiries
  resource_id: number | number[]
  details: Record<string, any>
  ip: string
  user_agent: string
  created_at: string
}
```

---

## 使用示例

### JavaScript/TypeScript

#### 获取公开产品列表
```typescript
const response = await fetch('https://www.supercore.hk/api/products/public?limit=10')
const data = await response.json()

console.log(data.data)
```

#### 创建产品（需要认证）
```typescript
const token = 'your-access-token'

const response = await fetch('https://www.supercore.hk/api/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    slug: 'supercore-g2-server',
    name: {
      'zh-CN': 'SUPERCORE G2 服务器',
      'zh-HK': 'SUPERCORE G2 伺服器',
      'en': 'SUPERCORE G2 Server'
    },
    // ... 其他字段
  })
})

const data = await response.json()
```

#### 提交询盘
```typescript
const response = await fetch('https://www.supercore.hk/api/inquiries', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'customer@example.com',
    company: 'Example Company',
    message: '我们有兴趣了解您的AI服务器产品...'
  })
})

const data = await response.json()
```

### cURL

#### 获取产品列表
```bash
curl -X GET "https://www.supercore.hk/api/products/public?limit=10" \
  -H "Content-Type: application/json"
```

#### 创建产品
```bash
curl -X POST "https://www.supercore.hk/api/products" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "supercore-g2-server",
    "name": {
      "zh-CN": "SUPERCORE G2 服务器",
      "zh-HK": "SUPERCORE G2 伺服器",
      "en": "SUPERCORE G2 Server"
    },
    "category": "server",
    "status": "published"
  }'
```

#### 提交询盘
```bash
curl -X POST "https://www.supercore.hk/api/inquiries" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "company": "Example Company",
    "message": "我们有兴趣了解您的AI服务器产品"
  }'
```

---

## 速率限制

当前版本未实施速率限制。

建议实施：
- 公开API：每IP每小时100次请求
- 管理员API：每用户每小时200次请求
- 提交询盘API：每IP每小时10次请求

---

## 版本历史

| 版本 | 日期 | 变更说明 |
|------|------|----------|
| v1.0.0 | 2024-01-30 | 初始版本 |

---

## 联系方式

- **技术支持**: tech@supercore.hk
- **API问题**: api@supercore.hk
- **网站**: https://www.supercore.hk

---

**© 2024 SUPERCORE TECHNOLOGY LIMITED. All rights reserved.**
