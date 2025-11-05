<template>
  <n-config-provider :theme="theme">
    <n-layout style="height: 100vh">
      <n-layout-header bordered>
        <n-space justify="space-between" align="center" style="padding: 0 24px; height: 64px">
          <n-space align="center">
            <n-button text @click="$router.push('/')" style="font-size: 18px; color: #18a058">
              <template #icon>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                  </svg>
                </n-icon>
              </template>
              返回
            </n-button>
            <n-h1 style="margin: 0; font-size: 24px; color: #18a058">
              📊 商品详情 - {{ product?.name || '加载中...' }}
            </n-h1>
          </n-space>
          
          <n-button 
            @click="showSalesForm = true" 
            type="primary" 
            size="large"
            style="background: linear-gradient(135deg, #18a058 0%, #36ad6a 100%); border: none; box-shadow: 0 4px 12px rgba(24, 160, 88, 0.3);"
          >
            <template #icon>
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </n-icon>
            </template>
            添加销售记录
          </n-button>
        </n-space>
      </n-layout-header>
      
      <n-layout-content style="padding: 24px">
        <!-- 商品基本信息 -->
        <n-card title="商品信息" :bordered="false" style="margin-bottom: 24px">
          <template #header-extra>
            <n-space>
              <n-button 
                v-if="product?.link" 
                type="primary" 
                @click="openProductLink"
                :loading="linkLoading"
              >
                <template #icon>
                  <n-icon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                    </svg>
                  </n-icon>
                </template>
                打开商品链接
              </n-button>
            </n-space>
          </template>
          
          <n-grid :cols="2" :x-gap="24" :y-gap="16" v-if="product">
            <n-gi>
              <n-statistic label="商品名称" :value="product.name" />
            </n-gi>
            <n-gi>
              <n-statistic label="价格" :value="product.price" :precision="2" :animation="false">
                <template #prefix>¥</template>
              </n-statistic>
            </n-gi>
            <n-gi>
              <n-statistic label="总销量" :value="totalSales" :animation="false" />
            </n-gi>
            <n-gi>
              <n-statistic label="创建时间" :value="formatDate(product.created_at)" />
            </n-gi>
            <n-gi :span="4" v-if="product.link">
              <n-statistic label="商品链接" :value="product.link">
                <template #prefix>
                  <n-button 
                    text 
                    @click="copyProductLink"
                    style="margin-right: 8px"
                  >
                    <template #icon>
                      <n-icon>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                        </svg>
                      </n-icon>
                    </template>
                    复制链接
                  </n-button>
                </template>
              </n-statistic>
            </n-gi>
          </n-grid>
          <n-skeleton v-else height="100px" />
        </n-card>

        <!-- 销售记录表格 -->
        <n-card title="销售记录" :bordered="false">
          <template #header-extra>
            <n-space>
              <n-date-picker 
                v-model:value="dateRange" 
                type="daterange" 
                clearable
                placeholder="选择日期范围"
              />
              <n-button @click="fetchSalesRecords" :loading="loading">
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
            :columns="salesColumns"
            :data="filteredSalesRecords"
            :loading="loading"
            :pagination="pagination"
            :row-key="(row) => row.id"
            :scroll-x="800"
          />
        </n-card>

        <!-- 跟卖产品管理 -->
        <n-card title="跟卖产品" :bordered="false" style="margin-top: 24px">
          <template #header-extra>
            <n-button 
              @click="showCompetitorForm = true" 
              type="primary" 
              size="large"
              style="background: linear-gradient(135deg, #18a058 0%, #36ad6a 100%); border: none; box-shadow: 0 4px 12px rgba(24, 160, 88, 0.3);"
            >
              <template #icon>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </n-icon>
              </template>
              添加跟卖产品
            </n-button>
          </template>
          <n-data-table
            :columns="competitorColumns"
            :data="competitorProducts"
            :pagination="competitorPagination"
            :loading="loading"
            :row-key="(row) => row.id"
            :scroll-x="800"
          />
        </n-card>
      </n-layout-content>
    </n-layout>

    <!-- 添加销售记录模态框 -->
    <n-modal v-model:show="showSalesForm" :mask-closable="false">
      <n-card
        style="width: 500px; max-width: 90vw"
        title="添加销售记录"
        :bordered="false"
        size="huge"
      >
        <n-form
          ref="salesFormRef"
          :model="salesForm"
          :rules="salesRules"
          label-placement="left"
          label-width="auto"
        >
          <n-form-item label="日期" path="date">
            <n-date-picker
              v-model:value="salesForm.date"
              type="date"
              style="width: 100%"
              placeholder="选择销售日期"
            />
          </n-form-item>
          
          <n-form-item label="销量" path="sales">
            <n-input-number
              v-model:value="salesForm.sales"
              placeholder="请输入销量"
              :min="1"
              style="width: 100%"
            />
          </n-form-item>
          
          <n-form-item label="价格（元）" path="price">
            <n-input-number
              v-model:value="salesForm.price"
              placeholder="请输入价格"
              :min="0"
              :precision="2"
              style="width: 100%"
            />
          </n-form-item>
          
          <n-form-item label="备注" path="notes">
            <n-input
              v-model:value="salesForm.notes"
              placeholder="请输入备注信息"
              type="textarea"
              :rows="2"
              clearable
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <n-space justify="end">
            <n-button @click="showSalesForm = false">取消</n-button>
            <n-button type="primary" @click="handleAddSalesRecord" :loading="submitting">
              提交
            </n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>

    <!-- 跟卖产品表单模态框 -->
    <n-modal v-model:show="showCompetitorForm" :mask-closable="false">
      <n-card
        style="width: 600px; max-width: 90vw;"
        :title="editingCompetitor ? '编辑跟卖产品' : '添加跟卖产品'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button quaternary circle @click="showCompetitorForm = false">
            <template #icon>
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </n-icon>
            </template>
          </n-button>
        </template>
        
        <n-form
          ref="competitorFormRef"
          :model="competitorForm"
          :rules="competitorRules"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
          size="large"
        >
          <n-form-item label="产品名称" path="name">
            <n-input
              v-model:value="competitorForm.name"
              placeholder="请输入跟卖产品名称"
              clearable
            />
          </n-form-item>
          
          <n-form-item label="价格" path="price">
            <n-input-number
              v-model:value="competitorForm.price"
              placeholder="请输入价格"
              :min="0"
              :step="0.01"
              style="width: 100%"
              clearable
            />
          </n-form-item>
          
          <n-form-item label="产品链接" path="link">
            <n-input
              v-model:value="competitorForm.link"
              placeholder="请输入产品链接"
              clearable
            />
          </n-form-item>
        </n-form>
        
        <template #footer>
          <n-space justify="end">
            <n-button @click="showCompetitorForm = false">取消</n-button>
            <n-button
              type="primary"
              :loading="submitting"
              @click="editingCompetitor ? handleUpdateCompetitor() : handleAddCompetitor()"
            >
              {{ editingCompetitor ? '更新' : '添加' }}
            </n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </n-config-provider>
</template>

<script setup>
import { ref, computed, onMounted, watch, h, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { darkTheme, NSpace, NButton } from 'naive-ui'
import { getProductById } from '../api/productApi.js'
import { 
  getSalesRecords, 
  createSalesRecord, 
  updateSalesRecord, 
  deleteSalesRecord 
} from '../api/salesApi.js'
import {
  getCompetitorProducts,
  createCompetitorProduct,
  updateCompetitorProduct,
  deleteCompetitorProduct
} from '../api/competitorApi.js'

const route = useRoute()
const router = useRouter()
const theme = darkTheme
const { proxy } = getCurrentInstance()
const $message = proxy.$message
const $dialog = proxy.$dialog

const product = ref(null)
const salesRecords = ref([])
const competitorProducts = ref([])
const loading = ref(false)
const showSalesForm = ref(false)
const showCompetitorForm = ref(false)
const submitting = ref(false)
const dateRange = ref(null)
const linkLoading = ref(false)

const salesForm = ref({
  date: Date.now(),
  sales: 1,
  price: 0,
  notes: ''
})

const competitorForm = ref({
  name: '',
  price: 0,
  link: ''
})

const salesFormRef = ref(null)
const competitorFormRef = ref(null)
const editingSalesRecord = ref(null)
const editingCompetitor = ref(null)

const salesRules = {
  date: [
    { 
      required: true, 
      validator: (rule, value) => {
        return value && value > 0;
      },
      message: '请选择销售日期', 
      trigger: ['change', 'blur'] 
    }
  ],
  sales: [
    { 
      required: true, 
      validator: (rule, value) => {
        return value !== null && value !== undefined && value >= 1;
      },
      message: '请输入销量（至少1）', 
      trigger: ['change', 'blur'] 
    }
  ],
  price: [
    { 
      required: true, 
      validator: (rule, value) => {
        return value !== null && value !== undefined && value >= 0;
      },
      message: '请输入价格', 
      trigger: ['change', 'blur'] 
    }
  ]
}

const competitorRules = {
  name: [
    { 
      required: true, 
      message: '请输入跟卖产品名称', 
      trigger: ['change', 'blur'] 
    }
  ],
  price: [
    { 
      required: true, 
      validator: (rule, value) => {
        return value !== null && value !== undefined && value >= 0;
      },
      message: '请输入价格', 
      trigger: ['change', 'blur'] 
    }
  ]
}

// 计算属性
const totalSales = computed(() => {
  return salesRecords.value.reduce((sum, record) => sum + record.sales, 0)
})

// 计算累计销量
const calculateCumulativeSales = (records) => {
  // 按日期排序
  const sortedRecords = [...records].sort((a, b) => new Date(a.date) - new Date(b.date))
  
  let cumulative = 0
  return sortedRecords.map(record => {
    cumulative += record.sales
    return {
      ...record,
      cumulativeSales: cumulative
    }
  })
}

// 过滤后的销售记录（包含累计销量）
const filteredSalesRecords = computed(() => {
  let records = salesRecords.value
  
  if (dateRange.value) {
    const [start, end] = dateRange.value
    records = records.filter(record => {
      const recordDate = new Date(record.date).getTime()
      return recordDate >= start && recordDate <= end
    })
  }
  
  // 计算累计销量
  const recordsWithCumulative = calculateCumulativeSales(records)
  
  return recordsWithCumulative.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const profitRate = computed(() => {
  if (!product.value?.cost) return 0
  const avgPrice = salesRecords.value.reduce((sum, record) => sum + record.price * record.sales, 0) / totalSales.value
  return ((avgPrice - product.value.cost) / product.value.cost * 100).toFixed(1)
})

// 表格列定义
const salesColumns = [
  {
    title: '日期',
    key: 'date',
    width: 120,
    render: (row) => formatDate(row.date)
  },
  {
    title: '当日销量',
    key: 'sales',
    width: 100,
    sorter: 'default'
  },
  {
    title: '累计销量',
    key: 'cumulativeSales',
    width: 100,
    sorter: 'default'
  },
  {
    title: '价格',
    key: 'price',
    width: 100,
    render: (row) => `¥${row.price.toFixed(2)}`,
    sorter: 'default'
  },
  {
    title: '销售额',
    key: 'revenue',
    width: 120,
    render: (row) => `¥${(row.sales * row.price).toFixed(2)}`,
    sorter: (a, b) => (a.sales * a.price) - (b.sales * b.price)
  },
  {
    title: '备注',
    key: 'notes',
    width: 200,
    ellipsis: { tooltip: true }
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'right',
    render: (row) => h(NSpace, { size: 'small' }, {
      default: () => [
        h(NButton, {
          size: 'small',
          type: 'primary',
          onClick: () => handleEditSales(row)
        }, { default: () => '编辑' }),
        h(NButton, {
          size: 'small',
          type: 'error',
          onClick: () => handleDeleteSales(row.id)
        }, { default: () => '删除' })
      ]
    })
  }
]

const pagination = ref({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50]
})

// 跟卖产品表格列定义
const competitorColumns = [
  {
    title: '产品名称',
    key: 'name',
    width: 200,
    ellipsis: { tooltip: true }
  },
  {
    title: '价格',
    key: 'price',
    width: 120,
    render: (row) => `¥${row.price.toFixed(2)}`,
    sorter: 'default'
  },
  {
    title: '差价',
    key: 'priceDifference',
    width: 120,
    render: (row) => {
      const currentPrice = product.value?.price || 0
      const difference = currentPrice - row.price
      const color = difference > 0 ? '#18a058' : difference < 0 ? '#d03050' : '#909399'
      const symbol = difference > 0 ? '+' : ''
      return h('span', { style: { color } }, `${symbol}¥${Math.abs(difference).toFixed(2)}`)
    },
    sorter: 'default'
  },
  {
    title: '链接',
    key: 'link',
    width: 200,
    ellipsis: { tooltip: true },
    render: (row) => row.link ? h('a', { 
      href: row.link.startsWith('http') ? row.link : `https://${row.link}`,
      target: '_blank',
      style: 'color: #18a058; text-decoration: none;'
    }, row.link) : '无'
  },
  {
    title: '创建时间',
    key: 'created_at',
    width: 150,
    render: (row) => formatDate(row.created_at)
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'right',
    render: (row) => h(NSpace, { size: 'small' }, {
      default: () => [
        h(NButton, {
          size: 'small',
          type: 'primary',
          onClick: () => handleEditCompetitor(row)
        }, { default: () => '编辑' }),
        h(NButton, {
          size: 'small',
          type: 'error',
          onClick: () => handleDeleteCompetitor(row.id)
        }, { default: () => '删除' })
      ]
    })
  }
]

const competitorPagination = ref({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50]
})

// 方法
const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    // 处理不同类型的日期格式
    let date;
    if (typeof dateString === 'string') {
      // 如果是ISO格式字符串（如2025-11-05T12:41:53.452Z），直接解析
      if (dateString.includes('T')) {
        date = new Date(dateString);
      } else {
        // 如果是数据库的created_at格式（如2025-11-05 16:42:01），添加Z表示UTC
        date = new Date(dateString + 'Z');
      }
    } else {
      date = new Date(dateString);
    }
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return '无效日期';
    }
    
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
    });
  } catch (error) {
    console.error('日期格式化错误:', error, dateString);
    return '日期错误';
  }
}

const fetchProduct = async () => {
  try {
    const response = await getProductById(route.params.id)
    product.value = response.data
  } catch (error) {
    console.error('获取商品详情失败:', error)
    $message.error('获取商品详情失败')
  }
}

const fetchSalesRecords = async () => {
  loading.value = true
  try {
    console.log('开始获取销售记录，商品ID:', route.params.id)
    const response = await getSalesRecords(route.params.id)
    console.log('API返回的数据结构:', response)
    
    // 根据API返回的数据结构调整
    const salesData = response.data || response || []
    console.log('后端返回的原始数据:', salesData)
    
    // 将后端返回的quantity字段映射为前端的sales字段
    const mappedRecords = (salesData || []).map(record => ({
      ...record,
      sales: record.quantity  // 将quantity映射为sales
    }))
    
    console.log('映射后的销售记录:', mappedRecords)
    salesRecords.value = mappedRecords
    
  } catch (error) {
    console.error('获取销售记录失败:', error)
    $message.error('获取销售记录失败')
  } finally {
    loading.value = false
  }
}

const handleAddSalesRecord = async () => {
  try {
    await salesFormRef.value?.validate()
    submitting.value = true
    
    console.log('表单数据:', salesForm.value)
    console.log('路由参数ID:', route.params.id)
    
    const formData = {
      product_id: parseInt(route.params.id),
      date: new Date(salesForm.value.date).toISOString(),
      quantity: salesForm.value.sales,  // 使用quantity字段
      price: salesForm.value.price,
      notes: salesForm.value.notes
    }
    
    console.log('发送的数据:', formData)
    
    await createSalesRecord(formData)
    $message.success('销售记录添加成功')
    showSalesForm.value = false
    fetchSalesRecords()
    
    // 重置表单
    salesForm.value = {
      date: Date.now(),
      sales: 1,
      price: 0,
      notes: ''
    }
    
  } catch (error) {
    console.error('添加销售记录错误详情:', error)
    console.error('错误响应数据:', error.response?.data)
    if (error.errors) {
      $message.error('请检查表单数据')
    } else {
      $message.error('添加销售记录失败')
    }
  } finally {
    submitting.value = false
  }
}

const handleEditSales = (record) => {
  // 编辑销售记录逻辑
  console.log('编辑销售记录:', record)
}

const handleDeleteSales = async (id) => {
  const d = $dialog.warning({
    title: '确认删除',
    content: '确定要删除这条销售记录吗？',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      d.loading = true
      try {
        await deleteSalesRecord(id)
        $message.success('删除成功')
        fetchSalesRecords()
      } catch (error) {
        $message.error('删除失败')
      }
    }
  })
}

// 打开商品链接
const openProductLink = () => {
  if (!product.value?.link) {
    $message.warning('商品链接不存在')
    return
  }
  
  linkLoading.value = true
  
  try {
    // 确保链接有正确的协议
    let url = product.value.link
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    
    // 在新标签页打开链接
    window.open(url, '_blank')
    $message.success('正在打开商品链接')
  } catch (error) {
    console.error('打开链接失败:', error)
    $message.error('打开链接失败，请检查链接格式')
  } finally {
    linkLoading.value = false
  }
}

// 复制商品链接
const copyProductLink = async () => {
  if (!product.value?.link) {
    $message.warning('商品链接不存在')
    return
  }
  
  try {
    // 使用现代浏览器的 Clipboard API
    await navigator.clipboard.writeText(product.value.link)
    $message.success('链接已复制到剪贴板')
  } catch (error) {
    console.error('复制链接失败:', error)
    
    // 降级方案：使用传统方法
    try {
      const textArea = document.createElement('textarea')
      textArea.value = product.value.link
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      $message.success('链接已复制到剪贴板')
    } catch (fallbackError) {
      console.error('降级复制也失败:', fallbackError)
      $message.error('复制链接失败，请手动复制')
    }
  }
}
// 获取跟卖产品列表
const fetchCompetitorProducts = async () => {
  try {
    const response = await getCompetitorProducts(route.params.id)
    competitorProducts.value = response.data || []
  } catch (error) {
    console.error('获取跟卖产品失败:', error)
    $message.error('获取跟卖产品失败')
  }
}

// 添加跟卖产品
const handleAddCompetitor = async () => {
  try {
    await competitorFormRef.value?.validate()
    submitting.value = true
    
    const formData = {
      product_id: parseInt(route.params.id),
      name: competitorForm.value.name,
      price: competitorForm.value.price,
      link: competitorForm.value.link
    }
    
    await createCompetitorProduct(formData)
    $message.success('跟卖产品添加成功')
    showCompetitorForm.value = false
    resetCompetitorForm()
    fetchCompetitorProducts()
  } catch (error) {
    console.error('添加跟卖产品失败:', error)
    $message.error('添加跟卖产品失败')
  } finally {
    submitting.value = false
  }
}

// 编辑跟卖产品
const handleEditCompetitor = (competitor) => {
  editingCompetitor.value = competitor
  competitorForm.value = {
    name: competitor.name,
    price: competitor.price,
    link: competitor.link || ''
  }
  showCompetitorForm.value = true
}

// 更新跟卖产品
const handleUpdateCompetitor = async () => {
  try {
    await competitorFormRef.value?.validate()
    submitting.value = true
    
    const formData = {
      name: competitorForm.value.name,
      price: competitorForm.value.price,
      link: competitorForm.value.link
    }
    
    await updateCompetitorProduct(editingCompetitor.value.id, formData)
    $message.success('跟卖产品更新成功')
    showCompetitorForm.value = false
    resetCompetitorForm()
    fetchCompetitorProducts()
  } catch (error) {
    console.error('更新跟卖产品失败:', error)
    $message.error('更新跟卖产品失败')
  } finally {
    submitting.value = false
  }
}

// 删除跟卖产品
const handleDeleteCompetitor = async (id) => {
  const d = $dialog.warning({
    title: '确认删除',
    content: '确定要删除这个跟卖产品吗？',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      d.loading = true
      try {
        await deleteCompetitorProduct(id)
        $message.success('删除成功')
        fetchCompetitorProducts()
      } catch (error) {
        $message.error('删除失败')
      }
    }
  })
}

// 重置跟卖产品表单
const resetCompetitorForm = () => {
  competitorForm.value = {
    name: '',
    price: 0,
    link: ''
  }
  editingCompetitor.value = null
}

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchProduct()
    fetchSalesRecords()
    fetchCompetitorProducts()
  }
}, { immediate: true })

onMounted(() => {
  if (route.params.id) {
    fetchProduct()
    fetchSalesRecords()
    fetchCompetitorProducts()
  }
})
</script>