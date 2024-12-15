<template>
  <header class="header">
    <div class="container">
      <!-- Logo Section -->
      <div class="logo">
        <img src="/src/img/logoforRMs.png" alt="RM's Travel and Tours Logo" class="logo-image">
        <span class="logo-text">RM's Travel and Tours</span>
      </div>

      <!-- Navigation -->
      <nav class="nav">
        <ul class="nav-list">
          <li><router-link to="/home">Home</router-link></li>
          
          <!-- About Us Dropdown -->
          <li class="dropdown-container" @mouseenter="openDropdown('aboutus')" @mouseleave="closeDropdown">
            <router-link to="/aboutus" class="dropdown-trigger">
              About Us
              <ChevronDown class="icon" :class="{ 'rotate': dropdownOpen === 'aboutus' }" />
            </router-link>
            <transition name="fade">
              <ul v-if="dropdownOpen === 'aboutus'" class="dropdown-menu">
                <li><router-link to="/tour-guide">Tour Guide</router-link></li>
                <li><router-link to="/feedback">Feedback</router-link></li>
              </ul>
            </transition>
          </li>
          
          <!-- Services Dropdown -->
          <li class="dropdown-container" @mouseenter="openDropdown('services')" @mouseleave="closeDropdown">
            <a href="#" @click.prevent class="dropdown-trigger">
              Services
              <ChevronDown class="icon" :class="{ 'rotate': dropdownOpen === 'services' }" />
            </a>
            <transition name="fade">
              <ul v-if="dropdownOpen === 'services'" class="dropdown-menu">
                <li><router-link to="/packages">Packages</router-link></li>
                <li><router-link to="/hotel">Hotel</router-link></li>
                <li><router-link to="/activities">Activities</router-link></li>
              </ul>
            </transition>
          </li>
          
          <li><router-link to="/booking">Book Now</router-link></li>
          <li><router-link to="/contactus">Contact Us</router-link></li>
        </ul>
      </nav>

      <!-- Profile Section -->
      <div class="profile-section">
        <button class="profile-button" @click="toggleProfileDropdown">
          <User class="profile-icon" />
        </button>
        <transition name="fade">
          <ul v-if="isProfileDropdownOpen" class="profile-dropdown">
            <li>
              <router-link to="/edit-profile">
                <span class="material-icons">person</span>
                Profile
              </router-link>
            </li>
            <li>
              <a href="#" @click.prevent="logout">
                <span class="material-icons">logout</span>
                Logout
              </a>
            </li>
          </ul>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebaseConfig'
import { ChevronDown, User } from 'lucide-vue-next'

const router = useRouter()
const dropdownOpen = ref(null)
const isProfileDropdownOpen = ref(false)

const openDropdown = (menu) => {
  dropdownOpen.value = menu
}

const closeDropdown = () => {
  dropdownOpen.value = null
}

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value
}

const logout = async () => {
  try {
    await auth.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.header {
  font-family: 'Poppins', sans-serif;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-image {
  height: 2rem;
  width: auto;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2D3436;
}

.nav-list {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-list a {
  position: relative;
  color: #2D3436;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-list a:hover {
  color: #00b7af;
}

.dropdown-container {
  position: relative;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.icon.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-top: 0.5rem;
  min-width: 160px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  list-style: none;
  padding-left: 0;
  text-align: center;
}

.dropdown-menu a {
  display: block;
  padding: 0.5rem;
  border-radius: 0.25rem;
  text-align: center;
}

.profile-section {
  position: relative;
}

.profile-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.profile-button:hover {
  background-color: rgba(0, 184, 148, 0.1);
}

.profile-icon {
  width: 20px;
  height: 20px;
  color: #2D3436;
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-top: 0.5rem;
  min-width: 120px;
  width: max-content;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  list-style: none;
  padding-left: 0;
  text-align: center;
}

.profile-dropdown a {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: #2D3436;
  text-decoration: none;
  font-size: 0.9rem;
  border-radius: 0.25rem;
  transition: color 0.2s ease;
}

.profile-dropdown a:hover {
  color: #00b7af;
}

.profile-dropdown a:hover .material-icons {
  color: #00b7af;
}

.profile-dropdown .material-icons {
  font-size: 1.2rem;
  transition: color 0.2s ease;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.router-link-active {
  color: #00b7af !important;
}

.nav-list .router-link-active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #00b7af;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .nav-list {
    gap: 1rem;
  }

  .logo-text {
    display: none;
  }
}
</style>

