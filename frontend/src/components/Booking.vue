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
      <h3>Select Date and Time</h3>
      <Calendar 
        v-model:checkInDate="booking.checkInDate"
        v-model:checkInTime="booking.checkInTime"
        @add-recurring="handleRecurring"
      />
    </div>

    <!-- Step 2: Hotel Selection with Skip Option -->
    <div v-if="currentStep === 1" class="booking-step">
      <h3>Select Hotel</h3>
      <div class="hotel-options">
        <div v-for="hotel in hotels" :key="hotel.id" class="hotel-option">
          <input type="radio" :id="hotel.id" :value="hotel" v-model="booking.hotel">
          <label :for="hotel.id">
            <strong>{{ hotel.name }}</strong>
            <p>{{ hotel.description }}</p>
          </label>
        </div>
      </div>
      <button @click="skipHotel" class="skip-btn">Skip</button>
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
        <!-- <p><strong>Check-out:</strong> {{ formatDateTime(booking.checkOutDate, booking.checkOutTime) }}</p> -->
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

    <!-- <button @click="confirmBooking">Confirm Booking</button> -->

  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import HeaderComponent from './Header.vue';
import Calendar from './CalendarUser.vue';

export default {
  components: {
    HeaderComponent,
    Calendar,
  },
  
  data() {
    return {
      currentStep: 0,
      skipHotelOption: false,
      steps: ['Date & Time', 'Hotel', 'Room', 'Guest Info', 'Confirm'],
      booking: {
        checkInDate: null,
        checkInTime: '',
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
      // Validation checks for each step
      if (this.currentStep < this.steps.length - 1) {
        if (this.currentStep === 0 && !this.isDateTimeValid()) {
          alert('Please select a valid check-in date and time.');
          return;
        }
        if (this.currentStep === 1 && !this.booking.hotel && !this.skipHotelOption) {
          alert('Please select a hotel or skip to proceed.');
          return;
        }
        if (this.currentStep === 2 && !this.booking.room && !this.skipHotelOption) {
          alert('Please select a room before proceeding.');
          return;
        }
        this.currentStep++;
      }
    },
    skipHotel() {
      this.booking.hotel = null;
      this.skipHotelOption = true;
      this.currentStep = 3;
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    calculateTotalPrice() {
      if (!this.booking.room || !this.booking.checkInDate) {
        return 0;
      }
      const nights = 1;
      return this.booking.room.price * nights;
    },
    async confirmBooking() { // Add the modified confirmBooking method here
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          alert("You must be logged in to make a booking.");
          return;
        }

        const bookingsRef = collection(db, "bookings");
        await addDoc(bookingsRef, {
          ...this.booking,
          userId: user.uid, // Add userId to identify the user
          status: "Pending",
          createdAt: new Date(),
        });
        alert("Your booking has been confirmed! Thank you for choosing our hotel.");
        this.resetForm();
      } catch (error) {
        console.error("Error creating booking:", error);
        alert("There was an error creating the booking.");
      }
    },
    resetForm() {
      this.currentStep = 0;
      this.skipHotelOption = false;
      this.booking = {
        checkInDate: null,
        checkInTime: '',
        hotel: null,
        room: null,
        guestName: '',
        email: '',
        phone: '',
        guests: 1
      };
    },
    formatDateTime(date, time) {
      if (!date || !time) return 'Not selected';
      const dateObj = new Date(date);
      dateObj.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]));
      return dateObj.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
      });
    },
    isDateTimeValid() {
      if (!this.booking.checkInDate || !this.booking.checkInTime) return false;
      const checkIn = new Date(this.booking.checkInDate);
      checkIn.setHours(parseInt(this.booking.checkInTime.split(':')[0]), parseInt(this.booking.checkInTime.split(':')[1]));
      const now = new Date();
      return checkIn > now;
    }
  },
  watch: {
    'booking.hotel'() {
      this.booking.room = null;
      this.booking.guests = 1;
      this.skipHotelOption = false;
    },
    'booking.room'() {
      if (this.booking.room && this.booking.guests > this.booking.room.capacity) {
        this.booking.guests = this.booking.room.capacity;
      }
    }
  }
}
</script>


<style scoped>
.booking-form {
  max-width: 800px;
  margin: 150px auto; /* Centers the form horizontally and adds top margin */
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.booking-form h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.booking-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.step {
  flex: 1;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  color: #666;
  border-bottom: 3px solid #ddd;
  transition: color 0.3s, border-color 0.3s;
}

.step.active {
  color: #007bff;
  border-color: #007bff;
}

.step.completed {
  color: #28a745;
  border-color: #28a745;
}

.booking-step {
  margin-bottom: 20px;
}

.hotel-options,
.room-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hotel-option,
.room-option {
  flex: 1 1 48%;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.hotel-option:hover,
.room-option:hover {
  border-color: #007bff;
}

.hotel-option input,
.room-option input {
  margin-right: 10px;
}

.hotel-option label,
.room-option label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
  color: #333;
}

.skip-btn {
  background-color: #f39c12;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.skip-btn:hover {
  background-color: #e67e22;
}

.guest-form .input-group {
  margin-bottom: 15px;
}

.input-group label {
  font-weight: bold;
  color: #666;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error-message {
  color: #e74c3c;
  font-weight: bold;
  text-align: center;
}

.booking-summary p {
  margin: 10px 0;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.prev-btn,
.next-btn,
.confirm-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #fff;
}

.prev-btn {
  background-color: #95a5a6;
}

.prev-btn:hover {
  background-color: #7f8c8d;
}

.next-btn {
  background-color: #007bff;
}

.next-btn:hover {
  background-color: #0056b3;
}

.confirm-btn {
  background-color: #28a745;
}

.confirm-btn:hover {
  background-color: #218838;
}
@media (max-width: 768px) {
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

  .calendars-container {
    flex-direction: column;
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