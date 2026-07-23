# `code-review`

> **分类**：engineering（工程类）｜**调用方式**：模型自动调用

- **一句话定位**：双轴并行的代码审查——同时检查代码是否符合编码规范（Standards）和是否忠实实现了原始需求（Spec）。
- **调用方式**：模型自动调用
- **适用场景**：用户想审查一个分支、PR 或工作变更时；需要"review since X"时；`/implement` 完成后自动触发。
- **核心指令**：
  1. **锚定基准点**：确认用户指定的 commit/branch/tag，用 `git diff <fixed-point>...HEAD`（三点 diff）获取变更，验证基准点有效且 diff 非空。
  2. **定位 Spec 来源**：按优先级查找——commit message 中的 issue 引用 > 用户传入路径 > `docs/`/`specs/`/`.scratch/` 下的匹配文件 > 询问用户。
  3. **定位 Standards 来源**：查找 `CODING_STANDARDS.md`、`CONTRIBUTING.md` 等；同时始终携带一套固定的 Fowler 代码异味基线（12 种，如 Mysterious Name、Feature Envy、Shotgun Surgery 等），仓库文档标准优先级高于基线。
  4. **并行生成两个 sub-agent**：Standards agent 报告违规和异味；Spec agent 报告缺失需求、范围蔓延和实现错误。
  5. **汇总**：分 `## Standards` 和 `## Spec` 两节呈现，不合并不重排，末尾给出每轴的发现总数和最严重问题。
