<script setup>
import { ref, computed } from 'vue'
import { useRestaurantStore } from '../stores/restaurantStore.js'
import { useRecordStore } from '../stores/recordStore.js'
import { useTagStore } from '../stores/tagStore.js'

const props = defineProps({
  date: { type: String, required: true },
  existingRecord: { type: Object, default: null },
})
const emit = defineEmits(['close'])

const restaurantStore = useRestaurantStore()
const recordStore     = useRecordStore()
const tagStore        = useTagStore()

const MAX_NOTE_LENGTH = 200

// 有既有記錄 → 先進檢視模式；無記錄 → 直接編輯模式
const isEditMode = ref(!props.existingRecord)

// 表單欄位
const selectedRestaurantId = ref('')
const manualName    = ref('')
const manualAddress = ref('')
const tags          = ref([])
const tagInput      = ref('')
const note          = ref('')
const submitError   = ref('')
const isSubmitting  = ref(false)

function enterEditMode() {
  if (props.existingRecord) {
    const matched = restaurantStore.restaurantList.find(
      r => r.id === props.existingRecord.restaurant_id
    )
    if (matched) {
      selectedRestaurantId.value = matched.id
    } else {
      selectedRestaurantId.value = ''
      manualName.value = props.existingRecord.restaurant_name
      manualAddress.value = props.existingRecord.address || ''
    }
    tags.value = [...(props.existingRecord.tags || [])]
    note.value = props.existingRecord.note || ''
  }
  isEditMode.value = true
}

// 取消編輯：有既有記錄就回檢視模式，否則關閉
function cancelEdit() {
  if (props.existingRecord) isEditMode.value = false
  else emit('close')
}

const selectedRestaurant = computed(() =>
  restaurantStore.restaurantList.find(r => r.id === selectedRestaurantId.value)
)

const isManualMode = computed(() => !selectedRestaurantId.value)

const displayName = computed(() =>
  selectedRestaurant.value ? selectedRestaurant.value.name : manualName.value
)

const displayAddress = computed(() =>
  selectedRestaurant.value ? selectedRestaurant.value.address : manualAddress.value
)

// 按 Enter 新增標籤
function handleTagKeydown(e) {
  if (e.key !== 'Enter' && e.key !== ',') return
  e.preventDefault()
  const trimmed = tagInput.value.trim().replace(/,/g, '')
  if (trimmed && !tags.value.includes(trimmed)) tags.value.push(trimmed)
  tagInput.value = ''
}

function removeTag(index) {
  tags.value.splice(index, 1)
}

async function handleSubmit() {
  submitError.value = ''
  if (!displayName.value?.trim() || !displayAddress.value?.trim()) {
    submitError.value = '餐廳名稱與地址為必填'
    return
  }
  if (tags.value.length === 0) {
    submitError.value = '至少需要一個標籤'
    return
  }

  const data = {
    date: props.date,
    restaurant_id:   selectedRestaurantId.value || null,
    restaurant_name: displayName.value.trim(),
    address:         displayAddress.value.trim(),
    tags:            tags.value,
    photos:          props.existingRecord?.photos || [],
    note:            note.value.trim(),
  }

  isSubmitting.value = true
  try {
    const result = props.existingRecord
      ? await recordStore.editRecord(props.existingRecord.id, data)
      : await recordStore.saveRecord(data)

    if (result) {
      await tagStore.loadTags()
      emit('close')
    } else {
      submitError.value = recordStore.errorMessage || '儲存失敗'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="emit('close')">
      <div class="modal">
        <p class="section-label">
          {{ existingRecord ? (isEditMode ? '編輯記錄' : '查看記錄') : '新增記錄' }}
        </p>
        <h3 class="modal__title">
          {{ existingRecord ? existingRecord.restaurant_name : '新增記錄' }}
        </h3>
        <p class="modal__date">{{ date }}</p>

        <!-- 檢視模式 -->
        <template v-if="!isEditMode && existingRecord">
          <div class="modal__field">
            <label class="modal__label">餐廳</label>
            <div class="modal__readonly">{{ existingRecord.restaurant_name }}</div>
          </div>
          <div class="modal__field">
            <label class="modal__label">地址</label>
            <div class="modal__readonly">{{ existingRecord.address }}</div>
          </div>
          <div class="modal__field">
            <label class="modal__label">標籤</label>
            <div class="modal__tags">
              <span
                v-for="t in existingRecord.tags"
                :key="t"
                class="modal__tag modal__tag--static"
              >#{{ t }}</span>
            </div>
          </div>
          <div v-if="existingRecord.note" class="modal__field">
            <label class="modal__label">備註</label>
            <div class="modal__readonly modal__readonly--note">{{ existingRecord.note }}</div>
          </div>

          <div class="modal__actions">
            <button type="button" class="btn-primary" @click="enterEditMode">編輯</button>
            <button type="button" class="btn-secondary" @click="emit('close')">關閉</button>
          </div>
        </template>

        <!-- 編輯 / 新增模式 -->
        <form v-else @submit.prevent="handleSubmit">
          <div class="modal__field">
            <label class="modal__label">餐廳名稱 *</label>
            <select v-model="selectedRestaurantId" class="modal__input modal__select">
              <option value="">手動輸入…</option>
              <option
                v-for="r in restaurantStore.restaurantList"
                :key="r.id"
                :value="r.id"
              >{{ r.name }}</option>
            </select>
          </div>

          <template v-if="isManualMode">
            <div class="modal__field">
              <label class="modal__label">餐廳名稱（手動）*</label>
              <input v-model="manualName" class="modal__input" placeholder="餐廳名稱" />
            </div>
            <div class="modal__field">
              <label class="modal__label">地址 *</label>
              <input v-model="manualAddress" class="modal__input" placeholder="地址" />
            </div>
          </template>

          <div class="modal__field">
            <label class="modal__label">標籤 *</label>
            <div class="modal__tags">
              <span
                v-for="(t, i) in tags"
                :key="i"
                class="modal__tag"
                @click="removeTag(i)"
              >#{{ t }} ×</span>
            </div>
            <input
              v-model="tagInput"
              class="modal__input"
              placeholder="輸入標籤後按 Enter"
              @keydown="handleTagKeydown"
            />
          </div>

          <div class="modal__field">
            <label class="modal__label">備註（選填）</label>
            <textarea
              v-model="note"
              class="modal__textarea"
              rows="3"
              :maxlength="MAX_NOTE_LENGTH"
              placeholder="今天的感想…"
            />
            <div class="modal__char-count">{{ note.length }} / {{ MAX_NOTE_LENGTH }}</div>
          </div>

          <p v-if="submitError" class="modal__error">{{ submitError }}</p>

          <div class="modal__actions">
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? '儲存中…' : '儲存' }}
            </button>
            <button type="button" class="btn-secondary" @click="cancelEdit">取消</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 23, 20, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: var(--bg);
  width: 520px;
  max-width: 92vw;
  max-height: 85vh;
  overflow-y: auto;
  padding: 48px;
  border: 1px solid var(--border);
  animation: slideIn 0.3s ease;
}

.modal__title {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 8px;
}

.modal__date {
  font-size: 13px;
  color: var(--fg3);
  letter-spacing: 0.08em;
  margin-bottom: 36px;
}

.modal__field {
  margin-bottom: 28px;
}

.modal__label {
  display: block;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: var(--fg3);
  margin-bottom: 10px;
}

.modal__input {
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--border);
  background: none;
  padding: 8px 0;
  font-size: 15px;
  font-family: var(--font-sans);
  color: var(--fg);
  outline: none;
}

.modal__select { cursor: pointer; }

.modal__readonly {
  font-size: 15px;
  color: var(--fg);
  padding: 4px 0;
}

.modal__readonly--note {
  white-space: pre-wrap;
  line-height: 1.7;
  color: var(--fg2);
}

.modal__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.modal__tag {
  padding: 4px 10px;
  border: 1px solid var(--accent);
  font-size: 12px;
  color: var(--accent);
  cursor: pointer;
  letter-spacing: 0.06em;
}

.modal__tag--static { cursor: default; }

.modal__textarea {
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--border);
  background: none;
  padding: 8px 0;
  font-size: 14px;
  font-family: var(--font-sans);
  color: var(--fg);
  outline: none;
  resize: none;
  line-height: 1.8;
}

.modal__char-count {
  font-size: 11px;
  color: var(--fg3);
  text-align: right;
  margin-top: 4px;
}

.modal__error {
  color: #b14a3b;
  font-size: 12px;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
}

.modal__actions {
  display: flex;
  gap: 16px;
}

@media (max-width: 768px) {
  .modal { padding: 32px 24px; }
}
</style>
