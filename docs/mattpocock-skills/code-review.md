# `code-review`

> **分类**：engineering（工程类）｜**调用方式**：模型自动调用

- **一句话定位**：双轴并行的代码审查，同时检查代码是否符合本仓库文档化的编码规范（Standards）和是否忠实实现了原始 issue / spec（Spec）。
- **调用方式**：模型自动调用
- **适用场景**：用户想审查一个分支、PR 或工作变更时；需要"review since X"时；`/implement` 完成后自动触发。
- **核心指令**：
  1. **锚定基准点**：确认用户指定的 commit/branch/tag，用 `git diff <fixed-point>...HEAD`（三点 diff，对比 merge-base）获取变更，并记下 `git log <fixed-point>..HEAD --oneline` 的提交列表；基准点无法解析或 diff 为空时**在此处失败**，不要带进两个并行 sub-agent。
  2. **定位 Spec 来源**：按优先级搜索，commit message 中的 issue 引用（`#123`、`Closes #45`、GitLab `!67`）> 用户作为参数传入的路径 > `docs/`、`specs/`、`.scratch/` 下与分支或功能匹配的 spec 文件 > 询问用户。若用户说没有 spec，Spec 子 agent 将跳过并报告 "no spec available"。
  3. **定位 Standards 来源**：**搜索仓库**中每一个记录"代码该如何写"的文件，`CODING_STANDARDS.md` 或 `CONTRIBUTING.md` 存在时必须在列。此外 Standards 轴始终携带一套固定的 Fowler 代码异味基线（_Refactoring_ 第 3 章，12 种），两条约束：仓库文档标准永远覆盖基线；每条异味都是带标签的启发式判断（如 "possible Feature Envy"），绝不是硬性违规；工具已强制的一律跳过。
  4. **并行派发两个 sub-agent**：以 harness 中立的方式把两次调用**一起发出、放到前台**，再汇总它们返回的报告。Standards agent 需拿到 diff 命令、提交列表、第 3 步找到的规范文件清单，**以及完整粘贴进来的异味基线**（它没有别的途径获取），外加"区分硬性违规与判断性异味、跳过工具已强制的、400 字以内"的指令；Spec agent 需拿到 spec 内容，报告缺失或部分实现的需求、范围蔓延、以及实现看起来不对的地方，每条发现引用 spec 原文。spec 缺失则跳过 Spec agent 并在最终报告中注明。
  5. **汇总**：分 `## Standards` 和 `## Spec` 两节原样呈现两个报告，**不合并不重排**（两轴是故意分开的：符合全部规范却实现了错的东西 = Standards 过 Spec 挂；照 issue 做了却破坏项目约定 = 反之），末尾给出每轴发现总数与该轴内最严重的问题，不跨轴选冠军。
  6. **前置条件**：issue tracker 本应已提供；若没有，**告知用户去运行 `/setup-matt-pocock-skills`**，不要试图用 Skill tool 调它（用户手动类技能）。
