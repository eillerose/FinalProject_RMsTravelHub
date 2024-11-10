<template>
  <div>
    <!-- Integrating the Header component at the top -->
    <HeaderComponent />

    <!-- Hotel Page Content -->
    <div class="hotel-page">
      <!-- Hero Section -->
      <div class="hero-section">
        <h1>Two things you should try in</h1>
        <h2>HOTEL</h2>
      </div>

      <div class="hotels-container">
        <!-- Hotel Card for Agbing Seaside View Resort -->
        <div class="hotel-card">
          <div class="hotel-image">
            <img src="/src/img/Agbing Seaside View Resort.jpg" alt="Agbing Seaside View Resort" />
          </div>
          <div class="hotel-info">
            <h3>Agbing Seaside View Resort</h3>
            <p>Escape to paradise at Agbing Seaside View Resort...</p>
            <button @click="showDetails('agbing')" class="view-details-btn">
              View Details
            </button>
          </div>
        </div>

        <!-- Hotel Card for Luckeh 5J Beach Resort -->
        <div class="hotel-card">
          <div class="hotel-image">
            <img src="/src/img/Luckeh 5J Beach Resort.jpg" alt="Luckeh 5J Beach Resort" />
          </div>
          <div class="hotel-info">
            <h3>Luckeh 5J Beach Resort</h3>
            <p>Discover the serenity of White Beach...</p>
            <button @click="showDetails('luckeh')" class="view-details-btn">
              View Details
            </button>
          </div>
        </div>
      </div>

      <!-- Details Section for Agbing Seaside View Resort -->
      <div class="details-section" v-if="selectedHotel === 'agbing'">
        <h4>DETAILS - Agbing Seaside View Resort</h4>
        <div class="details-container">
          <div class="details-content">
              <div class="image-gallery">
                  <button @click="closeDetails" class="close-btn">&times;</button>
                  <h5>Gallery</h5>
                  <div class="gallery-grid">
                  <img v-for="image in agbingImages" :src="image" :alt="`Image of Agbing Resort`" />
                  </div>
              </div>
            <div class="details-header">
              <h3>Agbing Seaside View Resort</h3>
            </div>
            <div class="details-grid">
              <h3>Escape to Paradise</h3>
              <p>
                Escape to paradise at Agbing Seaside View Resort. Discover the beauty of
                crystal-clear waters and white sandy beaches while enjoying top-notch accommodations
                and exceptional hospitality.
              </p>
              <div class="contact-info">
                <h4>Contact Us</h4>
                <p>Phone: 0917 795 3899</p>
                <p>Email: <a href="mailto:Agbingseaside@gmail.com">Agbingseaside@gmail.com</a></p>
                <p>Facebook: <a href="https://web.facebook.com/Agbingseasideview" target="_blank">web.facebook.com/Agbingseasideview</a></p>
              </div>
              <div class="additional-info">
                <h4>About Us</h4>
                <p>FB Page · Agbing Seaside View Resort </p>
                <p>Location: White Beach, Puerto Galera, Philippines</p>
              </div>
            </div>
            <div class="amenities">
              <h5>Amenities</h5>
              <ul>
                <li>Free WiFi</li>
                <li>Beachfront Access</li>
                <li>Swimming Pool</li>
                <li>Cable TV</li>
                <li>RestoBar</li>
                <li>Airconditioned</li>
              </ul>
            </div>
            <div class="rooms">
              <h5>Available Rooms</h5>
              <ul>
                <li>Standard room (2 pax)</li>
                <li>Deluxe room (4 pax)</li>
                <li>Super deluxe room (5 pax)</li>
                <li>Barkada room (10 pax)</li>
                <li>Family room (6 pax)</li>
                <li>Family room with kitchen (6 pax)</li>
                <li>Barkada/Family room with kitchen (14 pax)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Section for Luckeh 5J Beach Resort -->
      <div class="details-section" v-if="selectedHotel === 'luckeh'">
        <h4>DETAILS - Luckeh 5J Beach Resort</h4>
        <div class="details-container">
          <div class="details-content">
              <div class="image-gallery">
                  <button @click="closeDetails" class="close-btn">&times;</button>
              <h5>Gallery</h5>
              <div class="gallery-grid">
              <img v-for="image in luckehImages" :src="image" :alt="`Image of Luckeh Resort`" />
              </div>
          </div>
            <div class="details-header">
              <h3>Luckeh 5J Beach Resort</h3>
            </div>
            <div class="details-grid">
              <h3>Experience Serenity</h3>
              <p>
                Located at White Beach, Puerto Galera, Luckeh 5J Beach Resort offers a
                perfect getaway with beautiful surroundings, water sports, and comfortable rooms.
              </p>
              <div class="contact-info">
                <h4>Contact Us</h4>
                <p>Phone: 0917 898 7323</p>
                <p>Email: <a href="mailto:luckeh5j@gmail.com">luckeh5j@gmail.com</a></p>
                <p>Website: <a href="https://luckeh5j.com" target="_blank">luckeh5j.com</a></p>
              </div>
              <div class="additional-info">
                <h4>About Us</h4>
                <p>Beach Resort · Luxury Stay</p>
                <p>Location: White Beach, Puerto Galera, Philippines</p>
              </div>
            </div>
            <!-- <div class="amenities">
              <h5>Amenities</h5>
              <ul>
                <li>Beachfront</li>
                <li>Water Sports</li>
                <li>Bar</li>
                <li>Restaurant</li>
                <li>Room Service</li>
              </ul>
            </div> -->

          </div>
        </div>
      </div>
    </div>

    <!-- Integrating the Footer component at the bottom -->
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
      selectedHotel: null, // Track the selected hotel for details view
    };
  },
  methods: {
    showDetails(hotel) {
      this.selectedHotel = hotel;
    },
    closeDetails() {
      this.selectedHotel = null;
    },
  },

  data() {
      return {
          selectedHotel: null,
          agbingImages: [
          "/src/img/AgbingFront.jpg",
          "/src/img/AgbingRoom1.jpg",
          "/src/img/AgbingRoom2.jpg"
          ],
          luckehImages: [
          "/src/img/LuckehFront.jpg",
          "/src/img/LuckehRoom1.jpg",
          "/src/img/LuckehRoom2.jpg"
          ],
      };
  }

};
</script>


<style scoped>
/* Styles for the entire hotel page */
.hotel-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20px;
}

.hero-section {
  text-align: center;
  padding: 40px 0;
  color: #333;
}

.hero-section h1 {
  font-size: 24px;
  font-weight: normal;
  margin: 0;
}

.hero-section h2 {
  font-size: 36px;
  margin: 10px 0;
}

.hotels-container {
  max-width: 1200px;
  margin: 0 auto;
}

.hotel-card {
  display: flex;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.hotel-image {
  width: 200px;
  flex-shrink: 0;
}

.hotel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hotel-info {
  padding: 20px;
  flex-grow: 1;
}

.hotel-info h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.hotel-info p {
  margin: 0 0 15px 0;
  color: #666;
}

.view-details-btn {
  background-color: white;
  border: 2px solid #333;
  color: #333;
  padding: 8px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-details-btn:hover {
  background-color: #333;
  color: white;
}

.details-section {
  margin-top: 40px;
}

.details-section h4 {
  color: #333;
  margin-bottom: 20px;
}

.details-container {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  margin-left: 1550px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.detail-item h5 {
  color: #666;
  margin: 0 0 5px 0;
}

.detail-item p {
  color: #333;
  margin: 0;
  font-weight: bold;
}

.amenities {
  margin-bottom: 30px;
}

.amenities h5 {
  color: #000000;
  margin: 0 0 10px 0;
}

/* .amenities ul {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.amenities li {
  color: #333;
} */

.book-now-btn {
  background-color: #333;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.book-now-btn:hover {
  background-color: #555;
}
.image-gallery {
margin-top: 20px;
}

.gallery-grid {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
gap: 10px;
}

.gallery-grid img {
width: 100%;
height: 100px;
object-fit: cover;
border-radius: 5px;
cursor: pointer;
}


@media (max-width: 768px) {
  .hotel-card {
    flex-direction: column;
  }

  .hotel-image {
    width: 100%;
    height: 200px;
  }

  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .amenities ul {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>