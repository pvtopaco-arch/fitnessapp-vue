<template>
    <nav class="navbar navbar-expand-lg navbar-fit sticky-top">
        <div class="container-fluid">
            <router-link :to="{ name: 'Dashboard' }" class="navbar-brand">
              <i class="bi bi-activity"></i>PaulFitness
            </router-link>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navMenu">
                <div class="navbar-nav ms-auto align-items-lg-center">
                    <router-link :to="{ name: 'Dashboard' }" class="nav-link" v-if="auth.isLoggedIn">
                        My Workouts
                    </router-link>
                    <router-link :to="{ name: 'Profile' }" class="nav-link" v-if="auth.isLoggedIn">
                        Profile
                    </router-link>
                    <router-link :to="{ name: 'Logout' }" class="nav-link" v-if="auth.isLoggedIn">
                        Logout
                    </router-link>

                    <router-link :to="{ name: 'Login' }" class="nav-link" v-if="!auth.isLoggedIn">
                        Login
                    </router-link>
                    <router-link :to="{ name: 'Register' }" class="nav-link" v-if="!auth.isLoggedIn">
                        Register
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
</script>
