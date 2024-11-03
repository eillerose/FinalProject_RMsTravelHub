<template>
    <div class="home-page">
        <HeaderComponent />
        
      <main>
        <section id="hero" class="hero">
          <h1>Discover Puerto Galera!</h1>
          <p class="subtitle">Make Your Tour Amazing With Us</p>
          <p class="description">Explore the beauty of Puerto Galera with customized tours, breathtaking sights, and unforgettable experiences. Let us be your guide to a journey of a lifetime!</p>
          
          <!-- Button to view packages -->
          <button @click="goToPackages" class="btn-primary">Explore Our Packages</button>
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
    background-image: url('/src/img/heroBg.jpg');
    background-size: cover;
    background-position: center;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    margin-left: -18px;
    margin-right: -18px;
    padding: 0 20px;
    }


  .hero h1 {
    font-size: 3rem;
    font-weight: bold;
    margin: 0 0 20px;
  }

  .subtitle {
    font-size: 1.5rem;
    margin: 0 0 20px;
    color: #f0e68c; /* Optional color to make the subtitle pop */
  }

  .description {
    font-size: 1.2rem;
    margin-bottom: 40px;
    max-width: 600px;
    color: #dcdcdc;
  }

  .btn-primary {
    padding: 10px 20px;
    font-size: 1.1rem;
    color: #fff;
    background-color: #ff8c00; /* Orange color */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .btn-primary:hover {
    background-color: #ffa500; /* Lighter orange on hover */
  }

  .btn-primary:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(255, 140, 0, 0.8);
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
  
