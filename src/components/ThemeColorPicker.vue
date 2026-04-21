<template>
  <Teleport to="body">
    <Transition name="picker-fade">
      <div v-if="visible" class="theme-picker-overlay" @click.self="close">
        <Transition name="picker-slide">
          <div v-if="visible" class="theme-picker-dialog">
            <!-- 右上角关闭按钮 -->
            <button class="theme-picker-close" @click="close" :title="t('themePicker.close')">
              <i class="fas fa-times"></i>
            </button>

            <!-- <div class="theme-picker-header">
              <div class="theme-picker-icon">
                <i class="fas fa-palette"></i>
              </div>
              <h3 class="theme-picker-title">{{ t('themePicker.title') }}</h3>
              <p class="theme-picker-subtitle">{{ t('themePicker.subtitle') }}</p>
            </div> -->

            <div class="theme-picker-body">
              <!-- 预设主题色 -->
              <div class="preset-section">
                <h4 class="section-label">{{ t('themePicker.presets') }}</h4>
                <div class="preset-colors">
                  <button
                    v-for="preset in presetColors"
                    :key="preset.name"
                    class="preset-btn"
                    :class="{ active: selectedColor === preset.value }"
                    :style="{ '--preset-color': preset.value }"
                    :title="preset.name"
                    @click="applyColor(preset.value)"
                  >
                    <span class="preset-circle"></span>
                    <span class="preset-name">{{ preset.label }}</span>
                  </button>
                </div>
              </div>

              <!-- 自定义颜色 -->
              <div class="custom-section">
                <h4 class="section-label">{{ t('themePicker.custom') }}</h4>
                <div class="custom-color-row">
                  <div class="color-input-group">
                    <label class="color-input-label">HEX</label>
                    <div class="hex-input-wrapper">
                      <span class="hex-hash">#</span>
                      <input
                        type="text"
                        class="hex-input"
                        :value="selectedColor.replace('#', '')"
                        @input="onHexInput($event)"
                        maxlength="6"
                        placeholder="c084fc"
                      />
                      <div
                        class="hex-preview"
                        :style="{ background: selectedColor }"
                      ></div>
                    </div>
                  </div>
                  <div class="color-input-group">
                    <label class="color-input-label">{{ t('themePicker.pick') }}</label>
                    <div class="native-picker-wrapper">
                      <input
                        type="color"
                        class="native-color-picker"
                        :value="selectedColor"
                        @input="onNativePick($event)"
                      />
                      <span class="native-picker-text">{{ selectedColor }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 预览区域 -->
              <div class="preview-section">
                <h4 class="section-label">{{ t('themePicker.preview') }}</h4>
                <div class="preview-grid">
                  <div class="preview-card primary-preview" :style="{ background: selectedColor }">
                    <span>Primary</span>
                  </div>
                  <div class="preview-card secondary-preview" :style="{ background: secondaryColor }">
                    <span>Secondary</span>
                  </div>
                  <div class="preview-card gradient-preview" :style="{ background: computedGradient1 }">
                    <span>Gradient</span>
                  </div>
                  <div class="preview-card button-preview">
                    <span :style="{ background: computedGradient1, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }">Button</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="theme-picker-footer">
              <button class="picker-btn picker-btn-reset" @click="resetColor">
                <i class="fas fa-undo"></i>
                {{ t('themePicker.reset') }}
              </button>
              <button class="picker-btn picker-btn-apply" @click="applyAndClose">
                <i class="fas fa-check"></i>
                {{ t('themePicker.apply') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'apply'])

// CSS :root 中定义的原始默认值
const DEFAULT_THEME = {
  primary: '#c084fc',
  secondary: '#a78bfa',
  purple: '#a78bfa',
  gradient1: 'linear-gradient(135deg, #c084fc 0%, #a78bfa 50%, #67e8f9 100%)',
  gradient2: 'linear-gradient(135deg, #67e8f9 0%, #a78bfa 50%, #fbbf24 100%)',
  shadowGlow: '0 0 30px rgba(192, 132, 252, 0.3)'
}
const defaultColor = '#c084fc'
const selectedColor = ref(defaultColor)

const presetColors = computed(() => [
  { name: 'purple', label: t('themePicker.purple'), value: '#c084fc' },
  { name: 'blue', label: t('themePicker.blue'), value: '#60a5fa' },
  { name: 'cyan', label: t('themePicker.cyan'), value: '#22d3ee' },
  { name: 'green', label: t('themePicker.green'), value: '#4ade80' },
  { name: 'pink', label: t('themePicker.pink'), value: '#f472b6' },
  { name: 'rose', label: t('themePicker.rose'), value: '#fb7185' },
  { name: 'orange', label: t('themePicker.orange'), value: '#fb923c' },
  { name: 'amber', label: t('themePicker.amber'), value: '#fbbf24' },
  { name: 'teal', label: t('themePicker.teal'), value: '#2dd4bf' },
  { name: 'indigo', label: t('themePicker.indigo'), value: '#818cf8' },
  { name: 'red', label: t('themePicker.red'), value: '#f87171' },
  { name: 'lime', label: t('themePicker.lime'), value: '#a3e635' }
])

// 计算衍生颜色
function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255

  let max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

const secondaryColor = computed(() => {
  const hsl = hexToHSL(selectedColor.value)
  return hslToHex((hsl.h + 30) % 360, Math.min(hsl.s + 5, 100), Math.max(hsl.l - 5, 20))
})

const computedGradient1 = computed(() => {
  const sec = secondaryColor.value
  return `linear-gradient(135deg, ${selectedColor.value} 0%, ${sec} 50%, #67e8f9 100%)`
})

function isValidHex(hex) {
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(hex)
}

function applyColor(color) {
  selectedColor.value = color
}

function onHexInput(event) {
  let val = event.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6)
  if (val.length === 6) {
    selectedColor.value = `#${val}`
  } else if (val.length === 3) {
    selectedColor.value = `#${val[0]}${val[0]}${val[1]}${val[1]}${val[2]}${val[2]}`
  }
}

function onNativePick(event) {
  selectedColor.value = event.target.value
}

function close() {
  emit('close')
}

function applyAndClose() {
  // 应用到 CSS 变量
  const color = selectedColor.value
  const sec = secondaryColor.value
  const secLight = hslToHex(...Object.values(hexToHSL(sec)).map((v, i) => i === 2 ? Math.min(v + 15, 85) : v))

  const root = document.documentElement
  root.style.setProperty('--primary', color)
  root.style.setProperty('--secondary', sec)
  root.style.setProperty('--purple', sec)
  root.style.setProperty('--gradient-1', `linear-gradient(135deg, ${color} 0%, ${sec} 50%, #67e8f9 100%)`)
  root.style.setProperty('--gradient-2', `linear-gradient(135deg, #67e8f9 0%, ${sec} 50%, #fbbf24 100%)`)
  root.style.setProperty('--shadow-glow', `0 0 30px ${color}4d`)

  // 保存到 localStorage
  localStorage.setItem('portfolio-accent-color', color)

  emit('close')
}

function resetColor() {
  selectedColor.value = defaultColor

  // 移除所有内联 CSS 变量，让 CSS :root 中的原始默认值生效
  const root = document.documentElement
  root.style.removeProperty('--primary')
  root.style.removeProperty('--secondary')
  root.style.removeProperty('--purple')
  root.style.removeProperty('--gradient-1')
  root.style.removeProperty('--gradient-2')
  root.style.removeProperty('--shadow-glow')

  // 清除 localStorage
  localStorage.removeItem('portfolio-accent-color')

  emit('close')
}

// 打开时从 localStorage 读取当前颜色
watch(() => props.visible, (val) => {
  if (val) {
    const saved = localStorage.getItem('portfolio-accent-color')
    if (saved && isValidHex(saved)) {
      selectedColor.value = saved
    } else {
      // 从当前 CSS 变量中获取
      const current = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
      if (current && isValidHex(current)) {
        selectedColor.value = current
      } else {
        selectedColor.value = defaultColor
      }
    }
  }
})

onMounted(() => {
  // 初始化时从 localStorage 恢复颜色
  const saved = localStorage.getItem('portfolio-accent-color')
  if (saved && isValidHex(saved)) {
    const sec = hslToHex(
      (hexToHSL(saved).h + 30) % 360,
      Math.min(hexToHSL(saved).s + 5, 100),
      Math.max(hexToHSL(saved).l - 5, 20)
    )
    const root = document.documentElement
    root.style.setProperty('--primary', saved)
    root.style.setProperty('--secondary', sec)
    root.style.setProperty('--purple', sec)
    root.style.setProperty('--gradient-1', `linear-gradient(135deg, ${saved} 0%, ${sec} 50%, #67e8f9 100%)`)
    root.style.setProperty('--gradient-2', `linear-gradient(135deg, #67e8f9 0%, ${sec} 50%, #fbbf24 100%)`)
    root.style.setProperty('--shadow-glow', `0 0 30px ${saved}4d`)
  }
})
</script>

<style scoped>
/* 遮罩层 */
.theme-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 10001;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

/* 对话框 */
.theme-picker-dialog {
  position: relative;
  background: var(--bg-card-header, #1e293bd8);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
  color: var(--text-primary);
}

/* 关闭按钮 */
.theme-picker-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-hover);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s ease;
  z-index: 2;
}

.theme-picker-close:hover {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
  transform: rotate(90deg);
}

/* 头部 */
.theme-picker-header {
  text-align: center;
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.theme-picker-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--gradient-1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  color: white;
}

.theme-picker-title {
  font-family: var(--font-code, monospace);
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: var(--text-primary);
}

.theme-picker-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* 主体 */
.theme-picker-body {
  padding: 1.5rem 2rem;
}

.section-label {
  font-family: var(--font-code, monospace);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

/* 预设颜色 */
.preset-colors {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 0.8rem 0.4rem;
  border-radius: 12px;
  background: var(--bg-hover);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.preset-btn:hover {
  border-color: var(--preset-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.preset-btn.active {
  border-color: var(--preset-color);
  background: var(--bg-darker);
  box-shadow: 0 0 20px color-mix(in srgb, var(--preset-color) 30%, transparent);
}

.preset-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--preset-color);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--preset-color) 40%, transparent);
  transition: transform 0.2s ease;
}

.preset-btn:hover .preset-circle {
  transform: scale(1.1);
}

.preset-name {
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
}

/* 自定义颜色 */
.custom-section {
  margin-bottom: 1.5rem;
}

.custom-color-row {
  display: flex;
  gap: 1rem;
}

.color-input-group {
  flex: 1;
}

.color-input-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.hex-input-wrapper {
  display: flex;
  align-items: center;
  background: var(--bg-darker);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.hex-input-wrapper:focus-within {
  border-color: var(--primary);
}

.hex-hash {
  padding: 0.65rem 0.5rem 0.65rem 0.8rem;
  color: var(--text-muted);
  font-family: var(--font-code, monospace);
  font-size: 0.9rem;
  font-weight: 600;
}

.hex-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-code, monospace);
  font-size: 0.9rem;
  padding: 0.65rem 0;
  outline: none;
  text-transform: uppercase;
}

.hex-preview {
  width: 36px;
  height: 36px;
  margin-right: 4px;
  border-radius: 0 9px 9px 0;
  flex-shrink: 0;
}

.native-picker-wrapper {
  display: flex;
  align-items: center;
  background: var(--bg-darker);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  padding: 0.3rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.native-picker-wrapper:hover {
  border-color: var(--primary);
}

.native-color-picker {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 6px;
  padding: 0;
}

.native-color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.native-color-picker::-webkit-color-swatch {
  border: 2px solid var(--border);
  border-radius: 6px;
}

.native-picker-text {
  flex: 1;
  text-align: center;
  font-family: var(--font-code, monospace);
  font-size: 0.85rem;
  color: var(--text-secondary);
  padding: 0 0.5rem;
}

/* 预览区域 */
.preview-section {
  margin-bottom: 0.5rem;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
}

.preview-card {
  height: 56px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-code, monospace);
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  border: 1px solid var(--border);
}

.button-preview {
  background: var(--bg-darker);
  border: 2px solid var(--primary);
}

/* 底部按钮 */
.theme-picker-footer {
  display: flex;
  gap: 0.8rem;
  padding: 1.2rem 2rem 1.5rem;
  border-top: 1px solid var(--border);
}

.picker-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.picker-btn-reset {
  background: var(--bg-hover);
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

.picker-btn-reset:hover {
  border-color: var(--text-muted);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.picker-btn-apply {
  background: var(--gradient-1);
  color: white;
}

.picker-btn-apply:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* 过渡动画 */
.picker-fade-enter-active,
.picker-fade-leave-active {
  transition: opacity 0.3s ease;
}

.picker-fade-enter-from,
.picker-fade-leave-to {
  opacity: 0;
}

.picker-slide-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.picker-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.picker-slide-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.picker-slide-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* 响应式 */
@media (max-width: 480px) {
  .theme-picker-dialog {
    max-width: 100%;
    margin: 0 0.5rem;
    border-radius: 16px;
  }

  .preset-colors {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.4rem;
  }

  .custom-color-row {
    flex-direction: column;
  }

  .preview-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .theme-picker-header {
    padding: 1.5rem 1.5rem 1rem;
  }

  .theme-picker-body {
    padding: 1rem 1.5rem;
  }

  .theme-picker-footer {
    padding: 1rem 1.5rem 1.2rem;
  }
}
</style>