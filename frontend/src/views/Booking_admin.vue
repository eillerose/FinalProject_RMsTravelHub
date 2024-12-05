<template>
  <div class="booking-management">
    <h1 class="title">Booking Management</h1>
    
    <div v-if="loading" class="loading">
      <div class="loader"></div>
      <p>Loading bookings...</p>
    </div>
    
    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="retryFetch" class="btn btn-retry">Retry</button>
    </div>
    
    <div v-else class="content">
      <div class="tabs">
        <button 
          v-for="tab in ['All', 'Pending', 'Approved', 'Cancelled']"
          :key="tab"
          @click="activeTab = tab.toLowerCase()" 
          :class="['tab-btn', { active: activeTab === tab.toLowerCase() }]"
        >
          {{ tab }} Bookings
        </button>
      </div>
      
      <div class="table-container">
        <table class="bookings-table">
          <thead>
            <tr>
              <th>Guest Name</th>
              <th>Hotel</th>
              <th>Room Type</th>
              <th>Package</th>
              <th>Check-in</th>
              <th>Guests</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in paginatedBookings" :key="booking.id">
              <td>
                <div class="guest-info">
                  <div>{{ booking.guestName }}</div>
                  <div class="guest-contact">{{ booking.email }}</div>
                  <div class="guest-contact">{{ booking.phone }}</div>
                </div>
              </td>
              <td>{{ booking.hotel?.name }}</td>
              <td>{{ booking.room?.type }}</td>
              <td>{{ booking.package?.name }}</td>
              <td>
                <div>{{ formatDate(booking.checkInDate) }}</div>
                <div class="check-in-time">{{ booking.checkInTime }}</div>
              </td>
              <td>{{ booking.guests }} pax</td>
              <td>₱{{ booking.totalPrice?.toLocaleString() }}</td>
              <td>
                <span :class="['status-badge', booking.status?.toLowerCase()]">
                  {{ booking.status || 'Pending' }}
                </span>
              </td>
              <td class="actions">
                <button @click="openEditModal(booking)" class="btn btn-edit">Edit</button>
                <template v-if="booking.status !== 'Cancelled'">
                  <button @click="cancelBooking(booking.id)" class="btn btn-cancel">
                    Cancel
                  </button>
                  <button v-if="booking.status === 'Pending' || !booking.tourGuide" 
                          @click="openAssignModal(booking)" 
                          class="btn btn-assign">
                    {{ booking.tourGuide ? 'Change Guide' : 'Assign Guide' }}
                  </button>
                </template>
                <template v-else>
                  <button @click="restoreBooking(booking.id)" class="btn btn-restore">
                    Restore
                  </button>
                  <button @click="deleteBooking(booking.id)" class="btn btn-delete">
                    Delete
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="filteredBookings.length === 0" class="no-bookings">
        No bookings found for the selected status.
      </div>
      
      <div v-if="filteredBookings.length > 0" class="pagination">
        <button @click="changePage(-1)" :disabled="currentPage === 1" class="btn btn-page">Previous</button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="changePage(1)" :disabled="currentPage === totalPages" class="btn btn-page">Next</button>
      </div>
    </div>

    <!-- Edit Booking Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal edit-modal" @click.stop>
        <h2>Edit Booking</h2>
        <form @submit.prevent="saveEditedBooking">
          <div class="form-group">
            <label for="edit-guest-name">Guest Name</label>
            <input id="edit-guest-name" v-model="editingBooking.guestName" type="text" required>
          </div>
          <div class="form-group">
            <label for="edit-email">Email</label>
            <input id="edit-email" v-model="editingBooking.email" type="email" required>
          </div>
          <div class="form-group">
            <label for="edit-phone">Phone</label>
            <input id="edit-phone" v-model="editingBooking.phone" type="tel" required>
          </div>
          <div class="form-group">
            <label for="edit-check-in-date">Check-in Date</label>
            <input id="edit-check-in-date" v-model="editingBooking.checkInDate" type="date" required>
          </div>
          <div class="form-group">
            <label for="edit-check-in-time">Check-in Time</label>
            <input id="edit-check-in-time" v-model="editingBooking.checkInTime" type="time" required>
          </div>
          <div class="form-group">
            <label for="edit-guests">Number of Guests</label>
            <input id="edit-guests" v-model.number="editingBooking.guests" type="number" required min="1">
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeEditModal" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Guide Assignment Modal -->
    <div v-if="showAssignModal" class="modal-overlay" @click="closeAssignModal">
      <div class="modal guide-modal" @click.stop>
        <h2>{{ currentBooking?.tourGuide ? 'Change' : 'Assign' }} Tour Guide</h2>
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
            :class="{ selected: selectedGuide?.id === guide.id }"
            @click="selectGuide(guide)"
          >
            <img :src="guide.profilePhoto || '/placeholder.svg?height=50&width=50'" :alt="guide.firstName" class="guide-photo">
            <div class="guide-info">
              <h3>{{ guide.firstName }} {{ guide.lastName }}</h3>
              <p class="specialization">{{ guide.specialization }}</p>
              <p class="languages">Languages: {{ guide.languagesSpoken?.join(', ') }}</p>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closeAssignModal" class="btn btn-secondary">Cancel</button>
          <button 
            @click="confirmAssignGuide" 
            class="btn btn-primary"
            :disabled="!selectedGuide"
          >
            {{ currentBooking?.tourGuide ? 'Change' : 'Assign' }} Selected Guide
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { collection, query, getDocs, updateDoc, doc, onSnapshot, Timestamp, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'

const bookings = ref([])
const loading = ref(true)
const error = ref(null)
const guides = ref([])
const showAssignModal = ref(false)
const showEditModal = ref(false)
const selectedGuide = ref(null)
const currentBooking = ref(null)
const editingBooking = ref(null)
const guideSearch = ref('')
const activeTab = ref('all')

// Pagination
const itemsPerPage = 10
const currentPage = ref(1)

const filteredBookings = computed(() => {
  if (activeTab.value === 'all') {
    return bookings.value
  }
  return bookings.value.filter(booking => 
    (booking.status || 'Pending').toLowerCase() === activeTab.value
  )
})

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredBookings.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredBookings.value.length / itemsPerPage))

const changePage = (direction) => {
  const newPage = currentPage.value + direction
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage
  }
}

const bookingsCollection = collection(db, 'bookings')
const staffCollection = collection(db, 'staff')

const fetchBookings = async () => {
  try {
    error.value = null
    loading.value = true
    
    const querySnapshot = await getDocs(bookingsCollection)
    bookings.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      status: doc.data().status || 'Pending'
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
    const querySnapshot = await getDocs(staffCollection)
    guides.value = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(staff => staff.role === 'guides')
  } catch (err) {
    console.error('Error fetching guides:', err)
    error.value = `Failed to load guides: ${err.message}`
  }
}

const filteredGuides = computed(() => {
  const search = guideSearch.value.toLowerCase()
  return guides.value.filter(guide => 
    guide.firstName?.toLowerCase().includes(search) ||
    guide.lastName?.toLowerCase().includes(search) ||
    guide.specialization?.toLowerCase().includes(search)
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
      status: 'Approved',
      updatedAt: Timestamp.now()
    })
    
    closeAssignModal()
    await fetchBookings()
  } catch (err) {
    console.error('Error assigning tour guide:', err)
    error.value = `Failed to assign guide: ${err.message}`
  }
}

const openEditModal = (booking) => {
  editingBooking.value = { ...booking }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingBooking.value = null
}

const saveEditedBooking = async () => {
  if (!editingBooking.value) return

  try {
    const bookingRef = doc(db, 'bookings', editingBooking.value.id)
    await updateDoc(bookingRef, {
      guestName: editingBooking.value.guestName,
      email: editingBooking.value.email,
      phone: editingBooking.value.phone,
      checkInDate: editingBooking.value.checkInDate,
      checkInTime: editingBooking.value.checkInTime,
      guests: editingBooking.value.guests,
      updatedAt: Timestamp.now()
    })
    
    closeEditModal()
    await fetchBookings()
  } catch (err) {
    console.error('Error updating booking:', err)
    error.value = `Failed to update booking: ${err.message}`
  }
}

const cancelBooking = async (bookingId) => {
  if (!confirm('Are you sure you want to cancel this booking?')) return

  try {
    const bookingRef = doc(db, 'bookings', bookingId)
    const bookingSnapshot = await getDoc(bookingRef)
    const bookingData = bookingSnapshot.data()

    if (bookingData.status === 'Approved') {
      if (!confirm('This booking is approved. Cancelling it may incur fees. Are you sure you want to proceed?')) return
    }

    await updateDoc(bookingRef, {
      status: 'Cancelled',
      updatedAt: Timestamp.now(),
      cancellationDate: Timestamp.now(),
      ...(bookingData.tourGuide && { tourGuide: null })
    })
    
    await fetchBookings()
  } catch (err) {
    console.error('Error cancelling booking:', err)
    error.value = `Failed to cancel booking: ${err.message}`
  }
}

const restoreBooking = async (bookingId) => {
  if (!confirm('Are you sure you want to restore this booking?')) return

  try {
    const bookingRef = doc(db, 'bookings', bookingId)
    await updateDoc(bookingRef, {
      status: 'Pending',
      updatedAt: Timestamp.now(),
      cancellationDate: null
    })
    
    await fetchBookings()
  } catch (err) {
    console.error('Error restoring booking:', err)
    error.value = `Failed to restore booking: ${err.message}`
  }
}

const deleteBooking = async (bookingId) => {
  if (!confirm('Are you sure you want to permanently delete this booking? This action cannot be undone.')) return

  try {
    const bookingRef = doc(db, 'bookings', bookingId)
    await deleteDoc(bookingRef)
    
    await fetchBookings()
  } catch (err) {
    console.error('Error deleting booking:', err)
    error.value = `Failed to delete booking: ${err.message}`
  }
}

const formatDate = (timestamp) => {if (!timestamp) return ''
  try {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp)
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

let unsubscribe

onMounted(() => {
  fetchBookings()
  
  // Set up real-time listener for bookings
  unsubscribe = onSnapshot(bookingsCollection, (snapshot) => {
    bookings.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      status: doc.data().status || 'Pending'
    }))
  }, (err) => {
    console.error('Snapshot listener error:', err)
    error.value = `Real-time updates failed: ${err.message}`
  })
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<style scoped>
.booking-management {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.tab-btn {
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.tab-btn.active {
  background-color: #3498db;
  color: white;
}

.table-container {
  overflow-x: auto;
}

.bookings-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.bookings-table th,
.bookings-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.bookings-table th {
  background-color: #f8f8f8;
  font-weight: bold;
}

.guest-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.guest-contact {
  font-size: 0.85rem;
  color: #666;
}

.check-in-time {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.approved {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.cancelled {
  background-color: #fee2e2;
  color: #991b1b;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s ease;
}

.btn-edit {
  background-color: #3498db;
  color: white;
}

.btn-cancel {
  background-color: #e74c3c;
  color: white;
}

.btn-assign {
  background-color: #2ecc71;
  color: white;
}

.btn-restore {
  background-color: #f39c12;
  color: white;
}

.btn-delete {
  background-color: #c0392b;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
}

.btn-page {
  background-color: #f0f0f0;
  color: #333;
  margin: 0 0.5rem;
}

.page-info {
  font-size: 0.875rem;
  color: #666;
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
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.guide-search {
  margin-bottom: 1rem;
}

.guide-search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.guides-list {
  max-height: 300px;
  overflow-y: auto;
}

.guide-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.guide-item:hover {
  background-color: #f0f0f0;
}

.guide-item.selected {
  background-color: #e8f0fe;
  border-color: #3498db;
}

.guide-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
}

.guide-info h3 {
  margin: 0;
  font-size: 1rem;
}

.guide-info p {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #666;
}

.no-bookings {
  text-align: center;
  padding: 2rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  color: #666;
}
</style>

