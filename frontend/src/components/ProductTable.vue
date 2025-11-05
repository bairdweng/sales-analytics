<template>
  <n-card title="商品列表" :bordered="false">
    <template #header-extra>
      <n-space>
        <n-input
          v-model:value="searchValue"
          placeholder="搜索商品名称..."
          clearable
          style="width: 300px"
        >
          <template #prefix>
            <n-icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </n-icon>
          </template>
        </n-input>
        
        <n-button @click="fetchProducts" :loading="loading">
          <template #icon>
            <n-icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
            </n-icon>
          </template>
          刷新
        </n-button>
      </n-space>
    </template>

    <n-data-table
      :columns="columns"
      :data="filteredProducts"
      :loading="loading"
      :pagination="pagination"
      :row-key="(row) => row.id"
      :scroll-x="1200"
    />
  </n-card>
</template>

<script setup>
import { ref, computed, h, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NSpace, NTag, NNumberAnimation } from 'naive-ui'
import { deleteProduct } from '../api/productApi.js'

const { proxy } = getCurrentInstance()
const router = useRouter()
const props = defineProps({
  products: Array,
  loading: Boolean
})

const emit = defineEmits(['edit', 'delete', 'refresh'])

const searchValue = ref('')

const fetchProducts = () => {
  emit('refresh')
}

const filteredProducts = computed(() => {
  if (!searchValue.value) return props.products
  
  const search = searchValue.value.toLowerCase()
  return props.products.filter(product => 
    product.name?.toLowerCase().includes(search) ||
    product.notes?.toLowerCase().includes(search)
  )
})

const pagination = ref({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page) => {
    pagination.value.page = page
  },
  onUpdatePageSize: (pageSize) => {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
  }
})

const createColumns = () => [
  {
    title: '创建时间',
    key: 'created_at',
    width: 160,
    render: (row) => {
      // 将UTC时间字符串转换为本地时间
      const date = new Date(row.created_at + 'Z') // 添加Z表示UTC时间
      
      // 使用本地时区显示时间
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // 使用本地时区
      })
    },
    sorter: 'default'
  },
  {
    title: '商品名称',
    key: 'name',
    minWidth: 200,
    ellipsis: {
      tooltip: true
    },
    sorter: 'default'
  },
  {
    title: '价格',
    key: 'price',
    width: 100,
    render: (row) => row.price ? `¥${row.price.toFixed(2)}` : '-',
    sorter: (row1, row2) => (row1.price || 0) - (row2.price || 0)
  },
  {
    title: '销量',
    key: 'sales',
    width: 100,
    render: (row) => row.sales ? row.sales.toString() : '-',
    sorter: (row1, row2) => (row1.sales || 0) - (row2.sales || 0)
  },
  {
    title: '操作',
    key: 'actions',
    width: 180,
    fixed: 'right',
    render: (row) => h(NSpace, { size: 'small' }, {
      default: () => [
        h(NButton, {
          size: 'small',
          type: 'info',
          onClick: () => handleViewDetails(row.id)
        }, { default: () => '详情' }),
        h(NButton, {
          size: 'small',
          type: 'primary',
          onClick: () => emit('edit', row)
        }, { default: () => '编辑' }),
        h(NButton, {
          size: 'small',
          type: 'error',
          onClick: () => handleDelete(row.id)
        }, { default: () => '删除' })
      ]
    })
  }
]

const columns = createColumns()

const handleViewDetails = (id) => {
  router.push(`/product/${id}`)
}

const handleDelete = async (id) => {
  const d = proxy.$dialog.warning({
    title: '确认删除',
    content: '确定要删除这个商品吗？此操作不可恢复。',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      d.loading = true
      try {
        await deleteProduct(id)
        proxy.$message.success('删除成功')
        emit('refresh')
      } catch (error) {
        proxy.$message.error('删除失败')
      }
    }
  })
}
</script>