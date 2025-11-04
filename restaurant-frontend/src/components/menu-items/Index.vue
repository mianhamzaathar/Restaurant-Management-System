<!-- resources/js/components/menu-items/Index.vue -->
<template>
    <div class="px-4 sm:px-6 lg:px-8">
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-xl font-semibold text-gray-900">Menu Items</h1>
                <p class="mt-2 text-sm text-gray-700">A list of all the menu items in your restaurant.</p>
            </div>
            <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <router-link to="/menu-items/create"
                    class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
                    Add menu item
                </router-link>
            </div>
        </div>
        <div class="mt-8 flex flex-col">
            <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-300">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span class="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-for="item in menuItems" :key="item.id">
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        <div class="flex items-center">
                                            <div class="h-10 w-10 flex-shrink-0">
                                                <img class="h-10 w-10 rounded-full" :src="item.image ? `/storage/${item.image}` : 'https://via.placeholder.com/40'" alt="">
                                            </div>
                                            <div class="ml-4">
                                                <div class="font-medium text-gray-900">{{ item.name }}</div>
                                                <div class="text-gray-500 truncate max-w-xs">{{ item.description }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ item.category.name }}</td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${{ item.price.toFixed(2) }}</td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span :class="[item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium']">
                                            {{ item.is_available ? 'Available' : 'Unavailable' }}
                                        </span>
                                    </td>
                                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <router-link :to="`/menu-items/${item.id}/edit`" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</router-link>
                                        <button @click="deleteItem(item.id)" class="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
    setup() {
        const menuItems = ref([]);

        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('/api/menu-items');
                menuItems.value = response.data.data;
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        const deleteItem = async (id) => {
            if (confirm('Are you sure you want to delete this menu item?')) {
                try {
                    await axios.delete(`/api/menu-items/${id}`);
                    menuItems.value = menuItems.value.filter(item => item.id !== id);
                } catch (error) {
                    console.error('Error deleting menu item:', error);
                }
            }
        };

        onMounted(fetchMenuItems);

        return { menuItems, deleteItem };
    }
};
</script>