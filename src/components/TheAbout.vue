<template>
  <section id="about" class="section about-section">
    <div class="section-container">
      <div class="section-header">
        <span class="section-number">01</span>
        <h2 class="section-title">
          <span class="title-bracket">&lt;</span>
          <span class="title-text">{{ t('about.title') }}</span>
          <span class="title-bracket">/&gt;</span>
        </h2>
        <div class="section-line"></div>
      </div>

      <div class="about-content">
        <div class="about-text-wrapper">
          <div class="about-intro">
            <p class="about-text">{{ t('about.description') }}</p>
          </div>

          <div class="about-stats">
            <div class="stat-item">
              <div class="stat-number" data-count="1">0</div>
              <div class="stat-label">{{ t('about.articles') }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-number" data-count="3">0</div>
              <div class="stat-label">{{ t('about.yearsExperience') }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-number" data-count="1">0</div>
              <div class="stat-label">{{ t('about.essays') }}</div>
            </div>
          </div>
        </div>

        <div class="about-image-wrapper">
          <div class="about-image-container">
            <div class="code-block">
              <div class="code-line">
                <span class="code-keyword">const </span>
                <span class="code-variable">developer</span>
                <span class="code-operator">=</span>
                <span class="code-brace">{</span>
              </div>
              <div class="code-line indent">
                <span class="code-property">name</span>
                <span class="code-operator">:</span>
                <span class="code-string">'zhl'</span>
                <span class="code-comma">,</span>
              </div>
              <div class="code-line indent">
                <span class="code-property">skills</span>
                <span class="code-operator">:</span>
                <span class="code-bracket">[</span>
                <span class="code-string">'vue.js'</span>
                <span class="code-comma">,</span>
                <span class="code-string">'JavaScript'</span>
                <span class="code-comma">,</span>
                <span class="code-string">'C++'</span>
                <span class="code-comma">,</span>
                <span class="code-string">'Java'</span>
                <span class="code-comma">,</span>
                <span class="code-string">'Go'</span>
                <span class="code-bracket">]</span>
                <span class="code-comma">,</span>
              </div>
              <div class="code-line indent">
                <span class="code-property">passion</span>
                <span class="code-operator">:</span>
                <span class="code-string">'coding'</span>
                <span class="code-comma">,</span>
              </div>
              <div class="code-line indent">
                <span class="code-property">hobby</span>
                <span class="code-operator">:</span>
                <span class="code-bracket">[</span>
                <span class="code-string">'cooking'</span>
                <span class="code-comma">,</span>
                <span class="code-string">'reading'</span>
                <span class="code-comma">,</span>
                <span class="code-string">'music(piano prefer)'</span>
                <span class="code-bracket">]</span>
              </div>
              <div class="code-line">
                <span class="code-brace">}</span>
                <span class="code-semicolon">;</span>
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

const playAnime = () => {
  const statNumbers = document.querySelectorAll('.stat-number')
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count') || 0)

    anime({
      targets: { value: 0 },
      value: target,
      duration: 2000,
      easing: 'easeOutExpo',
      update: function(anim) {
        stat.textContent = Math.floor(anim.animatables[0].target.value)
      }
    })
  })
}
defineExpose({
  playAnime
});
</script>
