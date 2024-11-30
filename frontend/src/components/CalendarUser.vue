<template>
    <div class="calendar-container">
      <div class="calendar">
        <div class="calendar-navigation">
          <button class="month-nav prev" @click="prevMonth">
            <span class="arrow">&larr;</span>
            <span class="month-name">{{ previousMonthName }}</span>
          </button>
          <h2 class="current-month">{{ currentMonthName }} {{ currentYear }}</h2>
          <button class="month-nav next" @click="nextMonth">
            <span class="month-name">{{ nextMonthName }}</span>
            <span class="arrow">&rarr;</span>
          </button>
        </div>
        
        <div class="calendar-body">
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
                  'disabled': isDisabled(day.date),
                  'available': isAvailable(day.date)
                }
              ]"
              @click="selectDate(day.date)"
            >
              {{ day.date.getDate() }}
              <span v-if="hasBooking(day.date)" class="booking-indicator">1</span>
            </div>
          </div>
        </div>
  
        <div v-if="selectedDate" class="time-selection">
          <h4>{{ formatSelectedDate }}</h4>
          <div class="time-period">
            <h5>Morning</h5>
            <div class="time-slots">
              <button
                v-for="time in morningSlots"
                :key="time"
                :class="['time-slot', { 'selected': selectedTime === time }]"
                @click="selectTime(time)"
              >
                {{ time }}
              </button>
            </div>
          </div>
          <div class="time-period">
            <h5>Afternoon</h5>
            <div class="time-slots">
              <button
                v-for="time in afternoonSlots"
                :key="time"
                :class="['time-slot', { 'selected': selectedTime === time }]"
                @click="selectTime(time)"
              >
                {{ time }}
              </button>
            </div>
          </div>
          
          <div class="recurring-option" v-if="selectedTime && !isRecurring">
            <button class="recurring-btn" @click="addRecurringDay">
              + Add another day with same time
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      checkInDate: {
        type: Date,
        default: null
      },
      checkInTime: {
        type: String,
        default: ''
      },
      checkOutDate: {
        type: Date,
        default: null
      },
      checkOutTime: {
        type: String,
        default: ''
      },
      minDate: {
        type: Date,
        default: () => new Date()
      },
      selectedDates: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        currentDate: new Date(),
        selectedDate: null,
        selectedTime: null,
        weekdays: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
        morningSlots: [
          '8:00 AM',
          '9:00 AM',
          '10:00 AM',
          '11:00 AM',
          '12:00 NN'
        ],
        afternoonSlots: [
          '1:00 PM',
          '2:00 PM',
          '3:00 PM',
          '4:00 PM',
          '5:00 PM'
        ],
        isRecurring: false
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
      previousMonthName() {
        const prevMonth = new Date(this.currentYear, this.currentMonth - 1, 1)
        return this.getMonthName(prevMonth).toUpperCase()
      },
      nextMonthName() {
        const nextMonth = new Date(this.currentYear, this.currentMonth + 1, 1)
        return this.getMonthName(nextMonth).toUpperCase()
      },
      formatSelectedDate() {
        if (!this.selectedDate) return ''
        return this.selectedDate.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
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
          this.selectedTime = null
          this.isRecurring = false
          this.$emit('update:checkInDate', date)
        }
      },
      selectTime(time) {
        this.selectedTime = time
        this.$emit('update:checkInTime', time)
      },
      addRecurringDay() {
        const nextDay = new Date(this.selectedDate)
        nextDay.setDate(nextDay.getDate() + 1)
        this.$emit('add-recurring', {
          date: nextDay,
          time: this.selectedTime
        })
        this.isRecurring = true
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
      },
      isAvailable(date) {
        const currentDate = new Date()
        const futureDate = new Date()
        futureDate.setDate(currentDate.getDate() + 14)
        return date >= currentDate && date <= futureDate
      },
      hasBooking(date) {
        return this.selectedDates.some(booking => 
          booking.date.toDateString() === date.toDateString()
        )
      }
    }
  }
  </script>
  
  <style scoped>
  .calendar-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }
  
  .calendar {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .calendar-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: white;
    border-bottom: 1px solid #eee;
  }
  
  .month-nav {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    color: #666;
    transition: all 0.2s ease;
  }
  
  .month-nav:hover {
    color: #0056b3;
  }
  
  .month-nav.prev {
    padding-left: 0;
  }
  
  .month-nav.next {
    padding-right: 0;
  }
  
  .month-name {
    font-weight: 500;
  }
  
  .arrow {
    font-size: 18px;
  }
  
  .current-month {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    color: #333;
  }
  
  .calendar-body {
    padding: 20px;
  }
  
  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    margin-bottom: 10px;
  }
  
  .weekday {
    text-align: center;
    font-weight: bold;
    color: #666;
  }
  
  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }
  
  .day {
    text-align: center;
    padding: 10px;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
  
  .day:hover:not(.disabled):not(.other-month) {
    background-color: #f0f0f0;
  }
  
  .day.other-month {
    color: #ccc;
  }
  
  .day.selected {
    background-color: #007bff;
    color: white;
  }
  
  .day.today {
    font-weight: bold;
    border: 1px solid #007bff;
  }
  
  .day.disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  
  .day.available {
    background-color: #e3f2fd;
  }
  
  .booking-indicator {
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: #28a745;
    border-radius: 50%;
    margin-left: 2px;
  }
  
  .time-selection {
    margin-top: 20px;
  }
  
  .time-period {
    margin-bottom: 20px;
  }
  
  .time-period h5 {
    margin-bottom: 10px;
    color: #666;
  }
  
  .time-slots {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }
  
  .time-slot {
    padding: 10px;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .time-slot:hover {
    background-color: #e9ecef;
  }
  
  .time-slot.selected {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }
  
  .recurring-option {
    margin-top: 20px;
  }
  
  .recurring-btn {
    width: 100%;
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .recurring-btn:hover {
    background-color: #218838;
  }
  
  @media (max-width: 768px) {
    .calendar-navigation {
      padding: 15px;
    }
  
    .current-month {
      font-size: 20px;
    }
  
    .month-nav {
      padding: 8px;
    }
  
    .month-name {
      display: none;
    }
  
    .time-slots {
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    }
  }
  </style>