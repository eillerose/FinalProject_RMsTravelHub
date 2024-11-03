<template>
    <div>
        <!-- Integrating the Header component at the top -->
        <HeaderComponent />
        <div class="contact-container">
            <h2>Contact Us</h2>
            <p>We'd love to hear from you! Please reach out to us with any questions, concerns, or feedback.</p>
            <!-- Contact Form -->
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" v-model="name" required />
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="email" required />
                </div>
                <div class="form-group">
                    <label for="message">Message:</label>
                    <textarea id="message" v-model="message" required></textarea>
                </div>
                <button type="submit">Submit</button>
            </form>
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
.contact-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    text-align: left;
}
.contact-container h2 {
    font-size: 24px;
    margin-bottom: 10px;
}
.contact-container p {
    margin-bottom: 20px;
}
.form-group {
    margin-bottom: 15px;
}
.form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
}
.form-group input,
.form-group textarea {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
button:hover {
    background-color: #45a049;
}
</style>
