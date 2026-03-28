<template>
  <div class="about-page">
    <!-- Vertical Wave Timeline -->
    <section class="timeline-section">
      <div class="wave-timeline">
        <!-- SVG Wave Path (Left Side) -->
        <svg
          class="wave-path-svg"
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#c084fc" />
              <stop offset="50%" stop-color="#a78bfa" />
              <stop offset="100%" stop-color="#67e8f9" />
            </linearGradient>
          </defs>
          <path
            class="wave-line"
            d="M50,0 C80,100 20,200 50,300 C80,400 20,500 50,600 C80,700 20,800 50,900 L50,1000"
            fill="none"
            stroke="url(#waveGradient)"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>

        <!-- Timeline Items -->
        <div class="timeline-items">
          <div
            v-for="(item, index) in timelineItems"
            :key="item.id"
            class="timeline-item"
          >
            <!-- Timeline Node -->
            <div class="timeline-node" :style="{ borderColor: item.color }">
              <i
                :class="item.icon || 'fas fa-circle'"
                :style="{ color: item.color }"
              ></i>
            </div>

            <!-- Timeline Card -->
            <div class="timeline-card" :style="{ borderLeftColor: item.color }">
              <div class="card-header">
                <h3 class="card-title">{{ item.title }}</h3>
                <p class="card-subtitle">{{ item.subtitle }}</p>
              </div>
              <div
                class="card-content"
                ref="contentRefs"
              >
                <div v-highlight v-html="getMarkdownContent(item.id)"></div>
              </div>
            </div>
          </div>
        </div>
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
import { ref, onMounted, nextTick, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { marked } from "marked";

const { t } = useI18n();

// Import timeline data
import timelineData from "@/data/timeline.json";

const timelineItems = ref(timelineData);
const markdownContents = ref({});
const expandedItems = reactive({});
const contentHeights = reactive({});
const contentRefs = ref([]);

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Load markdown content for each item
const loadMarkdown = async (item) => {
  try {
    const response = await fetch(item.path);
    if (response.ok) {
      const text = await response.text();
      markdownContents.value[item.id] = marked.parse(text);
    }
  } catch (error) {
    console.error(`Error loading markdown for ${item.id}:`, error);
    markdownContents.value[item.id] = "<p>内容加载失败</p>";
  }
};

// Get markdown content
const getMarkdownContent = (id) => {
  return markdownContents.value[id] || "<p>加载中...</p>";
};

// Toggle expand/collapse
const toggleExpand = (id) => {
  expandedItems[id] = !expandedItems[id];
};

// Check content height after mount
const checkContentHeights = () => {
  nextTick(() => {
    const contentElements = document.querySelectorAll(".card-content");
    contentElements.forEach((el, index) => {
      const itemId = timelineItems.value[index]?.id;
      if (itemId) {
        contentHeights[itemId] = el.scrollHeight;
        // 默认收起超过300px的内容
        if (el.scrollHeight > 100 && expandedItems[itemId] === undefined) {
          expandedItems[itemId] = false;
        }
      }
    });
  });
};

// Load all markdown on mount
onMounted(async () => {
  for (const item of timelineItems.value) {
    await loadMarkdown(item);
  }
  // Check heights after content is loaded
  setTimeout(checkContentHeights, 500);
});
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: var(--bg-dark);
  padding-top: 80px;
}

/* Timeline Section */
.timeline-section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.wave-timeline {
  position: relative;
  padding-left: 80px;
}

/* SVG Wave Path (Left Side) */
.wave-path-svg {
  position: absolute;
  left: 0;
  top: 0;
  width: 60px;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.wave-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: waveDraw 2s ease-out forwards;
}

@keyframes waveDraw {
  to {
    stroke-dashoffset: 0;
  }
}

/* Timeline Items */
.timeline-items {
  position: relative;
  z-index: 2;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  opacity: 0;
  animation: fadeIn 0.6s ease-out forwards;
  position: relative;
}

.timeline-item:nth-child(1) {
  animation-delay: 0.2s;
}
.timeline-item:nth-child(2) {
  animation-delay: 0.4s;
}
.timeline-item:nth-child(3) {
  animation-delay: 0.6s;
}
.timeline-item:nth-child(4) {
  animation-delay: 0.8s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Timeline Node */
.timeline-node {
  position: absolute;
  left: -80px;
  top: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 3px solid var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  box-shadow: 0 0 20px rgba(192, 132, 252, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(192, 132, 252, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(192, 132, 252, 0.5);
  }
}

.timeline-node i {
  font-size: 1.2rem;
}

/* Timeline Card */
.timeline-card {
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 4px solid var(--primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 0 1.5rem;
  transition: all 0.3s ease;
  max-width: calc(100% - 80px);
}

.card-header {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.card-title {
  font-family: var(--font-code);
  font-size: 1.3rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.card-subtitle {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Card Content - Markdown */
.card-content {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 0.95rem;
  overflow: hidden;
  transition: max-height 0.5s ease;
  max-height: none;
}

.card-content.collapsed {
  max-height: 100px;
  position: relative;
}

.card-content.collapsed::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(transparent, var(--bg-card));
  pointer-events: none;
}

.card-content :deep(h1),
.card-content :deep(h2),
.card-content :deep(h3) {
  color: var(--text-primary);
  margin-top: 1.5rem;
  margin-bottom: 0.8rem;
  font-weight: 700;
}

.card-content :deep(h1) {
  font-size: 1.5rem;
}
.card-content :deep(h2) {
  font-size: 1.3rem;
}
.card-content :deep(h3) {
  font-size: 1.1rem;
}

.card-content :deep(p) {
  margin-bottom: 1rem;
  text-indent: 2em;
}

.card-content :deep(ul),
.card-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.card-content :deep(li) {
  margin-bottom: 0.5rem;
}
.card-content :deep(input) {
  accent-color: green;
}
.card-content :deep(strong) {
  color: var(--primary);
  font-weight: 700;
}

.card-content :deep(blockquote) {
  border-left: 3px solid var(--primary);
  padding-left: 1rem;
  margin: 1rem 0;
  color: var(--text-muted);
  font-style: italic;
}

.card-content :deep(code) {
  background: var(--bg-darker);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: var(--font-code);
  font-size: 0.85rem;
  color: var(--cyan);
}

.card-content :deep(pre) {
  background: var(--bg-darker);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
  position: relative;
}
/* 3. 复制按钮样式 */
.card-content :deep(.copy-code-btn) {
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
.card-content :deep(pre:hover .copy-code-btn) {
  opacity: 1;
}

/* 5. 点击反馈（可选） */
.card-content :deep(.copy-code-btn.copied) {
  background: rgba(0, 128, 0, 0.8);
}
.card-content :deep(pre code) {
  background: none;
  padding: 0;
}

.card-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.card-content :deep(th),
.card-content :deep(td) {
  border: 1px solid var(--border);
  padding: 0.8rem;
  text-align: left;
}

.card-content :deep(th) {
  background: var(--bg-darker);
  color: var(--primary);
  font-weight: 700;
}
.card-content :deep(a) {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px dashed var(--primary);
  transition: all 0.3s ease;
}
.card-content :deep(a:hover) {
  color: var(--cyan);
  border-bottom-color: var(--cyan);
}
.card-content :deep(a:visited) {
  color: var(--purple);
}
.card-content :deep(a:active) {
  color: var(--accent);
}
/* Expand Button */
.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8rem;
  margin-top: 1rem;
  background: var(--bg-darker);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--primary);
  font-family: var(--font-code);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.expand-btn:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.expand-btn i {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
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
@media (max-width: 992px) {
  .wave-timeline {
    padding-left: 60px;
  }

  .timeline-node {
    left: -60px;
    width: 45px;
    height: 45px;
  }

  .wave-path-svg {
    width: 50px;
  }
}

@media (max-width: 768px) {
  .timeline-section {
    padding: 2rem 1rem;
  }

  .wave-timeline {
    padding-left: 50px;
  }

  .timeline-node {
    left: -50px;
    width: 40px;
    height: 40px;
  }

  .timeline-node i {
    font-size: 1rem;
  }

  .wave-path-svg {
    width: 40px;
  }

  .timeline-card {
    padding: 1rem;
  }

  .card-title {
    font-size: 1.1rem;
  }

  .card-content {
    font-size: 0.9rem;
  }

  .card-content.collapsed {
    max-height: 250px;
  }
}
</style>
