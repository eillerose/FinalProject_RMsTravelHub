<template>
  <div class="activities-page">
    <HeaderComponent />
    <div class="container">
      <h1 class="title">RM's Travel and Tour Activities</h1>
      <div class="categories">
        <button 
          v-for="category in categories" 
          :key="category" 
          @click="setActiveCategory(category)"
          :class="['category-button', { active: activeCategory === category }]"
        >
          {{ category }}
        </button>
      </div>
      <div class="activities">
        <div v-if="isLoading" class="loading">Loading activities...</div>
        <div v-else class="activity-cards">
          <div 
            v-for="activity in displayedActivities" 
            :key="activity.id" 
            class="activity-card"
          >
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
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import HeaderComponent from './Header.vue'
import FooterComponent from './Footer.vue'

const categories = [
  'All', 'Water Sport', 'Extreme Sport', 'Inland Tour', 'Travel and Tour', 'Beach Hopping', 'Snorkeling'
]
const activeCategory = ref('All')
const activities = ref([])
const isLoading = ref(true)

const fetchActivities = async () => {
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

const displayedActivities = computed(() => {
  if (activeCategory.value === 'All') {
    return activities.value
  }
  return activities.value.filter(activity => activity.category === activeCategory.value)
})

const setActiveCategory = (category) => {
  activeCategory.value = category
}

onMounted(() => {
  fetchActivities()
})
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

  .activities-page {
    font-family: 'Poppins', sans-serif;
    text-align: center;
    padding: 20px;
    background-color: #f4f4f4;
  }

  .container {
    max-width: 1500px;
    margin: 0 auto;
  }

  .title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-top: 7rem;
    margin-bottom: 30px;
    color: #333;

  }

  .subtitle {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 20px;
    color: #444;
  }

  .categories {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .category-button {
    font-family: 'Poppins', sans-serif;
    background-color: #f0f0f0;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }

  .category-button:hover {
    background-color: #d0d0d0;
  }

  .category-button.active {
    background-color: #0a8d88;
    color: white;
  }

  .activities {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;;
  }

  .loading {
    font-size: 1.2rem;
    color: #666;
    margin-top: 20px;
  }

  .activity-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: flex-start;
  }

  .activity-card {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.3s;
    width: calc(33.333% - 14px);
    min-width: 250px;
  }

  .activity-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .activity-content {
    display: flex;
    padding: 15px;

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

  .activity-info {
    flex: 1;
    text-align: left;
    margin-left: 2rem;
  }

  .activity-info h3 {
    margin: 0 0 5px 0;
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: -5px;
  }

  .activity-card .price {
    font-weight: bold;
    color: #4CAF50;
    margin-bottom: -12px;
  }

  .activity-card .description {
    font-size: 14px;
    color: #555;
    margin-bottom: -3px;
  }

  @media (max-width: 1024px) {
    .activity-card {
      width: calc(50% - 10px);
    }
  }

  @media (max-width: 768px) {
    .activity-card {
      width: 100%;
    }
  }
</style>