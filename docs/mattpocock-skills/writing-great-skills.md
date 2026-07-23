# `writing-great-skills`

> **分类**：productivity（生产力类）｜**调用方式**：用户手动调用

- **一句话定位**：撰写和编辑高质量 Claude Code skill 的参考手册——让 skill 行为可预测的词汇与原则
- **调用方式**：用户手动调用
- **适用场景**：编写新 skill、编辑现有 skill、诊断 skill 行为不符合预期的问题时
- **核心指令**：
  1. **核心原则**：skill 的目标是从随机系统中获取可预测性——agent 每次运行走相同的过程，而非产出相同的结果
  2. **调用方式选择**：model-invoked（自动调用）保留 description，agent 可自主触发，其他 skill 也能引用，但增加 context load；user-invoked（手动调用）设置 `disable-model-invocation: true`，零 context load 但增加用户认知负担。仅当 agent 必须自主触发或有其他 skill 需要引用时才选 model-invoked
  3. **Description 写法**：前置 leading word；每个触发分支只写一个触发条件，合并同义重复；去除正文已涵盖的身份描述
  4. **信息层级**（由近及远）：in-skill step（有序步骤，每步有可检查的完成标准）→ in-skill reference（SKILL.md 内的定义/规则）→ external reference（外部文件，通过 context pointer 按需加载）。过度内联会膨胀，过度外推会隐藏必要信息
  5. **Progressive Disclosure**：将仅部分分支需要的内容推入链接文件，保持 SKILL.md 可读；context pointer 的措辞决定 agent 是否可靠地找到材料
  6. **拆分时机**：按调用拆分（独立 leading word 或被其他 skill 引用时）；按序列拆分（后续步骤诱惑 agent 提前完成当前步骤时）
  7. **Pruning 规则**：保持单一信息源；检查每行的相关性；逐句做 no-op 测试——如果模型默认已遵守则删除整句
  8. **Leading Words**：利用模型预训练中的紧凑概念（如"tight"、"red"）锚定行为，减少 token 同时提升触发和执行的稳定性
  9. **常见失败模式**：premature completion（过早完成，需锐化完成标准）、duplication（多处重复同一含义）、sediment（因不敢删而堆积的过时内容）、sprawl（skill 过长）、no-op（写了模型默认就做的事）、negation（用"不要"来引导反而强化了禁止行为，应改用正面表述）
