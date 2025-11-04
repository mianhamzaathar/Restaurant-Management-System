import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('/login', credentials)
        commit('SET_USER', response.data.user)
        commit('SET_TOKEN', response.data.access_token)
        return response.data
      } catch (error) {
        throw error.response.data
      }
    },
    async register({ commit }, userData) {
      try {
        const response = await axios.post('/register', userData)
        commit('SET_USER', response.data.user)
        commit('SET_TOKEN', response.data.access_token)
        return response.data
      } catch (error) {
        throw error.response.data
      }
    },
    async logout({ commit }) {
      try {
        await axios.post('/logout')
        commit('CLEAR_AUTH')
      } catch (error) {
        commit('CLEAR_AUTH')
      }
    },
    async fetchUser({ commit }) {
      try {
        const response = await axios.get('/user')
        commit('SET_USER', response.data)
        return response.data
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    authToken: state => state.token
  }
})