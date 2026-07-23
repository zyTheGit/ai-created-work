# `to-spec`

> **分类**：engineering（工程类）｜**调用方式**：用户手动调用

- **一句话定位**：将当前对话上下文综合为一份规格文档（spec/PRD），并发布到项目 issue tracker。
- **调用方式**：用户手动调用
- **适用场景**：用户希望把已讨论的内容整理成正式规格文档时使用，无需额外访谈。
- **核心指令**：**不采访用户**，直接综合已有对话和代码库理解生成 spec。流程：(1) 探索仓库了解代码现状，使用项目领域术语，遵循相关 ADR；(2) 勾画测试 seam，优先使用现有 seam、尽量高层，新 seam 越少越好（理想数量为 1），与用户确认 seam 是否符合预期；(3) 按模板编写 spec 并发布到 issue tracker，打上 `ready-for-agent` triage 标签。**Spec 模板包含**：Problem Statement、Solution、User Stories（大量编号列表）、Implementation Decisions（不含具体文件路径或代码片段，除非原型产出的关键决策片段）、Testing Decisions、Out of Scope、Further Notes。
