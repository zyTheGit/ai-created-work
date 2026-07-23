# ai-created-work

日常AI生成文档仓库

## 文档站

本仓库使用 [VitePress](https://vitepress.dev/) 构建文档站，部署于 GitHub Pages：

🔗 **在线访问：https://zyTheGit.github.io/ai-created-work/**

### 本地运行

```bash
npm install          # 安装依赖
npm run docs:dev     # 本地开发（热更新）
npm run docs:build   # 构建产物
npm run docs:preview # 预览构建结果
```

### 部署

推送 `main` 分支后，GitHub Actions（`.github/workflows/deploy.yml`）会自动构建并发布到 GitHub Pages，无需手动操作。

### 目录说明

- `docs/` — 所有 Markdown 文档（含 VitePress 站点入口 `index.md`）
- `docs/.vitepress/` — VitePress 配置与自定义主题
