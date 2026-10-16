# Matt Pocock Skills：给 AI 代理的工程技能体系

> 仓库：github.com/mattpocock/skills ｜ 作者：Matt Pocock ｜ 许可证：MIT
> 本文对应上游 `v1.3.1` 之后（HEAD `49dd158`，2026-10-09）。逐版本差异见 [上游版本差异](./上游版本差异.md)。

---

## 一、解决什么问题？

AI 编码代理有**四大常见失败模式**，这套技能逐一解决：

1. ❌ 代理没做你想要的事 → ✅ 用**"拷问"会话**对齐理解
2. ❌ 代理过于冗长 → ✅ 用**领域建模**建立共享语言，一个词纠正（`/wait-what`）
3. ❌ 代码不工作 → ✅ 用**TDD + 调试纪律**建立反馈循环
4. ❌ 代码变成一团泥 → ✅ 用**深度模块设计**对抗熵增

## 二、技能分类

技能按**调用方式**分两类：

1. 🔵 **用户调用**：人输入斜杠命令触发，零上下文负载，但需要人记住它（人是索引）
2. 🟢 **模型调用**：代理自动识别调用，有上下文负载（常驻 description），但可被其他技能引用

> 规则：**用户调用技能不能调用另一个用户调用技能**，只能调用模型调用技能。跨技能调用统一写成 `Call the Skill tool with "X"`（散文式 "run the `/X` skill" 不可靠，这是 `grill-with-docs` 被报告最多的问题背后的已知粗糙边缘）。若目标技能是用户调用类，源码会让 agent **转告人类去运行 `/X`**。

技能还按**主题桶**分五类：`engineering`（20）、`productivity`（7）、`misc`（4）、`in-progress`（7，beta 频道，有意发布、可单独安装）。`deprecated` 桶已清空，`personal` 桶已整体移除。

## 三、安装

**方式一：Claude Code 官方插件（只读、托管、自动更新，v1.2.0 起推荐）**

```bash
claude plugins install mattpocock-skills
```

或在会话内：

```text
/plugin install mattpocock-skills
```

官方 marketplace 默认已配置，**无需先 `marketplace add`**。若找不到插件，先运行一次 marketplace 更新。

**方式二：skills.sh 通用安装器（可编辑）**

```bash
npx skills@latest add mattpocock/skills
```

这是 Codex 等其他 harness 的路径（原生 Codex 插件暂缓）。选择技能后，务必选 `/setup-matt-pocock-skills`。技能文件复制到项目中，可自由修改。

> 两种方式装好后，**每个仓库运行一次** `/setup-matt-pocock-skills` 配置 issue tracker、triage 标签词汇和领域文档布局。

## 四、核心技能速览

### 🔧 Engineering 技能（20 个）

| 技能 | 调用 | 一句话说明 |
|------|------|-----------|
| ask-matt | 用户 | 技能路由器，不知道用哪个就问它；含阶段边界决策树 |
| grill-with-docs | 用户 | 拷问会话 + 同步构建领域模型（最推荐入口） |
| triage | 用户 | Issue 分流：分类、验证、写代理简报 |
| to-spec | 用户 | 对话 → 规格文档（spec） |
| to-tickets | 用户 | 规格 → 垂直切片工单，声明阻塞边 |
| implement | 用户 | 逐工单 TDD 驱动实现 + 代码审查收尾 |
| implement-spec | 用户 | **一次跑完整个 spec**：任务图 + 前沿并行 + 集成分支 |
| wayfinder | 用户 | 大型工作探路：绘制**决策工单**地图 |
| improve-codebase-architecture | 用户 | 扫描深化机会，HTML 报告 + 拷问 |
| setup-matt-pocock-skills | 用户 | 每仓库一次的初始配置 |
| retro | 用户 | 回顾会话，改的是 **agent 的环境**而非代码 |
| prototype | 模型 | 一次性原型（单个自包含 HTML）回答设计问题 |
| diagnosing-bugs | 模型 | 六阶段纪律性 Bug 诊断，**先脱敏** |
| research | 模型 | 后台代理调研一手资料，产出带引用的 Markdown |
| tdd | 模型 | 红-绿循环测试驱动开发 |
| domain-modeling | 模型 | 构建 `GLOSSARY.md` 和 ADR |
| codebase-design | 模型 | 深度模块设计词汇（含 Design It Twice） |
| code-review | 模型 | 标准轴 + 规格轴双轴审查 |
| pr | 模型 | PR 正文形状：最小可视化摘要 + 前后证据 + 合并风险判断 |
| wizard | 模型 | 生成交互式 bash 向导，带人走只有人能做的步骤 |

### 📋 Productivity 技能（7 个）

| 技能 | 调用 | 一句话说明 |
|------|------|-----------|
| handoff | 用户 | 压缩对话为交接文档（只在上下文需**搬运**时用） |
| teach | 用户 | 多会话有状态教学，产出自包含 HTML 课程 |
| to-questionnaire | 用户 | 把自己答不了的决策转成发给知情者的问卷 |
| wait-what | 用户 | 单字纠正："没听懂，重讲一遍" |
| grilling | 模型 | 拷问原语，按**轮次问前沿** |
| writing-for-agents | 模型 | 写给 agent 看的文档的写作参考手册 |

### 🧪 In-progress 技能（7 个，beta 频道）

| 技能 | 调用 | 一句话说明 |
|------|------|-----------|
| chief-of-staff | 用户 | 实验性：单会话内协调 subagent 推进长期目标 |
| claude-handoff | 用户 | 交接摘要 + `claude --bg` 启动后台接手 agent |
| loop-me | 用户 | 把重复模式访谈成可实施的工作流规格 |
| setup-ts-deep-modules | 用户 | 用 dependency-cruiser 把 TS 包封装为深模块边界 |
| writing-beats | 用户 | 以"接地"约束逐拍组装文章叙事路径 |
| writing-fragments | 用户 | 写作探索期：挖掘原始片段，不施加结构 |
| writing-shape | 用户 | 把素材逐段塑造成有论证结构的完整文章 |

## 五、推荐工作流

四个工作流已拆为独立文档，见左侧菜单「**推荐工作流**」（含流程图、分步详解与常见陷阱）。

| 工作流 | 步骤链 |
|---|---|
| 🔄 [日常开发](./工作流-日常开发.md) | `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement` → `/pr` → `/retro`，定期 `/improve-codebase-architecture` |
| 🐛 [Bug 修复](./工作流-Bug修复.md) | `/diagnosing-bugs`（**第一动作是脱敏**）→ 落地后 `/retro`；结论是缺好接缝时才去 `/improve-codebase-architecture` |
| 🗺️ [大型规划](./工作流-大型规划.md) | `/wayfinder` 绘制决策工单地图 → 路清晰后 `/to-spec` → `/to-tickets` → `/implement`（**不要**把地图直接接进 `/implement`） |
| 🧭 [阶段边界](./工作流-阶段边界.md) | phase 之间五选一，**按序排除**：continue → `/clear` → `/handoff` → subagent → `/compact` |

> **上下文卫生**：`/grill-with-docs` → `/to-spec` → `/to-tickets` 三步保持同一个未压缩的上下文窗口，`/to-tickets` 之后才 compact 或 clear。智能区上限按 **150k** tokens 估算（旧文档的 120k 已过时）。

## 六、核心设计哲学

### 📐 深度模块

来自《A Philosophy of Software Design》：

1. ✅ **好模块**：简单接口 + 复杂实现 = 深度大，调用者轻松
2. ❌ **坏模块**：复杂接口 + 简单实现 = 深度小，调用者负担重

技能体系将此思想贯穿始终：技能本身是深度模块，代码库设计追求深度，测试在接缝处进行（`tdd` 会说明每个提议接缝**能挡住什么、会漏掉什么**）。

### 🔥 拷问文化

"拷问"是体系的灵魂，**在行动前先对齐**：

1. **事实不问人，决策必问人**：环境能查到的事实派 subagent 去查，决策权永远摆给用户
2. **按轮次问前沿**，不是一次一问。前沿是前置条件已定的全部决策；一轮问完整个前沿（编号 + 每题附推荐答案），答完重算前沿再问下一轮。同样 13 个问题约 3 轮问完
3. **每个问题措辞成"是"即接受推荐**，让用户用一个字就能认可你的建议
4. 前沿为空中、没有任何东西被默默假定时才收尾；共识达成前绝不行动

### 📏 垂直切片

1. 每个切片切穿所有层（schema → API → UI → 测试）
2. 完成的切片可独立验证
3. 拒绝水平切片（先写所有测试再写所有实现）

### 🛡️ 反熵增

1. 定期 `/improve-codebase-architecture` 发现深化机会（Explore 步骤带 YAGNI 范围过滤：读最近约 20 条 commit，偏向活跃路径）
2. 领域建模保持共享语言不腐化
3. ADR 记录不可逆决策的上下文
4. `SCOPE.md` / `.out-of-scope/` 防止范围蔓延，被拒请求在此去重

## 七、关键辅助文件

| 文件 | 用途 |
|------|------|
| `GLOSSARY.md` | 领域词汇表，纯术语定义（**v1.3.0 前叫 `CONTEXT.md`**，多上下文仓库用 `GLOSSARY-MAP.md` 索引） |
| `docs/adr/` | 架构决策记录，极简 1-3 句话 |
| `SCOPE.md` | 项目范围声明，triage 据此拒绝范围外 issue |
| `.out-of-scope/` | 被拒绝的功能请求，用于去重 |
| `docs/agents/` | 代理配置（tracker 说明、triage-labels） |
| `.scratch/<feature>/issues/<NN>-<slug>.md` | 本地 markdown tracker 的工单，**一文件一工单**（不再是单个 `tickets.md`）；同目录下 spec 文件叫 `spec.md` |

> ⚠️ 若仓库里已有旧的 `CONTEXT.md`，用 `git mv CONTEXT.md GLOSSARY.md` 改名。技能从此只找新名字。

---

> 💡 **一句话总结**：这套技能体系的核心是**"先对齐再行动"**：用拷问消除理解偏差，用领域建模建立共享语言，用 TDD 保证代码正确，用深度模块对抗熵增。不是氛围编程，是工程纪律。
