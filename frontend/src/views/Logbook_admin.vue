<template>
   <h1 class="section-title">Tour Logbook</h1>
  <div class="tour-logbook">
   

    <div class="tabs">
      <button 
        @click="activeTab = 'approved'" 
        :class="{ active: activeTab === 'approved' }"
        class="tab-button"
      >
        Approved Bookings
      </button>
      <button 
        @click="activeTab = 'completed'" 
        :class="{ active: activeTab === 'completed' }"
        class="tab-button"
      >
        Completed Bookings
      </button>
    </div>

    <div class="filters">
      <input v-model="filters.dateFrom" type="date" placeholder="From Date">
      <input v-model="filters.dateTo" type="date" placeholder="To Date">
      <input v-model="filters.tourGuide" placeholder="Tour Guide">
      <button @click="applyFilters" class="filter-button">Apply Filters</button>
    </div>

    <div class="tour-logs-table">
      <table>
        <thead>
          <tr>
            <th>Check-in Date & Time</th>
            <th>Guest Details</th>
            <th>Hotel</th>
            <th>Package</th>
            <th>Tour Guide</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in paginatedBookings" :key="booking.id">
            <td>
              {{ formatDate(booking.checkInDate) }}
              <br>
              <span class="text-sm text-gray-600">{{ booking.checkInTime }}</span>
            </td>
            <td>
              <div class="guest-info">
                <div class="font-medium">{{ booking.guestName }}</div>
                <div class="text-sm text-gray-600">{{ booking.email }}</div>
                <div class="text-sm">{{ booking.guests }} guests</div>
              </div>
            </td>
            <td>
              <div class="hotel-info">
                <div class="font-medium">{{ booking.hotel.name }}</div>
                <div class="text-sm">{{ booking.room.type }}</div>
                <div class="text-sm text-gray-600">Capacity: {{ booking.room.capacity }}</div>
              </div>
            </td>
            <td>
              <div class="package-info">
                <div class="font-medium">{{ booking.package.name }}</div>
                <div class="text-sm">{{ booking.package.description }}</div>
                <div class="text-sm text-gray-600">${{ booking.package.price }}</div>
              </div>
            </td>
            <td>
              <div class="tour-guide-info">
                <div class="font-medium">{{ booking.tourGuide.name }}</div>
                <div class="text-sm text-gray-600">{{ booking.tourGuide.specialization }}</div>
              </div>
            </td>
            <td>${{ booking.totalPrice.toFixed(2) }}</td>
            <td>
              <button 
                v-if="activeTab === 'approved'"
                @click="openRemitModal(booking)" 
                class="remit-button"
              >
                Complete Remit
              </button>
              <button 
                v-else
                @click="viewReceipt(booking)" 
                class="view-receipt-button"
              >
                View Receipt
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="paginatedBookings.length === 0" class="no-bookings">
      No {{ activeTab }} bookings found.
    </div>

    <!-- Pagination Controls -->
    <div v-if="paginatedBookings.length > 0" class="pagination-controls">
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>

    <!-- Remit Modal -->
    <div v-if="showRemitModal" class="modal">
      <div class="modal-content">
        <h3>Complete Remit</h3>
        <div class="booking-details">
          <div class="detail-row">
            <strong>Guest:</strong> {{ currentBooking.guestName }}
          </div>
          <div class="detail-row">
            <strong>Hotel:</strong> {{ currentBooking.hotel.name }}
          </div>
          <div class="detail-row">
            <strong>Room:</strong> {{ currentBooking.room.type }}
          </div>
          <div class="detail-row">
            <strong>Package:</strong> {{ currentBooking.package.name }}
          </div>
          <div class="detail-row">
            <strong>Tour Guide:</strong> {{ currentBooking.tourGuide.name }}
          </div>
          <div class="detail-row">
            <strong>Total Amount:</strong> ${{ currentBooking.totalPrice.toFixed(2) }}
          </div>
        </div>
        
        <div class="remit-form">
          <label for="remitAmount">Remit Amount:</label>
          <input 
            v-model="remitAmount" 
            type="number" 
            id="remitAmount" 
            step="0.01" 
            :max="currentBooking?.totalPrice" 
            required
          >
        </div>

        <div class="modal-actions">
          <button @click="closeRemitModal" class="cancel-button">Cancel</button>
          <button 
            @click="completeRemit" 
            class="confirm-button"
            :disabled="!remitAmount || remitAmount <= 0 || remitAmount > currentBooking?.totalPrice"
          >
            Confirm Remit
          </button>
        </div>
      </div>
    </div>

    <!-- Receipt Modal -->
    <div v-if="showReceiptModal" class="modal">
      <div class="modal-content">
        <h3>Receipt</h3>
        <div v-if="currentReceipt" class="receipt-details">
          <div class="detail-row">
            <strong>Receipt ID:</strong> {{ currentReceipt.id }}
          </div>
          <div class="detail-row">
            <strong>Booking ID:</strong> {{ currentReceipt.bookingId }}
          </div>
          <div class="detail-row">
            <strong>Guest Name:</strong> {{ currentReceipt.guestName }}
          </div>
          <div class="detail-row">
            <strong>Check-in Date:</strong> {{ formatDate(currentReceipt.checkInDate) }}
          </div>
          <div class="detail-row">
            <strong>Check-in Time:</strong> {{ currentReceipt.checkInTime }}
          </div>
          <div class="detail-row">
            <strong>Hotel:</strong> {{ currentReceipt.hotelName }}
          </div>
          <div class="detail-row">
            <strong>Room Type:</strong> {{ currentReceipt.roomType }}
          </div>
          <div class="detail-row">
            <strong>Package:</strong> {{ currentReceipt.packageName }}
          </div>
          <div class="detail-row">
            <strong>Tour Guide:</strong> {{ currentReceipt.tourGuideName }}
          </div>
          <div class="detail-row">
            <strong>Total Amount:</strong> ${{ currentReceipt.totalAmount.toFixed(2) }}
          </div>
          <div class="detail-row">
            <strong>Remit Amount:</strong> ${{ currentReceipt.remitAmount.toFixed(2) }}
          </div>
          <div class="detail-row">
            <strong>Generated At:</strong> {{ formatDate(currentReceipt.generatedAt) }}
          </div>
        </div>
        <div class="modal-actions">
          <button @click="printReceipt" class="print-button">Print</button>
          <button @click="downloadReceipt" class="download-button">Download PDF</button>
          <button @click="closeReceiptModal" class="close-button">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { jsPDF } from 'jspdf';

const bookings = ref([]);
const itemsPerPage = ref(10);
const currentPage = ref(1);
const filters = ref({
  dateFrom: '',
  dateTo: '',
  tourGuide: ''
});

const showRemitModal = ref(false);
const showReceiptModal = ref(false);
const currentBooking = ref(null);
const currentReceipt = ref(null);
const remitAmount = ref(0);
const activeTab = ref('approved');

const fetchBookings = async () => {
  try {
    const q = query(
      collection(db, 'bookings'), 
      where('status', 'in', ['Approved', 'Completed'])
    );
    const querySnapshot = await getDocs(q);
    bookings.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      checkInDate: doc.data().checkInDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
};

const filteredBookings = computed(() => {
  return bookings.value.filter(booking => {
    const matchesTab = booking.status === (activeTab.value === 'approved' ? 'Approved' : 'Completed');
    const matchesFilters = 
      (!filters.value.dateFrom || new Date(booking.checkInDate) >= new Date(filters.value.dateFrom)) &&
      (!filters.value.dateTo || new Date(booking.checkInDate) <= new Date(filters.value.dateTo)) &&
      (!filters.value.tourGuide || booking.tourGuide.name.toLowerCase().includes(filters.value.tourGuide.toLowerCase()));
    return matchesTab && matchesFilters;
  });
});

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredBookings.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredBookings.value.length / itemsPerPage.value));

const formatDate = (date) => {
  if (!date) return '';
  const dateObj = date instanceof Timestamp ? date.toDate() : new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const applyFilters = () => {
  currentPage.value = 1;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const openRemitModal = (booking) => {
  currentBooking.value = booking;
  remitAmount.value = booking.totalPrice;
  showRemitModal.value = true;
};

const closeRemitModal = () => {
  showRemitModal.value = false;
  currentBooking.value = null;
  remitAmount.value = 0;
};

const completeRemit = async () => {
  try {
    // Update booking status and add remit information
    await updateDoc(doc(db, 'bookings', currentBooking.value.id), {
      status: 'Completed',
      remitAmount: remitAmount.value,
      completedAt: Timestamp.now()
    });

    // Generate receipt
    const receiptData = {
      bookingId: currentBooking.value.id,
      userId: currentBooking.value.userId,
      guestName: currentBooking.value.guestName,
      guestEmail: currentBooking.value.email,
      hotelName: currentBooking.value.hotel.name,
      roomType: currentBooking.value.room.type,
      packageName: currentBooking.value.package.name,
      tourGuideName: currentBooking.value.tourGuide.name,
      checkInDate: Timestamp.fromDate(currentBooking.value.checkInDate),
      checkInTime: currentBooking.value.checkInTime,
      totalAmount: currentBooking.value.totalPrice,
      remitAmount: remitAmount.value,
      generatedAt: Timestamp.now()
    };
    
    const receiptRef = await addDoc(collection(db, 'receipts'), receiptData);
    
    // Update the booking with receipt reference
    await updateDoc(doc(db, 'bookings', currentBooking.value.id), {
      receiptId: receiptRef.id
    });

    // Refresh the bookings list and close modal
    await fetchBookings();
    closeRemitModal();
  } catch (error) {
    console.error('Error completing remit:', error);
  }
};

const viewReceipt = async (booking) => {
  try {
    if (booking.receiptId) {
      const receiptDoc = await getDoc(doc(db, 'receipts', booking.receiptId));
      if (receiptDoc.exists()) {
        currentReceipt.value = { id: receiptDoc.id, ...receiptDoc.data() };
        // Convert Timestamp fields to Date objects
        ['checkInDate', 'generatedAt'].forEach(field => {
          if (currentReceipt.value[field] instanceof Timestamp) {
            currentReceipt.value[field] = currentReceipt.value[field].toDate();
          }
        });
        showReceiptModal.value = true;
      } else {
        console.error('Receipt not found');
      }
    } else {
      console.error('No receipt associated with this booking');
    }
  } catch (error) {
    console.error('Error fetching receipt:', error);
  }
};

const closeReceiptModal = () => {
  showReceiptModal.value = false;
  currentReceipt.value = null;
};

const downloadReceipt = () => {
  if (!currentReceipt.value) return;

  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Booking Receipt', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  let yPos = 40;
  const lineHeight= 10;

  const addLine = (label, value) => {
    doc.text(`${label}: ${value}`, 20, yPos);
    yPos += lineHeight;
  };

  addLine('Receipt ID', currentReceipt.value.id);
  addLine('Booking ID', currentReceipt.value.bookingId);
  addLine('Guest Name', currentReceipt.value.guestName);
  addLine('Check-in Date', formatDate(currentReceipt.value.checkInDate));
  addLine('Check-in Time', currentReceipt.value.checkInTime);
  addLine('Hotel', currentReceipt.value.hotelName);
  addLine('Room Type', currentReceipt.value.roomType);
  addLine('Package', currentReceipt.value.packageName);
  addLine('Tour Guide', currentReceipt.value.tourGuideName);
  addLine('Total Amount', `$${currentReceipt.value.totalAmount.toFixed(2)}`);
  addLine('Remit Amount', `$${currentReceipt.value.remitAmount.toFixed(2)}`);
  addLine('Generated At', formatDate(currentReceipt.value.generatedAt));
  
  doc.setFontSize(10);
  doc.text('Thank you for choosing our service!', 105, yPos + 20, { align: 'center' });
  
  doc.save(`receipt_${currentReceipt.value.id}.pdf`);
};

const printReceipt = () => {
  window.print();
};

onMounted(fetchBookings);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.tour-logbook {
  font-family: 'Poppins', sans-serif;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}


.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
}

.tabs {
  font-family: 'Poppins', sans-serif;
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.tab-button {
  font-family: 'Poppins', sans-serif;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button.active {
  color: #111827;
  border-bottom: 2px solid #0a8d88;
}

.filters {
  font-family: 'Poppins', sans-serif;
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filters input, .filter-button {
  font-family: 'Poppins', sans-serif;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.filter-button {
  font-family: 'Poppins', sans-serif;
  background-color: #0a8d88;
  color: white;
  cursor: pointer;
}

.tour-logs-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

th {
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.guest-info, .hotel-info, .package-info, .tour-guide-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.remit-button, .view-receipt-button {
  font-family: 'Poppins', sans-serif;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #0a8d88;
  color: white;
}

.remit-button:hover, .view-receipt-button:hover {
  background-color: #5a6d8a;
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
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.modal-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.booking-details, .receipt-details {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 4px;
}

.detail-row {
  margin-bottom: 8px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.remit-form {
  margin-bottom: 20px;
}

.remit-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.remit-form input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button, .confirm-button, .close-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
}

.cancel-button, .close-button {
  background-color: #e5e7eb;
  color: #374151;
}

.confirm-button {
  background-color: #6b7f9e;
  color: white;
}

.confirm-button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

.no-bookings {
  text-align: center;
  padding: 20px;
  color: #6b7280;
  font-style: italic;
}

.pagination-controls {
  font-family: 'Poppins', sans-serif;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls button {
  font-family: 'Poppins', sans-serif;
  background-color: #0a8d88;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  margin: 0 4px;
  cursor: pointer;
}

.pagination-controls button[disabled] {
  background-color: #d1d5db;
  cursor: not-allowed;
}

.pagination-controls span {
  font-size: 0.875rem;
  color: #6b7f9e;
  margin-right: 8px;
}

.download-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  background-color: red;
  color: white;
  border: none;
  transition: background-color 0.3s;
}

.print-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  background-color: #6b7f9e;
  color: white;
  border: none;
  transition: background-color 0.3s;
}

.print-button:hover, .download-button:hover {
  background-color: #5a6d8a;
}

@media print {
  .modal-actions {
    display: none;
  }
  
  .modal-content {
    box-shadow: none;
  }
  
  .receipt-details {
    page-break-inside: avoid;
  }
}
</style>