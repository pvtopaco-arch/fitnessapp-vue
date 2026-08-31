import { defineStore } from "pinia";
import api from "../api";

export const useWorkoutStore = defineStore("workout", {
    state: () => ({
        workouts: [],
        loading: false
    }),
    getters: {
        totalCount: (state) => state.workouts.length,
        completedCount: (state) => state.workouts.filter(w => w.status === "completed").length,
        pendingCount: (state) => state.workouts.filter(w => w.status !== "completed").length
    },
    actions: {
        async fetchWorkouts() {
            this.loading = true;
            try {
                const res = await api.get("/workouts/getMyWorkouts");
                this.workouts = res.data.workouts;
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
        async addWorkout(name, duration) {
            const res = await api.post("/workouts/addWorkout", { name, duration });
            this.workouts.unshift(res.data);
        },
        async updateWorkout(workoutId, name, duration) {
            const res = await api.patch("/workouts/updateWorkout", { workoutId, name, duration });
            const index = this.workouts.findIndex(w => w._id === workoutId);
            if (index !== -1) this.workouts[index] = res.data;
        },
        async deleteWorkout(workoutId) {
            await api.delete("/workouts/deleteWorkout", { data: { workoutId } });
            this.workouts = this.workouts.filter(w => w._id !== workoutId);
        },
        async toggleStatus(workoutId) {
            const res = await api.patch("/workouts/completeWorkoutStatus", { workoutId });
            const index = this.workouts.findIndex(w => w._id === workoutId);
            if (index !== -1) this.workouts[index] = res.data;
        }
    }
});
