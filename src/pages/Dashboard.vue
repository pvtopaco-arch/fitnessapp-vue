<template>
    <div class="container py-4" style="max-width: 800px">

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="mb-0">My Workouts</h2>
            <button class="btn btn-primary" @click="showForm = !showForm">
                <i class="bi bi-plus-lg me-1"></i>{{ showForm ? "Close" : "Add Workout" }}
            </button>
        </div>

        <div class="row g-2 mb-4">
            <div class="col-4">
                <div class="stat-box">
                    <div class="num">{{ workoutStore.totalCount }}</div>
                    <div class="text-muted small">Total</div>
                </div>
            </div>
            <div class="col-4">
                <div class="stat-box">
                    <div class="num text-success">{{ workoutStore.completedCount }}</div>
                    <div class="text-muted small">Completed</div>
                </div>
            </div>
            <div class="col-4">
                <div class="stat-box">
                    <div class="num text-primary">{{ workoutStore.pendingCount }}</div>
                    <div class="text-muted small">Pending</div>
                </div>
            </div>
        </div>

        <div class="auth-card mb-4" style="margin: 0 0 1.5rem 0; max-width: 100%" v-if="showForm">
            <form @submit.prevent="submitWorkout">
                <div class="mb-3">
                    <label class="form-label">Workout</label>
                    <select class="form-select" v-model="form.type" required>
                        <option value="" disabled>Choose a type…</option>
                        <option v-for="type in workoutTypes" :key="type" :value="type">{{ type }}</option>
                        <option value="Other">Other…</option>
                    </select>
                    <input
                        v-if="form.type === 'Other'"
                        type="text"
                        class="form-control mt-2"
                        v-model="form.customName"
                        placeholder="Name your workout"
                        required
                    >
                </div>
                <div class="mb-3">
                    <label class="form-label">Duration (minutes)</label>
                    <input
                        type="number"
                        class="form-control"
                        v-model.number="form.durationMinutes"
                        min="1"
                        max="600"
                        step="1"
                        placeholder="e.g. 45"
                        required
                    >
                </div>
                <button class="btn btn-primary" :disabled="submitting">
                    {{ editingId ? "Save changes" : "Add workout" }}
                </button>
                <button type="button" class="btn btn-link" @click="cancelEdit" v-if="editingId">
                    Cancel
                </button>
            </form>
        </div>

        <div v-if="workoutStore.loading" class="text-center text-muted py-5">
            Loading your workouts...
        </div>

        <div v-else-if="workoutStore.workouts.length === 0" class="text-center text-muted py-5">
            <i class="bi bi-clipboard-x" style="font-size: 2rem;"></i>
            <p class="mt-2">No workouts logged yet. Add your first one above.</p>
        </div>

        <div v-else>
            <div
                v-for="w in workoutStore.workouts"
                :key="w._id"
                class="workout-card"
                :class="{ 'is-done': w.status === 'completed' }"
            >
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <div class="workout-name">{{ w.name }}</div>
                        <div class="text-muted small">
                            <i class="bi bi-clock me-1"></i>{{ w.duration }}
                            <span class="mx-2">&middot;</span>
                            {{ formatDate(w.dateAdded) }}
                        </div>
                    </div>
                    <span class="badge" :class="w.status === 'completed' ? 'badge-done' : 'badge-pending'">
                        {{ w.status === 'completed' ? 'Completed' : 'Pending' }}
                    </span>
                </div>

                <div class="mt-2 d-flex gap-2">
                    <button class="btn btn-sm btn-outline-success" @click="toggle(w._id)">
                        <i class="bi" :class="w.status === 'completed' ? 'bi-arrow-counterclockwise' : 'bi-check-lg'"></i>
                        {{ w.status === 'completed' ? 'Undo' : 'Mark done' }}
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" @click="startEdit(w)">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="remove(w._id)">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Notyf } from "notyf";
import { useWorkoutStore } from "../stores/workout";

const workoutStore = useWorkoutStore();
const notyf = new Notyf();

const workoutTypes = ["Leg Day", "Upper Body", "Cardio", "HIIT", "Yoga", "Full Body", "Rest Day"];

const showForm = ref(false);
const submitting = ref(false);
const editingId = ref(null);

const form = reactive({
    type: "",
    customName: "",
    durationMinutes: null
});

onMounted(() => {
    workoutStore.fetchWorkouts();
});

function formatDate(d) {
    return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function startEdit(workout) {
    editingId.value = workout._id;

    if (workoutTypes.includes(workout.name)) {
        form.type = workout.name;
        form.customName = "";
    } else {
        form.type = "Other";
        form.customName = workout.name;
    }

    // duration is stored as a string like "45 mins" - pull the number back out
    const match = (workout.duration || "").match(/\d+/);
    form.durationMinutes = match ? Number(match[0]) : null;

    showForm.value = true;
}

function cancelEdit() {
    editingId.value = null;
    form.type = "";
    form.customName = "";
    form.durationMinutes = null;
    showForm.value = false;
}

async function submitWorkout() {
    submitting.value = true;

    const name = form.type === "Other" ? form.customName : form.type;
    const duration = `${form.durationMinutes} mins`;

    try {
        if (editingId.value) {
            await workoutStore.updateWorkout(editingId.value, name, duration);
            notyf.success("Workout updated.");
        } else {
            await workoutStore.addWorkout(name, duration);
            notyf.success("Workout added.");
        }

        cancelEdit();

    } catch (err) {
        console.error(err);
        notyf.error("Something went wrong. Try again.");
    } finally {
        submitting.value = false;
    }
}

async function toggle(id) {
    try {
        await workoutStore.toggleStatus(id);
    } catch (err) {
        console.error(err);
        notyf.error("Couldn't update workout status.");
    }
}

async function remove(id) {
    if (!confirm("Delete this workout?")) return;

    try {
        await workoutStore.deleteWorkout(id);
        notyf.success("Workout deleted.");
    } catch (err) {
        console.error(err);
        notyf.error("Couldn't delete workout.");
    }
}
</script>