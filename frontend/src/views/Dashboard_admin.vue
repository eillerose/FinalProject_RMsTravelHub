<template>
  <div class="dashboard">
    <h1>Travel Agency Dashboard</h1>
    
    <!-- Key Metrics -->
    <div class="metrics">
      <div v-for="metric in metrics" :key="metric.title" class="metric-card">
        <h2>{{ metric.title }}</h2>
        <p :class="['value', metric.class]">{{ metric.value }}</p>
        <p :class="['change', metric.trend === 'up' ? 'up' : 'down']">
          <span>{{ metric.trend === 'up' ? '↑' : '↓' }}</span>
          {{ metric.change }}% from last month
        </p>
      </div>
    </div>
    
    <!-- Booking Trends Chart -->
    <div class="chart-container">
      <h2>Booking Trends</h2>
      <svg class="chart" viewBox="0 0 300 100">
        <polyline
          class="chart-line"
          fill="none"
          stroke="#0ea5e9"
          stroke-width="2"
          points="0,100 50,70 100,80 150,40 200,50 250,20 300,40"
        />
        <g>
          <circle class="chart-dot" cx="0" cy="100" r="3" fill="#0ea5e9" />
          <circle class="chart-dot" cx="50" cy="70" r="3" fill="#0ea5e9" />
          <circle class="chart-dot" cx="100" cy="80" r="3" fill="#0ea5e9" />
          <circle class="chart-dot" cx="150" cy="40" r="3" fill="#0ea5e9" />
          <circle class="chart-dot" cx="200" cy="50" r="3" fill="#0ea5e9" />
          <circle class="chart-dot" cx="250" cy="20" r="3" fill="#0ea5e9" />
          <circle class="chart-dot" cx="300" cy="40" r="3" fill="#0ea5e9" />
        </g>
        <g class="chart-labels">
          <text x="0" y="115" text-anchor="middle">Jan</text>
          <text x="50" y="115" text-anchor="middle">Feb</text>
          <text x="100" y="115" text-anchor="middle">Mar</text>
          <text x="150" y="115" text-anchor="middle">Apr</text>
          <text x="200" y="115" text-anchor="middle">May</text>
          <text x="250" y="115" text-anchor="middle">Jun</text>
          <text x="300" y="115" text-anchor="middle">Jul</text>
        </g>
      </svg>
    </div>
    
    <div class="info-grid">
      <!-- Upcoming Tours -->
      <div class="info-card">
        <h2>Upcoming Tours</h2>
        <ul class="tour-list">
          <li v-for="tour in upcomingTours" :key="tour.id" class="tour-item">
            <div>
              <p class="tour-destination">{{ tour.destination }}</p>
              <p class="tour-date">{{ tour.date }}</p>
            </div>
            <span :class="['tour-status', tour.status.toLowerCase()]">
              {{ tour.status }}
            </span>
          </li>
        </ul>
      </div>
      
      <!-- Recent Activities -->
      <div class="info-card">
        <h2>Recent Activities</h2>
        <ul class="activity-list">
          <li v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div :class="['activity-icon', activity.iconColor]">
              <component :is="activity.icon" />
            </div>
            <div class="activity-details">
              <p class="activity-description">{{ activity.description }}</p>
              <p class="activity-timestamp">{{ activity.timestamp }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UserIcon, CalendarIcon, DollarSignIcon, GlobeIcon } from 'lucide-vue-next'

const metrics = ref([
  { title: 'Total Bookings', value: '1,234', class: 'blue', trend: 'up', change: 5 },
  { title: 'Revenue', value: '$56,789', class: 'green', trend: 'up', change: 12 },
  { title: 'Active Tours', value: '23', class: 'yellow', trend: 'up', change: 3 },
  { title: 'Customer Satisfaction', value: '4.8/5', class: 'purple', trend: 'down', change: 1 },
])

const upcomingTours = ref([
  { id: 1, destination: 'Paris, France', date: 'June 15, 2024', status: 'Confirmed' },
  { id: 2, destination: 'Tokyo, Japan', date: 'July 1, 2024', status: 'Pending' },
  { id: 3, destination: 'New York, USA', date: 'July 10, 2024', status: 'Confirmed' },
  { id: 4, destination: 'Sydney, Australia', date: 'August 5, 2024', status: 'Pending' },
])

const recentActivities = ref([
  { id: 1, description: 'New booking: Rome Tour', timestamp: '2 hours ago', icon: CalendarIcon, iconColor: 'green' },
  { id: 2, description: 'Customer feedback received', timestamp: '5 hours ago', icon: UserIcon, iconColor: 'blue' },
  { id: 3, description: 'Payment processed: $1,299', timestamp: '1 day ago', icon: DollarSignIcon, iconColor: 'yellow' },
  { id: 4, description: 'New tour added: Barcelona', timestamp: '2 days ago', icon: GlobeIcon, iconColor: 'purple' },
])
</script>

<style scoped>
.dashboard {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f3f4f6;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 20px;
}

h2 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.metric-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.metric-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.value {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
}

.value.blue { color: #2563eb; }
.value.green { color: #10b981; }
.value.yellow { color: #d97706; }
.value.purple { color: #7c3aed; }

.change {
  font-size: 14px;
}

.change.up { color: #10b981; }
.change.down { color: #ef4444; }

.chart-container, .info-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart {
  width: 100%;
  height: 200px;
}

.chart-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 2s ease-out forwards;
}

.chart-dot {
  opacity: 0;
  animation: fadeIn 0.3s ease-out forwards;
}

.chart-labels {
  font-size: 12px;
  fill: #6b7280;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.tour-list, .activity-list {
  list-style-type: none;
  padding: 0;
}

.tour-item, .activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.tour-destination {
  font-weight: 600;
  color: #111827;
}

.tour-date {
  font-size: 14px;
  color: #6b7280;
}

.tour-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 9999px;
}

.tour-status.confirmed {
  background-color: #d1fae5;
  color: #065f46;
}

.tour-status.pending {
  background-color: #fef3c7;
  color: #92400e;
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
}

.activity-icon.green { background-color: #d1fae5; color: #059669; }
.activity-icon.blue { background-color: #dbeafe; color: #2563eb; }
.activity-icon.yellow { background-color: #fef3c7; color: #d97706; }
.activity-icon.purple { background-color: #ede9fe; color: #7c3aed; }

.activity-details {
  flex-grow: 1;
}

.activity-description {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.activity-timestamp {
  font-size: 12px;
  color: #6b7280;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>