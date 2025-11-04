<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Kitchen Orders</h1>
        <p class="mt-2 text-sm text-gray-700">Manage food preparation status</p>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div
        v-for="status in ['pending', 'preparing', 'ready']"
        :key="status"
        class="bg-white shadow overflow-hidden sm:rounded-lg"
      >
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900 capitalize">
            {{ status }}
          </h3>
        </div>
        <div class="px-4 py-5 sm:p-6">
          <div
            v-if="filteredItems(status).length === 0"
            class="text-center text-gray-500"
          >
            No items in this status
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="item in filteredItems(status)"
              :key="item.id"
              class="p-3 border rounded"
            >
              <div class="flex justify-between">
                <div>
                  <span class="font-medium">{{ item.menu_item.name }}</span>
                  <span class="ml-2 text-gray-500">x{{ item.quantity }}</span>
                </div>
                <span class="text-sm">Table #{{ item.order.table.name }}</span>
              </div>
              <div
                v-if="item.special_requests"
                class="mt-2 text-sm text-gray-600"
              >
                <span class="font-medium">Note:</span> {{ item.special_requests }}
              </div>
              <div class="mt-3 flex justify-end space-x-2">
                <button
                  v-if="status === 'pending'"
                  @click="updateStatus(item.id, 'preparing')"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Start Preparing
                </button>
                <button
                  v-if="status === 'preparing'"
                  @click="updateStatus(item.id, 'ready')"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Mark as Ready
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const orderItems = ref([])

const fetchOrderItems = async () => {
  try {
    const response = await axios.get('/orders', {
      params: {
        include: 'table,items.menu_item',
        status: 'processing'
      }
    })
    
    orderItems.value = response.data.data.reduce((items, order) => {
      return items.concat(
        order.items.map((item) => ({
          ...item,
          order: {
            id: order.id,
            table: order.table
          }
        }))
      )
    }, [])
  } catch (error) {
    console.error('Error fetching order items:', error)
  }
}

const filteredItems = (status) => {
  return orderItems.value.filter((item) => item.status === status)
}

const updateStatus = async (itemId, status) => {
  try {
    const item = orderItems.value.find((item) => item.id === itemId)
    await axios.post(`/orders/${item.order.id}/items/${itemId}/status`, {
      status
    })
    
    const index = orderItems.value.findIndex((item) => item.id === itemId)
    if (index !== -1) {
      orderItems.value[index].status = status
    }
  } catch (error) {
    console.error('Error updating item status:', error)
  }
}

onMounted(() => {
  fetchOrderItems()
  setInterval(fetchOrderItems, 30000) // Refresh every 30 seconds
})
</script>