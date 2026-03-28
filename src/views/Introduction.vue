<template>
  <div class="introduction-page">

    <!-- Content Section -->
    <section class="content-section">
      <div class="content-container">
        <div class="markdown-content" v-highlight v-html="markdownContent"></div>
      </div>
    </section>

    <!-- Back to Home -->
    <div class="back-to-home">
      <router-link to="/" class="back-button">
        <i class="fas fa-arrow-left"></i>
        <span>返回首页</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { marked } from 'marked'

const markdownContent = ref('')

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true
})

// Load markdown content
const loadMarkdown = async () => {
  try {
    const response = await fetch('/markdown/introduction.md')
    if (response.ok) {
      const text = await response.text()
      markdownContent.value = marked.parse(text)
    }
  } catch (error) {
    console.error('Error loading markdown:', error)
    markdownContent.value = '<p>内容加载失败</p>'
  }
}

onMounted(() => {
  loadMarkdown()
})
</script>

<style scoped>
.introduction-page {
  min-height: 100vh;
  background: var(--bg-dark);
  padding-top: 80px;
}

/* Page Hero */
.page-hero {
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, var(--bg-darker) 0%, var(--bg-dark) 100%);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-family: var(--font-code);
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.title-bracket {
  color: var(--purple);
}

.title-text {
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

/* Content Section */
.content-section {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.content-container {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
}

/* Markdown Content */
.markdown-content {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1rem;
}

.markdown-content :deep(h1) {
  font-family: var(--font-code);
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border);
}

.markdown-content :deep(h2) {
  font-family: var(--font-code);
  font-size: 1.5rem;
  color: var(--cyan);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.markdown-content :deep(h3) {
  font-family: var(--font-code);
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-top: 1.5rem;
  margin-bottom: 0.8rem;
}

.markdown-content :deep(p) {
  margin-bottom: 1rem;
  text-indent: 2em;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5rem;
}

.markdown-content :deep(strong) {
  color: var(--primary);
  font-weight: 700;
}

.markdown-content :deep(em) {
  color: var(--text-muted);
  font-style: italic;
}

.markdown-content :deep(a) {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px dashed var(--primary);
  transition: all 0.3s ease;
}

.markdown-content :deep(a:hover) {
  color: var(--cyan);
  border-bottom-color: var(--cyan);
}

.markdown-content :deep(blockquote) {
  border-left: 3px solid var(--primary);
  padding-left: 1rem;
  margin: 1rem 0;
  color: var(--text-muted);
  font-style: italic;
}

.markdown-content :deep(code) {
  background: var(--bg-darker);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: var(--font-code);
  font-size: 0.85rem;
  color: var(--cyan);
}

.markdown-content :deep(pre) {
  background: var(--bg-darker);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
  position: relative;
}
/* 3. 复制按钮样式 */
.markdown-content :deep(.copy-code-btn) {
  position: absolute;
  font-family: "Bold";
  top: 0px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
}

/* 4. 悬停时显示按钮 */
.markdown-content :deep(pre:hover .copy-code-btn) {
  opacity: 1;
}

/* 5. 点击反馈（可选） */
.markdown-content :deep(.copy-code-btn.copied) {
  background: rgba(0, 128, 0, 0.8);
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
}

.markdown-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2rem 0;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid var(--border);
  padding: 0.8rem;
  text-align: left;
}

.markdown-content :deep(th) {
  background: var(--bg-darker);
  color: var(--primary);
  font-weight: 700;
}

/* Back to Home */
.back-to-home {
  text-align: center;
  padding: 3rem 2rem;
  border-top: 1px solid var(--border);
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  background: var(--gradient-1);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(192, 132, 252, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-hero {
    padding: 3rem 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .content-section {
    padding: 1rem;
  }
  
  .content-container {
    padding: 1.5rem;
  }
  
  .markdown-content {
    font-size: 0.95rem;
  }
  
  .markdown-content :deep(h1) {
    font-size: 1.5rem;
  }
  
  .markdown-content :deep(h2) {
    font-size: 1.3rem;
  }
  
  .markdown-content :deep(h3) {
    font-size: 1.1rem;
  }
}
</style>
