# `setup-ts-deep-modules`

> **分类**：in-progress（开发中草稿）｜**调用方式**：用户手动调用

- **一句话定位**：为 TypeScript 仓库接入 dependency-cruiser，把每个包封装成"深模块"，实现藏在子目录里，外部只能经由入口文件访问。
- **调用方式**：用户手动调用
- **适用场景**：TypeScript monorepo 需要确立包边界规则，防止跨包深层私有导入、遏制 barrel 文件滥用、让代码对 AI agent 可导航时。
- **核心指令**：
  1. **目标形态**：每个包都是 **deep module**（小接口后藏大量行为），公开面是包的**入口点**（包根目录下的文件），子目录里的一切对外隐藏。规范布局：`src/packages/<name>/` 下 `index.ts`、`client.ts` 等为入口点，`lib/` 放实现，`tests/` 放共置测试与夹具。包是**扁平**的：根下只有一层子目录，包内实现可任意深嵌套，但包中不能再有包。
  2. **四条 error 级规则**：①**入口点边界**：包外代码（app 或其他包）只能导入该包的入口点（根文件），绝不能碰其子目录；②**包内自由**：包内文件彼此自由互引；③**测试走入口点**：`<pkg>/tests/` 下文件可导入任意包的入口点和本包 `tests/` 夹具，但不能导入任何包的子目录内部（连自己的也不行），跨包集成测试允许、深层导入不允许；④**无循环依赖**。配置文件另含 `tests-folder-is-private` 规则，保证 `tests/` 目录只能被测试访问。
  3. **入口点而非 barrel**：因为公开面是**每一个根文件**，包可以暴露多个小入口点（`index.ts`、`client.ts`、`server.ts`），而不必把所有东西挤进一个巨型 `index.ts`；明确不鼓励 re-export 整棵子树的 barrel 文件。分层（哪些包可依赖哪些包）是另一回事，在配置里以注释桩留给本仓库自行填写。
  4. **七步流程**：①**检测环境**：据 lock 文件判定包管理器（`pnpm-lock.yaml`→pnpm、`yarn.lock`→yarn、`bun.lockb`→bun，否则 npm）；有 `src/` 则包根为 `src/packages`，否则 `packages`；已有 `.dependency-cruiser.*` 配置时**绝不覆盖**，改为合并规则并告知用户加了什么。②安装 `dependency-cruiser` 为 devDependency。③把自带 `dependency-cruiser.config.cjs` 拷到仓库根并设好 `PACKAGES_ROOT`。④接入检查：新增 `lint:boundaries` 脚本（`depcruise <packages-root>` 或 `depcruise src`），并折进仓库已有的、跑 typecheck 的那个总检查命令（`check`/`ci`/`validate`）；不要动 `tsconfig`、不要加路径别名。⑤搭建 `<packages-root>/example/` 可复制模板：`index.ts` 导出函数并委托给内部文件（ visibly deep），`lib/impl.ts` 藏实现，`tests/example.test.ts` 只导入 `../index`。⑥**证明规则会咬人**（整个技能的完成标准）：先跑通 clean example，再临时往测试里加深层导入 `import { thing } from "../lib/impl"`，必须报 `tests-through-entrypoints` 失败，还原后再跑必须通过；若第 2 步不失败说明规则没接对，修好再结束。⑦在**包目录内**写 `<packages-root>/README.md`（布局说明、"只通过入口点导入"、如何跑 `lint:boundaries`，明确劝阻 barrel），再从仓库的 agent 指令文件（`CLAUDE.md`，没有则 `AGENTS.md`，都没有就建 `AGENTS.md`）加一行 context pointer 指向它，让 agent 能发现边界规则而不是撞上去。
  5. **易错点**：公开/私有由**深度**决定：根文件是入口点，任何子目录都是私有，所以新增文件夹永远不需要改配置；配置用 `.cjs` 而非 `.js`，以保证 `"type": "module"` 仓库里 `module.exports` 仍可用；配置里的 `$1` 回引（dependency-cruiser 的 group matching）正是"包能访问自己内部、外人不能"的关键，不要把它们摊平成一个个按包写的规则。词汇表（deep module、interface、seam、depth）通过调用 Skill 工具加载 `codebase-design` 并全程使用其语言。
