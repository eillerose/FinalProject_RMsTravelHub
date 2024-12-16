<template>
  <div class="booking-container">
    <HeaderComponent />
    
    <div class="booking-form">
      <!-- Header Section with Title and Progress Steps -->
      <div class="booking-header">
        <h1 class="booking-title">Book Your Stay</h1>
        <div class="progress-steps">
          <div v-for="(step, index) in steps" :key="index" class="progress-step">
            <div 
              class="step-circle" 
              :class="{ 
                'active': index === currentStep, 
                'completed': index < currentStep 
              }"
            >
              <span v-if="index < currentStep">
                <CheckIcon class="check-icon" />
              </span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div 
              class="step-line" 
              :class="{ 'active': index < currentStep }"
            ></div>
            <span class="step-name">{{ step }}</span>
          </div>
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
                  <div v-if="pkg.pricingMode === 'fixed'" class="package-price">
                    ₱{{ pkg.fixedPrice }}
                  </div>
                  <div v-else-if="pkg.pricingMode === 'options'" class="package-price">
                    Options available
                  </div>
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
            <div class="hotel-selection-container">
              <div class="hotel-cards">
                <div v-for="hotel in hotels" :key="hotel.id" class="hotel-card">
                  <h3 class="hotel-name">{{ hotel.name }}</h3>
                  <p class="hotel-description">{{ hotel.description }}</p>
                  <button @click="showHotelDetails(hotel)" class="view-details-btn">
                    View Details
                  </button>
                </div>
              </div>
              
              <!-- Selected Room Display -->
              <div v-if="booking.hotelAndRoom" class="selected-room-card">
                <div class="selected-room-header">
                  {{ booking.hotelAndRoom.hotel.name }}
                </div>
                <div class="selected-room-content">
                  <p class="room-price">₱{{ booking.hotelAndRoom.room.price }} per night</p>
                  <p class="room-capacity">Capacity: {{ booking.hotelAndRoom.room.capacity }} pax</p>
                </div>
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
                    <input type="email" id="email" v-model="booking.email" required readonly>
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
                      @change="validateGuestCount"
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
          type="button"
        >
          <ArrowLeftIcon />
          Previous
        </button>
        <button 
          v-if="currentStep < steps.length - 1" 
          @click="nextStep" 
          class="nav-button next-button"
          type="button"
        >
          Next
          <ArrowRightIcon />
        </button>
        <button 
          v-if="currentStep === steps.length - 1" 
          @click="showSummaryView" 
          class="nav-button confirm-button"
          type="button"
        >
          Review Booking
        </button>
      </div>
    </div>

    <!-- Package Details Modal -->
    <div v-if="showPackageModal && selectedPackage?.pricingMode === 'options'" class="modal">
      <div class="modal-content package-modal">
        <button class="close-modal-btn" @click="closePackageModal">
          <XIcon />
        </button>
        
        <div class="package-modal-header">
          <h2 class="package-modal-title">{{ selectedPackage?.name }}</h2>
        </div>

        <div class="package-pricing-grid">
          <label 
            v-for="(option, index) in selectedPackage.options" 
            :key="index" 
            class="pricing-column"
            :class="{ 'selected': selectedPricingColumn === index }"
          >
            <input 
              type="radio" 
              :name="'pricing-column'" 
              :value="index" 
              v-model="selectedPricingColumn"
              class="pricing-radio"
            >
            <h3 class="accommodation-type">{{ option.name }}</h3>
            <ul class="price-list">
              <li v-for="(price, priceIndex) in option.pricing" :key="priceIndex">
                {{ price.paxRange }} – PHP {{ price.pricePerHead }}
              </li>
            </ul>
          </label>
        </div>

        <div class="package-modal-footer">
          <button @click="confirmPackageSelection" class="confirm-package-btn" :disabled="!canConfirmPackage">
            Select Package
          </button>
        </div>
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
            <p v-if="booking.package?.pricingMode === 'options'">
              <strong>Pricing Option:</strong> {{ booking.package?.selectedOption?.name }}
            </p>
            <p><strong>Check-in Date & Time:</strong> {{ formatDateTime(booking.checkInDate, booking.checkInTime) }}</p>
            <p><strong>Hotel:</strong> {{ booking.hotelAndRoom?.hotel.name }}</p>
            <p><strong>Room Type:</strong> {{ booking.hotelAndRoom?.room.type }}</p>
            <p><strong>Room Price:</strong> ₱{{ booking.hotelAndRoom?.room.price }} per night</p>
            <p><strong>Room Capacity:</strong> {{ booking.hotelAndRoom?.room.capacity }} pax</p>
          </div>

          <div class="summary-section">
            <h3>Bill Breakdown</h3>
            <p v-if="booking.package?.pricingMode === 'fixed'">
              <strong>Package Price:</strong> ₱{{ booking.package?.fixedPrice }}
            </p>
            <p v-else-if="booking.package?.pricingMode === 'options'">
              <strong>Package Price:</strong> ₱{{ calculatePackagePrice() }} (₱{{ getPerHeadPrice() }} per person x {{ booking.guests }} guests)
            </p>
            <p><strong>Room Price:</strong> ₱{{ booking.hotelAndRoom?.room.price }}</p>
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
import { ref, reactive, onMounted, computed } from 'vue';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, XIcon, UserIcon, MailIcon, PhoneIcon, UsersIcon } from 'lucide-vue-next';
import HeaderComponent from './Header.vue';
import Calendar from './CalendarUser.vue';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const currentStep = ref(0);
const showHotelModal = ref(false);
const showSummary = ref(false);
const selectedHotel = ref(null);
const steps = ['Package', 'Date & Time', 'Hotel & Room', 'Guest Info'];
const currentUser = ref(null);

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

const packages = ref([]);
const hotels = ref([]);

const showPackageModal = ref(false);
const selectedPackage = ref(null);
const selectedPricingColumn = ref(null);

onMounted(async () => {
  await fetchPackages();
  await fetchHotels();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser.value = user;
      booking.email = user.email;
      booking.guestName = user.displayName || '';
    } else {
      currentUser.value = null;
    }
  });
});

const fetchPackages = async () => {
  try {
    const packagesCollection = collection(db, 'packages');
    const packagesSnapshot = await getDocs(packagesCollection);
    packages.value = packagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      options: doc.data().options || [],
      fixedPrice: doc.data().fixedPrice || 0,
    }));
  } catch (error) {
    console.error("Error fetching packages:", error);
  }
};

const fetchHotels = async () => {
  try {
    const hotelsCollection = collection(db, 'hotels');
    const hotelsSnapshot = await getDocs(hotelsCollection);
    hotels.value = hotelsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching hotels:", error);
  }
};

const selectPackage = (pkg) => {
  if (pkg.pricingMode === 'fixed') {
    booking.package = {
      ...pkg,
      selectedOption: null
    };
    booking.guests = 1; // Reset guest count
    nextStep();
  } else if (pkg.pricingMode === 'options') {
    selectedPackage.value = pkg;
    selectedPricingColumn.value = null;
    showPackageModal.value = true;
  }
};

const closePackageModal = () => {
  showPackageModal.value = false;
  selectedPricingColumn.value = null;
};

const canConfirmPackage = computed(() => {
  if (!selectedPackage.value) return false;
  if (selectedPackage.value.pricingMode === 'fixed') return true;
  return selectedPricingColumn.value !== null;
});

const confirmPackageSelection = () => {
  if (canConfirmPackage.value) {
    booking.package = {
      ...selectedPackage.value,
      selectedOption: selectedPackage.value.options[selectedPricingColumn.value]
    };
    booking.guests = 1; // Reset guest count
    closePackageModal();
    nextStep();
  }
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
  let total = 0;
  if (booking.package) {
    if (booking.package.pricingMode === 'fixed') {
      total += parseFloat(booking.package.fixedPrice);
    } else if (booking.package.pricingMode === 'options' && booking.package.selectedOption) {
      const matchingPricing = booking.package.selectedOption.pricing.find(
        price => {
          const [min, max] = price.paxRange.split('-').map(Number);
          return booking.guests >= min && booking.guests <= max;
        }
      );
      if (matchingPricing) {
        total += parseFloat(matchingPricing.pricePerHead) * booking.guests;
      }
    }
  }
  if (booking.hotelAndRoom && booking.hotelAndRoom.room) {
    const roomPrice = booking.hotelAndRoom.room.price;
    if (typeof roomPrice === 'string') {
      total += parseFloat(roomPrice.replace('₱', '').replace(',', ''));
    } else if (typeof roomPrice === 'number') {
      total += roomPrice;
    }
  }
  return total.toFixed(2);
};

const calculatePackagePrice = () => {
  if (booking.package?.pricingMode === 'options' && booking.package?.selectedOption) {
    const matchingPricing = booking.package.selectedOption.pricing.find(
      price => {
        const [min, max] = price.paxRange.split('-').map(Number);
        return booking.guests >= min && booking.guests <= max;
      }
    );
    if (matchingPricing) {
      return (parseFloat(matchingPricing.pricePerHead) * booking.guests).toFixed(2);
    }
  }
  return '0.00';
};

const getPerHeadPrice = () => {
  if (booking.package?.pricingMode === 'options' && booking.package?.selectedOption) {
    const matchingPricing = booking.package.selectedOption.pricing.find(
      price => {
        const [min, max] = price.paxRange.split('-').map(Number);
        return booking.guests >= min && booking.guests <= max;
      }
    );
    if (matchingPricing) {
      return parseFloat(matchingPricing.pricePerHead).toFixed(2);
    }
  }
  return '0.00';
};

const confirmBooking = async () => {
  if (!currentUser.value) {
    alert("Please log in to make a booking.");
    return;
  }

  try {
    const bookingsCollection = collection(db, 'bookings');
    await addDoc(bookingsCollection, {
      userId: currentUser.value.uid,
      package: booking.package,
      checkInDate: booking.checkInDate,
      checkInTime: booking.checkInTime,
      hotel: booking.hotelAndRoom.hotel,
      room: booking.hotelAndRoom.room,
      guestName: booking.guestName,
      email: booking.email,
      phone: booking.phone,
      guests: booking.guests,
      totalPrice: calculateTotalPrice(),
      createdAt: new Date(),
      status: 'pending'
    });
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
    guestName: currentUser.value ? currentUser.value.displayName || '' : '',
    email: currentUser.value ? currentUser.value.email : '',
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

const validateGuestCount = () => {
  if (booking.package && booking.package.pricingMode === 'options') {
    const guestCount = booking.guests;
    const matchingPricing = booking.package.selectedOption.pricing.find(
      price => {
        const [min, max] = price.paxRange.split('-').map(Number);
        return guestCount >= min && guestCount <= max;
      }
    );
    if (!matchingPricing) {
      alert("The number of guests doesn't match any available options for this package. Please choose a different package or adjust the number of guests.");
      currentStep.value = 0; // Redirect to package selection
      return false;
    }
  }
  return true;
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
  max-width: 1800px;
}

.booking-form {
  max-width: 1500px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  position: relative;
  padding-bottom: 100px;
}

.booking-header {
  background-color: #006167;
  border-radius: 1rem;
  padding: 2rem;
  margin-top: -1rem;
  color: white;
}

.booking-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 2rem;
  margin-top: -1rem;
}

.progress-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.step-circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: transparent;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  background-color: #006167;
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
}

.step-circle.active {
  background: #00b7af;
  border-color: #00b7af;
  color: white;
}

.step-circle.completed {
  background: white;
  border-color: white;
}

.check-icon {
  color: green;
  width: 1.2rem;
  height: 1.2rem;
}

.step-name {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: white;
  font-weight: 500;
}

.step-line {
  position: absolute;
  top: 1.25rem;
  left: 50%;
  right: -50%;
  height: 2px;
  background: rgba(255, 255, 255, 0.4);
  z-index: 0;
}

.step-line.active {
  background: white;
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
  height: 450px;
}

.booking-steps {
  flex: 1;
  transition: all 0.3s ease;
  margin-top: -2rem;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
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
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.package-card:hover {
  border-color: #00b7af;
  transform: translateY(-2px);
}

.package-card.selected {
  background: #ecfdf5;
  border-color: #00b7af;
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
  border-color: #00b7af;
}

.radio-inner {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  transform: scale(0);
  transition: all 0.2s ease;
}

.radio-inner.checked {
  background-color: #00b7af;
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
  background-color: #d7eeda;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 500px;
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
  color: #00b7af;
}

.hotel-description {
  font-size: 0.875rem;
  color: #6b7280;
  max-width: 500px;
  margin-top: -1.5rem;
}

.view-details-btn {
  font-family: 'Poppins', sans-serif;
  background-color: #00b7af;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-details-btn:hover {
  background-color: #00b7af;
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
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 1rem 1.5rem;
}

.nav-button {
  font-family: 'Poppins', sans-serif;
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
  background: #006167;
  color: white;
}

.next-button:hover,
.confirm-button:hover {
  background: #006167;
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
  color: white;
  cursor: pointer;
  z-index: 10;
  padding: 0.5rem;
}

.hotel-header {
  background-color: #00b7af;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: white;
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
  border-color: #00b7af;
  transform: translateY(-2px);
}

.room-option.selected {
  border-color: #00b7af;
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
  border-color: #00b7af;
  background-color: #00b7af;
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
  color: #00b7af;
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
  color: #00b7af;
}

.confirm-btn {
  font-family: 'Poppins', sans-serif;
  background-color: #00b7af;
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
  background-color: #00b7af;
}

.package-modal {
  max-width: 1200px;
  padding: 0;
  background: white;
}

.package-modal-header {
  background: #006167;
  color: white;
  padding: 1.5rem 2rem;
  position: relative;
}

.package-modal-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
  font-family: 'Poppins', sans-serif;
}

.package-pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem;
  background: #f8fafc;
}

.pricing-column {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.pricing-column:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.pricing-column.selected {
  background-color: #E0F7FA;
}

.pricing-radio {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.pricing-radio:checked + .accommodation-type {
  color: #00b7af;
}

.accommodation-type {
  font-size: 1rem;
  font-weight: 600;
  color: #00b7af;
  margin-bottom: 1rem;
  text-align: center;
  min-height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.price-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.price-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #4a5568;
}

.price-list li:last-child {
  border-bottom: none;
}

.package-modal-footer {
  padding: 1.5rem;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: center;
}

.confirm-package-btn {
  background: #00b7af;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Poppins', sans-serif;
}

.confirm-package-btn:hover {
  background: #00897B;
  transform: translateY(-1px);
}

.confirm-package-btn:disabled {
  background: #A0AEC0;
  cursor: not-allowed;
}

.confirm-package-btn:disabled:hover {
  background: #A0AEC0;
  transform: none;
}

.hotel-selection-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.selected-room-card {
  background-color: #e5f6ff;
  border-radius: 0.5rem;
  overflow: hidden;
  width: 300px;
  margin: 1rem auto 0;
  margin-top: -.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.selected-room-header {
  background-color: #00b7af;
  color: white;
  padding: 0.75rem 1rem;
  font-weight: 600;
  text-align: center;
}

.selected-room-content {
  padding: 1rem;
  text-align: center;
}

.room-price {
  font-size: 1.25rem;
  font-weight: 600;
  color: #00b7af;
  margin-bottom: 0.5rem;
}

.room-capacity {
  color: #666;
  font-size: 0.875rem;
}

.package-fixed-price {
  padding: 2rem;
  text-align: center;
  background: #f8fafc;
}

.package-fixed-price h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #00b7af;
  margin-bottom: 1rem;
}

.fixed-price {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
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

  .package-pricing-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .package-modal-title {
    font-size: 1.5rem;
  }

  .accommodation-type {
    font-size: 0.875rem;
  }

  .price-list li {
    font-size: 0.8rem;
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
    font-family: 'Poppins', sans-serif;
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