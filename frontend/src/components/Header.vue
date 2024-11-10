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
          <li><router-link to="/packages">Packages</router-link></li>

          <!-- About Us Dropdown -->
          <li
            class="dropdown-container"
            @mouseenter="openDropdown('aboutus')"
            @mouseleave="closeDropdown('aboutus')"
          >
            <router-link to="/aboutus">About Us</router-link>
            <ul v-if="dropdownOpen === 'aboutus'" class="dropdown-menu">
              <li><router-link to="/tour-guide">Tour Guide</router-link></li>
              <li><router-link to="/feedback">Feedback</router-link></li>
            </ul>
          </li>

          <!-- Services Dropdown -->
          <li
            class="dropdown-container"
            @mouseenter="openDropdown('services')"
            @mouseleave="closeDropdown('services')"
          >
            <a href="#" @click.prevent>Services</a>
            <ul v-if="dropdownOpen === 'services'" class="dropdown-menu">
              <li><router-link to="/hotel">Hotel</router-link></li>
              <li><router-link to="/activities">Activities</router-link></li>
            </ul>
          </li>

          <!-- Conditionally Render Book Now Link -->
          <li v-if="canAccessBooking"><router-link to="/booking">Book Now</router-link></li>
          <li><router-link to="/contactus">Contact Us</router-link></li>

          <!-- Profile Dropdown (Click to Open/Close) -->
          <li class="profile">
            <a href="#" @click="toggleProfileDropdown">
              <span class="material-icons profile-icon">person</span>
            </a>
            <ul v-if="isProfileDropdownOpen" class="dropdown">
              <li><router-link to="/edit-profile">Profile</router-link></li>
              <li><a href="#" @click.prevent="logout">Logout</a></li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const dropdownOpen = ref(null);
const isProfileDropdownOpen = ref(false);
// const canAccessBooking = ref(true); // or set based on your logic

// Open dropdown based on identifier
const openDropdown = (menu) => {
  dropdownOpen.value = menu;
};

// Close dropdown
const closeDropdown = (menu) => {
  if (dropdownOpen.value === menu) {
    dropdownOpen.value = null;
  }
};

// Toggle profile dropdown
const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
};

// Close profile dropdown if clicked outside
const handleClickOutside = (event) => {
  const profileDropdown = document.querySelector('.profile');
  if (profileDropdown && !profileDropdown.contains(event.target)) {
    isProfileDropdownOpen.value = false;
  }
};

// Attach click outside listener on mount
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.home-page {
  font-family: 'Poppins', sans-serif;
  color: #333;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 15px;
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
  margin-left: 1rem;
}

.logo-image {
  margin-right: 8px;
  max-height: 40px;
}

.logo-text {
  font-size: 25px;
  font-weight: 600;
  color: black;
}

nav ul {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
  gap: 12px;
}

nav ul li {
  position: relative;
  margin: 0 12px;
  cursor: pointer;
  font-size: 16px;
  color: black;
  transition: color 0.3s ease;
}

nav ul li a {
  color: black;
  text-decoration: none;
  transition: color 0.3s ease;
}

nav ul li:hover a {
  color: gray;
}

nav ul li::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: gray;
  transition: width 0.3s ease;
}

nav ul li:hover::after {
  width: 100%;
}

/* Dropdown styling */
.dropdown-container {
  position: relative;
}

.dropdown-menu {
  display: block;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 150px;
  padding: 5px 0;
}

.dropdown-menu li {
  list-style: none;
  padding: 8px 16px;
  text-align: left;
}

.dropdown-menu li a {
  display: block;
  color: #3498db;
  text-decoration: none;
  padding: 5px 0;
}

/* Profile dropdown */
.profile {
  margin-right: 12px;
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
  width: 150px;
  padding: 10px 0;
}

.profile .dropdown li {
  list-style: none;
  padding: 8px 16px;
  text-align: left;
}

.profile .dropdown li a {
  display: block;
  color: black;
  text-decoration: none;
}

.material-icons.profile-icon {
  font-size: 24px;
  color: black;
  vertical-align: middle;
  cursor: pointer;
}
</style>