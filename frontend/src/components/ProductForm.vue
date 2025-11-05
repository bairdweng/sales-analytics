<template>
  <n-modal :show="show" @update:show="handleUpdateShow" :mask-closable="false">
    <n-card
      style="width: 600px; max-width: 90vw"
      :title="editingProduct ? '编辑商品' : '新增商品'"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button quaternary circle @click="handleClose">
          <n-icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </n-icon>
        </n-button>
      </template>

      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-grid :cols="2" :x-gap="24">
          <n-gi>
            <n-form-item label="商品名称" path="name">
              <n-input
                v-model:value="formValue.name"
                placeholder="请输入商品名称"
                clearable
              />
            </n-form-item>
          </n-gi>
          
          <n-gi>
            <n-form-item label="品牌" path="brand">
              <n-input
                v-model:value="formValue.brand"
                placeholder="请输入品牌"
                clearable
              />
            </n-form-item>
          </n-gi>
          
          <n-gi>
            <n-form-item label="型号" path="model">
              <n-input
                v-model:value="formValue.model"
                placeholder="请输入型号"
                clearable
              />
            </n-form-item>
          </n-gi>
          
          <n-gi>
            <n-form-item label="链接" path="link">
              <n-input
                v-model:value="formValue.link"
                placeholder="请输入商品链接"
                clearable
              />
            </n-form-item>
          </n-gi>
          
          <n-gi>
            <n-form-item label="成本（元）" path="cost">
              <n-input-number
                v-model:value="formValue.cost"
                placeholder="请输入成本"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </n-form-item>
          </n-gi>
          
          <n-gi>
            <n-form-item label="价格（元）" path="price">
              <n-input-number
                v-model:value="formValue.price"
                placeholder="请输入价格"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </n-form-item>
          </n-gi>
          
          <n-gi>
            <n-form-item label="销量" path="sales">
              <n-input-number
                v-model:value="formValue.sales"
                placeholder="请输入销量"
                :min="0"
                style="width: 100%"
              />
            </n-form-item>
          </n-gi>
        </n-grid>
        
        <n-form-item label="备注" path="notes">
          <n-input
            v-model:value="formValue.notes"
            placeholder="请输入备注信息"
            type="textarea"
            :rows="3"
            clearable
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="handleClose">取消</n-button>
          <n-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ editingProduct ? '更新' : '提交' }}
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup>
import { ref, watch, nextTick, getCurrentInstance } from 'vue'
import { createProduct, updateProduct } from '../api/productApi.js'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  editingProduct: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:show', 'success'])

const { proxy } = getCurrentInstance()
const formRef = ref(null)
const submitting = ref(false)

const formValue = ref({
  name: '',
  brand: '',
  model: '',
  link: '',
  cost: null,
  price: null,
  sales: null,
  notes: ''
})

const rules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: ['input', 'blur'] }
  ]
}

const resetForm = () => {
  formValue.value = {
    name: '',
    brand: '',
    model: '',
    link: '',
    cost: null,
    price: null,
    sales: null,
    notes: ''
  }
}

const handleUpdateShow = (value) => {
  emit('update:show', value)
}

const handleClose = () => {
  emit('update:show', false)
}

const handleSubmit = async (e) => {
  e.preventDefault()
  
  try {
    await formRef.value?.validate()
    submitting.value = true
    
    const formData = { ...formValue.value }
    
    if (props.editingProduct) {
      await updateProduct(props.editingProduct.id, formData)
      proxy.$message.success('商品更新成功')
    } else {
      await createProduct(formData)
      proxy.$message.success('商品添加成功')
    }
    
    emit('success')
    emit('update:show', false)
    resetForm()
    
  } catch (error) {
    if (error.errors) {
      proxy.$message.error('请检查表单数据')
    } else {
      proxy.$message.error(props.editingProduct ? '更新失败' : '添加失败')
    }
  } finally {
    submitting.value = false
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    nextTick(() => {
      if (props.editingProduct) {
        formValue.value = { ...props.editingProduct }
      } else {
        resetForm()
      }
    })
  }
})

watch(() => props.editingProduct, (newVal) => {
  if (newVal) {
    formValue.value = { ...newVal }
  } else {
    resetForm()
  }
}, { immediate: true })
</script>