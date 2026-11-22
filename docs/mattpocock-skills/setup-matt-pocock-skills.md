# `setup-matt-pocock-skills`

> **分类**：engineering（工程类）｜**调用方式**：用户手动调用

- **一句话定位**：为仓库配置工程技能所需的基础设施：issue tracker、triage 标签体系和领域文档布局。
- **调用方式**：用户手动调用
- **适用场景**：首次使用其他工程技能前运行一次，完成仓库级配置。
- **核心指令**：这是一个**提示驱动**的技能（非确定性脚本），流程为"探索 → 展示 → 确认 → 写入"。
  - **步骤 1 探索**：读 `git remote -v` 与 `.git/config`、根目录 `CLAUDE.md` / `AGENTS.md`（是否已有 `## Agent skills` 段）、`GLOSSARY.md` 与 `GLOSSARY-MAP.md`（以及遗留的 `CONTEXT.md` / `CONTEXT-MAP.md`）、`docs/adr/` 与 `src/*/docs/adr/`、`docs/agents/`、`.scratch/`；判断 **triage 技能是否已安装**（这决定 Section B 跑不跑）；识别 **monorepo 信号**（`pnpm-workspace.yaml`、`package.json` 的 `workspaces`、有自己 `src/` 的 `packages/*`），这些只出现在真正的大型多包仓库，没有就是单上下文，而单上下文是几乎所有仓库的情况。发现遗留的 `CONTEXT.md` / `CONTEXT-MAP.md` 时，主动提出 `git mv` 到对应的 `GLOSSARY` 名字，并改写 `docs/agents/domain.md` 里的旧名。
  - **步骤 2 逐项确认**（每节以推荐答案开头，一个词即可接受）：
    - **Section A：issue tracker**。默认姿态是这些技能为 GitHub 设计：remote 指向 GitHub 就提议 GitHub，指向 GitLab（`gitlab.com` 或自托管）就提议 GitLab，否则提供 GitHub / GitLab / 本地 markdown（`.scratch/<feature>/`） / 其他（Jira、Linear，用一段自由文本记录）。选择写进 `docs/agents/issue-tracker.md`。GitHub 与 GitLab 模板带一个"PRs as a request surface"开关，**默认关**：保持关闭且不要主动提起，想要外部 PR 进 triage 队列的用户事后自己翻。**GitHub / GitLab tracker 需要可达的仓库**：用户选了其中之一而当前没有指向该 host 的 git remote 时，先拿到仓库 URL 接好（必要时 `git init` + `git remote add origin <url>`），直到在仓库内 `gh repo view` / `glab repo view` 能打印出项目再继续；做不到就停下说明缺什么。
    - **Section B：triage 标签**。triage 技能没安装就**整节跳过**（没装的技能不需要标签）。装了也只问**一个**问题："要保留默认 triage labels 吗？（推荐：是）"。默认是五个规范角色，标签字符串与角色同名：`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`。选是就原样写下；选否（通常是 tracker 已用别的名字）才收集覆盖映射。**Section B 在 GitHub 或 GitLab 上跑过之后，会创建 tracker 缺失的每个标签**（`gh label create` / `glab label create`）。
    - **Section C：领域文档**。默认**单上下文**（根目录一个 `GLOSSARY.md` + `docs/adr/`），这适合几乎所有仓库，**直接写、不询问**；只有探索发现了 monorepo 信号才提供多上下文（根 `GLOSSARY-MAP.md` 指向各上下文的 `GLOSSARY.md`）并让用户确认。
  - **步骤 3-4：确认并写入**。展示 `## Agent skills` 块草稿和 `docs/agents/` 下各文件内容，让用户先改再写。写入时：`CLAUDE.md` 存在就编辑它，否则 `AGENTS.md` 存在就编辑它，两者都没有才问用户建哪个；已有的 `## Agent skills` 块**就地更新**而非追加重复。`### Triage labels` 子块和 `docs/agents/triage-labels.md` 只在 triage 已安装且 Section B 跑过时才写。本地 markdown tracker 的约定是：spec 叫 `.scratch/<feature-slug>/spec.md`（不是 `PRD.md`），实现工单**一文件一工单** `.scratch/<feature-slug>/issues/<NN>-<slug>.md`（从 `01` 编号，绝不是一个合并的 `tickets.md`）。
  - **步骤 5**：告知用户设置完成、哪些工程技能现在会读这些文件，并说明 `docs/agents/*.md` 事后可直接编辑，只有换 tracker 或推倒重来才需要重跑本技能。
  - **tracker 模板修正（v1.3.2）**：GitHub 模板改用原生 issue 依赖表达阻塞（`gh issue edit --add-blocked-by`，旧版 `gh` 走 API；并提供统计未关闭阻塞者的命令）、关闭 issue 时先发评论再 `close`（对已关闭 issue 直接 `close --comment` 会丢评论且仍 exit 0）、外部 PR 列表修正 `authorAssociation` 失败、读取 PR 时同时取正文与评论，并明确只向用户自己的仓库建 issue（fork 中 `gh` 可能默认指向上游父仓库，首次建 issue 前先 `gh repo view --json nameWithOwner` 确认）。GitLab 模板用 `glab mr list -O json`、用 `--linked-issues` 关联子 issue、并给出 frontier 查询命令。
