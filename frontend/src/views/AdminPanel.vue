<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="logo-section">
        <img src="/src/img/logoforRMs.png" alt="RM Travel Logo" class="logo-icon" />
        <h1 class="logo-text">TravelHub</h1>
      </div>

      <nav class="nav-menu">
        <div v-for="section in menuSections" :key="section.title" class="menu-section">
          <div class="section-title">{{ section.title }}</div>
          <template v-for="item in section.items" :key="item.name">
            <div v-if="item.children" class="nav-item-wrapper">
              <div @click="toggleDropdown(item.name)" class="nav-item">
                <component :is="item.icon" class="nav-icon" />
                <span>{{ item.name }}</span>
                <ChevronDown 
                  class="dropdown-icon" 
                  :class="{ 'rotate-180': openDropdown === item.name }"
                  :size="16"
                />
              </div>
              <div v-show="openDropdown === item.name" class="dropdown-menu">
                <router-link
                  v-for="child in item.children"
                  :key="child.path"
                  :to="child.path"
                  class="nav-item child-item"
                  :class="{ 'active': $route.path === child.path }"
                >
                  {{ child.name }}
                </router-link>
              </div>
            </div>
            <router-link
              v-else
              :to="item.path"
              class="nav-item"
              :class="{ 'active': $route.path === item.path }"
            >
              <component :is="item.icon" class="nav-icon" />
              <span>{{ item.name }}</span>
            </router-link>
          </template>
        </div>

      </nav>
    </aside>

    <div class="main-wrapper">
      
      <main class="content-body">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  BookOpenCheck,
  Package,
  Activity,
  Users,
  Building2,
  CalendarCheck,
  UserCircle,
  MessageSquare,
  LogOut,
  ChevronDown
} from 'lucide-vue-next'

const route = useRoute()
const currentPageTitle = computed(() => route.meta.title || '')

const menuSections = [
  {
    title: 'MAIN',
    items: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    title: 'MANAGEMENT',
    items: [
      { name: 'Logbook', path: '/admin/logbook', icon: BookOpenCheck },
      { 
        name: 'Packages', 
        icon: Package, 
        children: [
          { name: 'All Packages', path: '/admin/packages' },
          { name: 'Package Options', path: '/admin/options' }
        ]
      },
      { name: 'Activities', path: '/admin/activities', icon: Activity },
      { name: 'Staffs', path: '/admin/staffs', icon: Users },
      { name: 'Hotels', path: '/admin/hotels', icon: Building2 },
      { name: 'Booking', path: '/admin/booking', icon: CalendarCheck },
      { name: 'Guest', path: '/admin/guest', icon: UserCircle },
      { name: 'Feedback', path: '/admin/feedback', icon: MessageSquare }
    ]
  },
  {
    title: 'OTHER',
    items: [
      { name: 'Logout', path: '/login', icon: LogOut }
    ]
  }
]

const openDropdown = ref(null)

const toggleDropdown = (itemName) => {
  if (openDropdown.value === itemName) {
    openDropdown.value = null
  } else {
    openDropdown.value = itemName
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.admin-layout {
  font-family: 'Poppins', sans-serif;
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #f8fafc;
}

.sidebar {
  width: 282px;
  background-color: #0a8d88;
  margin: 1rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0 2rem 0.75rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.logo-text {
  font-size: 2rem;
  font-weight: 600;
  color: white;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  padding: 0.5rem 0.75rem;
  letter-spacing: 0.05em;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.5rem 0.75rem 0.75rem;
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin: 0.125rem 0;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.nav-item:hover {
  background-color: #f1f5f9;
  color: #545454;
}

.nav-item.active {
  background-color: #e0f2fe;
  color: #545454
}



.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 1rem 1rem 1rem 0;
}

.content-header {
  background-color: white;
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.content-body {
  flex: 1;
  overflow-y: auto;
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Custom scrollbar styling */
.sidebar::-webkit-scrollbar,
.content-body::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track,
.content-body::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb,
.content-body::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 2px;
}

/* Ensure the layout takes up full viewport */
:root {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.nav-item-wrapper {
  display: flex;
  flex-direction: column;
}

.dropdown-icon {
  margin-left: auto;
  transition: transform 0.3s ease;
  width: 16px;
  height: 16px;
}

.dropdown-menu {
  margin-left: 2.5rem;
}

.child-item {
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>

