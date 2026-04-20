<script setup>
import { ref } from 'vue'
import { useRestaurantStore } from '../stores/restaurantStore.js'

const emit = defineEmits(['close'])
const restaurantStore = useRestaurantStore()

const name = ref('')
const address = ref('')
const submitError = ref('')
const isSubmitting = ref(false)

async function handleSubmit() {
  submitError.value = ''
  if (!name.value.trim() || !address.value.trim()) {
    submitError.value = '餐廳名稱與地址為必填'
    return
  }
  isSubmitting.value = true
  try {
    const result = await restaurantStore.addRestaurant({
      name: name.value.trim(),
      address: address.value.trim(),
    })
    if (result) {
      emit('close')
    } else {
      submitError.value = restaurantStore.errorMessage || '新增失敗，請稍後再試'
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
        <p class="section-label">新增餐廳</p>
        <h3 class="modal__title">新增餐廳</h3>

        <form @submit.prevent="handleSubmit">
          <div class="modal__field">
            <label class="modal__label">餐廳名稱 *</label>
            <input v-model="name" class="modal__input" placeholder="飛鳥食堂" required />
          </div>
          <div class="modal__field">
            <label class="modal__label">地址 *</label>
            <input v-model="address" class="modal__input" placeholder="高雄市三民區…" required />
          </div>

          <p v-if="submitError" class="modal__error">{{ submitError }}</p>

          <div class="modal__actions">
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? '新增中…' : '確認新增' }}
            </button>
            <button type="button" class="btn-secondary" @click="emit('close')">取消</button>
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
  width: 480px;
  max-width: 92vw;
  padding: 48px;
  border: 1px solid var(--border);
  animation: slideIn 0.3s ease;
}

.modal__title {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 36px;
}

.modal__field {
  margin-bottom: 24px;
}

.modal__label {
  display: block;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: var(--fg3);
  margin-bottom: 8px;
}

.modal__input {
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--border);
  background: none;
  padding: 8px 0;
  font-size: 16px;
  font-family: var(--font-sans);
  color: var(--fg);
  outline: none;
}

.modal__error {
  color: #b14a3b;
  font-size: 12px;
  letter-spacing: 0.06em;
  margin-top: 8px;
}

.modal__actions {
  display: flex;
  gap: 16px;
  margin-top: 36px;
}
</style>
