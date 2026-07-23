# `setup-matt-pocock-skills`

> **分类**：engineering（工程类）｜**调用方式**：用户手动调用

- **一句话定位**：为仓库配置工程技能所需的基础设施——issue tracker、triage 标签体系和领域文档布局。
- **调用方式**：用户手动调用
- **适用场景**：首次使用其他工程技能前运行一次，完成仓库级配置。
- **核心指令**：这是一个**提示驱动**的技能（非确定性脚本），流程为"探索 → 展示 → 确认 → 写入"。**步骤 1 探索**：读取 git remote、CLAUDE.md/AGENTS.md、CONTEXT.md、docs/adr/ 等，判断仓库是否为 monorepo、triage 技能是否已安装。**步骤 2 逐项确认**：Section A 配置 issue tracker（GitHub/GitLab/本地 Markdown/其他）；Section B 配置 triage 标签（仅当 triage 技能已安装时）；Section C 配置领域文档布局（单上下文或多上下文，仅 monorepo 时才提供多上下文选项）。**步骤 3-4**：展示草稿让用户确认，然后写入 `docs/agents/` 下的配置文件，并在 CLAUDE.md 或 AGENTS.md 中添加 `## Agent skills` 段落。**步骤 5**：告知用户设置完成及哪些技能会读取这些配置。
