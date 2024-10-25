<template>
  <div id="app">
    <Index />
  </div>
</template>

<script setup>
import Index from './components/Index.vue'; // Adjust the path as necessary based on your project structure
</script>

<style>
/* Global styles */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f0f0f0; /* Light gray background */
  color: #333; /* Dark gray text */
}

/* Centering the app container */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Full height of the viewport */
}

/* Header styles */
header {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

/* Main content styles */
main {
  flex: 1; /* Takes the remaining space */
  padding: 20px; /* Padding around main content */
}

/* Responsive design */
@media (max-width: 768px) {
  header {
    padding: 10px; /* Adjust header padding for smaller screens */
  }

  main {
    padding: 10px; /* Adjust main padding for smaller screens */
  }
}
</style>
