<template>
  <header class="main-header" :class="{ scrolled: isScrolled, [currentTheme]: true }">
    <nav class="nav-container">
      <div class="nav-brand">
        <div class="brand-logo">
          <span class="logo-bracket">&lt;</span>
          <span class="logo-text">Dev</span>
          <span class="logo-bracket">/&gt;</span>
        </div>
      </div>

      <div class="nav-menu" :class="{ active: isMenuOpen }">
        <router-link
          v-for="section in sections"
          :key="section.id"
          :to="section.id"
          class="nav-link"
          :class="{ active: currentSection === section.id }"
        >
          <i :class="section.icon"></i>
          <span>{{ t(section.label) }}</span>
        </router-link>
      </div>

      <div class="nav-controls">
        <button class="lang-toggle" @click="toggleLanguage" title="Switch Language">
          <i class="fas fa-language"></i>
          <span class="lang-text">{{ currentLang === 'zh-CN' ? 'EN' : '中文' }}</span>
        </button>
        <button class="theme-toggle" @click="toggleTheme" :title="t('themeToggle')">
          <i :class="isDark ? 'fa fa-sun' : 'fa fa-moon'"></i>
        </button>
        <button class="menu-toggle" @click="toggleMenu" :class="{ active: isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t, locale } = useI18n()
const route = useRoute()

const currentLang = ref(locale.value)
const isDark = ref(true)
const isScrolled = ref(false)
const isMenuOpen = ref(false)
const currentSection = ref('/')

const currentTheme = computed(() => isDark.value ? 'dark' : 'light')

// 监听路由变化，更新当前section
watch(() => route.path, (newPath) => {
  currentSection.value = newPath || '/'
}, { immediate: true })

const sections = [
  { id: '/', icon: 'fas fa-home', label: 'nav.home' },
  { id: '/essays', icon: 'fas fa-briefcase', label: 'nav.essays' },
  { id: '/articles', icon: 'fas fa-code', label: 'nav.articles' },
  { id: '/versions', icon: 'fas fa-rocket', label: 'nav.versions' },
  { id: '/introduction', icon: 'fas fa-info-circle', label: 'nav.introduction' }
]

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  locale.value = currentLang.value
  localStorage.setItem('portfolio-lang', currentLang.value)
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  document.body.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('portfolio-theme', isDark.value ? 'dark' : 'light')
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const updateScrollState = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', updateScrollState)

  // Check localStorage for theme
  const savedTheme = localStorage.getItem('portfolio-theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  } else {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollState)
})
</script>
