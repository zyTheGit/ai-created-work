# `setup-ts-deep-modules`

> **分类**：in-progress（开发中草稿）｜**调用方式**：用户手动调用

- **一句话定位**：为 TypeScript monorepo 安装 dependency-cruiser，将每个包封装为"深模块"——实现隐藏于子目录，仅通过根目录入口文件访问。
- **调用方式**：用户手动调用
- **适用场景**：TypeScript 仓库需要建立包边界规则，防止深层私有导入、消除 barrel 文件滥用时。
- **核心指令**：自动检测包管理器（pnpm/yarn/npm/bun）和包根目录，安装 dependency-cruiser 并写入配置（`.cjs`），建立四条 error 级规则：①外部代码只能导入包的根文件（入口点），②包内文件自由互引，③测试只能通过入口点导入（禁止深层导入），④无循环依赖。将 `lint:boundaries` 脚本接入现有 CI check 命令。搭建 example 包作为可复制模板，通过"pass → 故意违规 fail → 还原 pass"三步验证规则生效。最后在包目录写 README 并在 CLAUDE.md/AGENTS.md 中添加索引链接。鼓励多个小入口点，反对 barrel 文件。
