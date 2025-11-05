<template>
  <div>
    <product-form 
      :show="showForm" 
      @update:show="(value) => showForm = value"
      @success="handleFormSuccess" 
      :editing-product="editingProduct"
    />
    
    <product-table 
      :products="products" 
      :loading="loading"
      @edit="handleEdit"
      @delete="handleDelete"
      @refresh="fetchProducts"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import ProductForm from '../components/ProductForm.vue'
import ProductTable from '../components/ProductTable.vue'
import { getProducts, deleteProduct } from '../api/productApi.js'

const { proxy } = getCurrentInstance()
const products = ref([])
const loading = ref(false)
const showForm = ref(false)
const editingProduct = ref(null)

const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await getProducts()
    console.log('API响应:', response)
    products.value = response.data || []
  } catch (error) {
    console.error('获取商品列表失败:', error)
    proxy.$message.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

const handleFormSuccess = () => {
  showForm.value = false
  editingProduct.value = null
  fetchProducts()
}

const handleEdit = (product) => {
  editingProduct.value = product
  showForm.value = true
}

const handleDelete = async (id) => {
  proxy.$dialog.warning({
    title: '确认删除',
    content: '确定要删除这个商品吗？此操作不可恢复。',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await deleteProduct(id)
        proxy.$message.success('删除成功')
        fetchProducts()
      } catch (error) {
        proxy.$message.error('删除失败')
      }
    }
  })
}

onMounted(() => {
  fetchProducts()
  
  // 监听显示商品表单的自定义事件
  window.addEventListener('show-product-form', () => {
    showForm.value = true
  })
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('show-product-form', () => {
    showForm.value = true
  })
})
</script>