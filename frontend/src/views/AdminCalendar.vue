<template>
  <div class="calendar-container">
    <div class="calendar-section">
      <div class="calendar-header">
        <h2 class="current-month">{{ currentMonthYear }}</h2>
        <div class="calendar-navigation">
          <button @click="previousMonth" class="nav-button">
            <ChevronLeft class="icon" />
          </button>
          <button @click="nextMonth" class="nav-button">
            <ChevronRight class="icon" />
          </button>
        </div>
      </div>

      <div class="calendar-grid">
        <div v-for="day in daysOfWeek" :key="day" class="calendar-day-header">
          {{ day }}
        </div>
        <div
          v-for="{ date, isCurrentMonth, bookings } in calendarDays"
          :key="date.toISOString()"
          :class="[
            'calendar-day',
            { 
              'current-month': isCurrentMonth,
              'today': isToday(date),
              'has-bookings': bookings.length > 0,
              'selected': isSelectedDate(date)
            }
          ]"
          @click="selectDate(date)"
        >
          <span class="date-number">{{ date.getDate() }}</span>
          <div v-if="bookings.length > 0" class="booking-indicator">
            {{ bookings.length }}
          </div>
        </div>
      </div>
    </div>

    <div class="events-section">
      <h3 class="events-header">
        Bookings for {{ selectedDateFormatted }}
      </h3>

      <div v-if="selectedDateBookings.length > 0" class="events-list">
        <div v-for="booking in selectedDateBookings" :key="booking.id" class="event-item" @click="openBookingModal(booking)">
          <div class="event-content" :class="booking.status.toLowerCase()">
            <div class="event-image">
              <img :src="booking.package?.imageUrl || '/placeholder.svg?height=60&width=60'" alt="Event" />
            </div>
            
            <div class="event-details">
              <div class="event-title">
                {{ booking.guestName }}
                <span :class="['status-indicator', booking.status.toLowerCase()]">
                  {{ booking.status }}
                </span>
              </div>
              <div class="event-info">
                <p><strong>Package:</strong> {{ booking.package?.name }}</p>
                <p><strong>Check-in:</strong> {{ formatTime(booking.checkInTime) }}</p>
                <p><strong>Guests:</strong> {{ booking.guests }}</p>
                <p><strong>Total:</strong> ₱{{ booking.totalPrice?.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="no-events">
        No bookings for this date
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">&times;</button>
        <h2 class="modal-title">Booking Details</h2>
        <div v-if="selectedBooking" class="modal-body">
          <div class="booking-section">
            <h3>Guest Information</h3>
            <p><strong>Name:</strong> {{ selectedBooking.guestName }}</p>
            <p><strong>Email:</strong> {{ selectedBooking.email }}</p>
            <p><strong>Phone:</strong> {{ selectedBooking.phone }}</p>
            <p><strong>Guests:</strong> {{ selectedBooking.guests }}</p>
          </div>

          <div class="booking-section">
            <h3>Booking Details</h3>
            <p><strong>Check-in Date:</strong> {{ formatDate(selectedBooking.checkInDate) }}</p>
            <p><strong>Check-in Time:</strong> {{ selectedBooking.checkInTime }}</p>
            <p><strong>Status:</strong> <span :class="['status-indicator', selectedBooking.status.toLowerCase()]">{{ selectedBooking.status }}</span></p>
            <p><strong>Total Price:</strong> ₱{{ selectedBooking.totalPrice?.toLocaleString() }}</p>
          </div>

          <div v-if="selectedBooking.package" class="booking-section">
            <h3>Package Information</h3>
            <p><strong>Name:</strong> {{ selectedBooking.package.name }}</p>
            <p><strong>Description:</strong> {{ selectedBooking.package.description }}</p>
            <div v-if="selectedBooking.package.components">
              <h4>Package Components:</h4>
              <ul>
                <li v-for="component in selectedBooking.package.components" :key="component.id">
                  {{ component.name }} ({{ component.type }})
                </li>
              </ul>
            </div>
          </div>

          <div v-if="selectedBooking.hotel" class="booking-section">
            <h3>Hotel Information</h3>
            <p><strong>Name:</strong> {{ selectedBooking.hotel.name }}</p>
            <p><strong>Location:</strong> {{ selectedBooking.hotel.location }}</p>
            <div v-if="selectedBooking.room">
              <h4>Room Details:</h4>
              <p><strong>Type:</strong> {{ selectedBooking.room.type }}</p>
              <p><strong>Capacity:</strong> {{ selectedBooking.room.capacity }}</p>
              <p><strong>Price:</strong> ₱{{ selectedBooking.room.price?.toLocaleString() }}</p>
            </div>
          </div>

          <div v-if="selectedBooking.tourGuide" class="booking-section">
            <h3>Tour Guide</h3>
            <p><strong>Name:</strong> {{ selectedBooking.tourGuide.name }}</p>
            <p><strong>Specialization:</strong> {{ selectedBooking.tourGuide.specialization }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, query, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const currentDate = ref(new Date());
const selectedDate = ref(new Date());
const bookings = ref([]);
const isModalOpen = ref(false);
const selectedBooking = ref(null);

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});

const selectedDateFormatted = computed(() => {
  return selectedDate.value.toLocaleString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Adjust to start week on Monday

  const days = [];

  // Previous month days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({ date, isCurrentMonth: false, bookings: getBookingsForDate(date) });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    days.push({ date, isCurrentMonth: true, bookings: getBookingsForDate(date) });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({ date, isCurrentMonth: false, bookings: getBookingsForDate(date) });
  }

  return days;
});

const selectedDateBookings = computed(() => {
  return bookings.value.filter(booking => {
    const bookingDate = booking.checkInDate.toDate();
    return bookingDate.toDateString() === selectedDate.value.toDateString() &&
           (booking.status === 'Pending' || booking.status === 'Approved');
  }).sort((a, b) => {
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    return a.checkInTime.localeCompare(b.checkInTime);
  });
});

function previousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
}

function selectDate(date) {
  selectedDate.value = date;
}

function getBookingsForDate(date) {
  return bookings.value.filter(booking => {
    const bookingDate = booking.checkInDate.toDate();
    return bookingDate.toDateString() === date.toDateString() &&
           (booking.status === 'Pending' || booking.status === 'Approved');
  });
}

function isSelectedDate(date) {
  return date.toDateString() === selectedDate.value.toDateString();
}

function isToday(date) {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function formatTime(time) {
  if (!time) return 'N/A';
  const [hours, minutes] = time.split(':');
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}

function formatDate(date) {
  if (date && date.toDate) {
    return date.toDate().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  return 'N/A';
}

function openBookingModal(booking) {
  selectedBooking.value = booking;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  selectedBooking.value = null;
}

async function fetchBookings() {
  try {
    const bookingsCollection = collection(db, 'bookings');
    const querySnapshot = await getDocs(bookingsCollection);
    bookings.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      checkInDate: doc.data().checkInDate,
      checkInTime: doc.data().checkInTime,
      createdAt: doc.data().createdAt,
      email: doc.data().email,
      guestName: doc.data().guestName,
      guests: doc.data().guests,
      hotel: doc.data().hotel,
      package: doc.data().package,
      phone: doc.data().phone,
      room: doc.data().room,
      status: doc.data().status || 'Pending',
      totalPrice: doc.data().totalPrice,
      tourGuide: doc.data().tourGuide,
      updatedAt: doc.data().updatedAt,
      userId: doc.data().userId
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
}

onMounted(() => {
  fetchBookings();
});
</script>

<style scoped>
.calendar-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8fafc;
  min-height: calc(100vh - 4rem);
}

.calendar-section, .events-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #0a8d88;
  color: white;
}

.current-month {
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.calendar-navigation {
  display: flex;
  gap: 0.5rem;
}

.nav-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.icon {
  width: 20px;
  height: 20px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e2e8f0;
  padding: 1px;
}

.calendar-day-header {
  background: #f1f5f9;
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-weight: 600;
  color: #64748b;
  font-size: 0.875rem;
}

.calendar-day {
  background: white;
  min-height: 100px;
  padding: 0.5rem;
  position: relative;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.calendar-day:hover {
  background: #f1f5f9;
}

.calendar-day.today {
  background: #e0f2fe;
}

.calendar-day.selected {
  background: #0a8d88;
  color: white;
}

.calendar-day:not(.current-month) {
  color: #cbd5e1;
}

.date-number {
  font-size: 1rem;
  font-weight: 500;
}

.booking-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #0a8d88;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.events-section {
  padding: 1.5rem;
}

.events-header {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: calc(100vh - 12rem);
  overflow-y: auto;
}

.event-item {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
}

.event-content {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.event-content.pending {
  background-color: #fff7ed;
}

.event-content.approved {
  background-color: #f0fdf4;
}

.event-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-details {
  flex: 1;
}

.event-title {
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-indicator {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.status-indicator.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-indicator.approved {
  background: #d1fae5;
  color: #065f46;
}

.event-info {
  font-size: 0.875rem;
  color: #475569;
}

.event-info p {
  margin: 0.25rem 0;
}

.no-events {
  text-align: center;
  color: #64748b;
  padding: 2rem;
  font-style: italic;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #0f172a;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.booking-section {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
}

.booking-section:last-child {
  border-bottom: none;
}

.booking-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #0f172a;
}

.booking-section h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #0f172a;
}

.booking-section p {
  margin: 0.5rem 0;
  color: #475569;
}

.booking-section ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-top: 0.5rem;
}

@media (max-width: 1024px) {
  .calendar-container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .calendar-day {
    min-height: 80px;
  }
}

@media (max-width: 640px) {
  .calendar-header {
    padding: 1rem;
  }

  .current-month {
    font-size: 1.25rem;
  }

  .calendar-day {
    min-height: 60px;
    padding: 0.25rem;
  }

  .date-number {
    font-size: 0.875rem;
  }

  .event-content {
    flex-direction: column;
  }

  .event-image {
    width: 100%;
    height: 120px;
  }

  .modal-content {
    padding: 1rem;
  }
}
</style>

