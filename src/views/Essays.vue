<template>
  <div class="essays-page">
    <!-- Essays List -->
    <section class="essays-section">
      <div class="essays-container">
        <div class="essays-grid">
          <div
            v-for="essay in paginatedEssays"
            :key="essay.id"
            class="essay-card"
          >
            <!-- Card Header -->
            <div class="card-header">
              <div class="header-info">
                <span class="essay-time">
                  <i class="fas fa-clock"></i>
                  {{ essay.time }}
                </span>
                <span
                  class="essay-weather"
                  :class="getWeatherClass(essay.weather)"
                >
                  <i :class="getWeatherIcon(essay.weather)"></i>
                  {{ getWeatherText(essay.weather) }}
                </span>
              </div>
            </div>

            <!-- Card Content -->
            <div class="card-content">
              <p class="essay-text">{{ essay.text }}</p>

              <!-- Images -->
              <div
                v-if="essay.pic && essay.pic.length > 0"
                class="essay-images"
              >
                <div
                  v-for="(img, index) in essay.pic"
                  :key="index"
                  class="image-wrapper"
                  @click="openPreview(img)"
                >
                  <img :src="img" :alt="`Image ${index + 1}`" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <div class="page-numbers">
            <button
              v-for="page in totalPages"
              :key="page"
              class="page-num"
              :class="{ active: currentPage === page }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Image Preview Modal -->
    <div v-if="previewImage" class="image-preview-modal" @click="closePreview">
      <div class="preview-container" @click.stop>
        <button class="close-btn" @click="closePreview">
          <i class="fas fa-times"></i>
        </button>
        <img :src="previewImage" alt="Preview" />
      </div>
    </div>

    <!-- Back to Home -->
    <div class="back-to-home">
      <router-link to="/" class="back-button">
        <i class="fas fa-arrow-left"></i>
        <span>返回首页</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Import essays data
import essaysData from "@/data/essays.json";

const essays = ref(
  essaysData.sort((a, b) => {
    return new Date(b.time) - new Date(a.time); // 倒序
  }),
);
const currentPage = ref(1);
const itemsPerPage = 10;
const previewImage = ref(null);

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(essays.value.length / itemsPerPage);
});

// Get paginated essays
const paginatedEssays = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return essays.value.slice(start, end);
});

// Change page
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// Open image preview
const openPreview = (img) => {
  previewImage.value = img;
};

// Close image preview
const closePreview = () => {
  previewImage.value = null;
};

// Weather helpers
const getWeatherClass = (weather) => {
  const classes = {
    sunny: "weather-sunny",
    cloudy: "weather-cloudy",
    rainy: "weather-rainy",
  };
  return classes[weather] || "weather-cloudy";
};

const getWeatherIcon = (weather) => {
  const icons = {
    sunny: "fas fa-sun",
    cloudy: "fas fa-cloud",
    rainy: "fas fa-cloud-rain",
  };
  return icons[weather] || "fas fa-cloud";
};

const getWeatherText = (weather) => {
  const texts = {
    sunny: "晴天",
    cloudy: "多云",
    rainy: "雨天",
  };
  return texts[weather] || "多云";
};
</script>

<style scoped>
.essays-page {
  min-height: 100vh;
  background: var(--bg-dark);
  padding-top: 80px;
}

/* Page Hero */
.page-hero {
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, var(--bg-darker) 0%, var(--bg-dark) 100%);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-family: var(--font-code);
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
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

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

/* Essays Section */
.essays-section {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.essays-container {
  width: 100%;
}

.essays-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

/* Essay Card */
.essay-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.essay-card:hover {
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* Card Header */
.card-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  background: var(--bg-darker);
}

.header-info {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}

.essay-time {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-family: var(--font-code);
}

.essay-time i {
  font-size: 0.75rem;
}

.essay-weather {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-family: var(--font-code);
}

.weather-sunny {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.weather-cloudy {
  background: rgba(148, 163, 184, 0.2);
  color: #94a3b8;
}

.weather-rainy {
  background: rgba(103, 232, 249, 0.2);
  color: #67e8f9;
}

/* Card Content */
.card-content {
  padding: 1.5rem;
}

.essay-text {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 1rem;
}

/* Essay Images */
.essay-images {
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.image-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: all 0.3s ease;
}

.image-wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 1;
  transition: all 0.3s ease;
}

.image-wrapper::after {
  content: "+";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 40px;
  height: 40px;
  background: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 300;
  z-index: 2;
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(192, 132, 252, 0.5);
}

.image-wrapper:hover::before {
  background: rgba(0, 0, 0, 0.5);
}

.image-wrapper:hover::after {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

.image-wrapper:hover img {
  transform: scale(1.1);
}

/* Image Preview Modal */
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  cursor: pointer;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.preview-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  cursor: default;
}

.preview-container img {
  max-width: 100%;
  max-height: 85vh;
  display: block;
  border-radius: 8px;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.close-btn {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary);
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10001;
  box-shadow: 0 4px 15px rgba(192, 132, 252, 0.5);
}

.close-btn:hover {
  background: #d946ef;
  transform: scale(1.1);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  padding: 2rem 0;
}

.page-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-num {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  font-family: var(--font-code);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-num:hover {
  background: var(--bg-hover);
  border-color: var(--primary);
  color: var(--primary);
}

.page-num.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

/* Back to Home */
.back-to-home {
  text-align: center;
  padding: 3rem 2rem;
  border-top: 1px solid var(--border);
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  background: var(--gradient-1);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(192, 132, 252, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-hero {
    padding: 3rem 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .essays-section {
    padding: 1rem;
  }

  .essays-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .card-header {
    padding: 0.8rem 1rem;
  }

  .header-info {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .card-content {
    padding: 1rem;
  }

  .essay-text {
    font-size: 0.9rem;
  }

  .image-wrapper {
    width: 100px;
    height: 100px;
  }

  .image-wrapper::after {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }

  .close-btn {
    top: -10px;
    right: -10px;
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }

  .pagination {
    gap: 0.5rem;
  }

  .page-btn,
  .page-num {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
}
</style>
