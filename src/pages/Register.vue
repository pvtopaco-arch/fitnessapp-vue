<template>
    <div class="auth-card">
        <h2 class="text-center mb-1">Create your account</h2>
        <p class="text-center text-muted mb-4">Start tracking your workouts</p>

        <form @submit.prevent="handleRegister">
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="email" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" v-model="password" required minlength="6">
            </div>

            <div class="mb-3">
                <label class="form-label">Confirm password</label>
                <input type="password" class="form-control" v-model="confirmPassword" required minlength="6">
            </div>

            <button class="btn btn-primary w-100 mt-2" :disabled="submitting || password !== confirmPassword">
                {{ submitting ? "Creating account..." : "Register" }}
            </button>

            <p class="text-danger small mt-2 mb-0" v-if="confirmPassword && password !== confirmPassword">
                Passwords don't match.
            </p>
        </form>

        <p class="text-center mt-3 mb-0">
            Already have an account? <router-link :to="{ name: 'Login' }">Login here</router-link>
        </p>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Notyf } from "notyf";
import api from "../api";

const router = useRouter();
const notyf = new Notyf();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const submitting = ref(false);

async function handleRegister() {
    if (password.value !== confirmPassword.value) {
        notyf.error("Passwords don't match.");
        return;
    }

    submitting.value = true;

    try {
        await api.post("/users/register", {
            email: email.value,
            password: password.value
        });

        notyf.success("Account created. You can log in now.");
        router.push({ name: "Login" });

    } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || "Registration failed.";
        notyf.error(msg);
    } finally {
        submitting.value = false;
    }
}
</script>
