<script setup>
import { onBeforeMount } from "vue";
import { useAuthStore } from "./stores/auth";
import Navbar from "./components/Navbar.vue";

const authStore = useAuthStore();

onBeforeMount(() => {
    if (authStore.token) {
        authStore.getUserDetails();
    }
});
</script>

<template>
    <Navbar />
    <router-view />
</template>
