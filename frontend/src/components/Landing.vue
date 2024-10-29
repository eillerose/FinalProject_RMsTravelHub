<template>
    <div class="landing-page">
      <header>
        <div class="logo">
        <img src="/src/img/logoforRMs.png" alt="RM's Travel and Tours Logo" class="logo-image">
        <span class="logo-text">RM's Travel and Tours</span>
      </div>
        <nav>
          <ul>
                <li><a href="#hero">Home</a></li>
                <li><a href="#about-us">About</a></li>
                <li><a href="#explore">Explore</a></li>
          </ul>

          <div class="auth-buttons">
                <router-link to="/login"><button class="sign-in">Sign In</button></router-link>
                <router-link to="/signup"><button class="sign-up">Sign Up</button></router-link>
          </div>
        </nav>



      </header>

      <main>
        <section id="hero" class="hero">
            <h1>Discover the wonders of Puerto Galera!</h1>
            <p>More Exciting Deals are waiting for you!</p>
            <div class="search-bar">
            <input 
                type="text" 
                placeholder="What are you looking for?"
                @focus="showDropdown = true"
                @blur="hideDropdown"
            />
            <button @click="navigateToSection(searchQuery)">Search</button>
            <ul v-if="showDropdown" class="dropdown">
            <li 
              v-for="category in categories" 
              :key="category" 
              @click="selectCategory(category)">
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
            <!-- Image Section -->
            <div class="about-image">
              <img src="/src/img/logoforRMs.png" alt="RM's Travel and Tours">
            </div>
            
            <!-- Mission and Vision Section -->
            <div class="mission-vision-wrapper">
              <div class="mission-section">
                <h3>Our Mission</h3>
                <p class="mission-text">
                  To provide exceptional travel experiences by offering personalized tours, reliable services, and sustainable travel options that showcase the beauty and culture of Puerto Galera.
                </p>
              </div>
              <div class="vision-section">
                <h3>Our Vision</h3>
                <p class="vision-text">
                  To become the leading travel agency in the region by continuously innovating and enhancing our services, ensuring customer satisfaction, and promoting responsible tourism.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Beaches Section -->
        <section id="beaches" class="gallery">
          <h2>Beaches of Puerto Galera</h2>
          <div class="gallery-container">
            <div class="gallery-item">
              <img src="/src/img/puertogalera.jpg" alt="White Beach">
              <p>White Beach - Known for its stunning sunsets and vibrant nightlife.</p>
            </div>
            <div class="gallery-item">
              <img src="/src/img/sabang-beach.jpg" alt="Sabang Beach">
              <p>Sabang Beach - A favorite for diving enthusiasts and water sports.</p>
            </div>
            <div class="gallery-item">
              <img src="/src/img/sunset-at-aninuan-beach.jpg" alt="Hiking">
              <p>Aninuan Beach - Swim through splash water to hidden waterfalls.</p>
            </div>
          </div>
        </section>

        <!-- Activities Section -->
        <section id="activities" class="gallery">
          <h2>Activities in Puerto Galera</h2>
          <div class="gallery-container">
            <div class="gallery-item">
              <img src="/src/img/para-sailing.jpg" alt="Snorkeling">
              <p>Snorkeling - Discover the vibrant marine life around the reefs.</p>
            </div>
            <div class="gallery-item">
              <img src="/src/img/jetski.jpg" alt="Diving">
              <p>Diving - Explore some of the best diving spots in the Philippines.</p>
            </div>
            <div class="gallery-item">
              <img src="/src/img/Dragon-boat.jpg" alt="Island Hopping">
              <p>Island Hopping - Enjoy the scenic beauty of nearby islands.</p>
            </div>
          </div>
        </section>

        <!-- Travel Packages Section -->
        <section id="travel-packages" class="gallery">
          <h2>Travel Packages</h2>
          <div class="gallery-container">
            <div class="gallery-item">
              <img src="/src/img/Family-Package.jpg" alt="Family Package">
              <p>Family Package - Perfect for a fun and relaxing family getaway.</p>
            </div>
            <div class="gallery-item">
              <img src="/src/img/Couple-Package.jpg" alt="Couples Package">
              <p>Couples Package - Romantic adventures await you.</p>
            </div>
            <div class="gallery-item">
              <img src="/src/img/Adventure-Package.jpg" alt="Adventure Package">
              <p>Adventure Package - Ideal for thrill-seekers and explorers.</p>
            </div>
          </div>
        </section>

        <!-- Popular Tourist Spots Section -->
        <section id="tourist-spots" class="gallery">
          <h2>Popular Tourist Spots</h2>
          <div class="gallery-container">
            <div class="gallery-item">
              <img src="/src/img/Tamaraw-Falls-1.jpg" alt="Tamaraw Falls">
              <p>Tamaraw Falls - A beautiful waterfall located in a lush valley.</p>
            </div>
            <div class="gallery-item">
              <img src="/src/img/Mount-Halcon.webp" alt="Mount Halcon">
              <p>Mount Halcon - A challenging trek for adventure lovers.</p>
            </div>
            <div class="gallery-item">
              <img src="/src/img/Ponderosa-Golf-Course.jpg" alt="Ponderosa Golf Course">
              <p>Ponderosa Golf Course - Scenic views and a unique golfing experience.</p>
            </div>
          </div>
        </section>

        <!-- Explore Section -->
        <section id="explore" class="explore-section">
          <h2>Why Explore Puerto Galera With Us</h2>
          <div class="explore-description">
            <p>
              At RM's Travel and Tours, we grant each and every adventurer a personalized experience like no other. 
              We are aficionados coming from every part of Puerto Galera, passionate about guiding you through this 
              pocket of paradise we call home.
            </p>
            <p>
              We hold strong the value of being factual. Our tour operators are with you every step through your 
              booking process, we are there to scratch every inch of curiosity and enquiry that you may have. 
              We simply want to get you going on a trip of a lifetime.
            </p>
          </div>
        </section>
  
        <!-- Footer Section -->
        <footer class="footer">
          <div class="footer-content">
            <!-- Logo and Description Section -->
            <div class="footer-logo-desc">
              <img src="/src/img/logoforRMs.png" alt="RM's Travel and Tours Logo" class="footer-logo">
              <p>At RM's Travel and Tours, we offer exceptional travel experiences in the breathtaking Puerto Galera. Adventure awaits you!</p>
            </div>
            
            <!-- Contact Information Section -->
            <div class="footer-contact">
              <h3>Contact Us</h3>
              <p>Email: info@rmstravelandtours.com</p>
              <p>Phone: +63 123 456 7890</p>
              <p>Location: Puerto Galera, Oriental Mindoro, Philippines</p>
            </div>
            
            <!-- Social Media Section -->
            <div class="footer-social">
              <h3>Follow Us</h3>
              <a href="https://facebook.com/rmstravelandtours" target="_blank">Facebook</a>
              <a href="https://instagram.com/rmstravelandtours" target="_blank">Instagram</a>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; 2024 RM's Travel and Tours. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        showDropdown: false,
        categories: [
          "Beaches – White Beach, Sabang Beach",
          "Resorts and Accommodations – Budget, family-friendly, luxury",
          "Activities – Snorkeling, diving, hiking, island hopping",
          "Travel Packages – Families, couples, adventure seekers",
          "Popular Tourist Spots – Tamaraw Falls, Mount Halcon, Ponderosa Golf Course"
        ]
      };
    },
    methods: {
      hideDropdown() {
        setTimeout(() => {
          this.showDropdown = false;
        }, 200);
      },
      selectCategory(category) {
        // Set the search term and close the dropdown
        this.searchQuery = category;
        this.showDropdown = false;

        // Call navigate to section immediately
        this.navigateToSection(category);
      },
      navigateToSection(category) {
        let sectionId = '';

        // Match the category to a section ID
        switch (category) {
          case 'Beaches – White Beach, Sabang Beach':
            sectionId = 'beaches';
            break;
          case 'Resorts and Accommodations – Budget, family-friendly, luxury':
            sectionId = 'resorts';
            break;
          case 'Activities – Snorkeling, diving, hiking, island hopping':
            sectionId = 'activities';
            break;
          case 'Travel Packages – Families, couples, adventure seekers':
            sectionId = 'travel-packages';
            break;
          case 'Popular Tourist Spots – Tamaraw Falls, Mount Halcon, Ponderosa Golf Course':
            sectionId = 'tourist-spots';
            break;
          default:
            return; // Exit if there's no match
        }

        // Smooth scroll to the matched section
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  </script>
  
  <script setup>
    import { useRouter } from 'vue-router'; // Ensure it's imported

    const router = useRouter(); // Get router instance

    // Define navigation functions
    const goToLogin = () => {
    console.log('Navigating to Login');  // Add console log for debugging
    router.push('/login');
    };

    const goToSignup = () => {
    console.log('Navigating to Signup');  // Add console log for debugging
    router.push('/signup');
    };
  </script>

  <style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

    .landing-page {
        font-family: 'Poppins', sans-serif;
        color: #333;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 50px;
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
        max-height: 80px; 
        margin-right: 30px; 
    }

    .logo-text {
        font-size: 35px; 
        font-weight: bold;
        color: #155861; 
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
    font-size: 25px;
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
    color: #E4E0E1;
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

    .sign-in, .sign-up {
    font-family: 'Poppins', sans-serif;
    padding: 18px 40px;
    margin-left: 10px;
    font-size: 25px;
    border-radius: 5px;
    cursor: pointer;
    }

    .sign-in {
    background-color: transparent;
    border: 2px solid #155861;
    color: #155861;
    }

    .sign-in:hover {
    background-color: #155861;
    color: white;
    }

    .sign-up {
    background-color: transparent;
    border: 2px solid #155861;
    color: #155861;
    }

    .sign-up:hover {
        background-color: #155861;
        color: white;
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
    margin-left: -18px;
    margin-right: -18px;
    padding: 0 20px;
    }

    .hero h1 {
    font-size: 64px; 
    margin-bottom: 20px;
    }

    .hero p {
    font-size: 28px; 
    margin-bottom: 40px;
    }

    .search-bar {
    display: flex;
    width: 100%;
    max-width: 700px; 
    }

    .search-bar input {
    font-family: 'Poppins', sans-serif;
    flex-grow: 1;
    padding: 20px; 
    font-size: 1.5rem;
    border: none;
    border-radius: 5px 0 0 5px;
    }

    .search-bar button {
    font-family: 'Poppins', sans-serif;    
    padding: 20px 40px; 
    font-size: 1.5rem;
    background-color: #64b8b1;
    color: white;
    border: none;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    }

    .search-bar button:hover {
    background-color: #2c3e50;
    }

  .search-bar {
      position: relative;
      display: flex;
      /* flex-direction: column; */
      align-items: center;
  }

  /* Dropdown Styling */
  .dropdown {
      position: absolute;
      top: 100%; 
      left: 0;
      width: 70%;
      margin-top: 5px;
      list-style: none;
      background-color: #2c3e50;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
      z-index: 1000;
  }

  /* Dropdown List Items */
  .dropdown li {
    padding: 8px;
    cursor: pointer;
    text-align: left;
  }

  .dropdown li:hover {
    background-color: rgba(200, 200, 200, 0.3);
  }


    .about-us {
    text-align: center;
    padding: 80px 20px;
    background-color: #f9f9f9;
    /* margin-bottom: 80px; */
    }

    .about-us h2 {
    font-size: 65px;
    margin-bottom: 30px;
    color: #155861;
    }

    .about-description {
    font-size: 35px;
    color: #666;
    max-width: 1500px;
    margin: 40px auto 85px;
    line-height: 1.6;
    }

    /* About Wrapper with Image and Text */
    .about-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 1750px;
    margin: 40px auto;
    gap: 40px;
    }

    /* Image Section Styling */
    .about-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    }

    .about-image img {
    max-width: 100%;
    height: auto;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    /* Mission and Vision Styling */
    .mission-vision-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    }

    .mission-section, .vision-section {
    margin-bottom: 35px;
    padding: 30px 40px;
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    }

    .mission-section h3, .vision-section h3 {
    font-size: 36px;
    color: #3498db;
    margin-bottom: 20px;
    }

    .mission-text, .vision-text {
    font-size: 30px;
    color: #333;
    line-height: 1.7;
    text-align: justify;
    }

    .mission-section {
    background: linear-gradient(135deg, #f0f9ff, #cbebff); /* Subtle blue gradient */
    }

    .vision-section {
    background: linear-gradient(135deg, #fff4e6, #ffe3b3); /* Subtle orange gradient */
    }

    .gallery {
    text-align: center;
    padding: 50px 20px;
    background-color: #f9f9f9;
    }

    .gallery h2 {
    font-size: 48px; /* Title size for gallery */
    margin-bottom: 30px;
    color: #155861;
    }

    .gallery-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 2050px;
    margin: 0 auto;
    }

    .gallery-item {
    margin: 10px; /* Add more space between items */
    text-align: center;
    flex: 0 0 calc(33.3333% - 40px); /* 3 items per row */
    box-sizing: border-box; /* Ensure padding/margin are included in width */
    }

    .gallery-item img {
    width: 100%; /* Responsive images */
    height: auto;
    border-radius: 10px;
    max-height: 450px; /* Increased maximum image height */
    }

    .gallery-item p {
    margin-top: 15px;
    font-size: 24px; /* Larger font size for package titles */
    color: #333;
    font-weight: light; /* Make the text bold for better readability */
    padding-bottom: 10px; /* Add space below the text */
    }

    /* Trusted Section */
    .trusted-section {
    display: flex;
    padding: 50px;
    background-color: white;
    }

    .image-container {
    flex: 1;
    margin-right: 50px;
    }

    .image-container img {
    width: 100%;
    height: auto;
    border-radius: 10px;
    }

    .text-content {
    flex: 1;
    }

    .text-content h2 {
    font-size: 36px;
    margin-bottom: 20px;
    }

    .text-content p {
    font-size: 16px;
    line-height: 1.6;
    }

    .explore-section {
      padding: 50px 20px;
      background-color: #f4f4f4;
      text-align: center;
    }

    .explore-section h2 {
      font-size: 3.5em;
      margin-bottom: 50px;
      margin-top: 40px;
      color: #333;
    }

    .explore-description p {
      font-size: 1.5em;
      color: #555;
      line-height: 1.6;
      max-width: 1450px;
      margin: 0 auto 20px;
    }


    /* Footer Styles */
    .footer {
    background-color: #155861;
    color: white;
    padding: 40px 20px;
    text-align: center;
    }

    .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1350px;
    margin: 0 auto;
    padding-bottom: 20px;
    }

    /* Logo and Description */
    .footer-logo-desc {
    flex: 0 0 30%;
    text-align: left;
    }

    .footer-logo {
    width: 200px; /* Increased logo size */
    height: auto;
    margin-bottom: 5px;
    }

    .footer-logo-desc p {
    font-size: 24px;
    }

    /* Contact Information */
    .footer-contact {
    flex: 0 0 30%;
    text-align: left;
    }

    .footer-contact h3 {
    font-size: 35px; /* Larger text for heading */
    margin-bottom: 25px;
    }

    .footer-contact p {
    font-size: 28px; /* Larger text for contact details */
    margin: 5px 0;
    }

    /* Social Media Section */
    .footer-social {
    flex: 0 0 30%;
    text-align: left;
    }

    .footer-social h3 {
    font-size: 35px; /* Larger text for heading */
    margin-bottom: 15px;
    }

    .footer-social a {
    font-size: 22px; /* Larger text for links */
    margin-bottom: 5px;
    display: block;
    color: #ffffff;
    text-decoration: none;
    }

    .footer-social a:hover {
    text-decoration: underline;
    }

    .footer-bottom {
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .footer-bottom p {
    font-size: 25px;
    color: #e1e1e1;
    }

    /* Media Queries */
    @media (max-width: 768px) {
    header {
        flex-direction: column;
        padding: 20px;
    }
    .gallery-item {
        flex: 0 0 calc(50% - 20px); /* 2 images per row on smaller screens */
    }
    .gallery-item {
        flex: 0 0 100%; /* 1 image per row on extra small screens */
    }
    nav ul {
        margin-top: 20px;
    }

    .hero h1 {
        font-size: 36px;
    }

    .trusted-section {
        flex-direction: column;
    }

    .image-container {
        margin-right: 0;
        margin-bottom: 30px;
    }

    .about-wrapper {
        flex-direction: column;
    }

    .about-image {
        margin-bottom: 30px; /* Add margin for smaller screens */
    }

    .about-image img {
        border-radius: 15px 15px 0 0;
    }

    .about-text-wrapper {
        border-radius: 0 0 15px 15px;
    }

    .about-us h2 {
        font-size: 36px; /* Adjust title size on small screens */
    }

    .about-description {
        font-size: 18px; /* Adjust description text size */
    }

    .about-text p {
        font-size: 18px; /* Adjust paragraph text size */
    }
    }

    html {
    scroll-behavior: smooth;
    }

</style>
  