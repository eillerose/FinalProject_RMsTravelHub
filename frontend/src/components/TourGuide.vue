<template>
  <div class="tour-guides-page">
    <HeaderComponent />
    <div class="banner">
      <h1>Our Tour Guides</h1>
      <p>Discover the Philippines with our expert local guides</p>
    </div>

    <main class="main-content">
      <div class="guides-header">
        <h2>Guides for you!</h2>
        <button @click="toggleShowAllGuides" class="toggle-button">
          {{ showAllGuides ? 'Show Less' : 'See All Guides' }}
        </button>
      </div>

      <div class="guides-container">
        <div v-if="loading" class="loading-message">
          <span class="loader"></span>
          Loading tour guides...
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-else class="guides-grid">
          <div v-for="guide in displayedGuides" :key="guide.id" class="guide-card">
            <div class="guide-image-container">
              <img :src="guide.profilePhoto" :alt="guide.firstName + ' ' + guide.lastName" class="guide-image">
            </div>
            <h3 class="guide-name">{{ guide.firstName }} {{ guide.lastName }}</h3>
            <button @click="openGuideModal(guide)" class="view-profile-button">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </main>

    <Teleport to="body">
      <div v-if="selectedGuide" class="modal-overlay" @click="closeGuideModal">
        <div class="modal-content" @click.stop>
          <button @click="closeGuideModal" class="close-button" aria-label="Close modal">×</button>
          <div class="modal-layout">
            <div class="modal-image-container">
              <img :src="selectedGuide.profilePhoto" :alt="selectedGuide.firstName + ' ' + selectedGuide.lastName" class="modal-guide-image">
            </div>
            <div class="modal-info">
              <h2 class="modal-name">{{ selectedGuide.firstName }} {{ selectedGuide.lastName }}</h2>
              <div class="info-item">
                <span class="material-icons">language</span>
                <span>Languages: {{ selectedGuide.languagesSpoken.join(", ") }}</span>
              </div>
              <div class="info-item">
                <span class="material-icons">star</span>
                <span>Experience: {{ calculateExperience(selectedGuide.startDate) }} years</span>
              </div>
              <div class="info-item">
                <span class="material-icons">local_offer</span>
                <span>Specialization: {{ selectedGuide.specialization }}</span>
              </div>
              <p class="guide-bio">{{ selectedGuide.bio }}</p>

            </div>
          </div>
        </div>
      </div>
    </Teleport>
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import HeaderComponent from './Header.vue';
import FooterComponent from './Footer.vue';

const tourGuides = ref([]);
const showAllGuides = ref(false);
const selectedGuide = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchTourGuides = async () => {
  try {
    const q = query(collection(db, 'staff'), where("role", "==", "guides"));
    const querySnapshot = await getDocs(q);
    tourGuides.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    loading.value = false;
  } catch (err) {
    error.value = 'Failed to load tour guides. Please try again later.';
    console.error('Error fetching tour guides:', err);
    loading.value = false;
  }
};

const displayedGuides = computed(() =>
  showAllGuides.value ? tourGuides.value : tourGuides.value.slice(0, 4)
);

const toggleShowAllGuides = () => {
  showAllGuides.value = !showAllGuides.value;
};

const openGuideModal = (guide) => {
  selectedGuide.value = guide;
};

const closeGuideModal = () => {
  selectedGuide.value = null;
};

const bookGuide = () => {
  // Implement booking logic here
  alert(`Booking ${selectedGuide.value.firstName} ${selectedGuide.value.lastName} as your guide!`);
};

const calculateExperience = (startDate) => {
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor((now - start) / (365.25 * 24 * 60 * 60 * 1000));
};

onMounted(fetchTourGuides);
</script>

<style scoped>
/* Styles remain unchanged */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.tour-guides-page {
  font-family: 'Poppins', sans-serif;
  color: #333;
  line-height: 1.6;
  background-color: #f5f5f5;
}

.banner {
  width: 100%;
  background-image: url('/src/img/heroBg.jpg');
  background-size: cover;
  background-position: center;
  text-align: center;
  color: #fff;
  padding: 4rem 20px;
  height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 2rem;
}

.banner h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.banner p {
  font-size: 1.25rem;
  margin-top: 0;
  margin-bottom: 1rem;
  color: white;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto 6rem;
  padding: 0 1rem;
}

.guides-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 3rem 0;
}

.guides-header h2 {
  font-size: 2.5rem;
  font-weight: 600;
}

.toggle-button {
  background-color: #98b634;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.3s, transform 0.2s;
}

.toggle-button:hover {
  background-color: #859e2d;
  transform: translateY(-2px);
}

.guides-container {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.guides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.guide-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
}

.guide-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.guide-image-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.guide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.guide-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #2c3e50;
}

.view-profile-button {
  width: 100%;
  max-width: 200px;
  padding: 0.75rem;
  background-color: #98b634;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.view-profile-button:hover {
  background-color: #859e2d;
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #f5f5f5;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  position: relative;
  padding: 2rem;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  z-index: 2;
}

.modal-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.modal-image-container {
  flex-shrink: 0;
}

.modal-guide-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.modal-info {
  flex-grow: 1;
}

.modal-name {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #666;
}

.info-item .material-icons {
  font-size: 1.25rem;
}

.guide-bio {
  margin-top: 1rem;
  color: #666;
}

.book-guide-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #98b634;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin-top: 1.5rem;
}

.book-guide-button:hover {
  background-color: #859e2d;
  transform: translateY(-2px);
}

.loading-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #666;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #98b634;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  color: #ff4d4f;
  font-size: 1.2rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .banner h1 {
    font-size: 2.5rem;
  }

  .guides-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .toggle-button {
    margin-top: 1rem;
  }

  .guides-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .guide-image-container {
    width: 100px;
    height: 100px;
  }

  .modal-layout {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .modal-name {
    font-size: 1.75rem;
  }

  .info-item {
    justify-content: center;
  }
}
</style>