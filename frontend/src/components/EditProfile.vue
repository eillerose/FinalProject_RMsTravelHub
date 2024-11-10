<template>
    <div class="user-profile">
      <HeaderComponent />
      
      <h1 class="page-title">My Account</h1>
      
      <div class="nav-tabs">
        <a href="#" class="tab active">Profile</a>
        <a href="#" class="tab">History</a>
      </div>
      
      <h2 class="section-title">User Profile</h2>
  
      <div class="profile-container">
        <div class="profile-left">
          <div class="profile-image">
            <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile Image" />
            <div v-else class="image-placeholder">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" fill="#B7E4F0"/>
                <path d="M0 70 Q50 40 100 70 L100 100 L0 100 Z" fill="#90EE90"/>
              </svg>
            </div>
          </div>
          <h2 class="user-name">{{ firstName }} {{ lastName }}</h2>
          <p class="user-bio">{{ bio || 'Add your bio here' }}</p>
        </div>
        
        <div class="profile-right">
          <div class="form-container">
            <div class="form-row">
              <div class="form-group">
                <label for="first-name">First Name</label>
                <input v-model="firstName" type="text" id="first-name" placeholder="Add the first name here" readonly>
              </div>
              <div class="form-group">
                <label for="last-name">Last Name</label>
                <input v-model="lastName" type="text" id="last-name" placeholder="Add the last name here" readonly>
              </div>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input v-model="email" type="email" id="email" placeholder="Add the email here" readonly>
            </div>
            <div class="form-group">
              <label for="phone-number">Phone Number</label>
              <input v-model="phoneNumber" type="tel" id="phone-number" placeholder="Add the phone number here" readonly>
            </div>
            <div class="form-group">
              <label for="address">Address</label>
              <input v-model="address" type="text" id="address" placeholder="Add the phone address here" readonly>
            </div>
            <button @click="openModal" class="edit-profile-btn">Edit Profile</button>
          </div>
        </div>
      </div>
  
      <!-- Modal for Editing Profile -->
      <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h2>Edit Profile</h2>
          <form @submit.prevent="saveProfile">
            <div class="form-row">
              <div class="form-group">
                <label for="edit-first-name">First Name</label>
                <input v-model="firstName" type="text" id="edit-first-name" required>
              </div>
              <div class="form-group">
                <label for="edit-last-name">Last Name</label>
                <input v-model="lastName" type="text" id="edit-last-name" required>
              </div>
            </div>
            <div class="form-group">
              <label for="edit-email">Email</label>
              <input v-model="email" type="email" id="edit-email" required>
            </div>
            <div class="form-group">
              <label for="edit-phone-number">Phone Number</label>
              <input v-model="phoneNumber" type="tel" id="edit-phone-number">
            </div>
            <div class="form-group">
              <label for="edit-address">Address</label>
              <input v-model="address" type="text" id="edit-address">
            </div>
            <div class="form-group">
              <label for="edit-bio">Bio</label>
              <textarea v-model="bio" id="edit-bio"></textarea>
            </div>
            <div class="form-group">
              <label for="edit-profile-image">Profile Image</label>
              <input type="file" @change="onFileChange" id="edit-profile-image" accept="image/*">
            </div>
            <button type="submit" class="save-button">Save Changes</button>
          </form>
        </div>
      </div>
    <FooterComponent />
    </div>
  </template>
  
  <script>
  import { auth, db } from '../firebaseConfig';
  import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { doc, getDoc, updateDoc } from 'firebase/firestore';
  import HeaderComponent from './Header.vue';
  import FooterComponent from './Footer.vue';
  
  export default {
    name: 'UserProfile',
    components: {
      HeaderComponent,
      FooterComponent,
    },
    data() {
      return {
        address: '',
        bio: '',
        profileImage: null,
        profileImageUrl: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        isModalOpen: false,
      };
    },
    methods: {
      openModal() {
        this.isModalOpen = true;
      },
      closeModal() {
        this.isModalOpen = false;
      },
      onFileChange(e) {
        const file = e.target.files[0];
        const validExtensions = ['jpg', 'jpeg', 'png'];
  
        if (file) {
          const fileExtension = file.name.split('.').pop().toLowerCase();
          if (validExtensions.includes(fileExtension)) {
            this.profileImage = file;
          } else {
            alert("Please upload a valid image file (JPEG or PNG format).");
            e.target.value = "";
          }
        }
      },
      async saveProfile() {
        const user = auth.currentUser;
        if (!user) {
          alert("User not authenticated");
          return;
        }
  
        const storage = getStorage();
        let newProfileImageUrl = '';
  
        try {
          if (this.profileImage) {
            const imageRef = ref(storage, `profileImages/${user.uid}/${this.profileImage.name}`);
            const uploadResult = await uploadBytes(imageRef, this.profileImage);
            newProfileImageUrl = await getDownloadURL(uploadResult.ref);
          }
  
          await updateDoc(doc(db, 'users', user.uid), {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            address: this.address,
            bio: this.bio,
            profileImageUrl: newProfileImageUrl || this.profileImageUrl,
          });
  
          alert('Profile updated successfully!');
          this.profileImageUrl = newProfileImageUrl || this.profileImageUrl;
          this.closeModal();
        } catch (error) {
          console.error('Error updating profile:', error);
          alert(`Error: ${error.message}`);
        }
      },
    },
    async created() {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            this.firstName = userData.firstName || '';
            this.lastName = userData.lastName || '';
            this.email = userData.email || '';
            this.phoneNumber = userData.phoneNumber || '';
            this.address = userData.address || '';
            this.bio = userData.bio || '';
            this.profileImageUrl = userData.profileImageUrl || '';
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    },
  };
  </script>
  
  <style scoped>

  .user-profile {
    font-family: 'Poppins', sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 7rem;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  .nav-tabs {
    border-bottom: 1px solid #ddd;
    margin-bottom: 2rem;
  }
  
  .tab {
    display: inline-block;
    padding: 0.5rem 1rem;
    color: #666;
    text-decoration: none;
    margin-right: 1rem;
  }
  
  .tab.active {
    color: #000;
    border-bottom: 2px solid #000;
  }
  
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .profile-container {
    display: flex;
    gap: 4rem;
    align-items: flex-start;
  }
  
  .profile-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .profile-image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 1.5rem;
    background-color: #f0f0f0;
  }
  
  .profile-image img,
  .image-placeholder {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .user-name {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .user-bio {
    text-align: center;
    color: #666;
    font-size: 0.9rem;
  }
  
  .profile-right {
    flex: 2;
  }
  
  .form-container {
    background-color: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .form-row .form-group {
    flex: 1;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
    font-size: 0.9rem;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  textarea {
    width: 80%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }
  
  input[readonly] {
    background-color: #f9f9f9;
  }
  
  .edit-profile-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.75rem;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.2s;
  }
  
  .edit-profile-btn:hover {
    background-color: #45a049;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: #fff;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .close {
    float: right;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    color: #666;
  }
  
  .save-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.75rem;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    margin-top: 1rem;
  }
  
  @media (max-width: 768px) {
    .profile-container {
      flex-direction: column;
    }
  
    .profile-left,
    .profile-right {
      width: 100%;
    }
  
    .form-row {
      flex-direction: column;
      gap: 0;
    }
  }
  </style>