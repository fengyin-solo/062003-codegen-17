<template>
  <div class="community-panel card">
    <div class="panel-header">
      <h3>💬 粉丝社群</h3>
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-label">活跃度</span>
          <div class="stat-bar">
            <div class="stat-fill activity" :style="{ width: community.activity + '%' }"></div>
          </div>
          <span class="stat-value">{{ community.activity }}/100</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">满意度</span>
          <div class="stat-bar">
            <div class="stat-fill satisfaction" :style="{ width: community.satisfaction + '%' }"></div>
          </div>
          <span class="stat-value">{{ community.satisfaction }}/100</span>
        </div>
      </div>
      <div class="bonus-info" v-if="community.revenueBonusMultiplier > 1">
        💰 收入加成: +{{ Math.round((community.revenueBonusMultiplier - 1) * 100) }}%
      </div>
    </div>

    <div class="topics-section" v-if="community.topics.length > 0">
      <h4>📢 待回应话题 ({{ community.topics.length }})</h4>
      <div class="topic-list">
        <div
          v-for="topic in community.topics"
          :key="topic.id"
          class="topic-item"
          @click="$emit('show-topic', topic)"
        >
          <span class="topic-icon">{{ topic.icon }}</span>
          <div class="topic-info">
            <span class="topic-label">{{ topic.label }}</span>
            <span class="topic-expires">
              剩余 {{ topic.expiresDay - currentDay }} 天
            </span>
          </div>
          <span class="topic-arrow">→</span>
        </div>
      </div>
    </div>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="activeTab === 'materials'" class="materials-grid">
      <div
        v-for="(material, key) in materials"
        :key="key"
        class="material-card"
        :class="{ disabled: !canPublish(key) }"
      >
        <div class="material-icon">{{ material.icon }}</div>
        <div class="material-info">
          <span class="material-label">{{ material.label }}</span>
          <span class="material-desc">{{ material.description }}</span>
          <div class="material-stats">
            <span>活跃度 +{{ material.activityGain[0] }}-{{ material.activityGain[1] }}</span>
            <span>满意度 +{{ material.satisfactionGain[0] }}-{{ material.satisfactionGain[1] }}</span>
          </div>
        </div>
        <div class="material-cost">
          <span class="cost">¥{{ material.cost }}</span>
          <span v-if="getCooldown(key) > 0" class="cooldown">
            冷却 {{ getCooldown(key) }} 天
          </span>
          <button
            @click="onPublish(key)"
            :disabled="!canPublish(key)"
          >
            发布
          </button>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'history'" class="history-section">
      <div v-if="recentMaterials.length === 0" class="empty-state">
        暂无发布记录
      </div>
      <div v-else class="history-list">
        <div v-for="item in recentMaterials" :key="item.id" class="history-item">
          <span class="history-day">D{{ item.day }}</span>
          <span class="history-icon">{{ materials[item.type]?.icon }}</span>
          <span class="history-label">{{ materials[item.type]?.label }}</span>
          <span class="history-gain">+{{ item.activityGain }}活 / +{{ item.satisfactionGain }}满</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { GAME_CONFIG } from '../config/gameConfig'

const props = defineProps({
  community: Object,
  currentDay: Number,
  money: Number,
})

const emit = defineEmits(['publish', 'show-topic'])

const tabs = [
  { key: 'materials', label: '发布物料' },
  { key: 'history', label: '发布记录' },
]

const activeTab = ref('materials')
const materials = GAME_CONFIG.community.materials

function canPublish(type) {
  const material = materials[type]
  if (!material) return false
  if (props.money < material.cost) return false
  const lastDay = props.community.lastMaterialDay[type] || 0
  return props.currentDay - lastDay >= material.cooldownDays
}

function getCooldown(type) {
  const material = materials[type]
  if (!material) return 0
  const lastDay = props.community.lastMaterialDay[type] || 0
  const remaining = material.cooldownDays - (props.currentDay - lastDay)
  return Math.max(0, remaining)
}

function onPublish(type) {
  if (!canPublish(type)) return
  emit('publish', type)
}

const recentMaterials = computed(() => {
  return [...(props.community.materials || [])].reverse().slice(0, 10)
})
</script>

<style scoped>
.community-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.stats-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  min-width: 50px;
}

.stat-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-muted);
  border-radius: 4px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.stat-fill.activity {
  background: linear-gradient(90deg, #ff6b6b, #ffa502);
}

.stat-fill.satisfaction {
  background: linear-gradient(90deg, #7bed9f, #2ed573);
}

.stat-value {
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 55px;
  text-align: right;
}

.bonus-info {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.15));
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffa502;
  text-align: center;
}

.topics-section {
  background: rgba(100, 200, 255, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(100, 200, 255, 0.3);
}

.topics-section h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: var(--accent);
}

.topic-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.topic-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-card);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.topic-item:hover {
  background: var(--bg-muted);
  transform: translateX(2px);
}

.topic-icon {
  font-size: 1.2rem;
}

.topic-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topic-label {
  font-weight: 600;
  font-size: 0.9rem;
}

.topic-expires {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.topic-arrow {
  color: var(--text-secondary);
}

.tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
}

.tabs button {
  flex: 1;
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.tabs button.active {
  background: var(--accent);
  color: white;
}

.materials-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.material-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-muted);
  border-radius: 8px;
  transition: all 0.2s;
}

.material-card.disabled {
  opacity: 0.5;
}

.material-icon {
  font-size: 1.5rem;
}

.material-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.material-label {
  font-weight: 600;
  font-size: 0.9rem;
}

.material-desc {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.material-stats {
  display: flex;
  gap: 0.75rem;
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.material-cost {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.cost {
  font-weight: 600;
  color: #ff6b6b;
  font-size: 0.85rem;
}

.cooldown {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.material-cost button {
  padding: 0.35rem 0.75rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.material-cost button:hover:not(:disabled) {
  background: var(--accent-hover);
}

.material-cost button:disabled {
  background: var(--text-secondary);
  cursor: not-allowed;
}

.history-section {
  max-height: 400px;
  overflow-y: auto;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.history-gain {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.empty-state {
  text-align: center;
  color: var(--text-secondary);
  padding: 2rem;
  font-size: 0.9rem;
}
</style>
