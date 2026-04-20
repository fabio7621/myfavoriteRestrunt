<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRestaurantStore } from './stores/restaurantStore.js'
import { useTagStore } from './stores/tagStore.js'

import AppNav from './components/AppNav.vue'
import AppHero from './components/AppHero.vue'
import AppFooter from './components/AppFooter.vue'
import RestaurantList from './components/RestaurantList.vue'
import MapView from './components/MapView.vue'
import Calendar from './components/Calendar.vue'
import TagCloud from './components/TagCloud.vue'

const restaurantStore = useRestaurantStore()
const tagStore = useTagStore()

const activeSection = ref('restaurants')
const sectionIds = ['restaurants', 'map', 'calendar', 'tags']
let observer = null

// 點 RestaurantCard → 地圖聚焦並跳到地圖區塊
function handleFocusMap(restaurant) {
  restaurantStore.focusRestaurant(restaurant)
  scrollToSection('map')
}

// 點 nav 項目：更新 activeSection 並平滑滾動
function scrollToSection(id) {
  activeSection.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(async () => {
  await Promise.all([
    restaurantStore.loadRestaurants(),
    tagStore.loadTags(),
  ])

  // 滾動到哪個 section，nav 就 highlight 哪個
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      }
    },
    { threshold: 0.3 }
  )
  for (const id of sectionIds) {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <AppNav :active-section="activeSection" @navigate="scrollToSection" />

  <main>
    <AppHero />
    <RestaurantList @focus-map="handleFocusMap" />
    <MapView />
    <Calendar />
    <TagCloud />
  </main>

  <AppFooter />
</template>
