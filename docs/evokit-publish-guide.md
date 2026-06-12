# EvoKit npm & Homebrew 发版指南

> 版本: v0.2.0 | 更新: 2026-06-12
> npm: [@zythegit/evokit](https://www.npmjs.com/package/@zythegit/evokit)
> Homebrew: [zyTheGit/homebrew-evokit](https://github.com/zyTheGit/homebrew-evokit)

---

## 目录

- [一、npm 包结构](#一npm-包结构)
- [二、环境准备](#二环境准备)
- [三、发布流程](#三发布流程)
- [四、CI/CD 自动化](#四cicd-自动化)
- [五、Homebrew tap 发布](#五homebrew-tap-发布)
- [六、完整发版检查清单](#六完整发版检查清单)

---

## 一、npm 包结构

### package.json 配置

```json
{
  "name": "@zythegit/evokit",
  "version": "0.2.0",
  "type": "module",
  "bin": {
    "evokit": "./bin/evokit.cjs"
  },
  "files": [
    "bin/",
    "dist/",
    "template/",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "prepublishOnly": "npm run build && npm test",
    "postinstall": "echo 'EvoKit installed! Run `evokit init` to get started.'"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

关键设计：
- **`type: "module"`** — 源码使用 ESM
- **`bin/evokit.cjs`** — CommonJS shim，通过动态 `import()` 加载 ESM 模块（兼容 `type: "module"` 环境）
- **`prepublishOnly`** — 发布前自动构建 + 测试
- **`files`** — 仅发布 `bin/`、`dist/`、`template/`、README、LICENSE（排除源代码和测试）

### .npmignore (排除的发布内容)

```
src/          # TypeScript 源码（dist/ 已有编译结果）
tsconfig.json # 构建配置
tests/        # 测试文件
examples/     # 示例
docs/         # 文档
.github/      # CI 配置
```

### ESM ↔ CommonJS 双模块机制

```
 bin/evokit.cjs  (CommonJS 入口)
        │
        │ import()  // 动态导入
        ▼
  ┌─ dist/cli.js (ESM, "type": "module")
  │      │
  │      ├─ import dist/commands/*.js
  │      └─ import dist/core/*.js
  │
  └─ (dev fallback: tsx src/cli.ts)
```

`bin/evokit.cjs` 源码：
```javascript
async function resolveCLI() {
  try {
    const distPath = resolve(__dirname, '../dist/cli.js');
    await import(distPath);
  } catch {
    // tsx fallback for development
  }
}
```

---

## 二、环境准备

### npm 发布准备

```bash
# 1. 注册 npm 账号
# 在 https://www.npmjs.com 注册

# 2. 创建组织 (scoped 包需要)
# 在 https://www.npmjs.com/org/create 创建 @zythegit 组织

# 3. 登录
npm login
# 输入用户名/密码/OTP

# 4. 验证
npm whoami

# 5. 创建自动化 token (用于 CI/CD)
# 在 https://www.npmjs.com/settings/~/tokens
# 类型: Automation（避免 OTP 验证）
```

### 依赖安装

```bash
npm install    # 安装 production + devDependencies
```

依赖清单：

| 依赖 | 版本 | 用途 |
|------|------|------|
| `commander` | ^12.1.0 | CLI 命令框架 |
| `conf` | ^12.0.0 | 持久化配置（`~/.config/evokit/config.json`） |
| `fs-extra` | ^11.3.0 | 文件系统增强操作 |
| `picocolors` | ^1.1.1 | 终端彩色输出 |
| `typescript` | ^5.6 | TypeScript 编译 |
| `vitest` | ^2.1 | 测试框架 |
| `tsx` | ^4.19 | 开发时直接运行 TypeScript |

### GitHub 配置

```bash
# GitHub Token 已配置
# 在 Settings → Developer settings → Personal access tokens → Tokens (classic)
# 勾选: repo, workflow, write:packages

# gh CLI 登录
gh auth login
```

---

## 三、发布流程

### 方式 A: GitHub Release 触发 (推荐)

```bash
# 1. 更新版本号
npm version patch    # 0.2.0 → 0.2.1
npm version minor    # 0.2.0 → 0.3.0
npm version major    # 0.2.0 → 1.0.0

# 2. 推送代码和标签
git push --follow-tags

# 3. 创建 GitHub Release
gh release create v0.2.1 \
  --title "v0.2.1" \
  --notes "$(cat CHANGELOG.md | sed -n '/^## v0.2.1/,/^## /p' | head -n -1)"

# → 触发 .github/workflows/publish.yml
# → 自动: npm ci → npm test → npm run build → npm publish --access public
```

### 方式 B: 手动发布

```bash
# 1. 确认版本
node bin/evokit.cjs --version   # 应输出 0.2.0

# 2. 构建 + 测试
npm run build
npm test

# 3. 预览包内容
npm pack --dry-run    # 查看实际会发布的文件

# 4. 发布
npm publish --access public
```

### 打包内容验证

```bash
npm pack
# 输出: @zythegit/evokit-0.2.0.tgz
# 大小: ~50.6 kB
# 文件: 90 files (bin/ + dist/ + template/ + README + LICENSE)
```

### 安装验证

```bash
# 全局安装测试
npm install -g @zythegit/evokit

# 验证 CLI 可用
evokit --version   # → 0.2.0
evokit --help      # → 显示 5 个子命令
evokit doctor      # → 健康检查

# 卸载
npm uninstall -g @zythegit/evokit
```

---

## 四、CI/CD 自动化

### publish.yml

```yaml
name: Publish

on:
  release:
    types: [created]

jobs:
  publish-npm:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**触发条件**: 仅限 `release: [created]` 事件
**需要 GitHub Secret**: `NPM_TOKEN`（自动化 token）

### ci.yml (完整 CI 检查)

```yaml
jobs:
  template-test:
    # 验证模板结构完整性
    # 检查无个人路径硬编码
    # shellcheck 验证模板钩子

  shellcheck:
    # bin/*.sh + template/hooks/*.sh shellcheck

  docs:
    # 检查所有文档存在

  cli:
    # npm ci → npm run build → npm test → node bin/evokit.cjs --help
```

所有检查通过后才能 merge PR。

---

## 五、Homebrew tap 发布

### Tap 仓库结构

GitHub 仓库: [zyTheGit/homebrew-evokit](https://github.com/zyTheGit/homebrew-evokit)

```
homebrew-evokit/
└── Formula/
    └── evokit.rb     # Homebrew formula
```

### Formula 文件

```ruby
class Evokit < Formula
  desc "Self-Evolving System Framework for AI Coding Assistants"
  homepage "https://github.com/zyTheGit/EvoKit"
  license "MIT"
  depends_on "node"

  url "https://registry.npmjs.org/@zythegit/evokit/-/evokit-0.2.0.tgz"
  sha256 "09510d8c439007b94ff85896fb689a137f4c2ef5"

  def install
    system "npm", "install", *std_npm_args(prefix: false)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    system "#{bin}/evokit", "--version"
  end
end
```

### 首次发布

```bash
# 1. 创建 tap 仓库
gh repo create zyTheGit/homebrew-evokit --public

# 2. 本地初始化
cd /tmp
mkdir homebrew-evokit && cd homebrew-evokit
git init && git branch -m main
mkdir -p Formula

# 3. 复制 Formula 并计算 SHA
cp /path/to/EvoKit/homebrew/Formula/evokit.rb Formula/
npm pack @zythegit/evokit
SHA=$(shasum -a 256 zythegit-evokit-0.2.0.tgz | cut -d' ' -f1)
# 将 SHA 填入 Formula

# 4. 推送
git add . && git commit -m "evokit v0.2.0"
git remote add origin git@github.com:zyTheGit/homebrew-evokit.git
git push -u origin main
```

### 更新 Formula (发新版时)

**使用脚本** (`scripts/update-homebrew.sh`)：

```bash
#!/bin/bash
set -e
VERSION="$1"  # e.g. 0.2.1
TAP_DIR="../homebrew-evokit"

npm pack "@zythegit/evokit@$VERSION"
SHA=$(shasum -a 256 "zythegit-evokit-$VERSION.tgz" | cut -d' ' -f1)

sed -i "s|sha256 \".*\"|sha256 \"$SHA\"|" "$TAP_DIR/Formula/evokit.rb"

cd "$TAP_DIR"
git add Formula/evokit.rb
git commit -m "evokit v$VERSION"
git push
```

### 用户安装体验

```bash
# 添加 tap
brew tap zyTheGit/homebrew-evokit

# 安装
brew install evokit

# 验证
evokit --version   # → 0.2.0
evokit doctor      # → 系统健康检查
```

---

## 六、完整发版检查清单

### 发布前

- [ ] 所有代码已合并到 `main` 分支
- [ ] CHANGELOG.md 已更新
- [ ] `src/adapters/claude-adapter.ts` 版本号已更新
- [ ] 所有测试通过 (`npm test`)
- [ ] 构建通过 (`npm run build`)
- [ ] shellcheck 通过 (bash 脚本)
- [ ] 打包预览通过 (`npm pack --dry-run`)

### 发布中

- [ ] 更新版本号: `npm version <patch|minor|major>`
- [ ] 推送代码和标签: `git push --follow-tags`
- [ ] 创建 GitHub Release（自动触发 npm publish）
- [ ] 更新 Homebrew Formula SHA
- [ ] 推送到 homebrew-evokit 仓库

### 发布后验证

- [ ] npm 包可安装: `npm install -g @zythegit/evokit`
- [ ] Homebrew 可安装: `brew install evokit`
- [ ] `evokit --version` 显示正确版本
- [ ] `evokit --help` 显示所有命令
- [ ] `evokit doctor` 通过健康检查
- [ ] `evokit init --dry-run --verify` 通过验证
- [ ] GitHub Actions 全部通过

### 版本号规范

| 类型 | 命令 | 示例 |
|------|------|------|
| patch | `npm version patch` | 0.2.0 → 0.2.1 |
| minor | `npm version minor` | 0.2.0 → 0.3.0 |
| major | `npm version major` | 0.2.0 → 1.0.0 |

---

## 附录

### 相关链接

| 资源 | 链接 |
|------|------|
| npm 包 | https://www.npmjs.com/package/@zythegit/evokit |
| Homebrew tap | https://github.com/zyTheGit/homebrew-evokit |
| GitHub 仓库 | https://github.com/zyTheGit/EvoKit |
| GitHub Actions | https://github.com/zyTheGit/EvoKit/actions |
| GitHub Releases | https://github.com/zyTheGit/EvoKit/releases |
| 文档 | https://github.com/zyTheGit/EvoKit/tree/main/docs |

### 常用命令速查

```bash
# 发版全流程
npm version patch
git push --follow-tags
gh release create v0.2.1 --title "v0.2.1" --notes "Bug fixes"
bash scripts/update-homebrew.sh 0.2.1

# 本地测试
npm run build && npm test
node bin/evokit.cjs --version

# 包检查
npm pack --dry-run
npm pack && tar -tf @zythegit/evokit-*.tgz | head -20
```
