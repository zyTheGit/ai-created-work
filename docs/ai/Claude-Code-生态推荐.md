# Claude Code 生态推荐指南

> 生成日期：2026-05-06 | 适用角色：前端工程师

---

## 一、Skills 插件

Skills = 打包好的提示词 + 领域知识，让 Claude 变"聪明"。

安装方式：

```bash
npx skills add <name> -y -g
```

### 前端工程师推荐

| Skill                           | 用途                          |
| ------------------------------- | --------------------------- |
| **frontend-design**             | 生成生产级 UI 代码，避免 AI 风格的千篇一律设计 |
| **canvas-design**               | 从自然语言生成架构图、流程图              |
| **vercel-react-best-practices** | React 项目代码规范 + 性能检查         |
| **web-artifacts-builder**       | 创建带路由的单页应用                  |

### 全栈 / 通用推荐

| Skill                   | 用途                          |
| ----------------------- | --------------------------- |
| **feature-dev**         | 7 阶段引导式功能开发（多 agent 探索）     |
| **code-review**         | 4 个独立审查 agent + 0–100 置信度打分 |
| **planning-with-files** | 任务拆解 + 跨 session 进度追踪       |
| **memory-intake**       | 跨 session 存储项目上下文           |
| **technical-writer**    | 自动生成标准化 README / API 文档     |
| **humanizer**           | 去除 AI 写作痕迹                  |

---

## 二、MCP Server

MCP Server = 真正与外部工具交互的"手"，让 Claude 能执行实际操作。

安装方式：

```bash
claude mcp add <name> -- npx -y <package>
```

配置文件位置：`~/.claude.json` 或项目根目录 `.mcp.json`

### 每日必装（4 个）

| MCP                | 用途                                     | 安装命令                                                                                     |
| ------------------ | -------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Context7**       | 实时拉取最新版本文档（React/Next.js/Vue），避免幻觉 API | `claude mcp add context7 -- npx -y @upstash/context7-mcp@latest`                         |
| **GitHub MCP**     | PR / Issue / CI 管理                     | `claude mcp add github -- npx -y @modelcontextprotocol/server-github`                    |
| **Playwright MCP** | 浏览器自动化、E2E 测试、截图                       | `claude mcp add playwright -- npx -y @playwright/mcp`                                    |
| **Filesystem MCP** | 安全的本地文件读写（沙箱隔离）                        | `claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/Projects` |

### 按需选装

| MCP                     | 适用场景                    |
| ----------------------- | ----------------------- |
| **Sequential Thinking** | 复杂问题需要分步推理时             |
| **Supabase MCP**        | 用 Supabase 做后端 / 数据库时   |
| **PostgreSQL (DBHub)**  | 直接操作 PostgreSQL 数据库     |
| **Docker MCP**          | 容器管理、日志查看、镜像构建          |
| **Brave Search**        | 需要联网搜索最新信息              |
| **Sentry MCP**          | 前端错误监控和排查               |
| **Linear MCP**          | 用 Linear 做项目管理/issue 追踪 |
| **Excalidraw MCP**      | 生成手绘风格的架构图              |

---

## 三、值得关注的 GitHub 仓库

| 仓库                                                                                                      | Stars   | 说明                             |
| ------------------------------------------------------------------------------------------------------- | ------- | ------------------------------ |
| [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)                         | ~84,000 | MCP 官方参考实现                     |
| [wong2/awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers)                               | ~5,479  | MCP Server 权威 curated 列表       |
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)                 | —       | Claude Code 综合资源合集             |
| [ccplugins/awesome-claude-code-plugins](https://github.com/ccplugins/awesome-claude-code-plugins)       | ~666    | 340+ 插件 / 1367+ skills 的最大社区市场 |
| [alirezarezvani/claude-code-skill-factory](https://github.com/alirezarezvani/claude-code-skill-factory) | ~653    | 69 种提示词模板 + 10 个斜杠命令           |
| [PaulDuvall/claude-code](https://github.com/PaulDuvall/claude-code)                                     | —       | 57 个自定义命令（架构/开发/安全/DevOps）     |
| [alirezarezvani/claude-code-tresor](https://github.com/alirezarezvani/claude-code-tresor)               | ~200    | 19 命令 + 8 agent + 133 子 agent  |
| [glittercowboy/taches-cc-resources](https://github.com/glittercowboy/taches-cc-resources)               | —       | 27 命令 + 9 skills + 12 种思维模型    |

---

## 四、额外资源

| 资源                                                                                                                      | 说明                              |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| [SkillsMP.com](https://skillsmp.com)                                                                                    | Skills 公共目录，可搜索发现               |
| **cc-recommender**                                                                                                      | MCP 服务器，分析项目后自动推荐配套工具           |
| [Claude Code Best Practice (Mintlify)](https://www.mintlify.com/shanraisshan/claude-code-best-practice/)                | 全面的最佳实践指南（含 MCP、hooks、settings） |
| [Claude Code 进阶指南 (什么值得买)](https://post.smzdm.com/p/arz98pp7/)                                                          | 中文社区 32 个 Skills + 8 个 MCP 详解   |
| [Best Claude Code Skills & MCP (TurboDocx)](https://www.turbodocx.com/blog/best-claude-code-skills-plugins-mcp-servers) | 2026 年度推荐汇总                     |

---

## 五、前端工程师快速起步

```bash
# 3 个 skills（一次安装）
npx skills add frontend-design -y -g
npx skills add vercel-react-best-practices -y -g
npx skills add code-review -y -g

# 4 个 MCP（逐个安装）
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
claude mcp add playwright -- npx -y @playwright/mcp
claude mcp add github -- npx -y @modelcontextprotocol/server-github
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/Projects
```

---

## 六、注意事项

1. **别一次装太多** —— 每个 skill/MCP 都会占用上下文窗口，多了反而让 Claude 变慢、成本更高。建议 3–6 个起步，用熟再扩展。
2. **Skills 自动触发** —— 说"写个 README"会自动激活 `technical-writer`，说"搭个仪表盘"会激活 `frontend-design`，不需要手动指定。
3. **权限粒度控制** —— 在 `settings.json` 中可以用 `mcp__<server>__<tool>` 格式精细控制每个 MCP 工具的 allow/deny。
4. **MCP 配置位置** —— 用户级 `~/.claude.json`，项目级 `.mcp.json`。
