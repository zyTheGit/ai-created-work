import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BackToTop from './components/BackToTop.vue'

// 继承默认主题，通过 layout-bottom 插槽注入"返回顶部"按钮
// （VitePress 默认主题不内置返回顶部功能）
export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(BackToTop)
    })
  }
} satisfies Theme
