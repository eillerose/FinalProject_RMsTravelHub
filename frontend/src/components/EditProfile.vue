<template>
  <div class="user-profile">
    <HeaderComponent />
    <h1 class="page-title">My Account</h1>
    
    <!-- Navigation Tabs -->
    <div class="nav-tabs">
      <a href="#" class="tab" :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">Profile</a>
      <a href="#" class="tab" :class="{ active: activeTab === 'history' }" @click="activeTab = 'history'">History</a>
      <a href="#" class="tab" :class="{ active: activeTab === 'archive' }" @click="activeTab = 'archive'">Archive</a>
    </div>

     <!-- User Profile Section -->
     <div v-if="activeTab === 'profile'">
      <div class="profile-container">
        <div class="profile-left">
          <div class="profile-image-container" @click="triggerFileInput">
            <div class="profile-image">
              <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile Image" />
              <div v-else class="image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
            <div class="camera-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
          </div>
          <input
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            accept="image/*"
            class="hidden"
          />
          <h2 class="user-name">{{ firstName }} {{ lastName }}</h2>
          <p class="user-bio">{{ bio || 'Add your bio here' }}</p>
        </div>
        
        <div class="profile-right">
          <div class="form-container">
            <div class="user-info">
              <div class="name-row">
                <div class="form-group">
                  <label for="first-name">First Name</label>
                  <input v-model="firstName" type="text" id="first-name" placeholder="Add the first name here" readonly class="first-name-input">
                </div>
                <div class="form-group">
                  <label for="last-name">Last Name</label>
                  <input v-model="lastName" type="text" id="last-name" placeholder="Add the last name here" readonly class="last-name-input">
                </div>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input v-model="email" type="email" id="email" placeholder="Add the email here" readonly>
              </div>
              <div class="form-group">
                <label for="address">Address</label>
                <input v-model="address" type="text" id="address" placeholder="Add the address here" readonly>
              </div>
              <div class="form-group">
                <label for="phone-number">Phone Number</label>
                <input v-model="phoneNumber" type="tel" id="phone-number" placeholder="Add the phone number here" readonly>
              </div>
            </div>
            <button @click="openModal" class="edit-profile-btn">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>

    <!-- History Tab Content -->
    <div v-if="activeTab === 'history'" class="history-content">
      <div class="history-header">
        <h2>Booking History</h2>
        <div class="history-controls">
          <div class="entries-control">
            Show 
            <select v-model="entriesPerPage">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            entries
          </div>
          <div class="search-control">
            <input type="text" v-model="searchQuery" placeholder="Search bookings...">
          </div>
        </div>
      </div>

      <div class="booking-table-container">
        <table class="booking-table">
          <thead>
            <tr>
              <th>Guest Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Check-in Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in paginatedBookings" :key="booking.id">
              <td>{{ booking.guestName }}</td>
              <td>{{ booking.email }}</td>
              <td>
                <span :class="['status-badge', booking.status.toLowerCase()]">
                  {{ booking.status }}
                </span>
              </td>
              <td>{{ formatDateTime(booking.checkInDate) }}</td>
              <td>
                <button class="view-details-btn" @click="viewBookingDetails(booking)">
                  View Details
                </button>
                <button 
                  v-if="canEditBooking(booking) && booking.status !== 'Cancelled' && booking.status !== 'Completed'" 
                  @click="openEditBookingModal(booking)" 
                  class="edit-booking-btn"
                >
                  Edit
                </button>
                <button 
                  v-if="booking.status === 'Approved' || (canCancelBooking(booking) && booking.status !== 'Cancelled' && booking.status !== 'Completed')" 
                  @click="cancelBooking(booking)" 
                  class="cancel-booking-btn"
                >
                  Cancel
                </button>
                <button 
                  v-if="booking.status === 'Completed'"
                  @click="showReceipt(booking.receiptId)"
                  class="show-receipt-btn"
                >
                  Show Receipt
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredBookings.length === 0" class="no-bookings">
        No bookings found for the selected criteria.
      </div>
      
      <!-- Pagination -->
      <div v-if="filteredBookings.length > 0" class="pagination">
        <div class="pagination-info">
          Showing {{ paginationStart + 1 }} to {{ paginationEnd }} of {{ filteredBookings.length }} entries
        </div>
        <div class="pagination-controls">
          <button 
            :disabled="currentPage === 1" 
            @click="currentPage--"
            class="pagination-btn"
          >
            Previous
          </button>
          <span class="page-numbers">
            <button 
              v-for="page in totalPages" 
              :key="page"
              :class="['page-btn', { active: currentPage === page }]"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
          </span>
          <button 
            :disabled="currentPage === totalPages" 
            @click="currentPage++"
            class="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Archive Tab Content -->
    <div v-if="activeTab === 'archive'" class="archive-content">
      <div class="archive-header">
        <h2>Archived Bookings</h2>
        <div class="archive-controls">
          <div class="entries-control">
            Show 
            <select v-model="entriesPerPage">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            entries
          </div>
          <div class="search-control">
            <label>Search: </label>
            <input type="text" v-model="searchQuery" placeholder="Search archived bookings...">
          </div>
        </div>
      </div>

      <div class="booking-table-container">
        <table class="booking-table">
          <thead>
            <tr>
              <th>Guest Name</th>
              <th>Email</th>
              <th>Original Check-in Date</th>
              <th>Cancellation Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in paginatedArchivedBookings" :key="booking.id">
              <td>{{ booking.guestName }}</td>
              <td>{{ booking.email }}</td>
              <td>{{ formatDateTime(booking.checkInDate) }}</td>
              <td>{{ formatDateTime(booking.cancellationDate) }}</td>
              <td>
                <button class="view-details-btn" @click="viewBookingDetails(booking)">
                  View Details
                </button>
                <button 
                  @click="openRestoreBookingModal(booking)" 
                  class="restore-booking-btn"
                >
                  Restore
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredArchivedBookings.length === 0" class="no-bookings">
        No archived bookings found for the selected criteria.
      </div>
      
      <!-- Pagination for Archived Bookings -->
      <div v-if="filteredArchivedBookings.length > 0" class="pagination">
        <div class="pagination-info">
          Showing {{ archivePaginationStart + 1 }} to {{ archivePaginationEnd }} of {{ filteredArchivedBookings.length }} entries
        </div>
        <div class="pagination-controls">
          <button 
            :disabled="archiveCurrentPage === 1" 
            @click="archiveCurrentPage--"
            class="pagination-btn"
          >
            Previous
          </button>
          <span class="page-numbers">
            <button 
              v-for="page in archiveTotalPages" 
              :key="page"
              :class="['page-btn', { active: archiveCurrentPage === page }]"
              @click="archiveCurrentPage = page"
            >
              {{ page }}
            </button>
          </span>
          <button 
            :disabled="archiveCurrentPage === archiveTotalPages" 
            @click="archiveCurrentPage++"
            class="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>Edit Profile</h2>
        <form @submit.prevent="saveProfile" class="edit-form">
          <div class="form-fields">
            <div class="personal-info">
              <div class="form-row">
                <div class="form-group">
                  <label for="edit-first-name">First Name</label>
                  <input 
                    v-model="firstName"
                    type="text"
                    id="edit-first-name"
                    placeholder="Enter first name"
                    required
                    class="first-name-input"
                  />
                </div>
                <div class="form-group">
                  <label for="edit-last-name">Last Name</label>
                  <input 
                    v-model="lastName"
                    type="text"
                    id="edit-last-name"
                    placeholder="Enter last name"
                    required
                    class="last-name-input"
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="edit-email">Email</label>
                <input 
                  v-model="email"
                  type="email"
                  id="edit-email"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div class="form-group">
                <label for="edit-address">Address</label>
                <input 
                  v-model="address"
                  type="text"
                  id="edit-address"
                  placeholder="Enter address"
                />
              </div>
              <div class="form-group">
                <label for="edit-phone-number">Phone Number</label>
                <input 
                  v-model="phoneNumber"
                  type="tel"
                  id="edit-phone-number"
                  placeholder="Enter phone number"
                />
              </div>
              <div class="form-group">
                <label for="edit-bio">Bio</label>
                <textarea 
                  v-model="bio"
                  id="edit-bio"
                  placeholder="Enter bio"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <button type="submit" class="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="selectedBooking" class="modal">
      <div class="modal-content booking-details">
        <span class="close" @click="selectedBooking = null">&times;</span>
        <h2>Booking Details</h2>
        <div class="booking-details-content">
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">{{ selectedBooking.guestName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{ selectedBooking.email }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone Number:</span>
            <span class="detail-value">{{ selectedBooking.phone }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Check-in Date:</span>
            <span class="detail-value">{{ formatDateTime(selectedBooking.checkInDate) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Check-in Time:</span>
            <span class="detail-value">{{ selectedBooking.checkInTime }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Hotel:</span>
            <span class="detail-value">{{ selectedBooking.hotel.name }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Room:</span>
            <span class="detail-value">{{ selectedBooking.room.type }} (Capacity: {{ selectedBooking.room.capacity }})</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Number of Guests:</span>
            <span class="detail-value">{{ selectedBooking.guests }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value">{{ selectedBooking.status }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Total Price:</span>
            <span class="detail-value">₱{{ selectedBooking.totalPrice.toLocaleString() }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Booking Created:</span>
            <span class="detail-value">{{ formatDateTime(selectedBooking.createdAt) }}</span>
          </div>
          <div v-if="selectedBooking.cancellationDate" class="detail-row">
            <span class="detail-label">Cancellation Date:</span>
            <span class="detail-value">{{ formatDateTime(selectedBooking.cancellationDate) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="editingBooking" class="edit-booking-modal">
  <div class="edit-booking-content">
    <div class="edit-booking-header">
      <h2>Edit Booking</h2>
      <button class="close-button" @click="closeEditBookingModal">&times;</button>
    </div>
    
    <form @submit.prevent="saveEditedBooking" class="edit-booking-form">
      <div class="form-field">
        <label>Check-in Date</label>
        <div class="input-wrapper">
          <input 
            v-model="editingBooking.checkInDate"
            type="date"
            required
            placeholder="mm/dd/yyyy"
          />
          <span class="calendar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </span>
        </div>
      </div>

      <div class="form-field">
        <label>Check-in Time</label>
        <div class="input-wrapper">
          <input 
            v-model="editingBooking.checkInTime"
            type="time"
            required
          />
          <span class="time-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
          </span>
        </div>
      </div>

      <div class="form-field">
        <label>Number of Guests</label>
        <div class="input-wrapper">
          <select 
            v-model.number="editingBooking.guests"
            required
          >
            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
          </select>
          <span class="guests-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </span>
        </div>
      </div>

      <button type="submit" class="save-changes-btn">
        Save Changes
      </button>
    </form>
  </div>
</div>

    <!-- Restore Booking Modal -->
  <div v-if="restoringBooking" class="restore-booking-modal">
    <div class="restore-booking-content">
      <div class="restore-booking-header">
        <h2>Restore Booking</h2>
        <button class="close-button" @click="closeRestoreBookingModal">&times;</button>
      </div>
      
      <form @submit.prevent="restoreBooking" class="restore-booking-form">
        <div class="form-field">
          <label>New Check-in Date</label>
          <div class="input-wrapper">
            <input 
              v-model="restoringBooking.newCheckInDate"
              type="date"
              required
              placeholder="dd/mm/yyyy"
            />
            <span class="calendar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </span>
          </div>
        </div>

        <div class="form-field">
          <label>New Check-in Time</label>
          <div class="input-wrapper">
            <input 
              v-model="restoringBooking.newCheckInTime"
              type="time"
              required
            />
            <span class="time-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </span>
          </div>
        </div>

        <button type="submit" class="save-changes-btn">
          Save Changes
        </button>
      </form>
    </div>
  </div>


    <!-- Receipt Modal -->
    <div v-if="selectedReceipt" class="modal">
      <div class="modal-content receipt-details">
        <span class="close" @click="selectedReceipt = null">&times;</span>
        <h2>Booking Receipt</h2>
        <div class="receipt-content">
          <div class="detail-row">
            <span class="detail-label">Receipt ID:</span>
            <span class="detail-value">{{ selectedReceipt.id }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Booking ID:</span>
            <span class="detail-value">{{ selectedReceipt.bookingId }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Guest Name:</span>
            <span class="detail-value">{{ selectedReceipt.guestName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Check-in Date:</span>
            <span class="detail-value">{{ formatDate(selectedReceipt.checkInDate) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Check-in Time:</span>
            <span class="detail-value">{{ selectedReceipt.checkInTime }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Hotel:</span>
            <span class="detail-value">{{ selectedReceipt.hotelName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Room Type:</span>
            <span class="detail-value">{{ selectedReceipt.roomType }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Package:</span>
            <span class="detail-value">{{ selectedReceipt.packageName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tour Guide:</span>
            <span class="detail-value">{{ selectedReceipt.tourGuideName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Total Amount:</span>
            <span class="detail-value">{{ formatCurrency(selectedReceipt.totalAmount) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Remit Amount:</span>
            <span class="detail-value">{{ formatCurrency(selectedReceipt.remitAmount) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Generated At:</span>
            <span class="detail-value">{{ formatDate(selectedReceipt.generatedAt) }}</span>
          </div>
        </div>
        <div class="receipt-actions">
          <button @click="generatePDF(selectedReceipt)" class="download-receipt-btn">
            Download PDF
          </button>
        </div>
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc, updateDoc, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { jsPDF } from 'jspdf';
import HeaderComponent from './Header.vue';
import FooterComponent from './Footer.vue';

const activeTab = ref('profile');
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const phoneNumber = ref('');
const address = ref('');
const bio = ref('');
const profileImageUrl = ref('');
const isModalOpen = ref(false);
const bookings = ref([]);
const archivedBookings = ref([]);
const currentPage = ref(1);
const archiveCurrentPage = ref(1);
const entriesPerPage = ref(5);
const searchQuery = ref('');
const selectedBooking = ref(null);
const editingBooking = ref(null);
const restoringBooking = ref(null);
const selectedReceipt = ref(null);
const fileInput = ref(null);

const filteredBookings = computed(() => {
  if (!searchQuery.value) return bookings.value;
  
  const query = searchQuery.value.toLowerCase();
  return bookings.value.filter(booking => 
    (booking.guestName && booking.guestName.toLowerCase().includes(query)) ||
    (booking.email && booking.email.toLowerCase().includes(query)) ||
    (booking.status && booking.status.toLowerCase().includes(query)) ||
    formatDateTime(booking.checkInDate).toLowerCase().includes(query)
  );
});

const filteredArchivedBookings = computed(() => {
  if (!searchQuery.value) return archivedBookings.value;
  
  const query = searchQuery.value.toLowerCase();
  return archivedBookings.value.filter(booking => 
    (booking.guestName && booking.guestName.toLowerCase().includes(query)) ||
    (booking.email && booking.email.toLowerCase().includes(query)) ||
    formatDateTime(booking.checkInDate).toLowerCase().includes(query) ||
    formatDateTime(booking.cancellationDate).toLowerCase().includes(query)
  );
});

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value;
  const end = start + entriesPerPage.value;
  return filteredBookings.value.slice(start, end);
});

const paginatedArchivedBookings = computed(() => {
  const start = (archiveCurrentPage.value - 1) * entriesPerPage.value;
  const end = start + entriesPerPage.value;
  return filteredArchivedBookings.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredBookings.value.length / entriesPerPage.value));
const archiveTotalPages = computed(() => Math.ceil(filteredArchivedBookings.value.length / entriesPerPage.value));

const paginationStart = computed(() => (currentPage.value - 1) * entriesPerPage.value);
const paginationEnd = computed(() => Math.min(paginationStart.value + entriesPerPage.value, filteredBookings.value.length));

const archivePaginationStart = computed(() => (archiveCurrentPage.value - 1) * entriesPerPage.value);
const archivePaginationEnd = computed(() => Math.min(archivePaginationStart.value + entriesPerPage.value, filteredArchivedBookings.value.length));

const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatCurrency = (amount) => {
  if (isNaN(amount)) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(amount);
};

const canEditBooking = (booking) => {
  const now = new Date();
  const checkInDate = booking.checkInDate instanceof Date ? booking.checkInDate : booking.checkInDate.toDate();
  const twoDaysBeforeCheckIn = new Date(checkInDate.getTime() - 2 * 24 * 60 * 60 * 1000);
  return now <= twoDaysBeforeCheckIn;
};

const canCancelBooking = (booking) => {
  const now = new Date();
  const checkInDate = booking.checkInDate instanceof Date ? booking.checkInDate : booking.checkInDate.toDate();
  const checkInTime = booking.checkInTime.split(':');
  checkInDate.setHours(parseInt(checkInTime[0]), parseInt(checkInTime[1]));
  const twelveHoursBeforeCheckIn = new Date(checkInDate.getTime() - 12 * 60 * 60 * 1000);
  return now <= twelveHoursBeforeCheckIn;
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const imageRef = storageRef(storage, `profileImages/${user.uid}/profile.jpg`);
    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);
    
    await updateDoc(doc(db, 'users', user.uid), {
      profileImageUrl: downloadURL
    });
    
    profileImageUrl.value = downloadURL;
    alert('Profile image updated successfully!');
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Failed to upload image. Please try again.');
  }
};

const saveProfile = async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("User not authenticated");
    return;
  }

  try {
    await updateDoc(doc(db, 'users', user.uid), {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      address: address.value,
      bio: bio.value,
    });

    alert('Profile updated successfully!');
    closeModal();
  } catch (error) {
    console.error('Error updating profile:', error);
    alert(`Error: ${error.message}`);
  }
};

const fetchBookingHistory = async () => {
  const user = auth.currentUser;
  if (user) {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('userId', '==', user.uid));

    const querySnapshot = await getDocs(q);
    const allBookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    bookings.value = allBookings.filter(booking => booking.status !== 'Cancelled');
    archivedBookings.value = allBookings.filter(booking => booking.status === 'Cancelled');
  }
};

const viewBookingDetails = (booking) => {
  selectedBooking.value = booking;
};

const openEditBookingModal = (booking) => {
  editingBooking.value = { ...booking };
};

const closeEditBookingModal = () => {
  editingBooking.value = null;
};

const saveEditedBooking = async () => {
  if (!editingBooking.value) return;

  try {
    const bookingRef = doc(db, 'bookings', editingBooking.value.id);
    await updateDoc(bookingRef, {
      checkInDate: Timestamp.fromDate(new Date(editingBooking.value.checkInDate)),
      checkInTime: editingBooking.value.checkInTime,
      guests: editingBooking.value.guests,
      updatedAt: Timestamp.now()
    });
    
    alert('Booking updated successfully!');
    closeEditBookingModal();
    await fetchBookingHistory();
  } catch (error) {
    console.error('Error updating booking:', error);
    alert(`Failed to update booking: ${error.message}`);
  }
};

const cancelBooking = async (booking) => {
  if (!canCancelBooking(booking) && booking.status !== 'Approved') {
    alert("You can only cancel bookings up to 12 hours before the check-in date and time.");
    return;
  }
  if (confirm("Are you sure you want to cancel this booking?")) {
    try {
      const bookingRef = doc(db, 'bookings', booking.id);
      await updateDoc(bookingRef, {
        status: 'Cancelled',
        cancellationDate: Timestamp.now(),
        updatedAt: Timestamp.now(),
        assignedGuide: null // Remove the assigned guide
      });
      alert("Booking cancelled successfully.");
      await fetchBookingHistory();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  }
};

const openRestoreBookingModal = (booking) => {
  restoringBooking.value = { 
    ...booking, 
    newCheckInDate: '', 
    newCheckInTime: '' 
  };
};

const closeRestoreBookingModal = () => {
  restoringBooking.value = null;
};

const restoreBooking = async () => {
  if (!restoringBooking.value) return;

  try {
    const bookingRef = doc(db, 'bookings', restoringBooking.value.id);
    await updateDoc(bookingRef, {
      status: 'Pending',
      checkInDate: Timestamp.fromDate(new Date(restoringBooking.value.newCheckInDate)),
      checkInTime: restoringBooking.value.newCheckInTime,
      updatedAt: Timestamp.now(),
      assignedGuide: null // Ensure no guide is assigned when restoring
    });
    
    alert('Booking restored successfully! It is now in pending status.');
    closeRestoreBookingModal();
    await fetchBookingHistory();
  } catch (error) {
    console.error('Error restoring booking:', error);
    alert(`Failed to restore booking: ${error.message}`);
  }
};

const fetchReceipt = async (receiptId) => {
  try {
    const receiptRef = doc(db, 'receipts', receiptId);
    const receiptDoc = await getDoc(receiptRef);
    
    if (receiptDoc.exists()) {
      return { id: receiptDoc.id, ...receiptDoc.data() };
    } else {
      throw new Error('Receipt not found');
    }
  } catch (error) {
    console.error('Error fetching receipt:', error);
    throw error;
  }
};

const showReceipt = async (receiptId) => {
  try {
    const receiptData = await fetchReceipt(receiptId);
    selectedReceipt.value = receiptData;
  } catch (error) {
    console.error('Error showing receipt:', error);
    alert('Failed to fetch receipt. Please try again.');
  }
};

const generatePDF = (receiptData) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Booking Receipt', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  let yPos = 40;
  const lineHeight = 10;

  const addLine = (label, value) => {
    doc.text(`${label}: ${value}`, 20, yPos);
    yPos += lineHeight;
  };

  addLine('Receipt ID', receiptData.id);
  addLine('Booking ID', receiptData.bookingId);
  addLine('Guest Name', receiptData.guestName);
  addLine('Check-in Date', formatDate(receiptData.checkInDate));
  addLine('Check-in Time', receiptData.checkInTime);
  addLine('Hotel', receiptData.hotelName);
  addLine('Room Type', receiptData.roomType);
  addLine('Package', receiptData.packageName);
  addLine('Tour Guide', receiptData.tourGuideName);
  addLine('Total Amount', formatCurrency(receiptData.totalAmount));
  addLine('Remit Amount', formatCurrency(receiptData.remitAmount));
  addLine('Generated At', formatDate(receiptData.generatedAt));
  
  doc.setFontSize(10);
  doc.text('Thank you for choosing our service!', 105, yPos + 20, { align: 'center' });
  
  doc.save(`receipt-${receiptData.id}.pdf`);
};

onMounted(async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        firstName.value = userData.firstName || '';
        lastName.value = userData.lastName || '';
        email.value = userData.email || '';
        phoneNumber.value = userData.phoneNumber || '';
        address.value = userData.address || '';
        bio.value = userData.bio || '';
        profileImageUrl.value = userData.profileImageUrl || '';
      }
      await fetchBookingHistory();
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
});

watch(activeTab, async (newTab) => {
  if (newTab === 'history' || newTab === 'archive') {
    await fetchBookingHistory();
  }
});
</script>

<style scoped>
.user-profile {
  font-family: 'Poppins', sans-serif;
  max-width: 2000px;
  margin: 0 auto;
}

.page-title {
  font-size: 3rem;
  font-weight: bold;
  margin-top: 5rem;
  margin-bottom: 1rem;
  margin-left: 4rem;
}

.nav-tabs {
  border-bottom: 1px solid #ddd;
  margin-bottom: 5rem;
  margin-left: 4rem;
  margin-right: 4rem;
}

.tab {
  display: inline-block;
  padding: 0.5rem 1rem;
  color: #666;
  text-decoration: none;
  margin-right: 1rem;
}

.tab.active {
  color: #000;
  border-bottom: 2px solid #000;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.profile-container {
  display: flex;
  align-items: flex-start;
  min-height: 70vh;
}

.profile-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 10rem;
}

.profile-image {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.image-placeholder svg {
  width: 50%;
  height: 50%;
}



.user-name {
  font-size: 2rem;
}

.user-bio {
  text-align: center;
  color: #666;
  font-size: 1rem;
  margin-top: -1.8rem;
  font-style: italic;
}

.profile-right {
  flex: 2;
  max-width: 90vh;
  margin-right: 10rem;
  margin-left: -4rem;
}

.form-container {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 5rem;
  margin-top: -2rem;
}

.user-info {
  margin-bottom: 1rem;
}

.name-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.name-row .form-group {
  flex: 1;
}

.info-item {
  margin-bottom: 1rem;
}

.info-item strong {
  font-weight: 600;
  margin-right: 0.5rem;
}

.edit-profile-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.edit-profile-btn:hover {
  background-color: #45a049;
}

.profile-right .form-container {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-right .user-info {
  display: grid;
  gap: 1.5rem;
}

.profile-right label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.profile-right input[type="text"],
.profile-right input[type="email"],
.profile-right input[type="tel"] {
  font-family: 'Poppins', sans-serif;
  width: 95%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  background-color: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.profile-right input[type="text"]:focus,
.profile-right input[type="email"]:focus,
.profile-right input[type="tel"]:focus {
  font-family: 'Poppins', sans-serif;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.profile-right .name-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.profile-right .name-row .first-name-input,
.profile-right .name-row .last-name-input {
  width: 140%;
  max-width: 288px;
}

.profile-right .edit-profile-btn {
  margin-top: 2rem;
  background-color: #007bff;
  border-color: #007bff;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 6px;
  transition: background-color 0.2s, border-color 0.2s, transform 0.1s;
}

.profile-right .edit-profile-btn:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.profile-right .edit-profile-btn:active {
  transform: translateY(1px);
}

.edit-booking-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.edit-booking-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.edit-booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.edit-booking-header h2 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #000;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  line-height: 1;
}

.edit-booking-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input,
.input-wrapper select {
  font-family: 'Poppins', sans-serif;
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  background: white;
  appearance: none;
}

.input-wrapper input:focus,
.input-wrapper select:focus {
  outline: none;
  border-color: #00A5B8;
  box-shadow: 0 0 0 1px #00A5B8;
}

.calendar-icon,
.time-icon,
.guests-icon {
  position: absolute;
  right: 12px;
  color: #6B7280;
  pointer-events: none;
}

.save-changes-btn {
  font-family: 'Poppins', sans-serif;
  background-color: #00A5B8;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 8px;
}

.save-changes-btn:hover {
  background-color: #008A99;
}

/* Ensure the date input doesn't show the native calendar icon in Chrome */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

/* Style for the select dropdown */
select {
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  line-height: 1;
}

.profile-image-container {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid #2563eb;
  background-color: #f3f4f6;
  transition: all 0.3s ease;
}

.profile-image-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
}

.camera-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.camera-icon svg {
  width: 40px;
  height: 40px;
  color: white;
}


.profile-image-container:hover .camera-icon {
  background-color: #1d4ed8;
  transform: scale(1.1);
}

.hidden {
  display: none;
}

.form-fields {
  display: flex;
  flex-direction: column;}

.personal-info .form-row {
  display: flex;
  gap: 2rem;
}

.personal-info .form-row .form-group {
  flex: 1;
}

.personal-info {
  padding: 2rem;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  color: #666;
  font-size: .85rem;
}

input[type="text"],
input[type="email"],
input[type="tel"],
textarea {
  font-family: 'Poppins', sans-serif;
  width: 97%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.first-name-input,
.last-name-input {
  width: 100%;
  max-width: 230px;
}

.save-button {
  font-family: 'Poppins', sans-serif;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
  margin-top: -3rem;

}

.save-button:hover {
  background-color: #45a049;
}

.history-content,
.archive-content {
  margin-top: -3rem;
  margin-bottom: 3rem;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.history-header,
.archive-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.history-controls,
.archive-controls {
  display: flex;
  gap: 20px;
  align-items: center;
}

.entries-control select {
  margin: 0 8px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-control input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

.booking-table-container {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.booking-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.booking-table th,
.booking-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
  
}

.booking-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.booking-table tr:hover {
  background-color: #f8f9fa;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 500;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.confirmed {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge.completed {
  background-color: #cce5ff;
  color: #004085;
}

.view-details-btn,
.edit-booking-btn,
.cancel-booking-btn,
.restore-booking-btn,
.show-receipt-btn {
  font-family: 'Poppins', sans-serif;
  padding: 6px 12px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 5px;
}

.view-details-btn {
  background-color: #007bff;
}

.view-details-btn:hover {
  background-color: #0056b3;
}

.edit-booking-btn {
  background-color: #ffc107;
}

.edit-booking-btn:hover {
  background-color: #e0a800;
}

.cancel-booking-btn {
  background-color: #dc3545;
}

.cancel-booking-btn:hover {
  background-color: #c82333;
}

.restore-booking-btn {
  background-color: #28a745;
}

.restore-booking-btn:hover {
  background-color: #218838;
}

.show-receipt-btn {
  background-color: #17a2b8;
}

.show-receipt-btn:hover {
  background-color: #138496;
}

.restore-booking-btn {
  font-family: 'Poppins', sans-serif;
  background-color: #00A5B8;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.restore-booking-btn:hover {
  background-color: #008A99;
}

.restore-booking-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.restore-booking-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.restore-booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.restore-booking-header h2 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #000;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  line-height: 1;
}

.restore-booking-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  background: white;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #00A5B8;
  box-shadow: 0 0 0 1px #00A5B8;
}

.calendar-icon,
.time-icon {
  position: absolute;
  right: 12px;
  color: #6B7280;
  pointer-events: none;
}

.save-changes-btn {
  background-color: #00A5B8;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 8px;
}

.save-changes-btn:hover {
  background-color: #008A99;
}

/* Ensure the date input doesn't show the native calendar icon in Chrome */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

/* Update the edit-booking-btn styles to ensure consistency */
.edit-booking-btn {
  font-family: 'Poppins', sans-serif;
  background-color: #00A5B8;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-booking-btn:hover {
  background-color: #008A99;
}

/* Update other action buttons for consistency */
.view-details-btn,
.cancel-booking-btn,
.show-receipt-btn {
  font-family: 'Poppins', sans-serif;
  padding: 6px 12px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

/* Specific colors for other buttons */
.view-details-btn {
  background-color: #3b82f6;
}

.view-details-btn:hover {
  background-color: #2563eb;
}

.cancel-booking-btn {
  background-color: #ef4444;
}

.cancel-booking-btn:hover {
  background-color: #dc2626;
}

.show-receipt-btn {
  background-color: #10b981;
}

.show-receipt-btn:hover {
  background-color: #059669;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  background-color: white;
  border-top: 1px solid #ddd;
  margin-top: auto;
}

.pagination-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.pagination-btn,
.page-btn {
  font-family: 'Poppins', sans-serif;
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.page-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination-btn:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.booking-details,
.receipt-details {
  max-width: 600px;
}

.booking-details-content,
.receipt-content {
  margin-top: 20px;
}

.detail-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.detail-label {
  width: 150px;
  font-weight: 600;
  color: #666;
}

.detail-value {
  flex: 1;
}

.receipt-actions {
  margin-top: 20px;
  text-align: right;
}

.download-receipt-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.download-receipt-btn:hover {
  background-color: #218838;
}

@media (max-width: 768px) {
  .history-header,
  .archive-header {
    flex-direction: column;
    gap: 15px;
  }

  .edit-booking-content {
    margin: 16px;
    padding: 20px;
  }

  .history-controls,
  .archive-controls {
    flex-direction: column;
    width: 100%;
  }

  .search-control {
    width: 100%;
  }

  .search-control input {
    width: 100%;
  }

  .pagination {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .profile-container {
    flex-direction: column;
    align-items: center;
  }

  .profile-left,
  .profile-right {
    margin: 0;
    width: 100%;
    max-width: none;
  }

  .form-container {
    padding: 1rem;
  }

  .name-row {
    flex-direction: column;
  }

  .first-name-input,
  .last-name-input {
    width: 100%;
    max-width: none;
  }
}
</style>