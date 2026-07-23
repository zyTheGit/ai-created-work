# Git 分支管理、Tag 发布与回滚完整指南

## 一、为什么需要规范的 Git 分支管理

在实际项目开发中，通常会遇到以下问题：

- 新功能开发中，线上突然出现 BUG
- 测试环境代码和生产环境代码不一致
- 线上版本无法快速回滚
- 多人协作时代码混乱
- 修复 BUG 后下次上线 BUG 又回来了

因此，需要建立一套稳定的 Git 分支管理规范。

---

# 二、推荐分支模型（中小团队推荐）

推荐采用以下分支结构：

```text
prod        -> 生产环境（稳定）
test        -> 测试环境
dev         -> 日常开发
feature/*   -> 功能开发分支
hotfix/*    -> 线上热修复分支
```

---

# 三、各分支职责说明

## 1. prod（生产分支）

作用：

- 线上正式运行代码
- 必须保持稳定
- 任何时候都可发布

禁止：

- 直接在 prod 修改代码
- 提交未测试代码

示例：

```bash
git checkout prod
```

---

## 2. test（测试分支）

作用：

- 测试环境部署
- QA 测试
- 联调验证

来源：

```text
dev -> test
```

---

## 3. dev（开发分支）

作用：

- 日常开发主分支
- 所有功能最终汇总到这里

特点：

- 允许存在未完成功能
- 不保证稳定

---

## 4. feature/*（功能分支）

作用：

- 每个功能独立开发
- 避免污染 dev

命名规范：

```text
feature/user-center
feature/order-export
feature/login
```

开发流程：

```bash
git checkout dev
git pull

git checkout -b feature/login
```

开发完成后：

```bash
git checkout dev
git merge feature/login
```

删除分支：

```bash
git branch -d feature/login
```

---

## 5. hotfix/*（线上热修复）

作用：

- 修复线上紧急 BUG
- 隔离开发中的新功能

命名规范：

```text
hotfix/login-error
hotfix/payment-timeout
```

---

# 四、完整开发流程

## 场景一：正常功能开发

### 1. 从 dev 拉 feature 分支

```bash
git checkout dev
git pull

git checkout -b feature/user-center
```

---

### 2. 开发功能

```bash
git add .
git commit -m "feat: 用户中心功能"
```

---

### 3. 合并回 dev

```bash
git checkout dev
git merge feature/user-center
```

---

### 4. 提交测试

```bash
git checkout test
git merge dev
```

测试环境部署。

---

### 5. 测试通过上线

```bash
git checkout prod
git merge test
```

部署生产环境。

---

# 五、生产环境 BUG 修复流程（重点）

## 当前情况

```text
prod = v1.0.0（线上）
dev  = v1.1.0 开发中
```

此时线上发现 BUG。

错误做法：

```text
直接从 dev 修复
```

原因：

- dev 可能包含未上线代码
- 会导致脏代码上线

---

# 正确做法

## 1. 从 prod 拉 hotfix 分支

```bash
git checkout prod
git pull

git checkout -b hotfix/login-error
```

---

## 2. 修复 BUG

```bash
git add .
git commit -m "fix: 修复登录异常"
```

---

## 3. 合并回 prod

```bash
git checkout prod
git merge hotfix/login-error
```

上线部署。

---

## 4. 同步回 test 和 dev（非常重要）

```bash
git checkout test
git merge hotfix/login-error


git checkout dev
git merge hotfix/login-error
```

目的：

避免下次上线时 BUG 再次出现。

---

# 六、完整分支流转图

```text
feature/*
    │
    ▼
   dev
    │
    ▼
   test
    │
    ▼
   prod
    ▲
    │
hotfix/*
```

---

# 七、Tag 是什么

Tag 本质：

```text
某一次提交的永久快照
```

通常用于：

- 正式发布版本
- 标记稳定版本
- 快速回滚
- 版本追踪

---

# 八、Tag 命名规范

推荐使用语义化版本：

```text
主版本.次版本.修订版本
```

例如：

```text
v1.0.0
v1.0.1
v1.1.0
v2.0.0
```

---

# 九、什么时候打 Tag

推荐：

```text
每次生产环境上线后
```

例如：

```text
上线完成 -> 打 Tag
```

---

# 十、如何打 Tag

## 1. 切换到 prod

```bash
git checkout prod
git pull
```

---

## 2. 创建 Tag

```bash
git tag v1.0.3
```

---

## 3. 推送 Tag

```bash
git push origin v1.0.3
```

或者：

```bash
git push --tags
```

---

# 十一、查看所有 Tag

```bash
git tag
```

输出：

```text
v1.0.0
v1.0.1
v1.0.2
v1.0.3
```

---

# 十二、查看 Tag 对应提交

```bash
git show v1.0.3
```

---

# 十三、生产环境回滚（重点）

## 场景

```text
当前线上：v1.0.3
发现重大 BUG
需要回滚到：v1.0.2
```

---

# 方案一：reset 回滚（推荐）

适合：

- 紧急恢复线上
- 小团队
- 快速恢复

---

## 1. 切换 prod

```bash
git checkout prod
```

---

## 2. 回滚到旧 Tag

```bash
git reset --hard v1.0.2
```

含义：

```text
让 prod 分支完全恢复到 v1.0.2
```

---

## 3. 强制推送

```bash
git push origin prod --force
```

然后重新部署。

---

# 回滚原理

Tag：

```text
commit 快照
```

reset：

```text
移动分支指针
```

因此：

```text
prod -> v1.0.2 commit
```

---

# 十四、更安全的企业方案：revert

很多公司不允许：

```bash
git push --force
```

因为会修改历史。

因此采用：

```text
git revert
```

---

# revert 原理

不是删除提交。

而是：

```text
新增一次反向提交
```

---

## 示例

查看日志：

```bash
git log --oneline
```

输出：

```text
a111 新功能
b222 修复接口
c333 稳定版本
```

---

## 回滚某次提交

```bash
git revert a111
```

Git 会自动生成：

```text
Revert "新功能"
```

---

# 十五、reset 与 revert 区别

| 对比项 | reset | revert |
|---|---|---|
| 是否改历史 | 会 | 不会 |
| 是否需要 force push | 需要 | 不需要 |
| 回滚速度 | 快 | 慢 |
| 团队协作 | 一般 | 推荐 |
| 适合场景 | 紧急回滚 | 企业团队 |

---

# 十六、推荐的生产发布流程

## 功能开发

```text
feature -> dev
```

---

## 提测

```text
dev -> test
```

---

## 上线

```text
test -> prod
```

---

## 打 Tag

```bash
git tag v1.0.0
git push --tags
```

---

# 十七、推荐提交规范

推荐使用：

## feat

新功能：

```text
feat: 用户管理模块
```

---

## fix

BUG 修复：

```text
fix: 修复支付异常
```

---

## refactor

代码重构：

```text
refactor: 优化登录逻辑
```

---

## docs

文档：

```text
docs: 更新 README
```

---

# 十八、推荐上线规范

## 1. 禁止直接提交 prod

必须：

```text
MR / PR 审核
```

---

## 2. 每次上线必须打 Tag

例如：

```bash
git tag v1.0.3
```

---

## 3. hotfix 必须同步所有长期分支

必须同步：

```text
prod
test
dev
```

---

## 4. 生产环境必须可快速回滚

推荐：

```text
Tag + 自动化部署
```

---

# 十九、数据库变更注意事项

Git 只能回滚代码。

无法自动回滚数据库。

因此：

## 错误操作

```sql
DROP COLUMN user_name;
```

---

## 推荐操作

```sql
ALTER TABLE ADD COLUMN nickname;
```

---

# 二十、企业级最佳实践

大型团队通常采用：

```text
main/master
release/*
develop
feature/*
hotfix/*
```

这就是经典：

# Git Flow

适合：

- 多人团队
- 多环境部署
- CI/CD
- 自动化发布

---

# 二十一、CI/CD 推荐方案

推荐：

| 分支 | 环境 |
|---|---|
| dev | 开发环境 |
| test | 测试环境 |
| prod | 生产环境 |

---

## 自动部署建议

### dev

自动部署开发环境。

---

### test

自动部署测试环境。

---

### prod

需要人工审核。

---

# 二十二、最终推荐方案（最适合中小团队）

## 分支结构

```text
prod
test
dev
feature/*
hotfix/*
```

---

## 上线流程

```text
feature
  ↓
dev
  ↓
test
  ↓
prod
  ↓
tag
```

---

## 热修复流程

```text
prod
  ↓
hotfix/*
  ↓
prod
  ↓
dev + test
```

---

# 二十三、推荐学习关键词

建议深入学习：

- Git Flow
- GitHub Flow
- GitLab Flow
- Tag 发布
- Hotfix
- Cherry-pick
- Revert
- Reset
- CI/CD
- Jenkins
- GitHub Actions
- Docker 发布
- 蓝绿部署
- 灰度发布
- 金丝雀发布

---

# 二十四、常用 Git 命令速查

## 查看分支

```bash
git branch
```

---

## 创建分支

```bash
git checkout -b feature/login
```

---

## 合并分支

```bash
git merge feature/login
```

---

## 删除分支

```bash
git branch -d feature/login
```

---

## 查看日志

```bash
git log --oneline --graph
```

---

## 打 Tag

```bash
git tag v1.0.0
```

---

## 推送 Tag

```bash
git push --tags
```

---

## 回滚到 Tag

```bash
git reset --hard v1.0.0
```

---

## 强制推送

```bash
git push --force
```

---

# 二十五、总结

推荐核心原则：

## 1. 永远不要直接修改 prod

---

## 2. 所有线上修复必须从 prod 拉 hotfix

---

## 3. hotfix 必须同步回 dev/test

---

## 4. 每次上线必须打 Tag

---

## 5. 生产环境必须支持快速回滚

---

## 6. 小团队推荐方案

```text
prod
test
dev
feature/*
hotfix/*
```

已经足够稳定。

