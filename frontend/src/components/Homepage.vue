<template>
  <div class="home-page">
    <HeaderComponent />

    <main>
      <section id="hero" class="hero">
        <!-- Video background -->
        <video autoplay muted loop class="hero-video">
          <source src="/src/video/heroVideo.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>

        <div class="hero-content">
          <h1>Discover <span>Puerto Galera!</span></h1>
          <p class="subtitle">Make Your Tour Amazing With Us</p>
          <p class="description">Explore the beauty of Puerto Galera with customized tours, breathtaking sights, and unforgettable experiences. Let us be your guide to a journey of a lifetime!</p>

          <!-- Button to view packages -->
          <button @click="goToPackages" class="btn-primary">Explore Our Packages</button>
        </div>
      </section>

      <section id="best-deals" class="best-deals">
        <h2>RM's Travel and Tours Best Deals</h2>
        <p class="deals-subtitle">Unforgettable experiences await you in this tropical paradise</p>
        
        <div class="category-buttons">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="setActiveCategory(category)"
            :class="['category-btn', { active: activeCategory === category }]"
          >
            {{ category }}
          </button>
        </div>

        <div class="deals-carousel">
          <button class="nav-btn prev" @click="previousSlide">
            <span class="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          
          <div class="deals-wrapper">
            <div class="deals-container" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div v-for="deal in currentDeals" :key="deal.id" class="deal-card">
                <img :src="deal.image" :alt="deal.title">
                <h3>{{ deal.title }}</h3>
                <p>{{ deal.description }}</p>
              </div>
            </div>
          </div>

          <button class="nav-btn next" @click="nextSlide">
            <span class="material-symbols-outlined">arrow_forward_ios</span>
          </button>
        </div>
      </section>


      
      <section id="about-us" class="about-us">
    <div class="container">
      <h2 class="section-title">Little words about us</h2>
      <div class="content">
        <p>
          At RM's Travel and Tours, we grant each and every adventurer a personalized experience like no other.
          We are aficionados coming from every part of Puerto Galera, passionate about guiding you through this
          pocket of paradise we call home.
        </p>
        <p>
          We hold strong the value of being factual. Our tour operators are with you every step through your
          booking process, we are there to scratch every inch of curiosity and enquiry that you may have.
          We simply want to get you going on a trip of a lifetime.
        </p>
      </div>
      <div class="features">
        <div class="feature">
          <div class="icon-wrapper blue">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3>Personalized</h3>
          <p>Tailored experiences for every traveler</p>
        </div>
        <div class="feature">
          <div class="icon-wrapper green">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3>Local Expertise</h3>
          <p>Guides with deep local knowledge</p>
        </div>
        <div class="feature">
          <div class="icon-wrapper yellow">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3>Unforgettable</h3>
          <p>Creating memories that last a lifetime</p>
        </div>
      </div>
    </div>
  </section>

    </main>
    <FooterComponent />
  </div>
</template>


<script>
import { ref, computed } from 'vue';
import HeaderComponent from './Header.vue';
import FooterComponent from './Footer.vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    HeaderComponent,
    FooterComponent,
  },

  setup() {
    const router = useRouter();
    const activeCategory = ref('Beaches');
    const currentSlide = ref(0);
    const categories = ['Beaches', 'Activities', 'Tourist Spots'];

    const deals = {
      Beaches: [
        {
          id: 1,
          title: 'White Beach Getaway',
          description: 'Relax on the soft, white sand, swim in the turquoise waters, and enjoy breathtaking sunsets in this tropical paradise',
          image: '/src/img/White Beach.jpg'
        },
        {
          id: 2,
          title: 'Talipanan Beach Escape',
          description: 'Experience the serenity of this less-crowded beach with its pristine shoreline and crystal-clear waters',
          image: '/src/img/White Beach.jpg'
        },
        {
          id: 3,
          title: 'Sabang Beach Adventure',
          description: 'Dive into excitement at this vibrant beach known for its water sports and lively atmosphere',
          image: '/src/img/White Beach.jpg'
        }
      ],
      Activities: [
        {
          id: 4,
          title: 'Scuba Diving Experience',
          description: 'Explore the vibrant underwater world with professional diving instructors',
          image: '/src/img/White Beach.jpg'
        },
        {
          id: 5,
          title: 'Island Hopping Tour',
          description: 'Visit multiple scenic islands and hidden coves in one exciting day',
          image: '/src/img/White Beach.jpg'
        },
        {
          id: 6,
          title: 'Sunset Sailing',
          description: 'Enjoy a peaceful evening sail while watching the stunning sunset',
          image: '/src/img/White Beach.jpg'
        }
      ],
      'Tourist Spots': [
        {
          id: 7,
          title: 'Tamaraw Falls',
          description: 'Visit the majestic waterfall and enjoy the natural swimming pools',
          image: '/src/img/White Beach.jpg'
        },
        {
          id: 8,
          title: 'Puerto Galera Church',
          description: 'Explore the historic church and learn about local culture',
          image: '/src/img/White Beach.jpg'
        },
        {
          id: 9,
          title: 'Mangyan Village',
          description: 'Experience the indigenous culture and traditional crafts',
          image: '/src/img/White Beach.jpg'
        }
      ]
    };

    const currentDeals = computed(() => deals[activeCategory.value]);

    function setActiveCategory(category) {
      activeCategory.value = category;
      currentSlide.value = 0;
    }

    function nextSlide() {
      const nextCategoryIndex = (categories.indexOf(activeCategory.value) + 1) % categories.length;
      activeCategory.value = categories[nextCategoryIndex];
      currentSlide.value = 0;
    }

    function previousSlide() {
      const prevCategoryIndex = (categories.indexOf(activeCategory.value) - 1 + categories.length) % categories.length;
      activeCategory.value = categories[prevCategoryIndex];
      currentSlide.value = 0;
    }

    function goToPackages() {
      router.push('/packages');
    }

    return {
      activeCategory,
      categories,
      currentDeals,
      currentSlide,
      setActiveCategory,
      nextSlide,
      previousSlide,
      goToPackages,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Ephesis&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0');

/* Existing styles */
.hero {
  position: relative;
  height: 98vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  overflow: hidden;
}

.hero-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-family: 'Poppins', sans-serif;
  font-size: 70px;
  margin-bottom: 5px;
}

.subtitle {
  font-family: 'Ephesis', cursive;
  font-size: 3rem;
  margin: 0 0 10px;
  color: white;
}

.description {
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  margin-bottom: 40px;
  max-width: 800px;
  color: white;
}

.btn-primary {
  font-family: 'Poppins', sans-serif;
  padding: 15px 25px;
  font-size: 1.1rem;
  color: #fff;
  background-color: #2ec4b6;
  border: 2px solid white;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Best Deals Section Styles */
.best-deals {
  padding: 4rem 2rem;
  background-color: #f5f5f5;
  text-align: center;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.best-deals h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 3rem;
  color: #333;
  margin-top: -1rem;
  margin-bottom: 0.5rem;
}

.deals-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  color: #666;
  margin-top: -0.5rem;
  margin-bottom: 2rem;
}

.category-buttons {
  display: flex;
  justify-content: center;
  gap: 6rem;
  margin-bottom: 2rem;
}

.category-btn {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn.active {
  background-color: #2ec4b6;
  color: white;
}

.deals-carousel {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.deals-wrapper {
  overflow: hidden;
}

.deals-container {
  display: flex;
  transition: transform 0.5s ease;
}

.deal-card {
  flex: 0 0 calc(33.333% - 2rem);
  margin: 0 1rem;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.deal-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.deal-card h3 {
  font-family: 'Poppins', sans-serif;
  font-size: 1.25rem;
  color: #333;
  margin: 1rem 0 0.5rem;
  padding: 0 1rem;
}

.deal-card p {
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  padding: 0 1rem 1rem;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-btn:hover {
  background: #2ec4b6;
  color: white;
}

.nav-btn.prev {
  left: -20px;
}

.nav-btn.next {
  right: -20px;
}

.nav-btn .material-symbols-outlined {
  font-size: 24px;
}

.about-us {
  background-color: #ffffff;
  padding: 4rem 1rem;
  font-family: 'Poppins', sans-serif;
}

.container {
  max-width: 64rem;
  margin: 0 auto;
}

.section-title {
  font-size: 3rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
}

.content {
  margin-bottom: 3rem;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
}

.content p {
  font-size: 1.125rem;
  color: #4b5563;
  line-height: 1.75;
  margin-bottom: 1.5rem;
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.feature {
  text-align: center;
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.icon-wrapper {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 2rem;
  height: 2rem;
}

.blue {
  background-color: #dbeafe;
}

.blue .icon {
  color: #3b82f6;
}

.green {
  background-color: #d1fae5;
}

.green .icon {
  color: #10b981;
}

.yellow {
  background-color: #fef3c7;
}

.yellow .icon {
  color: #f59e0b;
}

.feature h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.feature p {
  color: #4b5563;
}

/* Media Queries */
@media (max-width: 768px) {
  header {
    flex-direction: column;
    padding: 20px;
  }
  
  nav ul {
    margin-top: 20px;
  }

  .hero h1 {
    font-size: 36px;
  }

  .deal-card {
    flex: 0 0 100%;
    margin: 0 0 1rem;
  }

  .category-buttons {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .category-btn {
    width: 100%;
  }

  .nav-btn {
    display: none;
  }

  .features {
    flex-direction: column;
    align-items: center;
  }

  .feature {
    max-width: 100%;
  }
}

html {
  scroll-behavior: smooth;
}
</style>