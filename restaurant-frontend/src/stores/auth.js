import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  function setUser(userData) {
    user.value = userData
  }

  function setToken(tokenData) {
    token.value = tokenData
    localStorage.setItem('token', tokenData)
  }

  function clearAuth() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  async function login(credentials) {
    try {
      const response = await axios.post('/login', credentials)
      setUser(response.data.user)
      setToken(response.data.access_token)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async function register(userData) {
    try {
      const response = await axios.post('/register', userData)
      setUser(response.data.user)
      setToken(response.data.access_token)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async function logout() {
    try {
      await axios.post('/logout')
    } finally {
      clearAuth()
    }
  }

  async function fetchUser() {
    try {
      const response = await axios.get('/user')
      setUser(response.data)
      return response.data
    } catch (error) {
      clearAuth()
      throw error
    }
  }

  return {
    user,
    token,
    setUser,
    setToken,
    clearAuth,
    login,
    register,
    logout,
    fetchUser
  }
})