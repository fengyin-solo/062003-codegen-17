<template>
  <div class="conversion-stats card">
    <div class="panel-header">
      <h3>💰 商业转化</h3>
      <div class="total-revenue">
        <span class="revenue-label">累计转化收入</span>
        <span class="revenue-value">¥{{ community.totalConversionRevenue.toLocaleString() }}</span>
      </div>
    </div>

    <div class="conversion-grid">
      <div
        v-for="(conversion, key) in conversions"
        :key="key"
        class="conversion-card"
        :class="{ disabled: !canTrigger(key), locked: isLocked(key) }"
      >
        <div class="conversion-header">
          <span class="conversion-icon">{{ conversion.icon }}</span>
          <div class="conversion-info">
            <span class="conversion-label">{{ conversion.label }}</span>
            <span class="conversion-desc">{{ conversion.description }}</span>
          </div>
        </div>

        <div class="conversion-stats">
          <div class="stat">
            <span class="stat-label">基础收入</span>
            <span class="stat-value">¥{{ conversion.baseRevenue.toLocaleString() }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">活跃度系数</span>
            <span class="stat-value">×{{ conversion.activityMultiplier }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">满意度系数</span>
            <span class="stat-value">×{{ conversion.satisfactionMultiplier }}</span>
          </div>
        </div>

        <div class="conversion-footer">
          <div class="conversion-meta">
            <span v-if="conversion.requireDebut" class="meta-tag">🔒 需出道</span>
            <span class="meta-tag cooldown" :class="{ active: getCooldown(key) > 0 }">
              {{ getCooldown(key) > 0 ? `冷却 ${getCooldown(key)} 天` : `冷却 ${conversion.cooldownDays} 天` }}
            </span>
          </div>
          <button
            @click="onTrigger(key)"
            :disabled="!canTrigger(key)"
          >
            触发转化
          </button>
        </div>
      </div>
    </div>

    <div class="history-section" v-if="recentConversions.length > 0">
      <h4>📊 最近转化记录</h4>
      <div class="history-list">
        <div v-for="item in recentConversions" :key="item.id" class="history-item">
          <span class="history-day">D{{ item.day }}</span>
          <span class="history-icon">{{ conversions[item.type]?.icon }}</span>
          <span class="history-label">{{ conversions[item.type]?.label }}</span>
          <span class="history-revenue">¥{{ item.revenue.toLocaleString() }}</span>
          <span class="history-stats">活{{ item.activityAtTime }}/满{{ item.satisfactionAtTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { GAME_CONFIG } from '../config/gameConfig'

const props = defineProps({
  community: Object,
  currentDay: Number,
  hasDebut: Boolean,
})

const emit = defineEmits(['trigger'])

const conversions = GAME_CONFIG.community.conversions

function isLocked(type) {
  const conversion = conversions[type]
  return conversion.requireDebut && !props.hasDebut
}

function canTrigger(type) {
  if (isLocked(type)) return false
  const conversion = conversions[type]
  if (!conversion) return false
  const lastDay = props.community.lastConversionDay[type] || 0
  return props.currentDay - lastDay >= conversion.cooldownDays
}

function getCooldown(type) {
  const conversion = conversions[type]
  if (!conversion) return 0
  const lastDay = props.community.lastConversionDay[type] || 0
  const remaining = conversion.cooldownDays - (props.currentDay - lastDay)
  return Math.max(0, remaining)
}

function onTrigger(type) {
  if (!canTrigger(type)) return
  emit('trigger', type)
}

const recentConversions = computed(() => {
  return [...(props.community.conversions || [])].reverse().slice(0, 8)
})
</script>

<style scoped>
.conversion-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.total-revenue {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.revenue-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.revenue-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2ed573;
}

.conversion-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.conversion-card {
  padding: 1rem;
  background: var(--bg-muted);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.2s;
}

.conversion-card.disabled {
  opacity: 0.5;
}

.conversion-card.locked {
  opacity: 0.4;
  filter: grayscale(0.5);
}

.conversion-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.conversion-icon {
  font-size: 1.8rem;
}

.conversion-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.conversion-label {
  font-weight: 600;
  font-size: 0.95rem;
}

.conversion-desc {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.conversion-stats {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 0.85rem;
  font-weight: 600;
}

.conversion-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conversion-meta {
  display: flex;
  gap: 0.5rem;
}

.meta-tag {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.1);
}

.meta-tag.cooldown.active {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.conversion-footer button {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #2ed573, #7bed9f);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
}

.conversion-footer button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(46, 213, 115, 0.3);
}

.conversion-footer button:disabled {
  background: var(--text-secondary);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.history-section {
  border-top: 1px solid var(--border);
  padding-top: 1rem;
}

.history-section h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--bg-muted);
  border-radius: 6px;
  font-size: 0.8rem;
}

.history-day {
  color: var(--text-secondary);
  font-weight: 600;
  min-width: 40px;
}

.history-icon {
  font-size: 1rem;
}

.history-label {
  flex: 1;
}

.history-revenue {
  font-weight: 600;
  color: #2ed573;
}

.history-stats {
  font-size: 0.7rem;
  color: var(--text-secondary);
}
</style>
