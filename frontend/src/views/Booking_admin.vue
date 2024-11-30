<template>
  <div class="container">
    <div class="bookings-card">
      <h1>Pending Bookings</h1>
      
      <div v-if="loading" class="loading">
        <div class="loader"></div>
        <p>Loading pending bookings...</p>
      </div>
      
      <div v-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="retryFetch" class="retry-btn">Retry</button>
      </div>
      
      <div v-else-if="pendingBookings.length" class="bookings-list">
        <div v-for="booking in pendingBookings" :key="booking.id" class="booking-item">
          <div class="booking-details">
            <h2>{{ booking.hotelAndRoom?.hotel?.name }}</h2>
            <p><strong>Guest:</strong> {{ booking.guestName }}</p>
            <p><strong>Email:</strong> {{ booking.email }}</p>
            <p><strong>Phone:</strong> {{ booking.phone }}</p>
            <p><strong>Check-in:</strong> {{ formatDate(booking.checkInDate) }} at {{ booking.checkInTime }}</p>
            <p><strong>Guests:</strong> {{ booking.guests }}</p>
            <p><strong>Room:</strong> {{ booking.hotelAndRoom?.room?.name }}</p>
            <p><strong>Package:</strong> {{ booking.package?.name }}</p>
            <p><strong>Total Price:</strong> ₱{{ booking.totalPrice?.toLocaleString() }}</p>
          </div>
          <div class="assign-guide">
            <input 
              v-model="booking.assignedGuide" 
              placeholder="Enter guide name" 
            >
            <button 
              @click="assignTourGuide(booking)" 
              :disabled="!booking.assignedGuide"
              class="assign-btn"
            >
              Assign Guide
            </button>
          </div>
        </div>
      </div>
      
      <p v-else-if="!loading && !error" class="no-bookings">No pending bookings at the moment.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebaseConfig'

const pendingBookings = ref([])
const loading = ref(true)
const error = ref(null)

const bookingsCollection = collection(db, 'bookings')

const fetchPendingBookings = async () => {
  try {
    console.log('Fetching pending bookings...')
    error.value = null
    loading.value = true
    
    const q = query(bookingsCollection, where("status", "==", "Pending"))
    console.log('Query created:', q)
    
    const querySnapshot = await getDocs(q)
    console.log('Query snapshot received:', querySnapshot.size, 'documents')
    
    pendingBookings.value = querySnapshot.docs.map(doc => {
      const data = doc.data()
      console.log('Document data:', data)
      return {
        id: doc.id,
        ...data,
        assignedGuide: ''
      }
    })
    
    console.log('Processed bookings:', pendingBookings.value)
  } catch (err) {
    console.error('Error fetching pending bookings:', err)
    error.value = `Failed to load bookings: ${err.message}`
  } finally {
    loading.value = false
  }
}

const assignTourGuide = async (booking) => {
  try {
    console.log('Assigning tour guide to booking:', booking.id)
    const bookingRef = doc(db, 'bookings', booking.id)
    await updateDoc(bookingRef, {
      tourGuide: booking.assignedGuide,
      status: 'Assigned'
    })
    console.log('Tour guide assigned successfully!')
    pendingBookings.value = pendingBookings.value.filter(b => b.id !== booking.id)
  } catch (err) {
    console.error('Error assigning tour guide:', err)
    alert(`Failed to assign tour guide: ${err.message}`)
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
  console.log('Retrying fetch...')
  fetchPendingBookings()
}

let unsubscribe

onMounted(() => {
  console.log('Component mounted')
  fetchPendingBookings()
  
  // Set up real-time listener
  try {
    const q = query(bookingsCollection, where("status", "==", "Pending"))
    unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Snapshot received:', snapshot.size, 'documents')
      pendingBookings.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        assignedGuide: ''
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
  if (unsubscribe) {
    console.log('Cleaning up snapshot listener')
    unsubscribe()
  }
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.bookings-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  width: 100%;
  max-width: 800px;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  margin-bottom: 1.5rem;
}

.loading {
  text-align: center;
  color: #6b7280;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.bookings-list {
  display: grid;
  gap: 1.5rem;
}

.booking-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.booking-details {
  flex: 1;
  min-width: 200px;
}

h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

p {
  margin-bottom: 0.25rem;
  color: #4b5563;
}

.assign-guide {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
  margin-top: 1rem;
}

input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.assign-btn, .retry-btn {
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.assign-btn:hover:not(:disabled),
.retry-btn:hover {
  background-color: #2563eb;
}

.assign-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.no-bookings {
  text-align: center;
  color: #6b7280;
}

.error {
  color: #ef4444;
  text-align: center;
  margin: 2rem 0;
  padding: 1rem;
  background-color: #fee2e2;
  border-radius: 0.5rem;
}

@media (max-width: 640px) {
  .bookings-card {
    padding: 1rem;
  }

  .booking-item {
    flex-direction: column;
    align-items: stretch;
  }

  .assign-guide {
    margin-top: 1rem;
  }
}
</style>