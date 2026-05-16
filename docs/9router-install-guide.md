# 9Router 本地安装与启动指南

> 安装日期：2026-05-12（最后更新：2026-05-16）
> 项目地址：https://github.com/decolua/9router
> 版本：v0.4.31

## 概述

9Router 是一个开源的本地 AI 路由器，支持 40+ AI 提供商和 100+ 模型的路由，具备自动故障转移和 Token 压缩功能（号称节省 20-40% Token）。提供 OpenAI 兼容 API 端点，可与 Claude Code、Cursor、Codex 等工具配合使用。

## 安装步骤

### 1. 环境要求

- **Node.js >= 22**（重要 — 低于 22 会出现 SQLite 原生模块版本不兼容问题）
- **npm**（随 Node.js 一起安装）
- 建议使用 `fnm` 管理 Node.js 版本

### 2. 检查当前 Node.js 版本

```bash
node --version
```

如果版本低于 22，需要用 fnm 切换到高版本：

```bash
fnm ls              # 查看已安装的版本
fnm use 24          # 切换到 Node 24
```

> **注意**：`fnm use` 仅在当前 shell 会话中生效。在 Claude Code 中推荐以下两种方式：

> **方式一（推荐）** — 使用 `fnm exec` 在指定版本下执行命令：
> ```bash
> fnm exec --using 24 9router --tray --log
> # 如果 9router 不在 PATH 中，使用完整路径：
> fnm exec --using 24 node "$(dirname $(which 9router))/node_modules/9router/cli.js" --tray --log
> ```
> `fnm exec` 会在干净的环境中运行，不会受当前 shell 的 Node 版本影响。
>
> **方式二** — 在同一 shell 中初始化 fnm 环境并切换：
> ```bash
> eval "$(fnm env)" && fnm use 24 && 9router --tray --log
> ```

### 3. 全局安装 9Router

```bash
npm install -g 9router
```

### 4. 启动 9Router

**后台托盘模式（推荐，无交互菜单）：**

```bash
9router --tray
```

**后台托盘模式（带日志输出，便于调试）：**

```bash
9router --tray --log
```

**前台交互模式（可选择 Web UI / Terminal UI / 后台运行）：**

```bash
9router
```

启动后会显示交互菜单：

```
========================================
  Choose Interface (v0.4.31)
  🚀 Server: http://localhost:20128
========================================

> Update to v0.4.50 (current: v0.4.31)    ← 升级到最新版
  Web UI (Open in Browser)                  ← 在浏览器打开控制面板
  Terminal UI (Interactive CLI)             ← 终端交互界面
  Hide to Tray (Background)                 ← 隐藏到系统托盘后台运行
  Exit                                      ← 退出
```

选择 **Web UI** 会在浏览器打开 http://localhost:20128/dashboard。
选择 **Hide to Tray** 会启动一个独立的后台进程并退出当前菜单。

**在 Claude Code 中启动（绕过交互菜单）：**

```bash
# 方式 1：后台托盘模式（推荐）
fnm exec --using 24 node "$(dirname $(which 9router))/node_modules/9router/cli.js" --tray

# 方式 2：先切换版本再启动
eval "$(fnm env)" && fnm use 24 && 9router --tray --log
```

> **注意**：使用 `fnm exec` 时 PATH 会被重置，全局安装的 `9router` 命令可能找不到，需要用 `node cli.js` 完整路径的方式运行。

### 5. 验证启动

```bash
# 检查端口监听
netstat -ano | findstr :20128

# 或检查 HTTP 响应
curl -sL -o /dev/null -w "%{http_code}" http://localhost:20128
# 应返回 200
```

### 6. 访问地址

| 用途 | 地址 |
|------|------|
| 控制面板 | http://localhost:20128/dashboard |
| OpenAI 兼容 API | http://localhost:20128/v1 |
| 默认登录密码 | `123456`（首次登录后请修改） |

## 踩坑记录

### 问题 1：Node.js 版本过低的 SQLite 兼容性问题

**实际报错日志：**

```
[DB] better-sqlite3 unavailable: The module
'\\?\C:\Users\hpee2\AppData\Roaming\9router\runtime\node_modules\
better-sqlite3\build\Release\better_sqlite3.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 137. This version of Node.js requires
NODE_MODULE_VERSION 108. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).

failed to asynchronously prepare wasm: Error: ENOENT: no such file
or directory, open '...\node_modules\9router\app\node_modules\
sql.js\dist/sql-wasm.wasm'

[InitApp] Error: Error: [DB] No SQLite driver available
(bun/better/node/sql.js all failed)

⨯ unhandledRejection: RuntimeError: Aborted(...). Build with
-sASSERTIONS for more info.
```

**原因：**

9Router v0.4.31 发布时自带的 `better-sqlite3` 原生模块是为 Node.js 22+（NODE_MODULE_VERSION 137）编译的。在 Node.js 18（NODE_MODULE_VERSION 108）上无法加载，因为 Node.js 主版本号每升一级，NODE_MODULE_VERSION 就会增加。同时 `sql.js` 的 WASM 文件在安装时未能正确解压到 `dist/` 目录，作为备选方案也失败了，导致所有数据库驱动均不可用，服务启动后访问页面返回 HTTP 500。

**解决过程：**

尝试 1 — 用 `npm rebuild better-sqlite3` 重新编译：
```
cd <9router_app_dir>/app && npm rebuild better-sqlite3
→ rebuilt dependencies successfully
```
结果：虽然提示编译成功，但 9Router 实际读取的是 `C:\Users\<user>\AppData\Roaming\9router\runtime\node_modules\`（运行时目录），而不是全局安装目录中的 `app/node_modules/`，所以问题依旧。

尝试 2 — 在运行时目录 rebuild better-sqlite3：
```
cd C:\Users\<user>\AppData\Roaming\9router\runtime\node_modules\better-sqlite3
npm rebuild
```
结果：失败，报错内容如下：
```
npm ERR! gyp ERR! find Python
npm ERR! gyp ERR! find Python You need to install the latest version of Python.
npm ERR! gyp ERR! find Python Node-gyp should be able to find and use Python.
```
`better-sqlite3` 是原生 C++ 模块，需要 `node-gyp` 编译，而 `node-gyp` 依赖 Python 3.x 和 C++ 编译工具链（Visual Studio Build Tools）。Windows 系统通常没有预装这些环境。

**最终方案：** 用 `fnm` 切换到 Node.js 24

```bash
fnm use 24
npm install -g 9router    # 在 Node 24 下重新安装
```

Node 24 的 NODE_MODULE_VERSION 与 9Router 自带的 `better-sqlite3` 预编译二进制兼容，无需重新编译。重新安装后启动日志变为：

```
[DB] Driver: better-sqlite3 | file: C:\Users\<user>\AppData\Roaming\9router\db\data.sqlite
[DB][migrate] applied #1 initial
```

数据库初始化成功，服务正常运行。

### 问题 2：`fnm use` 在 Claude Code 会话中不生效

**现象：** 运行 `fnm use 24` 显示 "Using Node v24.14.1"，但紧接着 `node --version` 仍返回旧版本（如 v18.12.1）。

**原因：** Claude Code 每个 Bash 命令在独立子 shell 中执行，`fnm use` 仅修改当前 shell 的环境变量（如 PATH），不会持久化到下一个命令的执行环境。

**解决方式一 — 使用 `fnm exec`（推荐）：**

```bash
fnm exec --using 24 node "$(dirname $(which 9router))/node_modules/9router/cli.js" --tray
```

`fnm exec` 会在指定 Node 版本的干净环境中执行命令，不受当前 shell 状态影响。注意 `fnm exec` 下 PATH 不包含全局 npm bin 目录，需要用完整路径调用脚本。

**解决方式二 — 同一 shell 中执行完整命令链：**

```bash
eval "$(fnm env)" && fnm use 24 && node --version && npm install -g 9router
```

或者直接在后台启动命令前初始化 fnm 环境：

```bash
eval "$(fnm env)" && fnm use 24 && 9router --tray --log
```

**解决方式三 — 查看当前 fnm 路径（诊断用）：**

```bash
# 检查 9router 实际指向哪个 Node 版本
which 9router        # → /c/Users/.../fnm_multishells/.../9router
# 查看该 shell 脚本的内容
cat $(which 9router) # → 会显示它调用的是哪个 node
```

### 问题 3：启动后 `g.snapshot is not a function` 错误

**实际报错日志：**

```
TypeError: g.snapshot is not a function
    at ignore-listed frames
```

**现象：** 出现在 SQLite 驱动全部不可用之后，是 Next.js 应用在数据库驱动加载失败后继续运行时的连锁错误。

**原因：** 根本原因仍然是问题 1 的 SQLite 模块不兼容。当 `better-sqlite3` 和 `sql.js` 都无法加载时，应用初始化过程中某些依赖数据库快照（snapshot）功能的操作被调用，但 `g.snapshot` 函数不存在（因为数据库根本没有成功初始化），导致类型错误。

**解决：** 此错误是问题 1 的次生错误，不需要单独处理。切换到 Node 24 后数据库驱动正常加载，此错误自然消失。

### 问题 4：端口占用导致启动冲突（可能遇到）

**现象：**
```
Error: listen EADDRINUSE :::20128
```

**原因：** 之前启动的 9Router 进程没有正常退出，再次启动时端口被占用。

**解决：**

```bash
# Windows：强制结束占用端口的进程
taskkill //PID <进程ID> //F

# 或用 netstat 找到 PID 后 kill
netstat -ano | findstr :20128
taskkill //PID <查到的PID> //F
```

### 问题 5：浏览器访问显示 Internal Server Error（HTTP 500）

**现象：** 9Router 启动日志显示 Next.js 已 ready，但浏览器访问页面时返回 500 错误。

**原因：** 数据库驱动未能加载。9Router 依赖 SQLite（`better-sqlite3` 或 `sql.js`）做本地数据存储，驱动加载失败后应用无法完成初始化。

**排查方法：** 使用 `--log` 模式启动，查看服务端日志：

```bash
9router --tray --log
```

日志中会出现 `[DB] better-sqlite3 unavailable` 或 `[DB] sql.js unavailable` 等错误，具体原因可能是：
- Node 版本不匹配（见问题 1）
- 原生模块损坏或被误删
- `sql-wasm.wasm` 文件缺失

**解决：** 确认使用 Node.js 22+ 运行，并用 `fnm exec --using 24` 确保版本正确（参考问题 1 的最终方案）。

## 常用命令

```bash
# 启动（后台托盘）
9router --tray --log

# 在 Claude Code 中用指定 Node 版本启动
fnm exec --using 24 node "$(dirname $(which 9router))/node_modules/9router/cli.js" --tray

# 指定端口启动
9router -p 8080

# 指定主机绑定
9router -H 0.0.0.0

# 不自动打开浏览器
9router -n

# 查看帮助
9router --help
```

## 卸载

```bash
npm uninstall -g 9router
```

## 参考链接

- GitHub 仓库：https://github.com/decolua/9router
- 技术解析：https://www.cnblogs.com/chemanlau/p/20010176
- 实战教程：https://www.itnotetk.com/2026/05/05/9router-ai-router-token-saver/
