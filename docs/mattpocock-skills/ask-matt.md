# `ask-matt`

> **分类**：engineering（工程类）｜**调用方式**：用户手动调用

- **一句话定位**：技能路由器——帮你选择当前情境最适合的 skill 或工作流。
- **调用方式**：用户手动调用
- **适用场景**：面对一个任务不知道该用哪个 skill 时；想了解所有可用工作流及其关系时；需要规划从想法到交付的完整路径时。
- **核心指令**：
  - 定义了**主流程**（idea → ship）：`/grill-with-docs`（打磨想法）→ 可选 `/prototype`（原型验证）→ `/to-spec` + `/to-tickets`（多会话构建）或直接 `/implement`（单会话构建）。`/implement` 内部驱动 `/tdd` 做红绿切片，完成后运行 `/code-review`。
  - 定义了**入口匝道**：`/triage`（处理堆积的 bug/需求）、`/diagnosing-bugs`（排查疑难 bug）、`/wayfinder`（应对庞大模糊的工程）。
  - 定义了**代码库健康**维护（`/improve-codebase-architecture`）和**底层词汇层**（`/domain-modeling`、`/codebase-design`）。
  - 强调**上下文卫生**：步骤 1-3 保持同一上下文窗口不压缩；接近 smart zone（~120k tokens）时用 `/handoff` 切换到新会话；`/compact` 用于阶段间的有意中断。
