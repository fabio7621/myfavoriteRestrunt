<script setup>
import { computed } from 'vue'
import { useTagStore } from '../stores/tagStore.js'

const tagStore = useTagStore()

// 字體大小依出現次數線性縮放
const MIN_SIZE = 12
const MAX_SIZE = 32

const maxCount = computed(() =>
  Math.max(...tagStore.tagList.map((t) => t.count), 1)
)

function fontSize(count) {
  return MIN_SIZE + (count / maxCount.value) * (MAX_SIZE - MIN_SIZE)
}

function fontColor(count) {
  const l = 0.3 + (count / maxCount.value) * 0.3
  return `oklch(${l} 0 0)`
}

function handleTagClick(tagName) {
  if (tagStore.activeTag === tagName) tagStore.clearActiveTag()
  else tagStore.setActiveTag(tagName)
}
</script>

<template>
  <section id="tags" class="tag-cloud">
    <div class="tag-cloud__header">
      <p class="section-label">標籤雲</p>
      <h2 class="section-title">標籤雲</h2>
    </div>

    <div v-if="tagStore.isLoading" class="tag-cloud__loading">載入中…</div>

    <div v-else-if="tagStore.tagList.length === 0" class="tag-cloud__loading">
      尚無標籤
    </div>

    <div v-else class="tag-cloud__cloud">
      <span
        v-for="tag in tagStore.tagList"
        :key="tag.name"
        class="tag-cloud__tag"
        :class="{ 'tag-cloud__tag--active': tagStore.activeTag === tag.name }"
        :style="{
          fontSize: fontSize(tag.count) + 'px',
          color: tagStore.activeTag === tag.name ? 'var(--accent)' : fontColor(tag.count),
        }"
        @click="handleTagClick(tag.name)"
      >
        {{ tag.name }}<span class="tag-cloud__count">{{ tag.count }}</span>
      </span>
    </div>

    <button
      v-if="tagStore.activeTag"
      class="btn-outline tag-cloud__clear"
      @click="tagStore.clearActiveTag()"
    >
      清除篩選 ×
    </button>
  </section>
</template>

<style scoped>
.tag-cloud {
  padding: 80px 48px;
  border-bottom: 1px solid var(--border);
}

.tag-cloud__header {
  margin-bottom: 48px;
}

.tag-cloud__loading {
  font-size: 13px;
  color: var(--fg3);
  letter-spacing: 0.1em;
}

.tag-cloud__cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  align-items: baseline;
  padding: 32px 0;
}

.tag-cloud__tag {
  font-family: var(--font-serif);
  font-weight: 300;
  cursor: pointer;
  letter-spacing: 0.04em;
  border-bottom: 1px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.tag-cloud__tag:hover,
.tag-cloud__tag--active {
  color: var(--accent) !important;
}

.tag-cloud__tag--active {
  border-bottom-color: var(--accent);
}

.tag-cloud__count {
  font-size: 10px;
  color: var(--fg3);
  margin-left: 3px;
}

.tag-cloud__clear {
  margin-top: 24px;
}

@media (max-width: 768px) {
  .tag-cloud { padding: 48px 20px; }
  .tag-cloud__header { margin-bottom: 32px; }
}
</style>
