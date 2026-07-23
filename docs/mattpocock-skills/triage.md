# `triage`

> **分类**：engineering（工程类）｜**调用方式**：用户手动调用

- **一句话定位**：将 issue 和外部 PR 在 triage 状态机中流转——分类、验证、追问、编写 agent 可执行的简报。
- **调用方式**：用户手动调用
- **适用场景**：维护者需要评估和处理 issue tracker 上的 issue 或外部 PR 时使用。
- **核心指令**：**角色体系**：2 个分类角色（bug/enhancement）+ 5 个状态角色（needs-triage → needs-info / ready-for-agent / ready-for-human / wontfix）。**所有 triage 评论必须以 AI 生成免责声明开头**。**查看待处理项**：按未标记、needs-triage、needs-info（有新回复）三桶展示。**处理具体 issue**：(1) 收集上下文——完整阅读 issue/PR，搜索代码库检查是否已实现或被拒绝过；(2) 给出分类和状态建议并等待指示；(3) 验证声明——复现 bug 或确认 PR diff；(4) 必要时运行 grilling 追问；(5) 执行结果——ready-for-agent 发布 agent brief，needs-info 发布 triage notes，wontfix 关闭（区分"已实现"和"被拒绝"，被拒绝的 enhancement 写入 `.out-of-scope/`）。支持快速状态覆盖和恢复上次会话。
