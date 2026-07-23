import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// VitePress 配置参考：https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    // ===== 站点基本信息 =====
    title: 'AI Created Work',
    description: '日常 AI 生成技术文档库 —— Claude Code、Git、工具链与 AI 辅助编程实践',
    lang: 'zh-CN',

    // GitHub Pages 部署地址：https://zyTheGit.github.io/ai-created-work/
    base: '/ai-created-work/',

    // ===== 构建与 Markdown =====
    lastUpdated: true,
    cleanUrls: true,
    // 存量文档数量较多，相对链接可能失效；忽略死链以免阻断构建
    ignoreDeadLinks: true,

    markdown: {
      // 代码高亮主题：浅色 / 深色各一套（VitePress 内置 Shiki，无需额外依赖）
      theme: {
        light: 'github-light',
        dark: 'github-dark'
      }
    },

    // ===== 主题配置 =====
    themeConfig: {
      // 顶部导航
      nav: [
        { text: '首页', link: '/' },
        { text: '指南', link: '/guide/getting-started' },
        { text: 'AI 与编程', link: '/ai/Claude-Code-生态推荐' },
        { text: '开发工具', link: '/tools/9router-install-guide' }
      ],

      // 侧边栏（按路径前缀匹配，不同路径显示不同侧边栏）
      sidebar: {
        '/guide/': [
          {
            text: '指南',
            items: [{ text: '快速开始', link: '/guide/getting-started' }]
          }
        ],
        '/ai/': [
          {
            text: 'AI 与编程',
            base: '/ai/',
            collapsed: false,
            items: [
              { text: 'Claude Code 生态推荐', link: 'Claude-Code-生态推荐' },
              { text: 'Claude Fable 5 系统提示词', link: 'CLAUDE-FABLE-5-系统提示词全文' },
              { text: 'Codex CLI', link: 'codex-cli-doc' },
              { text: 'EvoKit 技术架构', link: 'evokit-architecture' }
            ]
          }
        ],
        '/tools/': [
          {
            text: '开发工具与配置',
            base: '/tools/',
            collapsed: false,
            items: [
              { text: '9Router 安装指南', link: '9router-install-guide' },
              { text: 'scrcpy 使用指南', link: 'scrcpy-使用指南' },
              { text: 'IDM 激活指南', link: 'IDM激活指南' },
              { text: 'Git 双仓库同步配置', link: 'Git双仓库同步配置说明' },
              { text: 'Git 分支管理、Tag 与回滚', link: 'git_branch_tag_rollback_guide_cn' },
              { text: 'lazygit 使用指南', link: 'lazygit-使用指南' }
            ]
          }
        ],
        '/个人未来计划/': [
          {
            text: '个人未来计划',
            base: '/个人未来计划/',
            collapsed: false,
            items: [
              { text: '总纲', link: '00-总纲' },
              { text: 'AI 协作开发学习路线', link: '01-AI协作开发学习路线' },
              { text: 'AI 应用开发学习路线', link: '02-AI应用开发学习路线' },
              { text: '前端深度进阶学习路线', link: '03-前端深度进阶学习路线' },
              { text: '垂直领域深耕路线', link: '04-垂直领域深耕路线' },
              { text: '行动计划与时间表', link: '05-行动计划与时间表' },
              { text: '资源与工具清单', link: '06-资源与工具清单' },
              { text: '各阶段详细实操手册', link: '07-各阶段详细实操手册' },
              { text: '多 Agent 工具策略', link: '08-多Agent工具策略' }
            ]
          }
        ],
        '/mattpocock-skills/': [
          {
            text: 'Matt Pocock Skills',
            base: '/mattpocock-skills/',
            collapsed: true,
            items: [
              { text: '索引', link: 'README' },
              { text: '中文提示词大全', link: 'mattpocock-skills-中文提示词大全' },
              { text: '精简版', link: 'mattpocock-skills-精简版' },
              {
                text: '工程类（Engineering）',
                collapsed: true,
                items: [
                  { text: 'ask-matt', link: 'ask-matt' },
                  { text: 'code-review', link: 'code-review' },
                  { text: 'codebase-design', link: 'codebase-design' },
                  { text: 'diagnosing-bugs', link: 'diagnosing-bugs' },
                  { text: 'domain-modeling', link: 'domain-modeling' },
                  { text: 'grill-with-docs', link: 'grill-with-docs' },
                  { text: 'implement', link: 'implement' },
                  { text: 'improve-codebase-architecture', link: 'improve-codebase-architecture' },
                  { text: 'prototype', link: 'prototype' },
                  { text: 'research', link: 'research' },
                  { text: 'resolving-merge-conflicts', link: 'resolving-merge-conflicts' },
                  { text: 'setup-matt-pocock-skills', link: 'setup-matt-pocock-skills' },
                  { text: 'tdd', link: 'tdd' },
                  { text: 'to-spec', link: 'to-spec' },
                  { text: 'to-tickets', link: 'to-tickets' },
                  { text: 'triage', link: 'triage' },
                  { text: 'wayfinder', link: 'wayfinder' }
                ]
              },
              {
                text: '生产力类（Productivity）',
                collapsed: true,
                items: [
                  { text: 'grill-me', link: 'grill-me' },
                  { text: 'grilling', link: 'grilling' },
                  { text: 'handoff', link: 'handoff' },
                  { text: 'teach', link: 'teach' },
                  { text: 'writing-great-skills', link: 'writing-great-skills' }
                ]
              },
              {
                text: '杂项（Misc）',
                collapsed: true,
                items: [
                  { text: 'git-guardrails-claude-code', link: 'git-guardrails-claude-code' },
                  { text: 'migrate-to-shoehorn', link: 'migrate-to-shoehorn' },
                  { text: 'scaffold-exercises', link: 'scaffold-exercises' },
                  { text: 'setup-pre-commit', link: 'setup-pre-commit' }
                ]
              },
              {
                text: '个人专用（Personal）',
                collapsed: true,
                items: [
                  { text: 'edit-article', link: 'edit-article' },
                  { text: 'obsidian-vault', link: 'obsidian-vault' }
                ]
              },
              {
                text: '开发中（In Progress）',
                collapsed: true,
                items: [
                  { text: 'batch-grill-me', link: 'batch-grill-me' },
                  { text: 'claude-handoff', link: 'claude-handoff' },
                  { text: 'loop-me', link: 'loop-me' },
                  { text: 'setup-ts-deep-modules', link: 'setup-ts-deep-modules' },
                  { text: 'to-questionnaire', link: 'to-questionnaire' },
                  { text: 'wizard', link: 'wizard' },
                  { text: 'writing-beats', link: 'writing-beats' },
                  { text: 'writing-fragments', link: 'writing-fragments' },
                  { text: 'writing-shape', link: 'writing-shape' }
                ]
              },
              {
                text: '已废弃（Deprecated）',
                collapsed: true,
                items: [
                  { text: 'design-an-interface', link: 'design-an-interface' },
                  { text: 'qa', link: 'qa' },
                  { text: 'request-refactor-plan', link: 'request-refactor-plan' },
                  { text: 'ubiquitous-language', link: 'ubiquitous-language' }
                ]
              }
            ]
          }
        ]
      },

      // 社交链接
      socialLinks: [
        { icon: 'github', link: 'https://github.com/zyTheGit/ai-created-work' }
      ],

      // 页脚
      footer: {
        message: '基于 VitePress 构建',
        copyright: 'Copyright © 2024-present zyTheGit'
      },

      // 本地搜索（官方内置，无需第三方服务）
      search: {
        provider: 'local',
        options: {
          translations: {
            button: { buttonText: '搜索文档', buttonAriaLabel: '搜索' },
            modal: {
              noResultsText: '没有找到结果',
              resetButtonTitle: '清除查询',
              footer: {
                selectText: '选择',
                navigateText: '切换',
                closeText: '关闭'
              }
            }
          }
        }
      },

      // 大纲（页面右侧目录）
      outline: {
        level: [2, 3],
        label: '本页目录'
      },

      // Edit on GitHub
      editLink: {
        pattern:
          'https://github.com/zyTheGit/ai-created-work/edit/main/docs/:path',
        text: '在 GitHub 上编辑此页'
      },

      // Last Updated 文案
      lastUpdated: {
        text: '最后更新于',
        formatOptions: {
          dateStyle: 'short',
          timeStyle: 'short'
        }
      },

      // 界面文案本地化
      darkModeSwitchLabel: '外观',
      darkModeSwitchTitle: '切换到深色模式',
      lightModeSwitchTitle: '切换到浅色模式',
      sidebarMenuLabel: '菜单',
      returnToTopLabel: '返回顶部',
      docFooter: {
        prev: '上一页',
        next: '下一页'
      }
    },

    // ===== Mermaid 配置（vitepress-plugin-mermaid）=====
    mermaid: {
      theme: 'default'
    }
  })
)
