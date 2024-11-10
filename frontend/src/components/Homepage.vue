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

      <section id="about-us" class="about-us">
        <h2>Little words about us</h2>
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
      </section>
    </main>
    <FooterComponent />
  </div>
</template>


<script>
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
  
  function goToPackages() {
    router.push('/packages'); // Adjust '/packages' based on your route
  }

  return {
    goToPackages,
  };
  },
};

</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Ephesis&display=swap');


  .about-us {
  padding: 4rem 2rem;
  background-color: #ffffff;
  max-width: 800px;
  margin: 0 auto;
  }

  .about-us h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
  }

  .about-us p {
  margin-bottom: 1rem;
  line-height: 1.6;
  }
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

.about-us h2{
  font-weight: bold;
  font-size: 2rem;
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
  }

  html {
  scroll-behavior: smooth;
  }

</style>