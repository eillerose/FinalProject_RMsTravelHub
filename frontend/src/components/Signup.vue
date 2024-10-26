<template>
  <div class="signup-page">
    <div class="signup-container">
      <img src="/src/img/logoforRMs.png" alt="Logo" class="logo" />
      <h1>Sign Up</h1>
      <form @submit.prevent="handleSignUp">
        <div class="form-group">
          <label for="first-name">First Name</label>
          <input v-model="firstName" type="text" placeholder="Enter your first name" id="first-name" />
        </div>
        <div class="form-group">
          <label for="last-name">Last Name</label>
          <input v-model="lastName" type="text" placeholder="Enter your last name" id="last-name" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="email" type="email" placeholder="Enter your email" id="email" />
        </div>
        <div class="form-group">
          <label for="phone-number">Phone Number</label>
          <input v-model="phoneNumber" type="text" placeholder="Enter your phone number" id="phone-number" />
        </div>
        <div class="form-group">
          <label for="username">Username</label>
          <input v-model="username" type="text" placeholder="Enter your username" id="username" />
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from '../firebaseConfig';
import { sendEmailVerification } from 'firebase/auth';

const username = ref('');
const password = ref('');
const email = ref('');
const firstName = ref('');
const lastName = ref('');
const phoneNumber = ref('');

const handleSignUp = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    // Save user information in Firestore with "verified" field set to false initially
    await setDoc(doc(db, 'users', user.uid), {
      username: username.value,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      profileImageUrl: null, // Set as null by default until a profile image is uploaded
      verified: false // Set to false until the email is verified
    });

    // Send verification email
    await sendEmailVerification(user);
    alert('User signed up successfully! A verification email has been sent to your email address.');

  } catch (error) {
    console.error('Error signing up:', error.message);
    alert(`Error: ${error.message}`);
  }
};
</script>
  
<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
  
  .signup-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-image: url(/src/img/login-signup.jpg);
    background-size: cover;
    background-position: center;
    font-family: 'Poppins', sans-serif;
  }
  
  .signup-container {
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    padding: 4rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 700px;
    min-height: 600px;
  }

  .logo {
    display: block;
    margin: 0 auto;
    width: 100px; 
    margin-bottom: 1rem;
    }
  
  h1 {
    color: white;
    font-size: 3rem;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    font-size: 1.75rem;
    color: white;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  input {
    font-size: 1.75rem;
    width: 100%;
    padding: 0.75rem;
    border: 1px solid white;
    background-color: transparent;
    color: white;
    border-radius: 4px;
  }
  
  input::placeholder {
    color: #E4E0E1;
    font-family: 'Poppins', sans-serif;
    }
  
  button {
    font-family: 'Poppins', sans-serif;
    width: 100%;
    padding: 0.75rem;
    background-color: #155861;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.5rem;
    margin-top: 2rem;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #4d696d;
  }
  
  .login-link {
    margin-top: 2rem;
    text-align: center;
    font-size: 1.5rem;
    color: white;
  }

  .login-link a {
    color: #9cb3bd;
    text-decoration: underline;
  }


 </style>
  