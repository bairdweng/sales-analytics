import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

// 获取商品的所有销量记录
export const getSalesRecords = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}/sales`);
    return response.data.data;
  } catch (error) {
    console.error('获取销量记录失败:', error);
    throw error;
  }
};

// 根据ID获取销量记录
export const getSalesRecordById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sales/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('获取销量记录失败:', error);
    throw error;
  }
};

// 新增销量记录
export const createSalesRecord = async (record) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sales`, record);
    return response.data.data;
  } catch (error) {
    console.error('创建销量记录失败:', error);
    throw error;
  }
};

// 更新销量记录
export const updateSalesRecord = async (id, record) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/sales/${id}`, record);
    return response.data.data;
  } catch (error) {
    console.error('更新销量记录失败:', error);
    throw error;
  }
};

// 删除销量记录
export const deleteSalesRecord = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/sales/${id}`);
    return response.data;
  } catch (error) {
    console.error('删除销量记录失败:', error);
    throw error;
  }
};

// 批量删除销量记录
export const deleteSalesRecords = async (ids) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/sales`, {
      data: { ids }
    });
    return response.data;
  } catch (error) {
    console.error('批量删除销量记录失败:', error);
    throw error;
  }
};