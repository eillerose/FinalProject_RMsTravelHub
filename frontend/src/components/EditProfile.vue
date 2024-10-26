<template>
    <div>
        <!-- Integrating the Header component at the top -->
        <HeaderComponent />
        
        <h2>User Profile Information</h2>
        <table>
            <thead>
                <tr>
                    <th>Field</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>First Name</td>
                    <td>{{ firstName }}</td>
                </tr>
                <tr>
                    <td>Last Name</td>
                    <td>{{ lastName }}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{{ email }}</td>
                </tr>
                <tr>
                    <td>Phone Number</td>
                    <td>{{ phoneNumber }}</td>
                </tr>
                <tr>
                    <td>Address</td>
                    <td>{{ address }}</td>
                </tr>
                <tr>
                    <td>Bio</td>
                    <td>{{ bio }}</td>
                </tr>
                <tr>
                    <td>Profile Image</td>
                    <td>
                        <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile Image" style="width: 100px; height: 100px;" />
                    </td>
                </tr>
            </tbody>
        </table>
        <button @click="openModal">Edit Profile</button>

        <!-- Modal for Editing Profile -->
        <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <h2>Edit Profile</h2>
                <form @submit.prevent="saveProfile">
                    <div>
                        <label for="first-name">First Name</label>
                        <input v-model="firstName" type="text" placeholder="Enter your first name" id="first-name" />
                    </div>
                    <div>
                        <label for="last-name">Last Name</label>
                        <input v-model="lastName" type="text" placeholder="Enter your last name" id="last-name" />
                    </div>
                    <div>
                        <label for="email">Email</label>
                        <input v-model="email" type="email" placeholder="Enter your email" id="email" />
                    </div>
                    <div>
                        <label for="phone-number">Phone Number</label>
                        <input v-model="phoneNumber" type="text" placeholder="Enter your phone number" id="phone-number" />
                    </div>
                    <div>
                        <label for="address">Address</label>
                        <input v-model="address" type="text" placeholder="Enter your address" id="address" />
                    </div>
                    <div>
                        <label for="bio">Bio</label>
                        <input v-model="bio" type="text" placeholder="Enter bio" id="bio" />
                    </div>
                    <div>
                        <label for="profileImage">Profile Image</label>
                        <input type="file" @change="onFileChange" />
                    </div>
                    <button type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { auth, db } from '../firebaseConfig'; // Adjust the path to your Firebase config
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import HeaderComponent from './Header.vue';

export default {
    // name: 'EditProfile',
    components: {
        HeaderComponent
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
                const fileExtension = file.name.split('.').pop().toLowerCase(); // Get the file extension

                // Check if the extension is valid
                if (validExtensions.includes(fileExtension)) {
                    this.profileImage = file;
                } else {
                    alert("Please upload a valid image file (JPEG or PNG format).");
                    e.target.value = ""; // Clear the input field if invalid
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
                // Upload new profile image if selected and valid
                if (this.profileImage) {
                    const imageRef = ref(storage, `profileImages/${user.uid}/${this.profileImage.name}`);
                    const uploadResult = await uploadBytes(imageRef, this.profileImage);
                    newProfileImageUrl = await getDownloadURL(uploadResult.ref); // Get the download URL
                }

                // Update user data in Firestore
                await updateDoc(doc(db, 'users', user.uid), {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    phoneNumber: this.phoneNumber,
                    address: this.address,
                    bio: this.bio,
                    profileImageUrl: newProfileImageUrl || this.profileImageUrl, // Update image URL or keep existing
                });

                alert('Profile updated successfully!');
                this.profileImageUrl = newProfileImageUrl || this.profileImageUrl; // Update profile image in UI
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
    table {
    margin-top: 20px;
    border-collapse: collapse;
    width: 100%;
    }
    th, td {
    border: 1px solid #ddd;
    padding: 8px;
    }
    th {
    background-color: #f2f2f2;
    }
    .modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
    padding-top: 60px;
    }
    .modal-content {
    background-color: #fefefe;
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    }
    .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    }
    .close:hover,
    .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
    }

</style>
