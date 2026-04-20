<script setup>
import { ref } from 'vue'
import { useRestaurantStore } from '../stores/restaurantStore.js'

const props = defineProps({
  restaurant: { type: Object, required: true },
  index:      { type: Number, required: true },
  isFocused:  { type: Boolean, default: false },
})
defineEmits(['click'])

const restaurantStore = useRestaurantStore()
const isHovered = ref(false)

// 點刪除按鈕時不觸發 card click 的聚焦行為
async function handleDelete(event) {
  event.stopPropagation()
  if (!confirm(`確定要刪除「${props.restaurant.name}」嗎？`)) return
  await restaurantStore.removeRestaurant(props.restaurant.id)
}
</script>

<template>
  <div
    class="restaurant-card"
    :class="{
      'restaurant-card--focused': isFocused,
      'restaurant-card--hovered': isHovered,
    }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="$emit('click')"
  >
    <button
      class="restaurant-card__delete"
      title="刪除餐廳"
      @click="handleDelete"
    >×</button>

    <div class="restaurant-card__index">
      #{{ String(index + 1).padStart(2, '0') }}
    </div>
    <div class="restaurant-card__name">{{ restaurant.name }}</div>
    <div class="restaurant-card__address">{{ restaurant.address }}</div>
    <div class="restaurant-card__visits">
      <span class="restaurant-card__dot" />
      {{ restaurant.visits ?? 0 }} 次造訪
    </div>
  </div>
</template>

<style scoped>
.restaurant-card {
  position: relative;
  padding: 32px 28px;
  cursor: pointer;
  background: var(--bg);
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;
}

.restaurant-card--hovered  { background: var(--bg2); }
.restaurant-card--focused  { background: var(--accent-light); }

.restaurant-card__delete {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 22px;
  height: 22px;
  background: none;
  color: var(--fg3);
  font-size: 16px;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.15s, color 0.15s;
}

.restaurant-card:hover .restaurant-card__delete { opacity: 1; }
.restaurant-card__delete:hover { color: var(--accent); }

.restaurant-card__index {
  font-size: 11px;
  color: var(--fg3);
  letter-spacing: 0.15em;
  margin-bottom: 12px;
}

.restaurant-card__name {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 8px;
}

.restaurant-card__address {
  font-size: 12px;
  color: var(--fg2);
  line-height: 1.6;
  letter-spacing: 0.04em;
  margin-bottom: 16px;
}

.restaurant-card__visits {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--fg3);
  letter-spacing: 0.08em;
}

.restaurant-card__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  display: inline-block;
}
</style>
