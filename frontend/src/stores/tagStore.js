import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api.js'

export const useTagStore = defineStore('tag', () => {
  const tagList = ref([])
  const activeTag = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref(null)

  // 載入所有標籤
  async function loadTags() {
    isLoading.value = true
    errorMessage.value = null
    try {
      tagList.value = await api.fetchTags()
    } catch (err) {
      errorMessage.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // 設定篩選標籤
  function setActiveTag(tag) {
    activeTag.value = tag
  }

  // 清除篩選
  function clearActiveTag() {
    activeTag.value = null
  }

  return { tagList, activeTag, isLoading, errorMessage, loadTags, setActiveTag, clearActiveTag }
})
