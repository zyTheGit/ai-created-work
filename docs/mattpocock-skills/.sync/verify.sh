#!/usr/bin/env bash
# 校验 mattpocock-skills 中文文档与上游源码的一致性
# 1. 每个上游技能都有对应中文文档
# 2. 文档标注的调用方式与源码 frontmatter 一致
# 3. 没有多余（上游已删除）的文档
set -u

SRC="C:/zy/project_other/skills/skills"
DOC="C:/zy/project_other/ai-created-work/docs/mattpocock-skills"

fail=0

echo "========== 1. 文档覆盖检查 =========="
for bucket in engineering productivity misc in-progress; do
  for d in "$SRC/$bucket"/*/; do
    [ -f "$d/SKILL.md" ] || continue
    name=$(basename "$d")
    if [ ! -f "$DOC/$name.md" ]; then
      echo "  [缺失] $bucket/$name -> $name.md"
      fail=1
    fi
  done
done
[ $fail -eq 0 ] && echo "  全部技能均有中文文档"

echo
echo "========== 2. 调用方式一致性 =========="
for bucket in engineering productivity misc in-progress; do
  for d in "$SRC/$bucket"/*/; do
    [ -f "$d/SKILL.md" ] || continue
    name=$(basename "$d")
    doc="$DOC/$name.md"
    [ -f "$doc" ] || continue

    # 源码：有 disable-model-invocation: true 则为手动
    if awk '/^---$/{n++;next} n==1' "$d/SKILL.md" | grep -q '^disable-model-invocation: *true'; then
      want="用户手动调用"
    else
      want="模型自动调用"
    fi

    # 文档：取 "调用方式" 标注行（引用块内或列表项）
    got=$(grep -m1 -o '调用方式\*\*：[^｜]*' "$doc" | sed 's/.*：//' | tr -d ' ')
    [ -z "$got" ] && got=$(grep -m1 '^- \*\*调用方式\*\*：' "$doc" | sed 's/.*：//' | tr -d ' ')

    if [ "$got" != "$want" ]; then
      echo "  [不一致] $name：源码=$want 文档=${got:-<未标注>}"
      fail=1
    fi
  done
done
[ $fail -eq 0 ] && echo "  调用方式全部一致"

echo
echo "========== 3. 多余文档检查（上游已删除） =========="
extra=0
for f in "$DOC"/*.md; do
  base=$(basename "$f" .md)
  # 非技能文档：元文档 + 推荐工作流系列（本身不是技能，无需对应上游目录）
  case "$base" in
    README|mattpocock-skills-中文提示词大全|mattpocock-skills-精简版|上游版本差异|推荐工作流|工作流-*) continue ;;
  esac
  found=0
  for bucket in engineering productivity misc in-progress; do
    [ -d "$SRC/$bucket/$base" ] && found=1
  done
  if [ $found -eq 0 ]; then
    echo "  [多余] $base.md 在上游已不存在"
    extra=1
  fi
done
[ $extra -eq 0 ] && echo "  无多余文档"

echo
echo "========== 4. 陈旧术语检查 =========="
stale=0
for f in "$DOC"/*.md; do
  base=$(basename "$f" .md)
  case "$base" in
    README|mattpocock-skills-中文提示词大全|mattpocock-skills-精简版|上游版本差异) continue ;;
  esac
  if grep -qn 'CONTEXT\.md\|CONTEXT-MAP\.md' "$f"; then
    echo "  [陈旧术语] $base.md 仍含 CONTEXT.md/CONTEXT-MAP.md（应为 GLOSSARY.md）"
    stale=1
  fi
  if grep -qn 'to-prd' "$f"; then
    echo "  [陈旧术语] $base.md 仍含 to-prd（应为 to-spec）"
    stale=1
  fi
done
[ $stale -eq 0 ] && echo "  无陈旧术语"

echo
if [ $fail -eq 0 ] && [ $extra -eq 0 ] && [ $stale -eq 0 ]; then
  echo "校验通过"
else
  echo "存在问题，见上"
fi
