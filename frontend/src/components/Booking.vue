11:19 PM
You sent
<template>
  <div class="booking-container">
    <header-component />
    <div class="booking-form">
      <h1 class="booking-title">Book Your Stay</h1>
      
      <!-- Progress Steps -->
      <div class="progress-steps">
        <div v-for="(step, index) in steps" :key="index" class="progress-step">
          <div class="step-circle" :class="{ 'active': currentStep >= index, 'completed': currentStep > index }">
            <span v-if="currentStep <= index">{{ index + 1 }}</span>
            <CheckIcon v-else />
          </div>
          <span class="step-name">{{ step }}</span>
          <div v-if="index < steps.length - 1" class="step-line" :class="{ 'active': currentStep > index }"></div>
        </div>
      </div>

      <div class="booking-content">
        <!-- Step 1: Package Selection -->
        <div v-if="currentStep === 0" class="booking-step">
          <h2 class="step-title">Select Packages</h2>
          <div class="package-list">
            <div 
              v-for="pkg in packages" 
              :key="pkg.id" 
              class="package-card"
              :class="{ 'selected': booking.package?.id === pkg.id }"
              @click="selectPackage(pkg)"
            >
              <div class="package-radio">
                <div class="radio-outer">
                  <div class="radio-inner" :class="{ 'checked': booking.package?.id === pkg.id }"></div>
                </div>
              </div>
              <div class="package-details">
                <h3 class="package-name">{{ pkg.name }}</h3>
                <p class="package-description">{{ pkg.description }}</p>
                <div class="package-price">₱{{ pkg.price }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Date and Time Selection -->
        <div v-if="currentStep === 1" class="booking-step">
          <h2 class="step-title">Select Date and Time</h2>
          <Calendar 
            v-model:checkInDate="booking.checkInDate"
            v-model:checkInTime="booking.checkInTime"
            @add-recurring="handleRecurring"
          />
        </div>

        <!-- Step 3: Hotel and Room Selection -->
        <div v-if="currentStep === 2" class="booking-step">
          <h2 class="step-title">Select Hotel and Room</h2>
          <div class="hotel-options">
            <div v-for="hotel in hotels" :key="hotel.id" class="hotel-card">
              <img :src="hotel.image" :alt="hotel.name" class="hotel-image">
              <div class="hotel-info">
                <h3 class="hotel-name">{{ hotel.name }}</h3>
                <p class="hotel-description">{{ hotel.description }}</p>
                <button @click="toggleHotelDetails(hotel.id)" class="view-details-btn">
                  {{ hotel.showDetails ? 'Hide Details' : 'View Details' }}
                </button>
              </div>
              <div v-if="hotel.showDetails" class="room-options">
                <div v-for="room in hotel.rooms" :key="room.id" class="room-option" @click="selectRoom(hotel, room)">
                  <input 
                    type="radio" 
                    :id="room.id" 
                    :value="{ hotel, room }" 
                    v-model="booking.hotelAndRoom"
                    class="room-radio"
                  >
                  <label :for="room.id" class="room-label">
                    <strong>{{ room.name }}</strong>
                    <p>₱{{ room.price }} per night</p>
                    <p>Capacity: {{ room.capacity }} pax</p>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Guest Information -->
        <div v-if="currentStep === 3" class="booking-step">
          <h2 class="step-title">Guest Information</h2>
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
              <select id="guests" v-model="booking.guests" required>
                <option v-for="n in (booking.hotelAndRoom ? booking.hotelAndRoom.room.capacity : 10)" :key="n" :value="n">
                  {{ n }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="form-navigation">
          <button 
            v-if="currentStep > 0" 
            @click="prevStep" 
            class="nav-button back-button"
          >
            <ArrowLeftIcon />
            Previous
          </button>
          <button 
            v-if="currentStep < steps.length - 1" 
            @click="nextStep" 
            class="nav-button next-button"
          >
            Next
            <ArrowRightIcon />
          </button>
          <button 
            v-if="currentStep === steps.length - 1" 
            @click="showSummaryModal" 
            class="nav-button confirm-button"
          >
            Review Booking
          </button>
        </div>
      </div>
    </div>

    <!-- Booking Summary Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <button class="close-btn" @click="showModal = false">
          <XIcon />
        </button>
        <h2>Booking Summary</h2>
        <div class="booking-summary">
          <div class="summary-item">
            <strong>Package:</strong> {{ booking.package.name }}
          </div>
          <div class="summary-item">
            <strong>Check-in:</strong> {{ formatDateTime(booking.checkInDate, booking.checkInTime) }}
          </div>
          <div class="summary-item">
            <strong>Hotel:</strong> {{ booking.hotelAndRoom ? booking.hotelAndRoom.hotel.name : 'Not selected' }}
          </div>
          <div class="summary-item">
            <strong>Room:</strong> {{ booking.hotelAndRoom ? booking.hotelAndRoom.room.name : 'Not selected' }}
          </div>
          <div class="summary-item">
            <strong>Guests:</strong> {{ booking.guests }}
          </div>
          <div class="summary-item">
            <strong>Total Price:</strong> ₱{{ calculateTotalPrice() }}
          </div>
          <div class="summary-item">
            <strong>Guest Name:</strong> {{ booking.guestName }}
          </div>
          <div class="summary-item">
            <strong>Email:</strong> {{ booking.email }}
          </div>
          <div class="summary-item">
            <strong>Phone:</strong> {{ booking.phone }}
          </div>
        </div>
        <button @click="confirmBooking" class="confirm-btn">
          Confirm Booking
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, XIcon } from 'lucide-vue-next';
import HeaderComponent from './Header.vue';
import Calendar from './CalendarUser.vue';

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
    name: "Island Explorer",
    description: "Great accommodation and Island Hopping with snorkeling options.",
    price: 5000
  },
  {
    id: 'package2',
    name: "Underwater Adventure",
    description: "Experience underwater adventures with our snorkeling tour.",
    price: 6000
  },
  {
    id: 'packageDiamond',
    name: "Diamond Experience",
    description: "Enjoy a memorable vacation with snorkeling, inland, and island tours.",
    price: 8000
  },
  {
    id: 'packageRuby',
    name: "Ruby Getaway",
    description: "Experience underwater adventures with our snorkeling tour.",
    price: 7000
  }
];

const hotels = reactive([
  {
    id: 'agbing',
    name: 'Agbing Seaside View Resort',
    description: 'Beachfront resort with free Wi-Fi, air conditioning, cable TV, and RestoBar.',
    image: '/placeholder.svg?height=200&width=300',
    showDetails: false,
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
    image: '/placeholder.svg?height=200&width=300',
    showDetails: false,
    rooms: [
      { id: 'luckeh-super-deluxe', name: 'Super Deluxe Room', capacity: 6, price: 3500 },
      { id: 'luckeh-deluxe', name: 'Deluxe Room', capacity: 4, price: 2500 }
    ]
  }
]);

const selectPackage = (pkg) => {
  booking.package = pkg;
};

const selectRoom = (hotel, room) => {
  booking.hotelAndRoom = { hotel, room };
  booking.guests = 1;
};

const toggleHotelDetails = (hotelId) => {
  const hotel = hotels.find(h => h.id === hotelId);
  if (hotel) {
    hotel.showDetails = !hotel.showDetails;
  }
};

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
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://fonts.googleapis.com/css2?family=Ephesis&display=swap');

.booking-container {
  margin-top: 2rem;
  max-height: 89vh;
  background-color: white;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.booking-form {
  font-family: 'Poppins', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
}

.booking-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 3rem;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 0 2rem;
  margin-top: -1rem;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.step-circle {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: white;
  border: 4px solid #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #6b7280;
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
}

.step-circle.active {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.step-circle.completed {
  background: #10b981;
  border-color: #10b981;
}

.step-name {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.step-line {
  position: absolute;
  top: 1.25rem;
  left: 50%;
  right: -50%;
  height: 2px;
  background: #e5e7eb;
  z-index: 0;
}

.step-line.active {
  background: #10b981;
}

.progress-step:last-child .step-line {
  display: none;
}

.booking-content {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2rem;
}

.package-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.package-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.package-card:hover {
  border-color: #10b981;
  transform: translateY(-2px);
}

.package-card.selected {
  background: #ecfdf5;
  border-color: #10b981;
}

.package-radio {
  align-self: flex-start;
  margin-bottom: 1rem;
}

.radio-outer {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.package-card.selected .radio-outer {
  border-color: #10b981;
}

.radio-inner {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  transform: scale(0);
  transition: all 0.2s ease;
}

.radio-inner.checked {
  background-color: #10b981;
  transform: scale(1);
}

.package-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.package-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.package-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  flex-grow: 1;
}

.package-price {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-top: 1rem;
}

.hotel-options {
  display: grid;
  gap: 2rem;
}

.hotel-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.2s ease;
}

.hotel-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hotel-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.hotel-info {
  padding: 1.5rem;
}

.hotel-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.hotel-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.view-details-btn {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.view-details-btn:hover {
  background-color: #059669;
}

.room-options {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.room-option {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  cursor: pointer;
}

.room-radio {
  margin-right: 1rem;
}

.room-label {
  flex: 1;
}

.guest-form {
  display: grid;
  gap: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.back-button {
  background: #f3f4f6;
  color: #4b5563;
}

.back-button:hover {
  background: #e5e7eb;
}

.next-button,
.confirm-button {
  background: #10b981;
  color: white;
}

.next-button:hover,
.confirm-button:hover {
  background: #059669;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.booking-summary {
  margin-top: 1.5rem;
}

.summary-item {
  margin-bottom: 0.75rem;
}

.confirm-btn {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  margin-top: 1rem;
}

.confirm-btn:hover {
  background-color: #059669;
}

@media (max-width: 640px) {
  .booking-form {
    padding: 1.5rem;
  }

  .progress-steps {
    flex-wrap: wrap;
  }

  .progress-step {
    flex-basis: 50%;
    margin-bottom: 1rem;
  }

  .package-list {
    grid-template-columns: 1fr;
  }

  .form-navigation {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-button {
    width: 100%;
    justify-content: center;
  }
}
</style>