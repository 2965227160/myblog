<template>
  <div class="articles-page">
    <!-- Filters Section -->
    <section class="filters-section">
      <div class="filters-container">
        <!-- Search Box -->
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索文章标题或描述..."
            @input="filterArticles"
          />
          <button v-if="searchQuery" class="clear-btn" @click="clearSearch">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Category Filters -->
        <div class="category-filters">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="category-btn"
            :class="{ active: selectedCategory === cat.name }"
            @click="filterByCategory(cat.name)"
          >
            <i :class="cat.icon"></i>
            <span>{{ cat.name }}</span>
            <span class="count">({{ getCategoryCount(cat.name) }})</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Articles Grid -->
    <section class="articles-section">
      <div class="articles-grid">
        <div
          v-for="article in paginatedArticles"
          :key="article.id"
          class="article-card"
          @click="openArticle(article)"
        >
          <div class="card-image">
            <img :src="article.pic" :alt="article.title" />
            <div class="card-overlay">
              <i class="fas fa-book-open"></i>
              <span>阅读文章</span>
            </div>
          </div>
          <div class="card-content">
            <div class="card-meta">
              <span class="category-badge">{{ article.category }}</span>
              <span class="date">
                <i class="far fa-calendar-alt"></i>
                {{ article.date }}
              </span>
            </div>
            <h3 class="card-title">{{ article.title }}</h3>
            <p class="card-intro">{{ article.intro }}</p>
            <div class="card-tags">
              <span
                v-for="tag in article.tags.split(',')"
                :key="tag"
                class="tag"
              >
                {{ tag.trim() }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredArticles.length === 0" class="empty-state">
        <i class="fas fa-search"></i>
        <p>没有找到匹配的文章</p>
        <button @click="resetFilters" class="reset-btn">重置筛选</button>
      </div>
    </section>

    <!-- Pagination -->
    <section v-if="totalPages > 1" class="pagination-section">
      <div class="pagination">
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          class="page-btn"
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <button
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <div class="pagination-info">
        共 {{ filteredArticles.length }} 篇文章，第 {{ currentPage }} /
        {{ totalPages }} 页
      </div>
    </section>

    <!-- Article Reader Modal -->
    <div
      v-if="selectedArticle"
      class="article-modal"
      @click.self="closeArticle"
    >
      <div class="modal-content">
        <button class="close-btn" @click="closeArticle">
          <i class="fas fa-times"></i>
        </button>
        <div class="modal-header">
          <img
            :src="selectedArticle.pic"
            :alt="selectedArticle.title"
            class="modal-image"
          />
          <div class="modal-meta">
            <span class="category-badge">{{ selectedArticle.category }}</span>
            <span class="date">
              <i class="far fa-calendar-alt"></i>
              {{ selectedArticle.date }}
            </span>
            <span class="author">
              <i class="far fa-user"></i>
              {{ selectedArticle.author }}
            </span>
          </div>
          <h2 class="modal-title">{{ selectedArticle.title }}</h2>
          <div class="modal-tags">
            <span
              v-for="tag in selectedArticle.tags.split(',')"
              :key="tag"
              class="tag"
            >
              {{ tag.trim() }}
            </span>
          </div>
        </div>
        <div class="card-content">
          <div v-highlight v-html="articleContent"></div>
        </div>
      </div>
    </div>

    <!-- Back to Home -->
    <!-- <div class="back-to-home">
      <router-link to="/" class="back-button">
        <i class="fas fa-arrow-left"></i>
        <span>返回首页</span>
      </router-link>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { marked } from "marked";

// Import data
import articlesData from "@/data/articles.json";
import categoriesData from "@/data/categories.json";

// State
const articles = ref(
  articlesData.sort((a, b) => {
    return new Date(b.date) - new Date(a.date); // 倒序
  }),
);
const categories = ref(categoriesData);
const searchQuery = ref("");
const selectedCategory = ref("全部");
const currentPage = ref(1);
const articlesPerPage = 6;
const selectedArticle = ref(null);
const articleContent = ref("");

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Filtered articles
const filteredArticles = computed(() => {
  let result = articles.value;

  // Filter by category
  if (selectedCategory.value !== "全部") {
    result = result.filter(
      (article) => article.category === selectedCategory.value,
    );
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.intro.toLowerCase().includes(query),
    );
  }

  return result;
});

// Paginated articles
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage;
  const end = start + articlesPerPage;
  return filteredArticles.value.slice(start, end);
});

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredArticles.value.length / articlesPerPage);
});

// Get category count
const getCategoryCount = (categoryName) => {
  if (categoryName === "全部") {
    return articles.value.length;
  }
  return articles.value.filter((article) => article.category === categoryName)
    .length;
};

// Filter by category
const filterByCategory = (categoryName) => {
  selectedCategory.value = categoryName;
  currentPage.value = 1;
};

// Clear search
const clearSearch = () => {
  searchQuery.value = "";
  currentPage.value = 1;
};

// Reset filters
const resetFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = "全部";
  currentPage.value = 1;
};

// Go to page
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// Open article
const openArticle = async (article) => {
  selectedArticle.value = article;
  try {
    const response = await fetch(article.path);
    if (response.ok) {
      const text = await response.text();
      articleContent.value = marked.parse(text);
    }
  } catch (error) {
    console.error("Error loading article:", error);
    articleContent.value = "<p>文章加载失败</p>";
  }
  document.body.style.overflow = "hidden";
};

// Close article
const closeArticle = () => {
  selectedArticle.value = null;
  articleContent.value = "";
  document.body.style.overflow = "";
};

// Watch for filter changes
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.articles-page {
  min-height: 100vh;
  background: var(--bg-dark);
  padding-top: 80px;
}

/* Hero Section */
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
  line-height: 1.8;
}

/* Filters Section */
.filters-section {
  padding: 2rem;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
}

.filters-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-box input {
  width: 100%;
  padding: 1rem 3rem;
  background: var(--bg-darker);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(192, 132, 252, 0.1);
}

.search-box .clear-btn {
  position: absolute;
  right: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.search-box .clear-btn:hover {
  color: var(--primary);
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: var(--bg-darker);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.category-btn.active {
  background: var(--gradient-1);
  border-color: transparent;
  color: white;
}

.category-btn .count {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* Articles Section */
.articles-section {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.article-card {
  background: var(--bg-article-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.card-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .card-image img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
}

.article-card:hover .card-overlay {
  opacity: 1;
}

.card-overlay i {
  font-size: 2rem;
}

.card-content {
  padding: 1.5rem;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-badge {
  background: var(--gradient-1);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.date {
  color: var(--text-muted);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.card-title {
  font-family: var(--font-code);
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-bottom: 0.8rem;
  font-weight: 700;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.article-card:hover .card-title {
  color: var(--primary);
}

.card-intro {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: var(--bg-darker);
  color: var(--primary);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: var(--font-code);
  border: 1px solid var(--border);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.reset-btn {
  padding: 0.8rem 2rem;
  background: var(--gradient-1);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(192, 132, 252, 0.3);
}

/* Pagination */
.pagination-section {
  padding: 2rem;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
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
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.page-btn.active {
  background: var(--gradient-1);
  border-color: transparent;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Article Modal */
.article-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 900px;
  background: var(--bg-article-card);
  border-radius: 16px;
  overflow: hidden;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: var(--primary);
  transform: rotate(90deg);
}

.modal-header {
  position: relative;
}

.modal-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.modal-meta {
  padding: 1.5rem 2rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.modal-meta .author {
  color: var(--text-muted);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.modal-title {
  font-family: var(--font-code);
  font-size: 2rem;
  color: var(--text-primary);
  padding: 1rem 2rem;
  font-weight: 700;
  line-height: 1.3;
}

.modal-tags {
  padding: 0 2rem 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Card Content - Markdown */
.card-content {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 0.95rem;
  overflow: hidden;
  transition: max-height 0.5s ease;
  max-height: none;
}

.card-content.collapsed {
  max-height: 100px;
  position: relative;
}

.card-content.collapsed::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(transparent, var(--bg-card));
  pointer-events: none;
}

.card-content :deep(h1),
.card-content :deep(h2),
.card-content :deep(h3) {
  color: var(--text-primary);
  margin-top: 1.5rem;
  margin-bottom: 0.8rem;
  font-weight: 700;
}

.card-content :deep(h1) {
  font-size: 1.5rem;
}
.card-content :deep(h2) {
  font-size: 1.3rem;
}
.card-content :deep(h3) {
  font-size: 1.1rem;
}

.card-content :deep(p) {
  margin-bottom: 1rem;
  text-indent: 2em;
}

.card-content :deep(ul),
.card-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.card-content :deep(li) {
  margin-bottom: 0.5rem;
}
.card-content :deep(input) {
  accent-color: green;
}
.card-content :deep(strong) {
  color: var(--primary);
  font-weight: 700;
}

.card-content :deep(blockquote) {
  border-left: 3px solid var(--primary);
  padding-left: 1rem;
  margin: 1rem 0;
  color: var(--text-muted);
  font-style: italic;
}

.card-content :deep(code) {
  background: var(--bg-darker);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: var(--font-code);
  font-size: 0.85rem;
  color: var(--cyan);
}

.card-content :deep(pre) {
  background: var(--bg-darker);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
  position: relative;
}
/* 3. 复制按钮样式 */
.card-content :deep(.copy-code-btn) {
  position: absolute;
  font-family: "Bold";
  top: 0px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
}

/* 4. 悬停时显示按钮 */
.card-content :deep(pre:hover .copy-code-btn) {
  opacity: 1;
}

/* 5. 点击反馈（可选） */
.card-content :deep(.copy-code-btn.copied) {
  background: rgba(0, 128, 0, 0.8);
}
.card-content :deep(pre code) {
  background: none;
  padding: 0;
}

.card-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.card-content :deep(th),
.card-content :deep(td) {
  border: 1px solid var(--border);
  padding: 0.8rem;
  text-align: left;
}

.card-content :deep(th) {
  background: var(--bg-darker);
  color: var(--primary);
  font-weight: 700;
}
.card-content :deep(a) {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px dashed var(--primary);
  transition: all 0.3s ease;
}
.card-content :deep(a:hover) {
  color: var(--cyan);
  border-bottom-color: var(--cyan);
}
.card-content :deep(a:visited) {
  color: var(--purple);
}
.card-content :deep(a:active) {
  color: var(--accent);
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

  .filters-section {
    padding: 1.5rem 1rem;
  }

  .category-filters {
    gap: 0.5rem;
  }

  .category-btn {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }

  .articles-section {
    padding: 1rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .article-modal {
    padding: 1rem;
  }

  .modal-title {
    font-size: 1.5rem;
    padding: 1rem;
  }

  .modal-meta,
  .modal-tags {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .modal-body {
    padding: 1.5rem;
  }
}
</style>
