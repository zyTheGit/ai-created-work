# `implement-spec`

> **分类**：engineering（工程类）｜**调用方式**：用户手动调用

- **一句话定位**：一次跑完整个 spec 的实施：把工单当作任务图，在就绪的前沿上并行推进，全部落到一条集成分支。
- **调用方式**：用户手动调用
- **适用场景**：`/to-spec` + `/to-tickets` 的产物已在手，希望一次性把整份 spec 建完，而不是逐个工单 `/implement`；在 `ask-matt` 主流程中，它是逐工单 `/implement`（每个之间 `/clear` 上下文）的**并行替代路线**，适合"想编排这次构建而不想自己开每一张工单"的时候。
- **核心指令**：
  1. **任务图与前沿**：工单不是步骤清单，而是带阻塞关系的**任务图**，因此总有一批就绪的**前沿**工单可被抓取。目标是整个 spec 落在**一条集成分支**上，每个工单都按 issue tracker 关闭工作的方式解决。
  2. **稀疏通信 + 上下文指针**：与 subagent 的往来保持稀疏，主要靠**上下文指针**传递（spec、工单、研究笔记、此前的 commit）；指针已能提供的信息不要重复传递。
  3. **步骤**：读 spec 和工单以理解任务图；（可选）先用 **exploration subagent** 做工单所需的探索，并把 markdown 笔记存到仓库之外、所有未来 subagent 都能访问的目录，让 implementer 专心实现而非探索；创建集成分支；用 **implementer subagent** 实施每张工单，各自在自己的 worktree 和自己的分支上，尽可能后台并行以求最大并发。
  4. **每个 implementer**：开工前确认自己的 worktree 基于集成分支（不是就重置过去）；调用 Skill 工具的 `tdd` 来构建该工单；报告完成前把集成分支的尖端合并进自己的分支，使每次合并都是快进。
  5. **合并推进**：implementer 完成后，用 **merger subagent** 把它的工作合并到集成分支；若这改变了可认领工单的**前沿**，就再拉起更多 implementer 去抢新工单，以维持最大并发。
  6. **收尾**：所有工单完成后，在集成分支上调用 Skill 工具的 `code-review`，审查提出的全部问题交给**单个** implementer subagent 一次修完；若存在 draft PR 则标记为 ready for review，否则按 tracker 的方式逐个解决工单并汇报集成分支；最后清理所有 implementer worktree。
  7. **关于 PR**：目标是集成分支而不是 PR。只有当 issue tracker 通过 PR 关闭工作、或用户明确要求时才开 PR，且必须在第一次合并之后（没有领先 main 的提交的分支开不了 PR），并标记它关闭该 spec 与工单；没有 PR 时，工单按 tracker 关闭工作的方式解决。
  8. **前置条件**：issue tracker 应已提供；没提供就**告知用户运行 `/setup-matt-pocock-skills`**（该技能由人类手动执行），而不是默默默认使用 `gh`。
