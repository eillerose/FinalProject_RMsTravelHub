<template>
  <div class="page-container">
    <HeaderComponent />

    <div class="hero">
      <h1>Our Featured Hotels</h1>
      <p>Explore a curated selection of luxurious, comfortable, and affordable accommodations, offering everything you need for an unforgettable stay in Puerto Galera.</p>
    </div>

    <main class="main-content">
      <h2>Choose your hotel</h2>
      
      <div v-if="loading" class="loading">
        <p>Loading hotels...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div v-else class="content-wrapper" :class="{ 'show-details': selectedHotel }">
        <div class="hotels-container">
          <transition-group name="hotel-list" tag="div" class="hotels-grid">
            <div v-for="hotel in sortedHotels" :key="hotel.id" class="hotel-card">
              <img :src="hotel.profilePicture" :alt="hotel.name" class="hotel-image" />
              <div class="hotel-info">
                <h3>{{ hotel.name }}</h3>
                <div class="location">
                  <span class="material-icons">location_on</span>
                  <span>{{ hotel.location }}</span>
                </div>
                <button @click="toggleDetails(hotel)" class="details-button">
                  View Details
                </button>
              </div>
            </div>
          </transition-group>
        </div>

        <transition name="slide-in">
          <div v-if="selectedHotel" class="details-panel">
            <button @click="closeDetails" class="close-button">
              <span class="material-icons">close</span>
            </button>
            <div class="details-content">
              <h3>{{ selectedHotel.name }}</h3>
              <p class="description">{{ selectedHotel.description }}</p>
              <p class="full-description">{{ selectedHotel.fullDescription }}</p>
              
              <div class="gallery">
                <h4>Gallery</h4>
                <div class="gallery-grid">
                  <img v-for="(image, index) in selectedHotel.images" 
                       :key="index" 
                       :src="image" 
                       :alt="`${selectedHotel.name} - Image ${index + 1}`" />
                </div>
              </div>

              <div class="info-section">
                <h4>Contact Information</h4>
                <p><span class="material-icons">phone</span>{{ selectedHotel.phone }}</p>
                <p><span class="material-icons">email</span>{{ selectedHotel.email }}</p>
                <p><span class="material-icons">language</span>{{ selectedHotel.website }}</p>
              </div>

              <div class="info-section">
                <h4>Location</h4>
                <p><span class="material-icons">place</span>{{ selectedHotel.location }}</p>
              </div>

              <div class="info-section">
                <h4>Amenities</h4>
                <ul class="amenities-list">
                  <li v-for="amenity in selectedHotel.amenities" :key="amenity">
                    <span class="material-icons">check</span>
                    {{ amenity }}
                  </li>
                </ul>
              </div>

              <div class="info-section">
                <h4 class="rooms-title">Available Rooms</h4>
                <div class="rooms-list">
                  <div v-for="room in selectedHotel.rooms" :key="room.name">
                    {{ room.type }} ({{ room.capacity }})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { db } from '../firebaseConfig';
import HeaderComponent from './Header.vue';
import FooterComponent from './Footer.vue';

const hotels = ref([]);
const selectedHotel = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchHotels = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'hotels'));
    hotels.value = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        profilePicture: await getImageUrl(data.profilePicture),
        images: await Promise.all(data.images.map(getImageUrl))
      };
    }));
    loading.value = false;
  } catch (err) {
    console.error('Error fetching hotels:', err);
    error.value = 'Failed to load hotels. Please try again later.';
    loading.value = false;
  }
};

const getImageUrl = async (path) => {
  if (!path) return '';
  try {
    const storage = getStorage();
    const imageRef = storageRef(storage, path);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error("Error getting image URL:", error);
    return '';
  }
};

const sortedHotels = computed(() => {
  if (!selectedHotel.value) return hotels.value;
  return [
    selectedHotel.value,
    ...hotels.value.filter(hotel => hotel.id !== selectedHotel.value.id)
  ];
});

const toggleDetails = (hotel) => {
  selectedHotel.value = selectedHotel.value?.id === hotel.id ? null : hotel;
};

const closeDetails = () => {
  selectedHotel.value = null;
};

onMounted(fetchHotels);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.page-container {
  font-family: 'Poppins', sans-serif;
  background-color: #f8f9fa;

}

.hero {
  margin-top: 2rem;
  background-color: #013240;
  color: white;
  text-align: center;
  padding: 3rem 2rem;

}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.main-content {
  max-width: 1800px;
  height: 1500px;
  margin: 0 auto;
  padding: 2rem;
  
}

.main-content h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #1a1a1a;
}

.content-wrapper {
  display: flex;
  gap: 2rem;
  transition: all 0.3s ease;
}

.hotels-container {
  flex: 1;
}

.hotels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.hotel-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.hotel-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.hotel-info {
  padding: 1.5rem;
  position: relative;
}

.hotel-info h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.hotel-info p {
  color: #4a4a4a;
  margin-bottom: 1rem;
}

.location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6e6e6e;
  font-size: 0.9rem;
}

.location .material-icons {
  font-size: 1.2rem;
  color: #1a1a1a;
}

.details-button {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1a1a1a;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.details-button:hover {
  background: #333;
  transform: scale(1.1);
}

.details-panel {
  width: 1800px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #1a1a1a;
  z-index: 10;
}

.details-content {
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
}

.details-content h3 {
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.description {
  color: #4a4a4a;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.gallery-grid img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.info-section {
  margin-top: 2rem;
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
}

.info-section h4 {
  color: #1a1a1a;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.info-section p, .info-section li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #4a4a4a;
}

.info-section ul {
  list-style: none;
  padding: 0;
}

.info-section .material-icons {
  color: #1a1a1a;
}

/* Transitions */
.hotel-list-move {
  transition: transform 0.5s ease;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease;
}

.slide-in-enter-from,
.slide-in-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }

  .hotels-grid {
    grid-template-columns: 1fr;
  }

  .details-panel {
    width: 100%;
  }
}
</style>