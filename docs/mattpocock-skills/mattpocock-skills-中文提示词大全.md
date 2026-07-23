# Matt Pocock Skills 中文提示词大全

> **来源**：`C:\zy\project_other\skills\skills`（mattpocock-skills 仓库）
> **生成日期**：2026-07-22
> **统计**：共 **41 个 skill**，分布于 6 个分类文件夹

## 分类说明

| 文件夹 | 数量 | 说明 |
|---|---|---|
| `engineering/` | 17 | 日常代码工作（**promoted**，随插件发布） |
| `productivity/` | 5 | 日常非代码工作流工具（**promoted**，随插件发布） |
| `misc/` | 4 | 保留但很少使用，不对外推荐 |
| `personal/` | 2 | 绑定作者个人环境，不对外推荐 |
| `in-progress/` | 9 | 尚未发布的草稿 |
| `deprecated/` | 4 | 已废弃，不再使用 |

> **调用方式说明**：
> - **用户手动调用**：frontmatter 含 `disable-model-invocation: true`，只能由人类显式触发（如 `/skill-name`）
> - **模型自动调用**：Claude 可根据上下文自主触发，用户也可手动调用

---

## 一、engineering（工程类，17 个）

### `ask-matt`

- **一句话定位**：技能路由器——帮你选择当前情境最适合的 skill 或工作流。
- **调用方式**：用户手动调用
- **适用场景**：面对一个任务不知道该用哪个 skill 时；想了解所有可用工作流及其关系时；需要规划从想法到交付的完整路径时。
- **核心指令**：
  - 定义了**主流程**（idea → ship）：`/grill-with-docs`（打磨想法）→ 可选 `/prototype`（原型验证）→ `/to-spec` + `/to-tickets`（多会话构建）或直接 `/implement`（单会话构建）。`/implement` 内部驱动 `/tdd` 做红绿切片，完成后运行 `/code-review`。
  - 定义了**入口匝道**：`/triage`（处理堆积的 bug/需求）、`/diagnosing-bugs`（排查疑难 bug）、`/wayfinder`（应对庞大模糊的工程）。
  - 定义了**代码库健康**维护（`/improve-codebase-architecture`）和**底层词汇层**（`/domain-modeling`、`/codebase-design`）。
  - 强调**上下文卫生**：步骤 1-3 保持同一上下文窗口不压缩；接近 smart zone（~120k tokens）时用 `/handoff` 切换到新会话；`/compact` 用于阶段间的有意中断。

---

### `code-review`

- **一句话定位**：双轴并行的代码审查——同时检查代码是否符合编码规范（Standards）和是否忠实实现了原始需求（Spec）。
- **调用方式**：模型自动调用
- **适用场景**：用户想审查一个分支、PR 或工作变更时；需要"review since X"时；`/implement` 完成后自动触发。
- **核心指令**：
  1. **锚定基准点**：确认用户指定的 commit/branch/tag，用 `git diff <fixed-point>...HEAD`（三点 diff）获取变更，验证基准点有效且 diff 非空。
  2. **定位 Spec 来源**：按优先级查找——commit message 中的 issue 引用 > 用户传入路径 > `docs/`/`specs/`/`.scratch/` 下的匹配文件 > 询问用户。
  3. **定位 Standards 来源**：查找 `CODING_STANDARDS.md`、`CONTRIBUTING.md` 等；同时始终携带一套固定的 Fowler 代码异味基线（12 种，如 Mysterious Name、Feature Envy、Shotgun Surgery 等），仓库文档标准优先级高于基线。
  4. **并行生成两个 sub-agent**：Standards agent 报告违规和异味；Spec agent 报告缺失需求、范围蔓延和实现错误。
  5. **汇总**：分 `## Standards` 和 `## Spec` 两节呈现，不合并不重排，末尾给出每轴的发现总数和最严重问题。

---

### `codebase-design`

- **一句话定位**：深度模块设计的共享词汇体系——为模块的接口、接缝、深度提供统一的精确语言。
- **调用方式**：模型自动调用
- **适用场景**：设计或改进模块接口时；寻找深化机会时；需要让代码更可测试或更易被 AI 导航时；其他 skill 需要深度模块词汇时。
- **核心指令**：
  - **核心术语**（严格使用，不得替换）：Module（有接口和实现的任意规模实体）、Interface（调用者正确使用模块所需知道的一切）、Implementation（模块内部代码）、Depth（接口背后的行为杠杆率）、Seam（接口所在的接缝位置）、Adapter（满足接口的具体实现）、Leverage（调用者获得的回报）、Locality（维护者获得的局部性）。
  - **深度 vs 浅度**：深模块 = 小接口 + 大实现；浅模块 = 大接口 + 薄实现（应避免）。设计时追问：能否减少方法数？能否简化参数？能否隐藏更多复杂度？
  - **核心原则**：深度是接口的属性而非实现的属性；删除测试（删掉模块后复杂度是否集中到调用方）；接口即测试面；一个 adapter 意味假设性接缝，两个才是真实接缝。
  - **可测试性设计**：接受依赖而非创建依赖；返回结果而非产生副作用；小接口面积。

---

### `diagnosing-bugs`

- **一句话定位**：针对疑难 bug 和性能回退的系统化诊断循环——从构建反馈回路到修复并做 post-mortem。
- **调用方式**：模型自动调用
- **适用场景**：用户说"diagnose"/"debug"时；报告某功能损坏/报错/失败/变慢时；遇到间歇性 bug 或两个已知良好状态之间的回归时。
- **核心指令**：
  - **Phase 1——构建反馈回路**（核心技能）：按优先级尝试 10 种方式（失败测试 > curl 脚本 > CLI 对比 > 无头浏览器 > 重放 trace > 一次性 harness > 属性/fuzz > 二分 > 差分 > 人机协作脚本）。循环必须做到紧凑（秒级）、确定性、agent 可运行。非确定性 bug 目标是提高复现率而非完美复现。没有红能力命令则不得进入 Phase 2。
  - **Phase 2——复现 + 最小化**：确认复现的是用户描述的 bug（而非附近的其他 bug），逐步裁剪输入到每个元素都不可删。
  - **Phase 3——假设**：生成 3-5 个排名假设，每个必须可证伪（"如果 X 是原因，那么改变 Y 将…"），展示给用户后再测试。
  - **Phase 4——探测**：每次只改一个变量，优先用 debugger/REPL，所有 debug log 加唯一前缀以便清理。性能问题先测基线再二分。
  - **Phase 5——修复 + 回归测试**：先写回归测试再修复（但必须有正确的接缝）；若无正确接缝，这本身就是发现。
  - **Phase 6——清理 + post-mortem**：移除所有探测、删除临时原型、commit message 写明正确假设；追问"什么能预防这类 bug"，必要时交接给 `/improve-codebase-architecture`。

---

### `domain-modeling`

- **一句话定位**：主动构建和打磨项目的领域模型——统一术语、消除歧义、将关键决策记录为 ADR。
- **调用方式**：模型自动调用
- **适用场景**：需要确定或统一领域术语/泛在语言时；需要记录架构决策（ADR）时；其他 skill 需要维护领域模型时。
- **核心指令**：
  - **文件结构**：单上下文仓库用根目录 `CONTEXT.md` + `docs/adr/`；多上下文仓库用 `CONTEXT-MAP.md` 指向各子目录的 `CONTEXT.md`。文件按需懒创建。
  - **会话中的主动纪律**：
    - **挑战术语冲突**：用户用词与 `CONTEXT.md` 不一致时立即指出。
    - **锐化模糊语言**：对含混或重载的术语提出精确的规范名称。
    - **具体场景压测**：发明边界场景来迫使概念边界清晰化。
    - **代码交叉验证**：用户描述的工作方式与代码不符时立即提出。
    - **即时更新 `CONTEXT.md`**：术语确定后当场更新，不批量处理；`CONTEXT.md` 必须完全不含实现细节。
    - **审慎创建 ADR**：仅当决策同时满足"难以逆转"、"缺乏上下文会令人惊讶"、"经过真实权衡"三个条件时才提议。

---

### `grill-with-docs`

- **一句话定位**：带文档持久化的深度访谈——在打磨设计方案的同时生成 ADR 和领域术语表。
- **调用方式**：用户手动调用
- **适用场景**：有代码库的情况下需要打磨想法/计划/设计时；希望在访谈过程中同步生成 `CONTEXT.md` 和 ADR 文档时；作为主流程（idea → ship）的起点。
- **核心指令**：
  - 运行 `/grilling` 访谈原语，同时驱动 `/domain-modeling` skill。
  - 与 `/grill-me` 的区别：`grill-with-docs` 是有状态的，会将学到的内容持久化到 `CONTEXT.md` 和 ADR 中，留下文档痕迹；`/grill-me` 无状态，不保存任何内容。
  - 两者共享同一个 `/grilling` 底层原语，`grill-with-docs` 是"留痕"版本。

---

### `implement`

- **一句话定位**：基于 spec 或 ticket 实现功能——驱动 TDD 红绿循环并在完成后自动 code review。
- **调用方式**：用户手动调用
- **适用场景**：有明确的 spec 或 ticket 需要实现时；主流程中 `/to-tickets` 拆分后的逐个实现阶段；单会话构建中直接在当前上下文实现。
- **核心指令**：
  - 根据用户提供的 spec 或 ticket 描述来实现工作。
  - 尽可能在预定义的接缝处使用 `/tdd`（测试驱动开发），一个红绿切片一个红绿切片地推进。
  - 定期运行类型检查，定期运行单个测试文件，最后运行一次完整测试套件。
  - 完成后使用 `/code-review` 对工作进行双轴审查（Standards + Spec）。
  - 将工作提交到当前分支。

---

### `improve-codebase-architecture`

- **一句话定位**：扫描代码库寻找深化机会——生成可视化 HTML 报告，然后对用户选择的候选方案进行深度访谈。
- **调用方式**：用户手动调用
- **适用场景**：有空闲时间想改善代码库架构时；想发现浅模块并深化它们时；想提高代码的可测试性和 AI 可导航性时。
- **核心指令**：
  1. **探索**：先确定扫描范围（用户指定 > git log 热点分析），读取 `CONTEXT.md` 和相关 ADR，用 Explore sub-agent 有机地探索代码库，关注浅模块、理解成本高、接缝泄漏、测试困难的区域，对可疑浅模块执行删除测试。
  2. **呈现 HTML 报告**：写入 OS 临时目录的自包含 HTML 文件（Tailwind + Mermaid），每个候选方案包含文件、问题、解决方案、收益（以 locality 和 leverage 表述）、前后对比图、推荐强度（Strong / Worth exploring / Speculative）。末尾给出首选推荐。如有 ADR 冲突须明确标注。报告完成后询问用户选择。
  3. **访谈循环**：用户选定后运行 `/grilling` 讨论决策树，同时用 `/domain-modeling` 保持领域模型更新（新术语写入 `CONTEXT.md`、重要拒绝理由提议 ADR）。使用 `/codebase-design` 的精确词汇，不得漂移为 component/service/API/boundary。

---

### `prototype`

- **一句话定位**：一次性原型代码——用可运行的代码回答一个具体的设计问题（状态模型是否合理 / UI 应该长什么样）。
- **调用方式**：模型自动调用
- **适用场景**：需要验证状态模型/业务逻辑是否合理时；需要探索 UI 应该长什么样时；设计问题难以在纸面上定论时；主流程中需要从 grilling 分支出来用代码回答具体问题时。
- **核心指令**：
  - **选择分支**：根据问题类型选择路径——"逻辑/状态模型是否合理？"→ 构建小型交互式终端应用，推动状态机经过难以推理的边界用例；"应该长什么样？"→ 生成多个截然不同的 UI 变体，通过 URL 参数和浮动底栏切换。
  - **通用规则**：
    1. 从第一天起就是一次性的，命名上让随意读者能看出是原型而非生产代码，放在实际使用位置旁边。
    2. 一条命令运行，使用项目已有的 task runner。
    3. 默认无持久化，状态在内存中；如涉及数据库则用临时库。
    4. 跳过打磨——无测试、无多余错误处理、无抽象。
    5. 每次操作后展示完整状态变化。
    6. 完成后将验证过的决策折入真实代码，原型本身提交到 throwaway 分支，主分支只保留验证过的决策。

---

### `research`

- **一句话定位**：针对高可信一手资料进行调研，并将结果以 Markdown 文件形式保存到仓库中。
- **调用方式**：模型自动调用
- **适用场景**：用户需要调研某个主题、收集文档或 API 事实、将阅读性工作委托给后台 agent 时触发。
- **核心指令**：启动一个**后台 agent** 执行调研，主 agent 继续工作。后台 agent 的职责：(1) 针对**一手资料**（官方文档、源码、规范、第一方 API）进行调查，每个结论都必须追溯到其原始出处，而非二手转述；(2) 将调研结果写成一份 Markdown 文件，每条结论都附上引用来源；(3) 保存到仓库中已有的笔记目录，遵循现有约定，若无约定则放在合理位置并说明存放路径。

---

### `resolving-merge-conflicts`

- **一句话定位**：解决正在进行的 git merge/rebase 冲突。
- **调用方式**：模型自动调用
- **适用场景**：需要解决 git merge 或 rebase 过程中产生的冲突时触发。
- **核心指令**：按以下步骤处理冲突：(1) **查看当前状态**——检查 git 历史和冲突文件；(2) **追溯每个冲突的一手来源**——深入理解每方变更的意图，阅读 commit message、PR、原始 issue/ticket；(3) **逐个解决冲突 hunk**——尽可能保留双方意图，不兼容时选择符合合并目标的方案并记录取舍，**不得**发明新行为，**始终解决**而非 `--abort`；(4) 发现并运行项目的**自动化检查**（通常先 typecheck，再测试，再格式化），修复合并引入的问题；(5) **完成 merge/rebase**——暂存所有文件并提交，若在 rebase 则继续直到所有 commit 完成。

---

### `setup-matt-pocock-skills`

- **一句话定位**：为仓库配置工程技能所需的基础设施——issue tracker、triage 标签体系和领域文档布局。
- **调用方式**：用户手动调用
- **适用场景**：首次使用其他工程技能前运行一次，完成仓库级配置。
- **核心指令**：这是一个**提示驱动**的技能（非确定性脚本），流程为"探索 → 展示 → 确认 → 写入"。**步骤 1 探索**：读取 git remote、CLAUDE.md/AGENTS.md、CONTEXT.md、docs/adr/ 等，判断仓库是否为 monorepo、triage 技能是否已安装。**步骤 2 逐项确认**：Section A 配置 issue tracker（GitHub/GitLab/本地 Markdown/其他）；Section B 配置 triage 标签（仅当 triage 技能已安装时）；Section C 配置领域文档布局（单上下文或多上下文，仅 monorepo 时才提供多上下文选项）。**步骤 3-4**：展示草稿让用户确认，然后写入 `docs/agents/` 下的配置文件，并在 CLAUDE.md 或 AGENTS.md 中添加 `## Agent skills` 段落。**步骤 5**：告知用户设置完成及哪些技能会读取这些配置。

---

### `tdd`

- **一句话定位**：测试驱动开发参考指南——确保 red-green-refactor 循环产出值得保留的测试。
- **调用方式**：模型自动调用
- **适用场景**：用户希望以测试先行方式开发功能或修复 bug、提到"red-green-refactor"、或需要集成测试时触发。
- **核心指令**：**好测试的标准**：测试通过公共接口验证行为，而非实现细节；测试应像规格说明，能经受住重构。**Seam（接缝）**：测试只能放在预先约定的公共边界上，写测试前须与用户确认 seam。**三大反模式**：(1) 实现耦合——mock 内部组件、测试私有方法；(2) 同义反复——断言用与代码相同方式计算期望值；(3) 水平切片——先写所有测试再写所有实现，应改为**垂直切片**（一个测试 → 一个实现 → 循环）。**循环规则**：先写失败测试（red），再写最少代码使其通过（green）；每个周期只处理一个 seam、一个测试、一个最小实现；重构不属于循环，归入 code-review 阶段。

---

### `to-spec`

- **一句话定位**：将当前对话上下文综合为一份规格文档（spec/PRD），并发布到项目 issue tracker。
- **调用方式**：用户手动调用
- **适用场景**：用户希望把已讨论的内容整理成正式规格文档时使用，无需额外访谈。
- **核心指令**：**不采访用户**，直接综合已有对话和代码库理解生成 spec。流程：(1) 探索仓库了解代码现状，使用项目领域术语，遵循相关 ADR；(2) 勾画测试 seam，优先使用现有 seam、尽量高层，新 seam 越少越好（理想数量为 1），与用户确认 seam 是否符合预期；(3) 按模板编写 spec 并发布到 issue tracker，打上 `ready-for-agent` triage 标签。**Spec 模板包含**：Problem Statement、Solution、User Stories（大量编号列表）、Implementation Decisions（不含具体文件路径或代码片段，除非原型产出的关键决策片段）、Testing Decisions、Out of Scope、Further Notes。

---

### `to-tickets`

- **一句话定位**：将计划、规格或对话拆分为一组 tracer-bullet 式垂直切片工单，每个工单声明阻塞依赖关系，发布到配置的 tracker。
- **调用方式**：用户手动调用
- **适用场景**：用户希望把 spec 或讨论结果拆分成可执行的工单时使用。
- **核心指令**：流程：(1) **收集上下文**——从对话或引用的 spec/issue 中获取信息；(2) **探索代码库**——使用项目领域术语，寻找 prefactor 机会（"先让改动变容易，再做容易的改动"）；(3) **拆分垂直切片**——每个切片是端到端的完整路径（跨 schema/API/UI/测试各层），可独立演示，大小适合单个 agent 上下文窗口；为每个工单标注阻塞依赖。**宽幅重构是例外**，采用 expand-contract 模式分步迁移。(4) **向用户确认**——展示编号列表（标题、阻塞关系、交付内容），迭代直到用户批准；(5) **发布工单**——本地 tracker 写入 `.scratch/<feature>/issues/` 下的独立文件，远程 tracker（GitHub 等）创建 issue 并使用原生阻塞关系，打上 `ready-for-agent` 标签。

---

### `triage`

- **一句话定位**：将 issue 和外部 PR 在 triage 状态机中流转——分类、验证、追问、编写 agent 可执行的简报。
- **调用方式**：用户手动调用
- **适用场景**：维护者需要评估和处理 issue tracker 上的 issue 或外部 PR 时使用。
- **核心指令**：**角色体系**：2 个分类角色（bug/enhancement）+ 5 个状态角色（needs-triage → needs-info / ready-for-agent / ready-for-human / wontfix）。**所有 triage 评论必须以 AI 生成免责声明开头**。**查看待处理项**：按未标记、needs-triage、needs-info（有新回复）三桶展示。**处理具体 issue**：(1) 收集上下文——完整阅读 issue/PR，搜索代码库检查是否已实现或被拒绝过；(2) 给出分类和状态建议并等待指示；(3) 验证声明——复现 bug 或确认 PR diff；(4) 必要时运行 grilling 追问；(5) 执行结果——ready-for-agent 发布 agent brief，needs-info 发布 triage notes，wontfix 关闭（区分"已实现"和"被拒绝"，被拒绝的 enhancement 写入 `.out-of-scope/`）。支持快速状态覆盖和恢复上次会话。

---

### `wayfinder`

- **一句话定位**：将超大型工作项规划为 issue tracker 上的决策工单地图，逐个解决直到通往目标的路径清晰。
- **调用方式**：用户手动调用
- **适用场景**：面对一个超出单个 agent 会话容量的大型模糊目标（如制定 spec、锁定决策、规划迁移）时使用。
- **核心指令**：**核心理念**：默认只规划不执行，产出的是决策而非交付物。**地图（Map）** 是 tracker 上的一个 issue（标签 `wayfinder:map`），作为索引指向子工单。**工单类型**：Research（AFK，由 `/research` 子 agent 执行）、Prototype（HITL，制作粗糙原型）、Grilling（HITL，逐个问题追问，默认类型）、Task（HITL/AFK，解除决策阻塞的前置工作）。**战争迷雾**：尚未明确的问题记入"Not yet specified"，等前沿推进后再毕业为工单。**两种调用模式**：(1) Chart——命名目标 → 广度优先 grill 绘制前沿 → 创建地图和工单 → 启动 research 子 agent；(2) Work——加载地图 → 认领前沿工单 → 解决 → 记录决议 → 毕业新工单。**每个会话最多解决一个工单**（research 例外）。

---

## 二、productivity（生产力类，5 个）

### `grill-me`

- **一句话定位**：对用户进行一场严苛的面试式提问，以打磨某个计划或设计方案
- **调用方式**：用户手动调用
- **适用场景**：用户希望用"grill"相关触发词启动一个面试式的深度问答流程
- **核心指令**：此 skill 本身只是一个入口壳，实际执行 `/grilling` 会话。调用后将启动 grilling skill 的完整流程。

---

### `grilling`

- **一句话定位**：针对某个计划、决策或想法，对用户进行持续不断的深度追问
- **调用方式**：模型自动调用
- **适用场景**：用户想要压力测试自己的思考；使用任何"grill"相关触发短语时；需要逐一审查决策树的每个分支
- **核心指令**：
  1. 针对主题的每个方面逐一提问，直到双方达成共识
  2. 每次只问一个问题，等用户回答后再继续——同时问多个问题会令人困惑
  3. 遍历决策树的每个分支，逐一解决决策之间的依赖关系
  4. 每个问题都附带 Claude 推荐的答案供参考
  5. 如果能通过环境（文件系统、工具等）自行查到事实性信息，就自己查，不要问用户；但决策权属于用户，必须询问并等待回答
  6. 在用户确认达成共识之前，不要执行任何操作

---

### `handoff`

- **一句话定位**：将当前对话压缩为交接文档，方便另一个 agent 接手继续工作
- **调用方式**：用户手动调用
- **适用场景**：用户需要在不同会话或 agent 之间传递工作上下文；结束当前会话并希望保留完整的工作进展
- **核心指令**：
  1. 撰写一份交接文档，总结当前对话内容，使全新的 agent 能无缝继续工作
  2. 文档保存到用户操作系统的临时目录（非当前工作区）
  3. 包含"建议使用的 skills"部分，推荐下一个 agent 应调用的 skill
  4. 不要重复其他制品（spec、计划、ADR、issue、commit、diff）中已有的内容，改用路径或 URL 引用
  5. 脱敏处理：隐去 API 密钥、密码、个人身份信息等敏感内容
  6. 如果用户传入了参数，将其视为下一次会话的重点方向，据此调整文档内容

---

### `teach`

- **一句话定位**：在当前工作区内教用户一项新技能或概念，支持跨会话的持续学习
- **调用方式**：用户手动调用
- **适用场景**：用户想要系统性地学习某个主题；希望获得结构化的课程、练习和参考资料
- **核心指令**：
  1. **教学工作区结构**：当前目录作为教学工作区，包含 `MISSION.md`（学习动机）、`RESOURCES.md`（资源列表）、`NOTES.md`（用户偏好笔记）、`./lessons/`（HTML 课程）、`./reference/`（参考文档）、`./learning-records/`（学习记录）、`./assets/`（可复用组件）
  2. **教学哲学**：深度学习需要知识（来自高质量资源）、技能（通过互动课程习得）、智慧（来自社区实践）三要素；区分 fluency（即时提取）与 storage strength（长期记忆），通过检索练习、间隔重复、交错练习来构建长期记忆
  3. **课程设计**：每节课是一个独立 HTML 文件，编号递增；应美观（Tufte 风格）、简短、聚焦一个具体目标，处于用户的最近发展区（ZPD）内；包含锚点链接、推荐一手资料、鼓励向 agent 追问
  4. **组件复用**：`./assets/` 存放共享样式表、quiz 组件等可复用组件，复用是默认行为
  5. **Mission 驱动**：所有课程必须与用户的学习目标（Mission）挂钩；若 Mission 不明确，首先通过提问澄清
  6. **知识与技能**：知识部分降低认知负荷，引用外部资源并附带出处；技能部分增加"必要的难度"，通过即时反馈的互动练习来巩固
  7. **智慧获取**：引导用户加入相关社区（论坛、subreddit 等）在真实场景中检验技能
  8. **参考文档**：创建速查表、术语表等压缩精华文档，供长期反复查阅

---

### `writing-great-skills`

- **一句话定位**：撰写和编辑高质量 Claude Code skill 的参考手册——让 skill 行为可预测的词汇与原则
- **调用方式**：用户手动调用
- **适用场景**：编写新 skill、编辑现有 skill、诊断 skill 行为不符合预期的问题时
- **核心指令**：
  1. **核心原则**：skill 的目标是从随机系统中获取可预测性——agent 每次运行走相同的过程，而非产出相同的结果
  2. **调用方式选择**：model-invoked（自动调用）保留 description，agent 可自主触发，其他 skill 也能引用，但增加 context load；user-invoked（手动调用）设置 `disable-model-invocation: true`，零 context load 但增加用户认知负担。仅当 agent 必须自主触发或有其他 skill 需要引用时才选 model-invoked
  3. **Description 写法**：前置 leading word；每个触发分支只写一个触发条件，合并同义重复；去除正文已涵盖的身份描述
  4. **信息层级**（由近及远）：in-skill step（有序步骤，每步有可检查的完成标准）→ in-skill reference（SKILL.md 内的定义/规则）→ external reference（外部文件，通过 context pointer 按需加载）。过度内联会膨胀，过度外推会隐藏必要信息
  5. **Progressive Disclosure**：将仅部分分支需要的内容推入链接文件，保持 SKILL.md 可读；context pointer 的措辞决定 agent 是否可靠地找到材料
  6. **拆分时机**：按调用拆分（独立 leading word 或被其他 skill 引用时）；按序列拆分（后续步骤诱惑 agent 提前完成当前步骤时）
  7. **Pruning 规则**：保持单一信息源；检查每行的相关性；逐句做 no-op 测试——如果模型默认已遵守则删除整句
  8. **Leading Words**：利用模型预训练中的紧凑概念（如"tight"、"red"）锚定行为，减少 token 同时提升触发和执行的稳定性
  9. **常见失败模式**：premature completion（过早完成，需锐化完成标准）、duplication（多处重复同一含义）、sediment（因不敢删而堆积的过时内容）、sprawl（skill 过长）、no-op（写了模型默认就做的事）、negation（用"不要"来引导反而强化了禁止行为，应改用正面表述）

---

## 三、misc（杂项，4 个）

### `git-guardrails-claude-code`

- **一句话定位**：为 Claude Code 设置 PreToolUse hook，拦截并阻止危险的 git 操作。
- **调用方式**：模型自动调用
- **适用场景**：用户希望防止破坏性 git 操作、添加 git 安全钩子、阻止 Claude 执行 `git push`/`git reset --hard` 等命令时触发。
- **核心指令**：
  1. 询问用户作用范围：仅当前项目（`.claude/settings.json`）还是全局（`~/.claude/settings.json`）。
  2. 将内置的 `block-dangerous-git.sh` 脚本复制到对应位置的 hooks 目录，并 `chmod +x` 赋予执行权限。
  3. 在对应的 settings 文件中注册 `PreToolUse` hook，matcher 为 `Bash`，指向上一步的脚本路径；若 settings 已存在则合并而非覆盖。
  4. 询问用户是否需要增减被拦截的命令模式。
  5. 通过 `echo` 传入 `git push` 的测试 JSON 验证脚本是否返回 exit code 2 并输出 BLOCKED 信息。
  6. 默认拦截的命令包括：`git push`（含 `--force`）、`git reset --hard`、`git clean -f/-fd`、`git branch -D`、`git checkout .`、`git restore .`。

---

### `migrate-to-shoehorn`

- **一句话定位**：将测试文件中的 `as` 类型断言迁移为 `@total-typescript/shoehorn` 的类型安全替代方案。
- **调用方式**：模型自动调用
- **适用场景**：用户提到 shoehorn、希望替换测试中的 `as` 断言、或需要传入部分测试数据时触发。
- **核心指令**：
  1. 仅在测试代码中使用，禁止用于生产代码。
  2. 先向用户了解哪些测试文件存在 `as` 断言问题，是否涉及大对象只需部分属性，以及是否需要故意传入错误数据做异常测试。
  3. 安装 `@total-typescript/shoehorn`。
  4. 用 `grep` 查找测试文件中的 `as` 断言。
  5. 迁移规则：`as Type` → `fromPartial()`（部分数据且类型合规）；`as unknown as Type` → `fromAny()`（故意传入错误类型数据）；`fromExact()` 用于强制完整对象。
  6. 添加 import 语句，运行类型检查验证迁移结果。

---

### `scaffold-exercises`

- **一句话定位**：创建符合 lint 规范的课程练习目录结构，包含 section、problem、solution 和 explainer。
- **调用方式**：模型自动调用
- **适用场景**：用户需要脚手架式创建练习、生成练习存根、或搭建新的课程章节时触发。
- **核心指令**：
  1. 解析计划，提取 section 名称、练习名称和变体类型（problem/solution/explainer）。
  2. 目录命名规则：section 为 `XX-section-name/`，练习为 `XX.YY-exercise-name/`，使用 dash-case 小写加连字符。
  3. 每个练习至少包含 `problem/`（学生工作区）、`solution/`（参考答案）、`explainer/`（概念材料）之一，默认存根为 `explainer/`。
  4. 每个子文件夹必须包含非空的 `readme.md`（至少一行标题）；如有代码还需 `main.ts`。
  5. 创建后运行 `pnpm ai-hero-cli internal lint` 验证，迭代修复直到通过。
  6. 移动/重命名练习必须使用 `git mv` 保留 git 历史，操作后重新 lint。

---

### `setup-pre-commit`

- **一句话定位**：在当前仓库中配置 Husky pre-commit hook，集成 lint-staged（Prettier）、类型检查和测试。
- **调用方式**：模型自动调用
- **适用场景**：用户希望添加 pre-commit 钩子、配置 Husky、设置 lint-staged、或为提交增加格式化/类型检查/测试门禁时触发。
- **核心指令**：
  1. 检测包管理器：根据 lock 文件判断（npm/pnpm/yarn/bun），默认 npm。
  2. 安装 devDependencies：`husky`、`lint-staged`、`prettier`。
  3. 运行 `npx husky init` 初始化，创建 `.husky/` 目录并在 package.json 添加 `prepare` 脚本。
  4. 创建 `.husky/pre-commit`，依次执行 `npx lint-staged`、typecheck、test（后两者若 package.json 无对应脚本则省略并告知用户）。
  5. 创建 `.lintstagedrc`，对所有文件运行 `prettier --ignore-unknown --write`。
  6. 若无 Prettier 配置则创建 `.prettierrc` 默认配置。
  7. 验证各文件就位后，提交所有变更，提交本身会触发 pre-commit hook 作为冒烟测试。

---

## 四、personal（个人专用，2 个）

### `edit-article`

- **一句话定位**：编辑和优化文章，包括重构章节结构、提升清晰度和精炼文笔。
- **调用方式**：用户手动调用
- **适用场景**：用户希望编辑、修订或改进一篇文章草稿时触发。
- **核心指令**：
  1. 首先根据文章标题将文章拆分为若干章节，思考每个章节要传达的核心要点。
  2. 将信息视为有向无环图，确保章节顺序及内容依赖关系合理——前置知识必须先于依赖它的章节出现。
  3. 与用户确认章节划分方案。
  4. 逐章节改写：提升清晰度、连贯性和行文流畅度，每段不超过 240 个字符。

---

### `obsidian-vault`

- **一句话定位**：在 Obsidian vault 中搜索、创建和管理笔记，使用 wikilinks 和索引笔记组织内容。
- **调用方式**：模型自动调用
- **适用场景**：用户希望在 Obsidian 中查找、创建或整理笔记时触发。
- **核心指令**：
  1. Vault 路径为 `/mnt/d/Obsidian Vault/AI Research/`，以扁平结构为主，不依赖文件夹组织，改用链接和索引笔记。
  2. 笔记命名使用 Title Case；索引笔记命名格式为 `XXX Index.md`，内容是相关主题的 `[[wikilinks]]` 列表。
  3. 搜索笔记：通过 `find` + `grep` 按文件名或内容搜索，也可直接使用 Grep/Glob 工具。
  4. 创建笔记：使用 Title Case 文件名，底部添加 `[[wikilinks]]` 关联相关笔记，属于有序序列时使用层级编号。
  5. 查找反向链接：在整个 vault 中 grep 目标笔记的 `[[笔记标题]]` 引用。
  6. 查找索引笔记：搜索文件名含 `Index` 的 `.md` 文件。

---

## 五、in-progress（开发中草稿，9 个）

### `batch-grill-me`

- **一句话定位**：以"设计树"模型对问题空间进行穷尽式前沿提问，直到达成共同理解。
- **调用方式**：用户手动调用
- **适用场景**：需要在动手之前彻底厘清需求、消除隐含假设的设计或规划场景。
- **核心指令**：将问题空间建模为**设计树**，每个决策分支出其子决策。按**轮次**工作：每轮找出所有前置条件已满足的"前沿"问题，编号列出并附推荐答案，等用户回答后再推进。用户回答重塑设计树、解锁下一轮前沿。事实查找（文件系统、工具等）由 sub-agent 完成，不向用户提问可自行查到的信息。当前沿为空时结束，需用户确认已达成共识后方可行动。

---

### `claude-handoff`

- **一句话定位**：将当前对话生成摘要，启动后台 agent 无缝接手继续工作。
- **调用方式**：用户手动调用
- **适用场景**：需要将会话上下文传递给新 agent 继续执行任务时（如长时间运行的工作转交后台）。
- **核心指令**：生成一份 handoff summary 作为新 agent 的 prompt，通过 `claude --bg --name "<描述性名称>" "<摘要>"` 启动后台 agent，立即返回。必须传 `--name` 设置可读名称。摘要中包含"suggested skills"建议新 agent 调用的 skill。不要复制 PRD、计划、ADR、commit diff 等已有制品的内容，用路径/URL 引用。须脱敏 API key、密码、PII 等敏感信息。若用户传入参数，按其描述聚焦摘要内容。

---

### `loop-me`

- **一句话定位**：通过 relentless grilling 为工作流生成可实施规格说明。
- **调用方式**：用户手动调用
- **适用场景**：设计生活/工作中重复出现的模式（loop），将其转化为可执行、可委派的工作流规范。
- **核心指令**：运行有状态的 grilling session，产出工作流规格（`workflows/*.md`）。核心视角：loop 是生活中重复的模式，工作流是其规格化实现。共享词汇按需使用——Trigger（事件/定时触发）、Checkpoint（人工介入点）、Push right（尽量推迟人工确认）、Brief（决策导向的摘要，非原始输出）。规范目标是"实施者无需提问即可构建"。`NOTES.md` 记录用户世界的原始笔记与规范术语；笔记为空时先访谈用户再规范。

---

### `setup-ts-deep-modules`

- **一句话定位**：为 TypeScript monorepo 安装 dependency-cruiser，将每个包封装为"深模块"——实现隐藏于子目录，仅通过根目录入口文件访问。
- **调用方式**：用户手动调用
- **适用场景**：TypeScript 仓库需要建立包边界规则，防止深层私有导入、消除 barrel 文件滥用时。
- **核心指令**：自动检测包管理器（pnpm/yarn/npm/bun）和包根目录，安装 dependency-cruiser 并写入配置（`.cjs`），建立四条 error 级规则：①外部代码只能导入包的根文件（入口点），②包内文件自由互引，③测试只能通过入口点导入（禁止深层导入），④无循环依赖。将 `lint:boundaries` 脚本接入现有 CI check 命令。搭建 example 包作为可复制模板，通过"pass → 故意违规 fail → 还原 pass"三步验证规则生效。最后在包目录写 README 并在 CLAUDE.md/AGENTS.md 中添加索引链接。鼓励多个小入口点，反对 barrel 文件。

---

### `to-questionnaire`

- **一句话定位**：将用户无法独立回答的决策转化为一份结构化问卷，发给知情者填写。
- **调用方式**：用户手动调用
- **适用场景**：用户需要向他人（同事、客户、领域专家）异步收集信息以推进决策时。
- **核心指令**：**访谈"发送"而非"主题"**——只问用户关于接收者身份和所需回报的信息，问题本身瞄准接收者持有而用户缺乏的知识差距。三步流程：①问接收者的角色、专长和关系，②问用户需要从对方获得哪些具体决策依据或事实，③按模板起草问卷，写入 `to-questionnaire-<slug>.md`。文档结构：标题、Purpose、收发方信息、Context 段落、答题说明、按主题分组的问题（重要性降序，每题单一概念、附答案占位和"为何重要"说明）、结尾开放式兜底问题。

---

### `wizard`

- **一句话定位**：生成可交互的 bash 向导脚本，逐步引导用户完成手动配置/迁移流程。
- **调用方式**：用户手动调用
- **适用场景**：第三方服务配置、一次性数据迁移、环境状态切换等涉及打开 URL、复制密钥、写入 `.env`/GitHub Secrets 的繁琐手动操作。
- **核心指令**：基于 `template.sh`（内置进度条、确认门、跨平台 open URL、密钥隐藏输入、幂等 `.env` upsert、`gh secret/variable` 写入）生成向导脚本。四步：①Scope——读取 `.env`、workflow 等文件，梳理所有步骤和捕获值（来源、写入位置、是否 secret）；②Map——为每步写出精确操作路径（URL → 点击位置 → 复制值 → 变量名）；③Author——复制模板，用 `stage`/`say`/`open_url`/`ask_secret`/`write_env`/`set_secret`/`confirm` 等辅助函数编写各阶段，不可修改模板标记以上的库代码；④Verify——`bash -n` + shellcheck 语法检查，静态追踪值流向，不亲自运行（脚本会阻塞等待人工输入）。默认临时脚本，用户要求时才提交入仓。

---

### `writing-beats`

- **一句话定位**：将原始素材组装为"beat 之旅"——逐拍推进文章，每个概念须先"接地"才能被后续使用。
- **调用方式**：用户手动调用
- **适用场景**：写作利用阶段（exploit），已有素材堆，需要以 choose-your-own-adventure 方式构建文章叙事路径。
- **核心指令**：**beat** 是旅程中的一个动作（设场景、落论点、转折等），大小随内容自然决定。**Grounding** 是核心约束：每个概念必须是前置概念（读者自带）或已被之前 beat 引入，未接地的概念不可使用。流程：①与用户确定前置概念，②提供 2-3 个候选起始 beat（各自接地不同概念），用户选一个，③写入该 beat 后重读文件，④基于当前已接地集合提供 2-3 个候选下一 beat（说明每个 beat 接地什么、解锁什么路径），⑤循环直至旅程自然结束。素材是采石场，可拆分重组引用；不要求用完所有素材。每次写入前重读磁盘文件，保留用户编辑。

---

### `writing-fragments`

- **一句话定位**：写作探索阶段——通过 relentless 访谈挖掘原始片段，不施加结构。
- **调用方式**：用户手动调用
- **适用场景**：写作初期，有大量想法但未成型，需要自由探索、积累素材片段，为后续 exploit 阶段（beats/shape）做准备。
- **核心指令**：纯 **explore**，运行 grilling session，从对话中捕获 fragment（片段）追加到单个 Markdown 文件（用 `---` 分隔，无标题、无标签、无排序）。Fragment 定义宽泛：一句话、论点、小故事、半想法、引用、观察列表、punchline，或最有价值的**主导词**（一个精准隐喻/新概念，能撑起整篇文章的结构）。首次写入仅写 H1 工作标题。静默追加，不逐一确认。每次写入前重读磁盘文件，保留用户的编辑、删除和重排操作。

---

### `writing-shape`

- **一句话定位**：将原始素材逐段塑造为一篇完整文章，边写边追加到独立文件。
- **调用方式**：用户手动调用
- **适用场景**：写作利用阶段（exploit），素材堆已固定，需要以段落为单位构建有论证结构的文章。
- **核心指令**：原始素材只读，产出独立文章文件。流程：①通读素材，②与用户确定读者前置概念（Grounding 约束同 beats：概念须先接地才能使用），③起草 2-3 个候选开头（各暗示不同论点/角度），用户选定，④逐段生长——"读者接下来需要听到什么？"从素材矿场提取内容填充，讨论每段格式（prose vs list、callout vs inline、table vs 重复结构），⑤边写边追加，不批处理，⑥循环至用户认为完成。**对话感**：反向 grilling，严格审视每段存在意义（"删掉它会怎样？""开头承诺了 X，我们偏到了 Y"）。素材缺东西时明确指出差距并要求补充或砍段。

---

## 六、deprecated（已废弃，4 个）

### `design-an-interface`

- **一句话定位**：基于"Design It Twice"理念，通过并行 sub-agent 为同一模块生成多种截然不同的接口设计方案并进行对比
- **调用方式**：模型自动调用
- **适用场景**：用户想要设计 API、探索接口选项、比较模块形态，或提到"design it twice"时
- **核心指令**：首先收集模块需求（解决的问题、调用者、关键操作、约束等）；然后用 Task 工具并行启动 3+ 个 sub-agent，每个 agent 在不同约束下（最少方法数、最大灵活性、优化常见场景、借鉴特定范式）产出完全不同的接口设计；依次展示各方案的签名、用法示例和内部隐藏复杂度；从接口简洁性、通用性、实现效率、模块深度等维度对比讨论；最终综合各方案优点，与用户选定最佳设计

---

### `qa`

- **一句话定位**：交互式 QA 会话，用户口述 bug，agent 探索代码库获取上下文后自动创建 GitHub Issue
- **调用方式**：模型自动调用
- **适用场景**：用户想报告 bug、进行 QA 测试、以对话方式提交 issue，或提到"QA session"时
- **核心指令**：对每个问题：先用 2-3 个简短问题澄清（期望 vs 实际、复现步骤、是否稳定复现）；后台启动 Explore agent 学习该区域的领域语言和预期行为；判断是单个 issue 还是需要拆分为多个独立 issue（按可并行修复、独立验证为原则）；用 `gh issue create` 直接提交，issue 内容须持久化（无文件路径/行号）、使用领域语言描述行为而非代码、必含复现步骤；拆分时按依赖顺序创建、标注阻塞关系；完成后打印所有 URL 并询问是否继续

---

### `request-refactor-plan`

- **一句话定位**：通过深度访谈用户，制定详细的渐进式重构计划（拆分为最小提交），并以 GitHub Issue 形式归档
- **调用方式**：模型自动调用
- **适用场景**：用户想规划重构、创建重构 RFC，或将重构拆分为安全的增量步骤时
- **核心指令**：先请用户详细描述问题及可能的解决方案；探索仓库验证用户描述并理解现状；询问是否考虑过其他方案并主动建议；深度访谈确定实现范围和边界（改什么、不改什么）；检查相关区域的测试覆盖情况；遵循 Martin Fowler"每步尽可能小"的原则拆分为 tiny commits 计划；最终按模板创建 GitHub Issue，包含问题陈述、方案、提交计划、决策文档（模块/接口/架构/Schema/API 等）、测试决策、范围外内容，不包含具体文件路径或代码片段

---

### `ubiquitous-language`

- **一句话定位**：从当前对话中提取 DDD 风格的统一语言术语表，标记歧义并推荐规范用词，保存为 `UBIQUITOUS_LANGUAGE.md`
- **调用方式**：用户手动调用（`disable-model-invocation: true`）
- **适用场景**：用户想定义领域术语、构建术语表、统一术语用词，或提到"domain model"、"DDD"、"ubiquitous language"时
- **核心指令**：扫描对话中的领域名词、动词和概念；识别歧义（同词不同义）和同义词（异词同义）问题；提出有主张的规范术语选择；按模板写入 `UBIQUITOUS_LANGUAGE.md`，含分组术语表（Term / Definition / Aliases to avoid）、关系定义、示例对话（3-5 轮 dev 与 domain expert 的对话展示术语用法）、歧义标记；定义须一句话、描述"是什么"而非"做什么"；仅收录领域术语，跳过通用编程概念；重复调用时在已有文件基础上增量更新

---

## 七、快速汇总表

### engineering（工程类）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| `ask-matt` | 手动 | 技能路由器，根据任务推荐合适的 skill 和工作流 |
| `code-review` | 自动 | 双轴代码审查：编码规范（Standards）+ 需求符合度（Spec） |
| `codebase-design` | 自动 | 深度模块设计词汇体系（接口/接缝/深度/局部性） |
| `diagnosing-bugs` | 自动 | 六阶段系统化 bug 诊断循环（反馈回路→复现→假设→探测→修复→复盘） |
| `domain-modeling` | 自动 | 维护领域模型：统一术语、消歧、记录 ADR 到 `CONTEXT.md` |
| `grill-with-docs` | 手动 | 有状态的深度访谈，同步生成 `CONTEXT.md` 和 ADR |
| `implement` | 手动 | 按 spec/ticket 实现功能，驱动 TDD 循环并自动 code review |
| `improve-codebase-architecture` | 手动 | 扫描代码库生成架构改进 HTML 报告并访谈落地 |
| `prototype` | 自动 | 一次性原型代码，回答"逻辑对不对/长什么样"的设计问题 |
| `research` | 自动 | 后台 agent 调研一手资料，产出带引用的 Markdown 报告 |
| `resolving-merge-conflicts` | 自动 | 按双方原始意图逐个解决 git merge/rebase 冲突 |
| `setup-matt-pocock-skills` | 手动 | 一次性配置仓库基础设施（tracker/标签/领域文档） |
| `tdd` | 自动 | TDD 红绿循环参考指南：垂直切片、防三大反模式 |
| `to-spec` | 手动 | 把对话综合为正式 spec/PRD 并发布到 tracker |
| `to-tickets` | 手动 | 把 spec 拆成带依赖关系的垂直切片工单 |
| `triage` | 手动 | issue/PR 分类状态机流转，产出 agent 可执行简报 |
| `wayfinder` | 手动 | 超大模糊目标规划为决策工单地图，逐个推进 |

### productivity（生产力类）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| `grill-me` | 手动 | 面试式提问入口，实际执行 `/grilling` |
| `grilling` | 自动 | 对计划/决策逐个深度追问直到共识，每次只问一个问题 |
| `handoff` | 手动 | 把当前对话压缩成交接文档供新 agent 接手 |
| `teach` | 手动 | 在工作区内搭建结构化课程，跨会话教用户一项技能 |
| `writing-great-skills` | 手动 | 编写高质量 Claude Code skill 的原则与反模式手册 |

### misc（杂项）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| `git-guardrails-claude-code` | 自动 | 配置 PreToolUse hook 拦截危险 git 操作 |
| `migrate-to-shoehorn` | 自动 | 把测试中的 `as` 断言迁移为 shoehorn 类型安全方案 |
| `scaffold-exercises` | 自动 | 生成符合 lint 规范的课程练习目录结构 |
| `setup-pre-commit` | 自动 | 配置 Husky + lint-staged + typecheck + test 提交门禁 |

### personal（个人专用）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| `edit-article` | 手动 | 按 DAG 依赖重构章节结构并逐段精炼文章 |
| `obsidian-vault` | 自动 | 在 Obsidian vault 中用 wikilinks/索引笔记管理知识 |

### in-progress（开发中草稿）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| `batch-grill-me` | 手动 | 按"设计树"分轮次穷尽式前沿提问 |
| `claude-handoff` | 手动 | 生成交接摘要并用 `claude --bg` 启动后台接手 agent |
| `loop-me` | 手动 | 把重复模式访谈成可实施的工作流规格 |
| `setup-ts-deep-modules` | 手动 | 用 dependency-cruiser 把 TS 包封装为深模块边界 |
| `to-questionnaire` | 手动 | 把用户答不了的决策转成发给知情者的结构化问卷 |
| `wizard` | 手动 | 生成交互式 bash 向导脚本引导手动配置/迁移 |
| `writing-beats` | 手动 | 以"接地"约束逐拍组装文章叙事路径 |
| `writing-fragments` | 手动 | 写作探索期：访谈挖掘原始片段，不施加结构 |
| `writing-shape` | 手动 | 把素材逐段塑造成有论证结构的完整文章 |

### deprecated（已废弃）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| `design-an-interface` | 自动 | 并行 sub-agent 生成多种接口设计并对比（Design It Twice） |
| `qa` | 自动 | 口述 bug 交互式 QA 并自动创建 GitHub Issue |
| `request-refactor-plan` | 自动 | 访谈制定渐进式重构计划并归档为 Issue |
| `ubiquitous-language` | 手动 | 提取 DDD 统一语言术语表到 `UBIQUITOUS_LANGUAGE.md` |
