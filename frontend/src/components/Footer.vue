<template>
    <footer class="footer">
      <div class="footer-content">
        <!-- Company Info Section -->
        <div class="footer-section">
          <div class="company-info">
            <h2>RM's Travel and Tours</h2>
            <div class="social-links">
              <a href="mailto:info@rmstravelandtours.com" class="social-icon">
                <i class="fas fa-envelope"></i>
              </a>
              <a href="https://facebook.com" class="social-icon">
                <i class="fab fa-facebook-f"></i>
              </a>
            </div>
          </div>
        </div>
  
        <!-- About Us Section -->
        <div class="footer-section">
          <h3>About Us</h3>
          <p>RM's Travel and Tours is your gateway to unforgettable adventures in Puerto Galera and beyond.</p>
        </div>
  
        <!-- Quick Links Section -->
        <div class="footer-section">
          <h3>Quick Link</h3>
          <ul class="quick-links">
            <li><router-link to="/home">Home</router-link></li>
            <li><router-link to="/packages">Packages</router-link></li>
            <li><router-link to="/about">About Us</router-link></li>
            <li><router-link to="/feedback">Feedback</router-link></li>
            <li><router-link to="/contact">Contact Us</router-link></li>
          </ul>
        </div>
  
        <!-- Contact Info Section -->
        <div class="footer-section">
          <h3>Contact Info</h3>
          <div class="contact-info">
            <p>Email: info@rmstravelandtours.com</p>
            <p>Phone: +63 123 456 7890</p>
            <p>Address: Puerto Galera, Oriental Mindoro, Philippines</p>
          </div>
        </div>
      </div>
  
      <!-- Copyright Section -->
      <div class="copyright">
        <p>&copy; 2023 RM's Travel and Tours. All rights reserved.</p>
      </div>
    </footer>
  </template>
  
  <script setup>
  // No additional script needed for this component
  </script>
  
  <style scoped>
  .footer {
    background-color: #1B4D4B;
    color: white;
    padding: 40px 0 0 0;
    font-family: 'Poppins', sans-serif;
  }
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    padding: 0 20px;
  }
  
  .footer-section {
    display: flex;
    flex-direction: column;
  }
  
  .footer-section h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: white;
  }
  
  .footer-section h3 {
    font-size: 20px;
    margin-bottom: 15px;
    color: white;
  }
  
  .company-info {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .social-links {
    display: flex;
    gap: 15px;
  }
  
  .social-icon {
    color: white;
    font-size: 20px;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .social-icon:hover {
    color: #64b8b1;
  }
  
  .quick-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .quick-links li {
    margin-bottom: 10px;
  }
  
  .quick-links a {
    color: white;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .quick-links a:hover {
    color: #64b8b1;
  }
  
  .contact-info p {
    margin-bottom: 10px;
    font-size: 14px;
  }
  
  .copyright {
    text-align: center;
    padding: 20px;
    margin-top: 40px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  /* Responsive Design */
  @media (max-width: 1024px) {
    .footer-content {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .footer-content {
      grid-template-columns: 1fr;
      gap: 30px;
    }
  
    .footer-section {
      text-align: center;
    }
  
    .social-links {
      justify-content: center;
    }
  }
  </style>