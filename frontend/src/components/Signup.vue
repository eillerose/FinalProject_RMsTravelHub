<template>
  <div class="signup-page">
    <span class="material-icons back-icon" @click="goBack">arrow_back</span>
    <div class="signup-wrapper">
      <div class="signup-container">
        <div class="logo-title">
          <img src="/src/img/logoforRMs.png" alt="Logo" class="logo" />
          <h2>RM's Travel and Tours</h2>
        </div>
        <h1>Create an Account</h1>
        <p class="subtitle">Join us and start your adventure.</p>
        <p class="description">Sign up to explore the best travel experiences Puerto Galera has to offer and more.</p>
        <form @submit.prevent="handleSignUp">
          <div class="form-row">
            <div class="form-group">
              <label for="first-name">First Name</label>
              <input v-model="firstName" type="text" placeholder="Enter your first name" id="first-name" />
            </div>
            <div class="form-group">
              <label for="last-name">Last Name</label>
              <input v-model="lastName" type="text" placeholder="Enter your last name" id="last-name" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="phone-number">Phone Number</label>
              <input v-model="phoneNumber" type="text" placeholder="Enter your phone number" id="phone-number" />
            </div>
            <div class="form-group">
              <label for="username">Username</label>
              <input v-model="username" type="text" placeholder="Enter your username" id="username" />
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input v-model="email" type="email" placeholder="Enter your email" id="email" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input v-model="password" type="password" placeholder="Enter your password" id="password" />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <p class="login-link">
          Already have an account? 
          <router-link to="/login">Login</router-link>
        </p>
      </div>
      <div class="signup-image">
        <img src="/src/img/logsign.jpg" alt="Scenic Puerto Galera" />
      </div>
    </div>
  </div>
</template>





<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from '../firebaseConfig';
import { sendEmailVerification } from 'firebase/auth';

const username = ref('');
const password = ref('');
const email = ref('');
const firstName = ref('');
const lastName = ref('');
const phoneNumber = ref('');
const router = useRouter();

const handleSignUp = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      username: username.value,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      verified: false,
    });

    await sendEmailVerification(user);
    alert('User signed up successfully! A verification email has been sent to your email address.');
  } catch (error) {
    console.error('Error signing up:', error.message);
    alert(`Error: ${error.message}`);
  }
};

// Define the goBack function
const goBack = () => {
  router.push('/'); // Navigate to the landing page
};
</script>


  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.signup-page {
  font-family: 'Poppins', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 91vh;
  background-color: #f2f2f2;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2rem;
  position: relative;
}

.back-icon {
  position: absolute;
  top: 40px;
  left: 40px;
  font-size: 24px;
  color: black;
  cursor: pointer;
  z-index: 10;
}

.signup-wrapper {
  display: flex;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 1100px;
  width: 100%;
  margin: auto;
  min-height: 700px; 
}

.signup-container {
  flex: 1;
  padding: 2rem;
  max-width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1rem 0;
  min-height: 500px; 
}


.logo-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  width: 35px;
}

h2 {
  font-size: 1rem;
  color: black;
}

h1 {
  color: black;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  margin-bottom: 1rem;
  margin-top: 3rem;
}

.subtitle {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  margin-top: 1%;
}

.description {
  color: #adb5bd;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  margin-top: 0%;
}

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 3rem; 
  
}

.form-group {
  flex: 1; 
  margin-bottom: 1.25rem;
}

label {
  font-size: 0.9rem;
  font-weight: bold;
  display: block;
  color: #495057;
  margin-bottom: 0.5rem;
}

input {
  font-size: 0.9rem;
  width: 90%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
}

input#email,
input#password {
  width: 95%; 
}


input::placeholder {
  color: #6c757d;
}

button {
  font-size: 1rem;
  padding: 0.5rem;
  margin-left: 8rem;
  width: 50%; 
  background-color:  #058883;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
  font-family: 'Poppins', sans-serif;
}

button:hover {
  background-color: #f0f7f4;
  color: #4B5563;
}

.login-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: #495057;
}

.login-link a {
  color:  #058883;
  text-decoration: underline;
}

.signup-image {
  flex: 1;
  max-width: 55%;
  overflow: hidden;
}

.signup-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


</style>
