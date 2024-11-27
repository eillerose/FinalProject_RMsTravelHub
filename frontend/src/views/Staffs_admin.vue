<template>
  <div class="staff-management">
    <!-- Main Container -->
    <div class="main-container">
      <!-- Tabs and Search -->
      <div class="header">
        <div class="tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-button', { 'active': activeTab === tab.id }]"
          >
            {{ tab.name }}
          </button>
        </div>
        <div class="search-container">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search" 
            class="search-input"
          >
        </div>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="staff-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Years of Experience</th>
              <th v-if="activeTab === 'guides'">Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="person in filteredStaff" :key="person.id" @click="showDetails(person)">
              <td>
                <img :src="person.profilePhoto || '/placeholder.svg'" alt="Profile" class="profile-photo">
              </td>
              <td>{{ person.firstName }} {{ person.lastName }}</td>
              <td>{{ person.email }}</td>
              <td>{{ person.phone }}</td>
              <td>{{ calculateExperience(person.startDate) }}</td>
              <td v-if="activeTab === 'guides'">{{ person.specialization }}</td>
              <td>
                <button @click.stop="editStaff(person)" class="action-button edit">Edit</button>
                <button @click.stop="deleteStaff(person.id)" class="action-button delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button @click="openAddPanel" class="add-button">
        Add New {{ activeTab === 'guides' ? 'Guide' : 'Staff' }}
      </button>
    </div>

    <!-- Side Panel -->
    <div :class="['side-panel', { 'open': isPanelOpen }]">
      <div class="panel-content">
        <h2>{{ isEditing ? 'Edit Staff' : 'Add New Staff' }}</h2>
        <form @submit.prevent="saveStaff">
          <div class="form-group">
            <input v-model="currentStaff.firstName" placeholder="First Name" required>
          </div>
          <div class="form-group">
            <input v-model="currentStaff.lastName" placeholder="Last Name" required>
          </div>
          <div class="form-group">
            <input v-model="currentStaff.email" type="email" placeholder="Email" required>
          </div>
          <div class="form-group">
            <input v-model="currentStaff.phone" placeholder="Phone" required>
          </div>
          <div class="form-group">
            <textarea v-model="currentStaff.bio" placeholder="Bio" rows="3"></textarea>
          </div>
          <div class="form-group">
            <input v-model="currentStaff.startDate" type="date" required>
          </div>
          <div class="form-group">
            <label>Languages Spoken:</label>
            <div v-for="lang in languages" :key="lang">
              <input type="checkbox" :id="lang" :value="lang" v-model="currentStaff.languagesSpoken">
              <label :for="lang">{{ lang }}</label>
            </div>
          </div>
          <div v-if="activeTab === 'guides'" class="form-group">
            <input v-model="currentStaff.specialization" placeholder="Tour Specialization" required>
          </div>
          <div class="form-group">
            <label for="profilePhoto">Profile Photo:</label>
            <input type="file" id="profilePhoto" @change="handleFileUpload" accept="image/*">
          </div>
          <div v-if="currentStaff.profilePhoto" class="form-group">
            <img :src="currentStaff.profilePhoto" alt="Profile Preview" class="profile-preview">
          </div>
          <div class="form-actions">
            <button type="button" @click="closePanel" class="cancel-button">Cancel</button>
            <button type="submit" class="submit-button">
              {{ isEditing ? 'Save Changes' : 'Add Staff' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedStaff" class="modal-overlay" @click="closeDetails">
      <div class="modal-content" @click.stop>
        <h2>{{ selectedStaff.firstName }} {{ selectedStaff.lastName }}</h2>
        <img :src="selectedStaff.profilePhoto || '/placeholder.svg'" alt="Profile" class="large-profile-photo">
        <p><strong>ID:</strong> {{ selectedStaff.id }}</p>
        <p><strong>Email:</strong> {{ selectedStaff.email }}</p>
        <p><strong>Phone:</strong> {{ selectedStaff.phone }}</p>
        <p><strong>Bio:</strong> {{ selectedStaff.bio }}</p>
        <p><strong>Years of Experience:</strong> {{ calculateExperience(selectedStaff.startDate) }}</p>
        <p><strong>Languages Spoken:</strong> {{ selectedStaff.languagesSpoken.join(', ') }}</p>
        <p v-if="selectedStaff.specialization"><strong>Specialization:</strong> {{ selectedStaff.specialization }}</p>
        <button @click="closeDetails" class="close-button">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebaseConfig'

const tabs = [
  { id: 'guides', name: 'Tour Guide' },
  { id: 'other', name: 'Marketing & Sales Staff' }
]

const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Chinese', 'Japanese']

const activeTab = ref('guides')
const staff = ref([])
const searchQuery = ref('')
const isPanelOpen = ref(false)
const isEditing = ref(false)
const selectedStaff = ref(null)
const currentStaff = ref({
  id: 0,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  bio: '',
  startDate: '',
  languagesSpoken: [],
  specialization: '',
  profilePhoto: '',
  role: ''
})

const filteredStaff = computed(() => {
  return staff.value.filter(s => 
    s.role === activeTab.value &&
    (s.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
     s.lastName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
     s.email.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
})

const fetchStaff = async () => {
  try {
    const staffSnapshot = await getDocs(collection(db, 'staff'));
    staff.value = staffSnapshot.docs
      .map(doc => {
        const data = doc.data();
        return { ...data, id: parseInt(doc.id, 10) };
      })
      .sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error('Error fetching staff:', error);
    alert('Failed to fetch staff data. Please try again.');
  }
}

const saveStaff = async () => {
  try {
    currentStaff.value.role = activeTab.value;
    let staffRef;
    let operation;

    if (isEditing.value) {
      // Update existing staff member
      staffRef = doc(db, 'staff', currentStaff.value.id.toString());
      operation = updateDoc(staffRef, {
        ...currentStaff.value,
        id: currentStaff.value.id.toString()
      });
    } else {
      // Add new staff member
      const maxId = staff.value.reduce((max, s) => Math.max(max, s.id), 0);
      currentStaff.value.id = maxId + 1;
      staffRef = doc(db, 'staff', currentStaff.value.id.toString());
      operation = setDoc(staffRef, {
        ...currentStaff.value,
        id: currentStaff.value.id.toString()
      });
    }

    await operation;

    // Update local state
    const index = staff.value.findIndex(s => s.id === currentStaff.value.id);
    if (index !== -1) {
      staff.value[index] = { ...currentStaff.value };
    } else {
      staff.value.push({ ...currentStaff.value });
    }

    // Update selectedStaff if it's the same as the edited staff
    if (selectedStaff.value && selectedStaff.value.id === currentStaff.value.id) {
      selectedStaff.value = { ...currentStaff.value };
    }

    closePanel();
    alert(isEditing.value ? 'Staff updated successfully!' : 'New staff added successfully!');
  } catch (error) {
    console.error('Error saving staff:', error);
    alert(`Failed to save staff member. Error: ${error.message}`);
  }
}

const deleteStaff = async (id) => {
  if (!confirm('Are you sure you want to delete this staff member?')) return;
  
  try {
    const staffRef = doc(db, 'staff', id.toString());
    const staffData = staff.value.find(s => s.id === id);
    
    if (staffData && staffData.profilePhoto) {
      const photoRef = storageRef(storage, staffData.profilePhoto);
      await deleteObject(photoRef);
    }
    
    await deleteDoc(staffRef);
    staff.value = staff.value.filter(s => s.id !== id);
    
    // Close details modal if the deleted staff was selected
    if (selectedStaff.value && selectedStaff.value.id === id) {
      selectedStaff.value = null;
    }
    
    alert('Staff member deleted successfully!');
  } catch (error) {
    console.error('Error deleting staff:', error);
    alert(`Failed to delete staff member. Error: ${error.message}`);
  }
}

const openAddPanel = () => {
  currentStaff.value = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    startDate: '',
    languagesSpoken: [],
    specialization: '',
    profilePhoto: '',
    role: activeTab.value
  }
  isEditing.value = false
  isPanelOpen.value = true
}

const editStaff = (staffMember) => {
  currentStaff.value = { ...staffMember };
  isEditing.value = true;
  isPanelOpen.value = true;
}

const closePanel = () => {
  isPanelOpen.value = false
  isEditing.value = false
}

const showDetails = (staffMember) => {
  selectedStaff.value = { ...staffMember }
}

const closeDetails = () => {
  selectedStaff.value = null
}

const calculateExperience = (startDate) => {
  const start = new Date(startDate)
  const now = new Date()
  return Math.floor((now - start) / (365.25 * 24 * 60 * 60 * 1000))
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    const fileRef = storageRef(storage, `profile-photos/${Date.now()}-${file.name}`)
    try {
      const snapshot = await uploadBytes(fileRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      currentStaff.value.profilePhoto = downloadURL
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload profile photo. Please try again.')
    }
  }
}

// Fetch staff on component mount
fetchStaff()
</script>

<style scoped>
/* Styles remain unchanged */
.staff-management {
  display: flex;
  height: 85vh;
  font-family: Arial, sans-serif;
}

.main-container {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  background-color: white;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.tab-button {
  background: none;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
}

.tab-button.active {
  border-bottom: 2px solid #000;
}

.search-container {
  width: 300px;
  margin-right: 30px;
}

.search-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
}

.table-container {
  margin-bottom: 60px;
  overflow-x: auto;
}

.staff-table {
  width: 100%;
  border-collapse: collapse;
}

.staff-table th,
.staff-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.staff-table th {
  font-weight: 500;
  color: #666;
}

.action-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 8px;
}

.action-button.edit {
  background-color: #f0f0f0;
}

.action-button.delete {
  background-color: #ffebee;
  color: #d32f2f;
}

.add-button {
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.side-panel {
  width: 50%;
  height: 100vh;
  background: white;
  border-left: 1px solid #e0e0e0;
  transition: transform 0.3s ease;
  overflow-y: auto;
  position: fixed;
  top: 0;
  right: 0;
  transform: translateX(100%);
}

.side-panel.open {
  transform: translateX(0);
}

.panel-content {
  padding: 24px;
}

.panel-content h2 {
  margin-bottom: 24px;
  font-size: 18px;
  font-weight: 500;
}

.form-group {
  margin-bottom: 16px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
}

.cancel-button,
.submit-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-button {
  background-color: #f0f0f0;
}

.submit-button {
  background-color: #000;
  color: white;
}

.profile-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 8px;
}

.modal-overlay {
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
  max-width: 500px;
  width: 100%;
}

.large-profile-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
}

.close-button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
</style>