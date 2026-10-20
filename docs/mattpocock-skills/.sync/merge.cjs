// 合并 .sync/*-sections.md 到 mattpocock-skills-中文提示词大全.md
const fs = require('fs');
const path = require('path');

const DIR = 'C:/zy/project_other/ai-created-work/docs/mattpocock-skills';
const SYNC = path.join(DIR, '.sync');

// 从草稿文件中提取所有 "### `name`" 章节，返回 Map<name, sectionText>
function extractSections(file) {
  const text = fs.readFileSync(path.join(SYNC, file), 'utf8');
  const map = new Map();
  // 以 "### `" 开头的行切分
  const parts = text.split(/\n(?=### `)/);
  for (const part of parts) {
    const m = part.match(/^### `([^`]+)`/);
    if (!m) continue;
    // 章节内容截断到下一个二级标题（草稿文件里分类标题会漏到上一章节尾部）
    let body = part.trim();
    const cut = body.search(/\n## /);
    if (cut !== -1) body = body.slice(0, cut).trim();
    map.set(m[1], body);
  }
  return map;
}

const engKeep = extractSections('engineering-sections.md');
const engNew = extractSections('engineering-new-sections.md');
const inprog = extractSections('inprogress-sections.md');
const prodMisc = extractSections('productivity-misc-sections.md');

const ENG_ORDER = ['ask-matt', 'code-review', 'codebase-design', 'diagnosing-bugs',
  'domain-modeling', 'grill-with-docs', 'implement', 'implement-spec',
  'improve-codebase-architecture', 'pr', 'prototype', 'research', 'retro',
  'setup-matt-pocock-skills', 'tdd', 'to-spec', 'to-tickets', 'triage',
  'wayfinder', 'wizard'];
const PROD_ORDER = ['grill-me', 'grilling', 'handoff', 'teach',
  'to-questionnaire', 'wait-what', 'writing-for-agents'];
const MISC_ORDER = ['git-guardrails-claude-code', 'migrate-to-shoehorn',
  'scaffold-exercises', 'setup-pre-commit'];
const INPROG_ORDER = ['chief-of-staff', 'claude-handoff', 'loop-me',
  'setup-ts-deep-modules', 'writing-beats', 'writing-fragments', 'writing-shape'];

function pick(map, order, label) {
  const out = [];
  for (const name of order) {
    if (!map.has(name)) {
      console.error(`[缺失] ${label} 缺少章节: ${name}`);
      process.exit(1);
    }
    out.push(map.get(name));
  }
  return out.join('\n\n---\n\n');
}

const engSections = pick(new Map([...engKeep, ...engNew]), ENG_ORDER, 'engineering');
const prodSections = pick(prodMisc, PROD_ORDER, 'productivity');
const miscSections = pick(prodMisc, MISC_ORDER, 'misc');
const inprogSections = pick(inprog, INPROG_ORDER, 'in-progress');

const doc = `# Matt Pocock Skills 中文提示词大全

> **来源**：[mattpocock/skills](https://github.com/mattpocock/skills) 仓库的 [\`skills/\`](https://github.com/mattpocock/skills/tree/main/skills) 目录
> **生成日期**：2026-07-22 ｜ **同步更新**：2026-10-16
> **同步基线**：上游 \`ed37663\`（2026-07-21）→ \`49dd158\`（2026-10-09，v1.3.1 之后尚未发版）
> **统计**：共 **38 个 skill**，分布于 4 个分类文件夹（另 2 个分类已空或已移除）
> **逐版本差异**：见 [上游版本差异](./上游版本差异.md)

## 分类说明

| 文件夹 | 数量 | 说明 |
|---|---|---|
| \`engineering/\` | 20 | 日常代码工作（**promoted**，随插件发布） |
| \`productivity/\` | 7 | 日常非代码工作流工具（**promoted**，随插件发布） |
| \`misc/\` | 4 | 保留但很少使用，不对外推荐 |
| \`in-progress/\` | 7 | beta 频道：有意发布、安装即用，可经 skills.sh 单独安装 |
| \`deprecated/\` | 0 | 桶保留但已清空（v1.2.0 起 4 个技能全部移除） |
| \`personal/\` | — | **桶已整体移除**（v1.2.0） |

> **调用方式说明**：
> - **用户手动调用**：frontmatter 含 \`disable-model-invocation: true\`，只能由人类显式触发（如 \`/skill-name\`），零上下文负载但花认知负载（人是索引）
> - **模型自动调用**：Claude 可根据上下文自主触发，用户也可手动调用；常驻 description 带来上下文负载，但可被其他技能引用
>
> **调用规则**：用户手动技能**不能**调用另一个用户手动技能，只能调用模型自动技能。跨技能调用统一写成 \`Call the Skill tool with "X"\`（散文式 "run the \`/X\` skill" 不可靠）；目标为用户手动技能时，源码会让 agent **转告人类去运行 \`/X\`**。

---

## 一、engineering（工程类，20 个）

${engSections}

---

## 二、productivity（生产力类，7 个）

${prodSections}

---

## 三、misc（杂项，4 个）

> 本分类 4 个技能自旧基线以来**无语义变更**。上游仅在两处做了 em-dash 清扫后的措辞调整（\`git-guardrails-claude-code\` 的"合并而非覆盖"由破折号改为句号；\`setup-pre-commit\` 的冒烟测试同理），不影响中文摘要内容。

${miscSections}

---

## 四、in-progress（开发中草稿，7 个）

${inprogSections}

---

## 五、快速汇总表

### engineering（工程类，20 个）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| \`ask-matt\` | 手动 | 技能路由器，含阶段边界决策树 |
| \`code-review\` | 自动 | 双轴代码审查：编码规范（Standards）+ 需求符合度（Spec） |
| \`codebase-design\` | 自动 | 深度模块设计词汇体系，吸收"设计两遍" |
| \`diagnosing-bugs\` | 自动 | 六阶段系统化 bug 诊断循环，第一动作先脱敏 |
| \`domain-modeling\` | 自动 | 维护领域模型：统一术语、消歧、记录 ADR 到 \`GLOSSARY.md\` |
| \`grill-with-docs\` | 手动 | 有状态的深度访谈，同步生成 \`GLOSSARY.md\` 和 ADR |
| \`implement\` | 手动 | 按 spec/ticket 逐工单实现，驱动 TDD 并自动 code review |
| \`implement-spec\` | 手动 | 一次跑完整个 spec：任务图 + 前沿并行 + 集成分支 |
| \`improve-codebase-architecture\` | 手动 | 扫描代码库生成架构改进 HTML 报告并访谈落地 |
| \`pr\` | 自动 | PR 正文形状：最小可视化摘要 + 前后证据 + 合并风险判断 |
| \`prototype\` | 自动 | 一次性原型（单个自包含 HTML）回答设计问题 |
| \`research\` | 自动 | 后台 agent 调研一手资料，产出带引用的 Markdown 报告 |
| \`retro\` | 手动 | 回顾编码会话，改的是 agent 的环境而非代码 |
| \`setup-matt-pocock-skills\` | 手动 | 一次性配置仓库基础设施（tracker/标签/领域文档） |
| \`tdd\` | 自动 | TDD 红绿循环参考指南：垂直切片、防三大反模式 |
| \`to-spec\` | 手动 | 把对话综合为正式 spec 并发布到 tracker |
| \`to-tickets\` | 手动 | 把 spec 拆成带依赖关系的垂直切片工单 |
| \`triage\` | 手动 | issue/PR 分类状态机流转，产出 agent 可执行简报 |
| \`wayfinder\` | 手动 | 超大模糊目标规划为决策工单地图，逐个推进 |
| \`wizard\` | 自动 | 生成交互式 bash 向导脚本引导手动配置/迁移 |

### productivity（生产力类，7 个）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| \`grill-me\` | 手动 | 面试式提问入口，实际执行 \`/grilling\` |
| \`grilling\` | 自动 | 对计划/决策按轮次问前沿，直到共识 |
| \`handoff\` | 手动 | 把当前对话压缩成交接文档供新 agent 接手 |
| \`teach\` | 手动 | 在工作区内搭建结构化课程，跨会话教用户一项技能 |
| \`to-questionnaire\` | 手动 | 把自己答不了的决策转成发给知情者的结构化问卷 |
| \`wait-what\` | 手动 | 单字纠正："没听懂，重讲一遍" |
| \`writing-for-agents\` | 自动 | 写给 agent 看的文档的写作参考手册 |

### misc（杂项，4 个）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| \`git-guardrails-claude-code\` | 自动 | 配置 PreToolUse hook 拦截危险 git 操作 |
| \`migrate-to-shoehorn\` | 自动 | 把测试中的 \`as\` 断言迁移为 shoehorn 类型安全方案 |
| \`scaffold-exercises\` | 自动 | 生成符合 lint 规范的课程练习目录结构 |
| \`setup-pre-commit\` | 自动 | 配置 Husky + lint-staged + typecheck + test 提交门禁 |

### in-progress（开发中草稿，7 个）

| Skill | 调用方式 | 一句话作用 |
|---|---|---|
| \`chief-of-staff\` | 手动 | 实验性：单会话内协调 subagent 推进长期目标 |
| \`claude-handoff\` | 手动 | 生成交接摘要并用 \`claude --bg\` 启动后台接手 agent |
| \`loop-me\` | 手动 | 把重复模式访谈成可实施的工作流规格 |
| \`setup-ts-deep-modules\` | 手动 | 用 dependency-cruiser 把 TS 包封装为深模块边界 |
| \`writing-beats\` | 手动 | 以"接地"约束逐拍组装文章叙事路径 |
| \`writing-fragments\` | 手动 | 写作探索期：访谈挖掘原始片段，不施加结构 |
| \`writing-shape\` | 手动 | 把素材逐段塑造成有论证结构的完整文章 |

### 已移除的技能（不再收录）

| 原分类 | Skill | 去向 |
|---|---|---|
| deprecated | \`design-an-interface\` | 由 \`codebase-design\` 的 \`DESIGN-IT-TWICE.md\` 吸收 |
| deprecated | \`qa\` | 能力拆入 \`triage\` / \`to-tickets\` |
| deprecated | \`request-refactor-plan\` | 能力拆入 \`to-spec\` / \`improve-codebase-architecture\` |
| deprecated | \`ubiquitous-language\` | 由 \`domain-modeling\` 取代 |
| personal | \`edit-article\` | 上游 personal 桶整体移除 |
| personal | \`obsidian-vault\` | 上游 personal 桶整体移除 |
| in-progress | \`batch-grill-me\` | v1.2.0 随 \`grilling\` 按轮次重写而删除 |
| engineering | \`resolving-merge-conflicts\` | v1.3.0 删除，无替代品 |
| productivity | \`writing-great-skills\` | v1.2.0 更名为 \`writing-for-agents\`（无别名） |

---

## 六、本仓库对应的上游版本差异速查

| 版本 | 日期 | 关键变更 |
|---|---|---|
| v1.2.0 | 2026-08-05 | 6 个技能删除、\`writing-great-skills\`→\`writing-for-agents\` 更名、\`wizard\`/\`to-questionnaire\` 升桶、\`prototype\`/\`wayfinder\`/\`grilling\`/\`ask-matt\`/\`setup-matt-pocock-skills\` 重写、打包为 Claude Code 官方插件 |
| v1.2.2 | 2026-08-05 | \`writing-for-agents\` 恢复 Codex 模型自动调用（上游无 v1.2.1） |
| v1.2.3 | 2026-08-06 | \`diagnosing-bugs\` 脱敏章节、三个技能去 Claude Code 专属工具名、\`wizard\` 进度改按阶段计 |
| v1.3.0 | 2026-09-29 | 新增 \`implement-spec\`/\`pr\`/\`retro\`，删除 \`resolving-merge-conflicts\`，**\`CONTEXT.md\`→\`GLOSSARY.md\` 全局更名（11 个技能）**，跨技能调用统一 Skill tool 写法，全仓库清除 em-dash |
| v1.3.1 | 2026-10-04 | \`ask-matt\` 把 bug 后反思路由改指 \`/retro\`（仅此一条） |
| HEAD \`49dd158\` | 2026-10-09 | 未发版：11 处技能级修正 + 实验技能 \`chief-of-staff\` + README 改自助更新安装 |

> 完整逐版本差异（含每条 PR、每个技能的具体改动、对使用者的实际影响）见 [上游版本差异](./上游版本差异.md)。
`;

fs.writeFileSync(path.join(DIR, 'mattpocock-skills-中文提示词大全.md'), doc, 'utf8');
console.log('已写入大全，共', doc.split('\n').length, '行');
