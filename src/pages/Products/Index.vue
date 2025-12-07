<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Products</h1>
      <router-link
        to="/products/create"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        + Add Product
      </router-link>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search products..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @input="debounceSearch"
          />
        </div>
        <select
          v-model="filters.sort_by"
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          @change="loadProducts"
        >
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="created_at">Sort by Date</option>
        </select>
        <select
          v-model="filters.sort_order"
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          @change="loadProducts"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Products Table -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ product.description || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ parseFloat(product.price).toFixed(2) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.quantity }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <router-link
                :to="`/products/${product.id}/edit`"
                class="text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </router-link>
              <button
                @click="deleteProduct(product.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="products.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">No products found</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="meta.total > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="changePage(meta.current_page - 1)"
            :disabled="meta.current_page === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="changePage(meta.current_page + 1)"
            :disabled="meta.current_page === meta.last_page"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ ((meta.current_page - 1) * meta.per_page) + 1 }}</span>
              to <span class="font-medium">{{ Math.min(meta.current_page * meta.per_page, meta.total) }}</span>
              of <span class="font-medium">{{ meta.total }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="changePage(meta.current_page - 1)"
                :disabled="meta.current_page === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                @click="changePage(meta.current_page + 1)"
                :disabled="meta.current_page === meta.last_page"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { productService } from '../../services/productService';

const products = ref([]);
const loading = ref(false);
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
});

const filters = ref({
  search: '',
  sort_by: 'id',
  sort_order: 'desc',
  per_page: 15
});

let searchTimeout = null;

const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    meta.value.current_page = 1;
    loadProducts();
  }, 500);
};

const loadProducts = async () => {
  loading.value = true;
  try {
    const response = await productService.getAll({
      ...filters.value,
      per_page: filters.value.per_page
    });
    products.value = response.data;
    meta.value = response.meta;
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= meta.value.last_page) {
    meta.value.current_page = page;
    loadProducts();
  }
};

const deleteProduct = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  try {
    await productService.delete(id);
    await loadProducts();
  } catch (error) {
    alert('Error deleting product');
  }
};

onMounted(() => {
  loadProducts();
});
</script>
