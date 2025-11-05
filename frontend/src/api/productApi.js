import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)

// 获取所有商品
export const getProducts = () => api.get('/products')

// 根据ID获取商品
export const getProductById = (id) => api.get(`/products/${id}`)

// 新增商品
export const createProduct = (product) => api.post('/products', product)

// 更新商品
export const updateProduct = (id, product) => api.put(`/products/${id}`, product)

// 删除商品
export const deleteProduct = (id) => api.delete(`/products/${id}`)

// 批量删除商品
export const deleteProducts = (ids) => api.delete('/products', { data: { ids } })