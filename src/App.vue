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
console.log("你打开了控制台(っ´ω`c)，你想知道什么秘密呢？")
console.log("你可以直接从以下网址找到这个项目，或者从首页找到我的联系方式：https://github.com/2965227160/myblog")
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
