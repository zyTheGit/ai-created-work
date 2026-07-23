# 快速开始

**AI Created Work** 是一个由 AI 辅助维护的技术文档仓库，持续积累 Claude Code、Git、工具链与 AI 辅助编程的实践经验。本文档站基于 [VitePress](https://vitepress.dev/) 构建，通过 [GitHub Pages](https://zyTheGit.github.io/ai-created-work/) 在线发布。

## 文档分类

本站文档按主题分为以下几类：

| 分类 | 说明 | 入口 |
|------|------|------|
| 🤖 **AI 与编程** | Claude Code 生态、系统提示词研究、EvoKit 项目文档 | [Claude Code 生态推荐](/ai/Claude-Code-生态推荐) |
| 🛠️ **开发工具与配置** | 9Router、scrcpy、IDM、Git 双仓库同步与分支管理 | [9Router 安装指南](/tools/9router-install-guide) |
| 📋 **个人未来计划** | AI 时代前端工程师的生存与进阶完整规划 | [总纲](/个人未来计划/00-总纲) |
| 🧩 **Matt Pocock Skills** | 41 个 Claude Code 工程技能的中文文档 | [索引](/mattpocock-skills/README) |

## 本地开发

```bash
# 安装依赖
npm install

# 启动本地开发服务器（支持热更新）
npm run docs:dev

# 构建生产产物（输出到 docs/.vitepress/dist）
npm run docs:build

# 本地预览构建产物
npm run docs:preview
```

## 部署

推送 `main` 分支后，GitHub Actions（`.github/workflows/deploy.yml`）会自动构建并部署到 GitHub Pages，无需手动操作。

## 新增文档

1. 在 `docs/` 对应子目录下新建 Markdown 文件（如 `docs/ai/新文档.md`）
2. 在 `docs/.vitepress/config.ts` 的 `sidebar` 中添加对应条目
3. 推送到 `main` 分支，GitHub Actions 自动部署

### 侧边栏配置示例

```ts
// docs/.vitepress/config.ts
sidebar: {
  '/ai/': [
    {
      text: 'AI 与编程',
      base: '/ai/',
      items: [
        { text: '新文档标题', link: '新文档' }  // 不需要 .md 后缀
      ]
    }
  ]
}
```

## 特性

- **深色模式**：右上角外观开关，跟随系统或手动切换
- **本地搜索**：顶部搜索框，纯前端索引，无需外部服务
- **Mermaid 图表**：支持 `mermaid` 代码块渲染流程图
- **Last Updated**：每页底部显示基于 Git 的最后更新时间
- **Edit on GitHub**：每页底部的编辑链接，可直接跳转到仓库编辑
