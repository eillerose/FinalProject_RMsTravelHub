<template>
  <div class="about-us">
    <HeaderComponent />
    <div class="banner">
      <h1>About Us</h1>
      <p>Your Gateway to Unforgettable Adventures in Puerto Galera</p>
    </div>

    <!-- New Team Section -->
    <section class="team-section">
      <h2 class="team-title">OUR TEAM</h2>
      <div class="title-underline"></div>

      <div class="team-grid">
        <div class="team-card">
          <div class="card-background blue"></div>
          <div class="card-content">
            <div class="profile-image-container">
              <img src="/src/img/team1.jpg" alt="Lena Pearce" class="profile-image">
            </div>
            <h3>Lena Pearce</h3>
            <p class="position">position</p>
            <p class="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            </p>
          </div>
        </div>

        <div class="team-card">
          <div class="card-background green"></div>
          <div class="card-content">
            <div class="profile-image-container">
              <img src="/src/img/team2.jpg" alt="Sophia Bach" class="profile-image">
            </div>
            <h3>Sophia Bach</h3>
            <p class="position">position</p>
            <p class="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            </p>
          </div>
        </div>

        <div class="team-card">
          <div class="card-background teal"></div>
          <div class="card-content">
            <div class="profile-image-container">
              <img src="/src/img/team3.jpg" alt="Arielle Copper" class="profile-image">
            </div>
            <h3>Arielle Copper</h3>
            <p class="position">position</p>
            <p class="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            </p>
          </div>
        </div>

        <!-- New team card -->
        <div class="team-card">
          <div class="card-background orange"></div>
          <div class="card-content">
            <div class="profile-image-container">
              <img src="/src/img/team4.jpg" alt="Alex Johnson" class="profile-image">
            </div>
            <h3>Alex Johnson</h3>
            <p class="position">position</p>
            <p class="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="about-section">
      <div class="cards-container">
        <div class="card vision-card">
          <h2>Our Vision</h2>
          <p>To be the leading innovators in Puerto Galera's tourism, offering unparalleled beach experiences that create lasting memories.</p>
        </div>

        <div class="card mission-card">
          <h2>Our Mission</h2>
          <p>To deliver exceptional, personalized beach adventures that showcase Puerto Galera's natural beauty while promoting sustainable tourism.</p>
        </div>

        <div class="card description-card">
          <p>At RM's Travel and Tours, we're passionate about sharing the wonders of Puerto Galera's pristine beaches and vibrant marine life. Our team of local experts is dedicated to crafting unforgettable experiences that connect you with the heart of our tropical paradise.</p>
        </div>
      </div>
    </div>

    <section class="why-choose-us">
      <h2>Why Plan Your Travel With Us?</h2>
      <div class="reasons">
        <div class="reason" v-for="(reason, index) in reasons" :key="index">
          <span class="material-symbols-outlined icon">{{ reason.icon }}</span>
          <h3>{{ reason.title }}</h3>
          <p>{{ reason.description }}</p>
        </div>
      </div>
    </section>
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HeaderComponent from './Header.vue';
import FooterComponent from './Footer.vue';

const reasons = ref([
  {
    icon: 'pin_drop',
    title: 'Local Expertise',
    description: 'Our team of local experts knows Puerto Galera inside out, ensuring you get the most authentic experience.'
  },
  {
    icon: 'package',
    title: 'Customized Packages',
    description: 'We tailor our tours to meet your specific needs and preferences, creating unforgettable memories.'
  },
  {
    icon: 'eco',
    title: 'Sustainable Tourism',
    description: 'We\'re committed to preserving Puerto Galera\'s natural beauty through responsible tourism practices.'
  },
  {
    icon: 'support_agent',
    title: '24/7 Support',
    description: 'Our dedicated team is always available to assist you throughout your journey.'
  }
]);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0');

.about-us {
  font-family: 'Poppins', sans-serif;
  background-color: white;
  min-height: 100vh;
}

.banner {
  width: 98%;
  background-image: url('/src/img/heroBg.jpg');
  background-size: cover;
  background-position: center;
  text-align: center;
  color: #fff;
  padding: 0 20px;
  height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.banner h1 {
  font-size: 4rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.banner p {
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 1rem;
}

.about-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  position: relative;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.vision-card, .mission-card {
  max-width: 600px;
  margin: 0 auto;
}

.description-card {
  grid-column: 1 / -1;
  max-width: 900px;
  margin: 0 auto;
}

.card h2 {
  color: #00A3C4;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.card p {
  color: #4A5568;
  line-height: 1.8;
  font-size: 1.1rem;
}

.why-choose-us {
  background-color: #caf0f8;
  padding: 60px;
  border-radius: 8px;
  text-align: center;
  margin: 4rem 5%;
}

.why-choose-us h2 {
  text-align: center;
  margin-bottom: 5rem;
  font-size: 3rem;
  font-weight: bold;
  color: black;
}

.reasons {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  margin-bottom: 4rem;
}

.reason {
  position: relative;
  background-color: #f8f9fa;
  padding: 40px 20px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  max-width: 300px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.reason:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  outline: 2px solid #219ebc;
  outline-offset: -4px;
}

.reason .icon {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 40px;
  color: #219ebc;
  background-color: #fff;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.reason h3 {
  color: black;
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 25px;
}

.reason p {
  color: #555;
  font-size: 1rem;
  line-height: 1.3;
}

/* Team Section Styles */
.team-section {
  padding: 80px 20px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}

.team-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.title-underline {
  width: 100px;
  height: 4px;
  background: linear-gradient(to right, #00A3C4, #4CAF50);
  margin: 0 auto 2rem;
  border-radius: 2px;
}

.team-description {
  max-width: 600px;
  margin: 0 auto 4rem;
  color: #666;
  line-height: 1.6;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 0 20px;
}

.team-card {
  position: relative;
  height: 300px;
  perspective: 1000px;
}

.card-background {
  position: absolute;
  top: 40px;
  left: 20px;
  right: 20px;
  bottom: 0;
  border-radius: 20px;
  transform: rotate(-4deg);
  z-index: 1;
}

.card-background.blue {
  background-color: #00A3C4;
}

.card-background.green {
  background-color: #4CAF50;
}

.card-background.teal {
  background-color: #009688;
}

.card-background.orange {
  background-color: #FF9800;
}

.card-content {
  position: relative;
  background: white;
  padding: 30px 20px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-image-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: -80px auto 20px;
  border: 5px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-card h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.position {
  color: #666;
  font-style: italic;
  margin-bottom: 1rem;
}

.description {
  color: #777;
  line-height: 1.6;
  font-size: 0.9rem;
}

@media (max-width: 1200px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .about-section {
    padding: 2rem 1rem;
  }

  .cards-container {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 1.5rem;
  }

  .card h2 {
    font-size: 1.5rem;
  }

  .card p {
    font-size: 1rem;
  }

  .why-choose-us {
    padding: 40px 20px;
  }

  .why-choose-us h2 {
    font-size: 2rem;
    margin-bottom: 3rem;
  }

  .reasons {
    gap: 40px;
  }

  .reason {
    width: 100%;
    max-width: none;
  }

  .team-grid {
    grid-template-columns: 1fr;
    gap: 4rem;
  }

  .team-title {
    font-size: 2rem;
  }

  .team-description {
    padding: 0 20px;
  }
}
</style>