import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api.js'

export const useRestaurantStore = defineStore('restaurant', () => {
  const restaurantList = ref([])
  const isLoading = ref(false)
  const errorMessage = ref(null)

  // 地圖聚焦狀態（被點擊的那一間）
  const focusedRestaurantId = ref(null)
  const focusedLocation = ref(null)

  // 依 id 取得單一餐廳
  const getById = computed(() => (id) =>
    restaurantList.value.find((r) => r.id === id) ?? null
  )

  // 載入所有餐廳
  async function loadRestaurants() {
    isLoading.value = true
    errorMessage.value = null
    try {
      restaurantList.value = await api.fetchRestaurants()
    } catch (err) {
      errorMessage.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // 新增餐廳，geocoding 失敗不阻斷流程，以 null 座標繼續儲存
  async function addRestaurant({ name, address }) {
    isLoading.value = true
    errorMessage.value = null
    try {
      let location = null
      try {
        location = await api.geocodeAddress(address)
      } catch {
        // Nominatim 不可用時靜默 fallback，地圖不顯示 pin 點
      }

      const newRestaurant = await api.createRestaurant({
        name,
        address,
        location: location || { lat: null, lng: null }
      })
      restaurantList.value = [...restaurantList.value, newRestaurant]
      return newRestaurant
    } catch (err) {
      errorMessage.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // 刪除餐廳，同步移除 store 內的項目
  async function removeRestaurant(id) {
    try {
      await api.deleteRestaurant(id)
      restaurantList.value = restaurantList.value.filter(r => r.id !== id)
      if (focusedRestaurantId.value === id) clearFocus()
    } catch (err) {
      errorMessage.value = err.message
    }
  }

  // 地圖聚焦指定餐廳
  function focusRestaurant(restaurant) {
    focusedRestaurantId.value = restaurant.id
    focusedLocation.value = restaurant.location
  }

  function clearFocus() {
    focusedRestaurantId.value = null
    focusedLocation.value = null
  }

  return {
    restaurantList,
    isLoading,
    errorMessage,
    focusedRestaurantId,
    focusedLocation,
    getById,
    loadRestaurants,
    addRestaurant,
    removeRestaurant,
    focusRestaurant,
    clearFocus,
  }
})
