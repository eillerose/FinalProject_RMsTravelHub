<template>
  <div class="login-page">
    <span class="back-icon material-icons" @click="goBack">arrow_back</span> <!-- Moved to the top left -->
    <div class="login-wrapper">
      <div class="login-container">
        <div class="logo-title">
          <img src="/src/img/logoforRMs.png" alt="Logo" class="logo" />
          <h2>RM's Travel and Tours</h2>
        </div>
        <h1>Welcome back!</h1>
        <p class="subtitle">Leave your footprints in paradise.</p>
        <p class="description">Thank you for getting back to RM's Travel and Tours. Log in to explore the best travel experiences Puerto Galera has to offer.</p>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" v-model="email" placeholder="Enter email" id="email" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" v-model="password" placeholder="Enter password" id="password" />
          </div>
          <button type="submit">Log In</button>
        </form>
        <p class="signup-link">
          Don't have an account? 
          <router-link to="/signup">Sign Up</router-link>
        </p>
      </div>
      <div class="login-image">
        <img src="/src/img/logsign.jpg" alt="Scenic Puerto Galera" />
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, reload } from 'firebase/auth'; 
import { useRouter } from 'vue-router';
import { doc, updateDoc } from 'firebase/firestore';

export default {
  setup() {
    const email = ref(''); 
    const password = ref('');
    const router = useRouter();

    const handleLogin = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        await reload(user);

        if (user.emailVerified) {
          console.log('User logged in:', user);

          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, {
            verified: true
          });

          router.push('/home');
        } else {
          alert('Please verify your email before logging in.');
          await auth.signOut();
        }
      } catch (error) {
        console.error('Login failed:', error.message);
        alert('Login failed: Invalid credentials or user does not exist.');
      }
    };

    const goBack = () => {
      router.back();
    };

    return {
      email,
      password,
      handleLogin,
      goBack,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.login-page {
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
  z-index: 10; /* Ensures it stays on top of other elements */
}

.login-wrapper {
  display: flex;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 900px; /* Adjusted container width */
  width: 100%;
  margin: auto; /* Centers the container */
}

.login-container {
  flex: 1;
  padding: 2rem; /* Reduced padding for a more compact look */
  max-width: 60%; /* Adjusted container width */
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1rem 0; /* Adds balanced top and bottom margins */
}

.logo-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  width: 35px; /* Adjusted logo size */
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
  margin-top: 10%;
}

.subtitle {
  color: #6c757d;
  font-size: .9rem;
  margin: 1rem 0; 
  margin-top: 2%;
}

.description {
  color: #adb5bd;
  font-size: .9rem;
  margin-top: 0%;
}

.form-group {
  margin-bottom: 1.25rem; /* Reduced form group spacing */
}

label {
  font-size: .9rem; /* Reduced label font size */
  font-weight: bold;
  display: block;
  color: #495057;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

input {
  font-size: .9rem;
  width: 95%; /* Full width of the form container */
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
}

input::placeholder {
  color: #6c757d;
}

button {
  font-size: 1rem;
  padding: 0.5rem;
  margin-left: 6rem;
  width: 50%; 
  background-color: #1AA0B6;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
  font-family: 'Poppins', sans-serif;
}

button:hover {
  background-color: #0b5ed7;
}

.signup-link {
  margin-top: 1rem; /* Consistent spacing */
  text-align: center;
  font-size: 0.9rem;
  color: #495057;
}

.signup-link a {
  color: #1AA0B6;
  text-decoration: underline;
  
}

.login-image {
  flex: 1;
  max-width: 55%; /* Adjusted image container width */
  overflow: hidden;
}

.login-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>
