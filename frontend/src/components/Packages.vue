<template>
  <div class="packages-page">
    <HeaderComponent />
    <div class="banner">
      <div class="banner-content">
        <h1>Travel Packages</h1>
        <p>Explore our exclusive travel packages for an unforgettable adventure. Your journey to paradise starts here!</p>
      </div>
    </div>
    <div class="packages-container">
      <h2>Our Travel Packages</h2>
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading packages...</p>
      </div>
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>
      <div v-else class="packages-grid">
        <div v-for="pkg in packages" :key="pkg.id" class="package-card">
          <img :src="pkg.imageUrl" :alt="pkg.name" class="package-image" />
          <div class="package-content">
            <h3>{{ pkg.name }}</h3>
            <p>{{ pkg.description }}</p>
            <button class="view-btn" @click="openModal(pkg)">View Details</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Package Details Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">×</button>
        <div class="modal-grid">
          <div class="modal-image-side" :style="{ backgroundImage: `url(${selectedPackage.imageUrl})` }">
            <div class="package-title-overlay">
              <h2>{{ selectedPackage.name }}</h2>
            </div>
          </div>
          <div class="modal-details">
            <div class="scrollable-content">
              <div v-for="(components, type) in groupedComponents" :key="type" class="detail-section">
                <h3>{{ type }}</h3>
                <ul>
                  <li v-for="component in components" :key="component.id">
                    {{ component.name }}
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="selectedPackage.includePackageOptions" class="package-options">
              <h3>Package Options</h3>
              <div class="options-grid">
                <button 
                  v-for="option in selectedPackage.selectedOptions" 
                  :key="option.id"
                  class="option-btn"
                  @click="openOptionsModal(option)"
                >
                  {{ option.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Package Options Modal -->
    <div v-if="showOptionsModal" class="modal-overlay" @click.self="closeOptionsModal">
      <div class="modal-content options-modal">
        <button class="close-btn" @click="closeOptionsModal">×</button>
        <div class="modal-details">
          <h2 class="options-title">{{ selectedOption.name }}</h2>
          <div class="pricing-grid">
            <div v-for="(price, index) in selectedOption.pricing" :key="index" class="pricing-card">
              <div class="pax-info">
                <h3>{{ price.pax }} PAX</h3>
              </div>
              <div class="price-info">
                <p class="price">₱{{ price.price.toLocaleString() }}</p>
                <p class="per-person">per person</p>
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
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import HeaderComponent from './Header.vue';
import FooterComponent from './Footer.vue';

const packages = ref([]);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const showOptionsModal = ref(false);
const selectedPackage = ref(null);
const selectedOption = ref(null);

const groupedComponents = computed(() => {
  if (!selectedPackage.value?.components) return {};
  return selectedPackage.value.components.reduce((acc, comp) => {
    if (!acc[comp.type]) acc[comp.type] = [];
    acc[comp.type].push(comp);
    return acc;
  }, {});
});

const fetchPackages = async () => {
  try {
    const packagesCollection = collection(db, 'packages');
    const packagesSnapshot = await getDocs(packagesCollection);
    packages.value = packagesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        components: data.components || [],
        selectedOptions: data.selectedOptions || []
      };
    });
    loading.value = false;
  } catch (err) {
    console.error("Error fetching packages:", err);
    error.value = "Failed to load packages. Please try again later.";
    loading.value = false;
  }
};

const openModal = (pkg) => {
  selectedPackage.value = pkg;
  showModal.value = true;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  showModal.value = false;
  selectedPackage.value = null;
  document.body.style.overflow = 'auto';
};

const openOptionsModal = (option) => {
  selectedOption.value = option;
  showOptionsModal.value = true;
};

const closeOptionsModal = () => {
  showOptionsModal.value = false;
  selectedOption.value = null;
};

onMounted(fetchPackages);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.packages-page {
  font-family: 'Poppins', sans-serif;
  background-color: #ffffff;
}

.banner {
  position: relative;
  height: 400px;
  background-image: url('/src/img/heroBg.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 0 20px;
}

.banner h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.banner p {
  font-size: 18px;
  line-height: 1.6;
}

.packages-container {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
}

.packages-container h2 {
  text-align: center;
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 40px;
  color: #333;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.package-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.package-card:hover {
  transform: translateY(-5px);
}

.package-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.package-content {
  padding: 20px;
}

.package-content h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.package-content p {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.view-btn {
  width: 100%;
  padding: 12px;
  background-color: #2ec4b6;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-btn:hover {
  background-color: #26a69a;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 800px;
  height: 600px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-grid {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.modal-image-side {
  width: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.package-title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 20px;
  color: white;
}

.package-title-overlay h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.modal-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 30px;
  background: white;
  overflow: hidden;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 15px;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  color: #fff;
  cursor: pointer;
  z-index: 2;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #000;
}

.detail-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-section li {
  padding: 5px 0;
  padding-left: 25px;
  position: relative;
  color: #444;
}

.detail-section li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #000;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.option-btn {
  background-color: #2ec4b6;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.option-btn:hover {
  background-color: #26a69a;
}

.package-options {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.options-modal {
  max-width: 600px;
  height: auto;
  max-height: 80vh;
  padding: 30px;
}

.options-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.pricing-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-5px);
}

.pax-info h3 {
  font-size: 20px;
  color: #2ec4b6;
  margin-bottom: 15px;
}

.price-info .price {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.price-info .per-person {
  font-size: 14px;
  color: #666;
}

@media (max-width: 850px) {
  .modal-content {
    width: 90%;
    height: 90vh;
  }
  
  .modal-grid {
    flex-direction: column;
  }
  
  .modal-image-side {
    width: 100%;
    height: 200px;
  }
}

@media (max-width: 768px) {
  .modal-grid {
    flex-direction: column;
  }
  
  .modal-image-side {
    min-height: 200px;
  }
  
  .banner h1 {
    font-size: 36px;
  }
  
  .packages-container h2 {
    font-size: 28px;
  }
  
  .modal-content {
    margin: 10px;
  }
  
  .options-modal {
    width: 90%;
    margin: 20px;
  }
  
  .pricing-grid {
    grid-template-columns: 1fr;
  }
}

.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2ec4b6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  color: #dc3545;
  padding: 40px;
}
</style>