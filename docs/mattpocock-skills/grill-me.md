# `grill-me`

> **分类**：productivity（生产力类）｜**调用方式**：用户手动调用

- **一句话定位**：对用户进行一场严苛的面试式提问，以打磨某个计划或设计方案
- **调用方式**：用户手动调用
- **适用场景**：用户希望用"grill"相关触发词启动一个面试式的深度问答流程。与 `grill-with-docs` 的分流依据是：用户当前**是否在一个工作目录里**（`grill-with-docs` 面向有目录、要落文档的场景）
- **核心指令**：此 skill 本身只是一个入口壳，全部内容是调用 Skill tool 并传入 `grilling`。调用后将启动 grilling skill 的完整流程。
- **注意**：源码用显式的 `Call the Skill tool with "grilling"` 而非散文式的 "run the `/grilling` skill"。后者并不能可靠地让技能加载，这正是 `grill-with-docs` 被报告最多的问题背后的已知粗糙边缘。
