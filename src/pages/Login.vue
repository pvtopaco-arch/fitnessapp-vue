<template>
    <div class="auth-card">
        <h2 class="text-center mb-1">Welcome back</h2>
        <p class="text-center text-muted mb-4">Log in to see your workouts</p>

        <form @submit.prevent="handleLogin">
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="email" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" v-model="password" required>
            </div>

            <button class="btn btn-primary w-100 mt-2" :disabled="submitting">
                {{ submitting ? "Logging in..." : "Login" }}
            </button>
        </form>

        <p class="text-center mt-3 mb-0">
            No account yet? <router-link :to="{ name: 'Register' }">Register here</router-link>
        </p>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Notyf } from "notyf";
import api from "../api";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();
const notyf = new Notyf();

const email = ref("");
const password = ref("");
const submitting = ref(false);

async function handleLogin() {
    submitting.value = true;

    try {
        const res = await api.post("/users/login", {
            email: email.value,
            password: password.value
        });

        auth.setToken(res.data.access);
        await auth.getUserDetails();

        notyf.success("Logged in!");
        router.push({ name: "Dashboard" });

    } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || "Invalid email or password.";
        notyf.error(msg);
    } finally {
        submitting.value = false;
    }
}
</script>
