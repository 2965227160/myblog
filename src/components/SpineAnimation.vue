<template>
  <div ref="containerRef" class="spine-animation-container">
    <div v-if="loading" class="spine-loading">Loading animation...</div>
    <div v-if="error" class="spine-error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  jsonPath: {
    type: String,
    required: true
  },
  atlasPath: {
    type: String,
    required: true
  },
  animationName: {
    type: String,
    default: ''
  },
  scale: {
    type: Number,
    default: 1.0
  },
  loop: {
    type: Boolean,
    default: true
  },
  backgroundColor: {
    type: Number,
    default: 0x000000
  },
  transparent: {
    type: Boolean,
    default: true
  },
  // 新增：入场动画（只播放一次）
  in: {
    type: String,
    default: ''
  },
  // 新增：保持动画（循环播放）
  keep: {
    type: String,
    default: ''
  }
})

const containerRef = ref(null)
const loading = ref(true)
const error = ref(null)

let app = null
let spineAnimation = null
let currentAnimationName = ''
let resizeObserver = null
let completeListener = null // 动画完成监听器

// 初始化 Pixi 应用
const initPixi = () => {
  if (!containerRef.value) return

  const { width, height } = containerRef.value.getBoundingClientRect()

  app = new PIXI.Application({
    width: width || 800,
    height: height || 600,
    backgroundColor: props.transparent ? 0x000000 : props.backgroundColor,
    backgroundAlpha: props.transparent ? 0 : 1,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    transparent: props.transparent,
  })

  containerRef.value.appendChild(app.view)
}

// 播放指定动画
const playAnimation = (name, loop) => {
  if (!spineAnimation) return false
  const animations = spineAnimation.spineData.animations.map(anim => anim.name)
  if (!animations.includes(name)) {
    console.warn(`Animation "${name}" not found`)
    return false
  }
  spineAnimation.state.setAnimation(0, name, loop)
  currentAnimationName = name
  return true
}

// 居中 Spine 动画
const centerSpineAnimation = () => {
  if (!spineAnimation || !app) return
  const bounds = spineAnimation.getLocalBounds()
  if (bounds.width > 0 && bounds.height > 0) {
    const scaleX = app.renderer.width / bounds.width
    const scaleY = app.renderer.height / bounds.height
    const scale = Math.min(scaleX, scaleY) * 3.76
    spineAnimation.scale.set(scale * props.scale)
    spineAnimation.x = (app.renderer.width - bounds.width * scale) / 2 - bounds.x * scale * 1.086
    spineAnimation.y = (app.renderer.height - bounds.height * scale) / 2 - bounds.y * scale * 1.09
  } else {
    spineAnimation.x = app.renderer.width / 2
    spineAnimation.y = app.renderer.height / 2
  }
}

// 加载 Spine 资源并处理动画序列
const loadSpine = async () => {
  try {
    const resource = await PIXI.Assets.load(props.jsonPath)
    const spineData = resource.spineData
    if (!spineData) {
      throw new Error('Invalid spine data: missing spineData property')
    }

    spineAnimation = new PIXI.spine.Spine(spineData)
    spineAnimation.scale.set(props.scale)
    app.stage.addChild(spineAnimation)

    const animations = spineAnimation.spineData.animations.map(anim => anim.name)
    if (animations.length === 0) {
      throw new Error('No animations found in spine data')
    }

    centerSpineAnimation()
    loading.value = false

    // 播放入场 + 保持动画序列
    playInKeepSequence()
  } catch (err) {
    console.error('Failed to load spine animation:', err)
    error.value = err.message || 'Failed to load animation'
    loading.value = false
  }
}

// 播放入场动画 → 保持动画序列（可被外部重复调用）
const playInKeepSequence = () => {
  if (!spineAnimation) return
  const animations = spineAnimation.spineData.animations.map(anim => anim.name)
  const hasInAnim = props.in && animations.includes(props.in)
  const hasKeepAnim = props.keep && animations.includes(props.keep)

  // 清除上一次的 complete 监听器
  if (completeListener && spineAnimation) {
    spineAnimation.state.removeListener(completeListener)
    completeListener = null
  }

  if (hasInAnim) {
    playAnimation(props.in, false)

    completeListener = {
      complete: (entry) => {
        if (entry.trackIndex === 0) {
          if (hasKeepAnim) {
            playAnimation(props.keep, true)
          } else {
            let fallbackAnim = props.animationName
            if (!fallbackAnim || !animations.includes(fallbackAnim)) {
              fallbackAnim = animations[0]
            }
            playAnimation(fallbackAnim, props.loop)
          }
          if (spineAnimation && completeListener) {
            spineAnimation.state.removeListener(completeListener)
            completeListener = null
          }
        }
      }
    }
    spineAnimation.state.addListener(completeListener)
  } else if (hasKeepAnim) {
    playAnimation(props.keep, true)
  } else {
    let targetAnim = props.animationName
    if (!targetAnim || !animations.includes(targetAnim)) {
      targetAnim = animations[0]
    }
    playAnimation(targetAnim, props.loop)
  }
}

// 重置 Spine 动画（清空状态 → 重新播放入场序列）
const restart = () => {
  if (!spineAnimation) return
  spineAnimation.state.clearTracks()
  spineAnimation.skeleton.setToSetupPose()
  playInKeepSequence()
}

defineExpose({ restart })

// 清理资源
const destroyPixi = () => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (spineAnimation) {
    if (completeListener) {
      spineAnimation.state.removeListener(completeListener)
      completeListener = null
    }
    spineAnimation.destroy({ children: true })
    spineAnimation = null
  }
  if (app) {
    app.destroy(true, { children: true, texture: true })
    app = null
  }
}

onMounted(() => {
  initPixi()
  loadSpine()
})

onBeforeUnmount(() => {
  destroyPixi()
})
</script>

<style scoped>
.spine-animation-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
}

.spine-animation-container canvas {
  display: block;
  width: 100%;
  height: 100%;
  background: transparent;
}

.spine-loading,
.spine-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 14px;
  text-align: center;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  border-radius: 20px;
  z-index: 10;
}

.spine-error {
  color: #ff6b6b;
}
</style>