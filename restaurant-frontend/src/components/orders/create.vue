<!-- resources/js/components/orders/Create.vue -->
<template>
    <div class="px-4 sm:px-6 lg:px-8">
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-xl font-semibold text-gray-900">Create New Order</h1>
            </div>
        </div>
        
        <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div class="lg:col-span-2">
                <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">Menu Items</h3>
                    </div>
                    <div class="px-4 py-5 sm:p-6">
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            <div v-for="category in categories" :key="category.id">
                                <h4 class="text-md font-medium text-gray-900 mb-2">{{ category.name }}</h4>
                                <div v-for="item in category.menu_items" :key="item.id" 
                                    class="mb-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                                    :class="{ 'bg-gray-100': isItemSelected(item.id) }"
                                    @click="toggleItem(item)">
                                    <div class="flex justify-between">
                                        <span class="font-medium">{{ item.name }}</span>
                                        <span>${{ item.price.toFixed(2) }}</span>
                                    </div>
                                    <div v-if="isItemSelected(item.id)" class="mt-1 flex items-center">
                                        <button @click.stop="decreaseQuantity(item.id)" class="text-gray-500 hover:text-gray-700">
                                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span class="mx-2">{{ getItemQuantity(item.id) }}</span>
                                        <button @click.stop="increaseQuantity(item.id)" class="text-gray-500 hover:text-gray-700">
                                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">Selected Items</h3>
                    </div>
                    <div class="px-4 py-5 sm:p-6">
                        <div v-if="selectedItems.length === 0" class="text-center text-gray-500">
                            No items selected
                        </div>
                        <div v-else>
                            <div v-for="item in selectedItems" :key="item.id" class="mb-3 p-3 border rounded">
                                <div class="flex justify-between">
                                    <div>
                                        <span class="font-medium">{{ item.name }}</span>
                                        <span class="ml-2 text-gray-500">x{{ item.quantity }}</span>
                                    </div>
                                    <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
                                </div>
                                <div class="mt-2">
                                    <label class="block text-sm font-medium text-gray-700">Special Requests</label>
                                    <input v-model="item.special_requests" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                </div>
                            </div>
                            <div class="mt-4 flex justify-between items-center">
                                <span class="text-lg font-medium">Total: ${{ total.toFixed(2) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div>
                <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">Order Details</h3>
                    </div>
                    <div class="px-4 py-5 sm:p-6">
                        <div class="mb-4">
                            <label for="table" class="block text-sm font-medium text-gray-700">Table</label>
                            <select id="table" v-model="order.table_id" class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                <option v-for="table in availableTables" :key="table.id" :value="table.id">
                                    {{ table.name }} ({{ table.capacity }} seats)
                                </option>
                            </select>
                        </div>
                        
                        <button @click="submitOrder" :disabled="selectedItems.length === 0 || !order.table_id"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
    setup() {
        const router = useRouter();
        const categories = ref([]);
        const tables = ref([]);
        const selectedItems = ref([]);
        
        const order = ref({
            table_id: null,
            items: []
        });
        
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories', {
                    params: { with: 'menu_items' }
                });
                categories.value = response.data.data;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        
        const fetchTables = async () => {
            try {
                const response = await axios.get('/api/tables');
                tables.value = response.data.data;
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        };
        
        const availableTables = computed(() => {
            return tables.value.filter(table => table.status === 'available');
        });
        
        const isItemSelected = (itemId) => {
            return selectedItems.value.some(item => item.id === itemId);
        };
        
        const getItemQuantity = (itemId) => {
            const item = selectedItems.value.find(item => item.id === itemId);
            return item ? item.quantity : 0;
        };
        
        const toggleItem = (menuItem) => {
            const index = selectedItems.value.findIndex(item => item.id === menuItem.id);
            
            if (index === -1) {
                selectedItems.value.push({
                    ...menuItem,
                    quantity: 1,
                    special_requests: ''
                });
            } else {
                selectedItems.value.splice(index, 1);
            }
        };
        
        const increaseQuantity = (itemId) => {
            const item = selectedItems.value.find(item => item.id === itemId);
            if (item) {
                item.quantity++;
            }
        };
        
        const decreaseQuantity = (itemId) => {
            const item = selectedItems.value.find(item => item.id === itemId);
            if (item && item.quantity > 1) {
                item.quantity--;
            } else {
                selectedItems.value = selectedItems.value.filter(item => item.id !== itemId);
            }
        };
        
        const total = computed(() => {
            return selectedItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        });
        
        const submitOrder = async () => {
            try {
                const orderData = {
                    table_id: order.value.table_id,
                    items: selectedItems.value.map(item => ({
                        menu_item_id: item.id,
                        quantity: item.quantity,
                        special_requests: item.special_requests
                    }))
                };
                
                const response = await axios.post('/api/orders', orderData);
                router.push(`/orders/${response.data.data.id}`);
            } catch (error) {
                console.error('Error creating order:', error);
                alert('Failed to create order. Please try again.');
            }
        };
        
        onMounted(() => {
            fetchCategories();
            fetchTables();
        });
        
        return {
            categories,
            tables,
            availableTables,
            selectedItems,
            order,
            isItemSelected,
            getItemQuantity,
            toggleItem,
            increaseQuantity,
            decreaseQuantity,
            total,
            submitOrder
        };
    }
};
</script>