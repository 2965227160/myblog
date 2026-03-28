<template>
  <section id="projects" class="section projects-section">
    <div class="section-container">
      <div class="section-header">
        <span class="section-number">04</span>
        <h2 class="section-title">
          <span class="title-bracket">&lt;</span>
          <span class="title-text">{{ t('projects.title') }}</span>
          <span class="title-bracket">/&gt;</span>
        </h2>
        <div class="section-line"></div>
      </div>

      <div class="projects-grid" ref="projectsGrid">
        <div v-for="(project, index) in projects" :key="index" class="project-card" @mouseenter="scaleCard(index, 1.02)"
          @mouseleave="scaleCard(index, 1)">
          <div class="project-image">
            <!-- <div class="project-overlay">
              <div class="project-links">
                <a href="#" class="project-link" title="View Project">
                  <i class="fas fa-external-link-alt"></i>
                </a>
                <a href="#" class="project-link" title="View Code">
                  <i class="fab fa-github"></i>
                </a>
              </div>
            </div> -->
            <div class="project-placeholder">
              <i :class="project.icon"></i>
            </div>
          </div>
          <div class="project-content">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description">{{ project.description }}</p>
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import anime from 'animejs'

const { t } = useI18n()

const projects = ref([
  {
    title: '甄果短剧平台',
    description: '具有免费播放、付费解锁、用户管理的短剧播放平台，有h5，微信小程序等多个客户端。',
    icon: 'fa-solid fa-video',
    tags: ['Vue3', 'Vant4', 'Gin']
  },
  {
    title: '数据云服务托管平台',
    description: '支持用户购买数据和服务器，并在该平台完成查询的服务，支持上传服务和用户管理。',
    icon: 'fa-solid fa-cloud-arrow-up',
    tags: ['Vue3', 'SpringBoot', 'Echarts']
  },
  {
    title: 'LMS计算机实验教学系统',
    description: '提供类似蓝桥云课的在线实验课平台，拥有实验机操作、题目在线判定和学生管理等功能。',
    icon: 'fa-solid fa-computer',
    tags: ['React', 'Docker', 'KVM', 'Ruby']
  }
])
const projectsGrid = ref(null);

const playAnime = () => {
  if (!projectsGrid.value) return;

  anime({
    targets: '.project-card',
    opacity: [0, 1],
    translateY: [30, 0], // 从下方 30px 处浮现
    scale: [0.95, 1],    // 伴随轻微的放大效果 (从 95% 到 100%)
    easing: 'easeOutCubic',
    duration: 800,
    delay: anime.stagger(150), // 关键：每张卡片间隔 150ms
  });
};
const resetAnime = () => {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach((card, index) => {
    // 1. 停止该元素上正在运行的所有 anime.js 动画
    // 这步非常关键，防止用户快速切换导致动画状态错乱
    anime.remove(card);

    // 2. 直接通过内联样式强制重置为初始值
    // 必须与 playAnime 中的起始值 [0, 30, 0.95] 完全一致
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.95)';

    // 3. 清除可能存在的 transition (虽然 anime.js 通常不依赖这个，但为了保险)
    card.style.transition = 'none';

    // 4. 可选：清除 delay 带来的潜在影响
    // anime.js 的 stagger 是通过 delay 实现的，重置时不需要特殊处理，
    // 只要样式对了，下次 playAnime 会重新计算 delay。
  });
};
const scaleCard = (index, scale) => {
  const cards = document.querySelectorAll('.project-card')
  if (cards[index]) {
    anime({
      targets: cards[index],
      scale: scale,
      duration: 300,
      easing: 'easeOutQuad'
    })
  }
}
defineExpose({
  playAnime,
  resetAnime
});
</script>
