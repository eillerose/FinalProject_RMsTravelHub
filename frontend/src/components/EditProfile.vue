<template>
  <div class="user-profile">
    <HeaderComponent />
    <h1 class="page-title">My Account</h1>
    
  <!-- Navigation Tabs -->
    <div class="nav-tabs">
      <a href="#" class="tab" :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">Profile</a>
      <a href="#" class="tab" :class="{ active: activeTab === 'history' }" @click="activeTab = 'history'">History</a>
    </div>

  <!-- User Profile Section -->
  <div v-if="activeTab === 'profile'">
    <!-- <h2 class="section-title">User Profile</h2> -->
    <div class="profile-container">
      <div class="profile-left">
        <div class="profile-image">
          <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile Image" />
          <div v-else class="image-placeholder">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" fill="#B7E4F0"/>
              <path d="M0 70 Q50 40 100 70 L100 100 L0 100 Z" fill="#90EE90"/>
            </svg>
          </div>
        </div>
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
  </div>
    <!-- Modal for Editing Profile -->
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
          <label>Search: </label>
          <input type="text" v-model="searchQuery" placeholder="Search bookings...">
        </div>
      </div>
    </div>

    <div class="booking-table-container">
      <table class="booking-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Package Selected</th>
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
            <td>{{ formatDateTime(booking.dateAndTime) }}</td>
            <td>
              <button class="view-details-btn" @click="viewBookingDetails(booking)">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
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
          <span class="detail-value">{{ selectedBooking.room.name }} (Capacity: {{ selectedBooking.room.capacity }})</span>
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
          <span class="detail-value">₱{{ selectedBooking.room.price }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Booking Created:</span>
          <span class="detail-value">{{ formatDateTime(selectedBooking.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
  </div>

  <FooterComponent />
</template>

<script>
import { auth, db } from '../firebaseConfig';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import HeaderComponent from './Header.vue';
import FooterComponent from './Footer.vue';

export default {
  name: 'UserProfile',
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data() {
    return {
      address: '',
      bio: '',
      profileImage: null,
      profileImageUrl: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      isModalOpen: false,
      activeTab: 'profile', // To track the active tab
      bookings: [], // To store booking history data
      currentPage: 1,
      entriesPerPage: 5,
      searchQuery: '',
      selectedBooking: null,
    };
  },

  computed: {
    filteredBookings() {
      if (!this.searchQuery) return this.bookings;
      
      const query = this.searchQuery.toLowerCase();
      return this.bookings.filter(booking => 
        (booking.guestName && booking.guestName.toLowerCase().includes(query)) ||
        (booking.email && booking.email.toLowerCase().includes(query)) ||
        (booking.status && booking.status.toLowerCase().includes(query)) ||
        this.formatDateTime(booking.checkInDate, booking.checkInTime).toLowerCase().includes(query)
      );
    },
    paginatedBookings() {
      const start = (this.currentPage - 1) * this.entriesPerPage;
      const end = start + this.entriesPerPage;
      return this.filteredBookings.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredBookings.length / this.entriesPerPage);
    },
    paginationStart() {
      return (this.currentPage - 1) * this.entriesPerPage;
    },
    paginationEnd() {
      const end = this.paginationStart + this.entriesPerPage;
      return Math.min(end, this.filteredBookings.length);
    }
  },
  methods: {
    formatDateTime(date, time) {
      if (!date) return 'N/A';
      const dateObj = date instanceof Date ? date : date.toDate();
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      return `${formattedDate} ${time || ''}`.trim();
    },
    viewBookingDetails(booking) {
      this.selectedBooking = booking;
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    onFileChange(e) {
      const file = e.target.files[0];
      const validExtensions = ['jpg', 'jpeg', 'png'];

      if (file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (validExtensions.includes(fileExtension)) {
          this.profileImage = file;
        } else {
          alert("Please upload a valid image file (JPEG or PNG format).");
          e.target.value = "";
        }
      }
    },
    async saveProfile() {
      const user = auth.currentUser;
      if (!user) {
        alert("User not authenticated");
        return;
      }

      const storage = getStorage();
      let newProfileImageUrl = '';

      try {
        if (this.profileImage) {
          const imageRef = storageRef(storage, `profileImages/${user.uid}/${this.profileImage.name}`);
          const uploadResult = await uploadBytes(imageRef, this.profileImage);
          newProfileImageUrl = await getDownloadURL(uploadResult.ref);
        }

        await updateDoc(doc(db, 'users', user.uid), {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phoneNumber: this.phoneNumber,
          address: this.address,
          bio: this.bio,
          profileImageUrl: newProfileImageUrl || this.profileImageUrl,
        });

        alert('Profile updated successfully!');
        this.profileImageUrl = newProfileImageUrl || this.profileImageUrl;
        this.closeModal();
      } catch (error) {
        console.error('Error updating profile:', error);
        alert(`Error: ${error.message}`);
      }
    },
    async fetchBookingHistory() {
    const user = auth.currentUser;
    if (user) {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('userId', '==', user.uid));

      const querySnapshot = await getDocs(q);
      this.bookings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(), // This will include all fields stored in each booking document
      }));
    }
  }
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'history') {
        this.fetchBookingHistory();
      }
    },
    searchQuery() {
      this.currentPage = 1;
    },
    entriesPerPage() {
      this.currentPage = 1;
    }
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.firstName = userData.firstName || '';
          this.lastName = userData.lastName || '';
          this.email = userData.email || '';
          this.phoneNumber = userData.phoneNumber || '';
          this.address = userData.address || '';
          this.bio = userData.bio || '';
          this.profileImageUrl = userData.profileImageUrl || '';
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  },
};
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
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f0f0f0;
  position: relative;
}

.profile-image img {
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.profile-right .form-group {
  margin-bottom: 0;
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
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
}

.profile-image-container {
  display: flex;
  justify-content: center;
  margin-top: -2rem;
}

.profile-image-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
}

.camera-icon {
  position: absolute;
  right: 5px;
  bottom: 10px;
  width: 40px;
  height: 40px;
  background-color: #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid white;
  color: white;
  z-index: 10;
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

.history-content {
padding: 20px;
background: white;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.history-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 20px;
}

.history-controls {
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
overflow-x: auto;
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
border-bottom: 1px solid #ddd;
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

.view-details-btn {
padding: 6px 12px;
background-color: #007bff;
color: white;
border: none;
border-radius: 4px;
cursor: pointer;
font-size: 0.9em;
}

.view-details-btn:hover {
background-color: #0056b3;
}

.pagination {
display: flex;
justify-content: space-between;
align-items: center;
padding: 20px 0;
}

.pagination-controls {
display: flex;
gap: 8px;
align-items: center;
}

.pagination-btn,
.page-btn {
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

.booking-details {
max-width: 600px;
}

.booking-details-content {
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

@media (max-width: 768px) {
.history-header {
  flex-direction: column;
  gap: 15px;
}

.history-controls {
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
}
</style>