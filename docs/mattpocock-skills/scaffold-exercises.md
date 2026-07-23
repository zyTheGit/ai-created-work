# `scaffold-exercises`

> **分类**：misc（杂项）｜**调用方式**：模型自动调用

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
