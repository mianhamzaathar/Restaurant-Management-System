
<template>
  <div class="order-details">
    <div class="header">
      <h2>Order #{{ order.id }}</h2>
      <p>Status: {{ order.status }}</p>
      <p>Table: {{ order.table.name }}</p>
      <p>Total: ${{ order.total.toFixed(2) }}</p>
    </div>

    <div class="items-list">
      <h3>Order Items</h3>
      <div v-for="item in order.items" :key="item.id" class="item-card">
        <div class="item-info">
          <h4>{{ item.menu_item.name }}</h4>
          <p>Quantity: {{ item.quantity }}</p>
          <p>Price: ${{ item.price.toFixed(2) }}</p>
          <p>Status: 
            <span :class="'status-' + item.status">{{ item.status }}</span>
          </p>
        </div>
        <div v-if="item.special_requests" class="special-requests">
          <p><strong>Special Requests:</strong> {{ item.special_requests }}</p>
        </div>
      </div>
    </div>

    <button @click="$router.go(-1)" class="back-button">Back to Orders</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

export default {
  name: 'OrderDetails',
  setup() {
    const route = useRoute()
    const order = ref({
      id: null,
      status: '',
      total: 0,
      table: { name: '' },
      items: []
    })

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/orders/${route.params.id}`, {
          params: {
            include: 'table,items.menu_item'
          }
        })
        order.value = response.data.data
      } catch (error) {
        console.error('Error fetching order details:', error)
      }
    }

    onMounted(fetchOrderDetails)

    return { order }
  }
}
</script>

<style scoped>
.order-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.items-list {
  margin-top: 30px;
}

.item-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.item-info {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.special-requests {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #ccc;
}

.status-pending { color: orange; }
.status-preparing { color: blue; }
.status-ready { color: green; }
.status-served { color: purple; }

.back-button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.back-button:hover {
  background: #3aa876;
}
</style>