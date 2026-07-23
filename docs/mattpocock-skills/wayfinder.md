# `wayfinder`

> **分类**：engineering（工程类）｜**调用方式**：用户手动调用

- **一句话定位**：将超大型工作项规划为 issue tracker 上的决策工单地图，逐个解决直到通往目标的路径清晰。
- **调用方式**：用户手动调用
- **适用场景**：面对一个超出单个 agent 会话容量的大型模糊目标（如制定 spec、锁定决策、规划迁移）时使用。
- **核心指令**：**核心理念**：默认只规划不执行，产出的是决策而非交付物。**地图（Map）** 是 tracker 上的一个 issue（标签 `wayfinder:map`），作为索引指向子工单。**工单类型**：Research（AFK，由 `/research` 子 agent 执行）、Prototype（HITL，制作粗糙原型）、Grilling（HITL，逐个问题追问，默认类型）、Task（HITL/AFK，解除决策阻塞的前置工作）。**战争迷雾**：尚未明确的问题记入"Not yet specified"，等前沿推进后再毕业为工单。**两种调用模式**：(1) Chart——命名目标 → 广度优先 grill 绘制前沿 → 创建地图和工单 → 启动 research 子 agent；(2) Work——加载地图 → 认领前沿工单 → 解决 → 记录决议 → 毕业新工单。**每个会话最多解决一个工单**（research 例外）。
