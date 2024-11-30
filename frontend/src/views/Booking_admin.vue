<template>
  <div class="container">
    <div class="bookings-card">
      <h1>Booking Management</h1>
      
      <div v-if="loading" class="loading">
        <div class="loader"></div>
        <p>Loading bookings...</p>
      </div>
      
      <div v-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="retryFetch" class="retry-btn">Retry</button>
      </div>
      
      <div v-else class="tabs-container">
        <div class="tabs">
          <button 
            @click="activeTab = 'pending'" 
            :class="{ active: activeTab === 'pending' }"
            class="tab-btn"
          >
            Pending Bookings
          </button>
          <button 
            @click="activeTab = 'assigned'" 
            :class="{ active: activeTab === 'assigned' }"
            class="tab-btn"
          >
            Assigned Bookings
          </button>
        </div>
        
        <div v-if="activeTab === 'pending'" class="tab-content">
          <div v-if="paginatedPendingBookings.length" class="bookings-list">
            <div v-for="booking in paginatedPendingBookings" :key="booking.id" class="booking-item">
              <div class="booking-details">
                <h3>{{ booking.hotelAndRoom?.hotel?.name }}</h3>
                <div class="booking-info">
                  <p><strong>Guest:</strong> {{ booking.guestName }}</p>
                  <p><strong>Email:</strong> {{ booking.email }}</p>
                  <p><strong>Phone:</strong> {{ booking.phone }}</p>
                  <p><strong>Check-in:</strong> {{ formatDate(booking.checkInDate) }} at {{ booking.checkInTime }}</p>
                  <p><strong>Guests:</strong> {{ booking.guests }}</p>
                  <p><strong>Room:</strong> {{ booking.hotelAndRoom?.room?.name }}</p>
                  <p><strong>Package:</strong> {{ booking.package?.name }}</p>
                  <p><strong>Total Price:</strong> ₱{{ booking.totalPrice?.toLocaleString() }}</p>
                </div>
              </div>
              <div class="assign-guide">
                <button 
                  @click="openAssignModal(booking)"
                  class="assign-btn"
                >
                  Assign Guide
                </button>
              </div>
            </div>
          </div>
          <p v-else class="no-bookings">No pending bookings at the moment.</p>
          <div class="pagination">
            <button @click="changePage('pending', -1)" :disabled="pendingCurrentPage === 1" class="pagination-btn">Previous</button>
            <span>Page {{ pendingCurrentPage }} of {{ pendingTotalPages }}</span>
            <button @click="changePage('pending', 1)" :disabled="pendingCurrentPage === pendingTotalPages" class="pagination-btn">Next</button>
          </div>
        </div>
        
        <div v-if="activeTab === 'assigned'" class="tab-content">
          <div v-if="paginatedAssignedBookings.length" class="bookings-list">
            <div v-for="booking in paginatedAssignedBookings" :key="booking.id" class="booking-item">
              <div class="booking-details">
                <h3>{{ booking.hotelAndRoom?.hotel?.name }}</h3>
                <div class="booking-info">
                  <p><strong>Guest:</strong> {{ booking.guestName }}</p>
                  <p><strong>Email:</strong> {{ booking.email }}</p>
                  <p><strong>Phone:</strong> {{ booking.phone }}</p>
                  <p><strong>Check-in:</strong> {{ formatDate(booking.checkInDate) }} at {{ booking.checkInTime }}</p>
                  <p><strong>Guests:</strong> {{ booking.guests }}</p>
                  <p><strong>Room:</strong> {{ booking.hotelAndRoom?.room?.name }}</p>
                  <p><strong>Package:</strong> {{ booking.package?.name }}</p>
                  <p><strong>Total Price:</strong> ₱{{ booking.totalPrice?.toLocaleString() }}</p>
                  <p><strong>Assigned Guide:</strong> {{ booking.tourGuide.name }}</p>
                </div>
              </div>
              <div class="manage-guide">
                <button 
                  @click="openAssignModal(booking)"
                  class="change-guide-btn"
                >
                  Change Guide
                </button>
              </div>
            </div>
          </div>
          <p v-else class="no-bookings">No assigned bookings at the moment.</p>
          <div class="pagination">
            <button @click="changePage('assigned', -1)" :disabled="assignedCurrentPage === 1" class="pagination-btn">Previous</button>
            <span>Page {{ assignedCurrentPage }} of {{ assignedTotalPages }}</span>
            <button @click="changePage('assigned', 1)" :disabled="assignedCurrentPage === assignedTotalPages" class="pagination-btn">Next</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Guide Assignment Modal -->
    <div v-if="showAssignModal" class="modal-overlay" @click="closeAssignModal">
      <div class="modal guide-modal" @click.stop>
        <h3>{{ currentBooking.tourGuide ? 'Change' : 'Assign' }} Tour Guide</h3>
        <div class="guide-search">
          <input 
            v-model="guideSearch" 
            type="text" 
            placeholder="Search guides by name or specialization..."
            class="guide-search-input"
          >
        </div>
        <div class="guides-list">
          <div 
            v-for="guide in filteredGuides" 
            :key="guide.id"
            class="guide-item"
            :class="{ 'selected': selectedGuide?.id === guide.id }"
            @click="selectGuide(guide)"
          >
            <img :src="guide.profilePhoto" :alt="guide.firstName" class="guide-photo">
            <div class="guide-info">
              <h4>{{ guide.firstName }} {{ guide.lastName }}</h4>
              <p class="specialization">{{ guide.specialization }}</p>
              <p class="languages">Languages: {{ guide.languagesSpoken.join(', ') }}</p>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closeAssignModal" class="cancel-btn">Cancel</button>
          <button 
            @click="confirmAssignGuide" 
            class="assign-btn"
            :disabled="!selectedGuide"
          >
            {{ currentBooking.tourGuide ? 'Change' : 'Assign' }} Selected Guide
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebaseConfig'

const pendingBookings = ref([])
const assignedBookings = ref([])
const loading = ref(true)
const error = ref(null)
const guides = ref([])
const showAssignModal = ref(false)
const selectedGuide = ref(null)
const currentBooking = ref(null)
const guideSearch = ref('')
const activeTab = ref('pending')

// Pagination
const itemsPerPage = 5
const pendingCurrentPage = ref(1)
const assignedCurrentPage = ref(1)

const paginatedPendingBookings = computed(() => {
  const start = (pendingCurrentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return pendingBookings.value.slice(start, end)
})

const paginatedAssignedBookings = computed(() => {
  const start = (assignedCurrentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return assignedBookings.value.slice(start, end)
})

const pendingTotalPages = computed(() => Math.ceil(pendingBookings.value.length / itemsPerPage))
const assignedTotalPages = computed(() => Math.ceil(assignedBookings.value.length / itemsPerPage))

const changePage = (type, direction) => {
  if (type === 'pending') {
    pendingCurrentPage.value = Math.max(1, Math.min(pendingCurrentPage.value + direction, pendingTotalPages.value))
  } else {
    assignedCurrentPage.value = Math.max(1, Math.min(assignedCurrentPage.value + direction, assignedTotalPages.value))
  }
}

const bookingsCollection = collection(db, 'bookings')
const staffCollection = collection(db, 'staff')

const fetchBookings = async () => {
  try {
    error.value = null
    loading.value = true
    
    const pendingQuery = query(bookingsCollection, where("status", "==", "Pending"))
    const assignedQuery = query(bookingsCollection, where("status", "==", "Assigned"))
    
    const [pendingSnapshot, assignedSnapshot] = await Promise.all([
      getDocs(pendingQuery),
      getDocs(assignedQuery)
    ])
    
    pendingBookings.value = pendingSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    assignedBookings.value = assignedSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (err) {
    console.error('Error fetching bookings:', err)
    error.value = `Failed to load bookings: ${err.message}`
  } finally {
    loading.value = false
  }
}

const fetchGuides = async () => {
  try {
    const q = query(staffCollection, where("role", "==", "guides"))
    const querySnapshot = await getDocs(q)
    guides.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (err) {
    console.error('Error fetching guides:', err)
    error.value = `Failed to load guides: ${err.message}`
  }
}

const filteredGuides = computed(() => {
  const search = guideSearch.value.toLowerCase()
  return guides.value.filter(guide => 
    guide.firstName.toLowerCase().includes(search) ||
    guide.lastName.toLowerCase().includes(search) ||
    guide.specialization.toLowerCase().includes(search)
  )
})

const openAssignModal = async (booking) => {
  currentBooking.value = booking
  selectedGuide.value = null
  guideSearch.value = ''
  await fetchGuides()
  showAssignModal.value = true
}

const closeAssignModal = () => {
  showAssignModal.value = false
  currentBooking.value = null
  selectedGuide.value = null
}

const selectGuide = (guide) => {
  selectedGuide.value = guide
}

const confirmAssignGuide = async () => {
  if (!selectedGuide.value || !currentBooking.value) return

  try {
    const bookingRef = doc(db, 'bookings', currentBooking.value.id)
    await updateDoc(bookingRef, {
      tourGuide: {
        id: selectedGuide.value.id,
        name: `${selectedGuide.value.firstName} ${selectedGuide.value.lastName}`,
        specialization: selectedGuide.value.specialization
      },
      status: 'Assigned'
    })
    
    closeAssignModal()
    await fetchBookings()
  } catch (err) {
    console.error('Error assigning tour guide:', err)
    error.value = `Failed to assign guide: ${err.message}`
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    })
  } catch (err) {
    console.error('Error formatting date:', err)
    return 'Invalid date'
  }
}

const retryFetch = () => {
  fetchBookings()
}

let unsubscribePending
let unsubscribeAssigned

onMounted(() => {
  fetchBookings()
  
  // Set up real-time listener for both pending and assigned bookings
  try {
    const pendingQuery = query(bookingsCollection, where("status", "==", "Pending"))
    const assignedQuery = query(bookingsCollection, where("status", "==", "Assigned"))
    
    unsubscribePending = onSnapshot(pendingQuery, (snapshot) => {
      pendingBookings.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    }, (err) => {
      console.error('Snapshot listener error:', err)
      error.value = `Real-time updates failed: ${err.message}`
    })
    
    unsubscribeAssigned = onSnapshot(assignedQuery, (snapshot) => {
      assignedBookings.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    }, (err) => {
      console.error('Snapshot listener error:', err)
      error.value = `Real-time updates failed: ${err.message}`
    })
  } catch (err) {
    console.error('Error setting up snapshot listener:', err)
    error.value = `Failed to set up real-time updates: ${err.message}`
  }
})

onUnmounted(() => {
  if (unsubscribePending) {
    unsubscribePending()
  }
  if (unsubscribeAssigned) {
    unsubscribeAssigned()
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

.bookings-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.bookings-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

h1, h2, h3 {
  color: #2c3e50;
  text-align: center;
  letter-spacing: 0.5px;
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 500;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 1rem;
  text-align: left;
}

.loading {
  text-align: center;
  color: #7f8c8d;
}

.loader {
  border: 4px solid #ecf0f1;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.tabs-container {
  margin-top: 2rem;
}

.tabs {
  display: flex;
  justify-content: center;
}

.tab-btn {
  background-color: #ecf0f1;
  color: #34495e;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 0 0.5rem;
}

.tab-btn.active {
  background-color: #3498db;
  color: white;
}

.tab-btn:hover:not(.active) {
  background-color: #bdc3c7;
}

.tab-content {
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.bookings-list {
  display: grid;
  gap: 2rem;
}

.booking-item {
  background-color: #f8f9fa;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  transition: all 0.3s ease;
}

.booking-item:hover {
  background-color: #ffffff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.booking-details {
  flex: 1;
  min-width: 250px;
}

.booking-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.booking-info p {
  margin: 0;
  color: #5d6d7e;
  font-size: 0.95rem;
}

.booking-info strong {
  color: #2c3e50;
  font-weight: 500;
}

.assign-guide, .manage-guide {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 200px;
  margin-top: 1rem;
}

.guide-modal {
  max-width: 600px !important;
}

.guide-search {
  margin-bottom: 1rem;
}

.guide-search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #bdc3c7;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.guide-search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.guides-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1rem;
  border: 1px solid #ecf0f1;
  border-radius: 0.5rem;
}

.guide-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
  cursor: pointer;
  transition: background-color 0.2s;
}

.guide-item:last-child {
  border-bottom: none;
}

.guide-item:hover {
  background-color: #f5f7fa;
}

.guide-item.selected {
  background-color: #e1f0fa;
}

.guide-photo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  border: 2px solid #3498db;
}

.guide-info {
  flex: 1;
}

.guide-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.specialization {
  font-size: 0.9rem;
  color: #34495e;
  margin: 0 0 0.25rem 0;
}

.languages {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin: 0;
}

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
  z-index: 50;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.assign-btn, .retry-btn, .change-guide-btn {
  background-color: #3498db;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.assign-btn:hover:not(:disabled),
.retry-btn:hover,
.change-guide-btn:hover {
  background-color: #2980b9;
}

.assign-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #ecf0f1;
  color: #34495e;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-btn:hover {
  background-color: #bdc3c7;
}

.no-bookings {
  text-align: center;
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-top: 2rem;
}

.error {
  color: #e74c3c;
  text-align: center;
  margin: 2rem 0;
  padding: 1rem;
  background-color: #fadbd8;
  border-radius: 0.5rem;
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}

.pagination-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #2980b9;
}

.pagination-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .bookings-card {
    padding: 1.5rem;
  }

  .booking-item {
    flex-direction: column;
    align-items: stretch;
  }

  .assign-guide, .manage-guide {
    margin-top: 1rem;
  }

  .guide-modal {
    margin: 1rem;
    max-width: calc(100% - 2rem) !important;
  }

  .guide-item {
    flex-direction: column;
    text-align: center;
  }

  .guide-photo {
    margin: 0 0 0.75rem 0;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .assign-btn, .cancel-btn, .change-guide-btn {
    width: 100%;
  }
}
</style>