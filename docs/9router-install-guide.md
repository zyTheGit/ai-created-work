# 9Router 本地安装与启动指南

> 安装日期：2026-05-12
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

> **注意**：`fnm use` 仅在当前 shell 会话中生效。在 Claude Code 中需要用 `eval "$(fnm env)" && fnm use 24` 确保环境生效。

### 3. 全局安装 9Router

```bash
npm install -g 9router
```

### 4. 启动 9Router

**后台托盘模式（推荐）：**

```bash
9router --tray --log
```

**前台交互模式（可选择 Web UI / Terminal UI / 后台运行）：**

```bash
9router
```

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

**解决方式：** 将 `fnm env` 初始化与命令链在同一个 shell 中执行：

```bash
eval "$(fnm env)" && fnm use 24 && node --version && npm install -g 9router
```

或者使用更简单的做法：直接在后台启动命令前初始化 fnm 环境：

```bash
eval "$(fnm env)" && fnm use 24 && 9router --tray --log
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

## 常用命令

```bash
# 启动（后台托盘）
9router --tray --log

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
