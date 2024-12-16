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
            <svg class="pie-chart" viewBox="0 0 200 200">
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
            <svg class="line-chart" :viewBox="'0 0 300 200'">
              <g class="grid">
                <line v-for="n in 5" 
                      :key="n"
                      x1="40" 
                      x2="280" 
                      :y1="40 * n" 
                      :y2="40 * n" 
                      class="grid-line" />
              </g>
              
              <polyline
                class="chart-line"
                fill="none"
                stroke="#3b82f6"
                stroke-width="2"
                :points="monthlyBookingsPoints"
              />
              
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
            <svg class="bar-chart" viewBox="0 0 300 200">
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
            <div v-for="tour in upcomingTours" :key="tour.id" class="tour-item">
              <div class="tour-info">
                <p class="tour-destination">{{ tour.destination }}</p>
                <p class="tour-date">{{ formatDate(tour.checkInDate) }}</p>
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
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <div class="activity-icon">
                <component :is="activity.icon" class="icon" />
              </div>
              <div class="activity-info">
                <p class="activity-title">{{ activity.description }}</p>
                <p class="activity-time">{{ formatTimestamp(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { CalendarIcon } from 'lucide-vue-next'
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore'
import { db } from '../firebaseConfig'

export default {
  name: 'Dashboard',
  setup() {
    const metrics = ref([
      { title: 'Total Bookings', value: '0', class: 'blue', trend: 'up', change: 0 },
      { title: 'Revenue', value: '₱0', class: 'green', trend: 'up', change: 0 },
      { title: 'Active Tours', value: '0', class: 'yellow', trend: 'up', change: 0 },
      { title: 'Customer Satisfaction', value: '0/5', class: 'purple', trend: 'up', change: 0 },
    ])

    const upcomingTours = ref([])
    const recentActivities = ref([])
    const bookingDistribution = ref([])
    const monthlyBookings = ref([])
    const packageRevenue = ref([])

    const fetchMetrics = async () => {
      const bookingsRef = collection(db, 'bookings')
      const bookingsSnapshot = await getDocs(bookingsRef)
      const totalBookings = bookingsSnapshot.size

      let totalRevenue = 0
      let activeTours = 0
      let totalSatisfaction = 0
      let ratedBookings = 0

      bookingsSnapshot.forEach((doc) => {
        const booking = doc.data()
        if (booking.status === 'Approved' || booking.status === 'Pending') {
          totalRevenue += booking.totalPrice
          activeTours++
        }
        if (booking.rating) {
          totalSatisfaction += booking.rating
          ratedBookings++
        }
      })

      const avgSatisfaction = ratedBookings > 0 ? totalSatisfaction / ratedBookings : 0

      metrics.value = [
        { title: 'Total Bookings', value: totalBookings.toString(), class: 'blue', trend: 'up', change: 5 },
        { title: 'Revenue', value: `₱${totalRevenue.toLocaleString()}`, class: 'green', trend: 'up', change: 12 },
        { title: 'Active Tours', value: activeTours.toString(), class: 'yellow', trend: 'up', change: 3 },
        { title: 'Customer Satisfaction', value: `${avgSatisfaction.toFixed(1)}/5`, class: 'purple', trend: 'up', change: 1 },
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
        }
      })
    }

    const fetchBookingDistribution = async () => {
      const bookingsRef = collection(db, 'bookings')
      const querySnapshot = await getDocs(bookingsRef)
      
      const statusCounts = {
        Completed: 0,
        Pending: 0,
        Cancelled: 0
      }

      querySnapshot.forEach((doc) => {
        const status = doc.data().status
        if (status in statusCounts) {
          statusCounts[status]++
        }
      })

      const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0)
      bookingDistribution.value = Object.entries(statusCounts).map(([label, count]) => ({
        label,
        value: ((count / total) * 100).toFixed(0),
        color: label === 'Completed' ? '#10b981' : label === 'Pending' ? '#f59e0b' : '#ef4444'
      }))
    }

    const fetchMonthlyBookings = async () => {
      const bookingsRef = collection(db, 'bookings')
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      const q = query(
        bookingsRef,
        where('createdAt', '>', Timestamp.fromDate(sixMonthsAgo)),
        orderBy('createdAt')
      )
      const querySnapshot = await getDocs(q)

      const monthlyBookingsMap = {}
      querySnapshot.forEach(doc => {
        const booking = doc.data()
        const month = booking.createdAt.toDate().toLocaleString('default', { month: 'short' })
        monthlyBookingsMap[month] = (monthlyBookingsMap[month] || 0) + 1
      })

      monthlyBookings.value = Object.entries(monthlyBookingsMap).map(([month, count]) => ({ month, count }))
    }

    const fetchPackageRevenue = async () => {
      const bookingsRef = collection(db, 'bookings')
      const querySnapshot = await getDocs(bookingsRef)
      
      const revenueByPackage = {}

      querySnapshot.forEach((doc) => {
        const booking = doc.data()
        const packageName = booking.packageName || 'Unknown'
        const revenue = booking.totalPrice || 0

        if (packageName in revenueByPackage) {
          revenueByPackage[packageName] += revenue
        } else {
          revenueByPackage[packageName] = revenue
        }
      })

      packageRevenue.value = Object.entries(revenueByPackage).map(([name, revenue]) => ({ name, revenue }))
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
        fetchBookingDistribution(),
        fetchMonthlyBookings(),
        fetchPackageRevenue()
      ])
    })

    // Pie Chart Computations
    const pieSegments = computed(() => {
      let startAngle = 0
      return bookingDistribution.value.map(item => {
        const angle = (item.value / 100) * Math.PI * 2
        const endAngle = startAngle + angle
        
        const x1 = Math.cos(startAngle) * 80
        const y1 = Math.sin(startAngle) * 80
        const x2 = Math.cos(endAngle) * 80
        const y2 = Math.sin(endAngle) * 80
        
        const largeArcFlag = angle > Math.PI ? 1 : 0
        
        const path = `
          M 0 0
          L ${x1} ${y1}
          A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}
          Z
        `
        
        startAngle = endAngle
        
        return {
          path,
          color: item.color
        }
      })
    })

    // Line Chart Computations
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

    const monthlyBookingsPoints = computed(() => {
      return monthlyBookingPoints.value.map(point => `${point.x},${point.y}`).join(' ')
    })

    // Bar Chart Computations
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

    return {
      metrics,
      upcomingTours,
      recentActivities,
      bookingDistribution,
      monthlyBookings,
      packageRevenue,
      formatDate,
      formatTimestamp,
      pieSegments,
      monthlyBookingPoints,
      monthlyBookingsPoints,
      packageBars
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.dashboard {
  font-family: 'Poppins', sans-serif;
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 2rem;
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

.pie-chart, .line-chart, .bar-chart {
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

.grid-line {
  stroke: #e2e8f0;
  stroke-width: 1;
}

.chart-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 2s ease-out forwards;
}

.data-point {
  fill: #3b82f6;
  transition: r 0.2s;
}

.data-point:hover {
  r: 6;
}

.bar {
  fill: #10b981;
  transition: opacity 0.2s;
  animation: growBar 1s ease-out forwards;
}

.bar:hover {
  opacity: 0.8;
}

.axis-label, .value-label {
  fill: #64748b;
  font-size: 0.75rem;
  text-anchor: middle;
}

.value-label {
  font-weight: 500;
}

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

.tour-list, .activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tour-item, .activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.tour-item:last-child, .activity-item:last-child {
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
  to {
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