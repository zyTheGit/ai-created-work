# `ask-matt`

> **分类**：engineering（工程类）｜**调用方式**：用户手动调用

- **一句话定位**：技能路由器，帮你选择当前情境最适合的 skill 或工作流。
- **调用方式**：用户手动调用
- **适用场景**：面对一个任务不知道该用哪个 skill 时；想了解所有可用工作流及其关系时；需要规划从想法到交付的完整路径时。
- **核心指令**：
  - **前置纪律**：断言某个技能做什么、或建议跳过它的某一步之前，先读那个技能的 SKILL.md；这里的摘要只用于定向。
  - **主流程（idea → ship）**：`/grill-with-docs`（在**工作目录**里才用它：有状态，把所学沉淀进 `GLOSSARY.md` 和 ADR；不在工作目录用 `/grill-me`，两者跑同一个 `/grilling` 原语，但只有前者留痕）→ 需要可运行答案的问题经 `/handoff` 进出 `/prototype` → 多会话构建走 `/to-spec` + `/to-tickets`（每个工单声明阻塞边），然后逐工单 `/implement`（之间 `/clear`）或整体 `/implement-spec`；单会话构建直接 `/implement`。无论哪条路，代码都由 `/tdd` 一个红绿切片驱动、`/code-review` 收尾；PR 由 `/pr` 塑造正文；`/retro` 收口，它改的是 agent 的**环境**而非代码。
  - **入口匝道**：`/triage`（只处理**别人**创建的 issue，`/to-tickets` 产出的工单已 agent-ready，别再 triage）、`/diagnosing-bugs`（修复落地后在同一会话跑 `/retro` 问"什么本可以预防这个 bug"；若结论是缺一条好接缝，才去 `/improve-codebase-architecture`）、`/wayfinder`（庞大模糊工程，两个易错见下）。
  - **代码库健康**（`/improve-codebase-architecture` 找深化机会）与**底层词汇层**（`/domain-modeling` 管领域语言，`/codebase-design` 管深模块词汇），后两者是模型自动调用的参考技能。
  - **阶段边界决策树**：phase 是会话内的一块工作（grilling、实现、QA），两个 phase 之间按序问五个问题：① 能继续吗（下一 phase 需要本 phase 当一手来源，或 smart zone 还装得下）→ **Continue**；② 上下文对后续无关吗 → **`/clear`**（棋盘上最便宜的一步，且可恢复）；③ 需要**搬运**上下文吗（换 harness、换目录、交给同事、phase 中途 fork 支线）→ **`/handoff`**，它买的是**可移植性**，没有东西在旅行就不需要它；④ 任务能 AFK 吗 → **subagent**；⑤ 否则 **`/compact`**。`/compact` 是**默认而非首选**，坐在树的最底部，因为上面四问都更便宜或更精确；只有 Continue 保留一手来源，其余四步都把它换成有损摘要。
  - **wayfinder 的两个易错**：**过度伸手**（它比单次 grill 更慢更密，只留给真正装不进一个会话的想法，范围清楚的功能该去 `/grill-with-docs`）；**在交接处迷路**（地图清了就交接、不自己建：并回主流程的 `/to-spec`，而不是把地图直接接进 `/implement`，只有确实变小的努力才直通 `/implement`）。另补上了此前缺失的 `/grilling` 路由：`grill-me` 与 `grill-with-docs` 按"你是否在一个工作目录里"分流。
  - **上下文卫生**：步骤 1-3 保持同一个未压缩的上下文窗口（`/to-tickets` 之后才 compact 或 clear）；smart zone 约 **150k tokens**，接近时别硬撑着降级运行，在最近的 phase 边界 `/compact` 后继续。`/retro` 要在它回顾的那个会话里跑。
