<template>
  <section id="skills" class="section skills-section">
    <div class="section-container">
      <div class="section-header">
        <span class="section-number">02</span>
        <h2 class="section-title">
          <span class="title-bracket">&lt;</span>
          <span class="title-text">{{ t('skills.title') }}</span>
          <span class="title-bracket">/&gt;</span>
        </h2>
        <div class="section-line"></div>
      </div>

      <div class="skills-grid">
        <div v-for="category in skillCategories" :key="category.title" class="skill-category">
          <h3 class="category-title">{{ t(category.title) }}</h3>
          <div class="skill-items">
            <div
              v-for="skill in category.skills"
              :key="skill.name"
              class="skill-item"
              data-skill="React"
              :data-percent="skill.percent"
            >
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <!-- <span class="skill-percent">0%</span> -->
                <span class="skill-level"></span>
              </div>
              <div class="skill-bar">
                <div class="skill-progress"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import anime from 'animejs'

const { t } = useI18n()

const skillCategories = [
  {
    title: 'skills.frontend',
    skills: [
      { name: 'Vue.js', percent: 75 },
      { name: 'Element-plus', percent: 75 },
      { name: 'JavaScript', percent: 75 },
      { name: 'React', percent: 50 }
    ]
  },
  {
    title: 'skills.backend',
    skills: [
      { name: 'C++', percent: 65 },
      { name: 'Java', percent: 65 },
      { name: 'Go', percent: 65 },
      { name: 'MySql', percent: 60 },
      { name: 'Redis', percent: 50 }
    ]
  },
  {
    title: 'skills.tools',
    skills: [
      { name: 'Linux', percent: 70 },
      { name: 'Git', percent: 65 },
      { name: 'Docker', percent: 60 },
      { name: 'Kubernetes', percent: 40 }
    ]
  }
]

const playAnime = () => {
  const skillItems = document.querySelectorAll('.skill-item')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillItem = entry.target
        const progressBar = skillItem.querySelector('.skill-progress')
        const percentElement = skillItem.querySelector('.skill-percent')
        const levelElement = skillItem.querySelector('.skill-level')
        const percent = parseInt(skillItem.getAttribute('data-percent') || 0)
        if(percent<60) {
          levelElement.textContent = '了解'
          levelElement.style.color = '#FFA500'
        } else {
          levelElement.textContent = '熟悉'
          levelElement.style.color = '#00FF00'
        }
        anime({
          targets: progressBar,
          width: ['0%', percent + '%'],
          duration: 2000,
          easing: 'easeOutExpo',
          delay: 300
        })

        anime({
          targets: { value: 0 },
          value: percent,
          duration: 2000,
          easing: 'easeOutExpo',
          delay: 300,
          update: function(anim) {
            if (percentElement) {
              percentElement.textContent = Math.floor(anim.animatables[0].target.value) + '%'
            }
          }
        })

        observer.unobserve(skillItem)
      }
    })
  }, { threshold: 0.5 })

  skillItems.forEach(item => observer.observe(item))
}
const resetAnime = () => {
  const skillItems = document.querySelectorAll('.skill-item');
  
  skillItems.forEach(item => {
    const progressBar = item.querySelector('.skill-progress');
    const percentElement = item.querySelector('.skill-percent');
    const levelElement = item.querySelector('.skill-level');

    // 1. 强制停止正在运行的 anime.js 动画 (防止状态冲突)
    if (progressBar) anime.remove(progressBar);
    // 注意：数字动画的目标是匿名对象 {value:0}，无法直接 remove，但直接修改文本即可覆盖

    // 2. 瞬间重置进度条宽度
    if (progressBar) {
      progressBar.style.width = '0%';
      // 清除可能残留的 transform 或 transition 样式，确保下次动画纯净
      progressBar.style.transform = ''; 
      progressBar.style.transition = 'none'; 
    }

    // 3. 瞬间重置数字文本
    if (percentElement) {
      percentElement.textContent = '0%';
    }

    // 4. 重置等级文字和颜色 (设为空，等待下次动画触发显示)
    if (levelElement) {
      levelElement.textContent = ''; 
      levelElement.style.color = ''; // 清除内联颜色，恢复 CSS 默认
    }
  });
};
defineExpose({
  playAnime,
  resetAnime
});
</script>
