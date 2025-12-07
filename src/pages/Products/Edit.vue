<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <router-link to="/" class="text-indigo-600 hover:text-indigo-900">← Back to Products</router-link>
      <h1 class="text-3xl font-bold text-gray-900 mt-2">Edit Product</h1>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else class="bg-white shadow rounded-lg p-6">
      <form @submit.prevent="handleSubmit">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <div v-if="typeof error === 'string'">{{ error }}</div>
          <ul v-else class="list-disc list-inside">
            <li v-for="(err, key) in error" :key="key">{{ err[0] }}</li>
          </ul>
        </div>

        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Product Name *</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter product description"
            ></textarea>
          </div>

          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Price *</label>
            <input
              id="price"
              v-model="form.price"
              type="number"
              step="0.01"
              min="0"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              id="quantity"
              v-model="form.quantity"
              type="number"
              min="0"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0"
            />
          </div>
        </div>

        <div class="mt-6 flex space-x-4">
          <button
            type="submit"
            :disabled="saving"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="saving">Updating...</span>
            <span v-else>Update Product</span>
          </button>
          <router-link
            to="/"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productService } from '../../services/productService';

const route = useRoute();
const router = useRouter();

const form = ref({
  name: '',
  description: '',
  price: '',
  quantity: 0
});

const loading = ref(true);
const saving = ref(false);
const error = ref('');

const loadProduct = async () => {
  loading.value = true;
  try {
    const response = await productService.getById(route.params.id);
    const product = response.data;
    form.value = {
      name: product.name,
      description: product.description || '',
      price: product.price,
      quantity: product.quantity || 0
    };
  } catch (err) {
    error.value = 'Failed to load product.';
    router.push({ name: 'Products' });
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  saving.value = true;
  error.value = '';

  try {
    await productService.update(route.params.id, form.value);
    router.push({ name: 'Products' });
  } catch (err) {
    if (err.response?.data?.errors) {
      error.value = err.response.data.errors;
    } else {
      error.value = err.response?.data?.message || 'Failed to update product. Please try again.';
    }
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadProduct();
});
</script>

