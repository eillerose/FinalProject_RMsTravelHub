<template>
    <div>
        <!-- Integrating the Header component at the top -->
        <HeaderComponent />
        <h2>Activities</h2>
        <p>This is the page for the activites.</p>



        <FooterComponent />
    </div>
</template>

<script>
import HeaderComponent from './Header.vue';
import FooterComponent from './Footer.vue';

export default {
    components: {
        HeaderComponent,
        FooterComponent,
    },
};
</script>

<style scoped>
/* Add styles for your About Us page here */
</style>
