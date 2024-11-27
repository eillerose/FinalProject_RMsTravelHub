<template>
  <div class="container">
    <div class="card main-card">
      <div class="card-header">
        <h2 class="card-title">Feedback Management</h2>
        <div class="search-container">
          <span class="search-icon">🔍</span>
          <input v-model="searchTerm" type="text" class="search-input" placeholder="Search feedbacks">
        </div>
      </div>
      <div class="card-content">
        <div v-if="loading.feedbacks" class="loading-indicator">
          <div class="loader"></div>
          Loading feedbacks...
        </div>
        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th class="w-1/12">ID</th>
                <th class="w-2/12">Name</th>
                <th class="w-3/12">Email</th>
                <th class="w-4/12">Message</th>
                <th class="w-1/12">Status</th>
                <th class="w-1/12">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="feedback in paginatedFeedbacks" 
                :key="feedback.id"
                @click="selectFeedback(feedback)"
                :class="{ 'selected-row': selectedFeedback && selectedFeedback.id === feedback.id }"
              >
                <td>{{ truncateId(feedback.id) }}</td>
                <td>{{ feedback.name }}</td>
                <td>{{ feedback.email }}</td>
                <td>{{ truncateFeedback(feedback.message) }}</td>
                <td>
                  <select 
                    v-model="feedback.status" 
                    @change="updateFeedbackStatus(feedback)" 
                    @click.stop
                    :disabled="loading.updateStatus === feedback.id"
                  >
                    <option>New</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                  <span v-if="loading.updateStatus === feedback.id" class="loader small"></span>
                </td>
                <td>
                  <button 
                    @click.stop="archiveFeedback(feedback)" 
                    class="archive-btn" 
                    title="Archive"
                    :disabled="loading.archive === feedback.id"
                  >
                    <span v-if="loading.archive === feedback.id" class="loader small"></span>
                    <span v-else>🗑️</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination">
          <div class="pagination-controls">
            <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn"> < </button>
            <span>{{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn"> > </button>
          </div>
          <div>
            <button @click="generateReport" class="btn btn-primary">Generate Report</button>
            <button @click="setActiveView('archives')" class="btn btn-secondary">View Archives</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeView === 'archives'" class="card side-card">
      <div class="card-header">
        <h2 class="card-title">Archived Feedbacks</h2>
        <button @click="closeActiveView" class="close-btn">❌</button>
      </div>
      <div class="card-content">
        <div v-if="loading.archives" class="loading-indicator">
          <div class="loader"></div>
          Loading archived feedbacks...
        </div>
        <div v-else class="archived-feedbacks-list">
          <div 
            v-for="feedback in archivedFeedbacks" 
            :key="feedback.id" 
            class="archived-feedback"
            :class="{ 'selected': selectedArchivedFeedback && selectedArchivedFeedback.id === feedback.id }"
            @click="selectArchivedFeedback(feedback)"
          >
            <h4>{{ feedback.name }}</h4>
            <p>{{ truncateFeedback(feedback.message, 100) }}</p>
            <p><strong>Email:</strong> {{ feedback.email }}</p>
            <p><strong>Status:</strong> {{ feedback.status }}</p>
          </div>
        </div>
      </div>
      <div class="fixed-button-container">
        <button 
          @click="restoreFeedback(selectedArchivedFeedback)" 
          class="btn btn-secondary"
          :disabled="!selectedArchivedFeedback || loading.restore"
        >
          <span v-if="loading.restore" class="loader small"></span>
          <span v-else>Restore</span>
        </button>
      </div>
    </div>

    <div v-if="selectedFeedback" class="card side-card">
      <div class="card-header">
        <h2 class="card-title">Feedback Details</h2>
        <button @click="closeActiveView" class="close-btn">❌</button>
      </div>
      <div class="card-content">
        <div class="feedback-details">
          <p><strong>ID:</strong> {{ selectedFeedback.id }}</p>
          <p><strong>Name:</strong> {{ selectedFeedback.name }}</p>
          <p><strong>Email:</strong> {{ selectedFeedback.email }}</p>
          <p><strong>Status:</strong> {{ selectedFeedback.status }}</p>
          <p><strong>Message:</strong></p>
          <p class="full-feedback">{{ selectedFeedback.message }}</p>
          
          <h4>Replies</h4>
          <div v-if="selectedFeedback.replies && selectedFeedback.replies.length > 0">
            <div v-for="(reply, index) in selectedFeedback.replies" :key="index" class="reply">
              <p><strong>Admin:</strong> {{ reply.text }}</p>
              <p><small>{{ formatDate(reply.date) }}</small></p>
            </div>
          </div>
          <div v-else>
            <p>No replies yet.</p>
          </div>
          
          <div class="form-group">
            <label for="reply">Add Reply</label>
            <textarea v-model="newReply" id="reply" rows="3"></textarea>
          </div>
        </div>
      </div>
      <div class="fixed-button-container">
        <button 
          @click="addReply" 
          class="btn btn-primary"
          :disabled="loading.addReply"
        >
          <span v-if="loading.addReply" class="loader small"></span>
          <span v-else>Send Reply</span>
        </button>
      </div>
    </div>

    <div v-if="activeView === 'report'" class="card side-card">
      <div class="card-header">
        <h2 class="card-title">Feedback Report</h2>
        <button @click="closeActiveView" class="close-btn">❌</button>
      </div>
      <div class="card-content">
        <table class="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="feedback in feedbacks" :key="feedback.id">
              <td>{{ truncateId(feedback.id) }}</td>
              <td>{{ feedback.name }}</td>
              <td>{{ feedback.email }}</td>
              <td>{{ truncateFeedback(feedback.message, 30) }}</td>
              <td>{{ feedback.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="fixed-button-container">
        <button @click="printReport" class="btn btn-primary">Print Report</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  collectionGroup,
  where
} from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// State variables
const feedbacks = ref([]);
const archivedFeedbacks = ref([]);
const newReply = ref('');
const selectedFeedback = ref(null);
const selectedArchivedFeedback = ref(null);
const activeView = ref(null);
const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

// Loading states
const loading = ref({
  feedbacks: false,
  updateStatus: null,
  archive: null,
  restore: false,
  addReply: false,
  archives: false
});

// Computed properties
const filteredFeedbacks = computed(() => {
  return feedbacks.value.filter(fb =>
    fb.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    fb.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    fb.message.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const paginatedFeedbacks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredFeedbacks.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredFeedbacks.value.length / itemsPerPage));

// Utility functions
const formatDate = (date) => {
  if (date && date.toDate) {
    date = date.toDate();
  }
  if (!(date instanceof Date)) {
    return 'Invalid Date';
  }
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString(undefined, options);
};

const truncateFeedback = (feedback, maxLength = 50) => {
  return feedback?.length > maxLength ? feedback.substring(0, maxLength) + '...' : feedback;
};

const truncateId = (id, maxLength = 8) => {
  return id?.substring(0, maxLength) + '...';
};

// Fetch feedbacks from Firestore
const fetchFeedbacks = async () => {
  loading.value.feedbacks = true;
  try {
    feedbacks.value = [];
    archivedFeedbacks.value = [];
    const contactsQuery = query(collection(db, 'contacts'), limit(100));
    const querySnapshot = await getDocs(contactsQuery);

    for (const docSnapshot of querySnapshot.docs) {
      const contactData = docSnapshot.data();
      const repliesQuery = query(collection(db, 'contacts', docSnapshot.id, 'replies'), orderBy('date', 'asc'));
      const repliesSnapshot = await getDocs(repliesQuery);
      
      const replies = repliesSnapshot.docs.map(replyDoc => ({
        id: replyDoc.id,
        ...replyDoc.data()
      }));

      const feedback = {
        id: docSnapshot.id,
        email: contactData.email,
        name: contactData.name,
        message: contactData.message,
        status: contactData.status || 'New',
        replies: replies,
        archived: contactData.archived || false
      };

      if (feedback.archived) {
        archivedFeedbacks.value.push(feedback);
      } else {
        feedbacks.value.push(feedback);
      }
    }
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    alert('Failed to fetch feedbacks. Please check your database connection.');
  } finally {
    loading.value.feedbacks = false;
  }
};

// Update feedback status in Firestore
const updateFeedbackStatus = async (feedback) => {
  loading.value.updateStatus = feedback.id;
  try {
    const feedbackRef = doc(db, 'contacts', feedback.id);
    await updateDoc(feedbackRef, { status: feedback.status });
    alert(`Status updated to ${feedback.status}`);
  } catch (error) {
    console.error('Error updating feedback status:', error);
    alert('Failed to update status');
  } finally {
    loading.value.updateStatus = null;
  }
};

// Archive feedback
const archiveFeedback = async (feedback) => {
  if (!confirm('Are you sure you want to archive this feedback?')) return;

  loading.value.archive = feedback.id;
  try {
    const feedbackRef = doc(db, 'contacts', feedback.id);
    await updateDoc(feedbackRef, { archived: true });

    feedbacks.value = feedbacks.value.filter((fb) => fb.id !== feedback.id);
    archivedFeedbacks.value.push({ ...feedback, archived: true });

    alert('Feedback archived successfully!');
  } catch (error) {
    console.error('Error archiving feedback:', error);
    alert('Failed to archive feedback');
  } finally {
    loading.value.archive = null;
  }
};

// Restore archived feedback
const restoreFeedback = async (feedback) => {
  if (!feedback) return;

  loading.value.restore = true;
  try {
    const feedbackRef = doc(db, 'contacts', feedback.id);
    await updateDoc(feedbackRef, { archived: false });

    archivedFeedbacks.value = archivedFeedbacks.value.filter((fb) => fb.id !== feedback.id);
    feedbacks.value.push({ ...feedback, archived: false });

    selectedArchivedFeedback.value = null;
    alert('Feedback restored successfully!');
  } catch (error) {
    console.error('Error restoring feedback:', error);
    alert('Failed to restore feedback');
  } finally {
    loading.value.restore = false;
  }
};

// Add reply to feedback
const addReply = async () => {
  if (!newReply.value.trim()) {
    alert('Please enter a reply before sending.');
    return;
  }

  loading.value.addReply = true;
  try {
    const replyDoc = {
      text: newReply.value,
      date: serverTimestamp()
    };

    const replyRef = await addDoc(
      collection(db, 'contacts', selectedFeedback.value.id, 'replies'), 
      replyDoc
    );
    
    selectedFeedback.value.replies.push({
      id: replyRef.id,
      ...replyDoc,
      date: new Date()
    });
    
    newReply.value = '';
    alert('Reply added successfully!');
  } catch (error) {
    console.error('Error adding reply:', error);
    alert('Failed to add reply');
  } finally {
    loading.value.addReply = false;
  }
};

// Generate PDF report
const generateReport = () => {
  activeView.value = 'report';
};

const printReport = () => {
  const doc = new jsPDF();
  doc.text("Feedback Report", 14, 15);
  
  const tableData = feedbacks.value.map(feedback => [
    truncateId(feedback.id),
    feedback.name,
    feedback.email,
    truncateFeedback(feedback.message, 30),
    feedback.status
  ]);

  doc.autoTable({
    head: [['ID', 'Name', 'Email', 'Message', 'Status']],
    body: tableData,
    startY: 20
  });

  doc.save("feedback_report.pdf");
};

// Select a feedback to view
const selectFeedback = (feedback) => {
  selectedFeedback.value = feedback;
  activeView.value = null;
};

// Select an archived feedback
const selectArchivedFeedback = (feedback) => {
  selectedArchivedFeedback.value = feedback;
};

// Close side panel
const closeActiveView = () => {
  activeView.value = null;
  selectedFeedback.value = null;
  selectedArchivedFeedback.value = null;
  newReply.value = '';
};

// Set active view for UI switching
const setActiveView = (view) => {
  activeView.value = view;
  selectedFeedback.value = null;
  selectedArchivedFeedback.value = null;
  if (view === 'archives') {
    loading.value.archives = true;
    // Simulating a delay for loading archived feedbacks
    setTimeout(() => {
      loading.value.archives = false;
    }, 1000);
  }
};

// Pagination controls
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Watch for search term changes
watch(searchTerm, () => {
  currentPage.value = 1;
});

// Load feedbacks on component mount
onMounted(fetchFeedbacks);
</script>

<style scoped>
.container {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.main-card {
  flex: 1;
  min-width: 800px;
}

.side-card {
  width: 400px;
  position: relative;
}

.card-header {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
}

.search-input {
  padding: 8px 8px 8px 30px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 250px;
}

.table-container {
  overflow-x: auto;
  height: 400px;
  width: 100%;
}

table {
  width: 100%;
  table-layout: fixed;
}

th, td {
  width: 20%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
}

tr:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}

.selected-row {
  background-color: #e3f2fd;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-btn {
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: none;
  cursor: pointer;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.feedback-details {
  padding: 1rem;
}

.full-feedback {
  margin: 1rem 0;
  white-space: pre-wrap;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
}

.reply {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.form-group {
  margin: 1rem 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  resize: vertical;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background-color: #1976d2;
  color: white;
}

.btn-secondary {
  background-color: #757575;
  color: white;
  margin-left: 8px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 4px;
}

.archive-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
}

.archived-feedbacks-list {
  max-height: 400px;
  overflow-y: auto;
}

.archived-feedback {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.archived-feedback:hover {
  background-color: #e9ecef;
}

.archived-feedback.selected {
  background-color: #e3f2fd;
}

.archived-feedback h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.archived-feedback p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
}

.report-table th, .report-table td {
  border: 1px solid #e0e0e0;
  padding: 8px;
  text-align: left;
}

.report-table th {
  background-color: #f8f9fa;
}

.mt-4 {
  margin-top: 1rem;
}

.fixed-button-container {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 14px;
  color: #666;
}

.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 10px;
}

.loader.small {
  width: 12px;
  height: 12px;
  border-width: 2px;
  margin-right: 5px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>