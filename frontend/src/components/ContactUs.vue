<template>
    <div>
        <!-- Integrating the Header component at the top -->
        <HeaderComponent />
        <h2>Contact Us</h2>
        <p>This is the contact us page content.</p>
    </div>
</template>

<script>
import HeaderComponent from './Header.vue';

export default {
    components: {
        HeaderComponent,
    },
};
</script>

<style scoped>
/* Add styles for your About Us page here */
</style>
