<template>
  <h1 class="section-title">Hotel Management</h1>
  <div class="hotel-management">

      <div class="header">
        <div class="search-container">
          <input v-model="searchTerm" type="text" placeholder="Search hotels..." class="search-input">
          <SearchIcon class="search-icon" />
        </div>
        <button @click="openAddHotelModal" class="add-btn" :disabled="isLoading">
          <PlusIcon v-if="!isLoading" />
          <LoaderIcon v-else class="spin" />
          Add New Hotel
        </button>
      </div>

      <div class="hotel-list" v-if="!isLoading">
        <div v-for="(hotel, index) in filteredHotels" :key="hotel.id" class="hotel-card" @click="selectHotel(hotel)">
          <img :src="hotel.profilePicture" :alt="hotel.name" class="hotel-image">
          <div class="hotel-info">
            <h3>{{ hotel.name }}</h3>
            <p>{{ hotel.location }}</p>
            <p>{{ hotel.phone }}</p>
          </div>
          <div class="hotel-actions">
            <button class="edit-btn" @click.stop="editHotel(hotel)">
              <EditIcon />
            </button>
            <button class="delete-btn" @click.stop="deleteHotel(hotel.id)">
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="loading">
        <LoaderIcon class="spin" />
        <p>Loading hotels...</p>
      </div>
   

    <!-- Side Panel -->
    <transition name="slide">
      <div v-if="selectedHotel" class="side-panel">
        <div class="panel-header">
          <h2>{{ selectedHotel.name }}</h2>
          <button class="close-btn" @click="closePanel">
            <XIcon />
          </button>
        </div>

        <div class="panel-content">
          <img :src="selectedHotel.profilePicture" :alt="selectedHotel.name" class="profile-picture">
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
            <p><PhoneIcon /> {{ selectedHotel.phone }}</p>
            <p><MailIcon /> {{ selectedHotel.email }}</p>
            <p><GlobeIcon /> {{ selectedHotel.website }}</p>
          </div>

          <div class="section">
            <h3>Amenities</h3>
            <ul class="amenities-list">
              <li v-for="amenity in selectedHotel.amenities" :key="amenity">
                <CheckIcon /> {{ amenity }}
              </li>
            </ul>
          </div>

          <div class="section">
            <h3>Available Rooms</h3>
            <ul class="rooms-list">
              <li v-for="room in selectedHotel.rooms" :key="room.type">
                <BedDoubleIcon /> {{ room.type }} ({{ room.capacity }}) - ${{ room.price }} per night
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>

    <!-- Add/Edit Modal -->
    <transition name="fade">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>{{ isEditing ? 'Edit Hotel' : 'Add New Hotel' }}</h2>
          <button @click="closeModal" class="modal-close-btn">
            <XIcon />
          </button>
          <form @submit.prevent="saveHotel">
            <div class="form-group">
              <label>Profile Picture</label>
              <div class="file-input">
                <input type="file" @change="handleProfilePicture" accept="image/*" id="profile-picture">
                <label for="profile-picture">
                  <UploadCloudIcon />
                  Choose File
                </label>
              </div>
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
              <div class="file-input">
                <input type="file" @change="handleGalleryImages" accept="image/*" multiple id="gallery-images">
                <label for="gallery-images">
                  <UploadCloudIcon />
                  Choose Files
                </label>
              </div>
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
                <button type="button" @click="removeRoom(index)" class="remove-room-btn">
                  <MinusIcon />
                </button>
              </div>
              <button type="button" @click="addRoom" class="add-room-btn">
                <PlusIcon />
                Add Room
              </button>
            </div>
            <div class="modal-buttons">
              <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
              <button type="submit" :disabled="isLoading" class="save-btn">
                <LoaderIcon v-if="isLoading" class="spin" />
                <span v-else>{{ isEditing ? 'Update' : 'Add' }} Hotel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db, storage } from '../firebaseConfig.js'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { 
  SearchIcon, 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  XIcon, 
  PhoneIcon, 
  MailIcon, 
  GlobeIcon, 
  CheckIcon, 
  BedDoubleIcon, 
  UploadCloudIcon,
  MinusIcon,
  LoaderIcon
} from 'lucide-vue-next'

const hotels = ref([])
const selectedHotel = ref(null)
const showModal = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)
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
    hotels.value.sort((a, b) => b.timestamp - a.timestamp)
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
  }
}

const deleteHotel = async (id) => {
  if (confirm('Are you sure you want to delete this hotel?')) {
    try {
      isLoading.value = true
      await deleteDoc(doc(db, 'hotels', id))
      await fetchHotels()
      if (selectedHotel.value?.id === id) {
        selectedHotel.value = null
      }
    } catch (error) {
      console.error('Error deleting hotel:', error)
    } finally {
      isLoading.value = false
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.hotel-management {
  font-family: 'Poppins', sans-serif;
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem;
  color: #333;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
}

.main-panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.search-container {
  position: relative;
  flex-grow: 1;
  margin-right: 1rem;
}

.search-input {
  font-family: 'Poppins', sans-serif;
  width: 95%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.add-btn {
  font-family: 'Poppins', sans-serif;
  display: flex;
  font-size: 1rem;
  align-items: center;
  gap: 0.5rem;
  background-color: #0a8d88;
  color: white;
  border: none;
  padding: 0.75rem 1rem 0.75rem ;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background-color: #2980b9;
}

.hotel-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.hotel-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.hotel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hotel-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.hotel-info {
  padding: 1rem;
}

.hotel-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.hotel-info p {
  color: #718096;
  margin-bottom: 0.25rem;
}

.hotel-actions {
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem;
}

.edit-btn,
.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.edit-btn:hover {
  color: #3498db;
}

.delete-btn:hover {
  color: #e74c3c;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #a0aec0;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.side-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.panel-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #718096;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #e74c3c;
}

.panel-content {
  padding: 1.5rem;
}

.profile-picture {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.description {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.section {
  margin-bottom: 1.5rem;
}

.section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #2d3748;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.gallery-grid img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.amenities-list,
.rooms-list {
  list-style-type: none;
  padding: 0;
}

.amenities-list li,
.rooms-list li {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.amenities-list li svg,
.rooms-list li svg {
  margin-right: 0.5rem;
  color: #3498db;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  transition: color 0.2s;
}

.modal-close-btn:hover {
  color: #e74c3c;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3498db;
}

.file-input {
  position: relative;
  overflow: hidden;
}

.file-input input[type="file"] {
  position: absolute;
  left: -9999px;
}

.file-input label {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-input label:hover {
  background-color: #2980b9;
}

.image-preview {
  max-width: 100%;
  height: auto;
  margin-top: 1rem;
  border-radius: 4px;
}

.gallery-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.gallery-preview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.room-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.room-input input {
  flex: 1;
}

.remove-room-btn,
.add-room-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-room-btn {
  background-color: #e74c3c;
  color: white;
}

.remove-room-btn:hover {
  background-color: #c0392b;
}

.add-room-btn {
  background-color: #2ecc71;
  color: white;
}

.add-room-btn:hover {
  background-color: #27ae60;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn,
.save-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn {
  background-color: #e2e8f0;
  color: #4a5568;
}

.cancel-btn:hover {
  background-color: #cbd5e0;
}

.save-btn {
  background-color: #3498db;
  color: white;
}

.save-btn:hover {
  background-color: #2980b9;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>