<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => !!authStore.token)
</script>

<template>
  <div class="app-container">
    <!-- Navigation Header -->
    <header v-if="isAuthenticated" class="admin-header">
      <div class="header-content">
        <h1 class="logo">Restaurant Manager</h1>
        <nav class="main-nav">
          <RouterLink to="/">Dashboard</RouterLink>
          <RouterLink to="/orders">Orders</RouterLink>
          <RouterLink to="/menu-items">Menu</RouterLink>
          <RouterLink to="/reports" v-if="authStore.user?.role === 'manager'">Reports</RouterLink>
          <RouterLink to="/kitchen" v-if="['chef', 'manager'].includes(authStore.user?.role)">Kitchen</RouterLink>
          <RouterLink to="/login" @click="authStore.logout">Logout</RouterLink>
        </nav>
      </div>
    </header>

    <!-- Authentication Pages (no header) -->
    <div v-if="!isAuthenticated" class="auth-container">
      <RouterView />
    </div>

    <!-- Main Content Area -->
    <main v-else class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Base Styles */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Admin Header Styles */
.admin-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.main-nav {
  display: flex;
  gap: 1.5rem;
}

.main-nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.main-nav a:hover {
  background-color: #34495e;
}

.main-nav a.router-link-exact-active {
  background-color: #42b983;
  font-weight: bold;
}

/* Content Area Styles */
.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>