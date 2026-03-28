<template>
  <section id="contact" class="section contact-section">
    <div class="section-container">
      <div class="section-header">
        <span class="section-number">05</span>
        <h2 class="section-title">
          <span class="title-bracket">&lt;</span>
          <span class="title-text">{{ t("contact.title") }}</span>
          <span class="title-bracket">/&gt;</span>
        </h2>
        <div class="section-line"></div>
      </div>

      <div class="contact-info">
        <div class="contact-item">
          <div class="contact-icon">
            <i class="fas fa-envelope"></i>
          </div>
          <div class="contact-details">
            <h4 class="contact-label">{{ t("contact.email") }}</h4>
            <div class="contact-value">2965227160@qq.com</div>
          </div>
        </div>

        <div class="contact-item">
          <div class="contact-icon">
            <i class="fa-brands fa-weixin"></i>
          </div>
          <div class="contact-details">
            <h4 class="contact-label">{{ t("contact.wechat") }}</h4>
            <div class="contact-value">_miracle_item</div>
          </div>
        </div>

        <div class="contact-item">
          <div class="contact-icon">
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <div class="contact-details">
            <h4 class="contact-label">{{ t("contact.location") }}</h4>
            <span class="contact-value">{{ t("contact.locationValue") }}</span>
          </div>
        </div>
      </div>

      <!-- Footer Section -->
      <div class="footer-section">
        <div class="footer-content">
          <div class="footer-text-wrapper">
            <p class="footer-text">
              <span class="footer-copyright">{{ t("footer.copyright") }}</span>
              <span class="footer-divider">•</span>
              <span class="footer-built">{{ t("footer.builtWith") }}</span>
            </p>
            <p class="footer-author">
              <span class="footer-by-text">{{ t("footer.by") }}</span>
              <span class="footer-author-link">
                <i class="fas fa-code"></i>
                <span>zhl</span>
              </span>
              <span class="footer-by-text">{{ t("footer.fetch") }}</span>
              <span class="footer-author-link">
                <i class="fas fa-code"></i>
                <span>Kan3an</span>
              </span>
            </p>
          </div>
          <div class="footer-social">
            <a href="https://github.com/2965227160" class="footer-social-link" title="GitHub">
              <i class="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import anime from "animejs";

const { t } = useI18n();
const playAnime = () => {
  anime({
    targets: ".footer-author-link",
    opacity: [0, 1],
    translateY: [20, 0], // 从下方 20px 到 0
    duration: 200,
    easing: "easeOutCubic", // 【修改点】替换了 easeOutExpo
    delay: 375,
  });

  anime({
    targets: ".footer-social .footer-social-link",
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 200,
    easing: "easeOutCubic", // 【修改点】替换了 easeOutExpo
    delay: anime.stagger(25, { start: 425 }),
  });
};
const resetAnime = () => {
  // 1. 【关键修改】使用 querySelectorAll 获取所有元素
  const authorLinks = document.querySelectorAll('.footer-author-link');
  const socialLinks = document.querySelectorAll('.footer-social .footer-social-link');
  
  // 2. 停止所有相关动画 (anime.remove 支持选择器字符串，会自动处理所有匹配项)
  anime.remove('.footer-author-link');
  anime.remove('.footer-social .footer-social-link');

  // 3. 遍历并重置所有 "作者链接" 的样式
  authorLinks.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'none';
  });

  // 4. 遍历并重置所有 "社交链接" 的样式
  socialLinks.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'none';
  });
};
defineExpose({
  playAnime,
  resetAnime
});
</script>
