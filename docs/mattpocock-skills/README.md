# Matt Pocock Skills 中文文档索引

> 本文件夹收录 [mattpocock-skills 中文提示词大全](./mattpocock-skills-中文提示词大全.md) 中全部 **38 个 skill** 的独立文档，每个 skill 一个文件。
> 上游同步基线：`49dd158`（v1.3.1 之后，2026-10-09）｜同步日期：2026-10-16
> 各版本差异详见 [上游版本差异](./上游版本差异.md)。

## 推荐工作流（从这里开始）

按处境选一条，每条都有流程图、分步详解与常见陷阱。

| 工作流 | 适用 | 入口 |
|---|---|---|
| ⭐ [总览与选择](./推荐工作流.md) | 不知道该走哪条 | 决策表 |
| 🔄 [日常开发](./工作流-日常开发.md) | 新功能/新想法，准备动手 | `/grill-with-docs` |
| 🐛 [Bug 修复](./工作流-Bug修复.md) | 报错、失败、变慢 | `/diagnosing-bugs` |
| 🗺️ [大型规划](./工作流-大型规划.md) | 目标庞大模糊，一个会话装不下 | `/wayfinder` |
| 🧭 [阶段边界](./工作流-阶段边界.md) | 上下文快满了，横向策略 | 决策树五问 |

## engineering（工程类，20 个）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| [ask-matt](./ask-matt.md) | 手动 | 技能路由器，根据任务推荐合适的 skill 和工作流 |
| [code-review](./code-review.md) | 自动 | 双轴代码审查：编码规范（Standards）+ 需求符合度（Spec） |
| [codebase-design](./codebase-design.md) | 自动 | 深度模块设计词汇体系（接口/接缝/深度/局部性） |
| [diagnosing-bugs](./diagnosing-bugs.md) | 自动 | 六阶段系统化 bug 诊断循环，第一步先脱敏 |
| [domain-modeling](./domain-modeling.md) | 自动 | 维护领域模型：统一术语、消歧、记录 ADR |
| [grill-with-docs](./grill-with-docs.md) | 手动 | 有状态的深度访谈，同步生成 `GLOSSARY.md` 和 ADR |
| [implement](./implement.md) | 手动 | 按 spec/ticket 实现功能，驱动 TDD 并自动 code review |
| [implement-spec](./implement-spec.md) | 手动 | 一次跑完整个 spec：任务图 + 前沿并行 + 集成分支 |
| [improve-codebase-architecture](./improve-codebase-architecture.md) | 手动 | 扫描代码库生成架构改进 HTML 报告并访谈落地 |
| [pr](./pr.md) | 自动 | PR 正文的形状：最小可视化摘要 + 前后证据 + 合并风险判断 |
| [prototype](./prototype.md) | 自动 | 一次性原型代码，回答"逻辑对不对/长什么样" |
| [research](./research.md) | 自动 | 后台 agent 调研一手资料，产出带引用的报告 |
| [retro](./retro.md) | 手动 | 回顾编码会话，改的是 agent 环境而非代码 |
| [setup-matt-pocock-skills](./setup-matt-pocock-skills.md) | 手动 | 一次性配置仓库基础设施（tracker/标签/领域文档） |
| [tdd](./tdd.md) | 自动 | TDD 红绿循环参考指南：垂直切片、防三大反模式 |
| [to-spec](./to-spec.md) | 手动 | 把对话综合为正式 spec 并发布到 tracker |
| [to-tickets](./to-tickets.md) | 手动 | 把 spec 拆成带依赖关系的垂直切片工单 |
| [triage](./triage.md) | 手动 | issue/PR 分类状态机流转，产出 agent 可执行简报 |
| [wayfinder](./wayfinder.md) | 手动 | 超大模糊目标规划为决策工单地图，逐个推进 |
| [wizard](./wizard.md) | 自动 | 生成交互式 bash 向导脚本引导手动配置/迁移 |

## productivity（生产力类，7 个）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| [grill-me](./grill-me.md) | 手动 | 面试式提问入口，实际执行 `/grilling` |
| [grilling](./grilling.md) | 自动 | 对计划/决策逐个深度追问直到共识 |
| [handoff](./handoff.md) | 手动 | 把当前对话压缩成交接文档供新 agent 接手 |
| [teach](./teach.md) | 手动 | 在工作区内搭建结构化课程，跨会话教学 |
| [to-questionnaire](./to-questionnaire.md) | 手动 | 把用户答不了的决策转成发给知情者的结构化问卷 |
| [wait-what](./wait-what.md) | 手动 | "等等"：上一段没听懂，换种方式重新讲 |
| [writing-for-agents](./writing-for-agents.md) | 自动 | 写给 agent 看的文档：编写 skill 与 AGENTS.md/CLAUDE.md 的原则 |

## misc（杂项，4 个）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| [git-guardrails-claude-code](./git-guardrails-claude-code.md) | 自动 | 配置 PreToolUse hook 拦截危险 git 操作 |
| [migrate-to-shoehorn](./migrate-to-shoehorn.md) | 自动 | 把测试中的 `as` 断言迁移为 shoehorn 类型安全方案 |
| [scaffold-exercises](./scaffold-exercises.md) | 自动 | 生成符合 lint 规范的课程练习目录结构 |
| [setup-pre-commit](./setup-pre-commit.md) | 自动 | 配置 Husky + lint-staged + typecheck + test 提交门禁 |

## in-progress（开发中草稿，7 个）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| [chief-of-staff](./chief-of-staff.md) | 手动 | 在单会话内协调 subagent 推进长期目标 |
| [claude-handoff](./claude-handoff.md) | 手动 | 生成交接摘要并用 `claude --bg` 启动后台接手 agent |
| [loop-me](./loop-me.md) | 手动 | 把重复模式访谈成可实施的工作流规格 |
| [setup-ts-deep-modules](./setup-ts-deep-modules.md) | 手动 | 用 dependency-cruiser 把 TS 包封装为深模块边界 |
| [writing-beats](./writing-beats.md) | 手动 | 以"接地"约束逐拍组装文章叙事路径 |
| [writing-fragments](./writing-fragments.md) | 手动 | 写作探索期：访谈挖掘原始片段，不施加结构 |
| [writing-shape](./writing-shape.md) | 手动 | 把素材逐段塑造成有论证结构的完整文章 |

## 已从上游移除的分类

上游 `deprecated/` 目录已清空，`personal/` 目录已整体删除。原收录于此的 6 个 skill 已从上游消失：

| 已移除 Skill | 原分类 | 去向 |
|---|---|---|
| `design-an-interface` | deprecated | 已被 `codebase-design` 的 `DESIGN-IT-TWICE.md` 吸收 |
| `qa` | deprecated | 能力拆入 `triage` / `to-tickets` |
| `request-refactor-plan` | deprecated | 能力拆入 `to-spec` / `improve-codebase-architecture` |
| `ubiquitous-language` | deprecated | 由 `domain-modeling` 取代 |
| `edit-article` | personal | 上游 personal 分类整体移除 |
| `obsidian-vault` | personal | 上游 personal 分类整体移除 |

另有 `engineering/resolving-merge-conflicts`（v1.3.0 删除）与 `in-progress/batch-grill-me`（v1.2.0 删除）已移除，`productivity/writing-great-skills` 已更名为 `writing-for-agents`。

## 本次同步覆盖的上游版本

| 版本 | 发布日期 | 本目录对应状态 |
|---|---|---|
| v1.1.0 | 2026-07-08 | 旧基线（本目录此前版本） |
| v1.2.0 | 2026-08-05 | 已同步：大量重命名/删除/重写 |
| v1.2.2 | 2026-08-05 | 已同步：`writing-for-agents` 恢复模型自动调用 |
| v1.2.3 | 2026-08-06 | 已同步：脱敏章节、去工具专名、进度改按阶段计 |
| v1.3.0 | 2026-09-29 | 已同步：新增 3 个工程技能、`CONTEXT.md`→`GLOSSARY.md` |
| v1.3.1 | 2026-10-04 | 已同步：`ask-matt` 把 bug 后反思路由到 `/retro` |
| HEAD（`49dd158`） | 2026-10-09 | 已同步：尚未发版的多处修正 + 实验技能 `chief-of-staff` |

详细差异见 [上游版本差异](./上游版本差异.md)。
