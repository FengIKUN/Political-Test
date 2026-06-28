<template>
  <div class="chart-wrapper">
    <div class="compass">
      <!-- 4个象限背景 (低饱和度直角) -->
      <div class="quadrants">
        <div class="quadrant q-auth-left"></div>
        <div class="quadrant q-auth-right"></div>
        <div class="quadrant q-lib-left"></div>
        <div class="quadrant q-lib-right"></div>
      </div>

      <!-- 网格线覆盖层 -->
      <div class="grid-overlay"></div>

      <!-- 主坐标轴 -->
      <div class="axis x-axis"></div>
      <div class="axis y-axis"></div>

      <!-- 坐标轴悬浮标签 (直角框) -->
      <div class="label label-top">威权 (Auth)</div>
      <div class="label label-bottom">自由 (Lib)</div>
      <div class="label label-left">左派 (Left)</div>
      <div class="label label-right">右派 (Right)</div>

      <!-- 经典流派参考点 -->
      <div 
        v-for="(refPt, index) in referencePoints" 
        :key="index"
        class="ref-point"
        :style="{ left: getMappedX(refPt.econ) + '%', top: getMappedY(refPt.soc) + '%' }"
      >
        <div class="ref-dot"></div>
        <span class="ref-text" :class="refPt.align">{{ refPt.name }}</span>
      </div>

      <!-- 用户得分落点 (直角呼吸方块) -->
      <div 
        class="user-point"
        :style="{ left: mappedX + '%', top: mappedY + '%' }"
      >
        <div class="pulse-ring"></div>
        <div class="core-dot"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  econPercent: { type: Number, required: true },
  socPercent: { type: Number, required: true }
})

const getMappedX = (val) => (val + 100) / 2
const getMappedY = (val) => (100 - val) / 2

const mappedX = computed(() => getMappedX(props.econPercent))
const mappedY = computed(() => getMappedY(props.socPercent))

const referencePoints = [
  { name: '共产主义', econ: -90, soc: 70, align: 'bottom-right' },
  { name: '社会民主主义', econ: -45, soc: -20, align: 'bottom-right' },
  { name: '民主社会主义', econ: -70, soc: -50, align: 'top-left' },
  { name: '古典自由主义', econ: 60, soc: -40, align: 'top-left' },
  { name: '保守主义', econ: 50, soc: 60, align: 'bottom-left' },
  { name: '无政府资本主义', econ: 90, soc: -90, align: 'top-left' },
  { name: '法西斯主义', econ: 10, soc: 90, align: 'bottom-left' }
]
</script>

<style scoped>
.chart-wrapper {
  display: flex;
  justify-content: center;
  margin: 15px 0;
}

.compass {
  position: relative;
  width: 100%;
  max-width: 260px;
  aspect-ratio: 1 / 1;
  background-color: #fff;
  box-shadow: 0 8px 20px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #cbd5e1;
}

.quadrants {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
}
.quadrant { width: 50%; height: 50%; }
.q-auth-left { background-color: #e8d0d0; }
.q-auth-right { background-color: #d0dce8; }
.q-lib-left { background-color: #d0e8d5; }
.q-lib-right { background-color: #e8e5d0; }

.grid-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px);
  background-size: 10% 10%;
  pointer-events: none;
}

.axis { position: absolute; background-color: rgba(0,0,0,0.5); }
.x-axis { top: 50%; left: 0; width: 100%; height: 1px; }
.y-axis { top: 0; left: 50%; width: 1px; height: 100%; }

.label {
  position: absolute;
  font-size: 10px;
  font-weight: 600;
  color: #475569;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border: 1px solid #cbd5e1;
  white-space: nowrap;
  z-index: 5;
}
.label-top { top: -10px; left: 50%; transform: translateX(-50%); }
.label-bottom { bottom: -10px; left: 50%; transform: translateX(-50%); }
.label-left { left: -15px; top: 50%; transform: translateY(-50%); }
.label-right { right: -15px; top: 50%; transform: translateY(-50%); }

.ref-point {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 8;
}
.ref-dot {
  width: 6px;
  height: 6px;
  background-color: #94a3b8;
  border: 1px solid #fff;
}
.ref-text {
  position: absolute;
  font-size: 9px;
  color: #64748b;
  white-space: nowrap;
  transform: scale(0.9);
}
.bottom-right { top: 8px; left: 8px; }
.top-left { bottom: 8px; right: 8px; }
.bottom-left { top: 8px; right: 8px; }

.user-point {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.core-dot {
  width: 12px;
  height: 12px;
  background-color: #0f172a;
  border: 2px solid #ffffff;
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
.pulse-ring {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 2px solid #0f172a;
  animation: pulse-square 2s infinite cubic-bezier(0.1, 0.5, 0.9, 0.5);
  z-index: 1;
}

@keyframes pulse-square {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.6); opacity: 0; }
}
.quadrants {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
}
.quadrant { width: 50%; height: 50%; }
.q-auth-left { background-color: #e8d0d0; }  /* 灰红 */
.q-auth-right { background-color: #d0dce8; } /* 灰蓝 */
.q-lib-left { background-color: #d0e8d5; }   /* 灰绿 */
.q-lib-right { background-color: #e8e5d0; }  /* 灰黄 */

/* 细网格背景 */
.grid-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px);
  background-size: 10% 10%;
  pointer-events: none;
}

/* 十字主坐标轴 */
.axis { position: absolute; background-color: rgba(0,0,0,0.5); }
.x-axis { top: 50%; left: 0; width: 100%; height: 1px; }
.y-axis { top: 0; left: 50%; width: 1px; height: 100%; }

/* 坐标轴浮雕标签 (直角) */
.label {
  position: absolute;
  font-size: 10px; /* 缩小字号 */
  font-weight: 600;
  color: #475569;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border: 1px solid #cbd5e1;
  white-space: nowrap;
  z-index: 5;
}
.label-top { top: -10px; left: 50%; transform: translateX(-50%); }
.label-bottom { bottom: -10px; left: 50%; transform: translateX(-50%); }
.label-left { left: -15px; top: 50%; transform: translateY(-50%); }
.label-right { right: -15px; top: 50%; transform: translateY(-50%); }

/* 参考点样式 (细小灰度方块) */
.ref-point {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 8;
}
.ref-dot {
  width: 6px;
  height: 6px;
  background-color: #94a3b8;
  border: 1px solid #fff;
}
.ref-text {
  position: absolute;
  font-size: 9px;
  color: #64748b;
  white-space: nowrap;
  transform: scale(0.9);
}
/* 参考点文字位置调整，防遮挡 */
.bottom-right { top: 8px; left: 8px; }
.top-left { bottom: 8px; right: 8px; }
.bottom-left { top: 8px; right: 8px; }

/* 炫酷的用户落点 (直角) */
.user-point {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.core-dot {
  width: 12px;
  height: 12px;
  background-color: #0f172a;
  border: 2px solid #ffffff;
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
/* 直角呼吸框动效 */
.pulse-ring {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 2px solid #0f172a;
  animation: pulse-square 2s infinite cubic-bezier(0.1, 0.5, 0.9, 0.5);
  z-index: 1;
}

@keyframes pulse-square {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.6); opacity: 0; }
}
</style>