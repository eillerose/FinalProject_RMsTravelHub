<template>
    <div class="activity-manager">
      <div class="content-wrapper">
        <h1 class="title">Activity Manager</h1>
        
        <div class="add-activity-toggle" v-if="!isAddFormVisible">
          <button @click="toggleAddForm" class="toggle-button">
            <PlusIcon class="icon" size="18" />
            Add Activity
          </button>
        </div>
  
        <transition name="slide-fade">
          <div v-if="isAddFormVisible" class="add-activity-section">
            <div class="section-header">
              <h2 class="section-title">{{ editingActivity ? 'Edit Activity' : 'Add New Activity' }}</h2>
            </div>
            <div class="form-grid">
              <div class="form-row">
                <div class="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    v-model="newActivity.name"
                    placeholder="Activity name"
                  >
                </div>
                <div class="form-group">
                  <label>Price (₱)</label>
                  <input 
                    type="number" 
                    v-model="newActivity.price"
                    placeholder="Optional"
                  >
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Image</label>
                  <input 
                    type="file" 
                    @change="handleImageUpload" 
                    accept="image/*"
                  >
                </div>
                <div class="form-group">
                  <label>Category</label>
                  <select v-model="newActivity.category">
                    <option value="" disabled selected>Select category</option>
                    <option v-for="category in categories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="form-group full-width">
                <label>Description</label>
                <textarea 
                  v-model="newActivity.description"
                  placeholder="Optional: Describe the activity"
                  rows="3"
                ></textarea>
              </div>
              <div class="form-actions">
                <button class="add-button" @click="saveActivity" :disabled="isLoading">
                  {{ isLoading ? 'Saving...' : (editingActivity ? 'Update Activity' : 'Add Activity') }}
                </button>
                <button @click="cancelEdit" class="cancel-button" v-if="editingActivity">
                  Cancel
                </button>
                <button @click="toggleAddForm" class="hide-form-button" aria-label="Hide form">
                  <XIcon class="icon" size="18" />
                </button>
              </div>
            </div>
          </div>
        </transition>
  
        <div class="activities-section">
          <div class="section-header">
            <h2 class="section-title">Activities</h2>
            <div class="filter-section">
              <label>Filter by Category:</label>
              <select v-model="selectedFilter">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
          </div>
  
          <div v-if="isLoading" class="loading">Loading activities...</div>
          <div v-else class="activities-grid">
            <div 
              v-for="activity in filteredActivities" 
              :key="activity.id" 
              class="activity-card"
              @click="editActivity(activity)"
            >
              <button @click.stop="deleteActivity(activity.id)" class="delete-button" aria-label="Delete activity">
                <Trash2 class="icon" size="18" />
              </button>
              <div class="activity-content">
                <div class="activity-image" v-if="activity.imageUrl">
                  <img :src="activity.imageUrl" :alt="activity.name">
                </div>
                <div class="activity-info">
                  <h3>{{ activity.name }}</h3>
                  <p v-if="activity.price" class="price">₱{{ activity.price }}</p>
                  <p v-if="activity.description" class="description">{{ activity.description }}</p>
                </div>
              </div>
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
  import { Trash2, PlusIcon, XIcon } from 'lucide-vue-next'
  
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
  .activity-manager {
    width: 97%;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  .content-wrapper {
    width: 98%;
    min-height: 100vh;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }
  
  .title {
    font-size: 28px;
    color: #333;
    margin-bottom: 30px;
    text-align: center;
  }
  
  .section-title {
    font-size: 20px;
    color: #444;
    margin-bottom: 20px;
  }
  
  .add-activity-toggle {
    margin-bottom: 20px;
    text-align: right;
  }
  
  .toggle-button {
    display: inline-flex;
    align-items: center;
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .toggle-button:hover {
    background-color: #45a049;
  }
  
  .toggle-button .icon {
    margin-right: 8px;
  }
  
  .add-activity-section {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
    position: relative;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .form-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .form-row {
    display: flex;
    gap: 20px;
  }
  
  .form-row .form-group {
    flex: 1;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .form-group.full-width {
    width: 100%;
  }
  
  label {
    margin-bottom: 5px;
    font-size: 14px;
    color: #555;
  }
  
  input, select, textarea {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  
  textarea {
    resize: vertical;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
  }
  
  .add-button, .cancel-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .add-button:hover:not(:disabled), .cancel-button:hover {
    background-color: #45a049;
  }
  
  .add-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .cancel-button {
    background-color: #f44336;
  }
  
  .cancel-button:hover {
    background-color: #d32f2f;
  }
  
  .hide-form-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    color: #666;
    transition: color 0.3s, background-color 0.3s;
    border-radius: 50%;
  }
  
  .hide-form-button:hover {
    color: #333;
    background-color: #e0e0e0;
  }
  
  .activities-section {
    background-color: #fff;
  }
  
  .filter-section {
    display: flex;
    align-items: center;
  }
  
  .filter-section label {
    margin-right: 10px;
  }
  
  .filter-section select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .loading {
    text-align: center;
    padding: 20px;
    font-size: 18px;
    color: #666;
  }
  
  .activities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .activity-card {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    transition: box-shadow 0.3s;
    padding: 15px;
    cursor: pointer;
  }
  
  .activity-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .activity-content {
    display: flex;
    align-items: flex-start;
  }
  
  .activity-image {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 15px;
    flex-shrink: 0;
  }
  
  .activity-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .activity-info {
    flex: 1;
  }
  
  .activity-info h3 {
    font-size: 18px;
    color: #333;
    margin-top: -1px;
    margin-bottom: -5px;
  }
  
  .activity-card .price {
    font-weight: bold;
    color: #4CAF50;
    margin-top: -15px;
    margin-bottom: -12px;
  }
  
  .activity-card .description {
    font-size: 12px;
    color: #555;
    margin-bottom: -3px;
  }
  
  .delete-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    color: #dc3545;
    transition: color 0.3s ease;
    z-index: 1;
  }
  
  .delete-button:hover {
    color: #c82333;
  }
  
  .delete-button .icon {
    display: block;
  }
  
  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }
  
  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }
  
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateY(-20px);
    opacity: 0;
  }
  
  @media (max-width: 768px) {
    .form-grid {
      flex-direction: column;
    }
  
    .form-row {
      flex-direction: column;
    }
  
    .form-row .form-group {
      flex: 1;
    }
  
    .section-header {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .filter-section {
      margin-top: 10px;
    }
  
    .activities-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>