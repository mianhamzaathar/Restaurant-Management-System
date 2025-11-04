<template>
  <div class="home">
    <div class="hero">
      <h1>Welcome to Our Restaurant</h1>
      <p>Delicious food served with love</p>
      <div class="auth-buttons" v-if="!isAuthenticated">
        <router-link to="/login" class="btn primary">Login</router-link>
        <router-link to="/register" class="btn secondary">Register</router-link>
      </div>
      <router-link v-else to="/" class="btn primary">Go to Dashboard</router-link>
    </div>

    <div class="features">
      <div class="feature">
        <h3>Our Menu</h3>
        <p>Discover our delicious dishes prepared with fresh ingredients</p>
      </div>
      <div class="feature">
        <h3>Online Orders</h3>
        <p>Place your order online for quick service</p>
      </div>
      <div class="feature">
        <h3>Reservations</h3>
        <p>Book your table in advance</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'

export default {
  name: 'Home',
  setup() {
    const authStore = useAuthStore()
    const isAuthenticated = computed(() => !!authStore.token)

    return {
      isAuthenticated
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('@/assets/restaurant-hero.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  border-radius: 8px;
  margin-bottom: 40px;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.5rem;
  margin-bottom: 30px;
}

.auth-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn {
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
}

.primary {
  background: #42b983;
  color: white;
}

.primary:hover {
  background: #3aa876;
}

.secondary {
  background: white;
  color: #42b983;
  border: 2px solid #42b983;
}

.secondary:hover {
  background: #f0f0f0;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.feature h3 {
  color: #42b983;
  margin-bottom: 15px;
}
</style>