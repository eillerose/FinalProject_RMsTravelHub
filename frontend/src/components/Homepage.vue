<template>
    <div class="home-page">
        <HeaderComponent />
        
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
          <h2>Little words about us</h2>
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
        </section>

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
  
<script>
  import HeaderComponent from './Header.vue';
  
  export default {
    components: {
      HeaderComponent,
    },

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
        padding: 10px 0; /* Padding for consistent spacing */
        text-transform: uppercase; /* Capitalize the text */
        text-align: left; /* Align the text to the left */
    }

    .profile .dropdown li a:hover {
        background-color: #f0f0f0; /* Optional hover effect */
    }

    .profile {
        margin-right: 20px; /* Add right margin to move the box away from the right edge */
    }

    .arrow {
        margin-left: 5px; /* Adjust spacing as needed */
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
    font-family: 'Poppins', sans-serif;
    font-size: 55px; 
    margin-bottom: 20px;
    }

    .hero p {
    font-family: 'Poppins', sans-serif;
    font-size: 28px; 
    margin-bottom: 40px;
    }

    .search-bar {
  display: flex;
  width: 100%;
  max-width: 600px; 
  }

  .search-bar input {
  font-family: 'Poppins', sans-serif;
  flex-grow: 1;
  padding: 10px; 
  font-size: 20px;
  border: none;
  border-radius: 5px 0 0 5px;
  }

  .search-bar button {
  font-family: 'Poppins', sans-serif;    
  padding: 10px 20px; 
  font-size: 20px;
  background-color: #64b8b1;
  color: white;
  border: none;
  border-radius: 0 3px 3px 0;
  cursor: pointer;
  }

  .search-bar button:hover {
  background-color: #2c3e50;
  }

    .about-us {
    padding: 4rem 2rem;
    background-color: #ffffff;
    max-width: 800px;
    margin: 0 auto;
    }

    .about-us h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    text-align: center;
    }

    .about-us p {
    margin-bottom: 1rem;
    line-height: 1.6;
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


    /* Media Queries */
    @media (max-width: 768px) {
    header {
        flex-direction: column;
        padding: 20px;
    }
    nav ul {
        margin-top: 20px;
    }

    .hero h1 {
        font-size: 36px;
    }
    }

    html {
    scroll-behavior: smooth;
    }

</style>
  
