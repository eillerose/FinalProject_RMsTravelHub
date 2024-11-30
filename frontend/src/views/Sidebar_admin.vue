<template>
  <aside class="sidebar">
    <div class="admin-profile">
      <div class="admin-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h2 class="admin-title">ADMIN</h2>
    </div>
    
    <nav class="nav-menu">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ 'active': $route.path === item.path }"
      >
        {{ item.name }}
      </router-link>
    </nav>

    <div class="settings-container">
      <button @click="toggleSettings" class="settings-button">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      <transition name="fade">
        <div v-if="showSettings" class="settings-popover">
          <button @click="manageAccount" class="settings-option">Manage Account</button>
          <button @click="customizeProfile" class="settings-option">Customize Profile</button>
          <button @click="logout" class="settings-option">Logout</button>
        </div>
      </transition>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'Logbook', path: '/admin/logbook' },
  { name: 'Packages', path: '/admin/packages' },
  { name: 'Staffs', path: '/admin/staffs' },
  { name: 'Assign', path: '/admin/assign' },
  { name: 'Guest', path: '/admin/guest' },
  { name: 'Feedback', path: '/admin/feedback' },
]

const showSettings = ref(false)

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const manageAccount = () => {
  console.log('Manage Account clicked')
  // Implement manage account functionality
}

const customizeProfile = () => {
  console.log('Customize Profile clicked')
  // Implement customize profile functionality
}

const logout = () => {
  console.log('Logout clicked')
  // Implement logout functionality
}

const handleOutsideClick = (event) => {
  if (!event.target.closest('.settings-container')) {
    showSettings.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #6182b5;
  color: white;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;
}

.admin-profile {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.admin-avatar {
  width: 48px;
  height: 48px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.admin-avatar svg {
  color: #6b7f9e;
}

.admin-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  flex-grow: 1;
}

.nav-item {
  padding: 0.75rem 1rem;
  color: white;
  text-decoration: none;
  transition: background-color 0.2s ease;
  border-radius: 0.25rem;
  font-weight: 500;
}

.nav-item:hover,
.nav-item.active {
  background-color: #5a6d8a;
}

.settings-container {
  position: relative;
  margin-top: auto;
}

.settings-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.75rem 1rem;
  width: 100%;
  text-align: left;
  transition: background-color 0.2s ease;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
}

.settings-button:hover {
  background-color: #5a6d8a;
}

.settings-button svg {
  margin-right: 0.5rem;
}

.settings-popover {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border-radius: 0.25rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.settings-option {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.settings-option:hover {
  background-color: #f0f0f0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar styling */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
</style>