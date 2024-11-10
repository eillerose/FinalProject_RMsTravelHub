<template>
        <HeaderComponent />
  <div class="booking-form">
    <h2>Book Your Stay</h2>
    <div class="booking-steps">
      <div v-for="(step, index) in steps" :key="index" 
           :class="['step', { 'active': currentStep === index, 'completed': currentStep > index }]">
        {{ step }}
      </div>
    </div>

    <!-- Step 1: Date and Time Selection -->
    <div v-if="currentStep === 0" class="booking-step">
      <h3>Select Dates and Times</h3>
      <div class="date-time-inputs">
        <div class="input-group">
          <label for="check-in-date">Check-in Date</label>
          <input type="date" id="check-in-date" v-model="booking.checkInDate" required>
        </div>
        <div class="input-group">
          <label for="check-in-time">Check-in Time</label>
          <input type="time" id="check-in-time" v-model="booking.checkInTime" required>
        </div>
        <div class="input-group">
          <label for="check-out-date">Check-out Date</label>
          <input type="date" id="check-out-date" v-model="booking.checkOutDate" required>
        </div>
        <div class="input-group">
          <label for="check-out-time">Check-out Time</label>
          <input type="time" id="check-out-time" v-model="booking.checkOutTime" required>
        </div>
      </div>
    </div>

    <!-- Step 2: Hotel Selection -->
    <div v-if="currentStep === 1" class="booking-step">
      <h3>Select Hotel</h3>
      <div class="hotel-options">
        <div v-for="hotel in hotels" :key="hotel.id" class="hotel-option">
          <input type="radio" :id="hotel.id" :value="hotel" v-model="booking.hotel" required>
          <label :for="hotel.id">
            <strong>{{ hotel.name }}</strong>
            <p>{{ hotel.description }}</p>
          </label>
        </div>
      </div>
    </div>

    <!-- Step 3: Room Selection -->
    <div v-if="currentStep === 2" class="booking-step">
      <h3>Select Room</h3>
      <div v-if="booking.hotel" class="room-options">
        <div v-for="room in booking.hotel.rooms" :key="room.id" class="room-option">
          <input type="radio" :id="room.id" :value="room" v-model="booking.room" required>
          <label :for="room.id">
            <strong>{{ room.name }}</strong> - ₱{{ room.price }} per night
            <p>Capacity: {{ room.capacity }} pax</p>
          </label>
        </div>
      </div>
      <p v-else class="error-message">Please select a hotel first.</p>
    </div>

    <!-- Step 4: Guest Information -->
    <div v-if="currentStep === 3" class="booking-step">
      <h3>Guest Information</h3>
      <div class="guest-form">
        <div class="input-group">
          <label for="full-name">Full Name</label>
          <input type="text" id="full-name" v-model="booking.guestName" required>
        </div>
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="booking.email" required>
        </div>
        <div class="input-group">
          <label for="phone">Phone Number</label>
          <input type="tel" id="phone" v-model="booking.phone" required>
        </div>
        <div class="input-group">
          <label for="guests">Number of Guests</label>
          <input type="number" id="guests" v-model="booking.guests" :min="1" :max="booking.room ? booking.room.capacity : 1" required>
        </div>
      </div>
    </div>

    <!-- Step 5: Summary and Confirmation -->
    <div v-if="currentStep === 4" class="booking-step">
      <h3>Booking Summary</h3>
      <div class="booking-summary">
        <p><strong>Check-in:</strong> {{ formatDateTime(booking.checkInDate, booking.checkInTime) }}</p>
        <p><strong>Check-out:</strong> {{ formatDateTime(booking.checkOutDate, booking.checkOutTime) }}</p>
        <p><strong>Hotel:</strong> {{ booking.hotel ? booking.hotel.name : 'Not selected' }}</p>
        <p><strong>Room:</strong> {{ booking.room ? booking.room.name : 'Not selected' }}</p>
        <p><strong>Guests:</strong> {{ booking.guests }}</p>
        <p><strong>Total Price:</strong> ₱{{ calculateTotalPrice() }}</p>
        <p><strong>Guest Name:</strong> {{ booking.guestName }}</p>
        <p><strong>Email:</strong> {{ booking.email }}</p>
        <p><strong>Phone:</strong> {{ booking.phone }}</p>
      </div>
    </div>

    <div class="form-navigation">
      <button v-if="currentStep > 0" @click="prevStep" class="prev-btn">Previous</button>
      <button v-if="currentStep < steps.length - 1" @click="nextStep" class="next-btn">Next</button>
      <button v-if="currentStep === steps.length - 1" @click="confirmBooking" class="confirm-btn">Confirm Booking</button>
    </div>
    <!-- <FooterComponent /> -->
  </div>
</template>

<script>
import HeaderComponent from './Header.vue';
// import FooterComponent from './Footer.vue';

export default {
  components: {
        HeaderComponent,
        // FooterComponent,
  },
  
  data() {
    return {
      currentStep: 0,
      steps: ['Dates', 'Hotel', 'Room', 'Guest Info', 'Confirm'],
      booking: {
        checkInDate: '',
        checkInTime: '',
        checkOutDate: '',
        checkOutTime: '',
        hotel: null,
        room: null,
        guestName: '',
        email: '',
        phone: '',
        guests: 1
      },
      hotels: [
        {
          id: 'agbing',
          name: 'Agbing Seaside View Resort',
          description: 'Beachfront resort with free Wi-Fi, air conditioning, cable TV, and RestoBar.',
          rooms: [
            { id: 'agbing-standard', name: 'Standard Room', capacity: 2, price: 2000 },
            { id: 'agbing-deluxe', name: 'Deluxe Room', capacity: 4, price: 3000 },
            { id: 'agbing-super-deluxe', name: 'Super Deluxe Room', capacity: 5, price: 3500 },
            { id: 'agbing-barkada', name: 'Barkada Room', capacity: 10, price: 5000 },
            { id: 'agbing-family', name: 'Family Room', capacity: 6, price: 4000 },
            { id: 'agbing-family-kitchen', name: 'Family Room with Kitchen', capacity: 6, price: 4500 },
            { id: 'agbing-barkada-kitchen', name: 'Barkada/Family Room with Kitchen', capacity: 14, price: 6000 }
          ]
        },
        {
          id: 'luckeh',
          name: 'Luckeh 5J Beach Resort',
          description: 'All rooms have air conditioning and Wi-Fi.',
          rooms: [
            { id: 'luckeh-super-deluxe', name: 'Super Deluxe Room', capacity: 6, price: 3500 },
            { id: 'luckeh-deluxe', name: 'Deluxe Room', capacity: 4, price: 2500 }
          ]
        }
      ]
    }
  },
  methods: {
    nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        if (this.currentStep === 0 && !this.isDateTimeValid()) {
          alert('Please select valid check-in and check-out dates and times.')
          return
        }
        if (this.currentStep === 1 && !this.booking.hotel) {
          alert('Please select a hotel before proceeding.')
          return
        }
        if (this.currentStep === 2 && !this.booking.room) {
          alert('Please select a room before proceeding.')
          return
        }
        this.currentStep++
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },
    calculateTotalPrice() {
      if (!this.booking.room || !this.booking.checkInDate || !this.booking.checkOutDate) {
        return 0
      }
      const checkIn = new Date(`${this.booking.checkInDate}T${this.booking.checkInTime}`)
      const checkOut = new Date(`${this.booking.checkOutDate}T${this.booking.checkOutTime}`)
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      return this.booking.room.price * nights
    },
    confirmBooking() {
      console.log('Booking confirmed:', this.booking)
      alert('Your booking has been confirmed! Thank you for choosing our hotel.')
      this.resetForm()
    },
    resetForm() {
      this.currentStep = 0
      this.booking = {
        checkInDate: '',
        checkInTime: '',
        checkOutDate: '',
        checkOutTime: '',
        hotel: null,
        room: null,
        guestName: '',
        email: '',
        phone: '',
        guests: 1
      }
    },
    formatDateTime(date, time) {
      if (!date || !time) return 'Not selected'
      const dateObj = new Date(`${date}T${time}`)
      return dateObj.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
      })
    },
    isDateTimeValid() {
      const checkIn = new Date(`${this.booking.checkInDate}T${this.booking.checkInTime}`)
      const checkOut = new Date(`${this.booking.checkOutDate}T${this.booking.checkOutTime}`)
      const now = new Date()
      return checkIn > now && checkOut > checkIn
    }
  },
  watch: {
    'booking.hotel'() {
      this.booking.room = null
      this.booking.guests = 1
    },
    'booking.room'() {
      if (this.booking.room && this.booking.guests > this.booking.room.capacity) {
        this.booking.guests = this.booking.room.capacity
      }
    }
  }
}
</script>

<style scoped>
.booking-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.booking-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.step {
  flex: 1;
  text-align: center;
  padding: 10px;
  background-color: #e9ecef;
  color: #6c757d;
  border-radius: 4px;
  font-size: 14px;
}

.step.active {
  background-color: #007bff;
  color: white;
}

.step.completed {
  background-color: #28a745;
  color: white;
}

.booking-step {
  margin-bottom: 30px;
}

h3 {
  color: #495057;
  margin-bottom: 15px;
}

.date-time-inputs, .guest-form {
  display: grid;
  gap: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  color: #495057;
}

input[type="date"],
input[type="time"],
input[type="text"],
input[type="email"],
input[type="tel"],
input[type="number"] {
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
}

.hotel-options, .room-options {
  display: grid;
  gap: 15px;
}

.hotel-option, .room-option {
  display: flex;
  align-items: flex-start;
}

.hotel-option input[type="radio"],
.room-option input[type="radio"] {
  margin-right: 10px;
  margin-top: 5px;
}

.hotel-option label,
.room-option label {
  flex: 1;
}

.hotel-option p,
.room-option p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #6c757d;
}

.booking-summary p {
  margin: 10px 0;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.prev-btn {
  background-color: #6c757d;
  color: white;
}

.next-btn, .confirm-btn {
  background-color: #007bff;
  color: white;
}

button:hover {
  opacity: 0.9;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 10px;
}

@media (max-width: 600px) {
  .booking-form {
    padding: 15px;
  }

  .booking-steps {
    flex-wrap: wrap;
  }

  .step {
    flex-basis: 50%;
    margin-bottom: 10px;
  }

  .date-time-inputs {
    grid-template-columns: 1fr;
  }

  .form-navigation {
    flex-direction: column;
    gap: 10px;
  }

  button {
    width: 100%;
  }
}
</style>