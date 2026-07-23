# lazygit 使用指南

> lazygit 是一款终端内的 Git 图形化界面工具，由 Jesse Duffield 开发。它用 Go 编写，无需 GUI 依赖，在终端中提供直观的 Git 操作界面，大幅减少命令行输入，让 Git 工作流更高效。
>
> 官方仓库：<https://github.com/jesseduffield/lazygit>

---

## 目录

1. [功能概述](#功能概述)
2. [安装](#安装)
3. [启动与界面](#启动与界面)
4. [面板说明](#面板说明)
5. [常用工作流](#常用工作流)
6. [快捷键大全](#快捷键大全)
7. [配置](#配置)
8. [自定义键绑定](#自定义键绑定)
9. [与编辑器集成](#与编辑器集成)
10. [常见问题](#常见问题)

---

## 功能概述

- **交互式暂存**：按文件或按行（patch 模式）暂存更改
- **分支管理**：创建、切换、合并、变基、删除分支，可视化分支图
- **提交管理**：修改提交信息、amend、rebase、cherry-pick、squash
- **Stash 管理**：创建、应用、弹出、删除 stash
- **冲突解决**：内置三向合并视图，逐文件解决冲突
- **自定义命令**：通过配置扩展任意 Git 命令
- **过滤模式**：按文件路径过滤提交历史

---

## 安装

### Windows

```powershell
# Scoop（推荐）
scoop install lazygit

# Chocolatey
choco install lazygit

# Winget
winget install JesseDuffield.lazygit
```

### macOS

```bash
# Homebrew（推荐）
brew install lazygit

# MacPorts
port install lazygit
```

### Linux

```bash
# Ubuntu / Debian（通过 PPA）
sudo add-apt-repository ppa:lazygit-team/release
sudo apt-get update
sudo apt-get install lazygit

# Arch Linux
pacman -S lazygit

# Fedora
dnf copr enable atim/lazygit
dnf install lazygit

# Nix
nix-env -iA nixpkgs.lazygit
```

### Go 安装（通用）

```bash
go install github.com/jesseduffield/lazygit@latest
```

### 验证安装

```bash
lazygit --version
```

---

## 启动与界面

在 Git 仓库目录下直接运行：

```bash
lazygit
```

启动后进入全屏终端界面，分为左右两栏、上下多个面板。

### 退出

- 按 `q` 退出当前面板或整个 lazygit
- 在主界面按 `q` 退出程序

---

## 面板说明

lazygit 界面由以下面板组成（用数字键或 `h`/`l` 切换）：

| 面板 | 快捷键 | 说明 |
|------|--------|------|
| **Status** | `1` | 仓库状态概览（分支、上游信息） |
| **Files** | `2` | 工作区文件列表（未暂存/已暂存） |
| **Branches** | `3` | 本地分支列表 |
| **Commits** | `4` | 当前分支的提交历史 |
| **Stash** | `5` | Stash 条目列表 |

右侧为**详情面板**，显示当前选中项的详细信息（diff、提交内容等）。

### 面板内导航

| 按键 | 作用 |
|------|------|
| `j` / `↓` | 向下移动 |
| `k` / `↑` | 向上移动 |
| `h` / `←` | 切换到左侧面板 / 折叠 |
| `l` / `→` | 切换到右侧面板 / 展开 |
| `gg` | 跳到顶部 |
| `G` | 跳到底部 |
| `PgUp` / `PgDn` | 翻页 |
| `/` | 搜索 |
| `?` | 打开快捷键帮助 |

---

## 常用工作流

### 1. 提交更改

```
1. Files 面板 → 选中文件 → 按 a 暂存（或按空格按行暂存）
2. 按 c 输入提交信息并提交
```

### 2. 按行暂存（Patch 模式）

```
1. Files 面板 → 选中文件 → 按 Enter 进入 diff 视图
2. 选中具体行 → 按 a 暂存该行（空格 暂存整个 hunk）
3. 按 Esc 返回文件列表
4. 按 c 提交
```

### 3. 修改最近一次提交（Amend）

```
1. 修改文件并暂存
2. Commits 面板 → 选中最新提交 → 按 a amend
```

### 4. 创建与切换分支

```
1. Branches 面板 → 按 n 创建新分支（输入名称）
2. 选中目标分支 → 按 Enter 切换
```

### 5. 交互式 Rebase

```
1. Commits 面板 → 选中要编辑的提交
2. 按 e 标记为 edit / 按 s 标记为 squash / 按 f 标记为 fixup
3. 完成标记后，rebase 自动开始
4. 冲突时在 Files 面板解决，按 c 继续 rebase
```

### 6. Cherry-pick

```
1. Commits 面板 → 选中要 cherry-pick 的提交 → 按 C 复制
2. 切换到目标分支
3. Commits 面板 → 按 V 粘贴（cherry-pick）
```

### 7. Stash 操作

```
1. Files 面板 → 按 S stash 所有更改
2. Stash 面板 → 选中 stash 条目
   - 按 g 弹出（pop）
   - 按 d 删除
```

### 8. 解决合并冲突

```
1. 合并/变基产生冲突后，Files 面板显示冲突文件
2. 选中冲突文件 → 按 Enter 进入冲突视图
3. 选择保留上方 / 下方 / 双方 / 手动编辑
4. 所有冲突解决后 → 按 c 继续合并/变基
```

---

## 快捷键大全

### 全局快捷键

| 按键 | 作用 |
|------|------|
| `?` | 打开快捷键帮助 |
| `q` | 退出当前面板 / 退出 lazygit |
| `Ctrl+C` | 强制退出 |
| `1` ~ `5` | 切换到对应面板 |
| `h` / `l` | 面板间切换 |
| `j` / `k` | 上下移动 |
| `gg` / `G` | 跳到顶部 / 底部 |
| `/` | 搜索 |
| `Esc` | 取消 / 返回 |
| `Enter` | 确认 / 进入详情 |
| `Ctrl+L` | 刷新界面 |
| `X` | 切换过滤模式 |
| `W` | 切换 diff 显示方式（全量 / 统计） |

### Files 面板

| 按键 | 作用 |
|------|------|
| `a` / `空格` | 暂存 / 取消暂存文件 |
| `Enter` | 进入 diff / patch 模式 |
| `d` | 丢弃工作区更改（`discard`） |
| `c` | 提交已暂存的更改 |
| `i` | 忽略文件（添加到 .gitignore） |
| `S` | Stash 所有更改 |
| `A` | 暂存所有文件 |
| `e` | 在编辑器中打开文件 |
| `o` | 在文件管理器中打开 |
| `r` | 刷新文件状态 |

### Branches 面板

| 按键 | 作用 |
|------|------|
| `Enter` | 切换到该分支 |
| `n` | 创建新分支 |
| `d` | 删除分支 |
| `D` | 强制删除分支 |
| `m` | 合并到当前分支 |
| `r` | 变基当前分支到选中分支 |
| `f` | 快进合并（fetch + fast-forward） |
| `M` | 重命名分支 |
| `o` | 在浏览器中打开 PR |

### Commits 面板

| 按键 | 作用 |
|------|------|
| `Enter` | 查看提交详情 |
| `s` | Squash（合并到上一条提交） |
| `f` | Fixup（同 squash 但丢弃提交信息） |
| `e` | 标记为 edit（rebase） |
| `r` | 修改提交信息（reword） |
| `d` | 删除提交（drop） |
| `a` | Amend 到该提交 |
| `C` | 复制提交（cherry-pick 源） |
| `V` | 粘贴提交（cherry-pick 目标） |
| `o` | 在浏览器中打开提交 |
| `T` | 为该提交创建 Tag |

### Stash 面板

| 按键 | 作用 |
|------|------|
| `Enter` | 查看 stash 内容 |
| `g` | Pop stash |
| `d` | Drop stash |
| `n` | 新建 stash（仅未暂存） |
| `S` | 新建 stash（包含未跟踪文件） |

---

## 配置

配置文件位置：

| 系统 | 路径 |
|------|------|
| **Windows** | `%APPDATA%\lazygit\config.yml` |
| **macOS** | `~/Library/Application Support/lazygit/config.yml` |
| **Linux** | `~/.config/lazygit/config.yml` |

也可通过环境变量 `XDG_CONFIG_HOME` 自定义路径。

### 推荐基础配置

```yaml
# ~/.config/lazygit/config.yml

gui:
  # 显示文件变化统计
  showFileTree: true
  # 窗口边框风格（rounded / single / double / hidden）
  border: rounded
  # 主题
  theme:
    activeBorderColor:
      - green
      - bold
    inactiveBorderColor:
      - white
  # 提交长度（短 hash 显示位数）
  commitHashLength: 8
  # 显示随机小贴士
  showRandomTip: true
  # 时间格式
  timeFormat: "2006-01-02 15:04"
  # 短日期格式（提交列表）
  shortTimeFormat: "01-02 15:04"

git:
  # 分页器
  paging:
    colorArg: always
    pager: delta
  # 自动暂存未提交的更改再执行 pull/rebase
  autoFetch: true
  # commit 信息自动换行宽度
  commit:
    autoWrapWidth: 72

# 编辑器（用于编辑 commit message 等）
os:
  editCommand: "code"    # VS Code
  editCommandTemplate: "{{editor}} --wait {{filename}}"
  openCommand: "cmd /c start '' {{filename}}"
```

### 与 Delta 集成（增强 diff 显示）

安装 [delta](https://github.com/dandavison/delta) 后，在 lazygit 配置中启用：

```yaml
git:
  paging:
    colorArg: always
    pager: delta --paging=never
```

---

## 自定义键绑定

在 `config.yml` 中通过 `keybinding` 部分自定义：

```yaml
keybinding:
  universal:
    quit: "q"
    return: "<esc>"
    togglePanel: "<tab>"
    prevItem: "k"
    nextItem: "j"
  files:
    commitChanges: "c"
    commitChangesWithoutHook: "C"
    amendLastCommit: "a"
  commits:
    squashDown: "s"
    renameCommit: "r"
  branches:
    createPullRequest: "o"
```

### 自定义命令

通过 `customCommands` 添加任意 Git 操作：

```yaml
customCommands:
  # 快速 push
  - key: "P"
    command: "git push origin {{.SelectedLocalBranch.Name}}"
    context: "localBranches"
    description: "Push to origin"

  # 快速创建 PR
  - key: "<c-p>"
    command: "gh pr create --fill"
    context: "localBranches"
    description: "Create PR with gh CLI"

  # 在浏览器中打开远程仓库
  - key: "o"
    command: "cmd /c start {{.SelectedRemote.Url}}"
    context: "remotes"
    description: "Open remote in browser"
```

---

## 与编辑器集成

### VS Code

在 `settings.json` 中添加：

```json
{
  "terminal.integrated.env.windows": {
    "EDITOR": "code --wait"
  }
}
```

或在 lazygit 配置中：

```yaml
os:
  editCommand: "code"
  editCommandTemplate: "{{editor}} --wait {{filename}}"
```

### Neovim

```yaml
os:
  editCommand: "nvim"
  editCommandTemplate: "{{editor}} +{{line}} {{filename}}"
```

### 在编辑器中直接启动 lazygit

**VS Code**：安装扩展 `kahole.lazgit` 或在终端中直接运行 `lazygit`。

**Neovim**：使用 `lazygit.nvim` 或 `toggleterm.nvim` 插件集成。

---

## 常见问题

### Q: 中文文件名显示乱码？

确保终端编码为 UTF-8，并在配置中设置：

```yaml
gui:
  language: "zh"
```

### Q: 如何查看某个文件的完整提交历史？

1. Files 面板 → 选中文件 → 按 `l` 查看该文件的提交历史
2. 或在 Commits 面板按 `/` 搜索文件路径

### Q: 如何撤销一次提交？

Commits 面板 → 选中要撤销的提交 → 按 `d`（drop，会改写历史）或 `Ctrl+Z`（创建反向提交，不改写历史）。

### Q: 如何在 lazygit 中执行任意 Git 命令？

按 `:` 打开命令面板，输入 Git 命令（如 `git stash pop`），按 Enter 执行。

### Q: 界面显示异常或卡住？

按 `Ctrl+L` 刷新界面，或按 `Ctrl+C` 强制退出后重新启动。

---

## 参考链接

- 官方仓库：<https://github.com/jesseduffield/lazygit>
- 官方文档：<https://lazygit.github.io/>
- 键绑定参考：<https://github.com/jesseduffield/lazygit/blob/master/docs/keybindings>
- 配置参考：<https://github.com/jesseduffield/lazygit/blob/master/docs/Config.md>
