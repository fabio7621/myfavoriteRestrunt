<script setup>
import { ref } from 'vue'
import { useRestaurantStore } from '../stores/restaurantStore.js'
import RestaurantCard from './RestaurantCard.vue'
import AddRestaurantModal from './AddRestaurantModal.vue'

const emit = defineEmits(['focus-map'])
const restaurantStore = useRestaurantStore()

const showModal = ref(false)
</script>

<template>
  <section id="restaurants" class="restaurant-list">
    <div class="restaurant-list__header">
      <div>
        <p class="section-label">餐廳列表</p>
        <h2 class="section-title">常光顧的餐廳</h2>
      </div>
      <button class="btn-outline" @click="showModal = true">+ 新增餐廳</button>
    </div>

    <div v-if="restaurantStore.isLoading" class="restaurant-list__loading">
      載入中…
    </div>

    <div v-else-if="restaurantStore.restaurantList.length === 0" class="restaurant-list__loading">
      尚無餐廳資料
    </div>

    <div v-else class="restaurant-list__grid">
      <RestaurantCard
        v-for="(restaurant, index) in restaurantStore.restaurantList"
        :key="restaurant.id"
        :restaurant="restaurant"
        :index="index"
        :is-focused="restaurantStore.focusedRestaurantId === restaurant.id"
        @click="emit('focus-map', restaurant)"
      />
    </div>

    <AddRestaurantModal v-if="showModal" @close="showModal = false" />
  </section>
</template>

<style scoped>
.restaurant-list {
  padding: 80px 48px;
  border-bottom: 1px solid var(--border);
}

.restaurant-list__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 48px;
  gap: 16px;
  flex-wrap: wrap;
}

.restaurant-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1px;
  border: 1px solid var(--border);
}

.restaurant-list__loading {
  font-size: 13px;
  color: var(--fg3);
  letter-spacing: 0.1em;
}

@media (max-width: 768px) {
  .restaurant-list { padding: 48px 20px; }
  .restaurant-list__header { margin-bottom: 32px; }
}
</style>
