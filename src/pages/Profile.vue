<template>
    <div class="container py-4" style="max-width: 500px">
        <div class="auth-card" style="margin-top: 1rem">
            <div class="text-center mb-4">
                <i class="bi bi-person-circle" style="font-size: 3.5rem; color: var(--accent);"></i>
                <h4 class="mt-2 mb-0">{{ auth.user.email }}</h4>
            </div>

            <div class="row text-center g-2">
                <div class="col-4">
                    <div class="stat-box">
                        <div class="num">{{ workoutStore.totalCount }}</div>
                        <div class="text-muted small">Logged</div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="stat-box">
                        <div class="num text-success">{{ workoutStore.completedCount }}</div>
                        <div class="text-muted small">Done</div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="stat-box">
                        <div class="num text-primary">{{ workoutStore.pendingCount }}</div>
                        <div class="text-muted small">Pending</div>
                    </div>
                </div>
            </div>

            <router-link :to="{ name: 'Logout' }" class="btn btn-outline-danger w-100 mt-4">
                Logout
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useWorkoutStore } from "../stores/workout";

const auth = useAuthStore();
const workoutStore = useWorkoutStore();

onMounted(() => {
    if (!auth.user.email) {
        auth.getUserDetails();
    }
    if (workoutStore.workouts.length === 0) {
        workoutStore.fetchWorkouts();
    }
});
</script>
