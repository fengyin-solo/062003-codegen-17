/**
 * 偶像养成事务所 — 全部数值规则集中配置
 * 调整平衡性时只需修改此文件
 */
export const GAME_CONFIG = {
  // ── 胜利 / 失败条件 ──
  victory: {
    targetGroups: 3,        // 需培养出道组合数
    totalDays: 1095,        // 3 年（天）
    requirePositiveProfit: true,
  },

  // ── 初始资源 ──
  initial: {
    money: 80000,
    fans: 200,
    traineeCount: 5,
    statMin: 18,
    statMax: 42,
    fatigue: 10,
    stress: 8,
  },

  // ── 五维属性键名 ──
  stats: ['vocal', 'dance', 'rap', 'looks', 'charm'],
  statLabels: {
    vocal: '唱功',
    dance: '舞蹈',
    rap: '说唱',
    looks: '颜值',
    charm: '魅力',
  },

  // ── 日程活动 ──
  activities: {
    vocal: {
      label: '声乐课',
      icon: '🎤',
      statGain: { vocal: [4, 7] },
      fatigue: [10, 14],
      stress: [2, 4],
      moneyCost: 400,
      requiresTraining: true,
    },
    dance: {
      label: '舞蹈课',
      icon: '💃',
      statGain: { dance: [4, 7] },
      fatigue: [12, 16],
      stress: [2, 4],
      moneyCost: 400,
      requiresTraining: true,
    },
    rap: {
      label: '说唱课',
      icon: '🎧',
      statGain: { rap: [4, 7] },
      fatigue: [10, 14],
      stress: [3, 5],
      moneyCost: 400,
      requiresTraining: true,
    },
    physical: {
      label: '体能训练',
      icon: '🏋️',
      statGain: { dance: [1, 3], looks: [0, 1] },
      fatigue: [6, 10],
      stress: [-2, 0],
      moneyCost: 250,
      requiresTraining: true,
    },
    rest: {
      label: '休息',
      icon: '😴',
      statGain: {},
      fatigue: [-28, -18],
      stress: [-10, -5],
      moneyCost: 0,
      requiresTraining: false,
    },
    pr: {
      label: '公关活动',
      icon: '📸',
      statGain: { charm: [2, 4], looks: [1, 3] },
      fatigue: [5, 8],
      stress: [6, 14],
      fansGain: [80, 250],
      moneyCost: 1200,
      requiresTraining: false,
    },
  },

  // ── 疲劳 / 压力阈值 ──
  thresholds: {
    fatigueExhausted: 75,   // 训练效果减半
    fatigueCollapse: 92,    // 强制休息
    stressHigh: 65,         // 训练效果 -20%
    stressBreakdown: 88,    // 当天无法训练
    statCap: 100,
  },

  // ── 每日运营成本 ──
  dailyCosts: {
    baseOperatingCost: 600,
    perTraineeCost: 250,
    perDebutedCost: 800,
    perGroupCost: 500,
  },

  // ── 周末内部评级 ──
  rating: {
    interval: 7,
    debutScoreThreshold: 58,  // 综合评分达标可出道
    minGroupSize: 2,
    maxGroupSize: 5,
    scoreWeights: {
      vocal: 0.22,
      dance: 0.22,
      rap: 0.16,
      looks: 0.2,
      charm: 0.2,
    },
  },

  // ── 单曲发行 ──
  single: {
    creationCost: 15000,
    baseSales: 800,
    statWeight: 0.45,
    fansWeight: 0.35,
    charmWeight: 0.2,
    revenuePerSale: 6,
    cooldownDays: 30,
  },

  // ── 练习生关系 ──
  relationships: {
    min: -100,
    max: 100,
    synergyThreshold: 55,       // 默契线
    competitionThreshold: -35,    // 竞争线
    synergyBonus: 0.25,           // 默契训练加成
    competitionStress: [12, 22],
    dailyDrift: [-3, 3],
    trainingTogether: [4, 9],
    statGapCompetition: 18,
    initialRange: [-15, 25],
  },

  // ── 随机事件 ──
  events: {
    dailyChance: 0.18,
    types: {
      negative_news: {
        label: '负面新闻',
        weight: 22,
        fansLoss: [150, 600],
        stressGain: [8, 18],
        description: '媒体曝出练习生训练期间发生冲突，粉丝舆论下滑。',
      },
      poaching: {
        label: '挖角危机',
        weight: 14,
        successChance: 0.28,
        description: '竞争对手试图挖走你旗下最有潜力的练习生！',
      },
      illness: {
        label: '生病',
        weight: 20,
        duration: [2, 4],
        statDecay: [1, 3],
        stressGain: [5, 10],
        description: '一名练习生身体不适，需要休养。',
      },
      inspiration: {
        label: '灵感爆发',
        weight: 22,
        statBoost: [6, 14],
        description: '一名练习生突然迸发出创作灵感，能力大幅提升！',
      },
      fan_surge: {
        label: '粉丝暴涨',
        weight: 22,
        fansGain: [300, 900],
        description: '一段练习室花絮意外走红，粉丝数激增！',
      },
    },
  },

  // ── 练习生名字池 ──
  names: [
    '林星遥', '苏晚晴', '陈予安', '顾念初', '沈知夏',
    '江月白', '陆清欢', '唐小满', '许未央', '韩鹿鸣',
    '方念慈', '宋时雨', '叶知秋', '周慕青', '赵星河',
  ],

  // ── 粉丝社群系统 ──
  community: {
    initialActivity: 30,
    initialSatisfaction: 50,
    maxActivity: 100,
    maxSatisfaction: 100,
    dailyDecay: [1, 3],
    activityToConversionRate: 0.15,
    satisfactionToConversionRate: 0.08,

    materials: {
      photo: {
        label: '日常照片',
        icon: '📸',
        description: '发布练习生日常照片',
        cost: 800,
        activityGain: [8, 15],
        satisfactionGain: [3, 8],
        fansGain: [50, 120],
        cooldownDays: 1,
      },
      vlog: {
        label: 'Vlog 视频',
        icon: '🎬',
        description: '发布练习生日常 Vlog',
        cost: 3000,
        activityGain: [20, 35],
        satisfactionGain: [10, 18],
        fansGain: [150, 300],
        cooldownDays: 3,
      },
      behind_scenes: {
        label: '幕后花絮',
        icon: '🎥',
        description: '发布训练/录制幕后花絮',
        cost: 2000,
        activityGain: [15, 25],
        satisfactionGain: [8, 15],
        fansGain: [100, 200],
        cooldownDays: 2,
      },
      cover_dance: {
        label: '翻跳视频',
        icon: '💃',
        description: '发布热门歌曲翻跳',
        cost: 2500,
        activityGain: [18, 30],
        satisfactionGain: [12, 20],
        fansGain: [180, 350],
        cooldownDays: 2,
      },
      live_stream: {
        label: '直播互动',
        icon: '📱',
        description: '开启粉丝互动直播',
        cost: 1500,
        activityGain: [25, 40],
        satisfactionGain: [15, 25],
        fansGain: [200, 400],
        cooldownDays: 4,
      },
    },

    topics: {
      dailyChance: 0.35,
      maxActiveTopics: 3,
      responseWindow: 2,
      types: {
        style_preference: {
          label: '风格偏好',
          icon: '🎨',
          description: '粉丝在讨论下次回归的风格偏好',
          options: [
            { text: '甜美可爱风', activityBonus: [10, 18], satisfactionBonus: [8, 15], revenueBonus: 0.1 },
            { text: '酷帅飒爽风', activityBonus: [12, 20], satisfactionBonus: [6, 12], revenueBonus: 0.12 },
            { text: '青春活力风', activityBonus: [8, 15], satisfactionBonus: [10, 18], revenueBonus: 0.08 },
          ],
        },
        member_favorite: {
          label: '成员喜好',
          icon: '💕',
          description: '粉丝在投票选出最爱的成员',
          requireTrainee: true,
          options: [
            { text: '公开互动支持', activityBonus: [15, 25], satisfactionBonus: [12, 20], revenueBonus: 0.15 },
            { text: '发布专属物料', activityBonus: [12, 22], satisfactionBonus: [15, 25], revenueBonus: 0.18 },
            { text: '保持神秘感', activityBonus: [5, 10], satisfactionBonus: [-5, 5], revenueBonus: 0.05 },
          ],
        },
        content_request: {
          label: '内容诉求',
          icon: '📝',
          description: '粉丝在请求特定类型的内容',
          options: [
            { text: '更多舞蹈练习', activityBonus: [10, 18], satisfactionBonus: [10, 18], revenueBonus: 0.1 },
            { text: '更多唱歌Cover', activityBonus: [8, 15], satisfactionBonus: [12, 20], revenueBonus: 0.08 },
            { text: '更多日常趣事', activityBonus: [12, 20], satisfactionBonus: [8, 15], revenueBonus: 0.1 },
          ],
        },
        event_suggestion: {
          label: '活动建议',
          icon: '🎉',
          description: '粉丝在提议线下/线上活动',
          options: [
            { text: '粉丝见面会', activityBonus: [20, 35], satisfactionBonus: [18, 28], revenueBonus: 0.2, cost: 8000 },
            { text: '线上签售会', activityBonus: [15, 28], satisfactionBonus: [15, 25], revenueBonus: 0.15, cost: 3000 },
            { text: '生日应援活动', activityBonus: [18, 30], satisfactionBonus: [20, 30], revenueBonus: 0.18, cost: 5000 },
          ],
        },
      },
    },

    conversions: {
      merchandise: {
        label: '周边销售',
        icon: '🛍️',
        description: '官方周边商品销售',
        baseRevenue: 2000,
        activityMultiplier: 0.8,
        satisfactionMultiplier: 0.5,
        cooldownDays: 7,
      },
      concert_ticket: {
        label: '演唱会门票',
        icon: '🎫',
        description: '演唱会/见面会门票预售',
        baseRevenue: 15000,
        activityMultiplier: 1.2,
        satisfactionMultiplier: 0.8,
        requireDebut: true,
        cooldownDays: 60,
      },
      digital_single: {
        label: '数字单曲',
        icon: '🎵',
        description: '数字音乐平台销售',
        baseRevenue: 5000,
        activityMultiplier: 1.0,
        satisfactionMultiplier: 0.7,
        requireDebut: true,
        cooldownDays: 30,
      },
      brand_deal: {
        label: '品牌代言',
        icon: '🤝',
        description: '品牌合作与代言机会',
        baseRevenue: 25000,
        activityMultiplier: 1.5,
        satisfactionMultiplier: 1.0,
        requireDebut: true,
        cooldownDays: 90,
      },
      membership: {
        label: '会员订阅',
        icon: '⭐',
        description: '官方粉丝俱乐部会员',
        baseRevenue: 3000,
        activityMultiplier: 0.6,
        satisfactionMultiplier: 0.9,
        cooldownDays: 30,
      },
    },
  },

  // ── 存档 ──
  storage: {
    savesKey: 'idol-agency-saves-v1',
    themeKey: 'idol-agency-theme',
    maxSlots: 5,
  },
}
