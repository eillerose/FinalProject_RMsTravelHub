<template>
    <div class="invoice-receipt">
      <div class="document" :class="{ 'invoice': type === 'invoice', 'receipt': type === 'receipt' }">
        <div class="document-header">
          <h1>{{ type === 'invoice' ? 'Invoice' : 'Receipt' }}</h1>
          <div class="document-info">
            <p>{{ type === 'invoice' ? 'Invoice' : 'Receipt' }} number: {{ documentNumber }}</p>
            <p>Date: {{ formatDate(type === 'invoice' ? booking.createdAt : new Date()) }}</p>
            <p v-if="type === 'invoice'">Due date: {{ formatDate(getDueDate()) }}</p>
            <p v-if="type === 'receipt'">Payment received: {{ formatDate(booking.paymentDate) }}</p>
          </div>
        </div>
  
        <div class="document-addresses">
          <div class="from">
            <p>RMs Travel and Tour</p>
            <p>123 Travel Street</p>
            <p>Adventure City, AC 12345</p>
            <p>Phone: (123) 456-7890</p>
            <p>Email: info@rmstravelandtour.com</p>
          </div>
          <div class="to">
            <p>{{ type === 'invoice' ? 'Bill to:' : 'Received from:' }}</p>
            <p>{{ booking.guestName }}</p>
            <p>{{ booking.email }}</p>
            <p>{{ booking.phone }}</p>
          </div>
        </div>
  
        <div class="document-details">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ booking.package.name }}</td>
                <td>₱{{ booking.package.price.toFixed(2) }}</td>
              </tr>
              <tr>
                <td>{{ booking.hotelAndRoom.room.name }} ({{ formatDate(booking.checkInDate) }})</td>
                <td>₱{{ booking.hotelAndRoom.room.price.toFixed(2) }}</td>
              </tr>
              <tr class="total">
                <td>Total {{ type === 'invoice' ? 'Amount Due' : 'Amount Paid' }}</td>
                <td>₱{{ booking.totalPrice.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div class="document-footer">
          <p v-if="type === 'invoice'">Payment is due within 7 days of booking</p>
          <p v-else>Thank you for your payment</p>
          <p>Thank you for choosing RMs Travel and Tour!</p>
        </div>
      </div>
  
      <button @click="downloadDocument" class="download-btn">
        Download {{ type === 'invoice' ? 'Invoice' : 'Receipt' }}
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import html2pdf from 'html2pdf.js'
  
  const props = defineProps({
    booking: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['invoice', 'receipt'].includes(value)
    }
  })
  
  const documentNumber = ref('')
  
  onMounted(() => {
    documentNumber.value = `${props.type === 'invoice' ? 'INV' : 'RCP'}-${Date.now()}`
  })
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const getDueDate = () => {
    const dueDate = new Date(props.booking.createdAt)
    dueDate.setDate(dueDate.getDate() + 7)
    return dueDate
  }
  
  const downloadDocument = () => {
    const element = document.querySelector('.document')
    const opt = {
      margin: 1,
      filename: `${props.type}_${documentNumber.value}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
  
    html2pdf().set(opt).from(element).save()
  }
  </script>
  
  <style scoped>
  .invoice-receipt {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .document {
    border: 1px solid #ccc;
    padding: 40px;
    margin-bottom: 20px;
  }
  
  .document-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
  }
  
  .document-header h1 {
    font-size: 24px;
    color: #333;
  }
  
  .document-info {
    text-align: right;
  }
  
  .document-addresses {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
  }
  
  .from, .to {
    flex: 1;
  }
  
  .document-details table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .document-details th, .document-details td {
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  
  .document-details th {
    text-align: left;
    background-color: #f0f0f0;
  }
  
  .total {
    font-weight: bold;
  }
  
  .document-footer {
    margin-top: 40px;
    text-align: center;
    color: #666;
  }
  
  .download-btn {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #10b981;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .download-btn:hover {
    background-color: #059669;
  }
  </style>