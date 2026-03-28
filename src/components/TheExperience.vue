<template>
  <section id="experience" class="section experience-section">
    <div class="section-container">
      <div class="section-header">
        <span class="section-number">03</span>
        <h2 class="section-title">
          <span class="title-bracket">&lt;</span>
          <span class="title-text">{{ t('experience.title') }}</span>
          <span class="title-bracket">/&gt;</span>
        </h2>
        <div class="section-line"></div>
      </div>

      <div class="horizontal-timeline-wrapper">
        <!-- 波浪背景 -->
        <div class="wave-container">
          <svg class="wave-svg" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path class="wave-path"
              d="M0,100 C150,50 350,150 500,100 C650,50 850,150 1000,100 C1150,50 1200,100 1200,100" fill="none"
              stroke="url(#waveGradient)" stroke-width="3" />
            <path class="wave-path-secondary"
              d="M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100 C1150,150 1200,100 1200,100" fill="none"
              stroke="url(#waveGradient)" stroke-width="2" opacity="0.5" />
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#c084fc" />
                <stop offset="50%" stop-color="#a78bfa" />
                <stop offset="100%" stop-color="#67e8f9" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <!-- 水平时间线 -->
        <div class="horizontal-timeline">
          <div v-for="(item, index) in experiences" :key="index" class="timeline-item" :class="item.type" :style="{
            '--wave-offset': index % 2 === 0 ? '0px' : '40px',
            animationDelay: `${index * 0.3}s`
          }">
            <!-- 连接点 -->
            <div class="timeline-connector">
              <div class="connector-dot"></div>
              <div class="connector-line"></div>
            </div>

            <!-- 经验卡片 -->
            <div class="timeline-card">
              <div class="card-header">
                <span class="timeline-year">{{ item.year }}</span>
                <span v-if="item.current" class="timeline-badge">{{ t('experience.current') }}</span>
              </div>
              <h3 class="timeline-title">{{ item.title }}</h3>
              <div class="timeline-company">
                <i class="fas fa-building"></i>
                {{ item.company }}
              </div>
              <div class="timeline-tags">
                <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import anime from 'animejs'

const { t } = useI18n()

const experiences = ref([
  {
    type: 'senior',
    year: '2023.09 - 今',
    current: true,
    title: '研发部-全栈工程师',
    company: '不知名某互联网公司',
    description: t('experience.seniorDesc'),
    achievements: [
      t('experience.seniorAchievement1'),
      t('experience.seniorAchievement2'),
      t('experience.seniorAchievement3')
    ],
    tags: ['Go', 'Vue.js', 'TypeScript', 'Docker', 'Kubernetes', 'Java', 'AI Agent']
  },
  {
    type: 'frontend',
    year: '2023.04 - 2023.09',
    title: '应用工程部-运维工程师',
    company: '不知名某互联网公司',
    description: t('experience.frontendDesc'),
    achievements: [
      t('experience.frontendAchievement1'),
      t('experience.frontendAchievement2')
    ],
    tags: ['Linux', 'Docker', 'KVM', 'OpenStack']
  },
  {
    type: 'junior',
    year: '2019.09 - 2023.06',
    title: '计算机科学与技术-学生',
    company: '北京科技大学',
    description: '本科',
    tags: ['JSP', 'C++', 'MySql', 'Unity']
  }
])

const playAnime = () => {
  // 1. 【关键】使用 nextTick 确保 DOM 已经完全更新
  // 如果是在子组件挂载后立即调用，这一步至关重要
  // 如果你是在父组件通过 ref 调用，建议也在父组件加 nextTick，或者在这里加
  setTimeout(() => {
    const wavePaths = document.querySelectorAll('.wave-path');
    const wavePathSecondary = document.querySelectorAll('.wave-path-secondary');
    const timelineItems = document.querySelectorAll('.timeline-item');
    wavePaths.forEach((path) => {
      // 获取路径实际长度
      const length = path.getTotalLength();

      // 强制重置样式 (为了支持重复播放)
      // 设置 dasharray 和 dashoffset 为路径长度，使其完全不可见
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      // 强制重绘 (Reflow)，确保浏览器应用了上面的重置样式
      path.getBoundingClientRect();

      // 开始动画
      anime({
        targets: path,
        strokeDashoffset: [length, 0], // 从 长度 变到 0
        easing: 'easeInOutSine',
        duration: 2000,
        delay: 0
      });
    });
    wavePathSecondary.forEach((path) => {
      // 获取路径实际长度
      const length = path.getTotalLength();

      // 强制重置样式 (为了支持重复播放)
      // 设置 dasharray 和 dashoffset 为路径长度，使其完全不可见
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      // 强制重绘 (Reflow)，确保浏览器应用了上面的重置样式
      path.getBoundingClientRect();

      // 开始动画
      anime({
        targets: path,
        strokeDashoffset: [length, 0], // 从 长度 变到 0
        easing: 'easeInOutSine',
        duration: 2000,
        delay: 0
      });
    });
    // 3. 时间轴条目动画 (修复重复播放问题)
    timelineItems.forEach((item, index) => {
      // 强制重置样式
      item.style.opacity = '0';
      item.style.transform = 'translateY(50px)';
      // 强制重绘
      item.getBoundingClientRect();

      anime({
        targets: item,
        opacity: [0, 1],
        translateY: [50, 0],
        delay: index * 400,
        duration: 800,
        easing: 'easeOutBack'
      });
    });
  }, 50); // 微小延迟，确保父组件的 transform 切换已完成，元素在视口内
};
const resetAnime = () => {
  // 1. 获取元素
  const wavePaths = document.querySelectorAll('.wave-path');
  const wavePathSecondary = document.querySelectorAll('.wave-path-secondary');
  const timelineItems = document.querySelectorAll('.timeline-item');

  // --- 处理 SVG 路径 (波浪线) ---
  const allPaths = [...wavePaths, ...wavePathSecondary];

  allPaths.forEach((path) => {
    // A. 停止该元素上正在运行的所有 anime.js 动画
    anime.remove(path);

    // B. 重新获取路径实际长度 (防止窗口缩放导致长度变化)
    const length = path.getTotalLength();

    // C. 瞬间设置为“完全不可见”的初始状态
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    // D. 清除可能残留的 transition
    path.style.transition = 'none';
  });

  // --- 处理时间轴条目 ---
  timelineItems.forEach((item) => {
    // A. 停止动画
    anime.remove(item);

    // B. 瞬间设置为“隐藏且下移”的初始状态
    item.style.opacity = '0';
    item.style.transform = 'translateY(50px)';

    // C. 清除 transition
    item.style.transition = 'none';
  });

  // E. 【关键】强制浏览器重绘 (Reflow)
  // 确保浏览器立刻应用上述样式，而不是等到下一帧
  // 这样下次调用 playAnime 时，起始状态才是正确的“不可见”
  if (allPaths.length > 0) {
    allPaths[0].getBoundingClientRect();
  }
  if (timelineItems.length > 0) {
    timelineItems[0].getBoundingClientRect();
  }
};
defineExpose({
  playAnime,
  resetAnime
});
</script>

<style scoped>
.experience-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2rem 0;
  overflow: hidden;
}

.section-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.section-number {
  font-family: var(--font-code);
  font-size: 1.5rem;
  color: var(--primary);
  font-weight: 700;
}

.section-title {
  font-family: var(--font-code);
  font-size: 2.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.section-line {
  flex: 1;
  height: 2px;
  background: var(--gradient-1);
  margin-left: 2rem;
}

.horizontal-timeline-wrapper {
  position: relative;
  width: 100%;
  height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.wave-container {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 200px;
  transform: translateY(-50%);
  pointer-events: none;
}

.wave-svg {
  width: 100%;
  height: 100%;
}

.wave-path,
.wave-path-secondary {
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000;
  transition: none;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  /* 让线条端点圆润，更好看 */
}

@keyframes waveDraw {
  to {
    stroke-dashoffset: 0;
  }
}

.horizontal-timeline {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  width: 100%;
  gap: 2rem;
}

.timeline-item {
  position: relative;
  flex: 1;
  max-width: 300px;
  opacity: 0;
  transform: translateY(var(--wave-offset, 0px));
  transition: transform 0.5s ease;
}

.timeline-item:nth-child(odd) {
  transform: translateY(-30px);
}

.timeline-item:nth-child(even) {
  transform: translateY(30px);
}

.timeline-connector {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 60px;
  background: linear-gradient(to bottom, transparent, var(--primary), transparent);
  opacity: 0.5;
}

.connector-dot {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  background: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 20px var(--primary);
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    transform: translateX(-50%) scale(1);
    box-shadow: 0 0 20px var(--primary);
  }

  50% {
    transform: translateX(-50%) scale(1.2);
    box-shadow: 0 0 30px var(--primary);
  }
}

.timeline-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.timeline-item:nth-child(odd) .timeline-card {
  transform: translateY(-80px);
}

.timeline-item:nth-child(even) .timeline-card {
  transform: translateY(80px);
}

.timeline-card:hover {
  border-color: var(--primary);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(192, 132, 252, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.timeline-year {
  font-family: var(--font-code);
  color: var(--primary);
  font-weight: 700;
  font-size: 0.85rem;
}

.timeline-badge {
  background: var(--gradient-1);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: var(--font-code);
}

.timeline-title {
  font-family: var(--font-code);
  font-size: 1rem;
  color: var(--cyan);
  margin-bottom: 0.3rem;
  font-weight: 700;
}

.timeline-company {
  color: var(--purple);
  font-weight: 600;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.timeline-company i {
  font-size: 0.9rem;
}

.timeline-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  background: var(--bg-darker);
  color: var(--primary);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-family: var(--font-code);
  border: 1px solid var(--border);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .horizontal-timeline {
    gap: 1rem;
  }

  .timeline-item {
    max-width: 280px;
  }
}

@media (max-width: 992px) {
  .horizontal-timeline {
    flex-direction: column;
    gap: 3rem;
  }

  .timeline-item {
    max-width: 100%;
    transform: translateY(0) !important;
  }

  .timeline-item:nth-child(odd) .timeline-card,
  .timeline-item:nth-child(even) .timeline-card {
    transform: translateY(0);
  }

  .timeline-connector {
    display: none;
  }

  .wave-container {
    display: none;
  }
}

@media (max-width: 768px) {
  .experience-section {
    padding: 2rem 0;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .section-line {
    width: 100%;
    margin-left: 0;
    margin-top: 0.5rem;
  }

  .timeline-card {
    padding: 1rem;
  }

  .timeline-title {
    font-size: 0.9rem;
  }

  .timeline-company {
    font-size: 0.8rem;
  }
}
</style>
