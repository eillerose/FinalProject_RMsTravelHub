<template>
  <div class="tour-guides-page">
    <HeaderComponent/>
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
        <div v-if="loading" class="loading-message">Loading tour guides...</div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-else class="guides-grid">
          <div v-for="guide in displayedGuides" :key="guide.id" class="guide-card">
            <div class="guide-image-container">
              <img :src="guide.image" :alt="guide.name" class="guide-image">
            </div>
            <h3 class="guide-name">{{ guide.name }}</h3>
            <button @click="openGuideModal(guide)" class="view-profile-button">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </main>

    <div v-if="selectedGuide" class="modal-overlay" @click="closeGuideModal">
      <div class="modal-content" @click.stop>
        <button @click="closeGuideModal" class="close-button">×</button>
        <div class="modal-layout">
          <div class="modal-image-container">
            <img :src="selectedGuide.image" :alt="selectedGuide.name" class="modal-guide-image">
          </div>
          <div class="modal-info">
            <h2 class="modal-name">{{ selectedGuide.name }}</h2>
            <div class="info-item">
              <span class="material-icons">language</span>
              <span>Languages: {{ selectedGuide.languages.join(", ") }}</span>
            </div>
            <div class="info-item">
              <span class="material-icons">star</span>
              <span>Experience: {{ selectedGuide.experience }} years</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from './Header.vue';
import FooterComponent from './Footer.vue';
import { ref, computed, onMounted } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../firebaseConfig';

export default {
  components: {
    HeaderComponent,
    FooterComponent,
  },
  setup() {
    const db = getFirestore(firebaseApp);
    const tourGuides = ref([]);
    const showAllGuides = ref(false);
    const selectedGuide = ref(null);
    const loading = ref(true);
    const error = ref(null);

    // Fetch tour guides from Firestore
    const fetchTourGuides = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tourGuides'));
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

    // Fetch tour guides on component mount
    onMounted(fetchTourGuides);

    return {
      tourGuides,
      showAllGuides,
      displayedGuides,
      selectedGuide,
      toggleShowAllGuides,
      openGuideModal,
      closeGuideModal,
      loading,
      error,
    };
  },
};
</script>

  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
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
    padding: 0 20px;
    height: 25vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 2rem;
}

.banner h1 {
    font-size: 4rem;
    margin-bottom: 1rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.banner p {
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 1rem;
    color: white;
}
  
  .main-content {
    max-width: 1500px;
    margin: auto;
    margin-bottom: 6rem;

  }
  
  .guides-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    margin-top: 2rem;
  }
  
  .guides-header h2 {
    font-size: 3rem;
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
    transition: background-color 0.3s;
  }
  
  .toggle-button:hover {
    background-color: #859e2d;
  }
  
  .guides-container {
    margin: 0 auto;
    max-width: 1500px;
    background-color: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: -2rem;
  }
  
  .guides-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 4rem;
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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
    transition: background-color 0.3s;
  }
  
  .view-profile-button:hover {
    background-color: #859e2d;
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
  padding: 1.5rem;
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
  transition: background-color 0.3s;
  margin-top: 1.5rem;
}

.book-guide-button:hover {
  background-color: #859e2d;
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
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
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