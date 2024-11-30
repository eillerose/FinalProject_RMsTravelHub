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
              We simply want to get you going on a trip of a lifetime!
            </p>
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
          title: 'Bayanan Beach',
          description: 'A serene escape with crystal-clear waters and powdery white sands, perfect for relaxation.',
          image: '/src/img/bayananBeach.jpg'
        },
        {
          id: 2,
          title: 'Haligi Beach',
          description: 'A tranquil spot boasting pristine shores and breathtaking sunset views.',
          image: '/src/img/haligiBeach.jpg'
        },
        {
          id: 3,
          title: 'Bulabod Beach',
          description: 'A hidden gem featuring unspoiled beauty and calm waters ideal for swimming.',
          image: '/src/img/bulabodBeach.jpg'
        }
      ],
      Activities: [
        {
          id: 4,
          title: 'Underwater Cave',
          description: 'Explore a mystical underwater wonder with fascinating rock formations and marine life.',
          image: '/src/img/underwaterCave.jpg'
        },
        {
          id: 5,
          title: 'Parasailing',
          description: 'Experience the thrill of flying over the sea, taking in panoramic island views.',
          image: '/src/img/parasailing.jpg'
        },
        {
          id: 6,
          title: 'Flying Fish',
          description: 'Experience an adrenaline-pumping ride as you glide and bounce across the waves.',
          image: '/src/img/flyingFish.jpg'
        }
      ],
      'Tourist Spots': [
        {
          id: 7,
          title: 'Tamaraw Falls',
          description: 'A majestic cascading waterfall surrounded by lush greenery, perfect for nature lovers.',
          image: '/src/img/tamarawFalls.jpg'
        },
        {
          id: 8,
          title: 'White Beach',
          description: 'A lively destination known for its vibrant nightlife, fine sands, and water sports.',
          image: '/src/img/whiteBeach.jpg'
        },
        {
          id: 9,
          title: 'Mangrove Walkway',
          description: 'A peaceful stroll through a mangrove forest teeming with wildlife and scenic beauty.',
          image: '/src/img/mangroveWalkway.jpg'
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

.hero {
  position: relative;
  height: 88vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  overflow: hidden;
  margin-left:1rem;
  margin-right:1.5rem;
  margin-top: 4.4rem;
  margin-bottom: 2rem;
  border-radius: 20px;
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

.best-deals {
  padding: 4rem 2rem;
  background-color: #ffffff;
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
  margin-top: -10rem;
  margin-bottom: 0.5rem;
}

.deals-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  color: #666;
  margin-top: -0.5rem;
  margin-bottom: 2rem;
}

.category-buttons {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-bottom: 2rem;
}

.category-btn {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  padding: 0.4rem 1.5rem;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn.active {
  background-color: #048dad;
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
  padding: 4rem 2rem;
  background-color: #f8f9fa;
  text-align: center;
}

.about-us .container {
  max-width: 800px;
  margin: 0 auto;
}

.about-us .section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
}

.about-us .content {
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
}

.about-us .content p {
  margin-bottom: 1rem;
}

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
}

html {
  scroll-behavior: smooth;
}
</style>

