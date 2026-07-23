# `improve-codebase-architecture`

> **分类**：engineering（工程类）｜**调用方式**：用户手动调用

- **一句话定位**：扫描代码库寻找深化机会——生成可视化 HTML 报告，然后对用户选择的候选方案进行深度访谈。
- **调用方式**：用户手动调用
- **适用场景**：有空闲时间想改善代码库架构时；想发现浅模块并深化它们时；想提高代码的可测试性和 AI 可导航性时。
- **核心指令**：
  1. **探索**：先确定扫描范围（用户指定 > git log 热点分析），读取 `CONTEXT.md` 和相关 ADR，用 Explore sub-agent 有机地探索代码库，关注浅模块、理解成本高、接缝泄漏、测试困难的区域，对可疑浅模块执行删除测试。
  2. **呈现 HTML 报告**：写入 OS 临时目录的自包含 HTML 文件（Tailwind + Mermaid），每个候选方案包含文件、问题、解决方案、收益（以 locality 和 leverage 表述）、前后对比图、推荐强度（Strong / Worth exploring / Speculative）。末尾给出首选推荐。如有 ADR 冲突须明确标注。报告完成后询问用户选择。
  3. **访谈循环**：用户选定后运行 `/grilling` 讨论决策树，同时用 `/domain-modeling` 保持领域模型更新（新术语写入 `CONTEXT.md`、重要拒绝理由提议 ADR）。使用 `/codebase-design` 的精确词汇，不得漂移为 component/service/API/boundary。
