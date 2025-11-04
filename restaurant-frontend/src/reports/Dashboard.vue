<template>
  <div class="dashboard">
    <!-- Header with greeting and time -->
    <div class="header">
      <div>
        <h1>Restaurant Dashboard</h1>
        <p class="welcome-message">Welcome back, {{ user.name }}!</p>
        <p class="current-time">{{ currentTime }}</p>
      </div>
      <div class="notifications" @click="showNotifications = !showNotifications">
        <span class="badge" v-if="unreadNotifications > 0">{{ unreadNotifications }}</span>
        <i class="fas fa-bell"></i>
        <div class="notification-dropdown" v-if="showNotifications">
          <div v-for="notification in notifications" :key="notification.id" 
               class="notification-item" 
               :class="{ unread: !notification.read }"
               @click="markAsRead(notification.id)">
            {{ notification.message }}
            <span class="notification-time">{{ formatTime(notification.time) }}</span>
          </div>
          <div v-if="notifications.length === 0" class="empty-notifications">
            No new notifications
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-grid">
      <stat-card title="Today's Orders" :value="stats.today_orders" icon="fa-receipt" 
                 :change="stats.orders_change" change-type="percent" />
      <stat-card title="Today's Revenue" :value="'$' + stats.today_revenue.toFixed(2)" icon="fa-money-bill-wave" 
                 :change="stats.revenue_change" change-type="percent" color="green" />
      <stat-card title="Active Tables" :value="stats.active_tables" icon="fa-utensils" 
                 :max="stats.total_tables" />
      <stat-card title="Pending Orders" :value="stats.pending_orders" icon="fa-clock" 
                 :change="stats.pending_change" change-type="number" color="orange" />
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <router-link to="/orders/create" class="action-button">
        <i class="fas fa-plus"></i> New Order
      </router-link>
      <router-link to="/menu-items" class="action-button">
        <i class="fas fa-utensils"></i> Manage Menu
      </router-link>
      <router-link to="/tables" class="action-button">
        <i class="fas fa-chair"></i> Table Status
      </router-link>
      <router-link to="/reports" v-if="user.role === 'manager'" class="action-button">
        <i class="fas fa-chart-bar"></i> View Reports
      </router-link>
    </div>

    <!-- Recent Activity Section -->
    <div class="recent-activity">
      <div class="recent-orders">
        <h2>
          <i class="fas fa-history"></i> Recent Orders
          <button @click="fetchDashboardData" class="refresh-btn">
            <i class="fas fa-sync-alt" :class="{ refreshing: isRefreshing }"></i>
          </button>
        </h2>
        <order-list :orders="recentOrders" />
      </div>

      <div class="activity-feed">
        <h2><i class="fas fa-bell"></i> Recent Activity</h2>
        <activity-feed :activities="recentActivities" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import StatCard from '@/components/ui/StatCard.vue'
import OrderList from '@/components/orders/OrderList.vue'
import ActivityFeed from '@/components/ui/ActivityFeed.vue'
import { format, subDays } from 'date-fns'

export default {
  name: 'Dashboard',
  components: { StatCard, OrderList, ActivityFeed },
  setup() {
    const authStore = useAuthStore()
    const stats = ref({
      today_orders: 0,
      today_revenue: 0,
      active_tables: 0,
      pending_orders: 0,
      total_tables: 0,
      orders_change: 0,
      revenue_change: 0,
      pending_change: 0
    })
    const recentOrders = ref([])
    const recentActivities = ref([])
    const notifications = ref([])
    const showNotifications = ref(false)
    const isRefreshing = ref(false)
    const lastUpdated = ref(null)

    const currentTime = computed(() => {
      return format(new Date(), 'EEEE, MMMM d, yyyy - h:mm a')
    })

    const unreadNotifications = computed(() => {
      return notifications.value.filter(n => !n.read).length
    })

    const fetchDashboardData = async () => {
      isRefreshing.value = true
      try {
        const [statsRes, ordersRes, activitiesRes, notificationsRes] = await Promise.all([
          axios.get('/dashboard/stats'),
          axios.get('/orders', {
            params: {
              limit: 5,
              include: 'table,customer'
            }
          }),
          axios.get('/activities', {
            params: {
              limit: 5,
              since: format(subDays(new Date(), 1), 'yyyy-MM-dd')
            }
          }),
          axios.get('/notifications')
        ])
        
        stats.value = statsRes.data.data
        recentOrders.value = ordersRes.data.data
        recentActivities.value = activitiesRes.data.data
        notifications.value = notificationsRes.data.data
        lastUpdated.value = new Date()
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        isRefreshing.value = false
      }
    }

    const markAsRead = async (notificationId) => {
      try {
        await axios.patch(`/notifications/${notificationId}/read`)
        fetchDashboardData()
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    }

    const formatTime = (dateString) => {
      return format(new Date(dateString), 'h:mm a')
    }

    onMounted(() => {
      fetchDashboardData()
      // Refresh data every 5 minutes
      const interval = setInterval(fetchDashboardData, 300000)
      return () => clearInterval(interval)
    })

    return {
      user: authStore.user,
      stats,
      recentOrders,
      recentActivities,
      notifications,
      showNotifications,
      isRefreshing,
      currentTime,
      unreadNotifications,
      fetchDashboardData,
      markAsRead,
      formatTime,
      lastUpdated
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.welcome-message {
  font-size: 1.2rem;
  color: #666;
  margin-top: 5px;
}

.current-time {
  color: #888;
  font-size: 0.9rem;
}

.notifications {
  position: relative;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.notifications:hover {
  color: #42b983;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  z-index: 100;
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.2s;
}

.notification-item:hover {
  background: #f8f9fa;
}

.notification-item.unread {
  background: #f8f9fa;
  font-weight: 500;
}

.notification-time {
  display: block;
  font-size: 0.8rem;
  color: #888;
  margin-top: 3px;
}

.empty-notifications {
  padding: 15px;
  text-align: center;
  color: #888;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
}

.action-button {
  padding: 12px 20px;
  background: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-button:hover {
  background: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.recent-activity {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.recent-orders h2,
.activity-feed h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.refresh-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  margin-left: auto;
  font-size: 1rem;
}

.refresh-btn:hover {
  color: #42b983;
}

.refreshing {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .recent-activity {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .quick-actions {
    flex-direction: column;
  }
  
  .action-button {
    justify-content: center;
  }
}
</style>