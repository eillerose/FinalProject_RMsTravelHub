<template>
    <div class="home-page">
      <header>
        <img src="/src/img/logoforRMs.png" alt="Logo" class="logo" />
        <h1>Welcome to RM's Travel and Tours</h1>
        <p>Your adventure starts here! Discover amazing tours and activities tailored just for you.</p>
      </header>
  
      <nav class="nav-links">
        <router-link to="/about">About Us</router-link>
        <router-link to="/services">Our Services</router-link>
        <router-link to="/contact">Contact</router-link>
        <router-link to="/booking">Book Now</router-link>
      </nav>
  
      <section class="featured-tours">
        <h2>Featured Tours</h2>
        <p>Explore our most popular destinations and experiences.</p>
        <!-- Add featured tour components or images here -->
      </section>
  
      <section class="services">
        <h2>Our Services</h2>
        <p>From guided tours to customizable travel packages, we have something for everyone.</p>
        <!-- Add service details here -->
      </section>
  
      <footer>
        <p>&copy; 2024 RM's Travel and Tours. All rights reserved.</p>
        <p>Follow us on:
          <a href="https://facebook.com">Facebook</a> | 
          <a href="https://instagram.com">Instagram</a>
        </p>
      </footer>
    </div>
  </template>
  
  <script setup>
  // Import any necessary components or data here
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
  
  .home-page {
    font-family: 'Poppins', sans-serif;
    text-align: center;
    padding: 2rem;
  }
  
  .logo {
    width: 150px;
    margin: 0 auto;
    display: block;
  }
  
  header {
    margin-bottom: 2rem;
  }
  
  h1 {
    font-size: 2.5rem;
    color: #155861;
  }
  
  p {
    font-size: 1.25rem;
    color: #4d696d;
  }
  
  .nav-links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin: 1rem 0;
  }
  
  .nav-links a {
    color: #155861;
    text-decoration: none;
    font-size: 1.25rem;
    transition: color 0.3s;
  }
  
  .nav-links a:hover {
    color: #4d696d;
  }
  
  .featured-tours, .services {
    margin-top: 2rem;
    padding: 2rem 0;
  }
  
  .featured-tours h2, .services h2 {
    color: #155861;
    font-size: 2rem;
  }
  
  footer {
    margin-top: 2rem;
    font-size: 1rem;
    color: #4d696d;
  }
  footer a {
    color: #155861;
    text-decoration: none;
  }
  
  footer a:hover {
    text-decoration: underline;
  }
  </style>
  