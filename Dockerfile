# 使用 Node.js 20 作为构建环境
FROM node:20-alpine as builder

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 yarn.lock 文件
COPY package.json yarn.lock ./

# 安装依赖并清理缓存
RUN yarn install --frozen-lockfile && yarn cache clean

# 复制所有源代码
COPY . .

# 构建应用（NestJS 默认构建输出目录为 dist）
RUN yarn build

# 使用官方的 Node.js 镜像来运行应用
FROM node:20-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 从构建阶段复制编译后的代码
COPY --from=builder /usr/src/app/dist /usr/src/app/dist

# 安装生产环境依赖（避免安装 devDependencies）
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# 暴露应用所使用的端口（Nest 默认是 3000）
EXPOSE 3000

# 启动应用
CMD ["node", "dist/main"]