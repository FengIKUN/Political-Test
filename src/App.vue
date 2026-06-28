<template>
  <div class="app-wrapper">
    <div class="app-container">
      <header class="hero-header">
        <h1 class="main-title">政治光谱测试</h1>
        <p class="sub-title">The Political Spectrum</p>
      </header>

      <main class="glass-card">
        <!-- 1. 欢迎页 -->
        <div v-if="step === 'start'" class="view-start fade-in">
          <h2 class="section-title">定位你的政治倾向</h2>
          <p class="desc">
            本测试包含 <strong>{{ questionsData.length }}</strong> 个表述（而非问题），对你的政治立场进行量化分析。结果仅供参考，不代表任何官方立场。请根据你的真实想法作答。
            <br>
            请尽量明确表态，而非选择中立或不确定选项，以获得更准确的结果。
          </p>
          <button class="btn-primary" @click="startTest">开始测试</button>
        </div>

        <!-- 2. 答题页 -->
        <div v-else-if="step === 'quiz'" class="view-quiz fade-in">
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <div class="progress-text">
              {{ currentIndex + 1 }} / {{ questions.length }}
            </div>
          </div>
          
          <div class="question-header">
            <span class="category-badge">{{ currentQuestion.category }}</span>
          </div>
          
          <h3 class="question-text">{{ currentQuestion.text }}</h3>

          <div class="options-container">
            <button 
              v-for="opt in options" 
              :key="opt.label" 
              class="btn-option" 
              :class="opt.class"
              @click="handleAnswer(opt.multiplier)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- 3. 结果页 -->
        <div v-else-if="step === 'result'" class="view-result fade-in">
          <h2 class="section-title result-title">分析报告</h2>
          
          <CompassChart :econPercent="finalScores.econ" :socPercent="finalScores.soc" />

          <div class="result-stats">
            <div class="stat-box">
              <span class="stat-label">经济轴 (Left/Right)</span>
              <span class="stat-value">
                {{ finalScores.econ > 0 ? '+' : '' }}{{ finalScores.econ.toFixed(1) }}%
              </span>
            </div>
            <div class="stat-box">
              <span class="stat-label">社会轴 (Lib/Auth)</span>
              <span class="stat-value">
                {{ finalScores.soc > 0 ? '+' : '' }}{{ finalScores.soc.toFixed(1) }}%
              </span>
            </div>
          </div>

          <div class="ideology-box">
            <span class="ideology-label">相对倾向：</span>
            <span class="ideology-text">{{ getIdeology(finalScores.econ, finalScores.soc) }}</span>
          </div>

          <button class="btn-secondary" @click="restartTest">重新测试</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import questionsData from './data/questions.json'
import CompassChart from './components/CompassChart.vue'

const step = ref('start')
const questions = ref([])
const currentIndex = ref(0)
const userEconScore = ref(0)
const userSocScore = ref(0)

const options = [
  { label: '强烈同意', multiplier: 1.0, class: 'opt-strongly-agree' },
  { label: '同意', multiplier: 0.5, class: 'opt-agree' },
  { label: '中立 / 不确定', multiplier: 0.0, class: 'opt-neutral' },
  { label: '不同意', multiplier: -0.5, class: 'opt-disagree' },
  { label: '强烈不同意', multiplier: -1.0, class: 'opt-strongly-disagree' }
]

const currentQuestion = computed(() => questions.value[currentIndex.value])
const progressPercent = computed(() => ((currentIndex.value) / questions.value.length) * 100)

const startTest = () => {
  let shuffled = [...questionsData]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  questions.value = shuffled
  currentIndex.value = 0
  userEconScore.value = 0
  userSocScore.value = 0
  step.value = 'quiz'
}

const handleAnswer = (multiplier) => {
  const q = currentQuestion.value
  userEconScore.value += q.weights.econ * multiplier
  userSocScore.value += q.weights.soc * multiplier

  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  } else {
    step.value = 'result'
  }
}

const finalScores = computed(() => {
  let maxEcon = 0, maxSoc = 0
  questionsData.forEach(q => {
    maxEcon += Math.abs(q.weights.econ)
    maxSoc += Math.abs(q.weights.soc)
  })
  return {
    econ: (userEconScore.value / maxEcon) * 100,
    soc: (userSocScore.value / maxSoc) * 100
  }
})

const getIdeology = (econ, soc) => {
  const isCenter = Math.abs(econ) < 15 && Math.abs(soc) < 15
  if (isCenter) return "绝对中间派 (Centrist)"
  if (econ < 0 && soc > 0) return "威权左翼 (Auth-Left)"
  if (econ > 0 && soc > 0) return "保守右翼 (Auth-Right)"
  if (econ < 0 && soc < 0) return "自由左翼 (Lib-Left)"
  if (econ > 0 && soc < 0) return "自由意志右翼 (Lib-Right)"
  return "未知倾向"
}

const restartTest = () => step.value = 'start'
</script>

<style>
body {
  font-family: 'Inter', 'Helvetica Neue', 'PingFang SC', sans-serif;
  background: #f1f5f9;
  color: #1e293b;
  margin: 0;
  padding: 0;
}
.app-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 10px;
  box-sizing: border-box;
}

.app-container {
  width: 100%;
  max-width: 500px;
}

.hero-header { text-align: center; margin-bottom: 15px; }
.main-title { font-size: 22px; font-weight: 800; margin: 0 0 2px 0; letter-spacing: 1px; }
.sub-title { font-size: 11px; color: #64748b; text-transform: uppercase; margin: 0; letter-spacing: 2px; }

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid #cbd5e1;
  padding: 25px 30px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  text-align: center;
  border-radius: 0;
}

.fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 首页 */
.section-title { font-size: 18px; margin-top: 0; margin-bottom: 10px; color: #0f172a; }
.desc { font-size: 13px; line-height: 1.5; color: #475569; margin-bottom: 25px; }

/* 进度条 */
.progress-container { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
.progress-bar { flex-grow: 1; height: 6px; background-color: #e2e8f0; border-radius: 0; }
.progress-fill { height: 100%; background: #475569; transition: width 0.3s ease; border-radius: 0; }
.progress-text { font-size: 12px; font-weight: 600; color: #64748b; min-width: 40px; text-align: right; }

/* 题目区 */
.question-header { margin-bottom: 10px; text-align: left; }
.category-badge { background: #e2e8f0; color: #334155; padding: 2px 8px; font-size: 11px; border-radius: 0; }
.question-text { font-size: 16px; font-weight: 600; line-height: 1.5; color: #0f172a; margin: 0 0 20px 0; text-align: left; min-height: 48px; }

.options-container { display: flex; flex-direction: column; gap: 8px; }
.btn-option {
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-option:hover { background: #e2e8f0; transform: translateY(-1px); box-shadow: 2px 2px 0px #cbd5e1; }
.opt-strongly-agree:hover { background: #e6f4ea; border-color: #86efac; }
.opt-strongly-disagree:hover { background: #fce8e8; border-color: #fca5a5; }

.result-title { margin-bottom: 0px; }
.result-stats { display: flex; gap: 10px; margin-bottom: 15px; }
.stat-box { flex: 1; background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; border-radius: 0; }
.stat-label { display: block; font-size: 11px; color: #64748b; margin-bottom: 3px; }
.stat-value { font-size: 16px; font-weight: 700; font-family: monospace; color: #334155; }

.ideology-box { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 12px; margin-bottom: 20px; border-radius: 0; }
.ideology-label { font-size: 13px; color: #475569; }
.ideology-text { font-size: 16px; font-weight: 800; color: #0f172a; letter-spacing: 0.5px; }

.btn-primary, .btn-secondary {
  border-radius: 0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary { background: #0f172a; color: white; padding: 12px 24px; border: 1px solid #0f172a; width: 100%; }
.btn-primary:hover { background: #334155; box-shadow: 3px 3px 0px #94a3b8; transform: translate(-1px, -1px); }

.btn-secondary { background: white; color: #0f172a; padding: 10px 20px; border: 1px solid #0f172a; width: 100%; }
.btn-secondary:hover { background: #f1f5f9; box-shadow: 2px 2px 0px #0f172a; transform: translate(-1px, -1px); }

@media (max-width: 480px) {
  .glass-card { padding: 20px 15px; }
  .question-text { font-size: 15px; }
}
</style>