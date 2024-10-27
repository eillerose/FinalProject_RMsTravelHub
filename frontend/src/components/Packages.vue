<template>
      <div class="packages-page">
      <header>
      <div class="logo">
        <img src="/src/img/logoforRMs.png" alt="RM's Travel and Tours Logo" class="logo-image">
        <span class="logo-text">RM's Travel and Tours</span>
      </div>
      <nav>
        <ul>
          <li><router-link to="/home">Home</router-link></li>
          <li><router-link to="/about">About Us</router-link></li>
          <li><router-link to="/packages">Packages</router-link></li>
          <li><router-link to="/feedback">Feedback</router-link></li>
          <li><router-link to="/contact">Contact Us</router-link></li>
          <li class="profile">
            <a href="#" @click="toggleDropdown">
              <img :src="profileImage" alt="Profile" class="profile-icon" />
              <span class="arrow">&#9662;</span>
            </a>           
            <ul v-if="isDropdownOpen" class="dropdown">
              <li><router-link to="/edit-profile">Edit Profile</router-link></li>
              <li><router-link to="/history">History</router-link></li>
              <li><a href="#" @click.prevent="logout">Logout</a></li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
    <main>
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
        <div class="modal-content">
          <div class="modal-image" :style="{ backgroundImage: `url(${selectedPackage.modalImage})` }">
            <h2>{{ selectedPackage.name }}</h2>
            <p>{{ selectedPackage.description }}</p>
          </div>
          <div class="modal-details">
            <h3>Inclusions:</h3>
            <ul>
              <li v-for="inclusion in selectedPackage.inclusions" :key="inclusion">{{ inclusion }}</li>
            </ul>
            <h3>Package Options:</h3>
            <div v-if="selectedPackage.name === 'Package 1'" class="package-options">
              <button @click="openPackageModal('2D1N-beach')">2D1N Beach Front</button>
              <button @click="openPackageModal('3D2N-beach')">3D2N Beach Front</button>
              <button @click="openPackageModal('2D1N-walk')">2D1N 1-2 Mins Walk</button>
              <button @click="openPackageModal('3D2N-walk')">3D2N 1-2 Mins Walk</button>
            </div>
            <button class="close-btn" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
  
      <!-- Modal for Package Option Details -->
      <div v-if="showPackageModal" class="modal-overlay" @click.self="closePackageModal">
        <div class="modal-content package-modal">
          <h2>{{ packageDetails.title }}</h2>
          <p>{{ packageDetails.description }}</p>
          <h3>Prices:</h3>
          <ul>
            <li v-for="price in packageDetails.prices" :key="price">{{ price }}</li>
          </ul>
          <button class="close-btn" @click="closePackageModal">Close</button>
        </div>
      </div>
    </div>

    <div class="footer">
  <div class="footer-content">
    <!-- Logo Section -->
    <div class="footer-section footer-logo">
      <img src="/src/img/logoforRMs.png" alt="RM's Travel and Tours Logo" class="footer-logo-image">
    </div>
    
    <!-- About Us Section -->
    <div class="footer-section">
      <h3>About Us</h3>
      <p>RM's Travel and Tours is your gateway to unforgettable adventures in Puerto Galera and beyond.</p>
    </div>

    <!-- Other Footer Sections -->
    <div class="footer-section">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="/about">About Us</a></li>
        <li><a href="/packages">Packages</a></li>
        <li><a href="/feedback">Feedback</a></li>
        <li><a href="/contact">Contact Us</a></li>
      </ul>
    </div>
    
    <div class="footer-section">
      <h3>Contact Info</h3>
      <p>Email: info@rmstravelandtours.com</p>
      <p>Phone: +63 123 456 7890</p>
      <p>Address: Puerto Galera, Oriental Mindoro, Philippines</p>
    </div>

    <div class="footer-section">
      <h3>Follow Us</h3>
      <div class="social-icons">
        <a href="#" class="social-icon">FB</a>
        <a href="#" class="social-icon">IG</a>
        <a href="#" class="social-icon">TW</a>
      </div>
    </div>
  </div>
  
  <div class="footer-bottom">
    © 2023 RM's Travel and Tours. All rights reserved.
  </div>
</div>
    </main>
    </div>

    
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const packages = ref([
    {
      name: "Ruby Package",
      cardImage: new URL('@/assets/pg-background.jpg', import.meta.url).href,
      modalImage: new URL('@/assets/package1.jpg', import.meta.url).href,
      description: "Get the best of inland and island tours with the Ruby Package!",
      inclusions: [
        "Airconditioned room", "Cable TV", "WiFi", "Private bathroom",
        "Towels and Toilet paper", "Snorkeling and Island Tour", "DOT Accredited Tour Guide"
      ],
      prices: [
        "2D1N: 1-2 pax – PHP 1950 per head", "3-4 pax – PHP 1800 per head",
        "5-6 pax – PHP 1550 per head", "10 pax or GROUPS – PHP 1400 per head"
      ]
    },
    {
      name: "Diamond Package",
      cardImage: new URL('@/assets/pg-background.jpg', import.meta.url).href,
      modalImage: new URL('@/assets/package1.jpg', import.meta.url).href,
      description: "Enjoy a premium vacation experience in Puerto Galera!",
      inclusions: [
        "Airconditioned room", "Cable TV", "WiFi", "Private bathroom",
        "Towels and Toilet paper", "Inland Tour and Island Hopping",
        "Complete gears for snorkeling and swimming", "DOT Accredited Tour Guide"
      ],
      prices: [
        "2D1N: 1-2 pax – PHP 2150 per head", "3-4 pax – PHP 1800 per head",
        "5-6 pax – PHP 1500 per head", "10 pax or GROUPS – PHP 1400 per head"
      ]
    },
    {
      name: "Package 1",
      cardImage: new URL('@/assets/pg-background.jpg', import.meta.url).href,
      modalImage: new URL('@/assets/package1.jpg', import.meta.url).href,
      description: "Great accommodation and Island Hopping with snorkeling options.",
      inclusions: [
        "AC Room", "Cabled TV", "Private Bathroom", "Free use of towels and tissue",
        "Free WiFi", "Island Hopping to 3 Beaches (Haligi, Bayanan, Heart)",
        "Complete Snorkeling Gear", "Big Boat (min. capacity of 6 pax)",
        "Mask", "Life Vest", "Goggles"
      ],
      accommodationOptions: [
        "Beach Front Accommodation",
        "1-2 minutes walk to Hotel/Lodging Inn"
      ]
    },
    {
      name: "Package 2",
      cardImage: new URL('@/assets/pg-background.jpg', import.meta.url).href,
      modalImage: new URL('@/assets/package1.jpg', import.meta.url).href,
      description: "Experience underwater adventures with our snorkeling tour.",
      inclusions: [
        "AC Room", "Cabled TV", "Private Bathroom", "Free WiFi",
        "Snorkeling to Coral Garden, Giant Clam Shell", "Complete Snorkeling Gear"
      ],
      prices: [
        "2D1N: 1-2 pax – PHP 1950 per head", "3-4 pax – PHP 1800 per head",
        "5-6 pax – PHP 1550 per head", "10 pax or GROUPS – PHP 1400 per head"
      ]
    }
  ])
  
  const showModal = ref(false)
  const selectedPackage = ref(null)
  const showPackageModal = ref(false)
  const packageDetails = ref(null)
  
  const openModal = (pkg) => {
    selectedPackage.value = pkg
    showModal.value = true
  }
  
  const closeModal = () => {
    showModal.value = false
    selectedPackage.value = null
  }
  
  const packageOptions = {
    '2D1N-beach': {
      title: '2D1N Package (beach front accommodation)',
      description: 'Enjoy a 2-day, 1-night stay with beach front accommodation.',
      prices: [
        '1-2 pax – PHP 2150.00 per head',
        '3-4 pax – PHP 1800.00 per head',
        '5-6 pax – PHP 1500.00 per head',
        '10 pax or GROUPS – PHP 1400.00 per head'
      ]
    },
    // Other package options...
  }
  
  const openPackageModal = (option) => {
    packageDetails.value = packageOptions[option]
    showPackageModal.value = true
  }
  
  const closePackageModal = () => {
    showPackageModal.value = false
    packageDetails.value = null
  }
  </script>

  <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');


header {
     font-family: 'Poppins', sans-serif;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 15px;
      background-color: white; 
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000; 
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  }

  .logo {
      display: flex;
      align-items: center; 
  }

  .logo-image {
      margin: 0 20px;
      max-height: 50px; 
      margin-right: 8px; 
  }

  .logo-text {
      font-size: 20px; 
      font-weight: bold;
      color: Black; 
  }
  nav {
      display: flex;
      align-items: center;
  }

  nav ul {
      display: flex;
      justify-content: center;
      list-style-type: none;
      padding: 0;
  }

  nav ul li {
      font-family: 'Poppins', sans-serif;
      position: relative;
      margin: 0 20px;
      cursor: pointer;
      font-size: 17px;
      font-weight:light;
      color: #155861;
      transition: color 0.3s ease;
  }

  nav ul li a {
  color: #155861;
  text-decoration: none;
  transition: color 0.3s ease;
  }

  nav ul li:hover a {
  color: black;
  }

  nav ul li::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #155861;
  transition: width 0.3s ease;
  }

  nav ul li:hover::after {
  width: 100%; 
  }

  /* Auth Buttons */
  .auth-buttons {
  margin-left: auto;
  }

  .profile .dropdown {
      display: block; /* Ensure dropdown shows properly */
      position: absolute;
      top: 175%;
      right: -25px;
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      width: 250px; /* Ensure consistent width for the box */
      padding: 10px 0; /* Add padding to create box-like structure */
  }

  .profile .dropdown li {
      list-style: none; /* Remove bullet points */
      padding: 10px 20px; /* Add padding to create space around items */
      text-align: left; /* Left-align the text inside the box */
      display: block;
  }

  .profile .dropdown li a {
      display: block;
      color: #3498db;
      text-decoration: none;
      padding: 10px 0; 
      text-transform: uppercase; 
      text-align: left; 
  }

  .profile .dropdown li a:hover {
      background-color: #f0f0f0; 
  }

  .profile {
      margin-right: 20px; 
  }

  .arrow {
      margin-left: 5px; 
  }


.packages-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Poppins', sans-serif;
}

h1 {
  padding-top: 5rem;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
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
  background-color: #008CBA;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 5px;
  border-radius: 5px;
}

.view-btn:hover, .package-options button:hover {
  background-color: #005f73;
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
  display: flex;
  background-color: white;
  width: 90%;
  max-width: 1000px;
  height: 80vh;
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
}

.modal-image h2 {
  margin-top: 15rem;
  font-size: 3rem;
  margin-bottom: 40px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.modal-image p {
  font-size: 1rem;
  max-width: 80%;
  color: white;
}

.modal-details {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.modal-details h3 {
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 15px;
}

.modal-details ul {
  list-style-type: none;
  padding-left: 0;
  margin-bottom: 20px;
}

.modal-details li {
  margin-bottom: 10px;
}

.package-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.close-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  float: right;
}

.close-btn:hover {
  background-color: #d32f2f;
}

.package-modal {
  flex-direction: column;
  padding: 30px;
}

.footer {
  font-family: 'Poppins', sans-serif;
  background-color: #155861;
  color: white;
  padding: 15px 15px; 
  margin-left: -10px ;
  margin-right: -10px ;
} 
  
.footer-logo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-section h3,
.footer-section p,
.footer-section a {
  color: white; 
}

.footer-section p,
.footer-section a {
  margin-left:10px;
}

.footer-logo-image {
  max-width: 100px;
  margin-bottom: 10px;
  margin-top: 25px;
  padding-top: 25px;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around; 
  max-width: 1150px;
  margin: 0 auto;
  gap: 100px; 
  padding-left: 10px;
  padding-right: 10px;
}

.footer-section {
  flex: 1;
  min-width: 150px;
}

.footer-section h3 {
  font-size: 20px;
  margin-bottom: 20px; 
  font-weight: 600;
}

.footer-section p,
.footer-section li {
  font-size: 14px;
  line-height: 1.8;
  margin: 0;
  padding-bottom: 5px; 
}

.footer-section ul {
  list-style-type: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 2px;
}

.footer-section ul li a {
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: #64b8b1;
}

.social-icons {
  display: flex;
  gap: 15px; 
  margin-top: 20px; 
}

.social-icon {
  display: inline-block;
  width: 35px;
  height: 35px;
  background-color: white;
  color: #155861;
  text-align: center;
  line-height: 35px;
  border-radius: 50%;
  font-size: 16px;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.social-icon:hover {
  background-color: #64b8b1;
  color: white;
}

.footer-bottom {
  text-align: center;
  margin-top: 15px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 15px;
  color: white 
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
  .footer-content {
    flex-direction: column;
  }

  .footer-section {
    margin-bottom: 50px;
  }
}
</style>