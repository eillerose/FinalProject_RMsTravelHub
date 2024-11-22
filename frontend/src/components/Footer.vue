<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- About Us Section -->
      <div class="footer-section">
        <h3>About Us</h3>
        <p>RM's Travel and Tours is your gateway to unforgettable adventures in Puerto Galera and beyond.</p>
      </div>
  
      <!-- Quick Links Section -->
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
    
      <!-- Contact Info Section -->
      <div class="footer-section">
        <h3>Contact Info</h3>
        <p>info@rmstravelandtours.com</p>
        <p>+63 123 456 7890</p>
        <p>Puerto Galera, Oriental Mindoro, Philippines</p>
      </div>

      <!-- Follow Us Section -->
      <div class="footer-section">
        <h3>Follow Us</h3>
        <div class="social-icons">
          <a href="#" class="social-icon" aria-label="Facebook">Facebook</a>
          <a href="#" class="social-icon" aria-label="Instagram">Instagram</a>
          <a href="#" class="social-icon" aria-label="Twitter">Twitter</a>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      © {{ new Date().getFullYear() }} RM's Travel and Tours. All rights reserved.
    </div>
  </footer>
</template>

<script setup>
// No additional script needed
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://fonts.googleapis.com/css2?family=Ephesis&display=swap');

.footer {
  font-family: 'Poppins', sans-serif;
  background-color: #013240;
  color: #ffffff;
  padding: 4rem 2rem 2rem;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section {
  flex: 0;
  min-width: 250px;
  gap: 5rem;
}

h3 {
  color: #2ec4b6;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  position: relative;
}

h3::after {
  content: '';
  display: block;
  width: 50px;
  height: 2px;
  background-color: #ffd700;
  margin-top: 0.5rem;
}

p, ul {
  font-size: 1rem;
  line-height: 1.5;
}

ul {
  list-style-type: none;
  padding: 0;
}

a {
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #ffd700;
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.social-icon:hover {
  background-color: #ffd700;
  color: #1a3f5c;
}

.footer-bottom {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
  }

  .footer-section {
    margin-bottom: 2rem;
  }
}
</style>