import { defineStore } from "pinia";
import api from "../api";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: localStorage.getItem("token") || "",
        user: {}
    }),
    getters: {
        isLoggedIn: (state) => !!state.token
    },
    actions: {
        async getUserDetails() {
            if (!this.token) return;

            try {
                const res = await api.get("/users/details");
                this.user = res.data.user;
            } catch (err) {
                console.error(err);
                this.user = {};
                this.token = "";
                localStorage.removeItem("token");
            }
        },
        setToken(token) {
            this.token = token;
            localStorage.setItem("token", token);
        },
        logout() {
            this.user = {};
            this.token = "";
            localStorage.removeItem("token");
        }
    }
});
