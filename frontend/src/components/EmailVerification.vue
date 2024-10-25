<template>
    <div class="verification-page">
        <h1>Email Verification</h1>
        <p>Please check your email for a verification link to activate your account.</p>
        <p>If you haven't received an email, you can request a new one.</p>
        <button @click="resendVerification">Resend Verification Email</button>
        <router-link to="/login">Back to Login</router-link>
    </div>
</template>

<script setup>
import { auth } from '../firebaseConfig';
import { sendEmailVerification } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

const resendVerification = async () => {
    const user = auth.currentUser;
    if (user) {
        await sendEmailVerification(user);
        alert('Verification email resent! Please check your inbox.');
    } else {
        alert('No user is logged in.');
    }
};
</script>

<style>
/* Add your styles here */
</style>
