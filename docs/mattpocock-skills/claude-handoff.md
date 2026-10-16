# `claude-handoff`

> **分类**：in-progress（开发中草稿）｜**调用方式**：用户手动调用

- **一句话定位**：将当前对话写成交接摘要，通过 `claude --bg` 启动一个后台 agent 立即接手继续工作。
- **调用方式**：用户手动调用
- **适用场景**：需要把当前会话上下文转交给一个全新的后台 agent 继续推进时（如长时间运行的工作移交后台执行）。
- **核心指令**：先写一份 handoff summary 存到**用户操作系统的临时目录**，再用 `claude --bg --name "<描述性名称>" -- "$(cat <summary file>)"` 以该文件内容为 prompt 启动后台 agent。**经文件传递而非 shell 内联展开**，可避免摘要中的反引号被执行、`$` 被展开。agent 在当前工作目录启动并立即返回，用户用 `claude agents` 管理。必须传 `-n`/`--name` 设置可读名称（如 `--name "Fix login bug"`），它决定任务列表、会话选择器和终端标题中的显示名。摘要中要包含 "suggested skills" 一节，指明下一个 agent 应对哪些技能调用 Skill 工具。不要复制其他制品（specs、plans、ADRs、issues、commits、diffs）已承载的内容，改用路径或 URL 引用。必须脱敏 API key、密码、PII 等敏感信息：摘要就是 agent 的 prompt。若用户传了参数，把它当作下一会话的聚焦方向，据此裁剪摘要。
