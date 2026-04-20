<script setup>
import { ref, computed, watch } from 'vue'
import { useRecordStore } from '../stores/recordStore.js'
import { useTagStore } from '../stores/tagStore.js'
import RecordModal from './RecordModal.vue'

const recordStore = useRecordStore()
const tagStore    = useTagStore()

const today = new Date()
const year  = ref(today.getFullYear())
const month = ref(today.getMonth() + 1)

const monthLabel = computed(() =>
  `${year.value}年${month.value}月`
)

const currentMonthStr = computed(() =>
  `${year.value}-${String(month.value).padStart(2, '0')}`
)

// 月曆格子：前面補 null 補齊星期
const calendarDays = computed(() => {
  const firstDay    = new Date(year.value, month.value - 1, 1).getDay()
  const daysInMonth = new Date(year.value, month.value, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  return days
})

function dateStr(d) {
  return `${year.value}-${String(month.value).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function isToday(d) {
  return (
    d === today.getDate() &&
    month.value === today.getMonth() + 1 &&
    year.value === today.getFullYear()
  )
}

function prevMonth() {
  if (month.value === 1) { year.value--; month.value = 12 }
  else month.value--
}
function nextMonth() {
  if (month.value === 12) { year.value++; month.value = 1 }
  else month.value++
}

// Modal 狀態
const selectedDate    = ref(null)
const selectedRecord  = ref(null)

function handleDayClick(d) {
  if (!d) return
  const ds = dateStr(d)
  selectedDate.value = ds
  selectedRecord.value = recordStore.recordsByDate[ds]?.[0] ?? null
}

function closeModal() {
  selectedDate.value = null
  selectedRecord.value = null
  // 重新載入本月以反映新增或編輯
  recordStore.loadMonthlyRecords(currentMonthStr.value)
}

// 切換月份或 activeTag 時重新載入
watch(currentMonthStr, (val) => recordStore.loadMonthlyRecords(val), { immediate: true })
watch(() => tagStore.activeTag, () => recordStore.loadMonthlyRecords(currentMonthStr.value))

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六']
</script>

<template>
  <section id="calendar" class="calendar-section">
    <div class="calendar-section__header">
      <div>
        <p class="section-label">午餐日記</p>
        <h2 class="section-title">午餐日記</h2>
      </div>
      <div class="calendar-section__nav">
        <button class="calendar-section__arrow" @click="prevMonth">←</button>
        <span class="calendar-section__month-label">{{ monthLabel }}</span>
        <button class="calendar-section__arrow" @click="nextMonth">→</button>
      </div>
    </div>

    <div v-if="tagStore.activeTag" class="calendar-section__filter-badge">
      <span class="calendar-section__filter-text">篩選標籤：</span>
      <span class="calendar-section__filter-tag">#{{ tagStore.activeTag }}</span>
    </div>

    <div class="calendar-grid calendar-grid--header">
      <div v-for="d in WEEK_DAYS" :key="d" class="calendar-grid__weekday">{{ d }}</div>
    </div>

    <div class="calendar-grid calendar-grid--days">
      <div
        v-for="(d, i) in calendarDays"
        :key="i"
        class="calendar-cell"
        :class="{
          'calendar-cell--today':    d && isToday(d),
          'calendar-cell--selected': d && selectedDate === dateStr(d),
          'calendar-cell--empty':    !d,
        }"
        @click="handleDayClick(d)"
      >
        <template v-if="d">
          <span class="calendar-cell__day">{{ d }}</span>
          <div
            v-for="rec in recordStore.recordsByDate[dateStr(d)]"
            :key="rec.id"
            class="calendar-cell__record"
          >
            {{ rec.restaurant_name }}
          </div>
          <span v-if="!recordStore.recordsByDate[dateStr(d)]" class="calendar-cell__add">+</span>
        </template>
      </div>
    </div>

    <RecordModal
      v-if="selectedDate"
      :date="selectedDate"
      :existing-record="selectedRecord"
      @close="closeModal"
    />
  </section>
</template>

<style scoped>
.calendar-section {
  padding: 80px 48px;
  border-bottom: 1px solid var(--border);
}

.calendar-section__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 48px;
  flex-wrap: wrap;
  gap: 16px;
}

.calendar-section__nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.calendar-section__arrow {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--fg2);
  font-size: 18px;
  padding: 4px 8px;
}

.calendar-section__month-label {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 300;
  min-width: 120px;
  text-align: center;
}

.calendar-section__filter-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: var(--accent-light);
  font-size: 12px;
  margin-bottom: 24px;
}

.calendar-section__filter-text { color: var(--fg3); letter-spacing: 0.1em; }
.calendar-section__filter-tag  { color: var(--accent); font-weight: 500; }

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.calendar-grid--header { margin-bottom: 1px; }
.calendar-grid--days   { background: var(--border); }

.calendar-grid__weekday {
  text-align: center;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--fg3);
  padding: 8px 0;
}

.calendar-cell {
  min-height: 80px;
  background: var(--bg);
  padding: 10px 12px;
  cursor: pointer;
  position: relative;
  transition: background 0.15s;
}

.calendar-cell:hover         { background: var(--bg2); }
.calendar-cell--selected     { background: var(--accent-light) !important; }
.calendar-cell--empty        { cursor: default; background: var(--bg); }

.calendar-cell__day {
  font-size: 13px;
  font-family: var(--font-serif);
  font-weight: 300;
}

.calendar-cell--today .calendar-cell__day {
  color: var(--accent);
  font-weight: 600;
}

.calendar-cell__record {
  margin-top: 6px;
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 0.04em;
  line-height: 1.4;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.calendar-cell__add {
  position: absolute;
  bottom: 8px;
  right: 10px;
  font-size: 16px;
  color: var(--border);
}

@media (max-width: 768px) {
  .calendar-section { padding: 48px 20px; }
  .calendar-cell    { min-height: 56px; padding: 6px 8px; }
  .calendar-section__header { margin-bottom: 32px; }
}
</style>
