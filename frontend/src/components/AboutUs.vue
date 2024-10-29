<template>
  <div class="about-us">
    <HeaderComponent />
    <main>
      <section class="hero">
        <h1>ABOUT US</h1>
        <p>Your Gateway to Unforgettable Adventures in Puerto Galera</p>
      </section>

      <section class="logo-mission-vision">
        <div class="logo">
          <img src="/src/img/logoforRMs.png?height=200&width=200" alt="RM's Travel and Tours Logo">
        </div>
        <div class="mission-vision">
          <div class="mission">
            <h2>Our Mission</h2>
            <p>To provide exceptional travel experiences that showcase the beauty of Puerto Galera while promoting sustainable tourism and supporting local communities.</p>
          </div>
          <div class="vision">
            <h2>Our Vision</h2>
            <p>To be the leading travel agency in Puerto Galera, known for our commitment to customer satisfaction, environmental stewardship, and innovative tour packages.</p>
          </div>
        </div>
      </section>

      <section class="why-choose-us">
        <h2>Why Plan Your Travel With Us?</h2>
        <div class="reasons">
          <div class="reason">
            <h3>Local Expertise</h3>
            <p>Our team of local experts knows Puerto Galera inside out, ensuring you get the most authentic experience.</p>
          </div>
          <div class="reason">
            <h3>Customized Packages</h3>
            <p>We tailor our tours to meet your specific needs and preferences, creating unforgettable memories.</p>
          </div>
          <div class="reason">
            <h3>Sustainable Tourism</h3>
            <p>We're committed to preserving Puerto Galera's natural beauty through responsible tourism practices.</p>
          </div>
          <div class="reason">
            <h3>24/7 Support</h3>
            <p>Our dedicated team is always available to assist you throughout your journey.</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import HeaderComponent from './Header.vue';

export default {
  components: {
    HeaderComponent,
  },
};
</script>

<style scoped>
.about-us {
  font-family: 'Poppins', sans-serif;
  color: #333;
  line-height: 1.6;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.hero {
  background-image: url('/src/img/hero-bg.jpg'); /* Replace with the path to your background image */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  padding: 60px 20px;
  margin-bottom: 40px;
  color: white; 
  position: relative;
  margin-left: -10rem;
  margin-right: -10rem;
}


.hero::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  z-index: 1;
}

.hero h1,
.hero p {
  position: relative;
  z-index: 2; 
}

.hero h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.hero p {
  font-size: 1.2em;
}

.logo-mission-vision {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.logo {
  flex: 1;
  text-align: center;
}

.logo img {
  max-width: 100%;
  height: auto;
}

.mission-vision {
  flex: 2;
  padding-left: 40px;
}

.mission,
.vision {
  margin-bottom: 20px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.why-choose-us {
  background-color: #f8f9fa;
  padding: 40px;
  border-radius: 8px;
}

.why-choose-us h2 {
  text-align: center;
  margin-bottom: 30px;
}

.reasons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.reason {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.reason h3 {
  color: #3498db;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .logo-mission-vision {
    flex-direction: column;
  }

  .mission-vision {
    padding-left: 0;
    margin-top: 20px;
  }

  .reasons {
    grid-template-columns: 1fr;
  }
}
</style>
