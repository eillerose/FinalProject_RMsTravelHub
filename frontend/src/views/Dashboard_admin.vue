<template>
  <div class="dashboard">
    <h1 class="dashboard-title">RM's Travel and Tours Dashboard</h1>
    <main class="dashboard-content">
      <!-- Key Metrics -->
      <section class="metrics-grid">
        <div v-for="metric in metrics" :key="metric.title" class="metric-card">
          <h3 class="metric-title">{{ metric.title }}</h3>
          <p :class="['metric-value', metric.class]">{{ metric.value }}</p>
          <p :class="['metric-change', metric.trend === 'up' ? 'up' : 'down']">
            <span>{{ metric.trend === 'up' ? '↑' : '↓' }}</span>
            {{ metric.change }}% from last month
          </p>
        </div>
      </section>
      
      <!-- Charts Grid -->
      <div class="charts-grid">
        <!-- Pie Chart Section -->
        <section class="chart-section">
          <h3 class="chart-title">Booking Distribution</h3>
          <div class="chart-wrapper">
            <svg viewBox="0 0 200 200" class="pie-chart">
              <g transform="translate(100, 100)">
                <path v-for="(segment, index) in pieSegments" 
                      :key="index"
                      :d="segment.path"
                      :fill="segment.color"
                      class="pie-segment" />
              </g>
            </svg>
            <div class="chart-legend">
              <div v-for="item in bookingDistribution" 
                   :key="item.label" 
                   class="legend-item">
                <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
                <span class="legend-label">{{ item.label }}: {{ item.value }}%</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Line Chart Section -->
        <section class="chart-section">
          <h3 class="chart-title">Monthly Bookings</h3>
          <div class="chart-wrapper">
            <svg viewBox="0 0 300 200" class="line-chart">
              <!-- Grid -->
              <g class="grid">
                <line v-for="n in 5" 
                      :key="n"
                      x1="40" 
                      :x2="280" 
                      :y1="40 * n" 
                      :y2="40 * n" 
                      class="grid-line" />
              </g>
              
              <!-- Line -->
              <path :d="monthlyBookingsPath" 
                    class="line-path" />
              
              <!-- Points -->
              <g v-for="(point, index) in monthlyBookingPoints" 
                 :key="index" 
                 class="data-point-group">
                <circle :cx="point.x" 
                        :cy="point.y" 
                        r="4" 
                        class="data-point" />
                <text :x="point.x" 
                      :y="180" 
                      class="axis-label">
                  {{ monthlyBookings[index].month }}
                </text>
              </g>
            </svg>
          </div>
        </section>

        <!-- Bar Chart Section -->
        <section class="chart-section">
          <h3 class="chart-title">Revenue by Package</h3>
          <div class="chart-wrapper">
            <svg viewBox="0 0 300 200" class="bar-chart">
              <g v-for="(bar, index) in packageBars" 
                 :key="index" 
                 class="bar-group">
                <rect :x="bar.x"
                      :y="bar.y"
                      :width="bar.width"
                      :height="bar.height"
                      class="bar" />
                <text :x="bar.x + bar.width/2"
                      :y="180"
                      class="axis-label">
                  {{ packageRevenue[index].name }}
                </text>
                <text :x="bar.x + bar.width/2"
                      :y="bar.y - 5"
                      class="value-label">
                  ₱{{ (packageRevenue[index].revenue/1000).toFixed(0) }}k
                </text>
              </g>
            </svg>
          </div>
        </section>
      </div>
      
      <div class="info-grid">
        <!-- Upcoming Tours -->
        <section class="info-card">
          <h3 class="info-title">Upcoming Tours</h3>
          <div class="tour-list">
            <div v-for="tour in upcomingTours" 
                 :key="tour.id" 
                 class="tour-item">
              <div class="tour-info">
                <p class="tour-destination">{{ tour.destination }}</p>
                <p class="tour-date">{{ formatDate(tour.date) }}</p>
              </div>
              <span :class="['tour-status', tour.status.toLowerCase()]">
                {{ tour.status }}
              </span>
            </div>
          </div>
        </section>
        
        <!-- Recent Activities -->
        <section class="info-card">
          <h3 class="info-title">Recent Activities</h3>
          <div class="activity-list">
            <div v-for="activity in recentActivities" 
                 :key="activity.id" 
                 class="activity-item">
              <div class="activity-icon">
                <CalendarIcon class="icon" />
              </div>
              <div class="activity-info">
                <p class="activity-title">{{ activity.title }}</p>
                <p class="activity-time">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { CalendarIcon } from 'lucide-vue-next'

// Metrics Data
const metrics = ref([
  { title: 'Total Bookings', value: '14', class: 'blue', trend: 'up', change: 5 },
  { title: 'Revenue', value: '₱8,000', class: 'green', trend: 'up', change: 12 },
  { title: 'Active Tours', value: '6', class: 'yellow', trend: 'up', change: 3 },
  { title: 'Customer Satisfaction', value: '4.5/5', class: 'purple', trend: 'up', change: 1 }
])

// Chart Data
const bookingDistribution = ref([
  { label: 'Completed', value: 45, color: '#10b981' },
  { label: 'Pending', value: 30, color: '#f59e0b' },
  { label: 'Cancelled', value: 25, color: '#ef4444' }
])

const monthlyBookings = ref([
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 19 },
  { month: 'Mar', count: 15 },
  { month: 'Apr', count: 25 },
  { month: 'May', count: 32 },
  { month: 'Jun', count: 28 }
])

const packageRevenue = ref([
  { name: 'Basic', revenue: 5000 },
  { name: 'Standard', revenue: 12000 },
  { name: 'Premium', revenue: 20000 },
  { name: 'Luxury', revenue: 35000 }
])

// Sample Data
const upcomingTours = ref([
  {
    id: 1,
    destination: 'Agbing Seaside View Resort',
    date: new Date('2024-01-20'),
    status: 'Pending'
  },
  {
    id: 2,
    destination: 'Luckeh 5J Beach Resort',
    date: new Date('2024-01-25'),
    status: 'Approved'
  }
])

const recentActivities = ref([
  {
    id: 1,
    title: 'New booking: Agbing Seaside View Resort',
    time: 'Yesterday'
  },
  {
    id: 2,
    title: 'New booking: Agbing Seaside View Resort',
    time: 'Yesterday'
  },
  {
    id: 3,
    title: 'New booking: Luckeh 5J Beach Resort',
    time: 'Yesterday'
  }
])

// Chart Computations
const pieSegments = computed(() => {
  const total = bookingDistribution.value.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0
  
  return bookingDistribution.value.map(item => {
    const angle = (item.value / total) * Math.PI * 2
    const startAngle = currentAngle
    currentAngle += angle
    
    const x1 = Math.cos(startAngle) * 80
    const y1 = Math.sin(startAngle) * 80
    const x2 = Math.cos(currentAngle) * 80
    const y2 = Math.sin(currentAngle) * 80
    
    const largeArcFlag = angle > Math.PI ? 1 : 0
    
    const path = `
      M 0 0
      L ${x1} ${y1}
      A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `
    
    return {
      path,
      color: item.color
    }
  })
})

const monthlyBookingPoints = computed(() => {
  const maxCount = Math.max(...monthlyBookings.value.map(b => b.count))
  const width = 240
  const height = 160
  const padding = 40
  
  return monthlyBookings.value.map((booking, index) => {
    const x = padding + (index * (width - padding) / (monthlyBookings.value.length - 1))
    const y = height - (booking.count / maxCount * (height - padding))
    return { x, y }
  })
})

const monthlyBookingsPath = computed(() => {
  if (monthlyBookingPoints.value.length === 0) return ''
  
  return 'M ' + monthlyBookingPoints.value
    .map(point => `${point.x} ${point.y}`)
    .join(' L ')
})

const packageBars = computed(() => {
  const maxRevenue = Math.max(...packageRevenue.value.map(p => p.revenue))
  const barWidth = 40
  const gap = 20
  const height = 160
  const padding = 40
  
  return packageRevenue.value.map((pkg, index) => {
    const x = padding + index * (barWidth + gap)
    const barHeight = (pkg.revenue / maxRevenue) * (height - padding)
    return {
      x,
      y: height - barHeight,
      width: barWidth,
      height: barHeight
    }
  })
})

// Utility Functions
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  background-color: #f8fafc;
  min-height: 100vh;
}

.dashboard-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2rem;
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.metric-title {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 1.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.metric-value.blue { color: #3b82f6; }
.metric-value.green { color: #10b981; }
.metric-value.yellow { color: #f59e0b; }
.metric-value.purple { color: #8b5cf6; }

.metric-change {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.metric-change.up { color: #10b981; }
.metric-change.down { color: #ef4444; }

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.chart-wrapper {
  position: relative;
  height: 300px;
}

/* Pie Chart */
.pie-chart {
  width: 100%;
  height: 100%;
}

.pie-segment {
  transition: transform 0.2s;
  cursor: pointer;
}

.pie-segment:hover {
  transform: translateX(2px) translateY(2px);
}

.chart-legend {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

/* Line Chart */
.line-chart {
  width: 100%;
  height: 100%;
}

.grid-line {
  stroke: #e2e8f0;
  stroke-width: 1;
}

.line-path {
  fill: none;
  stroke: #3b82f6;
  stroke-width: 2;
  animation: drawLine 2s ease-out forwards;
}

.data-point {
  fill: #3b82f6;
  transition: r 0.2s;
}

.data-point:hover {
  transition: r 6;
}

/* Bar Chart */
.bar-chart {
  width: 100%;
  height: 100%;
}

.bar {
  fill: #10b981;
  transition: opacity 0.2s;
  animation: growBar 1s ease-out forwards;
}

.bar:hover {
  opacity: 0.8;
}

.axis-label {
  fill: #64748b;
  font-size: 0.75rem;
  text-anchor: middle;
}

.value-label {
  fill: #64748b;
  font-size: 0.75rem;
  text-anchor: middle;
  font-weight: 500;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

/* Tours */
.tour-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tour-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.tour-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.tour-destination {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.tour-date {
  font-size: 0.875rem;
  color: #64748b;
}

.tour-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
}

.tour-status.pending {
  background-color: #fef3c7;
  color: #92400e;
}

.tour-status.approved {
  background-color: #d1fae5;
  color: #065f46;
}

/* Activities */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.activity-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: #d1fae5;
  border-radius: 9999px;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #059669;
}

.activity-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.75rem;
  color: #64748b;
}

@keyframes drawLine {
  from {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dasharray: 1000;
    stroke-dashoffset: 0;
  }
}

@keyframes growBar {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }
  
  .dashboard-title {
    font-size: 1.5rem;
  }
  
  .chart-wrapper {
    height: 250px;
  }
}
</style>