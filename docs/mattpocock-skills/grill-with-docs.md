# `grill-with-docs`

> **分类**：engineering（工程类）｜**调用方式**：用户手动调用

- **一句话定位**：带文档持久化的深度访谈，在打磨计划或设计的同时，把 ADR 和术语表一路写出来。
- **调用方式**：用户手动调用
- **适用场景**：在**工作目录**里需要打磨想法 / 计划 / 设计时；希望在访谈过程中同步生成 `GLOSSARY.md` 和 ADR 文档时；作为主流程（idea → ship）的起点。
- **核心指令**：
  - 显式调用 Skill 工具两次：一次 `"grilling"`（访谈原语），一次 `"domain-modeling"`（领域建模）。
  - **按轮次运行前沿**：每轮一次提出一组问题，与 `/grilling` 的纪律一致；事实由 agent 补齐，决策归用户。
  - 与 `/grill-me` 的分流：`grill-with-docs` 是**有状态**的，把学到的内容持久化进 `GLOSSARY.md` 和 ADR，留下文档痕迹；`/grill-me` 无状态、不落盘。两者跑同一个 `/grilling` 原语，只要仓库在，`grill-with-docs` 就是严格更好的那个。
