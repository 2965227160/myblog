<template>
  <section id="hero" class="hero-section">

    <!-- 光圈扩散遮罩 -->
    <div class="spotlight-overlay" ref="spotlightRef" v-show="spotlightVisible">
      <div class="spotlight-glow" ref="spotlightGlowRef"></div>
    </div>

    <div class="hero-container">
      <div class="hero-content">
        <div class="hero-greeting">
          <span class="greeting-text">{{ t('hero.greeting') }}</span>
          <span class="greeting-cursor">|</span>
        </div>

        <h1 class="hero-name" ref="heroName">
          <span class="name-prefix">const zhl</span>
          <span class="name-operator">=</span>
          <span class="name-value">Developer();</span>
        </h1>

        <div class="hero-title">
          <span class="title-prefix">//</span>
          <span class="title-text">{{ t('hero.title') }}</span>
        </div>

        <p class="hero-description">{{ t('hero.description') }}</p>

        <div class="hero-buttons">
          <!-- 将 <a> 改为 <button>，保留类名，添加 type="button" 防止表单提交 -->
          <button type="button" class="btn btn-primary" @click="handleGetInTouch">
            <span>{{ t('hero.getInTouch') }}</span>
            <i class="fas fa-arrow-right"></i>
          </button>
          <button type="button" class="btn btn-secondary" @click="handleViewProjects">
            <span>{{ t('hero.viewProjects') }}</span>
            <i class="fas fa-code"></i>
          </button>
        </div>

        <div class="hero-social">
          <a href="https://github.com/2965227160" class="social-icon" title="GitHub">
            <i class="fab fa-github"></i>
          </a>
          <a href="https://space.bilibili.com/475878501" class="social-icon" title="Bilibili">
            <i class="fa-brands fa-bilibili"></i>
          </a>
          <a href="https://leetcode.cn/u/yi-xie-zhi-qiu-87/" class="social-icon" title="Leetcode">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path
                d="M235.4 9.3C246.5-2.5 265.1-3.2 277 7.9s12.5 29.8 1.4 41.6l-43 46c21.5 3.3 42.1 11.8 59.1 25.6l74.6 60.3c12.6 10.2 14.6 28.8 4.4 41.4s-28.7 14.6-41.4 4.4l-74.6-60.3c-26.2-21.1-71.9-18.2-94.5 5.9L81 261c-21.5 23-19.1 60 5.6 84.2l91.2 89.4c24.9 24 65.6 24 90.1-.4l51.1-51c11.5-11.5 30.1-11.5 41.6 .1s11.4 30.2-.1 41.7l-51.1 51c-47.1 47.1-124 47.7-171.9 1.6l-92-90.2C-1.4 341.3-6 267.9 38 220.7L235.4 9.3zM411.7 273.2c16.2 0 29.4 13.2 29.4 29.5s-13.2 29.5-29.4 29.5l-216.9 0c-16.2 0-29.4-13.2-29.4-29.5s13.2-29.5 29.4-29.5l216.9 0z" />
            </svg>
          </a>
          <a href="https://blog.csdn.net/qq_55389115" class="social-icon" title="Csdn">
            <svg t="1776440481725" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="5687" width="16" height="16">
              <path
                d="M229.12 841.92c-170.88-237.76-46.4-629.12 236.16-716.8 118.4-38.08 262.72-16.96 351.36 74.24 48.64 43.2 1.28 102.4-24.96 141.76-81.92-62.4-179.2-143.04-289.92-102.08C303.36 310.4 232 593.28 338.24 764.8c128 141.44 358.08 94.08 488.64-20.48 42.88 37.12 88.96 112.32 24.64 153.92-182.4 120.96-474.24 120-622.4-56.32z">
              </path>
            </svg>
          </a>
        </div>
      </div>
      <div class="updown">
        <div class="hero-image-wrapper">
          <SpineAnimation ref="spineRef" :json-path="`${baseurl}/anime/kv42.json`" :atlas-path="`${baseurl}/anime/kv42.atlas`"
            :scale="0.25" :loop="true" in="in" keep="loop3" />
        </div>
        <div class="hero-image-wrapper2">
          <div class="hero-image-container">
            <div class="profile-image-glow"></div>
            <div class="profile-image-frame">
              <div class="profile-image">
                <div class="profile-placeholder">
                  <i class="fas fa-code"></i>
                </div>
              </div>
            </div>
            <div class="floating-badge badge-1">
              <i class="fa-brands fa-vuejs"></i>
              <div class="badge-content">
                <span class="badge-title">Vue.js</span>
                <span class="badge-libs">Vite, Vue2, Vue3</span>
              </div>
            </div>
            <div class="floating-badge badge-2">
              <i class="fa-brands fa-java"></i>
              <div class="badge-content">
                <span class="badge-title">Java</span>
                <span class="badge-libs">SpringBoot</span>
              </div>
            </div>
            <div class="floating-badge badge-3">
              <i class="fa-brands fa-golang"></i>
              <div class="badge-content">
                <span class="badge-title">Go</span>
                <span class="badge-libs">Gin, Gorm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="scroll-indicator" @click="scrollDown">
      <div class="scroll-mouse">
        <div class="scroll-wheel"></div>
      </div>
      <span class="scroll-text">{{ t('hero.scrollDown') }}</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount, onActivated } from 'vue'
import { useI18n } from 'vue-i18n'
import anime from 'animejs'
import SpineAnimation from './SpineAnimation.vue'
import { onBeforeRouteLeave } from 'vue-router'
const baseurl = import.meta.env.BASE_URL
const emit = defineEmits(['goto-contact', 'goto-projects'])
const handleGetInTouch = () => {
  emit('goto-contact')
}

// 处理"查看项目"按钮点击
const handleViewProjects = () => {
  emit('goto-projects')
}
const { t } = useI18n()
const heroName = ref(null)
const spotlightRef = ref(null)
const spotlightGlowRef = ref(null)
const spotlightVisible = ref(true)
const spineRef = ref(null)

const scrollDown = () => {
  // Scroll to next section
  const nextIndex = 1
  const offsetTop = calculateSectionOffset(nextIndex)
  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth'
  })
}

const calculateSectionOffset = (index) => {
  const paddingPerSection = 8 * index // 4rem top + 4rem bottom for each previous section
  return window.innerHeight * index + paddingPerSection
}

// 光圈扩散动画
const playSpotlight = () => {
  if (!spotlightRef.value) return
  spotlightVisible.value = true

  // 计算 spine 动画在 hero section 中的中心位置（百分比）
  const spineWrapper = document.querySelector('.hero-image-wrapper')
  const heroSection = document.querySelector('.hero-section')
  let cx = 65
  let cy = 70
  if (spineWrapper && heroSection) {
    const sr = spineWrapper.getBoundingClientRect()
    const hr = heroSection.getBoundingClientRect()
    cx = ((sr.left + sr.width / 2 - hr.left) / hr.width) * 100 + 4
    cy = ((sr.top + sr.height / 2 - hr.top) / hr.height) * 100 - 10
  }

  const blurWidth = 50 // 边缘模糊过渡宽度
  const startRadius = 120 // 初始光圈半径
  const endRadius = Math.max(window.innerWidth, window.innerHeight) * 1.5

  // 更新 mask：radial-gradient 从 transparent 到 black 实现边缘模糊
  const setMask = (radius) => {
    if (!spotlightRef.value) return
    const innerR = Math.max(0, radius - blurWidth)
    const mask = `radial-gradient(circle ${radius}px at ${cx}% ${cy}%, transparent ${innerR}px, black ${radius}px)`
    spotlightRef.value.style.webkitMaskImage = mask
    spotlightRef.value.style.maskImage = mask
  }

  // 定位发光环元素到光圈中心
  if (spotlightGlowRef.value) {
    spotlightGlowRef.value.style.left = `${cx}%`
    spotlightGlowRef.value.style.top = `${cy}%`
  }

  setMask(startRadius)

  // 使用 anime.js 驱动半径动画
  anime({
    targets: { radius: startRadius },
    radius: endRadius,
    delay: 600, // 等 800ms 后开始扩散，让 spine 先展示一会
    duration: 1000,
    easing: 'easeInOutCubic',
    update: (anim) => {
      const r = anim.animations[0].currentValue
      setMask(r)

      // 同步更新发光环大小和透明度
      if (spotlightGlowRef.value) {
        const size = r * 2
        spotlightGlowRef.value.style.width = `${size}px`
        spotlightGlowRef.value.style.height = `${size}px`
        const progress = (r - startRadius) / (endRadius - startRadius)
        spotlightGlowRef.value.style.opacity = Math.max(0, 1 - progress * 1.2)
      }
    },
    complete: () => {
      spotlightVisible.value = false
    }
  })
}

const playAnime = () => {
  // 重置 Spine 动画：先播 in 入场动画，完成后自动循环 keep
  if (spineRef.value && typeof spineRef.value.restart === 'function') {
    spineRef.value.restart()
  }

  // 先触发光圈扩散
  playSpotlight()

  // 其余入场动画按时播放（光圈会逐步揭开内容）
  anime({
    targets: '.hero-title',
    opacity: [0, 1],
    translateX: [-30, 0],
    delay: 0,
    duration: 1000,
    easing: 'easeOutExpo'
  })

  anime({
    targets: '.hero-description',
    opacity: [0, 1],
    translateY: [20, 0],
    delay: 400,
    duration: 1000,
    easing: 'easeOutExpo'
  })

  anime({
    targets: '.hero-buttons .btn',
    opacity: [0, 1],
    scale: [0.8, 1],
    delay: anime.stagger(100, { start: 1500 }),
    duration: 800,
    easing: 'easeOutBack'
  })

  anime({
    targets: '.hero-social .social-icon',
    opacity: [0, 1],
    scale: [0, 1],
    rotate: [180, 0],
    delay: anime.stagger(100, { start: 2000 }),
    duration: 800,
    easing: 'easeOutBack'
  })

  anime({
    targets: '.profile-image',
    opacity: [0, 1],
    scale: [0.8, 1],
    rotate: [180, 0],
    delay: 200,
    duration: 1500,
    easing: 'easeOutElastic(1, .8)'
  })

  anime({
    targets: '.floating-badge',
    opacity: [0, 1],
    scale: [0, 1],
    delay: anime.stagger(200, { start: 1500 }),
    duration: 800,
    easing: 'easeOutBack'
  })
}
const resetAnime = () => {
  // 停止所有相关动画
  anime.remove('.hero-title');
  anime.remove('.hero-description');
  anime.remove('.hero-buttons .btn');
  anime.remove('.hero-social .social-icon');
  anime.remove('.profile-image');
  anime.remove('.floating-badge');

  const setStyles = (selector, styles) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      Object.assign(el.style, styles);
      el.style.transition = 'none';
    });
  };

  setStyles('.hero-title', {
    opacity: '0',
    transform: 'translateX(-30px)'
  });

  setStyles('.hero-description', {
    opacity: '0',
    transform: 'translateY(20px)'
  });

  setStyles('.hero-buttons .btn', {
    opacity: '0',
    transform: 'scale(0.8)'
  });

  setStyles('.hero-social .social-icon', {
    opacity: '0',
    transform: 'scale(0) rotate(180deg)'
  });

  setStyles('.profile-image', {
    opacity: '0',
    transform: 'scale(0.8) rotate(180deg)'
  });

  setStyles('.floating-badge', {
    opacity: '0',
    transform: 'scale(0)'
  });

  const anyElement = document.querySelector('.hero-title') || document.querySelector('.profile-image');
  if (anyElement) {
    anyElement.getBoundingClientRect();
  }
};

defineExpose({
  playAnime,
  resetAnime
});
</script>

<style scoped>
.spotlight-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: var(--bg-darker, #020617);
  pointer-events: none;
}

.spotlight-glow {
  position: absolute;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
  box-shadow:
    0 0 40px 15px rgba(192, 132, 252, 0.15),
    0 0 80px 30px rgba(192, 132, 252, 0.08);
  opacity: 1;
  width: 240px;
  height: 240px;
  transition: opacity 0.3s ease;
}
</style>