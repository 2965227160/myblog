<template>
  <div id="app">
    <TheHeader />
    <LoadingScreen />
    <router-view />
  </div>
</template>

<script setup>
import TheHeader from './components/TheHeader.vue'
import LoadingScreen from './components/LoadingScreen.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: var(--font-primary);
  font-weight: 500;
  background: var(--bg-dark);
  color: var(--text-primary);
  line-height: 1.7;
  transition: background var(--transition-fast), color var(--transition-fast);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 700;
}

.hero-name,
.section-title,
.timeline-title,
.project-title,
.category-title {
  font-weight: 800;
}

* {
  -webkit-tap-highlight-color: transparent;
}

img {
  max-width: 100%;
  height: auto;
}
</style>
