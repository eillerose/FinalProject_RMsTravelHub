<template>
    <div class="feedback-page">
        <HeaderComponent />
        <!-- Banner Section -->
        <div class="banner">
            <h1>Feedback</h1>
            <p>We value your feedback and appreciate your input. Feel free to share your thoughts and join the conversation.</p>
        </div>

        <!-- Client Heading -->
        <div class="client-heading">
            <h2>What our Client say!</h2>
        </div>

        <!-- Feedback Messages with Replies -->
        <div v-if="feedbackMessages.length" class="feedback-grid">
            <div v-for="(message, index) in feedbackMessages" :key="index" class="feedback-card">
                <div class="feedback-header">
                    <div class="icon-and-text">
                        <span class="material-icons account-icon">account_circle</span>
                        <div>
                            <h3>{{ message.name }}</h3>
                            <p class="email">{{ message.email }}</p>
                        </div>
                    </div>
                </div>
                <div class="feedback-content">
                    <p>{{ message.message }}</p>
                </div>

                <!-- Toggle Replies -->
                <div @click="openModal(index)" class="replies-header">
                    <span class="material-icons">chat_bubble_outline</span>
                    <h4>Replies ({{ message.replies.length }})</h4>
                </div>

                <!-- Inline Replies Form -->
                <div class="reply-form">
                    <input type="text" v-model="newReply[index]" placeholder="Write a reply..." />
                    <button @click="submitReply(index, message.id)">
                        <span class="material-icons">send</span>
                    </button>
                </div>
            </div>
        </div>
        <div v-else>
            <p>No feedback messages yet.</p>
        </div>

        <!-- Submit Feedback Button -->
        <button @click="redirectToContactUs" class="submit-feedback-btn">Send Feedback</button>

        <!-- Modal for Displaying Replies -->
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <div class="feedback-header modal-header">
                    <div class="icon-and-text">
                        <span class="material-icons account-icon">account_circle</span>
                        <div>
                            <h3>{{ feedbackMessages[currentMessageIndex].name }}</h3>
                            <p class="email">{{ feedbackMessages[currentMessageIndex].email }}</p>
                        </div>
                    </div>
                    <button class="close-button" @click="closeModal">×</button>
                </div>
                <div class="modal-body">
                    <div class="feedback-content">
                        <p>{{ feedbackMessages[currentMessageIndex].message }}</p>
                    </div>
                    <div class="replies">
                        <h4>Replies ({{ feedbackMessages[currentMessageIndex].replies.length }})</h4>
                        <div v-for="(reply, idx) in feedbackMessages[currentMessageIndex].replies" :key="idx" class="reply">
                            <p><strong>{{ reply.userName }}:</strong> {{ reply.text }}</p>
                        </div>
                    </div>
                    <div class="modal-reply-form">
                        <input type="text" v-model="newReply[currentMessageIndex]" placeholder="Write a reply..." />
                        <button @click="submitReply(currentMessageIndex, feedbackMessages[currentMessageIndex].id)">
                            <span class="material-icons">send</span>
                        </button>
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
import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";

export default {
    components: {
        HeaderComponent,
        FooterComponent,
    },
    data() {
        return {
            feedbackMessages: [],
            newReply: {},
            showReplies: {},
            showModal: false,
            currentMessageIndex: null,
        };
    },
    methods: {
        async fetchFeedbackMessages() {
            try {
                const querySnapshot = await getDocs(collection(db, "contacts"));
                const messages = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
                    const messageData = docSnapshot.data();
                    const repliesSnapshot = await getDocs(collection(db, `contacts/${docSnapshot.id}/replies`));
                    const replies = repliesSnapshot.docs.map((replyDoc) => replyDoc.data());
                    return { id: docSnapshot.id, ...messageData, replies };
                }));
                this.feedbackMessages = messages;
            } catch (error) {
                console.error("Error fetching messages: ", error);
            }
        },
        openModal(index) {
            this.currentMessageIndex = index;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.currentMessageIndex = null;
        },
        async submitReply(index, feedbackId) {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                let userName = "Guest User";
                if (user) {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        userName = userData.username || `${userData.firstName} ${userData.lastName}` || "Guest User";
                    }
                }

                if (this.newReply[index]) {
                    await addDoc(collection(db, `contacts/${feedbackId}/replies`), {
                        text: this.newReply[index],
                        userName: userName,
                    });
                    this.newReply[index] = "";
                    this.fetchFeedbackMessages();
                }
            } catch (error) {
                console.error("Error submitting reply: ", error);
            }
        },
        redirectToContactUs() {
            this.$router.push({ path: "/contactus" });
        }
    },
    mounted() {
        this.fetchFeedbackMessages();
    },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.feedback-page {
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
}

.banner {
    width: 100%;
    background-image: url('/src/img/heroBg.jpg');
    background-size: cover;
    background-position: center;
    text-align: center;
    color: #fff;
    padding: 0 20px;
    height: 25vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 2rem;
}

.banner h1 {
    font-size: 4rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.banner p {
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 1rem;
}

.client-heading {
    text-align: center;
    margin: 20px auto;
    font-size: 1.8rem;
    font-weight: 600;
    color: black;
}

.feedback-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
    max-width: 1200px;
    margin: 20px auto;
}

.feedback-card {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   
}

.feedback-content {
    padding: 10px;
    font-size: 1rem;
    color: #333;
    background-color: #e6f7ff;
    border-radius: 5px;
    margin: 20px 20px;
}

.feedback-card:hover {
    transform: translateY(-5px);
}

.feedback-header {
    background-color: #10375C;
    color: #fff;
    padding: 15px 20px;
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: center;
    margin: 0;
}

.icon-and-text {
    display: flex;
    align-items: center;
}

.account-icon {
    font-size: 2rem;
    margin-right: 10px;
}

.feedback-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 500;
}

.email {
    margin: 4px 0 0 0;
    font-size: 0.9rem;
    color: #d1e7ff;
    opacity: 0.9;
    padding: 0;
}

.replies-header {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    color: #004085;
    margin:20px;
}

.reply-form {
    display: flex;
    gap: 5px;
    align-items: center;
    margin: 20px;
    margin-top: 1rem;
}

input[type="text"] {
    font-family: 'Poppins', sans-serif;
    flex-grow: 1;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ddd;
    outline: none;
    font-size: 0.9rem;
    color: #555;
}

button {
    background: none;
    border: none;
    cursor: pointer;
}

button .material-icons {
    font-size: 1.5rem;
    color: #004085;
}

.submit-feedback-btn {
    font-family: 'Poppins', sans-serif;
    display: block;
    margin: 20px auto;
    margin-top: 3.5rem;
    padding: 10px 20px;
    background-color: #fdb812;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 4rem;
    margin-bottom: 5rem;
}

/* Modal styling */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #fff;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    padding: 0; /* Remove padding to ensure no white space outside header */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #10375C; /* Same color as the feedback header */
    color: #fff;
    padding: 15px 20px;
    border-radius: 8px 8px 0 0;
    margin: 0; /* Removed margin */
}

.modal-body {
    margin-top: 0;
    margin: 20px;
}

.close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: white;
}

.modal-reply-form {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 10px;
    padding: 20px;
}

.modal-reply-form input {
    flex: 1;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ddd;
}

.modal-reply-form button {
    background: none;
    border: none;
    cursor: pointer;
}

.modal-reply-form button .material-icons {
    font-size: 1.5rem;
    color: #004085;
}
</style>
