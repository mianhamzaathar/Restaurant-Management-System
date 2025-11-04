<template>
  <div class="reports-container">
    <h2>Restaurant Reports</h2>
    
    <div class="report-cards">
      <div class="report-card">
        <h3>Sales Report</h3>
        <div v-if="salesData">
          <p>Total Sales: ${{ salesData.total_sales.toFixed(2) }}</p>
          <p>Total Orders: {{ salesData.total_orders }}</p>
          <p>Average Order Value: ${{ salesData.avg_order_value.toFixed(2) }}</p>
        </div>
        <button @click="fetchSalesReport">Refresh Sales Data</button>
      </div>

      <div class="report-card">
        <h3>Popular Items</h3>
        <ul v-if="popularItems">
          <li v-for="item in popularItems" :key="item.id">
            {{ item.name }} - Sold: {{ item.quantity }} times
          </li>
        </ul>
        <button @click="fetchPopularItems">Refresh Items Data</button>
      </div>
    </div>

    <div class="date-filters">
      <div>
        <label>Start Date:</label>
        <input type="date" v-model="startDate">
      </div>
      <div>
        <label>End Date:</label>
        <input type="date" v-model="endDate">
      </div>
      <button @click="applyDateFilters">Apply Filters</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'ReportsIndex',
  setup() {
    const salesData = ref(null)
    const popularItems = ref(null)
    const startDate = ref('')
    const endDate = ref('')

    const fetchSalesReport = async () => {
      try {
        const params = {}
        if (startDate.value) params.start_date = startDate.value
        if (endDate.value) params.end_date = endDate.value
        
        const response = await axios.get('/reports/sales', { params })
        salesData.value = response.data.data
      } catch (error) {
        console.error('Error fetching sales report:', error)
      }
    }

    const fetchPopularItems = async () => {
      try {
        const params = {}
        if (startDate.value) params.start_date = startDate.value
        if (endDate.value) params.end_date = endDate.value
        
        const response = await axios.get('/reports/items', { params })
        popularItems.value = response.data.data
      } catch (error) {
        console.error('Error fetching popular items:', error)
      }
    }

    const applyDateFilters = () => {
      fetchSalesReport()
      fetchPopularItems()
    }

    onMounted(() => {
      fetchSalesReport()
      fetchPopularItems()
    })

    return {
      salesData,
      popularItems,
      startDate,
      endDate,
      fetchSalesReport,
      fetchPopularItems,
      applyDateFilters
    }
  }
}
</script>

<style scoped>
.reports-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.report-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.report-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.date-filters {
  margin-top: 30px;
  display: flex;
  gap: 15px;
  align-items: flex-end;
}

button {
  padding: 8px 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #3aa876;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
</style>