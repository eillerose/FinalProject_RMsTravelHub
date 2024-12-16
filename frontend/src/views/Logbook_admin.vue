<template>
  <div class="tour-logbook">
    <h1 class="section-title">Tour Logbook</h1>

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
                <div v-if="booking.package.pricingMode === 'options'" class="text-sm">
                  {{ booking.package.selectedOption.name }}
                </div>
                <div class="text-sm text-gray-600">
                  ₱{{ booking.totalPrice }}
                </div>
              </div>
            </td>
            <td>
              <div class="tour-guide-info">
                <div class="font-medium">{{ booking.tourGuide?.name || 'Not assigned' }}</div>
                <div class="text-sm text-gray-600">{{ booking.tourGuide?.specialization || '' }}</div>
              </div>
            </td>
            <td>₱{{ booking.totalPrice }}</td>
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
    <div v-if="showRemitModal" class="modal-overlay">
    <div class="modal-container">
      <!-- Diagonal Header -->
      <div class="modal-header">
        <div class="header-teal"></div>
        <div class="header-yellow"></div>
      </div>

      <div class="modal-content">
        <h2 class="modal-title">Complete Remit</h2>

        <div class="remit-details">
          <div class="detail-row">
            <span class="detail-label">Guest</span>
            <span class="detail-value">{{ currentBooking.guestName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Hotel</span>
            <span class="detail-value">{{ currentBooking.hotel.name }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Room</span>
            <span class="detail-value">{{ currentBooking.room.type }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Package</span>
            <span class="detail-value">{{ currentBooking.package.name }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tour Guide</span>
            <span class="detail-value">{{ currentBooking.tourGuide?.name || 'Not assigned' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Booking Price</span>
            <span class="detail-value">₱{{ currentBooking.totalPrice }}</span>
          </div>
        </div>
        
        <div class="remit-form">
          <label for="remitAmount" class="remit-label">Remit Amount:</label>
          <div class="remit-input-wrapper">
            <span class="currency-symbol">₱</span>
            <input 
              v-model="remitAmount"
              type="number"
              id="remitAmount"
              class="remit-input"
              step="0.01"
              required
            />
          </div>
          <p class="remit-note">Note: The remit amount can be different from the booking price.</p>
        </div>

        <div class="modal-actions">
          <button @click="closeRemitModal" class="cancel-button">Cancel</button>
          <button 
            @click="completeRemit"
            class="confirm-button"
            :disabled="!isValidRemitAmount"
          >
            Confirm Remit
          </button>
        </div>
      </div>
    </div>
  </div>
<!-- Receipt Modal -->
<div v-if="showReceiptModal" class="modal">
  <div class="modal-content receipt-modal">
    <div class="receipt-header">
      <div class="header-teal"></div>
      <div class="header-yellow"></div>
    </div>

    <div class="receipt-content">
      <h1 class="receipt-title">Receipt</h1>
      
      <div class="receipt-main">
        <h2 class="greeting">Thank you, {{ currentReceipt?.guestName?.split(' ')[0] }}!</h2>
        
        <div class="receipt-ids">
          <p>Receipt ID: {{ currentReceipt?.id }}</p>
          <p>Booking ID: {{ currentReceipt?.bookingId }}</p>
        </div>

        <div class="booking-details">
          <div class="detail-row">
            <span>Guest Name</span>
            <span>{{ currentReceipt?.guestName }}</span>
          </div>
          <div class="detail-row">
            <span>Check-in Date</span>
            <span>{{ formatDate(currentReceipt?.checkInDate) }}</span>
          </div>
          <div class="detail-row">
            <span>Check-in Time</span>
            <span>{{ currentReceipt?.checkInTime }}</span>
          </div>
          <div class="detail-row">
            <span>Hotel</span>
            <span>{{ currentReceipt?.hotelName }}</span>
          </div>
          <div class="detail-row">
            <span>Room Type</span>
            <span>{{ currentReceipt?.roomType }}</span>
          </div>
          <div class="detail-row">
            <span>Package</span>
            <span>{{ currentReceipt?.packageName }}</span>
          </div>
          <div class="detail-row">
            <span>Tour Guide</span>
            <span>{{ currentReceipt?.tourGuideName }}</span>
          </div>
        </div>
      </div>

      <div class="remit-calculation">
        <h3>Remit Calculation</h3>
        <div class="detail-row">
          <span>Booking Price</span>
          <span>₱{{ currentReceipt?.bookingPrice.toFixed(2) }}</span>
        </div>
        <div class="detail-row">
          <span>Remit Amount</span>
          <span>₱{{ currentReceipt?.remitAmount.toFixed(2) }}</span>
        </div>
        <div class="detail-row">
          <span>Change</span>
          <span>₱{{ calculateChange(currentReceipt).toFixed(2) }}</span>
        </div>
        
        <div class="total-amount">
          <div class="detail-row">
            <span>Total Amount Paid</span>
            <span class="value">₱{{ currentReceipt?.remitAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button @click="printReceipt" class="action-button print">Print</button>
        <button @click="downloadReceipt" class="action-button confirm-remit">Download PDF</button>
        <button @click="closeReceiptModal" class="action-button close">Close</button>
      </div>
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
    bookings.value = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        checkInDate: data.checkInDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    });
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
      (!filters.value.tourGuide || booking.tourGuide?.name.toLowerCase().includes(filters.value.tourGuide.toLowerCase()));
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
  remitAmount.value = parseFloat(booking.totalPrice);
  showRemitModal.value = true;
};

const closeRemitModal = () => {
  showRemitModal.value = false;
  currentBooking.value = null;
  remitAmount.value = 0;
};

const isValidRemitAmount = computed(() => {
  return remitAmount.value > 0;
});

const completeRemit = async () => {
  try {
    // Update booking status and add remit information
    await updateDoc(doc(db, 'bookings', currentBooking.value.id), {
      status: 'Completed',
      remitAmount: parseFloat(remitAmount.value),
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
      tourGuideName: currentBooking.value.tourGuide?.name || 'Not assigned',
      checkInDate: Timestamp.fromDate(currentBooking.value.checkInDate),
      checkInTime: currentBooking.value.checkInTime,
      bookingPrice: parseFloat(currentBooking.value.totalPrice),
      remitAmount: parseFloat(remitAmount.value),
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

const calculateChange = (receipt) => {
  if (!receipt) return 0;
  return receipt.remitAmount - receipt.bookingPrice;
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

  const doc = new jsPDF({
    format: 'a4',
    unit: 'mm'
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);
  
  // Header with diagonal colors
  doc.setFillColor(0, 150, 136); // Teal
  doc.rect(0, 0, pageWidth/2 + 20, 40, 'F');
  doc.setFillColor(255, 193, 7); // Yellow
  doc.rect(pageWidth/2 - 20, 0, pageWidth/2 + 20, 40, 'F');

  // Logo placeholder (you'll need to replace this with actual logo)
  doc.addImage('/src/img/logoforRMs.png', 'PNG', pageWidth/2 - 15, 20, 30, 30);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(51, 51, 51);
  doc.text('RECEIPT', pageWidth/2, 70, { align: 'center' });

  // Thank you message
  doc.setFontSize(16);
  doc.text(`Thank you, ${currentReceipt.value.guestName.split(' ')[0]}!`, margin, 90);

  // Receipt IDs
  doc.setFontSize(10);
  doc.setTextColor(102, 102, 102);
  doc.text(`Receipt ID: ${currentReceipt.value.id}`, margin, 105);
  doc.text(`Booking ID: ${currentReceipt.value.bookingId}`, margin, 112);

  // Booking Details
  let yPos = 130;
  const lineHeight = 8;
  const labelX = margin;
  const valueX = pageWidth - margin;
  
  doc.setFont('helvetica', 'normal');
  
  const addDetailRow = (label, value) => {
    doc.text(label, labelX, yPos);
    doc.text(value, valueX, yPos, { align: 'right' });
    yPos += lineHeight;
  };

  addDetailRow('Guest Name:', currentReceipt.value.guestName);
  addDetailRow('Check-in Date:', formatDate(currentReceipt.value.checkInDate));
  addDetailRow('Check-in Time:', currentReceipt.value.checkInTime);
  addDetailRow('Hotel:', currentReceipt.value.hotelName);
  addDetailRow('Room Type:', currentReceipt.value.roomType);
  addDetailRow('Package:', currentReceipt.value.packageName);
  addDetailRow('Tour Guide:', currentReceipt.value.tourGuideName);

  // Remit Calculation
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Remit Calculation', margin, yPos);
  yPos += lineHeight;

  doc.setFont('helvetica', 'normal');
  addDetailRow('Booking Price:', `₱${currentReceipt.value.bookingPrice.toFixed(2)}`);
  addDetailRow('Remit Amount:', `₱${currentReceipt.value.remitAmount.toFixed(2)}`);
  addDetailRow('Change:', `₱${calculateChange(currentReceipt.value).toFixed(2)}`);

  // Total Amount
  yPos += 10;
  doc.text('Total Amount Paid:', margin, yPos);
  
  // Format total amount in green
  doc.setTextColor(0, 150, 136);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`₱${currentReceipt.value.remitAmount.toFixed(2)}`, valueX, yPos, { align: 'right' });

  // Generated Date
  yPos += 20;
  doc.setFontSize(10);
  doc.setTextColor(102, 102, 102);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated at: ${formatDate(currentReceipt.value.generatedAt)}`, margin, yPos);

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
  z-index: 1000;
}

.modal-content.receipt-modal {
  background: white;
  width: 100%;
  max-width: 400px;
  min-height: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 0;
}

.receipt-header {
  position: relative;
  height: 50px;
  overflow: hidden;
  background: white;
  margin: 0;
  padding: 0;
}

.header-teal {
  position: absolute;
  top: 0;
  left: -10%;
  width: 60%;
  height: 100%;
  background-color: #009688;
  transform: skewX(-20deg);
}

.header-yellow {
  position: absolute;
  top: 0;
  right: -10%;
  width: 60%;
  height: 100%;
  background-color: #FFC107;
  transform: skewX(-20deg);
}

.receipt-content {
  padding: 0 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
}

.company-logo {
  width: 80px;
  height: 80px;
  margin: -40px auto 1rem;
  position: relative;
  z-index: 10;
  background: white;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.receipt-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0.5rem 0 1rem;
}

.receipt-divider {
  height: 1px;
  background-color: #E0E0E0;
  width: 100%;
}

.greeting {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-top: -3rem;
}

.receipt-ids {
  color: #666;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.receipt-ids p {
  margin: 0.25rem 0;
  color: #666;
}

.booking-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  border-bottom: 1px solid #E0E0E0;
}

.detail-row .label {
  color: #666;
  font-weight: 500;
  flex: 1;
}

.detail-row .value {
  color: #333;
  font-weight: 400;
  text-align: right;
  flex: 2;
}

.remit-calculation {
  border-top: 1px solid #E0E0E0;
  padding-top: 0.25rem;
}

.remit-calculation h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.total-amount {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 2rem;
  margin-top: auto;
  padding: 0.75rem 0;
  border-top: 2px solid #E0E0E0;
}

.total-amount .label {
  font-size: 0.9rem;
  color: #666;
}

.total-amount .value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #009688;
}

.generated-date {
  text-align: left;
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.75rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 0.5rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #E0E0E0;
}

.action-button {
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.action-button.print {
  background-color: #009688;
  color: white;
}

.action-button.download {
  background-color: #FFC107;
  color: #333;
}

.action-button.close {
  background-color: #E0E0E0;
  color: #333;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-content.receipt-modal {
  background: white;
  width: 100%;
  max-width: 1200px;
  min-height: auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.receipt-header {
  position: relative;
  height: 50px;
  overflow: hidden;
  background: white;
  margin: 0;
  padding: 0;
}

.header-teal {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background-color: #009688;
}

.header-yellow {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background-color: #FFC107;
}

.receipt-content {
  padding: 2rem 3rem;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  position: relative;
}

.receipt-title {
  text-align: center;
  font-size: 3rem;
  font-weight: 700;
  color: #000;
  margin: 1rem 0 2rem;
  grid-column: 1 / -1;
}

.greeting {
  font-size: 2rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 1rem;
}

.receipt-ids {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.booking-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.remit-calculation {
  margin-top: 10rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  height: fit-content;
  border: 1px solid #eee;
}

.remit-calculation h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 1rem;
}

.total-amount {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #ddd;
}

.total-amount .value {
  font-size: 2rem;
  font-weight: 700;
  color: #009688;
}

.modal-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.action-button {
  font-family: 'Poppins', sans-serif;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.action-button.print {
  background-color: #009688;
}

.action-button.close {
  background-color: #666;
  color: white;
}

.action-button.confirm-remit {
  background-color: #FFC107;
  color: #000;
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

.modal-container {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  position: relative;
  height: 40px;
  overflow: hidden;
}

.header-teal {
  position: absolute;
  top: 0;
  left: -10%;
  width: 60%;
  height: 100%;
  background-color: #009688;
  transform: skewX(-20deg);
}

.header-yellow {
  position: absolute;
  top: 0;
  right: -10%;
  width: 60%;
  height: 100%;
  background-color: #FFC107;
  transform: skewX(-20deg);
}

.modal-content {
  padding: 2rem;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
}

.remit-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.detail-label {
  font-weight: 500;
  color: #666;
}

.detail-value {
  font-weight: 600;
  color: #1a1a1a;
}

.remit-form {
  margin-bottom: 1.5rem;
}

.remit-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.remit-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  overflow: hidden;
}

.currency-symbol {
  background-color: #f3f4f6;
  padding: 0.5rem 0.75rem;
  color: #1a1a1a;
  font-weight: 600;
}

.remit-input {
  flex: 1;
  padding: 0.5rem;
  border: none;
  outline: none;
  font-size: 1rem;
}

.remit-note {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
  font-style: italic;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-button,
.confirm-button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button {
  font-family: 'Poppins', sans-serif;
  background-color: #f3f4f6;
  color: #1a1a1a;
  border: 1px solid #d1d5db;
}


.confirm-button {
  font-family: 'Poppins', sans-serif;
  background-color: #FFC107;
  color: #1a1a1a;
  border: none;
}

.confirm-button:disabled {
  background-color: #e0e0e0;
  color: #9e9e9e;
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

@media print {
  .modal-actions {
    display: none;
  }
  
  .receipt-modal {
    box-shadow: none;
    min-height: auto;
  }
  
  .receipt-content {
    padding: 2rem;
  }
  
  .booking-details {
    page-break-inside: avoid;
  }
}
</style>