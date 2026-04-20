<script setup>
defineProps({
  activeSection: { type: String, required: true },
})
const emit = defineEmits(['navigate'])

const sections = [
  { id: 'restaurants', label: '餐廳' },
  { id: 'map',         label: '地圖' },
  { id: 'calendar',    label: '日記' },
  { id: 'tags',        label: '標籤' },
]
</script>

<template>
  <nav class="app-nav">
    <span class="app-nav__logo">
      myfavorite<span class="app-nav__logo--accent">Restrunt</span>
    </span>
    <div class="app-nav__links">
      <button
        v-for="s in sections"
        :key="s.id"
        class="app-nav__link"
        :class="{ 'app-nav__link--active': activeSection === s.id }"
        @click="emit('navigate', s.id)"
      >
        {{ s.label }}
      </button>
    </div>
  </nav>
</template>

<style scoped>
.app-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(248, 245, 240, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  height: 64px;
}

.app-nav__logo {
  font-family: var(--font-serif);
  font-size: 16px;
  letter-spacing: 0.08em;
  font-weight: 400;
}

.app-nav__logo--accent {
  color: var(--accent);
}

.app-nav__links {
  display: flex;
  gap: 36px;
}

.app-nav__link {
  background: none;
  border: none;
  border-bottom: 1px solid transparent;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.12em;
  color: var(--fg2);
  padding-bottom: 2px;
  transition: color 0.2s, border-color 0.2s;
}

.app-nav__link--active,
.app-nav__link:hover {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

@media (max-width: 768px) {
  .app-nav { padding: 0 20px; }
  .app-nav__links { gap: 20px; }
}
</style>
