# `ubiquitous-language`

> **分类**：deprecated（已废弃）｜**调用方式**：用户手动调用

- **一句话定位**：从当前对话中提取 DDD 风格的统一语言术语表，标记歧义并推荐规范用词，保存为 `UBIQUITOUS_LANGUAGE.md`
- **调用方式**：用户手动调用（`disable-model-invocation: true`）
- **适用场景**：用户想定义领域术语、构建术语表、统一术语用词，或提到"domain model"、"DDD"、"ubiquitous language"时
- **核心指令**：扫描对话中的领域名词、动词和概念；识别歧义（同词不同义）和同义词（异词同义）问题；提出有主张的规范术语选择；按模板写入 `UBIQUITOUS_LANGUAGE.md`，含分组术语表（Term / Definition / Aliases to avoid）、关系定义、示例对话（3-5 轮 dev 与 domain expert 的对话展示术语用法）、歧义标记；定义须一句话、描述"是什么"而非"做什么"；仅收录领域术语，跳过通用编程概念；重复调用时在已有文件基础上增量更新
