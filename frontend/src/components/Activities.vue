<template>
    <div class="activities-page">
      <HeaderComponent />

      
      <div class="container">
        <h1 class="title">RM's Travel and Tour</h1>
        <h2 class="subtitle">Activities</h2>
        <div class="categories">
          <button 
            v-for="category in categories" 
            :key="category" 
            @click="setActiveCategory(category)"
            :class="['category-button', { active: activeCategory === category }]"
          >
            {{ category }}
          </button>
        </div>
        <div class="activities">
          <div class="activity-cards">
            <div v-for="activity in displayedActivities" :key="activity.name" class="activity-card">
              <img :src="activity.image" :alt="activity.name" class="activity-image" />
              <div class="activity-info">
                <h3 class="activity-title">{{ activity.name }}</h3>
                <p class="activity-description">{{ activity.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  </template>
  
  <script>
  import HeaderComponent from './Header.vue';
  import FooterComponent from './Footer.vue';
  
  export default {
    components: {
      HeaderComponent,
      FooterComponent,
    },
    data() {
      return {
        categories: [
          'All', 'Water Sport', 'Extreme Sport', 'Inland Tour', 'Travel and Tour', 'Beach Hopping', 'Snorkeling'
        ],
        activeCategory: 'All',
        activities: [
          // Water Sport Activities
          { name: 'Jetski', category: 'Water Sport', image: '/src/img/tg1.jpg', description: 'Experience the thrill of speed as you cruise over crystal-clear waters on a powerful jet ski.' },
          { name: 'Parasailing', category: 'Water Sport', image: '/placeholder.svg?height=200&width=300', description: 'Soar high above the ocean for breathtaking views of the coastline.' },
          { name: 'Banana Boat', category: 'Water Sport', image: '/placeholder.svg?height=200&width=300', description: 'Enjoy a fun-filled ride on an inflatable banana-shaped boat.' },
          { name: 'Crazy UFO', category: 'Water Sport', image: '/placeholder.svg?height=200&width=300', description: 'Experience an exhilarating ride on a UFO-shaped inflatable pulled by a speedboat.' },
          { name: 'Flying Fish', category: 'Water Sport', image: '/placeholder.svg?height=200&width=300', description: 'Glide over the water on an inflatable raft towed by a speedboat, feeling like you\'re flying.' },
  
          // Extreme Sport Philippines
          { name: 'Bubble Ball', category: 'Extreme Sport', image: '/placeholder.svg?height=200&width=300', description: 'Play soccer while encased in a giant inflatable bubble for hilarious fun.' },
          { name: 'Archery Tag', category: 'Extreme Sport', image: '/placeholder.svg?height=200&width=300', description: 'Combine archery skills with the excitement of dodgeball in this unique sport.' },
          { name: 'Paint Ball', category: 'Extreme Sport', image: '/placeholder.svg?height=200&width=300', description: 'Engage in strategic team battles with colorful paintball markers.' },
          { name: 'Mudkart', category: 'Extreme Sport', image: '/placeholder.svg?height=200&width=300', description: 'Race through muddy tracks in specially designed karts for a thrilling, messy adventure.' },
          { name: 'Gokart', category: 'Extreme Sport', image: '/placeholder.svg?height=200&width=300', description: 'Test your racing skills on a professional go-kart track.' },
          { name: 'ATV', category: 'Extreme Sport', image: '/placeholder.svg?height=200&width=300', description: 'Navigate rugged terrains on an All-Terrain Vehicle for an adrenaline-pumping experience.' },
          { name: 'Airgun', category: 'Extreme Sport', image: '/placeholder.svg?height=200&width=300', description: 'Practice your marksmanship skills with various airguns in a controlled environment.' },
          { name: 'Crossbow', category: 'Extreme Sport', image: '/placeholder.svg?height=200&width=300', description: 'Channel your inner archer with modern crossbows at our specialized range.' },
          { name: 'Nerf Games', category: 'Extreme Sport', image: '/placeholder.svg?height=200&width=300', description: 'Engage in fun, safe combat games using Nerf blasters in our custom arena.' },
  
          // Inland Tour
          { name: 'Muelle Cultural Heritage Park', category: 'Inland Tour', image: '/placeholder.svg?height=200&width=300', description: 'Explore the rich history and culture of the region at this heritage park.' },
          { name: 'Aplayang Munti', category: 'Inland Tour', image: '/placeholder.svg?height=200&width=300', description: 'Relax on this beautiful beach known for its pristine waters and soft sand.' },
          { name: 'Viewing Deck', category: 'Inland Tour', image: '/placeholder.svg?height=200&width=300', description: 'Enjoy panoramic views of the surrounding landscape from this elevated platform.' },
          { name: 'Infinity Farm', category: 'Inland Tour', image: '/placeholder.svg?height=200&width=300', description: 'Visit a picturesque farm with stunning views and learn about sustainable agriculture.' },
          { name: 'Tamaraw Falls', category: 'Inland Tour', image: '/placeholder.svg?height=200&width=300', description: 'Witness the majestic Tamaraw Falls and take a refreshing dip in its cool waters.' },
          { name: 'Tukuran Falls', category: 'Inland Tour', image: '/placeholder.svg?height=200&width=300', description: 'Hike to the beautiful Tukuran Falls and enjoy its natural beauty.' },
          { name: 'Mangyan Village', category: 'Inland Tour', image: '/placeholder.svg?height=200&width=300', description: 'Experience the culture and traditions of the indigenous Mangyan people.' },
          { name: 'Ponderosa', category: 'Inland Tour', image: '/placeholder.svg?height=200&width=300', description: 'Visit this eco-adventure park for a mix of nature and exciting activities.' },
  
          // Travel and Tours
          { name: 'White Beach', category: 'Travel and Tour', image: '/placeholder.svg?height=200&width=300', description: 'Experience the famous white sand beaches and crystal-clear waters.' },
          { name: 'Mangrove Park', category: 'Travel and Tour', image: '/placeholder.svg?height=200&width=300', description: 'Discover the unique ecosystem of mangrove forests on a guided tour.' },
          { name: 'Bulabod Beach', category: 'Travel and Tour', image: '/placeholder.svg?height=200&width=300', description: 'Enjoy the serene atmosphere of this less crowded, beautiful beach.' },
          { name: 'Aninuan Beach', category: 'Travel and Tour', image: '/placeholder.svg?height=200&width=300', description: 'Explore this tranquil beach known for its black sand and peaceful ambiance.' },
  
          // Beach Hopping
          { name: 'Bayanan Beach', category: 'Beach Hopping', image: '/placeholder.svg?height=200&width=300', description: 'Visit this picturesque beach known for its clear waters and scenic views.' },
          { name: 'Long Beach', category: 'Beach Hopping', image: '/placeholder.svg?height=200&width=300', description: 'Stroll along the expansive shoreline of this beautiful, lengthy beach.' },
          { name: 'Haligi Beach', category: 'Beach Hopping', image: '/placeholder.svg?height=200&width=300', description: 'Discover the unique charm of this hidden gem among local beaches.' },
          { name: 'Boquete Beach', category: 'Beach Hopping', image: '/placeholder.svg?height=200&width=300', description: 'Relax on this secluded beach surrounded by lush vegetation and rocky cliffs.' },
  
          // Snorkeling
          { name: 'Giant Clam Shell', category: 'Snorkeling', image: '/placeholder.svg?height=200&width=300', description: 'Dive and see the impressive giant clam shells in their natural habitat.' },
          { name: 'Under Water Cave', category: 'Snorkeling', image: '/placeholder.svg?height=200&width=300', description: 'Explore mysterious underwater caves teeming with marine life.' },
        ],
      };
    },
    computed: {
      displayedActivities() {
        if (this.activeCategory === 'All') {
          return this.activities;
        }
        return this.activities.filter(activity => activity.category === this.activeCategory);
      }
    },
    methods: {
      setActiveCategory(category) {
        this.activeCategory = category;
      },
    }
  };
  </script>
  
  <style scoped>
  .activities-page {
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 20px;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .subtitle {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .categories {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }
  
  .category-button {
    background-color: #f0f0f0;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .category-button:hover {
    background-color: #d0d0d0;
  }
  
  .category-button.active {
    background-color: #007bff;
    color: white;
  }
  
  .activities {
    display: flex;
    justify-content: center;
  }
  
  .activity-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    max-width: 1200px;
  }
  
  .activity-card {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    text-align: left;
  }
  
  .activity-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .activity-info {
    padding: 10px;
  }
  
  .activity-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .activity-description {
    font-size: 0.9rem;
    color: #555;
  }
  
  @media (max-width: 1200px) {
    .activity-cards {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (max-width: 900px) {
    .activity-cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 600px) {
    .activity-cards {
      grid-template-columns: 1fr;
    }
  }
  </style>
  
  