<template>
  <div class="calendar-container">
    <div class="calendar-wrapper">
      <!-- Calendar Card -->
      <div class="calendar-card">
        <div class="calendar-header">
          <button class="nav-arrow" @click="prevMonth">&lt;</button>
          <h2 class="current-month">{{ currentMonthName }}</h2>
          <button class="nav-arrow" @click="nextMonth">&gt;</button>
        </div>
        <div class="calendar-grid">
          <div class="weekdays">
            <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
          </div>
          <div class="days">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              :class="[
                'day',
                { 
                  'other-month': day.otherMonth,
                  'selected': isSelected(day.date),
                  'today': isToday(day.date),
                  'disabled': isDisabled(day.date)
                }
              ]"
              @click="selectDate(day.date)"
            >
              {{ day.date.getDate() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Time Selection Card -->
      <div class="time-card">
        <div v-if="selectedDate" class="selected-date">
          {{ formatSelectedDate }}
        </div>
        <h3 class="time-title">Select Time</h3>
        <div class="time-slots">
          <button
            v-for="time in timeSlots"
            :key="time"
            :class="['time-slot', { 'selected': selectedTime === time }]"
            @click="selectTime(time)"
          >
            {{ time }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    checkInDate: { type: Date, default: null },
    checkInTime: { type: String, default: '' },
    minDate: { type: Date, default: () => new Date() },
    selectedDates: { type: Array, default: () => [] }
  },
  data() {
    return {
      currentDate: new Date(),
      selectedDate: null,
      selectedTime: null,
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      timeSlots: [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
      ],
    }
  },
  computed: {
    currentYear() {
      return this.currentDate.getFullYear()
    },
    currentMonth() {
      return this.currentDate.getMonth()
    },
    currentMonthName() {
      return this.getMonthName(this.currentDate)
    },
    formatSelectedDate() {
      if (!this.selectedDate) return 'Select a date'
      return this.selectedDate.toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    },
    calendarDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1)
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0)
      const days = []

      for (let i = firstDay.getDay(); i > 0; i--) {
        const date = new Date(this.currentYear, this.currentMonth, 1 - i)
        days.push({ date, otherMonth: true })
      }

      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(this.currentYear, this.currentMonth, i)
        days.push({ date, otherMonth: false })
      }

      const remainingDays = 7 - (days.length % 7)
      if (remainingDays < 7) {
        for (let i = 1; i <= remainingDays; i++) {
          const date = new Date(this.currentYear, this.currentMonth + 1, i)
          days.push({ date, otherMonth: true })
        }
      }

      return days
    }
  },
  methods: {
    getMonthName(date) {
      return date.toLocaleString('default', { month: 'long' })
    },
    prevMonth() {
      this.currentDate = new Date(this.currentYear, this.currentMonth - 1, 1)
    },
    nextMonth() {
      this.currentDate = new Date(this.currentYear, this.currentMonth + 1, 1)
    },
    selectDate(date) {
      if (!this.isDisabled(date)) {
        this.selectedDate = date
        this.$emit('update:checkInDate', date)
      }
    },
    selectTime(time) {
      this.selectedTime = time
      this.$emit('update:checkInTime', time)
    },
    isSelected(date) {
      return this.selectedDate && 
        date.toDateString() === this.selectedDate.toDateString()
    },
    isToday(date) {
      const today = new Date()
      return date.toDateString() === today.toDateString()
    },
    isDisabled(date) {
      return date < this.minDate
    }
  }
}
</script>

<style scoped>
.calendar-container {
  font-family: 'Inter', sans-serif;
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
}

.calendar-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
}

.calendar-card, .time-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.calendar-header {
  background: #00BFA6;
  color: white;
  padding: 16px;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-month {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}

.nav-arrow {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
}

.calendar-grid {
  padding: 16px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  color: #666;
  font-size: 14px;
  padding: 8px;
  font-weight: 500;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.day:hover:not(.disabled):not(.other-month) {
  background: #f5f5f5;
}

.day.other-month {
  color: #ddd;
}

.day.selected {
  background: #1a1a1a;
  color: white;
}

.day.today {
  color: #00BFA6;
  font-weight: 600;
}

.day.disabled {
  color: #ddd;
  cursor: not-allowed;
}

.time-card {
  padding: 20px;
}

.selected-date {
  font-size: 18px;
  color: #1a1a1a;
  margin-bottom: 16px;
  font-weight: 500;
}

.time-title {
  color: #00BFA6;
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: 500;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.time-slot {
  padding: 12px;
  border: 1px solid #00BFA6;
  border-radius: 8px;
  background: white;
  color: #00BFA6;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.time-slot:hover {
  background: rgba(0, 191, 166, 0.1);
}

.time-slot.selected {
  background: #00BFA6;
  color: white;
}

@media (max-width: 768px) {
  .calendar-wrapper {
    grid-template-columns: 1fr;
  }

  .time-slots {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

