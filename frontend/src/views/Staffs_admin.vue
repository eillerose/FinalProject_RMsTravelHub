<template>
  <h1 class="section-title">Tour Staffs</h1>
  <div class="staff-management">

    
    <!-- Tabs and Search moved to the top -->
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

    <!-- Main Container -->
    <div class="main-container">
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.staff-management {
  font-family: 'Poppins', sans-serif;
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
}

.tab-button {
  font-family: 'Poppins', sans-serif;
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
}

.tab-button.active {
  color: #1a1a1a;
  border-bottom: 2px solid #1a1a1a;
}

.search-container {
  width: 300px;
}

.search-input {
  font-family: 'Poppins', sans-serif;
  width: 94%;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
}

.main-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  position: relative;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 4rem;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
}

.staff-table {
  width: 100%;
  border-collapse: collapse;
  
}

.staff-table th,.staff-table th,
.staff-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.staff-table th {
  font-weight: 600;
  color: #1a1a1a;
  background-color: #f8f8f8;
}

.action-button {
  font-family: 'Poppins', sans-serif;
  padding: 0.5rem .5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 1rem;
  transition: background-color 0.3s ease;
}

.action-button.edit {
  background-color: #3498db;
  color: white;
}

.action-button.edit:hover {
  background-color: #d0d0d0;
}

.action-button.delete {
  background-color: red;
  color: white;
}

.action-button.delete:hover {
  background-color: #ffcdd2;
}

.add-button {
  font-family: 'Poppins', sans-serif;
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #0a8d88;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #076c68;
}

.side-panel {
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  overflow-y: auto;
  position: fixed;
  top: 0;
  right: 0;
  transform: translateX(100%);
  z-index: 1000;
}

.side-panel.open {
  transform: translateX(0);
}

.panel-content {
  padding: 2rem;
}

.panel-content h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0a8d88;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-button,
.submit-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.cancel-button {
  background-color: #e0e0e0;
  color: #1a1a1a;
}

.cancel-button:hover {
  background-color: #d0d0d0;
}

.submit-button {
  background-color: #0a8d88;
  color: white;
}

.submit-button:hover {
  background-color: #076c68;
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
  margin-top: 1rem;
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
  z-index: 2000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

.large-profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
}

.close-button {
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #e0e0e0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: #d0d0d0;
}
</style>