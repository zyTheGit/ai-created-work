# `grill-with-docs`

> **分类**：engineering（工程类）｜**调用方式**：用户手动调用

- **一句话定位**：带文档持久化的深度访谈——在打磨设计方案的同时生成 ADR 和领域术语表。
- **调用方式**：用户手动调用
- **适用场景**：有代码库的情况下需要打磨想法/计划/设计时；希望在访谈过程中同步生成 `CONTEXT.md` 和 ADR 文档时；作为主流程（idea → ship）的起点。
- **核心指令**：
  - 运行 `/grilling` 访谈原语，同时驱动 `/domain-modeling` skill。
  - 与 `/grill-me` 的区别：`grill-with-docs` 是有状态的，会将学到的内容持久化到 `CONTEXT.md` 和 ADR 中，留下文档痕迹；`/grill-me` 无状态，不保存任何内容。
  - 两者共享同一个 `/grilling` 底层原语，`grill-with-docs` 是"留痕"版本。
