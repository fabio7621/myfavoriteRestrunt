<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import L from 'leaflet'
import { useRestaurantStore } from '../stores/restaurantStore.js'

// 修正 Leaflet 預設 icon 路徑問題
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl:       new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl:     new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

const restaurantStore = useRestaurantStore()

const mapContainer = ref(null)
let mapInstance = null
const markerMap = {}

const focusedRestaurant = computed(() =>
  restaurantStore.getById(restaurantStore.focusedRestaurantId)
)

onMounted(() => {
  // 初始化 Leaflet 地圖，中心設在高雄
  mapInstance = L.map(mapContainer.value).setView([22.6273, 120.3014], 14)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapInstance)

  renderMarkers()
})

// 餐廳清單更新時重新渲染 pin 點
watch(() => restaurantStore.restaurantList, renderMarkers, { deep: true })

// 聚焦特定餐廳時地圖飛過去
watch(() => restaurantStore.focusedLocation, (location) => {
  if (!location || !mapInstance) return
  if (location.lat && location.lng) {
    mapInstance.flyTo([location.lat, location.lng], 16)
    const marker = markerMap[restaurantStore.focusedRestaurantId]
    if (marker) marker.openPopup()
  }
})

function renderMarkers() {
  if (!mapInstance) return

  for (const key in markerMap) {
    markerMap[key].remove()
    delete markerMap[key]
  }

  for (const restaurant of restaurantStore.restaurantList) {
    const { lat, lng } = restaurant.location || {}
    if (!lat || !lng) continue

    const marker = L.marker([lat, lng])
      .addTo(mapInstance)
      .bindPopup(`<strong>${restaurant.name}</strong><br>${restaurant.address}`)

    marker.on('click', () => restaurantStore.focusRestaurant(restaurant))
    markerMap[restaurant.id] = marker
  }
}
</script>

<template>
  <section id="map" class="map-view">
    <div class="map-view__header">
      <p class="section-label">地圖分佈</p>
      <h2 class="section-title">地圖分佈</h2>
    </div>

    <div class="map-view__container">
      <div ref="mapContainer" class="map-view__leaflet"></div>

      <div v-if="focusedRestaurant" class="map-view__info-card">
        <div class="map-view__info-label">已選取</div>
        <div class="map-view__info-name">{{ focusedRestaurant.name }}</div>
        <div class="map-view__info-address">{{ focusedRestaurant.address }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.map-view {
  padding: 80px 48px;
  border-bottom: 1px solid var(--border);
}

.map-view__header {
  margin-bottom: 48px;
}

.map-view__container {
  position: relative;
  border: 1px solid var(--border);
  overflow: hidden;
}

.map-view__leaflet {
  width: 100%;
  height: 440px;
  background: var(--bg2);
}

.map-view__info-card {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(248, 245, 240, 0.95);
  border: 1px solid var(--border);
  padding: 16px 20px;
  min-width: 200px;
  z-index: 500;
}

.map-view__info-label {
  font-size: 11px;
  letter-spacing: 0.15em;
  color: var(--fg3);
  margin-bottom: 6px;
}

.map-view__info-name {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 400;
}

.map-view__info-address {
  font-size: 12px;
  color: var(--fg2);
  margin-top: 4px;
}

@media (max-width: 768px) {
  .map-view { padding: 48px 20px; }
  .map-view__header { margin-bottom: 32px; }
  .map-view__leaflet { height: 320px; }
}
</style>
