# EvoKit 技术架构文档

> 版本: v0.2.0 | 更新: 2026-06-12
> 项目: [zyTheGit/EvoKit](https://github.com/zyTheGit/EvoKit)

---

## 目录

- [一、项目概述](#一项目概述)
- [二、四层架构](#二四层架构)
- [三、进化流水线](#三进化流水线)
- [四、CLI 架构](#四cli-架构)
- [五、核心模块详解](#五核心模块详解)
- [六、文件系统布局](#六文件系统布局)
- [七、生命周期钩子](#七生命周期钩子)
- [八、多智能体适配器](#八多智能体适配器)

---

## 一、项目概述

EvoKit 是一个 **自进化系统框架**，专为 AI 编程助手（Claude Code 等）设计。它通过跨会话持久化纠错、观察和规则，实现知识的自动积累与晋升。

### 核心理念

| 概念 | 说明 |
|------|------|
| 跨会话记忆 | 纠错和观察跨会话保留，永不丢失 |
| 自动晋升 | 重复出现的模式自动晋升为永久规则 |
| Hook 驱动 | 会话生命周期全自动管理 |
| 一键迁移 | 跨机器无缝迁移学习数据 |
| 隐私优先 | 所有数据本地存储，无云端、无遥测 |

### 技术栈

- **语言**: TypeScript (Node.js 18+)
- **运行时**: 独立 CLI (node)，无外部依赖
- **构建**: TypeScript Compiler (`tsc`)
- **测试**: Vitest
- **入口**: CommonJS shim → ESM (`bin/evokit.cjs` → `dist/cli.js`)
- **发布**: npm (`@zythegit/evokit`) + Homebrew (`zyTheGit/homebrew-evokit`)

---

## 二、四层架构

EvoKit 使用 4 层架构，从通用原则到具体已学规则，逐步精化 AI 行为。

```
┌────────────────────────────────────────────────────┐
│  L1: 认知核心 (Cognitive Core)                       │
│  CLAUDE.md — 思考框架、进化协议                        │
│  加载时机: 每次会话                                    │
│  限制: 最大 150 行                                    │
├────────────────────────────────────────────────────┤
│  L2: 路径规则 (Path Rules)                           │
│  .claude/rules/ — 按文件路径自动加载                   │
│  加载时机: 编辑匹配文件时                                │
│  示例: security.md, coding.md, core-invariants.md    │
├────────────────────────────────────────────────────┤
│  L3: 子智能体 (Sub-agents)                           │
│  .claude/agents/ — 专用智能体定义                     │
│  调用方式: claude agent <name>                      │
│  示例: architect (规划)、reviewer (审查)               │
├────────────────────────────────────────────────────┤
│  L4: 进化引擎 (Evolution Engine)                     │
│  .claude/memory/ + .claude/commands/               │
│  corrections → observations → promotion → audit     │
│  命令: /boot, /evolve, /review                      │
└────────────────────────────────────────────────────┘
```

### L1: 认知核心 (CLAUDE.md)

定义了 AI 的**思维方式**，而非仅知识本身。

内容结构：
1. **思考框架**: 理解 → 规划 → 验证 → 学习
2. **完成标准**: 测试通过、无 TODO/FIXME、无 console.log
3. **内存系统协议**: 学习数据流动规则
4. **路径约束**: 各 `.claude/` 子目录用途
5. **进化命令**: `/boot`, `/evolve`, `/review` 功能定义

**设计原则**: CLAUDE.md 应极少变更。新知识进入 `rules/` 或 `memory/`。

### L2: 路径规则 (.claude/rules/)

编辑匹配 `paths` 模式的文件时自动加载的规则。

| 规则文件 | 作用域 | 用途 |
|---------|--------|------|
| `security.md` | `*/security*` | API密钥、敏感操作、注入防护 |
| `coding.md` | `*/coding*` | 风格、质量、语言规范 |
| `core-invariants.md` | `*/core-invariants*` | 不可变系统规则 |

### L3: 子智能体 (.claude/agents/)

可在隔离上下文中独立工作的专用智能体。

| 智能体 | 工具 | 用途 |
|--------|------|------|
| `architect` | Read, Write, Bash, Agent 等 | 设计实现方案 |
| `reviewer` | Read, Grep, Glob, Bash | 代码审查（bug/安全/质量） |

### L4: 进化引擎 (.claude/memory/ + commands/)

使系统具备自进化能力的学习基础设施。

#### 数据流

```
用户纠错
    │
    ▼
corrections.jsonl ──► /evolve ──► learned-rules.md ──► rules/ 或 CLAUDE.md
    │                       │
    │                       ▼
    │                evolution-log.md (已拒绝 → 永不重提)
    │
observations.jsonl ──► 置信度衰减 (60天 → 减半)
    │
    ▼
archive/ (30天+ 条目，>1000行 gzip)
```

#### 管理命令

| 命令 | 频率 | 操作 |
|------|------|------|
| `/boot` | 每次会话 | 验证所有已学规则，检查目录完整性 |
| `/evolve` | ~10 会话 | 审计纠错、晋升/修剪规则 |
| `/review` | 提交前 | 通过 reviewer 智能体进行全面代码审查 |

---

## 三、进化流水线

### 整体流程

```
corrections.jsonl     learned-rules.md        rules/*.md / CLAUDE.md
┌──────────┐         ┌──────────────┐         ┌──────────────────┐
│ Stage 1  │──2×──►  │  Stage 3     │──10×──► │  Stage 5         │
│ Capture  │         │  Promote     │  verify  │  Graduate        │
└──────────┘         └──────────────┘         └──────────────────┘
     │                      │                         │
     ▼ (30d+)               ▼ (reject)                │
┌──────────┐         ┌──────────────┘                 │
│ archive/ │         │                                │
│ (gzip)   │         ▼                                │
└──────────┘   evolution-log.md                       │
     │              (永不重提)                          │
     ▼                                                │
  deleted                                            │
    (TTL 后)                                          │
                                                     ▼
                                             永久行为变更
                                             (极少变更)
```

### Stage 1: 捕获

用户纠错时，记录到 `corrections.jsonl`：

```json
{"timestamp":"2026-06-11T14:30:00","pattern":"use uv instead of pip","context":"user corrected pip install to uv pip install","count":1}
```

- **来源**: Claude 在对话中记录（由 CLAUDE.md 协议驱动）
- **格式**: JSONL (append-only，永不删除)
- **并行文件**: `observations.jsonl` — Claude 自行观察到的模式

### Stage 2: 旋转 (自动)

文件超过限制时自动触发：

| 文件 | 触发条件 | 行为 |
|------|---------|------|
| `corrections.jsonl` | >500 行 | >30天 条目移至 archive |
| `observations.jsonl` | >500 行 | >30天 条目移至 archive |
| 任何 archive | >1000 行 | gzip 压缩 |
| `observations.jsonl` | 置信度衰减 | >60天 置信度减半，<0.3 归档 |

实现逻辑 (`src/core/rotate.ts`)：
```typescript
export function rotateJsonlFile(config: EvoConfig, filename: string): RotationResult
```

### Stage 3: 晋升 (/evolve)

1. **分组**: 按 `pattern` 字段对 `corrections.jsonl` 分组
2. **晋升**: 出现 ≥2 次的模式晋升到 `learned-rules.md`
3. **去重**: 跳过已有规则和 evolution-log 中的拒绝记录
4. **验证行生成**: 自动生成可执行的验证命令

晋升后的规则格式：
```markdown
- **Use uv instead of pip for Python package management**
  <!-- verify: grep -r --include='*.sh' --include='*.md' 'uv' ~/.claude/ -->
  <!-- promoted: 2026-06-11 from corrections.jsonl -->
```

实现逻辑 (`src/core/promote.ts`)：
```typescript
export function analyzeCorrections(config: EvoConfig): CorrectionGroup[]
export function promotePatterns(config: EvoConfig, groups: CorrectionGroup[]): PromotionResult[]
```

### Stage 4: 验证 (/boot)

每次会话启动时自动运行：

1. 读取 `learned-rules.md` 中所有规则
2. 运行每条规则的 `verify` 命令
3. 通过 → 静默。失败 → 记录到 `violations.jsonl`
4. 报告摘要: "N passed, M failed"

### Stage 5: 毕业 (/evolve)

规则已通过 10+ 会话验证：
1. `/evolve` 提议移至 `rules/` 或 `CLAUDE.md`
2. 提案记录在 `evolution-log.md`
3. 接受后成为永久规则（L2 或 L1）
4. 从 `learned-rules.md` 移除晋升条目

### Stage 6: 拒绝

不合适的规则：
1. `/evolve` 记录拒绝到 `evolution-log.md`
2. 该模式**永不重提**（防止震荡）

### 配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `max_lines` | 500 | 触发旋转的文件行数阈值 |
| `max_days` | 30 | 归档 N 天前的条目 |
| `max_lines_archive` | 1000 | gzip 压缩的行数阈值 |
| `confidence_decay_days` | 60 | 置信度减半的天数 |
| `confidence_threshold` | 0.3 | 观察置信度低于此值则归档 |
| `promote_threshold` | 2 | 晋升所需出现次数 |
| `graduate_sessions` | 10 | 毕业所需会话数 |
| `learned_rules_max` | 50 行 | learned-rules.md 硬限制 |
| `claude_md_max` | 150 行 | CLAUDE.md 硬限制 |

---

## 四、CLI 架构

### 入口点

```
bin/evokit.cjs  (CommonJS shim)
  └── import() → dist/cli.js  (ESM)
       └── import → dist/commands/*.js
       └── import → dist/core/*.js
```

**`bin/evokit.cjs`** — CommonJS 入口，使用动态 `import()` 加载 ESM 模块：
```javascript
async function resolveCLI() {
  try { await import('../dist/cli.js'); }
  catch { /* tsx fallback for dev */ }
}
```

**`src/cli.ts`** — Commander 主程序：
```typescript
const program = new Command();
program.name('evokit').version('0.2.0');
program.addCommand(initCommand);
program.addCommand(evolveCommand);
program.addCommand(exportCommand);
program.addCommand(importCommand);
program.addCommand(doctorCommand);
```

### 命令一览

| 命令 | 功能 | 选项 |
|------|------|------|
| `evokit init [dir]` | 初始化 EvoKit | `--template`, `--branch`, `--dry-run`, `--verify` |
| `evokit evolve` | 进化审计 | `--home`, `--dry-run`, `--force`, `--max-lines`, `--max-days` |
| `evokit export` | 导出系统 | `--home`, `--output`, `--dry-run`, `--no-rotate` |
| `evokit import <pkg>` | 导入迁移包 | `--home`, `--dry-run`, `--backup`/`--no-backup` |
| `evokit doctor` | 健康检查 | `--home`, `--fix` |

### evokit init 流程

```
evokit init [目录] --template <路径> --branch main --verify
  │
  ├─ 1. 解析目标 home 目录 (默认为 $HOME)
  │
  ├─ 2. 解析模板目录 (优先级):
  │     显式路径 → 打包模板 → GitHub 下载
  │     resolveTemplateDir() — 搜索 4 个候选打包路径
  │                           失败则使用 Node https 下载 GitHub tarball
  │
  ├─ 3. 创建目录结构 (5 个子目录)
  │     rules/ agents/ commands/ memory/ hooks/
  │
  ├─ 4. 安装文件 (幂等):
  │     - CLAUDE.md → ~/ (仅不存在时)
  │     - MEMORY.md → ~/.claude/
  │     - settings.json → ~/.claude/ (含 __HOME__ 替换)
  │     - hooks/ → 始终复制 (含 __HOME__ 替换)
  │     - rules/ agents/ commands/ → 始终复制 (升级路径)
  │     - memory/* → 仅不存在时 (保留学习数据)
  │
  ├─ 5. 设置权限:
  │     chmod 755 hooks/*.sh
  │     chmod 600 memory/*.jsonl
  │
  └─ 6. (可选 --verify) 运行完整性检查
```

### evokit evolve 流程

```
evokit evolve --dry-run --max-lines 500 --max-days 30
  │
  ├─ 1. 检查 EvoKit 是否已初始化
  │
  ├─ 2. 旋转归档:
  │     rotateJsonlFile(corrections.jsonl)
  │     rotateJsonlFile(observations.jsonl)
  │
  ├─ 3. 置信度衰减:
  │     applyConfidenceDecay(observations.jsonl)
  │
  ├─ 4. 分析纠错:
  │     analyzeCorrections() → 分组、按次数排序
  │
  ├─ 5. 晋升模式:
  │     promotePatterns() → 去重 + 拒绝检查 + 阈值
  │
  ├─ 6. 修剪过时规则:
  │     pruneStaleRules() → 会话数足够则标记 deprecated
  │
  ├─ 7. 检查限制:
  │     learned-rules.md ≤ 50 行
  │
  └─ 8. 记录决策:
       logDecisions() → evolution-log.md
       prunePromotedCorrections() → 清理已晋升的纠错
```

### evokit doctor 流程

```
evokit doctor --home <path> --fix
  │
  ├─ 检查目录完整性: rules/ agents/ commands/ memory/ hooks/
  ├─ 检查关键文件: CLAUDE.md MEMORY.md settings.json
  ├─ 检查 hook 权限: 是否为可执行
  ├─ 检查 JSONL 权限: 是否为 600
  ├─ 检查文件大小: CLAUDE.md ≤ 150 行, learned-rules.md ≤ 50 行
  └─ 检查 7 个 memory 文件完整性
```

---

## 五、核心模块详解

```
src/
├── cli.ts               # Commander 主入口，注册子命令
├── core/
│   ├── types.ts         # 共享类型定义
│   ├── config.ts        # 持久化配置 (conf 包)
│   ├── memory.ts        # JSONL/MD 文件操作
│   ├── template.ts      # 模板安装与验证
│   ├── rotate.ts        # 旋转归档与置信度衰减
│   └── promote.ts       # 纠错分析、晋升、修剪
└── commands/
    ├── init.ts          # evokit init 命令
    ├── evolve.ts        # evokit evolve 命令
    ├── export_cmd.ts    # evokit export 命令
    ├── import_cmd.ts    # evokit import 命令
    └── doctor.ts        # evokit doctor 命令
```

### types.ts — 共享类型

关键类型：

```typescript
interface CorrectionEntry {
  timestamp: string;
  pattern: string;      // 模式描述 ("use uv instead of pip")
  context: string;      // 上下文说明
  count: number;
}

interface ObservationEntry {
  timestamp: string;
  pattern: string;
  confidence: number;    // 置信度 (0.0 ~ 1.0)
  context: string;
}

interface LearnedRule {
  description: string;   // 规则描述
  verify?: string;       // 验证命令
  promoted?: string;     // 晋升日期
  deprecated?: boolean;  // 是否过期
}

interface RotationResult {
  file: string;
  kept: number;          // 保留条目数
  archived: number;      // 归档条目数
  archivePath?: string;  // 归档路径
  gzipped?: boolean;     // 是否已 gzip
}

interface PromotionResult {
  pattern: string;
  decision: 'promoted' | 'rejected' | 'deferred' | 'pruned';
  count: number;
  reason: string;
}

interface EvoConfig {
  homeDir: string;
  dryRun: boolean;
  maxLines: number;
  maxDays: number;
  maxLinesArchive: number;
  confidenceDecayDays: number;
  confidenceThreshold: number;
  promoteThreshold: number;
  graduateSessions: number;
  learnedRulesMax: number;
  claudeMdMax: number;
}
```

### config.ts — 持久化配置

基于 `conf` 包（数据存储在 `~/.config/evokit/config.json`）：

```typescript
export function buildConfig(options: Partial<EvoConfig>): EvoConfig
```

- 合并 CLI 选项与持久化默认值
- 自动创建配置目录
- 适用于跨会话持久化用户偏好

### memory.ts — 文件操作

JSONL 操作：
```typescript
readJsonlFile<T>(filePath: string): T[]        // 读取 JSONL 文件
appendToJsonl<T>(filePath: string, entry: T): void  // 追加条目
writeJsonlFile<T>(filePath: string, entries: T[]): void // 覆写
```

Learned Rules (Markdown)：
```typescript
readLearnedRules(filePath: string): LearnedRule[]     // 解析 MD 中的规则
writeLearnedRules(filePath: string, rules: LearnedRule[]): void // 序列化
```

Evolution Log：
```typescript
appendToEvolutionLog(filePath: string, entry: string): void
  // 格式: [2026-06-11 14:30:00] ⬆️ promoted: "use uv instead of pip"
```

工具函数：
```typescript
getFileLineCount(filePath: string): number     // 文件行数
isOlderThanDays(ts: string, days: number): boolean // 时间检查
getClaudeDir(homeDir: string): string          // path.join(homeDir, '.claude')
getMemoryDir(homeDir: string): string          // path.join(homeDir, '.claude', 'memory')
getArchiveDir(homeDir: string): string         // path.join(homeDir, '.claude', 'memory', 'archive')
```

### template.ts — 模板引擎

```typescript
// 模板发现（4 个候选路径 + GitHub fallback）
resolveTemplateDir(templatePath?, branch?): Promise<{templateDir, cleanup}>

// 安装
installTemplate(homeDir, templateDir, dryRun): InstallSummary

// 权限设置
setPermissions(claudeDir): void

// 完整性验证
verifyInstallation(homeDir): BootCheck[]
```

模板发现优先级：
1. 显式 `--template` 路径
2. 打包路径 1: `dist/../template`
3. 打包路径 2: `dist/../../template`
4. 打包路径 3: npm global 安装路径
5. 打包路径 4: npm local 安装路径
6. GitHub 下载: `https://codeload.github.com/zyTheGit/EvoKit/tar.gz/main`

### rotate.ts — 旋转引擎

```typescript
// 旋转 JSONL 文件：归档超过 maxDays 的条目
rotateJsonlFile(config: EvoConfig, filename: string): RotationResult

// 置信度衰减：降低 >60 天条目的置信度
applyConfidenceDecay(config: EvoConfig, filename: string): DecayResult
```

关键逻辑：
- 不修改不超限文件（纯函数判断）
- 使用 Node.js 内置 `zlib` 进行 gzip 压缩
- 需要合并的已有 archive 进行追加，而非覆盖

### promote.ts — 晋升引擎

```typescript
// 纠错分析
analyzeCorrections(config: EvoConfig): CorrectionGroup[]

// 模式晋升（阈值检查 + 去重 + 拒绝检查）
promotePatterns(config: EvoConfig, groups: CorrectionGroup[]): PromotionResult[]

// 修剪过时规则
pruneStaleRules(config: EvoConfig, sessions: SessionEntry[]): PromotionResult[]

// 记录决策
logDecisions(config: EvoConfig, results: PromotionResult[]): void

// 清理已晋升的纠错
prunePromotedCorrections(config: EvoConfig, results: PromotionResult[]): void

// 验证行生成（启发式）
generateVerifyLine(pattern: string): string
```

---

## 六、文件系统布局

### 安装后结构

```
~/
├── CLAUDE.md                  # L1 认知核心 (≤150 行)
└── .claude/
    ├── MEMORY.md              # 内存索引 (Claude 只读)
    ├── settings.json          # Hook 配置
    ├── rules/
    │   ├── coding.md          # 编码标准
    │   ├── core-invariants.md # 不可变系统规则
    │   └── security.md        # 安全规则
    ├── agents/
    │   ├── architect.md       # 规划智能体
    │   └── reviewer.md        # 审查智能体
    ├── commands/
    │   ├── boot.md            # /boot 系统完整性验证
    │   ├── evolve.md          # /evolve 规则晋升审计
    │   └── review.md          # /review 代码审查
    ├── hooks/
    │   ├── session-start.sh   # 会话启动钩子
    │   ├── stop.sh            # 会话停止钩子
    │   └── export-system.sh   # 系统导出脚本
    └── memory/
        ├── README.md          # 内存系统文档
        ├── learned-rules.md   # 已晋升规则 (≤50 行)
        ├── evolution-log.md   # 进化审计追踪
        ├── corrections.jsonl  # 用户纠错 (append-only)
        ├── observations.jsonl # 自动观察 (append-only)
        ├── violations.jsonl   # 规则违规记录
        └── sessions.jsonl     # 会话评分卡
```

### npm 包发布结构

```
@zythegit/evokit (50.6 kB, 90 文件)
├── bin/
│   └── evokit.cjs        # CLI 入口
├── dist/
│   ├── cli.js            # 主程序编译输出
│   ├── core/*.js         # 核心模块编译输出
│   └── commands/*.js     # 命令模块编译输出
├── template/             # 模板目录 (完整结构如上)
├── README.md
└── LICENSE
```

---

## 七、生命周期钩子

### SessionStart Hook

```
~/.claude/hooks/session-start.sh  (每次会话启动)
  │
  ├─ 1. 检查目录完整性
  ├─ 2. 验证 learned-rules.md 中所有规则
  ├─ 3. 记录违规到 violations.jsonl
  └─ 4. 输出验证摘要
```

### Stop Hook

```
~/.claude/hooks/stop.sh  (每次会话结束)
  │
  ├─ 获取会话统计 (命令数、文件变更数、token 数)
  ├─ 记录到 sessions.jsonl (使用 uv/embedded Python 处理 JSON)
  └─ 输出会话评分卡
```

Stop hook 使用嵌入式 Python 处理 JSON（按优先级）：
1. `uv run --isolated python3` (如果 uv 可用)
2. `python3` (回退)

### Export Hook

```
~/.claude/hooks/export-system.sh  (手动运行)
  │
  ├─ 复制系统文件到临时目录
  ├─ 对 learning data 应用旋转
  ├─ 生成 install.sh
  ├─ 打包为 tar.gz
  └─ 输出: claude-evolution-<YYYYMMDD>.tar.gz
```

---

## 八、多智能体适配器

> 计划 v0.3+ / v0.4+

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Claude     │    │  Codex       │    │  OpenCode   │
│  Code       │    │  CLI         │    │  CLI        │
└──────┬──────┘    └──────┬───────┘    └──────┬──────┘
       │                  │                   │
       ▼                  ▼                   ▼
┌──────────────────────────────────────────────────┐
│              EvoKit Adapter Layer                  │
│  agent-install → setup-hooks → inject-memory      │
│  export-memory → run-command                       │
├──────────────────────────────────────────────────┤
│              Shared Learning Data                  │
│  corrections.jsonl / observations.jsonl / rules   │
└──────────────────────────────────────────────────┘
```

当前已实现适配器文件：
- `src/adapters/claude-adapter.ts` — 版本 v0.2.0（已完成，基于文件系统）
- `src/adapters/codex-adapter.ts` — 计划中
- `src/adapters/opencode-adapter.ts` — 计划中
- `src/adapters/aider-adapter.ts` — 计划中

---

## 文件大小限制总表

| 文件 | 最大行数 | 满时处理 |
|------|---------|---------|
| `CLAUDE.md` | 150 | 移至 `rules/` |
| `learned-rules.md` | 50 | 运行 `/evolve` 修剪 |
| `corrections.jsonl` | 500 | 自动旋转到 `archive/` |
| `observations.jsonl` | 500 | 自动旋转到 `archive/` |

---
