<template>
  <div class="login-page">
    <span class="back-icon material-icons" @click="goBack">arrow_back</span>
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
            <div class="password-container">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Enter password"
                id="password"
              />
              <span
                class="material-icons view-icon"
                @click="togglePasswordVisibility"
              >
                {{ showPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </div>
          </div>
          <button type="submit">Log In</button>
        </form>
        <p class="forgot-password-link">
          <a @click="resetPassword">Forgot Password?</a>
        </p>
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
import { signInWithEmailAndPassword, sendPasswordResetEmail, reload } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const showPassword = ref(false);
    const router = useRouter();

    const handleLogin = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        await reload(user);

        if (user.emailVerified) {
          // Fetch user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userRole = userData.role;

            console.log('User logged in:', user);
            
            // Redirect based on user role
            if (userRole === 'admin') {
              router.push('/admin');
            } else {
              router.push('/home');
            }
          } else {
            console.error('User document not found');
            alert('User data not found. Please contact support.');
            await auth.signOut();
          }
        } else {
          alert('Please verify your email before logging in.');
          await auth.signOut();
        }
      } catch (error) {
        console.error('Login failed:', error.message);
        alert('Login failed: Invalid credentials or user does not exist.');
      }
    };

    const resetPassword = async () => {
      if (!email.value) {
        alert('Please enter your email address to reset your password.');
        return;
      }

      try {
        await sendPasswordResetEmail(auth, email.value);
        alert('Password reset email sent! Please check your inbox.');
      } catch (error) {
        console.error('Error sending reset email:', error.message);
        alert('Failed to send reset email. Please check if the email is correct.');
      }
    };

    const goBack = () => {
      router.back();
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      email,
      password,
      showPassword,
      handleLogin,
      resetPassword,
      goBack,
      togglePasswordVisibility,
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
  z-index: 10;
}

.login-wrapper {
  display: flex;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  width: 100%;
  margin: auto;
}

.login-container {
  flex: 1;
  padding: 2rem;
  max-width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1rem 0;
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
  font-size: .9rem;
  font-weight: bold;
  display: block;
  color: #495057;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

input {
  font-size: .9rem;
  width: 95%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
}

.password-container {
  display: flex;
  align-items: center;
  position: relative;
}

.view-icon {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #6c757d;
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
  margin-top: 1rem;
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
  max-width: 55%;
  overflow: hidden;
}

.login-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.forgot-password-link {
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.forgot-password-link a {
  color: #1AA0B6;
  cursor: pointer;
  text-decoration: underline;
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  width: 90%; /* Adjusted width for the password input */
  padding-right: 40px; /* Add padding for the icon */
}

.password-wrapper .material-icons {
  position: absolute;
  right: 10px; /* Position the icon within the input */
  top: 50%; /* Center the icon vertically */
  transform: translateY(-50%); /* Centering adjustment */
  cursor: pointer; /* Pointer cursor for the icon */
  color: #6c757d; /* Icon color */
  font-size: 1rem; /* Icon size */
}
</style>