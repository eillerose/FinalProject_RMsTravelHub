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

    <!-- Step 1: Package Selection -->
    <div v-if="currentStep === 0" class="booking-step">
      <h3>Select Package</h3>
      <div class="package-options">
        <div v-for="pkg in packages" :key="pkg.id" class="package-option">
          <input type="radio" :id="pkg.id" :value="pkg" v-model="booking.package">
          <label :for="pkg.id">
            <strong>{{ pkg.name }}</strong>
            <p>{{ pkg.description }}</p>
            <p>Price: ₱{{ pkg.price }}</p>
          </label>
        </div>
      </div>
    </div>

    <!-- Step 2: Date and Time Selection -->
    <div v-if="currentStep === 1" class="booking-step">
      <h3>Select Date and Time</h3>
      <Calendar 
        v-model:checkInDate="booking.checkInDate"
        v-model:checkInTime="booking.checkInTime"
        @add-recurring="handleRecurring"
      />
    </div>

    <!-- Step 3: Hotel and Room Selection -->
    <div v-if="currentStep === 2" class="booking-step">
      <h3>Select Hotel and Room</h3>
      <div class="hotel-options">
        <div v-for="hotel in hotels" :key="hotel.id" class="hotel-option">
          <h4>{{ hotel.name }}</h4>
          <p>{{ hotel.description }}</p>
          <div class="room-options">
            <div v-for="room in hotel.rooms" :key="room.id" class="room-option">
              <input 
                type="radio" 
                :id="room.id" 
                :value="{ hotel, room }" 
                v-model="booking.hotelAndRoom"
                @change="updateBooking(hotel, room)"
              >
              <label :for="room.id">
                <strong>{{ room.name }}</strong> - ₱{{ room.price }} per night
                <p>Capacity: {{ room.capacity }} pax</p>
              </label>
            </div>
          </div>
        </div>
      </div>
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
          <input type="number" id="guests" v-model="booking.guests" :min="1" :max="booking.hotelAndRoom ? booking.hotelAndRoom.room.capacity : 1" required>
        </div>
      </div>
    </div>

    <div class="form-navigation">
      <button v-if="currentStep > 0" @click="prevStep" class="prev-btn">Previous</button>
      <button v-if="currentStep < steps.length - 1" @click="nextStep" class="next-btn">Next</button>
      <button v-if="currentStep === steps.length - 1" @click="showSummaryModal" class="confirm-btn">Review Booking</button>
    </div>

    <!-- Booking Summary Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <h2>Booking Summary</h2>
        <div class="booking-summary">
          <p><strong>Package:</strong> {{ booking.package.name }}</p>
          <p><strong>Check-in:</strong> {{ formatDateTime(booking.checkInDate, booking.checkInTime) }}</p>
          <p><strong>Hotel:</strong> {{ booking.hotelAndRoom ? booking.hotelAndRoom.hotel.name : 'Not selected' }}</p>
          <p><strong>Room:</strong> {{ booking.hotelAndRoom ? booking.hotelAndRoom.room.name : 'Not selected' }}</p>
          <p><strong>Guests:</strong> {{ booking.guests }}</p>
          <p><strong>Total Price:</strong> ₱{{ calculateTotalPrice() }}</p>
          <p><strong>Guest Name:</strong> {{ booking.guestName }}</p>
          <p><strong>Email:</strong> {{ booking.email }}</p>
          <p><strong>Phone:</strong> {{ booking.phone }}</p>
        </div>
        <button @click="confirmBooking" class="confirm-btn">Confirm Booking</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
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
  
  setup() {
    const currentStep = ref(0);
    const showModal = ref(false);
    const steps = ['Package', 'Date & Time', 'Hotel & Room', 'Guest Info'];
    
    const booking = reactive({
      package: null,
      checkInDate: null,
      checkInTime: '',
      hotelAndRoom: null,
      guestName: '',
      email: '',
      phone: '',
      guests: 1
    });

    const packages = [
      {
        id: 'package1',
        name: "Package 1",
        description: "Great accommodation and Island Hopping with snorkeling options.",
        price: 5000
      },
      {
        id: 'package2',
        name: "Package 2",
        description: "Experience underwater adventures with our snorkeling tour.",
        price: 6000
      },
      {
        id: 'packageDiamond',
        name: "Package Diamond",
        description: "Enjoy a memorable vacation with snorkeling, inland, and island tours.",
        price: 8000
      },
      {
        id: 'packageRuby',
        name: "Package Ruby",
        description: "Experience underwater adventures with our snorkeling tour.",
        price: 7000
      }
    ];

    const hotels = [
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
    ];

    const nextStep = () => {
      if (currentStep.value < steps.length - 1) {
        if (currentStep.value === 0 && !booking.package) {
          alert('Please select a package.');
          return;
        }
        if (currentStep.value === 1 && !isDateTimeValid()) {
          alert('Please select a valid check-in date and time.');
          return;
        }
        if (currentStep.value === 2 && !booking.hotelAndRoom) {
          alert('Please select a hotel and room.');
          return;
        }
        currentStep.value++;
      }
    };

    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--;
      }
    };

    const updateBooking = (hotel, room) => {
      booking.hotelAndRoom = { hotel, room };
      booking.guests = 1;
    };

    const showSummaryModal = () => {
      if (!isGuestInfoValid()) {
        alert('Please fill in all guest information fields.');
        return;
      }
      showModal.value = true;
    };

    const calculateTotalPrice = () => {
      if (!booking.package || !booking.hotelAndRoom) {
        return 0;
      }
      return booking.package.price + booking.hotelAndRoom.room.price;
    };

    const confirmBooking = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          alert("You must be logged in to make a booking.");
          return;
        }

        const bookingsRef = collection(db, "bookings");
        await addDoc(bookingsRef, {
          ...booking,
          userId: user.uid,
          status: "Pending",
          createdAt: new Date(),
          totalPrice: calculateTotalPrice()
        });
        alert("Your booking has been confirmed! Thank you for choosing our hotel.");
        resetForm();
        showModal.value = false;
      } catch (error) {
        console.error("Error creating booking:", error);
        alert("There was an error creating the booking.");
      }
    };

    const resetForm = () => {
      currentStep.value = 0;
      Object.assign(booking, {
        package: null,
        checkInDate: null,
        checkInTime: '',
        hotelAndRoom: null,
        guestName: '',
        email: '',
        phone: '',
        guests: 1
      });
    };

    const formatDateTime = (date, time) => {
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
    };

    const isDateTimeValid = () => {
      if (!booking.checkInDate || !booking.checkInTime) return false;
      const checkIn = new Date(booking.checkInDate);
      checkIn.setHours(parseInt(booking.checkInTime.split(':')[0]), parseInt(booking.checkInTime.split(':')[1]));
      const now = new Date();
      return checkIn > now;
    };

    const isGuestInfoValid = () => {
      return booking.guestName && booking.email && booking.phone && booking.guests > 0;
    };

    const handleRecurring = (event) => {
      // Handle recurring bookings if needed
      console.log('Recurring booking:', event);
    };

    return {
      currentStep,
      showModal,
      steps,
      booking,
      packages,
      hotels,
      nextStep,
      prevStep,
      updateBooking,
      showSummaryModal,
      calculateTotalPrice,
      confirmBooking,
      formatDateTime,
      handleRecurring
    };
  }
}
</script>

<style scoped>
.booking-form {
  max-width: 800px;
  margin: 150px auto;
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.package-options,
.hotel-options,
.room-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.package-option,
.hotel-option,
.room-option {
  flex: 1 1 48%;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.package-option:hover,
.hotel-option:hover,
.room-option:hover {
  border-color: #007bff;
}

.package-option input,
.hotel-option input,
.room-option input {
  margin-right: 10px;
}

.package-option label,
.hotel-option label,
.room-option label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
  color: #333;
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

.modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  border-radius: 8px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
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

  .form-navigation {
    flex-direction: column;
    gap: 10px;
  }

  button {
    width: 100%;
  }
}
</style>