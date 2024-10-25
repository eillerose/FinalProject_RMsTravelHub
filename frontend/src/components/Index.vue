<template>
    <div class="landing-page">
      <header>
        <div class="logo">RM's Travel and Tours</div>
        <nav>
          <ul>
            <li><a href="#hero">Home</a></li>
            <li><a href="#about-us">About</a></li>
            <li><a href="#gallery">Gallery</a></li>
          </ul>
          <div class="auth-buttons">
            <button class="sign-in">Sign In</button>
            <button class="sign-up">Sign Up</button>
          </div>
        </nav>
      </header>
      <main>
        <section id="hero" class="hero">
          <h1>Discover the wonders of Puerto Galera!</h1>
          <p>More Exciting Deals are waiting for you!</p>
          <div class="search-bar">
            <input type="text" placeholder="What are you looking for?">
            <button>Search</button>
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
                <img src="/src/img/logoforRMs.jpg" alt="RM's Travel and Tours">
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


        <section id="gallery" class="gallery">
            <h2>Explore Puerto Galera's Gem</h2>
            <div class="gallery-container">
            <div class="gallery-item">
                <img src="/src/img/APLAYANG MUNTIAPLAYANG MUNTI.jpg" alt="Tour Package 1">
                <p>Beach Hopping Tour</p>
            </div>
            <div class="gallery-item">
                <img src="/src/img/VIEWING DECK.jpg" alt="Tour Package 3">
                <p>Inland Tour</p>
            </div>
            <div class="gallery-item">
                <img src="/src/img/White Beach.jpg" alt="Tour Package 4">
                <p>Water Sports Activities</p>
            </div>
            <div class="gallery-item">
                <img src="/src/img/MUELLE CULTURAL.jpg" alt="Tour Package 2">
                <p>Snorkeling Adventure</p>
            </div>
            <div class="gallery-item">
                <img src="/src/img/Tamaraw-Falls-1.jpg" alt="Tour Package 4">
                <p>Water Sports Activities</p>
            </div>
            <div class="gallery-item">
                <img src="/src/img/white-beach-2-1024x576.jpg" alt="Tour Package 4">
                <p>Water Sports Activities</p>
            </div>
            <div class="gallery-item">
                <img src="/src/img/sunset-at-aninuan-beach.jpg" alt="Tour Package 4">
                <p>Water Sports Activities</p>
            </div>
            <div class="gallery-item">
                <img src="/src/img/global-flyboarding-2.webp" alt="Tour Package 4">
                <p>Water Sports Activities</p>
            </div>
            <div class="gallery-item">
                <img src="/src/img/para-sailing.jpg" alt="Tour Package 4">
                <p>Water Sports Activities</p>
            </div>
            <div class="gallery-item">
                <img src="/src/img/jetski.jpg" alt="Tour Package 4">
                <p>Water Sports Activities</p>
            </div>

            </div>
        </section>

        <!-- Footer Section -->
        <footer class="footer">
        <div class="footer-content">
            <!-- Logo and Description Section -->
            <div class="footer-logo-desc">
                <img src="/src/img/logoforRMs.jpg" alt="RM's Travel and Tours Logo" class="footer-logo">
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
  
  <script setup>
  // No changes in script block needed for now
  </script>
  