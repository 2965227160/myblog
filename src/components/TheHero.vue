<template>
  <section id="hero" class="hero-section">

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
          <SpineAnimation :json-path="`${baseurl}/anime/kv42.json`" :atlas-path="`${baseurl}/anime/kv42.atlas`"
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

// 处理“查看项目”按钮点击
const handleViewProjects = () => {
  emit('goto-projects')
}
const { t } = useI18n()
const heroName = ref(null)

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

const playAnime = () => {
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
  // 1. 停止所有相关动画
  // 使用选择器字符串可以一次性清除该类下所有元素的动画
  anime.remove('.hero-title');
  anime.remove('.hero-description');
  anime.remove('.hero-buttons .btn');
  anime.remove('.hero-social .social-icon');
  anime.remove('.profile-image');
  anime.remove('.floating-badge');

  // 2. 定义重置配置的辅助函数
  // 这样代码更整洁，避免重复写 style 赋值
  const setStyles = (selector, styles) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      Object.assign(el.style, styles);
      el.style.transition = 'none'; // 关键：防止 CSS transition 干扰
    });
  };

  // 3. 应用初始状态

  // Hero Title: opacity 0, translateX -30px
  setStyles('.hero-title', {
    opacity: '0',
    transform: 'translateX(-30px)'
    // 注意：如果元素原本有其他 transform，这里会覆盖。
    // 如果原本有 rotate/scale，需要写成 transform: 'translateX(-30px) scale(1)...'
    // 鉴于这是初始加载动画，通常假设初始没有其他 transform
  });

  // Hero Description: opacity 0, translateY 20px
  setStyles('.hero-description', {
    opacity: '0',
    transform: 'translateY(20px)'
  });

  // Hero Buttons: opacity 0, scale 0.8
  // 注意：scale 需要保留默认的 translate(0,0) 以防布局偏移，但通常只写 scale 即可
  setStyles('.hero-buttons .btn', {
    opacity: '0',
    transform: 'scale(0.8)'
  });

  // Hero Social Icons: opacity 0, scale 0, rotate 180deg
  // 多个 transform 属性需要用空格隔开
  setStyles('.hero-social .social-icon', {
    opacity: '0',
    transform: 'scale(0) rotate(180deg)'
  });

  // Profile Image: opacity 0, scale 0.8, rotate 180deg
  setStyles('.profile-image', {
    opacity: '0',
    transform: 'scale(0.8) rotate(180deg)'
  });

  // Floating Badges: opacity 0, scale 0
  setStyles('.floating-badge', {
    opacity: '0',
    transform: 'scale(0)'
  });

  // 4. 【关键】强制重绘 (Reflow)
  // 确保浏览器立刻应用上述“隐藏”状态，以便下一次播放时能从 0 开始
  // 选取任意一个存在的元素触发即可
  const anyElement = document.querySelector('.hero-title') || document.querySelector('.profile-image');
  if (anyElement) {
    anyElement.getBoundingClientRect();
  }
};

// onMounted(() => {
//   nextTick(() => {
//     setTimeout(initHeroAnimations, 500)
//   })
// })
defineExpose({
  playAnime,
  resetAnime
});
</script>
