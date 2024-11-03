<template>
    <div class="booking-calendar">
        <HeaderComponent />
      <h2>Book Your Tour Package</h2>
      
      <div class="section-buttons">
        <button @click="activeSection = 'dateTime'" :class="{ active: activeSection === 'dateTime' }">Confirm Date and Time</button>
        <button @click="activeSection = 'progress'" :class="{ active: activeSection === 'progress' }">Booking Progress</button>
      </div>
  
      <!-- Date and Time Selection -->
      <div v-if="activeSection === 'dateTime'" class="section">
        <h3>Confirm Date & Time</h3>
        <div class="calendar-container">
          <div class="date-picker">
            <h4>Select Date</h4>
            <input type="date" v-model="selectedDate" @change="updateAvailableTimes">
          </div>
          <div class="time-picker">
            <h4>Select Time</h4>
            <select v-model="selectedTime">
              <option v-for="time in availableTimes" :key="time" :value="time">{{ time }}</option>
            </select>
          </div>
        </div>
        <button @click="confirmDateTime" class="confirm-btn">Confirm Date and Time</button>
      </div>
  
      <!-- Booking Progress -->
      <div v-if="activeSection === 'progress'" class="section">
        <h3>Booking Progress</h3>
        <table class="booking-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Package</th>
              <th>Tour Guide</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in bookings" :key="booking.id">
              <td>{{ booking.dateTime }}</td>
              <td>{{ booking.package }}</td>
              <td>{{ booking.tourGuide }}</td>
              <td>{{ booking.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Tour Guide Selection -->
      <div v-if="activeSection === 'dateTime'" class="section">
        <h3>Select Tour Guide</h3>
        <div class="tour-guide-grid">
          <div v-for="guide in tourGuides" :key="guide.id" class="tour-guide-card" @click="selectTourGuide(guide)" :class="{ 'selected': selectedGuide === guide }">
            <img :src="guide.photo" :alt="guide.name">
            <h4>{{ guide.name }}</h4>
            <p>{{ guide.position }}</p>
            <p>Contact: {{ guide.contact }}</p>
            <p>Ranking: {{ guide.ranking }}</p>
          </div>
        </div>
      </div>
  
      <button v-if="activeSection === 'dateTime'" @click="confirmBooking" class="confirm-btn">Confirm Booking</button>

    <FooterComponent />
    </div>
  </template>
  
  <script>
  import HeaderComponent from './Header.vue';
  import FooterComponent from './Footer.vue';

  export default {
    components: {
        HeaderComponent,
        FooterComponent,
    },
    data() {
      return {
        activeSection: 'dateTime',
        selectedDate: '',
        selectedTime: '',
        availableTimes: ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'],
        bookings: [
          { id: 1, dateTime: '2023-06-15 09:00 AM', package: 'Beach Hopping', tourGuide: 'John Doe', status: 'Approved' },
          { id: 2, dateTime: '2023-06-20 01:00 PM', package: 'Snorkeling Adventure', tourGuide: 'Jane Smith', status: 'To be reviewed' },
        ],
        tourGuides: [
          { id: 1, name: 'John Doe', position: 'Senior Guide', contact: '123-456-7890', ranking: 4.8, photo: '/placeholder.svg?height=100&width=100' },
          { id: 2, name: 'Jane Smith', position: 'Adventure Specialist', contact: '098-765-4321', ranking: 4.9, photo: '/placeholder.svg?height=100&width=100' },
          { id: 3, name: 'Mike Johnson', position: 'Nature Expert', contact: '111-222-3333', ranking: 4.7, photo: '/placeholder.svg?height=100&width=100' },
        ],
        selectedGuide: null
      }
    },
    methods: {
      updateAvailableTimes() {
        // This method would typically fetch available times from a backend API
        // For this example, we'll just randomize the available times
        this.availableTimes = this.availableTimes.sort(() => 0.5 - Math.random()).slice(0, 3);
      },
      selectTourGuide(guide) {
        this.selectedGuide = guide;
      },
      confirmDateTime() {
        if (!this.selectedDate || !this.selectedTime) {
          alert('Please select both a date and time before confirming.');
          return;
        }
        alert(`Date and time confirmed: ${this.selectedDate} at ${this.selectedTime}`);
      },
      confirmBooking() {
        if (!this.selectedDate || !this.selectedTime || !this.selectedGuide) {
          alert('Please select a date, time, and tour guide before confirming.');
          return;
        }
        // Here you would typically send the booking data to your backend
        alert('Booking confirmed! Thank you for choosing RM\'s Travel and Tours.');
      }
    }
  }
  </script>
  
  <style scoped>
  .booking-calendar {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .section-buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .section-buttons button {
    padding: 10px 20px;
    margin: 0 10px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .section-buttons button.active {
    background-color: #1890ff;
    color: white;
  }
  
  .section {
    margin-bottom: 30px;
  }
  
  .calendar-container {
    display: flex;
    justify-content: space-between;
  }
  
  .date-picker, .time-picker {
    width: 45%;
  }
  
  input[type="date"], select {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
  }
  
  .booking-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .booking-table th, .booking-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  .booking-table th {
    background-color: #f2f2f2;
  }
  
  .tour-guide-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .tour-guide-card {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
    cursor: pointer;
  }
  
  .tour-guide-card img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 10px;
  }
  
  .tour-guide-card.selected {
    background-color: #e6f7ff;
    border-color: #1890ff;
  }
  
  .confirm-btn {
    display: block;
    width: 200px;
    margin: 20px auto;
    padding: 10px;
    background-color: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .confirm-btn:hover {
    background-color: #40a9ff;
  }
  </style>