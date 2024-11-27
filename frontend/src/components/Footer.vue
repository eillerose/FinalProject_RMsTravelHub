<template>
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
  </template>
  
  <script>
  // import HeaderComponent from './Header.vue';
  
  // export default {
  //     components: {
  //         HeaderComponent,
  //     },
  // };
  </script>
  
  <style scoped>
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
  </style>
  