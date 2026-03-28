import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './assets/css/main.css'

import zhCN from './i18n/zh-CN.json'
import enUS from './i18n/en-US.json'
import router from './router'
import hljs from "highlight.js";
import 'highlight.js/styles/github-dark.min.css'
const app = createApp(App)
app.directive('highlight', {
  mounted(el) {
    processCodeBlocks(el)
  },
  updated(el) {
    processCodeBlocks(el)
  }
})

function processCodeBlocks(el) {
  const preBlocks = el.querySelectorAll('pre')

  preBlocks.forEach(pre => {
    // 1. 高亮代码
    const codeBlock = pre.querySelector('code')
    if (codeBlock) {
      hljs.highlightElement(codeBlock)
    }

    // 2. 如果还没有复制按钮，就创建一个
    if (!pre.querySelector('.copy-code-btn')) {
      const copyButton = document.createElement('button')
      copyButton.className = 'copy-code-btn'
      copyButton.textContent = '复制'
      copyButton.addEventListener('click', () => {
        const code = codeBlock?.innerText || ''
        navigator.clipboard.writeText(code).then(() => {
          copyButton.textContent = '已复制'
          copyButton.classList.add('copied')
          setTimeout(() => {
            copyButton.textContent = '复制'
            copyButton.classList.remove('copied')
          }, 2000)
        }).catch(err => {
          console.error('复制失败:', err)
          alert('复制失败，请手动复制')
        })
      })

      pre.appendChild(copyButton)
    }
  })
}
const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

const savedLang = localStorage.getItem('portfolio-lang') || 'zh-CN'

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'en-US',
  messages
})

app.use(router)
app.use(i18n)
app.mount('#app')
