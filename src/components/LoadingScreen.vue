<template>
    <div class="loader-screen" id="loader">
      <div class="loader-content">
        <div class="loader-code-text">
          <div class="code-line" data-line="1">const loading = {</div>
          <div class="code-line" data-line="2">isAnime: true,</div>
          <div class="code-line" data-line="3">status: 'initializing...',</div>
          <div class="code-line" data-line="4">
            randQuote: '{{ quote?.text || 'Loading...' }}<small>  —— {{ quote?.author || 'Anonymous' }}</small>'
          </div>
          <div class="code-line" data-line="5">};</div>
        </div>
        <div class="loader-spinner-wrapper">
          <div class="loader-spinner"></div>
        </div>
        <div class="loader-progress-wrapper">
          <div class="loader-progress-bar"></div>
        </div>
        <div class="loader-percentage" id="loaderPercent">0%</div>
      </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed, provide } from "vue";
import { useRandomQuote } from '@/composables/useRandomQuote'
import anime from "animejs";
const { quote, loading, error, refresh } = useRandomQuote()
const initLoaderAnimation = () => {
  const loader = document.getElementById("loader");
  const loaderPercent = document.getElementById("loaderPercent");
  if (!loader || !loaderPercent) return;

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      setTimeout(() => {
        anime({
          targets: loader,
          opacity: [1, 0],
          duration: 500,
          easing: "easeInOutQuad",
          complete: () => {
            loader.classList.add("hidden");
          },
        });
      }, 300);
    }
    if (loaderPercent) {
      loaderPercent.textContent = Math.floor(progress) + "%";
    }
  }, 100);
};
onMounted(() => {
  initLoaderAnimation();
});
</script>