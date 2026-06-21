<template>
  <div class="game-view">
    <GameHeader
      :state="state"
      :days-left="daysLeft"
      :profit="profit"
      :theme="theme"
      @back="$emit('back')"
      @toggle-theme="$emit('toggle-theme')"
    />

    <div class="game-body">
      <aside class="sidebar">
        <div class="trainee-grid">
          <TraineeCard
            v-for="t in activeTrainees"
            :key="t.id"
            :trainee="t"
            :score="calcScore(t)"
          />
        </div>
      </aside>

      <main class="main-panel">
        <div class="tabs community-tabs">
          <button
            v-for="tab in mainTabs"
            :key="tab.key"
            :class="{ active: activeMainTab === tab.key }"
            @click="activeMainTab = tab.key"
          >
            {{ tab.label }}
            <span v-if="tab.key === 'community' && state.community.topics.length > 0" class="tab-badge">
              {{ state.community.topics.length }}
            </span>
          </button>
        </div>

        <SchedulePanel
          v-if="activeMainTab === 'schedule'"
          :trainees="activeTrainees"
          :schedule="state.schedule"
          :can-end="canEndDay"
          @set="(id, act) => $emit('set-schedule', id, act)"
          @clear="$emit('clear-schedule')"
          @end-day="$emit('end-day')"
        />

        <CommunityPanel
          v-if="activeMainTab === 'community'"
          :community="state.community"
          :current-day="state.day"
          :money="state.money"
          @publish="onPublishMaterial"
          @show-topic="showTopicModal"
        />

        <DayLog :logs="state.logs" />
      </main>

      <aside class="right-panel">
        <GroupsPanel
          :groups="state.groups"
          :trainees="state.trainees"
          :money="state.money"
          @release="(id) => $emit('release-single', id)"
        />
        <ConversionStats
          :community="state.community"
          :current-day="state.day"
          :has-debut="state.groups.length > 0"
          @trigger="onTriggerConversion"
        />
        <RelationshipPanel
          :trainees="state.trainees"
          :relationships="state.relationships"
        />
      </aside>
    </div>

    <RatingModal
      v-if="state.pendingRating && state.gameStatus === 'playing'"
      :results="ratingResults"
      @close="$emit('dismiss-rating')"
      @debut="showDebut = true"
    />

    <DebutModal
      v-if="showDebut"
      :candidates="ratingResults"
      @close="showDebut = false"
      @confirm="onDebut"
    />

    <EventModal
      v-if="state.pendingEvent"
      :event="state.pendingEvent"
      @resolve="(keep) => $emit('resolve-poaching', keep)"
    />

    <TopicResponseModal
      v-if="activeTopic"
      :topic="activeTopic"
      :current-day="state.day"
      :money="state.money"
      :trainees="state.trainees"
      @close="activeTopic = null"
      @respond="onRespondTopic"
    />

    <GameOverModal
      v-if="state.gameStatus !== 'playing'"
      :status="state.gameStatus"
      :state="state"
      :profit="profit"
      @back="$emit('back')"
    />

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GameHeader from './GameHeader.vue'
import TraineeCard from './TraineeCard.vue'
import SchedulePanel from './SchedulePanel.vue'
import DayLog from './DayLog.vue'
import GroupsPanel from './GroupsPanel.vue'
import RelationshipPanel from './RelationshipPanel.vue'
import RatingModal from './RatingModal.vue'
import DebutModal from './DebutModal.vue'
import EventModal from './EventModal.vue'
import GameOverModal from './GameOverModal.vue'
import CommunityPanel from './CommunityPanel.vue'
import TopicResponseModal from './TopicResponseModal.vue'
import ConversionStats from './ConversionStats.vue'

const props = defineProps({
  state: Object,
  activeTrainees: Array,
  daysLeft: Number,
  profit: Number,
  theme: String,
  canEndDay: Boolean,
  ratingResults: Array,
  calcScore: Function,
})

const emit = defineEmits([
  'back',
  'toggle-theme',
  'set-schedule',
  'clear-schedule',
  'end-day',
  'dismiss-rating',
  'debut',
  'resolve-poaching',
  'release-single',
  'publish-material',
  'respond-topic',
  'trigger-conversion',
])

const mainTabs = [
  { key: 'schedule', label: '📅 日程安排' },
  { key: 'community', label: '💬 粉丝社群' },
]

const activeMainTab = ref('schedule')
const showDebut = ref(false)
const activeTopic = ref(null)
const toast = ref('')

function onDebut(memberIds, groupName) {
  emit('debut', memberIds, groupName, (result) => {
    if (result?.success) {
      showDebut.value = false
      toast.value = '出道成功！'
      setTimeout(() => { toast.value = '' }, 2500)
    } else if (result?.message) {
      toast.value = result.message
      setTimeout(() => { toast.value = '' }, 3000)
    }
  })
}

function showTopicModal(topic) {
  activeTopic.value = topic
}

function onPublishMaterial(type) {
  emit('publish-material', type, (result) => {
    if (result?.success) {
      toast.value = '物料发布成功！'
      setTimeout(() => { toast.value = '' }, 2000)
    } else if (result?.message) {
      toast.value = result.message
      setTimeout(() => { toast.value = '' }, 3000)
    }
  })
}

function onRespondTopic(topicId, optionIndex) {
  emit('respond-topic', topicId, optionIndex, (result) => {
    if (result?.success) {
      activeTopic.value = null
      toast.value = '话题回应成功！'
      setTimeout(() => { toast.value = '' }, 2000)
    } else if (result?.message) {
      toast.value = result.message
      setTimeout(() => { toast.value = '' }, 3000)
    }
  })
}

function onTriggerConversion(type) {
  emit('trigger-conversion', type, (result) => {
    if (result?.success) {
      toast.value = `转化成功！收入 ¥${result.revenue.toLocaleString()}`
      setTimeout(() => { toast.value = '' }, 3000)
    } else if (result?.message) {
      toast.value = result.message
      setTimeout(() => { toast.value = '' }, 3000)
    }
  })
}
</script>

<style scoped>
.game-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.game-body {
  display: grid;
  grid-template-columns: 1fr 1.1fr 0.9fr;
  gap: 1rem;
  padding: 1rem;
  flex: 1;
}

@media (max-width: 1100px) {
  .game-body {
    grid-template-columns: 1fr;
  }
}

.sidebar .trainee-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.main-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.community-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
}

.community-tabs button {
  flex: 1;
  padding: 0.6rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.community-tabs button.active {
  background: var(--accent);
  color: white;
}

.tab-badge {
  background: #ff6b6b;
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-card);
  border: 1px solid var(--accent);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  z-index: 200;
  box-shadow: var(--shadow);
}
</style>
