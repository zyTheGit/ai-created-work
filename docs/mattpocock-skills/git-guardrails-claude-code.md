# `git-guardrails-claude-code`

> **分类**：misc（杂项）｜**调用方式**：模型自动调用

- **一句话定位**：为 Claude Code 设置 PreToolUse hook，拦截并阻止危险的 git 操作。
- **调用方式**：模型自动调用
- **适用场景**：用户希望防止破坏性 git 操作、添加 git 安全钩子、阻止 Claude 执行 `git push`/`git reset --hard` 等命令时触发。
- **核心指令**：
  1. 询问用户作用范围：仅当前项目（`.claude/settings.json`）还是全局（`~/.claude/settings.json`）。
  2. 将内置的 `block-dangerous-git.sh` 脚本复制到对应位置的 hooks 目录，并 `chmod +x` 赋予执行权限。
  3. 在对应的 settings 文件中注册 `PreToolUse` hook，matcher 为 `Bash`，指向上一步的脚本路径；若 settings 已存在则合并而非覆盖。
  4. 询问用户是否需要增减被拦截的命令模式。
  5. 通过 `echo` 传入 `git push` 的测试 JSON 验证脚本是否返回 exit code 2 并输出 BLOCKED 信息。
  6. 默认拦截的命令包括：`git push`（含 `--force`）、`git reset --hard`、`git clean -f/-fd`、`git branch -D`、`git checkout .`、`git restore .`。
