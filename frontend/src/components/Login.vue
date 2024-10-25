<template>
  <div class="login-page">
    <div class="login-container">
      <img src="/src/img/logoforRMs.png" alt="Logo" class="logo" />
      <h1>Log in</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Email</label>
          <input type="email" v-model="email" placeholder="Enter email" id="email" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" v-model="password" placeholder="Enter password" id="password" />
        </div>
        <button type="submit">Log in</button>
      </form>
      <p class="signup-link">
        Don't have an account? 
        <router-link to="/signup">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { auth, db } from '../firebaseConfig'; // Import db for Firestore access
import { signInWithEmailAndPassword, reload } from 'firebase/auth'; 
import { useRouter } from 'vue-router';
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore methods

export default {
  setup() {
    const email = ref(''); 
    const password = ref('');
    const router = useRouter();

    const handleLogin = async () => {
      try {
        // Sign in the user
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Refresh user profile to update email verification status
        await reload(user);

        // Check email verification status after refresh
        if (user.emailVerified) {
          console.log('User logged in:', user);

          // Update the verified field in Firestore for this user
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, {
            verified: true
          });

          // Redirect to home page after successful login and verification
          router.push('/home');
        } else {
          alert('Please verify your email before logging in.');
          await auth.signOut(); // Log out the user if not verified
        }
      } catch (error) {
        console.error('Login failed:', error.message);
        alert('Login failed: Invalid credentials or user does not exist.');
      }
    };

    return {
      email,
      password,
      handleLogin,
    };
  },
};
</script>




<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url(/src/img/login-signup.jpg);
  background-size: cover;
  background-position: center;
  font-family: 'Poppins', sans-serif;
}

.login-container {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  padding: 4rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 600px;
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
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  font-size: 1.75rem;
  display: block;
  color: white;
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
  color: rgba(255, 255, 255, 0.7);
}

button {
  font-family: 'Poppins', sans-serif;
  width: 100%;
  padding: 0.75rem;
  margin-top: 5rem;
  background-color: #155861;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 2rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #4d696d;
}

.signup-link {
  margin-top: 2rem;
  text-align: center;
  font-size: 1.5rem;
  color: white;
}

.signup-link a {
  color: #9cb3bd;
  text-decoration: underline;
}
</style>
