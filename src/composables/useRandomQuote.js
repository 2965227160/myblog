import { ref } from 'vue'

export function useRandomQuote(dataUrl = '/data/sentences.json') {
  const quote = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const loadRandom = async () => {
    loading.value = true
    error.value = null
    
    try {
      const res = await fetch(`${dataUrl}?t=${Date.now()}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        const idx = Math.floor(Math.random() * data.length)
        quote.value = data[idx]
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  // 首次加载
  loadRandom()
  
  return {
    quote,
    loading,
    error,
    refresh: loadRandom  // 暴露刷新方法
  }
}