# Matt Pocock Skills 中文文档索引

> 本文件夹收录 [mattpocock-skills 中文提示词大全](../ai/mattpocock-skills-中文提示词大全.md) 中全部 **41 个 skill** 的独立文档，每个 skill 一个文件。
> 生成日期：2026-07-22

## engineering（工程类，17 个）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| [ask-matt](./ask-matt.md) | 手动 | 技能路由器，根据任务推荐合适的 skill 和工作流 |
| [code-review](./code-review.md) | 自动 | 双轴代码审查：编码规范（Standards）+ 需求符合度（Spec） |
| [codebase-design](./codebase-design.md) | 自动 | 深度模块设计词汇体系（接口/接缝/深度/局部性） |
| [diagnosing-bugs](./diagnosing-bugs.md) | 自动 | 六阶段系统化 bug 诊断循环 |
| [domain-modeling](./domain-modeling.md) | 自动 | 维护领域模型：统一术语、消歧、记录 ADR |
| [grill-with-docs](./grill-with-docs.md) | 手动 | 有状态的深度访谈，同步生成 `CONTEXT.md` 和 ADR |
| [implement](./implement.md) | 手动 | 按 spec/ticket 实现功能，驱动 TDD 并自动 code review |
| [improve-codebase-architecture](./improve-codebase-architecture.md) | 手动 | 扫描代码库生成架构改进 HTML 报告并访谈落地 |
| [prototype](./prototype.md) | 自动 | 一次性原型代码，回答"逻辑对不对/长什么样" |
| [research](./research.md) | 自动 | 后台 agent 调研一手资料，产出带引用的报告 |
| [resolving-merge-conflicts](./resolving-merge-conflicts.md) | 自动 | 按双方原始意图逐个解决 git merge/rebase 冲突 |
| [setup-matt-pocock-skills](./setup-matt-pocock-skills.md) | 手动 | 一次性配置仓库基础设施（tracker/标签/领域文档） |
| [tdd](./tdd.md) | 自动 | TDD 红绿循环参考指南：垂直切片、防三大反模式 |
| [to-spec](./to-spec.md) | 手动 | 把对话综合为正式 spec/PRD 并发布到 tracker |
| [to-tickets](./to-tickets.md) | 手动 | 把 spec 拆成带依赖关系的垂直切片工单 |
| [triage](./triage.md) | 手动 | issue/PR 分类状态机流转，产出 agent 可执行简报 |
| [wayfinder](./wayfinder.md) | 手动 | 超大模糊目标规划为决策工单地图，逐个推进 |

## productivity（生产力类，5 个）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| [grill-me](./grill-me.md) | 手动 | 面试式提问入口，实际执行 `/grilling` |
| [grilling](./grilling.md) | 自动 | 对计划/决策逐个深度追问直到共识 |
| [handoff](./handoff.md) | 手动 | 把当前对话压缩成交接文档供新 agent 接手 |
| [teach](./teach.md) | 手动 | 在工作区内搭建结构化课程，跨会话教学 |
| [writing-great-skills](./writing-great-skills.md) | 手动 | 编写高质量 Claude Code skill 的原则与反模式手册 |

## misc（杂项，4 个）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| [git-guardrails-claude-code](./git-guardrails-claude-code.md) | 自动 | 配置 PreToolUse hook 拦截危险 git 操作 |
| [migrate-to-shoehorn](./migrate-to-shoehorn.md) | 自动 | 把测试中的 `as` 断言迁移为 shoehorn 类型安全方案 |
| [scaffold-exercises](./scaffold-exercises.md) | 自动 | 生成符合 lint 规范的课程练习目录结构 |
| [setup-pre-commit](./setup-pre-commit.md) | 自动 | 配置 Husky + lint-staged + typecheck + test 提交门禁 |

## personal（个人专用，2 个）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| [edit-article](./edit-article.md) | 手动 | 按 DAG 依赖重构章节结构并逐段精炼文章 |
| [obsidian-vault](./obsidian-vault.md) | 自动 | 在 Obsidian vault 中用 wikilinks/索引笔记管理知识 |

## in-progress（开发中草稿，9 个）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| [batch-grill-me](./batch-grill-me.md) | 手动 | 按"设计树"分轮次穷尽式前沿提问 |
| [claude-handoff](./claude-handoff.md) | 手动 | 生成交接摘要并用 `claude --bg` 启动后台接手 agent |
| [loop-me](./loop-me.md) | 手动 | 把重复模式访谈成可实施的工作流规格 |
| [setup-ts-deep-modules](./setup-ts-deep-modules.md) | 手动 | 用 dependency-cruiser 把 TS 包封装为深模块边界 |
| [to-questionnaire](./to-questionnaire.md) | 手动 | 把用户答不了的决策转成发给知情者的结构化问卷 |
| [wizard](./wizard.md) | 手动 | 生成交互式 bash 向导脚本引导手动配置/迁移 |
| [writing-beats](./writing-beats.md) | 手动 | 以"接地"约束逐拍组装文章叙事路径 |
| [writing-fragments](./writing-fragments.md) | 手动 | 写作探索期：访谈挖掘原始片段，不施加结构 |
| [writing-shape](./writing-shape.md) | 手动 | 把素材逐段塑造成有论证结构的完整文章 |

## deprecated（已废弃，4 个）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| [design-an-interface](./design-an-interface.md) | 自动 | 并行 sub-agent 生成多种接口设计并对比（Design It Twice） |
| [qa](./qa.md) | 自动 | 口述 bug 交互式 QA 并自动创建 GitHub Issue |
| [request-refactor-plan](./request-refactor-plan.md) | 自动 | 访谈制定渐进式重构计划并归档为 Issue |
| [ubiquitous-language](./ubiquitous-language.md) | 手动 | 提取 DDD 统一语言术语表到 `UBIQUITOUS_LANGUAGE.md` |
