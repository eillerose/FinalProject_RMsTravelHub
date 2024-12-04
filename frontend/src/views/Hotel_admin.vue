<template>
  <div class="hotel-management">
    <!-- Main Panel -->
    <div class="main-panel">
      <div class="header">
        <h2>Hotel Management</h2>
        <div class="search-container">
          <input v-model="searchTerm" type="text" placeholder="Search hotels..." class="search-input">
        </div>
      </div>

      <div class="hotel-list">
        <table>
          <thead>
            <tr>
              <th style="width: 5%;">ID</th>
              <th style="width: 30%;">Hotel Name</th>
              <th style="width: 30%;">Location</th>
              <th style="width: 20%;">Contact</th>
              <th style="width: 15%;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="5" class="text-center">
                <div class="loading-spinner"></div>
                Loading...
              </td>
            </tr>
            <tr v-else v-for="(hotel, index) in filteredHotels" :key="hotel.id" @click="selectHotel(hotel)">
              <td>{{ index + 1 }}</td>
              <td>{{ hotel.name }}</td>
              <td>{{ hotel.location }}</td>
              <td>{{ hotel.phone }}</td>
              <td class="actions">
                <button class="edit-btn" @click.stop="editHotel(hotel)" :disabled="isLoading">
                  <span v-if="isLoading && loadingHotel === hotel.id" class="loading-spinner small"></span>
                  <span v-else>Edit</span>
                </button>
                <button class="delete-btn" @click.stop="deleteHotel(hotel.id)" :disabled="isLoading">
                  <span v-if="isLoading && loadingHotel === hotel.id" class="loading-spinner small"></span>
                  <span v-else>Delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="add-hotel-container">
        <button @click="openAddHotelModal" class="add-btn" :disabled="isLoading">
          <span v-if="isLoading && !loadingHotel" class="loading-spinner small"></span>
          <span v-else>Add New Hotel</span>
        </button>
      </div>
    </div>

    <!-- Side Panel -->
    <div v-if="selectedHotel" class="side-panel" :class="{ 'active': selectedHotel }">
      <div class="panel-header">
        <h2>{{ selectedHotel.name }}</h2>
        <button class="close-btn" @click="closePanel">×</button>
      </div>

      <div class="panel-content">
        <img :src="selectedHotel.profilePicture" alt="Hotel Profile" class="profile-picture">
        <p class="description">{{ selectedHotel.description }}</p>

        <div class="section">
          <h3>Gallery</h3>
          <div class="gallery-grid">
            <img v-for="(image, index) in selectedHotel.images" 
                 :key="index" 
                 :src="image" 
                 :alt="`${selectedHotel.name} - Image ${index + 1}`"
            />
          </div>
        </div>

        <div class="section">
          <h3>Contact Information</h3>
          <p>📞 {{ selectedHotel.phone }}</p>
          <p>✉️ {{ selectedHotel.email }}</p>
          <p>🌐 {{ selectedHotel.website }}</p>
        </div>

        <div class="section">
          <h3>Amenities</h3>
          <ul class="amenities-list">
            <li v-for="amenity in selectedHotel.amenities" :key="amenity">
              ✓ {{ amenity }}
            </li>
          </ul>
        </div>

        <div class="section">
          <h3>Available Rooms</h3>
          <ul class="rooms-list">
            <li v-for="room in selectedHotel.rooms" :key="room.type">
              {{ room.type }} ({{ room.capacity }}) - ${{ room.price }} per night
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>{{ isEditing ? 'Edit Hotel' : 'Add New Hotel' }}</h2>
        <button @click="closeModal" class="modal-close-btn">&times;</button>
        <form @submit.prevent="saveHotel">
          <div class="form-group">
            <label>Profile Picture</label>
            <input type="file" @change="handleProfilePicture" accept="image/*">
            <img v-if="profilePreview" :src="profilePreview" alt="Profile Preview" class="image-preview">
          </div>
          <div class="form-group">
            <label>Hotel Name</label>
            <input v-model="currentHotel.name" required>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="currentHotel.description" required></textarea>
          </div>

          <div class="form-group">
            <label>Location</label>
            <input v-model="currentHotel.location" required>
          </div>

          <div class="form-group">
            <label>Contact Information</label>
            <input v-model="currentHotel.phone" placeholder="Phone">
            <input v-model="currentHotel.email" placeholder="Email">
            <input v-model="currentHotel.website" placeholder="Website">
          </div>

          <div class="form-group">
            <label>Gallery Images</label>
            <input type="file" @change="handleGalleryImages" accept="image/*" multiple>
            <div class="gallery-preview">
              <img v-for="(image, index) in galleryPreviews" :key="index" :src="image" alt="Gallery Preview" class="image-preview">
            </div>
          </div>

          <div class="form-group">
            <label>Amenities (comma-separated)</label>
            <input v-model="amenitiesList" placeholder="WiFi, Pool, etc.">
          </div>

          <div class="form-group">
            <label>Rooms</label>
            <div v-for="(room, index) in currentHotel.rooms" :key="index" class="room-input">
              <input v-model="room.type" placeholder="Room Type">
              <input v-model="room.capacity" placeholder="Capacity">
              <input v-model="room.price" type="number" placeholder="Price per night" step="0.01">
              <button type="button" @click="removeRoom(index)">Remove</button>
            </div>
            <button type="button" @click="addRoom">Add Room</button>
          </div>

          <div class="modal-buttons">
            <button type="button" @click="closeModal">Cancel</button>
            <button type="submit" :disabled="isLoading">
              <span v-if="isLoading" class="loading-spinner small"></span>
              <span v-else>{{ isEditing ? 'Update' : 'Add' }} Hotel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db, storage } from '../firebaseConfig.js'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const hotels = ref([])
const selectedHotel = ref(null)
const showModal = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)
const loadingHotel = ref(null)
const currentHotel = ref({
  name: '',
  description: '',
  location: '',
  phone: '',
  email: '',
  website: '',
  profilePicture: null,
  images: [],
  amenities: [],
  rooms: [],
  timestamp: null
})

const profilePreview = ref(null)
const galleryPreviews = ref([])
const amenitiesList = ref('')
const searchTerm = ref('')

onMounted(async () => {
  await fetchHotels()
})

const fetchHotels = async () => {
  try {
    isLoading.value = true
    const querySnapshot = await getDocs(collection(db, 'hotels'))
    hotels.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp || Date.now()
    }))
    hotels.value.sort((a, b) => a.timestamp - b.timestamp)
  } catch (error) {
    console.error('Error fetching hotels:', error)
  } finally {
    isLoading.value = false
  }
}

const uploadFile = async (file, path) => {
  const fileRef = storageRef(storage, path)
  await uploadBytes(fileRef, file)
  return getDownloadURL(fileRef)
}

const saveHotel = async () => {
  try {
    isLoading.value = true
    loadingHotel.value = currentHotel.value.id
    
    let profilePictureUrl = currentHotel.value.profilePicture
    if (currentHotel.value.profilePicture instanceof File) {
      profilePictureUrl = await uploadFile(currentHotel.value.profilePicture, `hotels/${currentHotel.value.name}/profile.jpg`)
    }

    const galleryUrls = await Promise.all(
      currentHotel.value.images.map((image, index) => {
        if (image instanceof File) {
          return uploadFile(image, `hotels/${currentHotel.value.name}/gallery${index}.jpg`)
        }
        return image
      })
    )

    const hotelData = {
      ...currentHotel.value,
      profilePicture: profilePictureUrl,
      images: galleryUrls,
      amenities: amenitiesList.value.split(',').map(amenity => amenity.trim()),
      timestamp: isEditing.value ? currentHotel.value.timestamp : Date.now()
    }

    if (isEditing.value) {
      await updateDoc(doc(db, 'hotels', currentHotel.value.id), hotelData)
    } else {
      await addDoc(collection(db, 'hotels'), hotelData)
    }

    await fetchHotels()
    closeModal()
  } catch (error) {
    console.error('Error saving hotel:', error)
  } finally {
    isLoading.value = false
    loadingHotel.value = null
  }
}

const deleteHotel = async (id) => {
  if (confirm('Are you sure you want to delete this hotel?')) {
    try {
      isLoading.value = true
      loadingHotel.value = id
      await deleteDoc(doc(db, 'hotels', id))
      await fetchHotels()
      if (selectedHotel.value?.id === id) {
        selectedHotel.value = null
      }
    } catch (error) {
      console.error('Error deleting hotel:', error)
    } finally {
      isLoading.value = false
      loadingHotel.value = null
    }
  }
}

const selectHotel = (hotel) => {
  selectedHotel.value = hotel
}

const closePanel = () => {
  selectedHotel.value = null
}

const openAddHotelModal = () => {
  isEditing.value = false
  resetForm()
  showModal.value = true
}

const editHotel = (hotel) => {
  isEditing.value = true
  currentHotel.value = { ...hotel }
  amenitiesList.value = hotel.amenities.join(', ')
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  currentHotel.value = {
    name: '',
    description: '',
    location: '',
    phone: '',
    email: '',
    website: '',
    profilePicture: null,
    images: [],
    amenities: [],
    rooms: [],
    timestamp: null
  }
  amenitiesList.value = ''
  profilePreview.value = null
  galleryPreviews.value = []
}

const addRoom = () => {
  currentHotel.value.rooms.push({ type: '', capacity: '', price: '' })
}

const removeRoom = (index) => {
  currentHotel.value.rooms.splice(index, 1)
}

const filteredHotels = computed(() => {
  return hotels.value.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const handleProfilePicture = (event) => {
  const file = event.target.files[0]
  if (file) {
    currentHotel.value.profilePicture = file
    const reader = new FileReader()
    reader.onload = (e) => {
      profilePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleGalleryImages = (event) => {
  const files = Array.from(event.target.files)
  currentHotel.value.images = files
  galleryPreviews.value = []
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      galleryPreviews.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}
</script>

<style scoped>
.hotel-management {
  display: flex;
  gap: 20px;
  height: 80vh;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.main-panel, .side-panel {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.main-panel {
  flex: 1;
  background: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.side-panel {
  width: 350px;
  background: white;
  transition: transform 0.3s ease-out;
  transform: translateX(100%);
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.side-panel.active {
  transform: translateX(0);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header {
  padding: 10px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h2 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.panel-content::-webkit-scrollbar {
  width: 8px;
}

.panel-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.panel-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-input {
  padding: 8px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  width: 200px;
  transition: box-shadow 0.3s;
}

.search-input:focus {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  outline: none;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th {
  background-color: #f5f5f5;
  text-align: left;
  padding: 12px;
  font-weight: normal;
  border-bottom: 1px solid #e0e0e0;
}

td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.edit-btn, .delete-btn, .add-btn {
  padding: 2px 8px;
  border: 1px solid #d0d0d0;
  border-radius: 3px;
  background-color: #fff;
  color: #555;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s, color 0.3s;
}

.edit-btn:hover, .add-btn:hover {
  background-color: #e8e8e8;
  color: #333;
}

.delete-btn {
  background-color: #ffebee;
  color: #d32f2f;
  border-color: #ffcdd2;
  transition: background-color 0.3s, color 0.3s;
}

.delete-btn:hover {
  background-color: #ffcdd2;
}

.add-btn {
  background-color: #f5f5f5;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
}

.add-hotel-container {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}

.hotel-list {
  flex: 1;
  overflow-y: auto;
}

.section {
  margin-bottom: 15px;
}

.section h3 {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: bold;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
}

.gallery-grid img {
  width: 100%;
  height: 60px;
  object-fit: cover;
}

.amenities-list, .rooms-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
}

.amenities-list li, .rooms-list li {
  margin-bottom: 3px;
}

.description {
  line-height: 1.6;
  color: #666;
}

.contact-info p {
  margin: 5px 0;
}

.profile-picture {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fafafa;
  padding: 30px;
  border-radius: 10px;
  width: 500px;
  max-height: 70vh;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  margin-top: 10vh;
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.modal h2 {
  margin-bottom: 20px;
  font-size: 24px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
  color: #333;
}

.modal-close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  background-color: #fff;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #b0b0b0;
  outline: none;
}

.room-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.room-input input {
  flex: 1;
}

.room-input input[type="number"] {
  width: 100px;
}

.room-input button {
  background-color: #ff0000;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.room-input button:hover {
  background-color: #cc0000;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.edit-btn, .delete-btn, .add-btn, .modal-buttons button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.modal-buttons button {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #d0d0d0;
}

.modal-buttons button[type="submit"] {
  background-color: #e0e0e0;
  color: #333;
}

.modal-buttons button:hover {
  opacity: 0.8;
}

tbody tr {
  transition: background-color 0.3s;
}

tbody tr:hover {
  background-color: #f8f8f8;
}

h3 {
  margin: 20px 0 10px;
  font-size: 1.2em;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 5px;
}

.image-preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-top: 10px;
  border-radius: 4px;
}

.gallery-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.gallery-preview .image-preview {
  width: 80px;
  height: 80px;
}

.loading-spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
}

.loading-spinner.small {
  width: 12px;
  height: 12px;
  border-width: 1px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>