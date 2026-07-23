# 多 Agent 工具策略 — Skills / MCP / 缓存 / 项目规范

> 适用工具：Claude Code + Zed Agent + Codex CLI（未来）
> 核心原则：**AGENTS.md 是跨工具共享规范，CLAUDE.md 是 Claude Code 增强层**
> 更新时间：2026-07-07（基于 Codex CLI 官方文档修正）

---

## 一、问题定义

你在使用/将要使用多个 AI Agent 工具：

| 工具 | 当前状态 | 定位 |
|------|----------|------|
| **Claude Code** | ✅ 主力使用 | 终端 AI 编码，复杂任务 |
| **Zed Agent 面板** | ✅ 已配置 | 编辑器内 AI 辅助，轻量任务 |
| **Codex CLI** | 🔄 未来可能 | OpenAI 的终端 Agent，沙箱执行 |

三个工具各有配置格式，但核心需求相同：
- 项目规范（怎么写代码）
- MCP 服务器（怎么连接外部工具）
- 技能/命令（怎么执行常用操作）
- 缓存/上下文（怎么记住历史）

**关键发现**：**Zed 和 Codex CLI 都读取 `AGENTS.md`**，这决定了我们的架构策略。

---

## 二、三工具配置体系对比

### 2.1 项目规范文件

| 特性 | Claude Code | Zed Agent | Codex CLI |
|------|-------------|-----------|-----------|
| **规范文件** | `CLAUDE.md` | `AGENTS.md` | `AGENTS.md` ✅ |
| **文件位置** | 项目根目录 | 项目根目录 | 项目根目录 |
| **嵌套覆盖** | 不支持 | 不支持 | `AGENTS.override.md` 子目录覆盖 |
| **全局规范** | `~/.claude/CLAUDE.md` | `~/AppData/Roaming/Zed/AGENTS.md` | `~/.codex/` 目录下 |
| **Rules 系统** | `.claude/rules/*.md` | 无 | `.codex/rules/*.rules` |
| **额外指令** | Rules 前缀匹配路径 | 无 | `developer_instructions` (config.toml) |

> ⚡ **关键**：`AGENTS.md` 是 Zed 和 Codex CLI **共同读取**的文件，这是跨工具共享规范的基础。

### 2.2 配置目录结构

| 特性 | Claude Code | Zed Agent | Codex CLI |
|------|-------------|-----------|-----------|
| **配置目录** | `.claude/` | `.zed/` | `.codex/` |
| **配置格式** | JSON (settings.json) | JSON (settings.json) | **TOML** (config.toml) |
| **项目级配置** | `.claude/settings.local.json` | `.zed/settings.json` | `.codex/config.toml` |
| **全局配置** | `~/.claude/settings.json` | `~/AppData/Roaming/Zed/settings.json` | `~/.codex/config.toml` |
| **Hook 支持** | ✅ `.claude/hooks/` | 无 | ✅ `.codex/hooks/` |
| **Rules 支持** | ✅ `.claude/rules/` | 无 | ✅ `.codex/rules/*.rules` |
| **Commands/Skills** | `.claude/commands/*.md` | 无 | 通过 AGENTS.md 定义 |
| **Agent 定义** | `.claude/agents/*.md` | 无 | 无（内置） |
| **Memory 系统** | `.claude/memory/` | 无 | 无 |
| **插件系统** | `.claude/plugins/` | Zed Extensions | 无 |

### 2.3 MCP 配置方式

| 特性 | Claude Code | Zed Agent | Codex CLI |
|------|-------------|-----------|-----------|
| **配置位置** | `settings.json` → `mcpServers` | `settings.json` → `context_servers` | `config.toml` → `[mcp_servers.*]` |
| **添加方式** | 手动编辑 JSON | 手动编辑 JSON | `codex mcp add` 命令或编辑 TOML |
| **格式** | JSON | JSON | TOML |
| **项目级 MCP** | ✅ 支持 | ❌ 仅全局 | ✅ `.codex/config.toml`（需 trusted） |

### 2.4 安全与执行模型

| 特性 | Claude Code | Zed Agent | Codex CLI |
|------|-------------|-----------|-----------|
| **安全机制** | Hook 拦截 | 工具权限配置 | **沙箱隔离** + 审批策略 |
| **审批模式** | 权限弹窗 | 权限配置 | `suggest` / `auto-edit` / `full-auto` |
| **沙箱模式** | 无 | 无 | `read-only` / `workspace-write` / `full-access` |
| **项目信任** | 无 | 无 | trusted / untrusted 项目区分 |

---

## 三、架构设计：AGENTS.md 为共享中心

### 3.1 核心架构

```
┌──────────────────────────────────────────────────────────────┐
│               AGENTS.md — 跨工具共享规范（中心）               │
│                                                               │
│  ✅ Zed Agent 读取                                            │
│  ✅ Codex CLI 读取                                            │
│  ✅ Claude Code 也可读取（作为基础规范）                       │
│                                                               │
│  内容：技术栈、代码规范、项目结构、常用命令、工程约束            │
├──────────────────────────────────────────────────────────────┤
│               CLAUDE.md — Claude Code 增强层                   │
│                                                               │
│  ✅ Claude Code 读取（优先级高于 AGENTS.md）                   │
│                                                               │
│  内容：AGENTS.md 的全部内容 + Claude Code 特有配置             │
│  - fnm/uv 环境规则                                            │
│  - Memory/Rules 引用                                          │
│  - Hook 行为说明                                              │
│  - Agent 使用策略                                             │
│  - 自演进系统协议                                             │
├──────────────────────────────────────────────────────────────┤
│               .codex/ — Codex CLI 增强层（未来）               │
│                                                               │
│  ✅ Codex CLI 读取（仅 trusted 项目）                          │
│                                                               │
│  内容：config.toml、rules、hooks                               │
│  - 沙箱策略配置                                               │
│  - 审批策略配置                                               │
│  - MCP 服务器                                                 │
│  - 项目级 Rules                                               │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 项目目录结构

```
project/
├── AGENTS.md                  ← 跨工具共享规范（Zed + Codex 都读取）
├── CLAUDE.md                  ← Claude Code 增强层（包含 AGENTS.md 内容 + 特有配置）
├── .claude/                   ← Claude Code 配置目录
│   ├── settings.local.json    ← 项目权限
│   ├── rules/                 ← Claude Code 路径规则
│   │   ├── coding.md
│   │   ├── security.md
│   │   └── ...
│   ├── commands/              ← 自定义命令
│   │   ├── code-review.md
│   │   ├── new-component.md
│   │   └── ...
│   ├── agents/                ← Agent 定义
│   ├── hooks/                 ← Hook 脚本
│   └── memory/                ← 项目记忆
│       └── MEMORY.md
├── .zed/                      ← Zed 项目级配置
│   └── settings.json
├── .codex/                    ← Codex CLI 配置（未来，接入时创建）
│   ├── config.toml            ← 项目级配置（模型、沙箱、MCP）
│   ├── rules/                 ← Codex Rules
│   │   └── default.rules
│   └── hooks/                 ← Codex Hooks
│       ├── pre_tool_use_policy.py
│       └── post_tool_use_review.py
└── src/                       ← 项目代码
```

### 3.3 AGENTS.md 与 CLAUDE.md 的内容分工

**关键决策**：CLAUDE.md 应该**包含** AGENTS.md 的全部内容，而不是反过来。

```
原因：
1. Claude Code 优先读取 CLAUDE.md，不会自动读取 AGENTS.md
2. Zed 和 Codex 读取 AGENTS.md，不会读取 CLAUDE.md
3. 所以 CLAUDE.md = AGENTS.md 公共内容 + Claude Code 特有内容
4. AGENTS.md 独立维护，作为跨工具共享的基准

维护策略：
- 修改 AGENTS.md → 手动同步到 CLAUDE.md 的公共部分
- 修改 CLAUDE.md 特有部分 → 不影响 AGENTS.md
- 或：CLAUDE.md 开头声明"公共部分见 AGENTS.md"
```

**AGENTS.md 示例**（跨工具共享）：
```markdown
# 项目名称

## 技术栈
Vue3 + TypeScript + Element Plus + Vite

## 代码规范
- 使用 Composition API + <script setup lang="ts">
- 命名：组件 PascalCase，文件 kebab-case
- 禁止 console.log / debugger / any 类型
- 错误处理：必须 try-catch，不吞异常

## 项目结构
src/
├── components/    # 公共组件
├── views/         # 页面
├── api/           # API 接口
├── utils/         # 工具函数
└── types/         # 类型定义

## 常用命令
- npm run dev      # 开发
- npm run build    # 构建
- npm run lint     # 代码检查
- npm run test     # 测试

## 提交规范
- 格式：feat/fix/docs: 简短描述
- 修改后必须验证：lint + type-check + build

## 环境要求
- Node.js：通过 fnm 管理
- Python：通过 uv 管理
```

**CLAUDE.md 示例**（Claude Code 增强版）：
```markdown
# 项目名称

## 公共规范
> 以下内容与 AGENTS.md 保持同步，修改时请同步更新 AGENTS.md

[AGENTS.md 的全部内容复制到这里]

## Claude Code 特有配置

### 环境管理
- 使用 fnm 管理 Node.js 版本
- 使用 uv 管理 Python 包
- UV_MANAGED_PYTHON=1 已全局设置

### Rules 体系
- `.claude/rules/code-modification-workflow.md` — 代码修改执行规范
- `.claude/rules/coding.md` — 编码标准
- `.claude/rules/security.md` — 安全规则
- `.claude/rules/context7.md` — 文档查询规则

### 自定义命令
- `/code-review` — 代码审查
- `/new-component` — 创建新组件
- `/fix-bug` — Bug 修复
- `/gen-test` — 生成测试

### Agent 使用策略
- 架构设计 → architect agent
- 代码审查 → reviewer / code-reviewer agent
- Bug 修复 → debugger agent
- 测试编写 → test-engineer agent

### Hook 系统
- PreToolUse(Bash)：destructive-guard、branch-guard、secret-guard
- PostToolUse(Edit|Write)：syntax-check
- PostToolUse(全局)：context-monitor

### 自演进系统
- `/boot` — 验证系统完整性
- `/evolve` — 审计 corrections，促进规则升级
- `/review` — 代码审查
```

---

## 四、MCP 服务器：统一注册 + 各工具分发

### 4.1 各工具 MCP 配置格式

**Claude Code**（`settings.json`）：
```json
{
  "mcpServers": {
    "chrome-devtools-mcp": {
      "command": "fnm",
      "args": ["exec", "--", "node", "path/to/chrome-devtools-mcp.js"]
    }
  }
}
```

**Zed**（`settings.json`）：
```json
{
  "context_servers": {
    "mcp-server-context7": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-context7"],
      "env": { "CONTEXT7_API_KEY": "..." }
    }
  }
}
```

**Codex CLI**（`config.toml`）：
```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@anthropic-ai/mcp-server-context7"]

[mcp_servers.context7.env]
CONTEXT7_API_KEY = "your-key"

# 或使用 URL 方式（SSE MCP）
[mcp_servers.linear]
url = "https://mcp.linear.app/mcp"
```

**Codex CLI 添加 MCP 命令**：
```bash
# 命令行方式
codex mcp add context7 -- npx -y @anthropic-ai/mcp-server-context7

# URL 方式
codex mcp add linear --url https://mcp.linear.app/mcp

# 登录认证
codex mcp login linear
```

### 4.2 MCP 分配矩阵

| MCP 服务器 | Claude Code | Zed Agent | Codex CLI | 说明 |
|------------|:-----------:|:---------:|:---------:|------|
| **chrome-devtools-mcp** | ✅ | 🔲 | 🔲 | 前端调试 |
| **commonplace-mcp** | ✅ | ❌ | ❌ | 个人知识库 |
| **context7** | ✅ (find-docs skill) | ✅ | ✅ | 文档查询（跨工具通用） |
| **codegraph** | ✅ | ❌ | ❌ | 代码图谱 |
| **Codex MCP Server** | ❌ | ❌ | ✅ (内置) | Codex 自身作为 MCP |

### 4.3 Codex CLI 接入时 MCP 配置

```bash
# 1. 通过 CLI 添加（推荐）
codex mcp add context7 -- npx -y @anthropic-ai/mcp-server-context7

# 2. 或手动编辑 ~/.codex/config.toml
# [mcp_servers.context7]
# command = "npx"
# args = ["-y", "@anthropic-ai/mcp-server-context7"]

# 3. 验证
codex "使用 context7 查询 Vue3 的文档"
```

---

## 五、Skills / Commands：跨工具技能组织

### 5.1 各工具的技能机制

| 特性 | Claude Code | Zed Agent | Codex CLI |
|------|-------------|-----------|-----------|
| **技能格式** | `.claude/commands/*.md` | 无独立技能 | 通过 AGENTS.md 定义工作流 |
| **技能调用** | `/command-name` | 直接描述 | 按描述执行 |
| **参数传递** | `$ARGUMENTS` | 无 | 无 |
| **Agent 定义** | `.claude/agents/*.md` | 无 | 无（通过 OpenAI Agents SDK） |
| **插件系统** | `.claude/plugins/` | Zed Extensions | 无 |

### 5.2 跨工具技能策略

```
核心策略：

1. 纯 Prompt 技能 → 在 AGENTS.md 中定义通用版本
   - Zed Agent：直接描述即可
   - Codex CLI：通过 AGENTS.md 自动加载
   - Claude Code：通过 .claude/commands/ 提供增强版（带 $ARGUMENTS）

2. 依赖脚本/工具的技能 → 仅 Claude Code
   - daily-report（Python 脚本）
   - docx/pdf/pptx/xlsx（Python 脚本）
   - zentao-bug-sync（API + Python）

3. 依赖 MCP 的技能 → 按工具配置情况
   - find-docs → Claude Code (skill) / Zed (context7 MCP) / Codex (context7 MCP)
   - codegraph → 仅 Claude Code
```

### 5.3 在 AGENTS.md 中定义通用工作流

```markdown
## 代码审查工作流

当被要求审查代码时，按以下维度进行：
1. 正确性：逻辑错误、边界情况
2. 安全性：XSS、注入、权限
3. 性能：不必要渲染、内存泄漏
4. 可维护性：命名、结构、复杂度
5. 一致性：与项目现有代码风格

输出格式：P0(必须修复) / P1(强烈建议) / P2(建议) / P3(可选)

## 新建组件工作流

当被要求创建新组件时：
1. 先阅读 src/components/ 下的现有组件，理解代码风格
2. 使用 Composition API + TypeScript
3. 定义 props 类型、emits 类型
4. 提供使用示例注释
5. 创建后运行 npm run lint 验证

## Bug 修复工作流

当被要求修复 Bug 时：
1. 先阅读相关代码，理解上下文
2. 分析 Bug 根因
3. 给出修复方案
4. 实施修复
5. 运行 npm run lint && npm run test 验证
```

**这样做的好处**：
- Zed Agent 和 Codex CLI 都能自动获取这些工作流
- Claude Code 可以有更详细的版本（带参数、Agent 分派等）

---

## 六、缓存与上下文：跨工具记忆管理

### 6.1 各工具的缓存机制

| 特性 | Claude Code | Zed Agent | Codex CLI |
|------|-------------|-----------|-----------|
| **对话历史** | `.claude/projects/` | `AppData/Local/Zed/threads/` | `~/.codex/` + SQLite |
| **项目记忆** | `.claude/memory/` | 无 | 无 |
| **全局规范** | `~/.claude/CLAUDE.md` | 全局 AGENTS.md | `~/.codex/` config |
| **上下文压缩** | `/compact` | 无 | `model_auto_compact_token_limit` |
| **会话恢复** | 自动恢复 | 线程管理 | 历史记录 |
| **运行状态** | 无 | 无 | SQLite (`sqlite_home`) |

### 6.2 记忆架构

```
Claude Code（记忆中心 — 唯一写入者）
├── .claude/memory/           ← 结构化记忆（核心）
│   ├── corrections.jsonl     ← 纠错记录
│   ├── observations.jsonl    ← 观察记录
│   ├── learned-rules.md      ← 已验证的规则
│   └── evolution-log.md      ← 进化日志
├── .claude/rules/            ← 路径规则（Claude Code 独有）
├── CLAUDE.md                 ← 增强版规范（含 AGENTS.md 内容）
└── /boot /evolve /review     ← 记忆管理命令

AGENTS.md（跨工具共享 — 所有工具读取）
└── 技术栈 + 代码规范 + 命令 + 工作流

Codex CLI（记忆消费者 + 本地状态）
├── AGENTS.md                 ← 共享规范
├── .codex/config.toml        ← 项目级配置
├── .codex/rules/             ← 项目级规则
├── .codex/hooks/             ← 项目级钩子
└── ~/.codex/sqlite_home/     ← 运行时状态（SQLite）

Zed Agent（记忆消费者 — 最轻量）
├── AGENTS.md                 ← 共享规范
└── settings.json             ← 工具配置
```

### 6.3 记忆同步流程

```
1. Claude Code 中工作 → 积累 corrections/observations
2. 运行 /evolve → promoted rules 写入 learned-rules.md
3. 高频规则沉淀到 AGENTS.md（公共规范）→ 同时更新 CLAUDE.md
4. AGENTS.md 变更 → Zed 和 Codex 下次自动读取
5. Codex 项目级 Rules → 在 .codex/rules/ 中单独维护

关键原则：
- AGENTS.md 是跨工具的"公共规范"，所有工具共享
- Claude Code 的 Memory/Rules 是"私有记忆"，仅 Claude Code 使用
- Codex 的 .codex/ 是"项目增强配置"，仅 Codex 使用
- 只改 AGENTS.md → 所有工具立即生效
- 只改 CLAUDE.md → 仅 Claude Code 生效
- 只改 .codex/ → 仅 Codex 生效
```

---

## 七、Codex CLI 接入完整方案

### 7.1 Codex CLI 核心特性（基于官方文档）

```
Codex CLI 是 OpenAI 推出的终端 Agent 工具：

核心能力：
├── 沙箱执行：代码在 Docker 沙箱中运行，安全隔离
├── 审批策略：suggest / auto-edit / full-auto 三级
├── MCP 支持：通过 config.toml 配置，支持 CLI 添加
├── AGENTS.md：项目规范自动加载
├── Rules 系统：.codex/rules/*.rules
├── Hooks 系统：.codex/hooks/（Python 脚本）
├── 项目信任：trusted / untrusted 项目区分
├── 自身作为 MCP：codex mcp-server 可被其他工具调用
├── 模型：GPT-4o / o3 / gpt-5.5 等
└── 多平台：macOS / Windows / Linux

配置层级（从低到高优先级）：
1. 系统层：内置默认
2. 用户层：~/.codex/config.toml
3. 项目层：.codex/config.toml（仅 trusted 项目）
```

### 7.2 与 Claude Code 的详细对比

```
┌───────────────────┬───────────────────────┬───────────────────────┐
│                   │ Claude Code           │ Codex CLI             │
├───────────────────┼───────────────────────┼───────────────────────┤
│ 规范文件          │ CLAUDE.md             │ AGENTS.md             │
│ 配置格式          │ JSON (settings.json)  │ TOML (config.toml)    │
│ 模型              │ Claude 系列           │ GPT-4o / o3 / gpt-5   │
│ 执行环境          │ 本地直接执行          │ Docker 沙箱隔离       │
│ 安全机制          │ Hook 拦截             │ 沙箱 + 审批策略       │
│ 审批模式          │ 权限弹窗              │ suggest/auto-edit/    │
│                   │                       │ full-auto             │
│ 沙箱模式          │ 无                    │ read-only/            │
│                   │                       │ workspace-write/      │
│                   │                       │ full-access           │
│ MCP 配置          │ settings.json         │ config.toml /         │
│                   │                       │ codex mcp add         │
│ Rules 系统        │ .claude/rules/*.md    │ .codex/rules/*.rules  │
│ Hooks 系统        │ .claude/hooks/ (Bash) │ .codex/hooks/ (Python)│
│ 自定义命令        │ .claude/commands/     │ 通过 AGENTS.md 定义   │
│ Agent 定义        │ .claude/agents/       │ OpenAI Agents SDK     │
│ 记忆系统          │ .claude/memory/       │ 无                    │
│ 插件系统          │ .claude/plugins/      │ 无                    │
│ 上下文压缩        │ /compact              │ config.toml 配置      │
│ 项目信任          │ 无                    │ trusted/untrusted     │
│ 自身作为 MCP      │ ❌                    │ ✅ codex mcp-server   │
│ 状态持久化        │ 文件                  │ SQLite                │
└───────────────────┴───────────────────────┴───────────────────────┘
```

### 7.3 接入步骤

```
第 1 步：安装 Codex CLI
# 方式 1：npm
npm install -g @openai/codex

# 方式 2：Homebrew（macOS）
brew install openai-codex

# 方式 3：独立安装脚本
# 参考 https://developers.openai.com/codex/quickstart

第 2 步：登录
codex
# 使用 ChatGPT 账号或 API Key 登录

第 3 步：创建全局配置 ~/.codex/config.toml
model = "o3"
approval_policy = "suggest"      # 建议模式（安全起步）
sandbox_mode = "workspace-write" # 沙箱可写工作区

# MCP 服务器
[mcp_servers.context7]
command = "npx"
args = ["-y", "@anthropic-ai/mcp-server-context7"]

[mcp_servers.context7.env]
CONTEXT7_API_KEY = "your-key"

第 4 步：验证 AGENTS.md 已被读取
cd your-project
codex "请介绍这个项目的技术栈"
# Codex 会自动读取项目根目录的 AGENTS.md

第 5 步：配置项目级 .codex/（可选）
# 在项目中创建 .codex/config.toml
approval_policy = "on-request"
sandbox_mode = "workspace-write"

# 添加项目级 Rules
# .codex/rules/default.rules
# allow: npm run *
# allow: git status
# allow: git diff
# deny: rm -rf

# 添加项目级 Hooks
# .codex/hooks/pre_tool_use_policy.py
# .codex/hooks/post_tool_use_review.py

第 6 步：标记项目为 trusted
# 在全局 config.toml 中
# [projects."path/to/your/project"]
# trusted = true

第 7 步：逐步添加更多 MCP
codex mcp add linear --url https://mcp.linear.app/mcp
codex mcp login linear
```

### 7.4 Codex CLI 的 Hooks 系统（与 Claude Code 对比）

```
Claude Code Hooks：Bash 脚本
.claude/hooks/destructive-guard.sh
.claude/hooks/syntax-check.sh

Codex CLI Hooks：Python 脚本
.codex/hooks/pre_tool_use_policy.py
.codex/hooks/post_tool_use_review.py

配置方式：

Claude Code (settings.json):
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "^Bash$",
      "hooks": [{
        "type": "command",
        "command": "bash /path/to/hook.sh"
      }]
    }]
  }
}

Codex CLI (config.toml):
[[hooks.PreToolUse]]
matcher = "^Bash$"

[[hooks.PreToolUse.hooks]]
type = "command"
command = 'python3 "$(git rev-parse --show-toplevel)/.codex/hooks/pre_tool_use_policy.py"'
timeout = 30
statusMessage = "Checking Bash command"
```

### 7.5 Codex CLI 的 Rules 系统（与 Claude Code 对比）

```
Claude Code Rules：Markdown 文件
.claude/rules/code-modification-workflow.md
.claude/rules/security.md

# 支持 frontmatter 路径匹配：
---
paths: "*/security*"
---

Codex CLI Rules：.rules 文件
.codex/rules/default.rules

# 语法：
allow: npm run *
allow: git status
deny: rm -rf *
deny: git push --force

# 测试规则：
codex execpolicy check --pretty \
  --rules ~/.codex/rules/default.rules \
  -- gh pr view 7888 --json title,body,comments

# Claude Code 的 Rules 更灵活（Markdown + 路径匹配 + 自然语言指导）
# Codex CLI 的 Rules 更严格（allow/deny 列表 + 命令模式匹配）
```

---

## 八、三工具协作模式

### 8.1 场景分工

```
场景 1：快速小修改（改变量、修样式）
→ Zed Inline Assist ✅（最快）

场景 2：中等复杂度功能（新增组件、修改逻辑）
→ Zed Agent 面板 或 Claude Code

场景 3：复杂架构级任务（多文件重构、系统设计）
→ Claude Code Plan 模式 ✅（Agent + 规划）

场景 4：需要安全沙箱执行（跑实验性代码、安装未知依赖）
→ Codex CLI ✅（Docker 沙箱隔离）

场景 5：代码审查
→ Claude Code /review ✅（最完整，有多个审查 Agent）

场景 6：文档查询
→ Zed context7 MCP（编辑器内快速查）
→ Claude Code find-docs Skill（更详细）
→ Codex CLI context7 MCP（终端内查）

场景 7：专属 Skill
→ Claude Code /daily-report、/debug 等（仅 Claude Code 支持）

场景 8：需要 Codex 作为子 Agent
→ Claude Code 或 Zed 通过 MCP 调用 Codex
   codex mcp-server → 其他工具可以调用 Codex 的能力
```

### 8.2 AGENTS.md 作为协作桥梁

```
AGENTS.md 在三个工具中的加载链：

Zed Agent：
  打开项目 → 读取 AGENTS.md → 获得项目规范 → 执行任务

Codex CLI：
  启动 codex → 读取 AGENTS.md → 获得 + 工作流 → 执行任务
  （还读取 .codex/config.toml 获得 Rules + Hooks）

Claude Code：
  启动 claude → 读取 CLAUDE.md（含 AGENTS.md 内容 + 增强）
  → 还读取 .claude/rules/、.claude/commands/、.claude/memory/
  → 获得最完整的上下文 → 执行任务

修改 AGENTS.md 的效果：
  ✅ Zed Agent：下次对话自动生效
  ✅ Codex CLI：下次会话自动生效
  ✅ Claude Code：需手动同步到 CLAUDE.md（或 CLAUDE.md 引用 AGENTS.md）
```

---

## 九、配置文件完整清单

### 9.1 全局级配置

| 文件 | 工具 | 用途 | 维护策略 |
|------|------|------|----------|
| `~/.claude/CLAUDE.md` | Claude Code | 全局增强规范 | 包含 AGENTS.md 公共内容 + 特有 |
| `~/.claude/settings.json` | Claude Code | 工具设置、MCP、Hook | 独立维护 |
| `~/.claude/settings.local.json` | Claude Code | 权限配置 | 独立维护 |
| `~/.claude/commands/*.md` | Claude Code | 自定义命令 | 独立维护 |
| `~/.claude/agents/*.md` | Claude Code | Agent 定义 | 独立维护 |
| `~/.claude/rules/*.md` | Claude Code | 路径规则 | 独立维护 |
| `~/.claude/hooks/*` | Claude Code | Hook 脚本 (Bash) | 独立维护 |
| `~/.claude/memory/*` | Claude Code | 记忆系统 | 独立维护 |
| `~/.claude/skills/*/SKILL.md` | Claude Code | 技能定义 | 独立维护 |
| `~/AppData/Roaming/Zed/settings.json` | Zed | 工具设置、MCP | 独立维护 |
| `~/AppData/Roaming/Zed/AGENTS.md` | Zed | 全局规范 | 从项目 AGENTS.md 风格对齐 |
| `~/.codex/config.toml` | Codex | 全局配置、MCP | 独立维护 |
| `~/.codex/rules/default.rules` | Codex | 全局命令规则 | 与 Claude Code hooks 对齐 |

### 9.2 项目级配置

| 文件 | 工具 | 用途 | 创建时机 |
|------|------|------|----------|
| `AGENTS.md` | **Zed + Codex** | 跨工具共享规范 | ✅ 项目初始化时（必建） |
| `CLAUDE.md` | Claude Code | 增强版规范 | ✅ 项目初始化时（必建） |
| `.claude/settings.local.json` | Claude Code | 项目权限 | 项目初始化时 |
| `.claude/memory/MEMORY.md` | Claude Code | 项目记忆 | 项目运行中 |
| `.codex/config.toml` | Codex | 项目级配置 | 接入 Codex 时 |
| `.codex/rules/*.rules` | Codex | 项目级命令规则 | 接入 Codex 时 |
| `.codex/hooks/*.py` | Codex | 项目级 Hook | 接入 Codex 时 |
| `.zed/settings.json` | Zed | 项目级设置 | 按需 |

### 9.3 .gitignore 建议

```gitignore
# Claude Code
.claude/settings.local.json
.claude/memory/

# Codex CLI（项目级配置通常需要版本控制）
# .codex/config.toml  — 建议纳入版本控制
# .codex/rules/       — 建议纳入版本控制
# .codex/hooks/       — 建议纳入版本控制

# Zed
.zed/settings.json

# AGENTS.md 和 CLAUDE.md 都应纳入版本控制
```

---

## 十、同步方案

### 10.1 AGENTS.md → CLAUDE.md 同步

```bash
#!/bin/bash
# sync-agents-to-claude.sh
# 将 AGENTS.md 的变更同步到 CLAUDE.md 的公共部分

PROJECT_DIR="${1:-.}"

if [ ! -f "$PROJECT_DIR/AGENTS.md" ]; then
  echo "❌ AGENTS.md not found in $PROJECT_DIR"
  exit 1
fi

if [ ! -f "$PROJECT_DIR/CLAUDE.md" ]; then
  echo "❌ CLAUDE.md not found in $PROJECT_DIR"
  exit 1
fi

# 简单方案：提醒手动同步
echo "📋 AGENTS.md 已更新，请同步以下内容到 CLAUDE.md："
echo ""
echo "1. CLAUDE.md 中 '公共规范' 部分（在 '## Claude Code 特有配置' 之前）"
echo "2. 需要与 AGENTS.md 保持一致的内容："
echo "   - 技术栈"
echo "   - 代码规范"
echo "   - 项目结构"
echo "   - 常用命令"
echo "   - 提交规范"
echo ""
echo "⚠️  CLAUDE.md 中 '## Claude Code 特有配置' 之后的部分不需要修改"
```

### 10.2 Claude Code Hooks 同步提醒

```bash
#!/bin/bash
# .claude/hooks/sync-reminder.sh
# 当 AGENTS.md 被修改时，提醒同步到 CLAUDE.md

# 在 Claude Code 的 PostToolUse Hook 中配置
# 匹配 Edit|Write，检测 AGENTS.md 变更

if [[ "$TOOL_INPUT" == *"AGENTS.md"* ]]; then
  echo ""
  echo "⚠️  AGENTS.md 已被修改！"
  echo "   请同步变更到 CLAUDE.md 的公共规范部分"
  echo "   Zed Agent 和 Codex CLI 将自动读取新的 AGENTS.md"
  echo ""
fi
```

### 10.3 Codex CLI Hooks 与 Claude Code Hooks 对齐

```
Claude Code 安全 Hook → Codex CLI 对应配置：

| Claude Code Hook     | Codex CLI 对应             |
|----------------------|---------------------------|
| destructive-guard.sh | .codex/rules/default.rules (deny: rm -rf *) |
| branch-guard.sh      | .codex/rules/default.rules (deny: git push --force) |
| secret-guard.sh      | .codex/rules/default.rules (deny: .env) |
| syntax-check.sh      | .codex/hooks/post_tool_use_review.py |

注意：Codex CLI 的沙箱模式已提供基础安全保护，
大部分 Claude Code Hook 的功能在 Codex 中由沙箱自动实现。
```

---

## 十一、决策矩阵：何时用哪个工具

```
收到任务
  │
  ├── 任务复杂度？
  │   ├── 简单（改个变量、修个样式）
  │   │   └── Zed Inline Assist ✅
  │   ├── 中等（新增组件、修改逻辑）
  │   │   └── Zed Agent 面板 或 Claude Code
  │   └── 复杂（架构变更、多文件重构）
  │       └── Claude Code Plan 模式 ✅
  │
  ├── 需要安全隔离？
  │   ├── 跑实验性代码 → Codex CLI ✅（沙箱）
  │   └── 安装未知依赖 → Codex CLI ✅（沙箱）
  │
  ├── 需要审查？
  │   └── Claude Code /review ✅
  │
  ├── 需要特定 Skill？
  │   ├── /daily-report → Claude Code ✅
  │   ├── /debug → Claude Code ✅
  │   └── 文档查询 → Zed context7 或 Claude Code find-docs
  │
  ├── 需要多模型？
  │   ├── Claude → Claude Code ✅
  │   ├── DeepSeek/Qwen → Zed Agent ✅
  │   └── GPT-4o/o3 → Codex CLI ✅
  │
  └── 需要子 Agent 协作？
      ├── Claude Code Agent 系统 ✅（内置 11 个 Agent）
      ├── Codex MCP Server → 其他工具调用 Codex ✅
      └── OpenAI Agents SDK → 自定义 Multi-Agent ✅
```

---

## 十二、总结：核心原则

| 原则 | 说明 |
|------|------|
| **AGENTS.md 是共享中心** | Zed 和 Codex CLI 都读取 AGENTS.md，它是最重要的跨工具规范文件 |
| **CLAUDE.md 是增强层** | 包含 AGENTS.md 内容 + Claude Code 特有配置，不是独立体系 |
| **Claude Code 为记忆中心** | Memory/Rules/Evolve 只在 Claude Code 中维护 |
| **Codex 用 TOML 不用 JSON** | config.toml 是 Codex 的配置格式，不是 JSON |
| **沙箱是 Codex 的核心优势** | 安全隔离执行是 Codex 区别于 Claude Code 的关键 |
| **Hooks 各自维护** | Claude Code 用 Bash，Codex 用 Python，逻辑对齐但格式不同 |
| **手动同步为主** | 起步阶段 AGENTS.md ↔ CLAUDE.md 手动同步，建立习惯后再自动化 |
| **渐进接入 Codex** | 先让 AGENTS.md 在 Codex 中生效，再逐步添加 .codex/ 配置 |
| **不做无用功** | 暂时不用的工具不配置，等需要时再添加 |

> 💡 最重要的结论：**AGENTS.md 是你最有价值的配置文件**——它被 Zed 和 Codex CLI 共同读取。确保 AGENTS.md 的内容质量，比维护三个工具各自的配置更重要。

Sources:
- [OpenAI Codex CLI 官方文档](https://developers.openai.com/codex/cli)
- [Codex config.toml 配置参考](https://developers.openai.com/codex/config-reference)
- [Codex AGENTS.md 指南](https://developers.openai.com/codex/guides/agents-md)
- [Codex MCP 集成](https://developers.openai.com/codex/mcp)
- [Codex Rules 系统](https://developers.openai.com/codex/rules)
- [Codex Hooks 系统](https://developers.openai.com/codex/hooks)
- [Codex 安全与审批](https://developers.openai.com/codex/agent-approvals-security)
