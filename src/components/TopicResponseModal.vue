<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <span class="topic-icon">{{ topic.icon }}</span>
        <div class="header-info">
        <h3>{{ topic.label }}</h3>
        <p class="topic-desc">{{ topic.description }}</p>
      </div>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>

    <div class="target-info" v-if="topic.targetTraineeId && targetTrainee">
      <span>👤 关联成员: {{ targetTrainee.name }}</span>
    </div>

    <div class="expires-info">
      ⏰ 剩余回应期限: {{ topic.expiresDay - currentDay }} 天
    </div>

    <div class="options-list">
      <div
        v-for="(option, index) in topic.options"
        :key="index"
        class="option-card"
        :class="{ disabled: !canAfford(option) }"
      >
        <div class="option-content">
          <span class="option-text">{{ option.text }}</span>
          <div class="option-bonuses">
            <span class="bonus">活跃度 +{{ option.activityBonus[0] }}-{{ option.activityBonus[1] }}</span>
            <span class="bonus">满意度 +{{ option.satisfactionBonus[0] }}-{{ option.satisfactionBonus[1] }}</span>
            <span class="bonus revenue">收入加成 +{{ Math.round(option.revenueBonus * 100) }}%</span>
          </div>
        </div>
        <div class="option-action">
          <span v-if="option.cost" class="option-cost">¥{{ option.cost }}</span>
          <button
            @click="onRespond(index)"
            :disabled="!canAfford(option)"
          >
            选择
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  topic: Object,
  currentDay: Number,
  money: Number,
  trainees: Array,
})

const emit = defineEmits(['close', 'respond'])

const targetTrainee = computed(() => {
  if (!props.topic?.targetTraineeId || !props.trainees) return null
  return props.trainees.find(t => t.id === props.topic.targetTraineeId)
})

function canAfford(option) {
  const cost = option.cost || 0
  return props.money >= cost
}

function onRespond(index) {
  const option = props.topic.options[index]
  if (!canAfford(option)) return
  emit('respond', props.topic.id, index)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.topic-icon {
  font-size: 2.5rem;
}

.header-info {
  flex: 1;
}

.header-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.2rem;
}

.topic-desc {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0.25rem 0.5rem;
}

.target-info {
  background: rgba(100, 200, 255, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
}

.expires-info {
  background: rgba(255, 165, 0, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #ffa502;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-muted);
  border-radius: 8px;
  transition: all 0.2s;
}

.option-card.disabled {
  opacity: 0.5;
}

.option-content {
  flex: 1;
}

.option-text {
  font-weight: 600;
  font-size: 0.95rem;
  display: block;
  margin-bottom: 0.5rem;
}

.option-bonuses {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.bonus {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  color: var(--text-secondary);
}

.bonus.revenue {
  background: rgba(255, 215, 0, 0.2);
  color: #ffa502;
}

.option-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.option-cost {
  color: #ff6b6b;
  font-weight: 600;
  font-size: 0.85rem;
}

.option-action button {
  padding: 0.5rem 1rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
}

.option-action button:hover:not(:disabled) {
  background: var(--accent-hover);
}

.option-action button:disabled {
  background: var(--text-secondary);
  cursor: not-allowed;
}
</style>
