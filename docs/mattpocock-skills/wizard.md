# `wizard`

> **分类**：engineering（工程类）｜**调用方式**：模型自动调用

- **一句话定位**：生成一个交互式 bash 向导脚本，带人一步步走完只有人类能执行的手动流程。
- **调用方式**：模型自动调用（`/wizard` 手动调用同样有效；模型调用只会增加 agent 的触达范围）
- **适用场景**：第三方服务配置、一次性迁移、A→B 状态割接等需要打开每个 URL、说明点哪里、捕获值并写进 `.env` 文件和 GitHub Actions secrets 的繁琐手动操作；agent 碰到"只有人能做的步骤"时会自己拉起它，而不是在聊天里甩一串编号指令。
- **核心指令**：
  1. **它是什么**：一个 bash 脚本，逐 stage 带人走一段手工做起来繁琐、每次向 AI 重讲一遍也繁琐的流程：打开每个 URL、说清点哪里复制什么、捕获值、写进该在的地方（`.env`、GitHub secrets）、每个阶段都确认、并显示还剩几个阶段。默认是临时的：为一次运行而生，存到 scratch 或 `scripts/` 路径，活干完就删；只有用户想要一条该住在仓库里的可重复配置路径时才提交，并从 README 链接过去。
  2. **UX 已由模板解决，你的工作只是划范围和写阶段**：捆绑的 `template.sh` 已预解决了这些体验：按阶段计数的进度显示（v1.2.3 起去掉了 `TOTAL_MINUTES` 和剩余时间，进度只按阶段数）、确认闸门、跨平台打开 URL（含 WSL）、隐藏式密钥输入、幂等的 `.env` upsert、`gh secret`/`gh variable` 写入并在 `gh` 不可用时优雅降级、收尾的跳过摘要。`STAGES` 标记以上的库代码在每个向导里完全相同，这种一致性正是重点，**绝不手改**。每个 `stage` 会清屏，所以一个 stage 只做一件聚焦的事，别让人需要的内容滚出屏幕。
  3. **第一步 划范围**：先读仓库，别空着手问。配置类读 `.env`、`.env.example`、`.env.*`、`README`、`docker-compose*`、框架配置和 `.github/workflows/*`（其中每个 `secrets.*`/`vars.*` 引用都是向导必须产出的值）；迁移/割接类弄清当前状态、目标状态和中间的不可逆动作。然后把有序的阶段列表和每个阶段产出的值给用户看并确认（可增、可删、可重排）。**完成标准**：每个阶段都有名字且有序；每个捕获的值都知道 (a) 人类从哪里拿到、(b) 写到哪里（`.env`、GitHub secret、两者、或哪里都不写，有些阶段是纯动作）、(c) 是 secret（隐藏输入）还是公开。
  4. **第二步 绘制每阶段的旅程**：为每个阶段写出人遵循的精确路径：打开哪个 URL、在那里做什么、值显示在哪、填哪个变量，例如 "Dashboard → Developers → API keys → Reveal test key → copy"。不知道当前 UI 或确切命令时就明说并问用户或查文档，**绝不编造可能不存在的步骤**。
  5. **第三步 撰写**：把 `template.sh` 复制到目标路径，按依赖顺序每个步骤一个 `stage` 替换示例阶段，设好 `TOTAL_STAGES`。使用库辅助函数：`stage`、`say`/`step`、`open_url`、`ask`/`ask_secret`、`write_env`、`set_secret`/`set_var`、`pause`/`confirm`。守住模板设的线：先打开 URL 再要它的值；secret 一律 `ask_secret`；每个要持久化的值都 `write_env`；`set_secret` 只写 CI 真正需要的；任何不可逆动作前 `confirm`。
  6. **第四步 校验与交接**：`bash -n <script>`，有 `shellcheck` 就跑；`chmod +x <script>`；**不要自己端到端运行**（它会开浏览器并阻塞等待人工输入），改为静态追踪：第一步的每个值都被捕获并落到第一步说的位置，每个 `set_secret` 的名字都精确匹配 CI 里的一个 `secrets.*` 引用。最后告诉用户怎么运行。
  7. **为什么在 engineering 而非 productivity**：它会读 `.env*`、`docker-compose*`、框架配置和 `.github/workflows/` 里每个 `secrets.*`/`vars.*` 引用来给自己划范围，会写 CI secrets，并用 `bash -n` 和 `shellcheck` 校验产出。description 就是决定它何时触发的指针：它产出什么、四个触发分支（配置基础设施、设置凭证或 CI secrets、走一遍不熟悉的第三方仪表盘、一次性迁移或割接），以及一个明确的**非触发**：agent 自己能做的步骤不要用它，agent 能做的活就该 agent 干。
