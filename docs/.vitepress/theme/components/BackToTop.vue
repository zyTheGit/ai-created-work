<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

// 滚动超过该阈值（像素）后显示按钮
const THRESHOLD = 300

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > THRESHOLD
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <Transition name="back-to-top">
    <button
      v-show="visible"
      class="back-to-top"
      aria-label="返回顶部"
      title="返回顶部"
      @click="scrollToTop"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-neutral-inverse);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition:
    background-color 0.25s,
    transform 0.25s;
}

.back-to-top:hover {
  background-color: var(--vp-c-brand-2);
  transform: translateY(-2px);
}

/* 移动端避开底部留白，防止遮挡内容 */
@media (max-width: 768px) {
  .back-to-top {
    right: 1rem;
    bottom: 1.5rem;
  }
}

.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: opacity 0.3s ease;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
}
</style>
