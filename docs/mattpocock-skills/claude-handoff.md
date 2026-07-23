# `claude-handoff`

> **分类**：in-progress（开发中草稿）｜**调用方式**：用户手动调用

- **一句话定位**：将当前对话生成摘要，启动后台 agent 无缝接手继续工作。
- **调用方式**：用户手动调用
- **适用场景**：需要将会话上下文传递给新 agent 继续执行任务时（如长时间运行的工作转交后台）。
- **核心指令**：生成一份 handoff summary 作为新 agent 的 prompt，通过 `claude --bg --name "<描述性名称>" "<摘要>"` 启动后台 agent，立即返回。必须传 `--name` 设置可读名称。摘要中包含"suggested skills"建议新 agent 调用的 skill。不要复制 PRD、计划、ADR、commit diff 等已有制品的内容，用路径/URL 引用。须脱敏 API key、密码、PII 等敏感信息。若用户传入参数，按其描述聚焦摘要内容。
