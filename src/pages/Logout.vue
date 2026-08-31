<template>
    <div class="text-center py-5 text-muted">Logging out...</div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();

onMounted(() => {
    auth.logout();
    router.push({ name: "Login" });
});
</script>
