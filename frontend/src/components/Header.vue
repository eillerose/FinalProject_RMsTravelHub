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
          <li><router-link to="/booking">Book Now</router-link></li>
          <li><router-link to="/contactus">Contact Us</router-link></li>
          <li class="profile">
            <a href="#" @click="toggleDropdown">
              <span class="material-icons profile-icon">person</span>
            </a>           
            <ul v-if="isDropdownOpen" class="dropdown">
              <li><router-link to="/edit-profile">Profile</router-link></li>
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
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

    .home-page {
        font-family: 'Poppins', sans-serif;
        color: #333;
    }

    header {
        font-family: 'Poppins', sans-serif;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 15px;
        background-color: white; 
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000; 
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
    }

    .logo {
        display: flex;
        align-items: center; 
    }

    .logo-image {
        margin-right: 8px;
        max-height: 35px; /* Reduced height for a smaller logo */
    }

    .logo-text {
        font-size: 16px; /* Slightly smaller font */
        font-weight: 600;
        color: #333; 
    }

    nav {
        display: flex;
        align-items: center;
    }

    nav ul {
        display: flex;
        list-style-type: none;
        padding: 0;
        margin: 0;
        gap: 12px;
    }

    nav ul li {
        font-family: 'Poppins', sans-serif;
        position: relative;
        margin: 0 12px; 
        cursor: pointer;
        font-size: 15px; 
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
        display: block;
        position: absolute;
        top: 150%; 
        right: 0;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        width: 150px; /* Adjusted width for a more compact dropdown */
        padding: 5px 0;
    }

    .profile .dropdown li {
        list-style: none;
        padding: 8px 16px;
        text-align: left;
        display: block;
    }

    .profile .dropdown li a {
        display: block;
        color: #3498db;
        text-decoration: none;
        padding: 5px 0;
        text-transform: uppercase;
        text-align: left;
    }

    .profile {
        margin-right: 12px; /* Reduced margin for a more compact header */
    }

    .material-icons.profile-icon {
        font-size: 24px; /* Smaller icon size */
        color: #155861;
        vertical-align: middle;
        cursor: pointer;
    }
</style>
