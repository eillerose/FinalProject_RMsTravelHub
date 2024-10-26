<template>
    <div class="home-page">
      <header>
        <div class="logo">
          <img src="/src/img/logoforRMs.png" alt="RM's Travel and Tours Logo" class="logo-image">
          <span class="logo-text">RM's Travel and Tours</span>
        </div>
        <nav>
          <ul>
            <li><router-link to="/home">Home</router-link></li>
            <li><router-link to="/aboutus">About Us</router-link></li>
            <li><router-link to="/packages">Packages</router-link></li>
            <li><router-link to="/feedback">Feedback</router-link></li>
            <li><router-link to="/contactus">Contact Us</router-link></li>
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
    </div>
</template>

<script>
  import { auth } from '../firebaseConfig';
  
  export default {
    data() {
      return {
        isDropdownOpen: false,
        profileImage: '/path/to/default-profile.png', // Placeholder for profile image
      };
    },
    methods: {
      toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
      },
      async logout() {
        await auth.signOut();
        this.$router.push('/login');
      }
    },
    created() {
      const user = auth.currentUser;
      if (user) {
        this.profileImage = user.photoURL || '/path/to/default-profile.png';
      }
    }
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

</style>