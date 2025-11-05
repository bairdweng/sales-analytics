import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

// 获取商品的所有跟卖产品
export const getCompetitorProducts = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}/competitors`);
    return response.data;
  } catch (error) {
    console.error('获取跟卖产品失败:', error);
    throw error;
  }
};

// 根据ID获取跟卖产品
export const getCompetitorProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/competitors/${id}`);
    return response.data;
  } catch (error) {
    console.error('获取跟卖产品详情失败:', error);
    throw error;
  }
};

// 新增跟卖产品
export const createCompetitorProduct = async (competitorData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/competitors`, competitorData);
    return response.data;
  } catch (error) {
    console.error('创建跟卖产品失败:', error);
    throw error;
  }
};

// 更新跟卖产品
export const updateCompetitorProduct = async (id, competitorData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/competitors/${id}`, competitorData);
    return response.data;
  } catch (error) {
    console.error('更新跟卖产品失败:', error);
    throw error;
  }
};

// 删除跟卖产品
export const deleteCompetitorProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/competitors/${id}`);
    return response.data;
  } catch (error) {
    console.error('删除跟卖产品失败:', error);
    throw error;
  }
};

// 批量删除跟卖产品
export const deleteCompetitorProducts = async (ids) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/competitors`, {
      data: { ids }
    });
    return response.data;
  } catch (error) {
    console.error('批量删除跟卖产品失败:', error);
    throw error;
  }
};