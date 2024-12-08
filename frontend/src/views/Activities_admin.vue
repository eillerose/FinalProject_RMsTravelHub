<template>
  <h1 class="section-title">Activity Manager</h1>
  <div class="activity-manager">

    <transition name="fade">
      <div v-if="isAddFormVisible" class="form-card">
        <div class="form-header">
          <h2>{{ editingActivity ? 'Edit Activity' : 'New Activity' }}</h2>
          <button @click="toggleAddForm" class="close-button">
            <XIcon />
          </button>
        </div>
        
        <div class="form-content">
          <div class="form-grid">
            <div class="input-group">
              <label>Activity Name</label>
              <input 
                type="text" 
                v-model="newActivity.name"
                placeholder="Enter activity name"
              >
            </div>
            
            <div class="input-group">
              <label>Price (₱)</label>
              <input 
                type="number" 
                v-model="newActivity.price"
                placeholder="Optional"
              >
            </div>

            <div class="input-group">
              <label>Category</label>
              <select v-model="newActivity.category">
                <option value="" disabled selected>Select category</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <div class="input-group">
              <label>Image</label>
              <div class="file-input">
                <input 
                  type="file" 
                  @change="handleImageUpload" 
                  accept="image/*"
                  id="file-upload"
                >
                <label for="file-upload" class="file-label">
                  <UploadCloudIcon class="icon" />
                  Choose File
                </label>
              </div>
            </div>
          </div>

          <div class="input-group full-width">
            <label>Description</label>
            <textarea 
              v-model="newActivity.description"
              placeholder="Optional: Describe the activity"
              rows="3"
            ></textarea>
          </div>

          <div class="form-actions">
            <button class="secondary" @click="cancelEdit" v-if="editingActivity">
              Cancel
            </button>
            <button class="primary" @click="saveActivity" :disabled="isLoading">
              {{ isLoading ? 'Saving...' : (editingActivity ? 'Update' : 'Create') }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div class="activities-section">
      <div class="section-header">
        <div class="filter-group">
          <label>Filter by:</label>
          <select v-model="selectedFilter" class="filter-select">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <button v-if="!isAddFormVisible" @click="toggleAddForm" class="create-new">
            <PlusIcon class="icon" />
            Create New
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="loading">
        <LoaderIcon class="spin" />
        Loading activities...
      </div>
      
      <div v-else class="activities-grid">
        <div 
          v-for="activity in filteredActivities" 
          :key="activity.id" 
          class="activity-card"
          @click="editActivity(activity)"
        >
          <div class="activity-image" v-if="activity.imageUrl">
            <img :src="activity.imageUrl" :alt="activity.name">
          </div>
          <div class="activity-content">
            <div class="activity-header">
              <h3>{{ activity.name }}</h3>
              <button @click.stop="deleteActivity(activity.id)" class="delete-button">
                <Trash2Icon />
              </button>
            </div>
            <div class="activity-details">
              <span class="category">{{ activity.category }}</span>
              <span v-if="activity.price" class="price">₱{{ activity.price }}</span>
            </div>
            <p v-if="activity.description" class="description">{{ activity.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db, storage } from '../firebaseConfig'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { 
  Trash2Icon, 
  PlusIcon, 
  XIcon, 
  UploadCloudIcon,
  LoaderIcon 
} from 'lucide-vue-next'

const categories = ['Water Sport', 'Extreme Sport', 'Inland Tour', 'Travel & Tour', 'Beach Hopping', 'Snorkling']

const activities = ref([])
const isLoading = ref(false)
const isAddFormVisible = ref(false)
const editingActivity = ref(null)

const newActivity = ref({
  name: '',
  price: null,
  category: '',
  description: '',
  imageUrl: null
})

const selectedFilter = ref('')

const toggleAddForm = () => {
  isAddFormVisible.value = !isAddFormVisible.value
  if (!isAddFormVisible.value) {
    resetForm()
  }
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    const imageRef = storageRef(storage, `activity-images/${Date.now()}-${file.name}`)
    await uploadBytes(imageRef, file)
    const downloadURL = await getDownloadURL(imageRef)
    newActivity.value.imageUrl = downloadURL
  }
}

const saveActivity = async () => {
  if (newActivity.value.name && newActivity.value.category) {
    isLoading.value = true
    try {
      if (editingActivity.value) {
        await updateDoc(doc(db, 'activities', editingActivity.value.id), {
          name: newActivity.value.name,
          price: newActivity.value.price ? Number(newActivity.value.price) : null,
          category: newActivity.value.category,
          description: newActivity.value.description || null,
          imageUrl: newActivity.value.imageUrl
        })
        console.log('Document updated')
      } else {
        const docRef = await addDoc(collection(db, 'activities'), {
          name: newActivity.value.name,
          price: newActivity.value.price ? Number(newActivity.value.price) : null,
          category: newActivity.value.category,
          description: newActivity.value.description || null,
          imageUrl: newActivity.value.imageUrl
        })
        console.log('Document written with ID: ', docRef.id)
      }
      await fetchActivities()
      resetForm()
      isAddFormVisible.value = false
    } catch (error) {
      console.error('Error saving document: ', error)
    } finally {
      isLoading.value = false
    }
  }
}

const resetForm = () => {
  newActivity.value = {
    name: '',
    price: null,
    category: '',
    description: '',
    imageUrl: null
  }
  editingActivity.value = null
}

const fetchActivities = async () => {
  isLoading.value = true
  try {
    const querySnapshot = await getDocs(collection(db, 'activities'))
    activities.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching activities: ', error)
  } finally {
    isLoading.value = false
  }
}

const deleteActivity = async (id) => {
  isLoading.value = true
  try {
    await deleteDoc(doc(db, 'activities', id))
    console.log('Document successfully deleted!')
    await fetchActivities()
  } catch (error) {
    console.error('Error removing document: ', error)
  } finally {
    isLoading.value = false
  }
}

const editActivity = (activity) => {
  editingActivity.value = activity
  newActivity.value = { ...activity }
  isAddFormVisible.value = true
}

const cancelEdit = () => {
  resetForm()
  isAddFormVisible.value = false
}

const filteredActivities = computed(() => {
  if (!selectedFilter.value) return activities.value
  return activities.value.filter(activity => activity.category === selectedFilter.value)
})

onMounted(() => {
  fetchActivities()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

/* Base Styles */
.activity-manager {
  font-family: 'Poppins', sans-serif;
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem;
  color: #1a1a1a;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

/* Buttons */
.create-new {
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #00bcd4;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 1rem;
  margin-left: 64.3rem;
}

.create-new:hover {
  background-color: #00acc1;
}

/* Form Styles */
.form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-content {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.input-group input,
.input-group select,
.input-group textarea {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.input-group input:focus,
.input-group select:focus,
.input-group textarea:focus {
  outline: none;
  border-color: #00bcd4;
  box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
}

.file-input {
  position: relative;
  overflow: hidden;
}

.file-input input[type="file"] {
  position: absolute;
  left: -9999px;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-label:hover {
  background-color: #e5e7eb;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.form-actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.form-actions .primary {
  background-color: #00bcd4;
  color: white;
}

.form-actions .primary:hover {
  background-color: #00acc1;
}

.form-actions .secondary {
  background-color: #e5e7eb;
  color: #4b5563;
}

.form-actions .secondary:hover {
  background-color: #d1d5db;
}

/* Activities Grid */
.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.activity-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.activity-image {
  height: 200px;
  overflow: hidden;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-content {
  padding: 1.5rem;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.activity-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.activity-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.category {
  background: #e5e7eb;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  color: #4b5563;
}

.price {
  color: #00bcd4;
  font-weight: 600;
}

.description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.delete-button {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s;
}

.delete-button:hover {
  color: #ef4444;
}

/* Filter Styles */
.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  font-family: inherit;
  font-size: 0.875rem;
  color: #4b5563;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Loading State */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  color: #6b7280;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

