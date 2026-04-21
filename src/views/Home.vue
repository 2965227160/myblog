<template>
  <div id="home" class="fullscreen-container">
    <div class="hero-background">
      <div class="code-grid-bg"></div>
      <div class="floating-particles" id="particles"></div>
    </div>
    <div class="fullPage" ref="fullPage">
      <div class="fullPageContainer" ref="fullPageContainer" @mousewheel="mouseWheelHandle"
        @DOMMouseScroll="mouseWheelHandle" @touchstart="handleTouchstart" @touchend="handleTouchend"
        @touchmove="handleTouchmove">
        <!-- 修改点：使用函数式 ref 将组件实例存入 sectionRefs 数组 -->
        <div class="section">
          <TheHero @goto-contact="scrollToSection(5)" @goto-projects="scrollToSection(4)"
            :ref="(el) => sectionRefs[0] = el" />
        </div>
        <div class="section">
          <TheAbout :ref="(el) => sectionRefs[1] = el" />
        </div>
        <div class="section">
          <TheSkills :ref="(el) => sectionRefs[2] = el" />
        </div>
        <div class="section">
          <TheExperience :ref="(el) => sectionRefs[3] = el" />
        </div>
        <div class="section">
          <TheProjects :ref="(el) => sectionRefs[4] = el" />
        </div>
        <div class="section">
          <TheContact :ref="(el) => sectionRefs[5] = el" />
        </div>
      </div>
    </div>

    <!-- Section Indicators (保持不变) -->
    <div class="section-indicators">
      <div v-for="(section, index) in sections" :key="index" class="section-indicator"
        :class="{ active: fullpage.current === index + 1 }" @click="scrollToSection(index)"></div>
    </div>
  </div>

  <!-- SVG Filters (保持不变) -->
  <svg v-if="true" xmlns="http://www.w3.org/2000/svg" version="1.1"
    style="position: fixed; width: 0; height: 0; pointer-events: none">
    <defs>
      <filter id="scrollBlurVertical">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0,10" />
      </filter>
      <filter id="scrollBlurHorizontal">
        <feGaussianBlur in="SourceGraphic" stdDeviation="12,0" />
      </filter>
    </defs>
  </svg>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted } from "vue";
import TheHero from "../components/TheHero.vue";
import TheAbout from "../components/TheAbout.vue";
import TheSkills from "../components/TheSkills.vue";
import TheExperience from "../components/TheExperience.vue";
import TheProjects from "../components/TheProjects.vue";
import TheContact from "../components/TheContact.vue";

const sections = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
];

// 【新增】存储子组件实例的数组
const sectionRefs = ref([]);

// Current section index (0-based)
const currentSectionIndex = ref(0);

// Provide currentSection to TheHeader (如果需要)
// import { provide } from 'vue'; 
// provide('currentSectionIndex', currentSectionIndex);

const scrollToSection = (index) => {
  if (fullpage.value.isScrolling || index + 1 === fullpage.value.current)
    return;
  preIndex.value = fullpage.value.current - 1;
  fullpage.value.current = index + 1;
  move(fullpage.value.current);
  updateCurrentSection();
};

const fullpage = ref({
  current: 1,
  isScrolling: false,
  deltaY: 0,
});

const startTime = ref(0);
const startX = ref(0);
const startY = ref(0);

const fullPage = ref(null);
const fullPageContainer = ref(null);
const preIndex = ref(0)
const PAGE_COUNT = 6;

const updateCurrentSection = () => {
  currentSectionIndex.value = fullpage.value.current - 1;
};

// 执行滚动切换
const move = (index, direction) => {
  if (fullpage.value.isScrolling) return;

  toggleSectionBlur(true, direction);

  fullpage.value.isScrolling = true;

  // 【修改点】先执行位移，然后触发目标组件的动画
  directToMove(index);

  // 动画触发时机：
  // 选项 A: 立即触发 (可能页面还在滑动，用户体验稍乱)
  // 选项 B: 等待 CSS transition 结束 (推荐，等页面滑到位再播动画)
  // 这里我们保持原有的 150ms 模糊逻辑，但将动画触发放在 transition 结束后

  setTimeout(() => {
    toggleSectionBlur(false, direction);

    // 【核心逻辑】触发目标 Section 的 playAnime
    triggerSectionAnimation(index);

    fullpage.value.isScrolling = false;
  }, 150);
};

// 【新增】触发指定索引组件的动画
const triggerSectionAnimation = (index) => {
  // 注意：index 是 1-based (因为 fullpage.current 是 1-based)
  // 数组下标是 0-based，所以要减 1
  const targetIndex = index - 1;
  nextTick(() => {
    if (targetIndex >= 0 && targetIndex < sectionRefs.value.length) {
      const componentInstance = sectionRefs.value[targetIndex];
      const preInstance = sectionRefs.value[preIndex.value]
      // 检查组件是否存在，且是否暴露了 playAnime 方法
      if (componentInstance && typeof componentInstance.playAnime === 'function') {
        if (preInstance && typeof preInstance.resetAnime === 'function') {
          preInstance.resetAnime();
        }
        componentInstance.playAnime();
      }
    }
  })
};

const directToMove = (index) => {
  if (!fullPage.value) return;

  const height = fullPage.value.clientHeight;
  const scrollPage = fullPageContainer.value;

  const scrollHeight = -(index - 1) * height + "px";

  if (scrollPage) {
    scrollPage.style.transform = `translateY(${scrollHeight})`;
  }

  fullpage.value.current = index;
};

const mouseWheelHandle = (event) => {
  event.stopPropagation();
  event.preventDefault();

  if (fullpage.value.isScrolling) return;

  const deltaY = event.deltaY || event.detail || 0;
  fullpage.value.deltaY = deltaY;
  preIndex.value = fullpage.value.current - 1;
  if (deltaY > 0) {
    next("down");
  } else if (deltaY < 0) {
    pre("up");
  }
};

const next = (direction) => {
  if (fullpage.value.current + 1 <= PAGE_COUNT) {
    fullpage.value.current += 1;
    move(fullpage.value.current, direction);
  }
};

const pre = (direction) => {
  if (fullpage.value.current - 1 > 0) {
    fullpage.value.current -= 1;
    move(fullpage.value.current, direction);
  }
};

const handleTouchmove = (event) => {
  event.preventDefault();
};

const handleTouchstart = (event) => {
  startTime.value = Date.now();
  const touch = event.changedTouches[0];
  startX.value = touch.clientX;
  startY.value = touch.clientY;
};

const handleTouchend = (event) => {
  const endTime = Date.now();
  const touch = event.changedTouches[0];
  const endX = touch.clientX;
  const endY = touch.clientY;

  if (endTime - startTime.value > 2000) {
    return;
  }

  const distanceY = endY - startY.value;
  if (Math.abs(distanceY) <= 10) return;

  const direction = distanceY > 0 ? "down" : "up";

  if (direction === "up") {
    next("up");
  } else if (direction === "down") {
    pre("down");
  }
};
const getSections = () => {
  return fullPageContainer.value?.querySelectorAll(".section") || [];
};

const toggleSectionBlur = (addBlur, direction) => {
  const sections = getSections();
  sections.forEach((section, index) => {
    const pageIndex = index + 1;
    const isNearCurrent = Math.abs(pageIndex - fullpage.value.current) <= 1;
    if (!isNearCurrent) return;
    if (addBlur) {
      section.classList.add(
        direction === "down" ? "blurred-scroll-down" : "blurred-scroll-up"
      );
    } else {
      section.classList.remove("blurred-scroll-down", "blurred-scroll-up");
    }
  });
};
const initFloatingBadges = () => {
  const container = document.getElementById('particles');
  if (container) {
    container.innerHTML = '';
  } else {
    // 如果连容器都没有，就没必要继续了
    return;
  }
  const badges = document.querySelectorAll('.floating-badge')
  const codeSymbols = ['{', '}', '[', ']', '(', ')', '<', '>', '/', '*', '=', '+', '-', ';']

  for (let i = 0; i < 60; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    particle.textContent = codeSymbols[Math.floor(Math.random() * codeSymbols.length)]
    particle.style.left = Math.random() * 100 + '%'
    particle.style.animationDelay = Math.random() * 15 + 's'
    particle.style.animationDuration = (10 + Math.random() * 10) + 's'
    document.getElementById('particles')?.appendChild(particle);
  }
}
onMounted(() => {
  initFloatingBadges();
  // 首次挂载时触发 Hero section 的入场动画（含光圈扩散）
  nextTick(() => {
    if (sectionRefs.value[0] && typeof sectionRefs.value[0].playAnime === 'function') {
      sectionRefs.value[0].playAnime();
    }
  });
})
</script>

<style scoped>
/* 样式保持不变 */
.fullscreen-container {
  height: 100vh;
  overflow-y: scroll;
  scroll-behavior: smooth;
}

.fullPage {
  height: 100vh;
  overflow: hidden;
}

.fullPageContainer {
  width: 100%;
  height: 100vh;
  transition: all linear 0.15s;
}

.section {
  width: 100%;
  height: 100vh;
  background-position: center center;
  background-repeat: no-repeat;
  transition:
    filter 0.3s ease-out,
    transform 1s ease-in-out;
  will-change: filter, transform;
}

.section.blurred-scroll-down,
.section.blurred-scroll-up {
  filter: url("#scrollBlurVertical");
  opacity: 0.95;
}
</style>