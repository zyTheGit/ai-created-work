# `obsidian-vault`

> **分类**：personal（个人专用）｜**调用方式**：模型自动调用

- **一句话定位**：在 Obsidian vault 中搜索、创建和管理笔记，使用 wikilinks 和索引笔记组织内容。
- **调用方式**：模型自动调用
- **适用场景**：用户希望在 Obsidian 中查找、创建或整理笔记时触发。
- **核心指令**：
  1. Vault 路径为 `/mnt/d/Obsidian Vault/AI Research/`，以扁平结构为主，不依赖文件夹组织，改用链接和索引笔记。
  2. 笔记命名使用 Title Case；索引笔记命名格式为 `XXX Index.md`，内容是相关主题的 `[[wikilinks]]` 列表。
  3. 搜索笔记：通过 `find` + `grep` 按文件名或内容搜索，也可直接使用 Grep/Glob 工具。
  4. 创建笔记：使用 Title Case 文件名，底部添加 `[[wikilinks]]` 关联相关笔记，属于有序序列时使用层级编号。
  5. 查找反向链接：在整个 vault 中 grep 目标笔记的 `[[笔记标题]]` 引用。
  6. 查找索引笔记：搜索文件名含 `Index` 的 `.md` 文件。
