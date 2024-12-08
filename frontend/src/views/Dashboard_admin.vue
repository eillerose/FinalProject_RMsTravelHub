<template>
      <h1>RM's Travel and Tours Dashboard</h1>
    <main class="dashboard-content">
      <!-- Key Metrics -->
      <section class="metrics-grid">
        <div v-for="metric in metrics" :key="metric.title" class="metric-card">
          <h2>{{ metric.title }}</h2>
          <p :class="['value', metric.class]">{{ metric.value }}</p>
          <p :class="['change', metric.trend === 'up' ? 'up' : 'down']">
            <span>{{ metric.trend === 'up' ? '↑' : '↓' }}</span>
            {{ metric.change }}% from last month
          </p>
        </div>
      </section>
      
      <!-- Booking Trends Chart -->
      <section class="chart-section">
        <h2>Booking Trends</h2>
        <BookingTrendsChart :chartData="bookingTrendsData" />
      </section>
      
      <div class="info-grid">
        <!-- Upcoming Tours -->
        <section class="info-card">
          <h2>Upcoming Tours</h2>
          <ul class="tour-list">
            <li v-for="tour in upcomingTours" :key="tour.id" class="tour-item">
              <div>
                <p class="tour-destination">{{ tour.destination }}</p>
                <p class="tour-date">{{ formatDate(tour.checkInDate) }}</p>
              </div>
              <span :class="['tour-status', tour.status.toLowerCase()]">
                {{ tour.status }}
              </span>
            </li>
          </ul>
        </section>
        
        <!-- Recent Activities -->
        <section class="info-card">
          <h2>Recent Activities</h2>
          <ul class="activity-list">
            <li v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <div :class="['activity-icon', activity.iconColor]">
                <component :is="activity.icon" />
              </div>
              <div class="activity-details">
                <p class="activity-description">{{ activity.description }}</p>
                <p class="activity-timestamp">{{ formatTimestamp(activity.timestamp) }}</p>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </main>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { UserIcon, CalendarIcon, DollarSignIcon, GlobeIcon } from 'lucide-vue-next'
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore'
import { db } from '../firebaseConfig'

const metrics = ref([
  { title: 'Total Bookings', value: '0', class: 'blue', trend: 'up', change: 0 },
  { title: 'Revenue', value: '₱0', class: 'green', trend: 'up', change: 0 },
  { title: 'Active Tours', value: '0', class: 'yellow', trend: 'up', change: 0 },
  { title: 'Customer Satisfaction', value: '0/5', class: 'purple', trend: 'up', change: 0 },
])

const upcomingTours = ref([])
const recentActivities = ref([])
const bookingTrendsData = ref([])

const fetchMetrics = async () => {
  const bookingsRef = collection(db, 'bookings')
  const bookingsSnapshot = await getDocs(bookingsRef)
  const totalBookings = bookingsSnapshot.size

  let totalRevenue = 0
  let activeTours = 0
  bookingsSnapshot.forEach((doc) => {
    const booking = doc.data()
    if (booking.status === 'Approved' || booking.status === 'Pending') {
      totalRevenue += booking.totalPrice
      activeTours++
    }
  })

  // TODO: Implement customer satisfaction calculation
  const customerSatisfaction = 4.5 // Placeholder value

  metrics.value = [
    { title: 'Total Bookings', value: totalBookings.toString(), class: 'blue', trend: 'up', change: 5 },
    { title: 'Revenue', value: `₱${totalRevenue.toLocaleString()}`, class: 'green', trend: 'up', change: 12 },
    { title: 'Active Tours', value: activeTours.toString(), class: 'yellow', trend: 'up', change: 3 },
    { title: 'Customer Satisfaction', value: `${customerSatisfaction.toFixed(1)}/5`, class: 'purple', trend: 'up', change: 1 },
  ]
}

const fetchUpcomingTours = async () => {
  const now = Timestamp.now()
  const bookingsRef = collection(db, 'bookings')
  const q = query(
    bookingsRef,
    where('checkInDate', '>', now),
    where('status', 'in', ['Pending', 'Approved']),
    orderBy('checkInDate'),
    limit(5)
  )
  const querySnapshot = await getDocs(q)
  upcomingTours.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    destination: `${doc.data().hotel.name}, ${doc.data().hotel.location}`,
  }))
}

const fetchRecentActivities = async () => {
  const bookingsRef = collection(db, 'bookings')
  const q = query(bookingsRef, orderBy('createdAt', 'desc'), limit(5))
  const querySnapshot = await getDocs(q)
  recentActivities.value = querySnapshot.docs.map(doc => {
    const booking = doc.data()
    return {
      id: doc.id,
      description: `New booking: ${booking.hotel.name}`,
      timestamp: booking.createdAt,
      icon: CalendarIcon,
      iconColor: 'green'
    }
  })
}

const fetchBookingTrends = async () => {
  const bookingsRef = collection(db, 'bookings')
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const q = query(
    bookingsRef,
    where('createdAt', '>', Timestamp.fromDate(sixMonthsAgo)),
    orderBy('createdAt')
  )
  const querySnapshot = await getDocs(q)
  
  const monthlyBookings = {}
  querySnapshot.forEach(doc => {
    const booking = doc.data()
    const month = booking.createdAt.toDate().toLocaleString('default', { month: 'short' })
    monthlyBookings[month] = (monthlyBookings[month] || 0) + 1
  })

  bookingTrendsData.value = Object.entries(monthlyBookings).map(([month, count]) => ({ month, count }))
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  return timestamp.toDate().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A'
  const now = new Date()
  const date = timestamp.toDate()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return formatDate(timestamp)
}

onMounted(async () => {
  await Promise.all([
    fetchMetrics(),
    fetchUpcomingTours(),
    fetchRecentActivities(),
    fetchBookingTrends()
  ])
})

const BookingTrendsChart = {
  props: {
    chartData: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const width = 500;
    const height = 300;
    const padding = 40;

    const maxCount = computed(() => Math.max(...props.chartData.map(d => d.count)));

    const yAxisTicks = computed(() => {
      const tickCount = 5;
      const step = Math.ceil(maxCount.value / (tickCount - 1));
      return Array.from({ length: tickCount }, (_, i) => i * step);
    });

    const getX = (index) => padding + (index * ((width - 2 * padding) / (props.chartData.length - 1)));
    const getY = (count) => height - padding - ((count / maxCount.value) * (height - 2 * padding));

    const points = computed(() => {
      return props.chartData
        .map((point, index) => `${getX(index)},${getY(point.count)}`)
        .join(' ');
    });

    return {
      width,
      height,
      padding,
      yAxisTicks,
      getX,
      getY,
      points
    };
  },
  template: `
    <div class="chart-wrapper">
      <svg class="chart" :viewBox="'0 0 ' + width + ' ' + height">
        <g class="x-axis">
          <line :x1="padding" :y1="height - padding" :x2="width - padding" :y2="height - padding" />
          <text 
            v-for="(point, index) in chartData" 
            :key="index"
            :x="getX(index)"
            :y="height - padding + 20"
            text-anchor="middle"
          >
            {{ point.month }}
          </text>
        </g>
        <g class="y-axis">
          <line :x1="padding" :y1="padding" :x2="padding" :y2="height - padding" />
          <text 
            v-for="tick in yAxisTicks" 
            :key="tick"
            :x="padding - 10"
            :y="getY(tick)"
            text-anchor="end"
            alignment-baseline="middle"
          >
            {{ tick }}
          </text>
        </g>
        <polyline
          class="chart-line"
          fill="none"
          stroke="#3b82f6"
          stroke-width="2"
          :points="points"
        />
        <g>
          <circle 
            v-for="(point, index) in chartData" 
            :key="index"
            class="chart-dot" 
            :cx="getX(index)" 
            :cy="getY(point.count)" 
            r="4" 
            fill="#3b82f6" 
          />
        </g>
      </svg>
    </div>
  `
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.dashboard {
  font-family: 'Poppins', sans-serif;
  background-color: #f8fafc;
  min-height: 100vh;
}

.dashboard-header {
  background-color: #ffffff;
  padding: 1.5rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.dashboard-content {
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background-color: #f0f7f4;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.metric-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.metric-card h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.value {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.value.blue { color: #3b82f6; }
.value.green { color: #10b981; }
.value.yellow { color: #f59e0b; }
.value.purple { color: #8b5cf6; }

.change {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.change.up { color: #10b981; }
.change.down { color: #ef4444; }

.chart-section, .info-card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-section h2, .info-card h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.tour-list, .activity-list {
  list-style-type: none;
  padding: 0;
}

.tour-item, .activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.tour-item:last-child, .activity-item:last-child {
  border-bottom: none;
}

.tour-destination {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.tour-date {
  font-size: 1rem;
  color: #64748b;
}

.tour-status {
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
}

.tour-status.approved {
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
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin-right: 1rem;
}

.activity-icon.green { background-color: #d1fae5; color: #059669; }
.activity-icon.blue { background-color: #dbeafe; color: #3b82f6; }
.activity-icon.yellow { background-color: #fef3c7; color: #d97706; }
.activity-icon.purple { background-color: #ede9fe; color: #7c3aed; }

.activity-details {
  flex-grow: 1;
}

.activity-description {
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;

}

.activity-timestamp {
  font-size: .75rem;
  color: #64748b;
}

.chart-wrapper {
  width: 100%;
  height: 300px;
}

.chart {
  width: 100%;
  height: 100%;
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

.x-axis line, .y-axis line {
  stroke: #e2e8f0;
  stroke-width: 1;
}

.x-axis text, .y-axis text {
  font-size: 1rem;
  fill: #64748b;
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
  .dashboard-content {
    padding: 1rem;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>