# 第一阶段：构建环境
FROM node:20-alpine AS builder

WORKDIR /app

# 安装编译原生模块所需的工具 (Python3, Make, G++)
RUN apk add --no-cache python3 make g++

# 复制依赖文件
COPY package*.json ./

# 安装依赖 (使用淘宝源 + 清理缓存)
RUN npm install --registry=https://registry.npmmirror.com --legacy-peer-deps --no-audit && npm cache clean --force

# 复制所有源代码
COPY . .

# 开始构建 Nuxt
RUN npm run build

# 第二阶段：运行环境 (精简镜像)
FROM node:20-alpine AS runner

WORKDIR /app

# 复制构建产物
COPY --from=builder /app/.output ./.output
# COPY --from=builder /app/public ./public

# 设置环境变量
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", ".output/server/index.mjs"]