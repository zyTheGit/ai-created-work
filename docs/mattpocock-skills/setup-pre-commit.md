# `setup-pre-commit`

> **分类**：misc（杂项）｜**调用方式**：模型自动调用

- **一句话定位**：在当前仓库中配置 Husky pre-commit hook，集成 lint-staged（Prettier）、类型检查和测试。
- **调用方式**：模型自动调用
- **适用场景**：用户希望添加 pre-commit 钩子、配置 Husky、设置 lint-staged、或为提交增加格式化/类型检查/测试门禁时触发。
- **核心指令**：
  1. 检测包管理器：根据 lock 文件判断（npm/pnpm/yarn/bun），默认 npm。
  2. 安装 devDependencies：`husky`、`lint-staged`、`prettier`。
  3. 运行 `npx husky init` 初始化，创建 `.husky/` 目录并在 package.json 添加 `prepare` 脚本。
  4. 创建 `.husky/pre-commit`，依次执行 `npx lint-staged`、typecheck、test（后两者若 package.json 无对应脚本则省略并告知用户）。
  5. 创建 `.lintstagedrc`，对所有文件运行 `prettier --ignore-unknown --write`。
  6. 若无 Prettier 配置则创建 `.prettierrc` 默认配置。
  7. 验证各文件就位后，提交所有变更，提交本身会触发 pre-commit hook 作为冒烟测试。
