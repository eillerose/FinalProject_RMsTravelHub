<template>
  <div class="about-us">
    <HeaderComponent />
    <div class="banner">
      <h1>About Us</h1>
      <p>Your Gateway to Unforgettable Adventures in Puerto Galera</p>
    </div>


    <section id="about-us" class="about-us">
        <p class="about-description">
          At RM's Travel and Tours, we grant each and every adventurer a personalized experience like no other. We are aficionados coming from every part of Puerto Galera, passionate about guiding you through this pocket of paradise we call home.
        </p>
        <div class="about-wrapper">
          <div class="about-image">
            <img src="/src/img/aboutUs.jpg" alt="Beautiful Beach">
          </div>
          <div class="mission-vision-wrapper">
            <div class="vision-section hover-card">
              <h3>Our Vision</h3>
              <p>To be innovators, leaders, and creatives in travel concepts, positioning our agency as one of the best tourism agencies in Puerto Galera, recognized for professionalism and high-quality service.</p>
            </div>
            <div class="mission-section hover-card">
              <h3>Our Mission</h3>
              <p>To deliver excellent service to our clients with unforgettable travel experiences that exceed expectations. Our goal is to become "Your Preferred Travel Agency," providing satisfaction and the best value for your trip.</p>
            </div>
          </div>
        </div>
      </section>

    <!-- Team Section -->
    <section class="team-section">
      <h2 class="team-title">Our Team</h2>
      <div class="title-underline"></div>
      <p class="team-description">
        At RM's Travel and Tours, as locals of Puerto Galera, we take pride in sharing the beauty and adventure of our home with you. With extensive knowledge 
        of the area and a shared love for travel, our team is committed to making your trip unforgettable.
      </p>

      <div class="team-grid">
        <div class="team-card">
          <div class="card-background blue"></div>
          <div class="card-content">
            <div class="profile-image-container">
              <img src="/src/img/team1.jpg" alt="Rizalie L. Tupas" class="profile-image">
            </div>
            <h3>Rizalie L. Tupas</h3>
            <p class="position">Owner</p>
          </div>
        </div>

        <div class="team-card">
          <div class="card-background green"></div>
          <div class="card-content">
            <div class="profile-image-container">
              <img src="/src/img/team2.jpg" alt="Sophia Bach" class="profile-image">
            </div>
            <h3>Mark T. Manzano</h3>
            <p class="position">Owner</p>
          </div>
        </div>

        <div class="team-card">
          <div class="card-background teal"></div>
          <div class="card-content">
            <div class="profile-image-container">
              <img src="/src/img/team3.jpg" alt="Gene Juliet L. Tupas" class="profile-image">
            </div>
            <h3>Gene Juliet L. Tupas</h3>
            <p class="position">Staff</p>
          </div>
        </div>

        <div class="team-card">
          <div class="card-background orange"></div>
          <div class="card-content">
            <div class="profile-image-container">
              <img src="/src/img/team4.jpg" alt="Marcus Reid" class="profile-image">
            </div>
            <h3>Marcus Reid</h3>
            <p class="position">Staff</p>
          </div>
        </div>
      </div>
    </section>

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
  max-width: 2000px;
  min-height: 100vh;
}

.banner {
  width: 100%;
  background-color: #013240;
  background-size: cover;
  background-position: center;
  text-align: center;
  color: #fff;
  padding: 0 20px;
  height: 25.5vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: -3rem;
  margin-left: -1.25rem;
}

.banner h1 {
  color: #ffffff;
    font-size: 4rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.banner p {
  font-size: 18px;
  margin-top: -2rem;
  margin-bottom: 1rem;
}

/* About Us Section */
.about-us {
  text-align: center;
  padding: 4rem 1.25rem;
  background-color: white;
  margin-bottom: -20rem;
}

.about-us h2 {
  font-size: 2.5rem;
  margin-bottom: 1.25rem;
  color: #111827;
}

.about-description {
  font-size: 1.125rem;
  color: #4B5563;
  max-width: 800px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;
}

.about-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2.5rem;
}

.about-image {
  flex: 1;
}

.about-image img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mission-vision-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.hover-card {
  padding: 1.25rem;
  background-color: #f0f7f4;
  border-radius: 0.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hover-card h3 {
  font-size: 1.5rem;
  color: #111827;
  margin-bottom: 0.625rem;
}

.hover-card p {
  font-size: 1rem;
  color: #4B5563;
  line-height: 1.6;
}

.team-section {
  padding: 80px 20px;
  text-align: center;
  max-width: 1500px;
  margin: 0 auto;
}

.team-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.team-description {
  max-width: 900px;
  margin: 0 auto 4rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 8rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  padding: 0 20px;
}

.team-card {
  position: relative;
  height: 200px;
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
  border: 5px solid #0a8d88;
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

.why-choose-us {
  background-color: #f0f7f4;
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

@media (max-width: 768px) {
  .about-section {
    padding: 2rem 1rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .image-section {
    margin-bottom: 2rem;
  }

  .about-title {
    font-size: 2rem;
  }

  .about-description {
    font-size: 1rem;
    padding: 0 1rem;
  }

  .vision-box,
  .mission-box {
    padding: 1.5rem;
  }

  .vision-box h2,
  .mission-box h2 {
    font-size: 1.5rem;
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
}
</style>