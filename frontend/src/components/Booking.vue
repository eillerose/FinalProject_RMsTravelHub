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
        <div class="booking-steps">
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
            <div class="hotel-cards">
              <div v-for="hotel in hotels" :key="hotel.id" class="hotel-card">
                <div class="hotel-image-wrapper">
                  <img :src="hotel.image" :alt="hotel.name" class="hotel-image">
                </div>
                <h3 class="hotel-name">{{ hotel.name }}</h3>
                <p class="hotel-description">{{ hotel.description }}</p>
                <button @click="showHotelDetails(hotel)" class="view-details-btn">
                  View Details
                </button>
              </div>
            </div>
          </div>

          <!-- Step 4: Guest Information -->
          <div v-if="currentStep === 3" class="booking-step">
            <h2 class="step-title">Guest Information</h2>
            <div class="form-container">
              <div class="guest-form">
                <div class="input-group">
                  <label for="full-name">Full Name</label>
                  <div class="input-with-icon">
                    <UserIcon class="input-icon" />
                    <input type="text" id="full-name" v-model="booking.guestName" required>
                  </div>
                </div>
                <div class="input-group">
                  <label for="email">Email</label>
                  <div class="input-with-icon">
                    <MailIcon class="input-icon" />
                    <input type="email" id="email" v-model="booking.email" required>
                  </div>
                </div>
                <div class="input-group">
                  <label for="phone">Phone Number</label>
                  <div class="input-with-icon">
                    <PhoneIcon class="input-icon" />
                    <input type="tel" id="phone" v-model="booking.phone" required>
                  </div>
                </div>
                <div class="input-group">
                  <label for="guests">Number of Guests</label>
                  <div class="input-with-icon">
                    <UsersIcon class="input-icon" />
                    <input 
                      type="number" 
                      id="guests" 
                      v-model="booking.guests" 
                      min="1" 
                      required
                    >
                  </div>
                </div>
              </div>
            </div>
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
          @click="showSummaryView" 
          class="nav-button confirm-button"
        >
          Review Booking
        </button>
      </div>
    </div>

    <!-- Hotel Details Modal -->
    <div v-if="showHotelModal" class="modal">
      <div class="modal-content hotel-modal">
        <button class="close-modal-btn" @click="closeHotelModal">
          <XIcon />
        </button>
        
        <div class="hotel-header">
          <img 
            :src="selectedHotel?.image || '/placeholder.svg?height=120&width=120'" 
            :alt="selectedHotel?.name"
            class="hotel-header-image"
          />
          <div class="hotel-header-content">
            <h2 class="hotel-header-title">{{ selectedHotel?.name }}</h2>
            <p class="hotel-header-description">{{ selectedHotel?.description }}</p>
          </div>
        </div>
        
        <div class="room-grid">
          <label 
            v-for="room in selectedHotel?.rooms" 
            :key="room.id" 
            class="room-option"
            :class="{ 'selected': booking.hotelAndRoom?.room?.id === room.id }"
          >
            <input 
              type="radio" 
              :name="'room-selection'" 
              :value="{ hotel: selectedHotel, room }" 
              v-model="booking.hotelAndRoom"
              @change="selectRoom(selectedHotel, room)"
              class="room-radio"
            >
            <div class="room-content">
              <span class="room-name">{{ room.name }}</span>
              <div class="room-details">
                <span class="room-price">₱{{ room.price }} per night</span>
                <span class="room-capacity">Capacity: {{ room.capacity }} pax</span>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Booking Summary Modal -->
    <div v-if="showSummary" class="modal">
      <div class="modal-content booking-summary-modal">
        <button class="close-modal-btn" @click="closeSummaryModal">
          <XIcon />
        </button>
        <h2 class="summary-title">Booking Summary</h2>
        <div class="summary-content">
          <div class="summary-section">
            <h3>Guest Information</h3>
            <p><strong>Guest Name:</strong> {{ booking.guestName }}</p>
            <p><strong>Contact Email:</strong> {{ booking.email }}</p>
            <p><strong>Contact Phone:</strong> {{ booking.phone }}</p>
            <p><strong>Guests Count:</strong> {{ booking.guests }}</p>
          </div>

          <div class="summary-section">
            <h3>Package Details</h3>
            <p><strong>Package:</strong> {{ booking.package?.name }}</p>
            <p><strong>Check-in Date & Time:</strong> {{ formatDateTime(booking.checkInDate, booking.checkInTime) }}</p>
            <p><strong>Hotel:</strong> {{ booking.hotelAndRoom?.hotel.name }}</p>
            <p><strong>Room Type:</strong> {{ booking.hotelAndRoom?.room.name }}</p>
          </div>

          <div class="summary-total">
            <p>Total: <span class="price">₱{{ calculateTotalPrice() }}</span></p>
          </div>

          <button @click="confirmBooking" class="confirm-btn">
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, XIcon, UserIcon, MailIcon, PhoneIcon, UsersIcon } from 'lucide-vue-next';
import HeaderComponent from './Header.vue';
import Calendar from './CalendarUser.vue';

const currentStep = ref(0);
const showHotelModal = ref(false);
const showSummary = ref(false);
const selectedHotel = ref(null);
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
    image: '/src/img/Agbing Seaside View Resort.jpg',
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
    image: '/src/img/Luckeh 5J Beach Resort.jpg',
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
  closeHotelModal();
};

const showHotelDetails = (hotel) => {
  selectedHotel.value = hotel;
  showHotelModal.value = true;
};

const closeHotelModal = () => {
  showHotelModal.value = false;
  selectedHotel.value = null;
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

const showSummaryView = () => {
  if (!isGuestInfoValid()) {
    alert('Please fill in all guest information fields.');
    return;
  }
  showSummary.value = true;
};

const closeSummaryModal = () => {
  showSummary.value = false;
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
  } catch (error) {
    console.error("Error creating booking:", error);
    alert("There was an error creating the booking. Please try again later.");
  }
};

const resetForm = () => {
  currentStep.value = 0;
  showSummary.value = false;
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
  font-family: 'Poppins', sans-serif;
}

.booking-form {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  position: relative;
  padding-bottom: 100px; /* Add space for the form navigation */
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
  z-index: 1;
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
  display: flex;
  transition: all 0.3s ease;
  height: 500px; /* Set a fixed height for the content */
  overflow-y: auto; /* Add vertical scrolling if content exceeds the height */
}

.booking-steps {
  flex: 1;
  transition: all 0.3s ease;
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

.hotel-cards {
  display: flex;
  justify-content: center;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  flex-wrap: nowrap;
}

.hotel-card {
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 450px;
  max-width: 100%;
}

.hotel-image-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.hotel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hotel-name {
  font-size: 1.5rem;
  font-weight: 600;
  color:#10b981;
  margin-bottom: 0.75rem;
}

.hotel-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  max-width: 400px;
}

.view-details-btn {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-details-btn:hover {
  background-color: #10b981;
  transform: translateY(-2px);
}

.guest-form {
  display: grid;
  gap: 1.5rem;
}

.form-container {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  max-width: 500px;
  margin: 0 auto;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  text-align: left;
}

.input-with-icon {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.input-group input,
.input-group select {
  width: 90%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  text-align: left;
}

.input-group select {
  padding-left: 0.75rem;
  min-width: 101%;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  padding-top: 1.5rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 1rem 2rem;
  
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
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 1rem;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 2rem;
}

.hotel-modal {
  max-width: 800px;
  padding: 0;
  overflow: hidden;
}

.close-modal-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #4b5563;
  cursor: pointer;
  z-index: 10;
  padding: 0.5rem;
}

.hotel-header {
  background-color: #10b981;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.hotel-header-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
}

.hotel-header-content {
  flex: 1;
}

.hotel-header-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.hotel-header-description {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 2rem;
  background: #f8fafc;
}

.room-option {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.2s ease;
}

.room-option:hover {
  border-color: #10b981;
  transform: translateY(-2px);
}

.room-option.selected {
  border-color: #10b981;
  background-color: #E0F7FA;
}

.room-radio {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  margin-top: 0.25rem;
  position: relative;
  transition: all 0.2s ease;
}

.room-radio:checked {
  border-color: #10b981;
  background-color: #10b981;
}

.room-radio:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.5rem;
  height: 0.5rem;
  background-color: white;
  border-radius: 50%;
}

.room-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.room-name {
  font-weight: 600;
  color: #1e293b;
}

.room-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #64748b;
}

.room-price {
  color: #10b981;
  font-weight: 500;
}

.booking-summary-modal {
  max-width: 500px;
  padding: 2rem;
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
}

.summary-content {
  font-size: 0.875rem;
  color: #4b5563;
}

.summary-section {
  margin-top: 1rem;
  border-top: 1px solid #d1d5db;
  padding-top: 1.5rem;
}

.summary-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.summary-total {
  margin-top: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.price {
  color: #10b981;
}

.confirm-btn {
  font-family: 'Poppins', sans-serif;
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  margin-top: 1.5rem;
}

.confirm-btn:hover {
  background-color: #059669;
}

@media (max-width: 768px) {
  .booking-content {
    flex-direction: column;
  }

  .booking-steps,
  .booking-summary {
    flex: 1 1 auto;
    width: 100%;
  }

  .room-grid {
    grid-template-columns: 1fr;
  }

  .hotel-header {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .hotel-header-image {
    width: 100px;
    height: 100px;
  }
}

@media (max-width: 1024px) {
  .hotel-cards {
    flex-direction: column;
    align-items: center;
  }

  .hotel-card {
    width: 100%;
    max-width: 450px;
  }
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

  .hotel-card {
    padding: 1.5rem;
  }

  .hotel-image-wrapper {
    width: 100px;
    height: 100px;
  }

  .hotel-name {
    font-size: 1.25rem;
  }

  .form-navigation {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-button {
    width: 100%;
    justify-content: center;
  }

  .modal-content {
    width: 95%;
    margin: 1rem;
    padding: 1.5rem;
  }
}

@media (min-width: 640px) {
  .input-group select {
    width: 50%;
    max-width: 200px;
  }
}
</style>

