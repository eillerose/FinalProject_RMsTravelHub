<template>
  <div>
      <HeaderComponent />
      <div class="contact-section">
          <div class="banner">
              <h1>Contact Us</h1>
              <p>We'd love to hear from you! Please reach out to us with any questions, concerns, or feedback.</p>
          </div>
          <div class="main-contact-container">
              <!-- Nested container holding both Get In Touch and Send a Message -->
              <div class="nested-contact-container">
                  <!-- Contact Information -->
                  <div class="contact-info">
                      <h2>Get In Touch</h2>
                      <p>We’re here to answer any questions and help you plan the perfect trip. Reach out to us through the details below:</p>
                      <div class="info-item">
                          <span class="material-symbols-outlined">location_on</span>
                          <div>
                              <label>Address</label>
                              <p>Abing Beach Resort White Beach, San Isidro, Puerto Galera, Oriental Mindoro</p>
                          </div>
                      </div>
                      <div class="info-item">
                          <span class="material-symbols-outlined">call</span>
                          <div>
                              <label>Phone Number</label>
                              <p>0981 723 1043</p>
                          </div>
                      </div>
                      <div class="info-item">
                          <span class="material-symbols-outlined">mail</span>
                          <div>
                              <label>Email</label>
                              <p>travelandtourmm@gmail.com</p>
                          </div>
                      </div>
                  </div>

                  <!-- Contact Form -->
                  <div class="contact-form">
                      <h3>Send a Message</h3>
                      <form @submit.prevent="submitForm">
                          <div class="form-group">
                              <label for="name">Name</label>
                              <input type="text" id="name" v-model="name" placeholder="Enter your name" required />
                          </div>
                          <div class="form-group">
                              <label for="email">Email</label>
                              <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
                          </div>
                          <div class="form-group">
                              <label for="message">Message</label>
                              <textarea id="message" v-model="message" placeholder="Enter your message" required></textarea>
                          </div>
                          <button type="submit">Submit</button>
                      </form>
                  </div>

                  <!-- Embedded Map -->
                  <div class="map-container">
                      <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.6206197409043!2d120.9061!3d13.494531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd732bd5f0f327%3A0x8c488b340f43df7!2sAbing%20Beach%20Resort!5e0!3m2!1sen!2sph!4v0000000000000!5m2!1sen!2sph"
                          width="100%"
                          height="400"
                          style="border:0;"
                          allowfullscreen=""
                          loading="lazy"
                          referrerpolicy="no-referrer-when-downgrade"
                      ></iframe>
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
import { db, setDoc, doc } from '../firebaseConfig'; // Update import path

export default {
  components: {
      HeaderComponent,
      FooterComponent,
  },
  data() {
      return {
          name: '',
          email: '',
          message: '',
      };
  },
  methods: {
      async submitForm() {
          // Logic to handle form submission, such as sending data to Firestore
          try {
              const docRef = await setDoc(doc(db, 'contacts', this.email), {
                  name: this.name,
                  email: this.email,
                  message: this.message,
              });
              alert(`Thank you for your message, ${this.name}! We will get back to you soon.`);
              // Reset form fields
              this.name = '';
              this.email = '';
              this.message = '';
          } catch (error) {
              console.error("Error adding document: ", error);
              alert("There was an error sending your message. Please try again later.");
          }
      },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

.contact-section {
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f5f5;
  padding: 20px;
  min-height: 100vh; /* Ensure it takes up at least the full screen height */
}

.banner {
  font-family: 'Poppins', sans-serif;
  width: 100%;
  background-image: url('/src/img/heroBg.jpg');
  background-size: cover;
  background-position: center;
  text-align: center;
  color: #fff;
  padding: 0 20px;
  height:25vh;
}

.banner h1 {
  font-size: 4rem;
  margin-top: 4rem;
  margin-bottom: 1rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Added text shadow for readability */
}

.banner p {
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 0;
}

.main-contact-container {
  margin-top: 3vh; /* Slightly overlaps the banner */
  width: 100%;
  display: flex;
  justify-content: center;
}

.nested-contact-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  background-color: #f0f5f5;
  border-radius: 10px;
  
  padding: 20px;
  max-width: 1200px;
  width: 100%;
}

.contact-info {
  font-size: 15px;
  flex: 1;
  min-width: 28rem;
  background-color: #f0f5f5;
  padding: 20px;
  border-radius: 10px;
}

.contact-info h2 {
  margin-bottom: 15px;
  color: #007BFF; /* Added color for the header */
  font-size: 2rem; /* Larger font size */
  font-weight: bold;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem; /* Increased space between items */
  font-size: 16px;
  color: #333;
  margin-top: 3rem;
}

.info-item .material-symbols-outlined {
  margin-right: 15px;
  font-size: 35px; /* Larger icon size */
  color: #003a79;
}

.info-item div {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 1px; /* Reduced space between label and paragraph */
}

.info-item p {
  margin: 1px 0; /* Reduced margin-top and margin-bottom */
  font-size: 1rem;
  color: #333;
}

.contact-form {
  flex: 2;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.contact-info h2,
.contact-form h3 {
  margin-bottom: 15px;
  color: black;
  font-size: 2rem; /* Larger font size */
  font-weight: bold;
}


.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  font-family: 'Poppins', sans-serif;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box; /* Ensure consistent sizing */
}

textarea {
  height: 120px; /* Slightly larger height for better usability */
}

button {
  font-family: 'Poppins', sans-serif;
  background-color: #fdb812;
  color: #fff;
  padding: 10px 15px;
  margin-top: 2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  transition: background-color 0.3s; /* Smooth hover transition */
}

button:hover {
  background-color: #F3C623;
}

.map-container {
  margin-top: 20px; /* Space between the form and the map */
  border-radius: 10px;
  overflow: hidden; /* Ensures the map corners match the border radius */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%; /* Full width of the parent container */
}

</style>