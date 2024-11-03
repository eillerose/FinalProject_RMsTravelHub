<template>
    <div>
        <HeaderComponent />
        <h2>Feedback</h2>
        <p>This is the feedback page content.</p>

        <!-- Feedback Messages with Replies -->
        <div v-if="feedbackMessages.length">
            <div v-for="(message, index) in feedbackMessages" :key="index" class="feedback-message">
                <p><strong>Name:</strong> {{ message.name }}</p>
                <p><strong>Email:</strong> {{ message.email }}</p>
                <p><strong>Message:</strong> {{ message.message }}</p>

                <!-- Display Replies -->
                <div v-if="message.replies && message.replies.length" class="replies">
                    <h4>Replies:</h4>
                    <div v-for="(reply, idx) in message.replies" :key="idx" class="reply">
                        <p><strong>{{ reply.userName }}:</strong> {{ reply.text }}</p>
                    </div>
                </div>

                <!-- Reply Form -->
                <div class="reply-form">
                    <input type="text" v-model="newReply[index]" placeholder="Write a reply..." />
                    <button @click="submitReply(index, message.id)">Submit Reply</button>
                </div>
                <hr>
            </div>
        </div>
        <div v-else>
            <p>No feedback messages yet.</p>
        </div>

        <!-- Submit Feedback Button -->
        <button @click="redirectToContactUs" class="submit-feedback-btn">
             Submit New Feedback
        </button>

        <FooterComponent />
    </div>
</template>

<script>
import HeaderComponent from './Header.vue';
import FooterComponent from './Footer.vue';
import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore"; 
import { db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

export default {
    components: {
        HeaderComponent,
        FooterComponent,
    },
    data() {
        return {
            feedbackMessages: [], // Array to store feedback messages
            newReply: {}, // To store reply text for each feedback message
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
        async submitReply(index, feedbackId) {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                let userName = "Guest User"; // Default name if no user or username is found

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
                        userName: userName, // Use the username or full name from Firestore
                    });
                    this.newReply[index] = ""; // Clear the reply field
                    this.fetchFeedbackMessages(); // Refresh feedback to show the new reply
                }
            } catch (error) {
                console.error("Error submitting reply: ", error);
            }
        },
        redirectToContactUs() {
            // Redirect to the Contact Us page
            this.$router.push({ path: "/contactus" });
        }
    },
    mounted() {
        this.fetchFeedbackMessages(); // Fetch messages when component mounts
    },
};
</script>




<style scoped>
/* Styles for the feedback messages */
.feedback-message {
    margin-bottom: 20px;
}
.feedback-message p {
    margin: 5px 0;
}
.replies {
    margin-top: 10px;
    padding-left: 20px;
}
.reply {
    margin-top: 5px;
}
.reply-form {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}
hr {
    border: 1px solid #ddd;
    margin-top: 10px;
}
</style>
