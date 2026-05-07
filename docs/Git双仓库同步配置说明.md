# Git 双仓库同步配置说明

## 功能介绍

在执行 `git push` 推送代码到内网仓库时，自动将当前分支同步推送到另一个 Git 仓库，实现双仓库备份。

## 原理

通过 Husky pre-push hook 实现。推送时自动检测当前分支名，将同一分支推送到配置的第二仓库。

## 配置文件

项目根目录 `.husky/pre-push`

```sh
#!/usr/bin/env sh

# Git 双仓库同步 hook
# 在执行 git push 时，自动将相同分支同步推送到另一个仓库
#
# 请修改下面的 REMOTE_URL 为你的第二仓库地址

REMOTE_URL="https://xxxx.git"
REMOTE_NAME="sync-target"

# 防止递归循环（同步推送时跳过 hook）
[ -n "$GIT_SYNC_IN_PROGRESS" ] && exit 0
export GIT_SYNC_IN_PROGRESS=1

# 获取当前分支名
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo ""
echo ">>> 同步当前分支 [$CURRENT_BRANCH] 到第二仓库: $REMOTE_NAME"

# 添加 remote（复用已有）
git remote get-url "$REMOTE_NAME" 2>/dev/null || \
  git remote add "$REMOTE_NAME" "$REMOTE_URL"

# 推送当前分支到第二仓库（失败不阻塞主推送）
git push "$REMOTE_NAME" "$CURRENT_BRANCH" 2>&1 || {
  echo ">>> ⚠️  同步到 $REMOTE_NAME 失败，主仓库推送不受影响"
  echo ">>> 请检查 REMOTE_URL 配置是否正确"
}

echo ""

```

## 使用方式

配置好 `.husky/pre-push` 中的 `REMOTE_URL` 后，正常推送即可：

```bash
git push
```

推送时自动输出同步日志：

```
>>> 同步当前分支 [prod] 到第二仓库: sync-target
```

## 注意事项

| 情况            | 行为             |
| ------------- | -------------- |
| 第二仓库不可达（网络问题） | 打印警告，主仓库推送不受影响 |
| 第二仓库没有该分支     | 自动创建           |
| 分支名不匹配        | 需要手动处理         |
| 需要推送 tags     | 暂不支持，需手动推送     |

## 常见问题

### Q: 同步失败会影响主仓库推送吗？

不会。hook 内部捕获了推送失败，主仓库推送不受影响。

### Q: 如何避免递归循环？

hook 中设置了 `GIT_SYNC_IN_PROGRESS` 环境变量，第二次触发时直接跳过。

### Q: 为什么我第一次同步失败了？

可能是网络问题或第二仓库 URL 配置有误，请检查 `REMOTE_URL`。

### Q: 第二仓库需要有初始提交吗？

不需要，推送到空仓库会自动创建对应的分支。
