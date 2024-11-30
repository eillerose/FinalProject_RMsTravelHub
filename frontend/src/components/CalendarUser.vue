<template>
  <div class="calendar-container">
    <div class="calendar-wrapper">
      <div class="date-section">
        <div class="calendar-navigation">
          <button class="nav-arrow" @click="prevMonth">&lt;</button>
          <h2 class="current-month">{{ currentMonthName }} {{ currentYear }}</h2>
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
      <div class="time-section">
        <div v-if="selectedDate" class="selected-date">{{ formatSelectedDate }}</div>
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
      weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      timeSlots: [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

.calendar-container {
  font-family: 'Poppins', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.calendar-wrapper {
  display: flex;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.date-section, .time-section {
  flex: 1;
  padding: 20px;
}

.date-section {
  border-right: 1px solid #e0e0e0;
}

.calendar-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.nav-arrow {
  background: none;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  padding: 5px 10px;
}

.current-month {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.weekdays, .days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.weekday, .day {
  text-align: center;
  padding: 10px 5px;
  font-size: 14px;
}

.weekday {
  font-weight: 600;
  color: #666;
}

.day {
  cursor: pointer;
  border-radius: 20%;
  transition: background-color 0.2s, color 0.2s;
}

.day:hover:not(.disabled):not(.other-month) {
  background-color: #f0f0f0;
}

.day.other-month {
  color: #ccc;
}

.day.selected {
  background-color: #10b981;
  color: white;
}

.day.today {
  font-weight: 600;
  color: #10b981;
}

.day.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.time-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.selected-date {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.time-slot {
  font-family: 'Poppins', sans-serif;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.time-slot:hover {
  background-color: #f5f5f5;
}

.time-slot.selected {
  background-color: #10b981;
  color: white;
  border-color: #10b981;
}

@media (max-width: 768px) {
  .calendar-wrapper {
    flex-direction: column;
  }

  .date-section {
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }

  .time-slots {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>