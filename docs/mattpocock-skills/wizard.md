# `wizard`

> **分类**：in-progress（开发中草稿）｜**调用方式**：用户手动调用

- **一句话定位**：生成可交互的 bash 向导脚本，逐步引导用户完成手动配置/迁移流程。
- **调用方式**：用户手动调用
- **适用场景**：第三方服务配置、一次性数据迁移、环境状态切换等涉及打开 URL、复制密钥、写入 `.env`/GitHub Secrets 的繁琐手动操作。
- **核心指令**：基于 `template.sh`（内置进度条、确认门、跨平台 open URL、密钥隐藏输入、幂等 `.env` upsert、`gh secret/variable` 写入）生成向导脚本。四步：①Scope——读取 `.env`、workflow 等文件，梳理所有步骤和捕获值（来源、写入位置、是否 secret）；②Map——为每步写出精确操作路径（URL → 点击位置 → 复制值 → 变量名）；③Author——复制模板，用 `stage`/`say`/`open_url`/`ask_secret`/`write_env`/`set_secret`/`confirm` 等辅助函数编写各阶段，不可修改模板标记以上的库代码；④Verify——`bash -n` + shellcheck 语法检查，静态追踪值流向，不亲自运行（脚本会阻塞等待人工输入）。默认临时脚本，用户要求时才提交入仓。
