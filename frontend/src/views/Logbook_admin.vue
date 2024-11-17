<template>
  <div class="tour-logs">
    <div class="tour-logs-header">
      <h2 class="section-title">Tour Logs</h2>
      <div class="header-actions">
        <button @click="openModal" class="add-button">+ Add Log Entry</button>
        <button @click="exportLogs" class="export-button">Export Logs</button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <input v-model="filters.dateFrom" type="date" placeholder="From Date">
      <input v-model="filters.dateTo" type="date" placeholder="To Date">
      <input v-model="filters.tourGuide" placeholder="Tour Guide">
      <select v-model="filters.actionType">
        <option value="">All Actions</option>
        <option value="create">Create</option>
        <option value="update">Update</option>
        <option value="delete">Delete</option>
      </select>
      <button @click="applyFilters" class="filter-button">Apply Filters</button>
    </div>

    <!-- Search -->
    <div class="search">
      <input v-model="searchQuery" placeholder="Search logs...">
    </div>

    <div class="tour-logs-table">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Tour Guide</th>
            <th>Tour Name</th>
            <th>Guests</th>
            <th>Action Type</th>
            <th>User</th>
            <th>IP Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in filteredAndPaginatedLogs" :key="log.id">
            <td>{{ formatDate(log.date) }}</td>
            <td>{{ log.tourGuide }}</td>
            <td>{{ log.tourName }}</td>
            <td>{{ log.guestCount }}</td>
            <td>{{ log.actionType }}</td>
            <td>{{ log.user }}</td>
            <td>{{ log.ipAddress }}</td>
            <td>
              <button @click="openModal(log)" class="edit-button">Edit</button>
              <button @click="deleteLog(log.id)" class="delete-button">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-controls">
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>

    <!-- Modal for adding/editing log entries -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <h3>{{ editingLog ? 'Edit Log Entry' : 'Add New Log Entry' }}</h3>
        <form @submit.prevent="saveLog">
          <input type="date" v-model="currentLog.date" required>
          <input v-model="currentLog.tourGuide" placeholder="Tour Guide" required>
          <input v-model="currentLog.tourName" placeholder="Tour Name" required>
          <input v-model="currentLog.guestCount" placeholder="Number of Guests" type="number" required>
          <select v-model="currentLog.actionType" required>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
          <input v-model="currentLog.user" placeholder="User" required>
          <input v-model="currentLog.ipAddress" placeholder="IP Address" required>
          
          <div v-if="loading" class="loading">Saving...</div>
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" :disabled="loading">Cancel</button>
            <button type="submit" :disabled="loading">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';

export default {
  name: 'Logbook',
  setup() {
    const logs = ref([]);
    const isModalOpen = ref(false);
    const editingLog = ref(null);
    const currentLog = ref({ date: '', tourGuide: '', tourName: '', guestCount: 0, actionType: '', user: '', ipAddress: '' });
    const loading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');

    const itemsPerPage = ref(10);
    const currentPage = ref(1);
    const searchQuery = ref('');
    const filters = ref({
      dateFrom: '',
      dateTo: '',
      tourGuide: '',
      actionType: ''
    });

    const totalPages = computed(() => Math.ceil(filteredLogs.value.length / itemsPerPage.value));

    const filteredLogs = computed(() => {
      return logs.value.filter(log => {
        const matchesSearch = Object.values(log).some(value => 
          value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
        );
        const matchesFilters = 
          (!filters.value.dateFrom || log.date >= filters.value.dateFrom) &&
          (!filters.value.dateTo || log.date <= filters.value.dateTo) &&
          (!filters.value.tourGuide || log.tourGuide.toLowerCase().includes(filters.value.tourGuide.toLowerCase())) &&
          (!filters.value.actionType || log.actionType === filters.value.actionType);
        return matchesSearch && matchesFilters;
      });
    });

    const filteredAndPaginatedLogs = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredLogs.value.slice(start, end);
    });

    const fetchLogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'logs'));
        logs.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error fetching logs:', error);
        errorMessage.value = 'Failed to load logs. Please try again later.';
      }
    };

    const openModal = (log = null) => {
      editingLog.value = log;
      currentLog.value = log ? { ...log } : { date: '', tourGuide: '', tourName: '', guestCount: 0, actionType: '', user: '', ipAddress: '' };
      isModalOpen.value = true;
      errorMessage.value = '';
      successMessage.value = '';
    };

    const closeModal = () => {
      isModalOpen.value = false;
      editingLog.value = null;
      errorMessage.value = '';
      successMessage.value = '';
    };

    const saveLog = async () => {
      loading.value = true;
      errorMessage.value = '';
      successMessage.value = '';

      try {
        if (editingLog.value) {
          await updateDoc(doc(db, 'logs', editingLog.value.id), currentLog.value);
          successMessage.value = 'Log entry updated successfully!';
        } else {
          await addDoc(collection(db, 'logs'), currentLog.value);
          successMessage.value = 'Log entry added successfully!';
        }
        await fetchLogs();
        closeModal();
      } catch (error) {
        console.error('Error saving log:', error);
        errorMessage.value = 'Failed to save log entry. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const deleteLog = async (id) => {
      loading.value = true;
      errorMessage.value = '';
      successMessage.value = '';

      try {
        await deleteDoc(doc(db, 'logs', id));
        await fetchLogs();
        successMessage.value = 'Log entry deleted successfully!';
      } catch (error) {
        console.error('Error deleting log:', error);
        errorMessage.value = 'Failed to delete log entry. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const applyFilters = () => {
      currentPage.value = 1; // Reset to first page when applying filters
    };

    const exportLogs = () => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + filteredLogs.value.map(log => Object.values(log).join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "tour_logs.csv");
      document.body.appendChild(link);
      link.click();
    };

    onMounted(fetchLogs);

    return {
      logs,
      isModalOpen,
      editingLog,
      currentLog,
      loading,
      errorMessage,
      successMessage,
      itemsPerPage,
      currentPage,
      totalPages,
      filteredAndPaginatedLogs,
      searchQuery,
      filters,
      openModal,
      closeModal,
      saveLog,
      deleteLog,
      formatDate,
      nextPage,
      prevPage,
      applyFilters,
      exportLogs
    };
  }
};
</script>

<style scoped>
.tour-logs {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tour-logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.add-button, .export-button, .filter-button {
  background-color: #6b7f9e;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 10px;
}

.add-button:hover, .export-button:hover, .filter-button:hover {
  background-color: #5a6d8a;
}

.tour-logs-table {
  padding: 20px;
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

.edit-button, .delete-button {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button {
  background-color: #6b7f9e;
  color: white;
  margin-right: 8px;
}

.edit-button:hover {
  background-color: #5a6d8a;
}

.delete-button {
  background-color: #ef4444;
  color: white;
}

.delete-button:hover {
  background-color: #dc2626;
}

.loading {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 8px;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 8px;
}

.success-message {
  color: #10b981;
  font-size: 0.875rem;
  margin-top: 8px;
}

.pagination-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px;
}

.pagination-controls button {
  background-color: #6b7f9e;
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
  max-width: 400px;
}

.modal-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.modal-content form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-content input, .modal-content select {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.modal-actions button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-actions button[type="button"] {
  background-color: #e5e7eb;
  color: #374151;
}

.modal-actions button[type="button"]:hover {
  background-color: #d1d5db;
}

.modal-actions button[type="submit"] {
  background-color: #6b7f9e;
  color: white;
}

.modal-actions button[type="submit"]:hover {
  background-color: #5a6d8a;
}

.filters, .search {
  display: flex;
  gap: 10px;
  margin: 20px;
}

.filters input, .filters select, .search input {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}
</style>