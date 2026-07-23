# Matt Pocock Skills：给 AI 代理的工程技能体系

> 仓库：github.com/mattpocock/skills ｜ 作者：Matt Pocock ｜ 许可证：MIT

---

## 一、解决什么问题？

AI 编码代理有**四大常见失败模式**，这套技能逐一解决：

1. ❌ 代理没做你想要的事 → ✅ 用**"拷问"会话**对齐理解
2. ❌ 代理过于冗长 → ✅ 用**领域建模**建立共享语言
3. ❌ 代码不工作 → ✅ 用**TDD + 调试纪律**建立反馈循环
4. ❌ 代码变成一团泥 → ✅ 用**深度模块设计**对抗熵增

## 二、技能分类

技能按**调用方式**分两类：

1. 🔵 **用户调用**：人输入斜杠命令触发，零上下文负载，但需要人记住它
2. 🟢 **模型调用**：代理自动识别调用，有上下文负载，但可被其他技能引用

> 规则：用户调用技能可以调用模型调用技能，但不能调用另一个用户调用技能。

## 三、安装

**方式一：可编辑安装**

```bash
npx skills@latest add mattpocock/skills
```

选择技能后，务必选 `/setup-matt-pocock-skills`。技能文件复制到项目中，可自由修改。

**方式二：Claude Code 插件（只读、自动更新）**

```bash
claude plugin marketplace add mattpocock/skills
claude plugin install mattpocock-skills@mattpocock
```

安装后，每个仓库运行一次 `/setup-matt-pocock-skills` 配置基础设置。

## 四、核心技能速览

### 🔧 Engineering 技能（17个）

| 技能 | 调用 | 一句话说明 |
|------|------|-----------|
| ask-matt | 用户 | 技能路由器，不知道用哪个就问它 |
| grill-with-docs | 用户 | 拷问会话 + 同步构建领域模型（最推荐入口） |
| grill-me | 用户 | 纯拷问，无代码库时使用 |
| triage | 用户 | Issue 分流：分类、验证、写代理简报 |
| to-spec | 用户 | 对话 → 规格文档（PRD） |
| to-tickets | 用户 | 规格 → 垂直切片工单 |
| implement | 用户 | TDD 驱动实现 + 代码审查收尾 |
| wayfinder | 用户 | 大型工作探路：绘制决策地图 |
| improve-codebase-architecture | 用户 | 扫描深化机会，HTML 报告 + 拷问 |
| setup-matt-pocock-skills | 用户 | 每仓库一次的初始配置 |
| prototype | 模型 | 一次性原型回答设计问题 |
| diagnosing-bugs | 模型 | 六阶段纪律性 Bug 诊断 |
| research | 模型 | 后台代理研究，产出带引用的 Markdown |
| tdd | 模型 | 红-绿循环测试驱动开发 |
| domain-modeling | 模型 | 构建领域词汇表和 ADR |
| codebase-design | 模型 | 深度模块设计词汇 |
| code-review | 模型 | 标准轴 + 规格轴双轴审查 |
| resolving-merge-conflicts | 模型 | 解决 git 合并冲突 |

### 📋 Productivity 技能（5个）

| 技能 | 调用 | 一句话说明 |
|------|------|-----------|
| grill-me | 用户 | 纯拷问（无代码库时） |
| handoff | 用户 | 压缩对话为交接文档 |
| teach | 用户 | 多会话有状态教学 |
| writing-great-skills | 用户 | 编写技能的参考指南 |
| grilling | 模型 | 拷问原语，被其他技能复用 |

## 五、推荐工作流

### 🔄 日常开发

1. `/grill-with-docs` — 磨砺想法，建立共享语言
2. `/to-spec` — 综合讨论为规格
3. `/to-tickets` — 拆分为垂直切片工单
4. `/implement` — TDD 驱动，代码审查收尾
5. 定期 `/improve-codebase-architecture` — 对抗熵增

### 🐛 Bug 修复

1. `/diagnosing-bugs` — 构建反馈循环 → 复现 → 假设 → 修复
2. 发现架构问题 → 交接给 `/improve-codebase-architecture`

### 🗺️ 大型规划

1. `/wayfinder` — 绘制决策地图
2. 路径清晰 → `/to-spec` → `/to-tickets` → `/implement`

### 🔄 会话管理

1. 上下文快满 → `/handoff` 交接新会话
2. 阶段间休息 → `/compact` 压缩当前对话

## 六、核心设计哲学

### 📐 深度模块

来自《A Philosophy of Software Design》：

1. ✅ **好模块**：简单接口 + 复杂实现 = 深度大，调用者轻松
2. ❌ **坏模块**：复杂接口 + 简单实现 = 深度小，调用者负担重

技能体系将此思想贯穿始终：技能本身是深度模块，代码库设计追求深度，测试在接缝处进行。

### 🔥 拷问文化

"拷问"是体系的灵魂——**在行动前先对齐**：

1. 事实不问人，决策必问人
2. 逐个问题，等待每个回答
3. 共享理解达成前，绝不行动

### 📏 垂直切片

1. 每个切片切穿所有层（schema → API → UI → 测试）
2. 完成的切片可独立验证
3. 拒绝水平切片（先写所有测试再写所有实现）

### 🛡️ 反熵增

1. 定期 `/improve-codebase-architecture` 发现深化机会
2. 领域建模保持共享语言不腐化
3. ADR 记录不可逆决策的上下文
4. `.out-of-scope/` 防止范围蔓延

## 七、关键辅助文件

| 文件 | 用途 |
|------|------|
| CONTEXT.md | 领域词汇表，纯术语定义 |
| docs/adr/ | 架构决策记录，极简 1-3 句话 |
| .out-of-scope/ | 被拒绝的功能请求，用于去重 |
| docs/agents/ | 代理配置（追踪器、标签、领域规则） |

---

> 💡 **一句话总结**：这套技能体系的核心是**"先对齐再行动"**——用拷问消除理解偏差，用领域建模建立共享语言，用 TDD 保证代码正确，用深度模块对抗熵增。不是氛围编程，是工程纪律。
