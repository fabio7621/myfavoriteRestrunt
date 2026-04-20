import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api.js'
import { useTagStore } from './tagStore.js'

export const useRecordStore = defineStore('record', () => {
  const recordList = ref([])
  const currentMonth = ref('')
  const isLoading = ref(false)
  const errorMessage = ref(null)

  // 以日期為 key 的 map，讓 Calendar 直接查詢
  const recordsByDate = computed(() => {
    const map = {}
    for (const record of recordList.value) {
      if (!map[record.date]) map[record.date] = []
      map[record.date].push(record)
    }
    return map
  })

  // 載入指定月份的記錄（同時套用 tagStore 的 activeTag 篩選）
  async function loadMonthlyRecords(month) {
    isLoading.value = true
    errorMessage.value = null
    currentMonth.value = month
    const tagStore = useTagStore()
    try {
      const params = { month }
      if (tagStore.activeTag) params.tag = tagStore.activeTag
      recordList.value = await api.fetchRecords(params)
    } catch (err) {
      errorMessage.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // 儲存新記錄並重新整理
  async function saveRecord(data) {
    isLoading.value = true
    errorMessage.value = null
    try {
      const newRecord = await api.createRecord(data)
      recordList.value = [...recordList.value, newRecord]
      return newRecord
    } catch (err) {
      errorMessage.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // 更新現有記錄，同步替換 store 內的項目
  async function editRecord(id, data) {
    isLoading.value = true
    errorMessage.value = null
    try {
      const updated = await api.updateRecord(id, data)
      const index = recordList.value.findIndex(r => r.id === id)
      if (index !== -1) {
        recordList.value = recordList.value.map((r, i) => i === index ? updated : r)
      }
      return updated
    } catch (err) {
      errorMessage.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    recordList,
    currentMonth,
    isLoading,
    errorMessage,
    recordsByDate,
    loadMonthlyRecords,
    saveRecord,
    editRecord,
  }
})
