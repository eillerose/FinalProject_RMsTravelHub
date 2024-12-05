<template>
  <div class="packages-page">
    <HeaderComponent />
     <!-- Banner Section -->
    <div class="banner">
      <h1>Travel Packages</h1>
      <p>Explore our exclusive travel packages for an unforgettable adventure. Your journey to paradise starts here!</p>
    </div>

    <div class="packages-container">
      <h1>Our Travel Packages</h1>
      <div class="packages-grid">
        <div class="package-card" v-for="(pkg, index) in packages" :key="index">
          <img :src="pkg.cardImage" :alt="pkg.name" class="package-image" />
          <h2>{{ pkg.name }}</h2>
          <p>{{ pkg.description }}</p>
          <button class="view-btn" @click="openModal(pkg)">View Details</button>
        </div>
      </div>

  
<!-- Modal for Package Details -->
<div v-if="showModal" class="modal-overlay" @click.self="closeModal">
  <div :class="['modal-content', { 'large-modal': selectedPackage?.name === 'Package Diamond' || selectedPackage?.name === 'Package Ruby' }]">
    <!-- Add the modified modal-image section here -->
    <div class="modal-image" :style="{ backgroundImage: `url(${selectedPackage.modalImage})` }">
      <!-- Conditional class for h2 and p -->
      <h2 :class="{ 'large-text': selectedPackage?.name === 'Package Diamond' || selectedPackage?.name === 'Package Ruby' }">
        {{ selectedPackage.name }}
      </h2>
      <p :class="{ 'large-description': selectedPackage?.name === 'Package Diamond' || selectedPackage?.name === 'Package Ruby' }">
        {{ selectedPackage.description }}
      </p>
    </div>

    <div class="modal-details">
      <div v-if="selectedPackage.name === 'Package Diamond' || selectedPackage.name === 'Package Ruby'">
        <h3>Enjoy and have a memorable vacation with RM's Travel and Tours Here in Puerto Galera</h3>
        <ul>
          <li v-if="selectedPackage.name === 'Package Diamond'">Free simple SOUVENIRS from RM'S Family!</li>
          <li>Assisted by licensed and DOT Accredited Tour Guide during tours</li>
          <li>Transfer from Balatero Port to Accommodation Vice Versa</li>
        </ul>
              <h3>Accommodation:</h3>
              <ul>
                <li>Airconditioned room</li>
                <li>Cable TV</li>
                <li>With WiFi</li>
                <li>With private bathroom</li>
                <li>With towels and Toilet paper</li>
                <li>With Generator in case of brown out</li>
                <li>Using common kitchen (extra charge must be paid by the guest)</li>
              </ul>
              <div class="package-options">
                <button @click="openPackageModal('Inland Tour')">Inland Tour</button>
                <button @click="openPackageModal('Island Tour')">Island Tour</button>
                <button @click="openPackageModal('Activities')">Activities</button>
              </div>
            </div>
            <div v-else>
              <h3>Optional Accommodation:</h3>
              <ul>
                <li>Beach Front: 1-2 minutes of walk</li>
                <li>Hotel/Lodging Inn</li>
              </ul>
              <h3>Room Inclusions:</h3>
              <ul>
                <li>AC Room</li>
                <li>Cabled TV</li>
                <li>Private Bathroom</li>
                <li>Free use of towels and tissue</li>
                <li>Free WiFi</li>
              </ul>
              <h3>Tour Inclusions:</h3>
              <ul>
                <li v-for="item in selectedPackage.tourInclusions" :key="item">{{ item }}</li>
              </ul>
              <h3>Package Options:</h3>
              <div class="package-options">
                <button v-for="option in selectedPackage.options" :key="option" @click="openPackageModal(option)">{{ option }}</button>
              </div>
            </div>
            <button class="close-btn" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      </div>


      <!-- Modal for Specific Package Details -->
<div v-if="showPackageModal" class="modal-overlay" @click.self="closePackageModal">
  <!-- Conditional classes for Inland Tour and Island Tour -->
  <div :class="['modal-content', 'package-modal', { 'inland-tour-style': packageDetails?.title === 'Inland Tour', 'island-tour-style': packageDetails?.title === 'Island Tour' }]">
    <!-- Close Button at Top-Right -->
    <button class="back-icon" @click="closePackageModal">&times;</button>

    <!-- Title and Description Section -->
    <h2 class="package-title">{{ packageDetails.title }}</h2>
    <p class="package-description">{{ packageDetails.description }}</p>

    <!-- Conditional Price List Section -->
    <div v-if="packageDetails.title !== 'Inland Tour' && packageDetails.title !== 'Island Tour' && packageDetails.title !== 'Activities'">
      <h3 class="price-list-label">Price List</h3>
    </div>
    <div class="price-list-container">
      <ul class="price-list">
        <li v-for="price in packageDetails.prices" :key="price">{{ price }}</li>
      </ul>
    </div>

    <!-- Book Now Button -->
    <button class="book-now-btn">Book Now</button>
  </div>
</div>


    </div>
    <FooterComponent />
  </div>
</template>

<script setup>
import HeaderComponent from './Header.vue';
import FooterComponent from './Footer.vue';
import { ref } from 'vue';

const packages = ref([
  {
    name: "Package 1",
    cardImage: new URL('/src/img/package1.jpg', import.meta.url).href,
    modalImage: new URL('/src/img/login-signup.jpg', import.meta.url).href,
    description: "Great accommodation and Island Hopping with snorkeling options.",
    tourInclusions: [
      "Island Hopping to 3 Beaches: Haligi Beach, Bayanan Beach, Heart Beach",
      "Complete Gears: Big Boat (min. capacity of 6 pax), Mask, Life Vest, Goggles"
    ],
    options: ["2D1N Beach Front", "3D2N Beach Front", "2D1N 1-2 Mins Walk", "3D2N 1-2 Mins Walk"],
  },
  {
    name: "Package 2",
    cardImage: new URL('/src/img/package2.jpg', import.meta.url).href,
    modalImage: new URL('/src/img/login-signup.jpg', import.meta.url).href,
    description: "Experience underwater adventures with our snorkeling tour.",
    tourInclusions: [
      "Snorkeling at Coral Garden, Underwater Cave, Giant Clam Shell",
      "Island Sightseeing",
      "Complete Gears: Big Boat (min. capacity of 6 pax), Mask, Life Vest, Goggles"
    ],
    options: ["2D1N Beach Front", "3D2N Beach Front", "2D1N 1-2 Mins Walk", "3D2N 1-2 Mins Walk"],
  },
  {
    name: "Package Diamond",
    cardImage: new URL('/src/img/packageDiamond.jpg', import.meta.url).href,
    modalImage: new URL('/src/img/login-signup.jpg', import.meta.url).href,
    description: "Enjoy a memorable vacation with snorkeling, inland, and island tours.",
    options: ["Inland Tour", "Island Tour", "Activities"]
  },
  {
    name: "Package Ruby",
    cardImage: new URL('/src/img/packageRuby.jpg', import.meta.url).href,
    modalImage: new URL('/src/img/login-signup.jpg', import.meta.url).href,
    description: "Experience underwater adventures with our snorkeling tour.",
    options: ["Inland Tour", "Island Tour", "Activities"]
  }
]);

const showModal = ref(false);
const selectedPackage = ref(null);
const showPackageModal = ref(false);
const packageDetails = ref(null);

const openModal = (pkg) => {
  selectedPackage.value = pkg;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedPackage.value = null;
};

const packageOptions = {
  '2D1N Beach Front': {
    title: '2D1N Package (Beach Front Accommodation)',
    description: 'Enjoy a 2-day, 1-night stay with beach front accommodation.',
    prices: [
      '1-2 pax – PHP 2150.00 per head',
      '3-4 pax – PHP 1800.00 per head',
      '5-6 pax – PHP 1500.00 per head',
      '10 pax or GROUPS – PHP 1400.00 per head'
    ]
  },
  '3D2N Beach Front': {
    title: '3D2N Package (Beach Front Accommodation)',
    description: 'Enjoy a 3-day, 2-night stay with beach front accommodation.',
    prices: [
      '1-2 pax – PHP 3150.00 per head',
      '3-4 pax – PHP 2599.00 per head',
      '5-6 pax – PHP 2050.00 per head',
      '10 pax or GROUPS – PHP 1900.00 per head'
    ]
  },
  '2D1N 1-2 Mins Walk': {
    title: '2D1N Package (1-2 Minutes Walk Accommodation)',
    description: 'Enjoy a 2-day, 1-night stay with 1-2 minutes walk accommodation.',
    prices: [
      '1-2 pax – PHP 1900.00 per head',
      '3-4 pax – PHP 1500.00 per head',
      '5-6 pax – PHP 1450.00 per head',
      '10 pax or GROUPS – PHP 1300.00 per head'
    ]
  },
  '3D2N 1-2 Mins Walk': {
    title: '3D2N Package (1-2 Minutes Walk Accommodation)',
    description: 'Enjoy a 3-day, 2-night stay with 1-2 minutes walk accommodation.',
    prices: [
      '1-2 pax – PHP 2650.00 per head',
      '3-4 pax – PHP 1900.00 per head',
      '5-6 pax – PHP 1800.00 per head',
      '10 pax or GROUPS – PHP 1700.00 per head'
    ]
  },
  'Inland Tour': {
    title: 'Inland Tour',
    description: 'Experience an inland adventure with multiple sightseeing spots.',
    prices: [
      'Mangyan Village',
      'White Beach View Deck',
      'Ponderosa Golf Course',
      'Infinity Farm',
      'Tamaraw Falls'
    ]
  },
  'Island Tour': {
    title: 'Island Tour',
    description: 'Explore beaches and snorkeling spots.',
    prices: [
      'Beach Hopping: Heart Beach, Haligi Beach, Bayanan Beach',
      'Snorkeling Locations: Underwater Cave, Giant Clam, Coral Garden',
      'Includes all gears: Life Vest, Snorkel, Aqua Shoes, Entrance Fees'
    ]
  },
  'Activities': {
    title: 'Activities',
    description: 'Multiple activities included in the package.',
    prices: [
      'Picture Taking',
      'Sightseeing',
      'Snorkeling',
      'Swimming',
      'Beach Combing',
      'Trekking'
    ]
  }
};

const openPackageModal = (option) => {
  packageDetails.value = packageOptions[option];
  showPackageModal.value = true;
};

const closePackageModal = () => {
  showPackageModal.value = false;
  packageDetails.value = null;
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://fonts.googleapis.com/css2?family=Ephesis&display=swap');

.packages-page {
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
}



.banner {
    width: 100%;
    background-color: #013240;
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
    margin-top: -2rem;
    margin-bottom: 1rem;
    color: white;
}

.packages-container {
    padding: 20px;
    max-width: 1500px;
    margin: 0 auto;
    min-height: 80vh;
}

h1 {
    padding-top: 1rem;
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 60px;
}

.packages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.package-card {
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
}

.package-card:hover {
    transform: translateY(-5px); 
}

.package-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

h2 {
    font-size: 1.5rem;
    margin: 15px 0 10px;
    padding: 0 15px;
}

p {
    font-size: 1rem;
    color: #666;
    padding: 0 15px;
    flex-grow: 1;
}

.view-btn, .package-options button {
  font-family: 'Poppins', sans-serif;
    background-color: #2ec4b6;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 10px;
    border-radius: 5px;
}

.view-btn:hover, .package-options button:hover {
    background-color: #00d7d4;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    position: relative;
    display: flex;
    background-color: white;
    width: 100%;
    max-width: 1000px;
    height: 85vh;
    border-radius: 10px;
    overflow: hidden;
}

.modal-image {
    flex: 1;
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
    padding: 20px;
    height: 100%;
    font-family: 'Poppins', sans-serif;
}

.modal-image h2 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-top:18rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.modal-image p {
    font-family: 'Ephesis', cursive;
    color: white;
    font-size: 2rem;
    margin-top: 5px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.modal-details {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
}

.package-options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
}

.close-btn {
    background: none;
    border: none;
    color: black;
    cursor: pointer;
    font-size: 1.5rem;
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 8px;
    transition: color 0.3s;
}

.large-modal {
    max-width: 1200px; 
    height: 63vh; 
}

.large-modal h2 {
  margin-top: 14rem;
  font-size: 3rem; 
  font-weight: bold;
}

.large-modal p {
  font-size: 1.5rem;
  margin-top: 1rem; 
}

/* Styles specific to Inland Tour modal */
.inland-tour-style {
    max-width: 800px; /* Set unique width for Inland Tour modal */
    height: 60vh; /* Unique height */
    padding: 25px; /* Add padding specific to Inland Tour */
}

/* Styles specific to Island Tour modal */
.island-tour-style {
    max-width: 900px; /* Set unique width for Island Tour modal */
    height: 50vh; /* Unique height */
    padding: 20px; /* Add padding specific to Island Tour */
}


.package-modal {
    display: block;
    padding: 20px;
    max-width: 650px; 
    max-height: 650px;
    width: 100%;
    margin: 0 auto; /* Center the modal */
}


.back-icon {
  background: none;
    border: none;
    color: black;
    cursor: pointer;
    font-size: 1.5rem;
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 8px;
    transition: color 0.3s;
}

.package-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    text-align: center;
}

.package-description {
    font-size: 1rem;
    color: #555;
    margin-bottom: 10px; /* Adjust this value */
    text-align: center;
    line-height: 1.4; /* Adjust as needed */
}


.price-list-label {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-top: 50px;
    margin-bottom: 0;
}

.price-list-container {
    background-color: white;
    border-radius: 5px;
    padding: 20px;
    width: 93%;
}

.price-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.price-list li {
    font-size: 1rem;
    color: #444;
    padding: 15px;
    margin-bottom: 10px;
    background-color: #f0f0f0; /* Light gray background for each item */
    border-radius: 5px;
    text-align: center;
    font-weight: 500;
}

.price-list li:last-child {
    margin-bottom: 0; /* Remove the margin for the last item */
}


.book-now-btn {
    font-family: 'Poppins', sans-serif;
    background-color: #2ec4b6;
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
    width: 50%; /* Full-width button */
    margin-left: 10rem;
    margin-top: 2rem;
    transition: background-color 0.3s;
}

.book-now-btn:hover {
    background-color: #00d7d4;
}


.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

@media (max-width: 768px) {
    .modal-content {
        flex-direction: column;
        height: 90vh;
    }

    .modal-image, .modal-details {
        flex: none;
    }

    .modal-image {
        height: 40%;
    }

    .modal-details {
        height: 60%;
    }

    .package-options {
        flex-direction: column;
    }

    .package-modal {
        max-width: 90%; /* Adjust for smaller screens */
        padding: 15px;
    }

    .book-now-btn {
        padding: 8px 12px; /* Slightly smaller padding for mobile */
    }
}

</style>