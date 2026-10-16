# `to-spec`

> **分类**：engineering（工程类）｜**调用方式**：用户手动调用

- **一句话定位**：将当前对话上下文综合为一份规格文档（spec），并发布到项目 issue tracker；"spec"是唯一术语，不再称 PRD。
- **调用方式**：用户手动调用
- **适用场景**：用户希望把已讨论的内容整理成正式规格文档时使用，无需额外访谈。
- **核心指令**：**不采访用户**，直接综合已有对话和代码库理解生成 spec。issue tracker 与 triage 标签词汇本应已提供；若没有，**告知用户去运行 `/setup-matt-pocock-skills`**，不要试图用 Skill tool 调它。流程：(1) 探索仓库了解代码现状，全文使用项目领域术语表的词汇，遵循所涉区域的 ADR；(2) 勾画将要测试该功能的接缝，优先现有接缝、尽量取高层，新接缝越少越好（理想数量为 1），并与用户确认这些接缝符合预期；(3) 按模板编写 spec 并发布到 issue tracker，打上 `ready-for-agent` triage 标签，不需要额外 triage。**Spec 模板包含**：Problem Statement（用户视角的问题）、Solution（用户视角的方案）、User Stories（极长的编号列表，格式 `As an <actor>, I want a <feature>, so that <benefit>`）、Implementation Decisions（要建 / 改的模块及其接口、技术澄清、架构决策、schema 变更、API 契约；**不含**具体文件路径或代码片段，除非原型产出的某个片段比散文更精确地编码了决策，如状态机、reducer、schema、类型形状，则内联并注明来自原型，只留决策丰富的部分）、Testing Decisions（什么是好测试、测哪些模块、测试的先例）、Out of Scope、Further Notes。
