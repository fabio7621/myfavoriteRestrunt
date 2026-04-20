<script setup>
import { useRestaurantStore } from '../stores/restaurantStore.js'
import { useRecordStore } from '../stores/recordStore.js'

const restaurantStore = useRestaurantStore()
const recordStore = useRecordStore()
</script>

<template>
  <section class="hero">
    <div>
      <p class="hero__label anim">午餐餐廳日記</p>
      <h1 class="hero__title anim anim-d1">
        記錄今天的<br />
        <span class="hero__title--accent">午餐時光</span>
      </h1>
    </div>
    <div class="hero__stats anim anim-d2">
      <div class="hero__stat-number">{{ restaurantStore.restaurantList.length }}</div>
      <div class="hero__stat-label">間登錄餐廳</div>
      <div class="hero__stat-number hero__stat-number--spaced">{{ recordStore.recordList.length }}</div>
      <div class="hero__stat-label">本月記錄</div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 96px 48px 80px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
}

.hero__label {
  font-size: 12px;
  letter-spacing: 0.2em;
  color: var(--fg3);
  margin-bottom: 24px;
  font-weight: 400;
}

.hero__title {
  font-family: var(--font-serif);
  font-size: 56px;
  font-weight: 300;
  line-height: 1.25;
  letter-spacing: 0.02em;
}

.hero__title--accent {
  color: var(--accent);
}

.hero__stats {
  text-align: right;
  color: var(--fg2);
  font-size: 13px;
  line-height: 2;
  letter-spacing: 0.06em;
}

.hero__stat-number {
  font-size: 36px;
  font-family: var(--font-serif);
  font-weight: 300;
  color: var(--fg);
}

.hero__stat-number--spaced {
  margin-top: 24px;
}

@media (max-width: 768px) {
  .hero {
    padding: 64px 20px 48px;
    flex-direction: column;
    align-items: flex-start;
  }
  .hero__title { font-size: 40px; }
  .hero__stats { text-align: left; }
}
</style>
