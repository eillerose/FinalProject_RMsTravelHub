<template>
  <div class="landing-page">
    <header class="header">
      <div class="header-container">
        <div class="logo">
          <img src="/src/img/logoforRMs.png" alt="RM's Travel and Tours Logo" class="logo-image">
          <span class="logo-text">RM's Travel and Tours</span>
        </div>
        <nav class="center-nav">
          <ul>
            <li><a href="#hero" @click="setActiveLink">Home</a></li>
            <li><a href="#about-us" @click="setActiveLink">About</a></li>
            <li><a href="#explore" @click="setActiveLink">Explore</a></li>
          </ul>
        </nav>
        <div class="auth-buttons">
          <router-link to="/login" class="sign-in">Login</router-link>
          <router-link to="/signup" class="sign-up">Sign up</router-link>
        </div>
      </div>
    </header>

    <main>
      <section id="hero" class="hero">
        <h1>Discover the wonders of Puerto Galera!</h1>
        <p>More Exciting Deals are waiting for you!</p>
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="What are you looking for?" 
            v-model="searchQuery" 
            @focus="showDropdown = true" 
            @blur="hideDropdown"
          />
          <button @click="navigateToCategory(searchQuery)">Search</button>
          <ul v-if="showDropdown" class="dropdown">
            <li 
              v-for="category in categories" 
              :key="category" 
              @mousedown.prevent="selectCategory(category)"
            >
              {{ category }}
            </li>
          </ul>
        </div>
      </section>

      <section id="about-us" class="about-us">
        <h2>About Us</h2>
        <p class="about-description">
          At RM's Travel and Tours, we grant each and every adventurer a personalized experience like no other. We are aficionados coming from every part of Puerto Galera, passionate about guiding you through this pocket of paradise we call home.
        </p>
        <div class="about-wrapper">
          <div class="about-image">
            <img src="/src/img/aboutUs.jpg" alt="Beautiful Beach">
          </div>
          <div class="mission-vision-wrapper">
            <div class="vision-section hover-card">
              <h3>Our Vision</h3>
              <p>To be innovators, leaders, and creatives in travel concepts, positioning our agency as one of the best tourism agencies in Puerto Galera, recognized for professionalism and high-quality service.</p>
            </div>
            <div class="mission-section hover-card">
              <h3>Our Mission</h3>
              <p>To deliver excellent service to our clients with unforgettable travel experiences that exceed expectations. Our goal is to become "Your Preferred Travel Agency," providing satisfaction and the best value for your trip.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="content-gallery" class="content-gallery">
        <div class="tabs">
          <span 
            v-for="(tab, index) in tabs" 
            :key="index" 
            :class="{ active: activeTab === index }" 
            @click="setActiveTab(index)"
          >
            {{ tab.name }}
          </span>
        </div>
        <h2>{{ tabs[activeTab].name }}</h2>
        <div class="gallery-container">
          <div 
            v-for="(item, index) in tabs[activeTab].content" 
            :key="index" 
            class="gallery-item"
          >
            <img :src="item.image" :alt="item.title">
            <div class="overlay">
              <h1>{{ item.title }}</h1>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="explore" class="explore-section">
        <div class="explore-container">
          <div class="explore-content">
            <h2>Why Explore Puerto Galera With Us?</h2>
            <div class="explore-description">
              <p>
                At RM's Travel and Tours, we grant each and every adventurer a personalized
                experience like no other. We are aficionados coming from every part of Puerto
                Galera, passionate about guiding you through this pocket of paradise we call home.
              </p>
              <p>
                We hold strong the value of being factual. Our tour operators are with you every step
                through your booking process, we are there to scratch every inch of curiosity and
                enquiry that you may have. We simply want to get you going on a trip of a lifetime.
              </p>
            </div>
          </div>
          <div class="explore-image">
            <img src="/src/img/parasailing.jpg" alt="Beautiful beach in Puerto Galera with loungers and palm trees" />
          </div>
        </div>
        <div class="explore-features">
          <div v-for="(feature, index) in features" :key="index" class="feature-card">
            <div class="feature-icon">
              <component :is="feature.icon" />
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About Us</h3>
          <p>RM's Travel and Tours is your gateway to unforgettable adventures in Puerto Galera and beyond.</p>
        </div>
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#hero">Home</a></li>
            <li><a href="#about-us">About Us</a></li>
            <li><a href="#explore">Explore</a></li>
            <li><a href="#content-gallery">Gallery</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Contact Info</h3>
          <p>info@rmstravelandtours.com</p>
          <p>+63 123 456 7890</p>
          <p>Puerto Galera, Oriental Mindoro, Philippines</p>
        </div>
        <div class="footer-section">
          <h3>Follow Us</h3>
          <div class="social-icons">
            <a href="#" class="social-icon" aria-label="Facebook">
              <Facebook />
            </a>
            <a href="#" class="social-icon" aria-label="Instagram">
              <Instagram />
            </a>
            <a href="#" class="social-icon" aria-label="Twitter">
              <Twitter />
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        © {{ new Date().getFullYear() }} RM's Travel and Tours. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Compass, Users, Calendar, Heart, Facebook, Instagram, Twitter } from 'lucide-vue-next'

const showDropdown = ref(false)
const searchQuery = ref('')
const activeTab = ref(0)

const categories = [
  "Beaches – White Beach, Sabang Beach",
  "Activities – Snorkeling, diving, hiking, island hopping",
  "Travel Packages – Families, couples, adventure seekers",
  "Popular Tourist Spots – Tamaraw Falls, Mount Halcon, Ponderosa Golf Course"
]

const tabs = [
  {
    name: "Beaches",
    content: [
      {
        image: "/src/img/puertogalera.jpg",
        title: "White Beach",
        description: "Known for its stunning sunsets and vibrant nightlife."
      },
      {
        image: "/src/img/sabang-beach.jpg",
        title: "Sabang Beach",
        description: "A favorite for diving enthusiasts and water sports."
      },
      {
        image: "/src/img/sunset-at-aninuan-beach.jpg",
        title: "Aninuan Beach",
        description: "Swim through splash water to hidden waterfalls."
      }
    ]
  },
  {
    name: "Activities",
    content: [
      {
        image: "/src/img/para-sailing.jpg",
        title: "Snorkeling",
        description: "Discover the vibrant marine life around the reefs."
      },
      {
        image: "/src/img/jetski.jpg",
        title: "Diving",
        description: "Explore some of the best diving spots in the Philippines."
      },
      {
        image: "/src/img/Dragon-boat.jpg",
        title: "Island Hopping",
        description: "Enjoy the scenic beauty of nearby islands."
      }
    ]
  },
  {
    name: "Travel Packages",
    content: [
      {
        image: "/src/img/Family-Package.jpg",
        title: "Family Package",
        description: "Perfect for a fun and relaxing family getaway."
      },
      {
        image: "/src/img/Couple-Package.jpg",
        title: "Couples Package",
        description: "Romantic adventures await you."
      },
      {
        image: "/src/img/Adventure-Package.jpg",
        title: "Adventure Package",
        description: "Ideal for thrill-seekers and explorers."
      }
    ]
  },
  {
    name: "Tourist Spots",
    content: [
      {
        image: "/src/img/Tamaraw-Falls-1.jpg",
        title: "Tamaraw Falls",
        description: "A beautiful waterfall located in a lush valley."
      },
      {
        image: "/src/img/Mount-Halcon.webp",
        title: "Mount Halcon",
        description: "A challenging trek for adventure lovers."
      },
      {
        image: "/src/img/Ponderosa-Golf-Course.jpg",
        title: "Ponderosa Golf Course",
        description: "Scenic views and a unique golfing experience."
      }
    ]
  }
]

const features = [
  {
    icon: Compass,
    title: 'Local Expertise',
    description: 'Discover hidden gems and secret spots known only to true Puerto Galera locals.'
  },
  {
    icon: Users,
    title: 'Personalized Adventures',
    description: 'Experience tailor-made tours that cater to your unique interests and preferences.'
  },
  {
    icon: Calendar,
    title: 'Seamless Booking',
    description: 'Enjoy a hassle-free journey from inquiry to farewell with our dedicated team.'
  },
  {
    icon: Heart,
    title: 'Authentic Connections',
    description: 'Connect with the heart and soul of Puerto Galera through our passionate local guides.'
  }
]

const setActiveLink = (event) => {
  document.querySelectorAll('.center-nav a').forEach(link => {
    link.classList.remove('active')
  })
  event.target.classList.add('active')
}

const hideDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const selectCategory = (category) => {
  searchQuery.value = category
  showDropdown.value = false
  navigateToCategory(category)
}

const navigateToCategory = (category) => {
  const categoryToIndexMap = {
    "Beaches – White Beach, Sabang Beach": 0,
    "Activities – Snorkeling, diving, hiking, island hopping": 1,
    "Travel Packages – Families, couples, adventure seekers": 2,
    "Popular Tourist Spots – Tamaraw Falls, Mount Halcon, Ponderosa Golf Course": 3
  }

  const categoryIndex = categoryToIndexMap[category]

  if (categoryIndex !== undefined) {
    setActiveTab(categoryIndex)
    document.getElementById("content-gallery").scrollIntoView({ behavior: "smooth" })
  }
}

const setActiveTab = (index) => {
  activeTab.value = index
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

.landing-page {
  font-family: 'Poppins', sans-serif;
  color: #333;
}

/* Header Styling */
.header {
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-image {
  height: 2rem;
  width: auto;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.center-nav ul {
  display: flex;
  gap: 2rem;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.center-nav ul li a {
  color: #4B5563;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.center-nav ul li a:hover,
.center-nav ul li a.active {
  color: #059669;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.sign-in {
  color: #4B5563;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.sign-in:hover {
  color: #059669;
}

.sign-up {
  background-color: #059669;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.sign-up:hover {
  background-color: #047857;
}

/* Hero Section */
.hero {
  background-image: url('/src/img/heroBg.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 0 20px;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
}

/* Search Bar */
.search-bar {
  position: relative;
  display: flex;
  max-width: 500px;
  width: 100%;
}

.search-bar input {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-right: none;
  border-radius: 0.25rem 0 0 0.25rem;
  outline: none;
}

.search-bar button {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background-color: #059669;
  color: white;
  border: none;
  border-radius: 0 0.25rem 0.25rem 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-bar button:hover {
  background-color: #047857;
}

/* Dropdown Menu */
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 0.25rem;
  list-style-type: none;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 0;
}

.dropdown li {
  padding: 0.75rem;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown li:hover {
  background-color: #f3f4f6;
}

/* About Us Section */
.about-us {
  text-align: center;
  padding: 4rem 1.25rem;
  background-color: white;
}

.about-us h2 {
  font-size: 2.5rem;
  margin-bottom: 1.25rem;
  color: #111827;
}

.about-description {
  font-size: 1.125rem;
  color: #4B5563;
  max-width: 800px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;
}

.about-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2.5rem;
}

.about-image {
  flex: 1;
}

.about-image img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mission-vision-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.hover-card {
  padding: 1.25rem;
  background-color: white;
  border-radius: 0.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hover-card h3 {
  font-size: 1.5rem;
  color: #111827;
  margin-bottom: 0.625rem;
}

.hover-card p {
  font-size: 1rem;
  color: #4B5563;
  line-height: 1.6;
}

/* Content Gallery */
.content-gallery {
  padding: 4rem 1.25rem;
  background-color: #f3f4f6;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1.25rem;
}

.tabs span {
  cursor: pointer;
  padding: 0.625rem 1.25rem;
  font-size: 1.125rem;
  font-weight: 500;
  color: #4B5563;
  transition: color 0.2s ease;
}

.tabs span.active {
  color: #059669;
  border-bottom: 2px solid #059669;
}

.content-gallery h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #111827;
}

.gallery-container {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  flex-wrap: wrap;
}

.gallery-item {
  position: relative;
  width: 350px;
  height: 250px;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-item .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 1.25rem;
  text-align: center;
}

.gallery-item:hover .overlay {
  opacity: 1;
}

.overlay h1 {
  font-size: 1.5rem;
  margin-bottom: 0.625rem;
}

.overlay p {
  font-size: 1rem;
}

/* Explore Section */
.explore-section {
  background-color: #f8fafc;
  padding: 4rem 1rem;
}

.explore-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
  align-items: center;
}

.explore-content {
  flex: 1;
}

.explore-content h2 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

.explore-description {
  color: #4a5568;
}

.explore-description p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.explore-image {
  flex: 1;
}

.explore-image img {
  width: 100%;
  height: auto;
  border-radius: 1rem;
  object-fit: cover;
}

.explore-features {
  max-width: 1200px;
  margin: 3rem auto 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.feature-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 3rem;
  height: 3rem;
  background-color: #ebf8ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.feature-icon :deep(svg) {
  width: 1.5rem;
  height: 1.5rem;
  color: #3182ce;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #4a5568;
  line-height: 1.5;
}

/* Footer */
.footer {
  background-color: #1a202c;
  color: #e2e8f0;
  padding: 4rem 1rem 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.footer-section h3 {
  color: #fff;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.footer-section ul {
  list-style-type: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #e2e8f0;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-section a:hover {
  color: #fff;
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.social-icon {
  color: #e2e8f0;
  transition: color 0.2s ease;
}

.social-icon:hover {
  color: #fff;
}

.footer-bottom {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #2d3748;
  font-size: 0.875rem;
  color: #a0aec0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    padding: 1rem;
  }

  .center-nav ul {
    flex-direction: column;
    align-items: center;
  }

  .auth-buttons {
    margin-top: 1rem;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .about-wrapper {
    flex-direction: column;
  }

  .explore-container {
    flex-direction: column;
  }

  .explore-image {
    order: -1;
  }

  .explore-content h2 {
    font-size: 2rem;
  }
}
</style>