<template>
  <div class="admin-layout">
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
    </aside>

    <div class="main-wrapper">
      <header class="content-header">
        <h1 class="page-title">{{ currentPageTitle }}</h1>
      </header>
      <main class="content-body">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentPageTitle = computed(() => route.meta.title || '')

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'Logbook', path: '/admin/logbook' },
  { name: 'Packages', path: '/admin/packages' },
  { name: 'Staffs', path: '/admin/staffs' },
  { name: 'Hotels', path: '/admin/hotels' },
  { name: 'Assign', path: '/admin/assign' },
  { name: 'Guest', path: '/admin/guest' },
  { name: 'Feedback', path: '/admin/feedback' },
  { name: 'Logout', path: '/login' },
]
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}

.sidebar {
  width: 210px;
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

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  background-color: white;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.content-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background-color: rgba(31, 61, 105, 0.26);
}

/* Custom scrollbar styling */
.sidebar::-webkit-scrollbar,
.content-body::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track,
.content-body::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb,
.content-body::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.content-body::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
}

/* Ensure the layout takes up full viewport */
:root {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>