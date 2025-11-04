// resources/js/store.js
import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        user: null,
        token: localStorage.getItem('token') || null,
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user;
        },
        SET_TOKEN(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        CLEAR_AUTH(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        }
    },
    actions: {
        async login({ commit }, credentials) {
            try {
                const response = await axios.post('/api/login', credentials);
                commit('SET_USER', response.data.user);
                commit('SET_TOKEN', response.data.access_token);
                return response.data;
            } catch (error) {
                throw error.response.data;
            }
        },
        async register({ commit }, userData) {
            try {
                const response = await axios.post('/api/register', userData);
                commit('SET_USER', response.data.user);
                commit('SET_TOKEN', response.data.access_token);
                return response.data;
            } catch (error) {
                throw error.response.data;
            }
        },
        async logout({ commit }) {
            try {
                await axios.post('/api/logout');
                commit('CLEAR_AUTH');
            } catch (error) {
                commit('CLEAR_AUTH');
            }
        },
        async fetchUser({ commit }) {
            try {
                const response = await axios.get('/api/user');
                commit('SET_USER', response.data);
                return response.data;
            } catch (error) {
                commit('CLEAR_AUTH');
                throw error;
            }
        }
    },
    getters: {
        isAuthenticated: state => !!state.token,
        user: state => state.user,
        token: state => state.token,
        isAdmin: state => state.user?.role === 'admin',
        isManager: state => state.user?.role === 'manager',
        isWaiter: state => state.user?.role === 'waiter',
        isChef: state => state.user?.role === 'chef',
    }
});