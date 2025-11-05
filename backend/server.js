import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProducts,
  getSalesRecordsByProductId,
  getSalesRecordById,
  createSalesRecord,
  updateSalesRecord,
  deleteSalesRecord,
  deleteSalesRecords,
  getCompetitorProductsByProductId,
  getCompetitorProductById,
  createCompetitorProduct,
  updateCompetitorProduct,
  deleteCompetitorProduct,
  deleteCompetitorProducts
} from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 获取所有商品
app.get('/products', (req, res) => {
  getAllProducts((err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// 根据ID获取商品
app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  getProductById(id, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: '商品未找到' });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// 新增商品
app.post('/products', (req, res) => {
  const product = req.body;
  
  // 验证必填字段
  if (!product.name) {
    res.status(400).json({ error: '商品名称是必填字段' });
    return;
  }
  
  createProduct(product, (err, lastID) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: '商品创建成功',
      data: { id: lastID, ...product }
    });
  });
});

// 更新商品
app.put('/products/:id', (req, res) => {
  const id = req.params.id;
  const product = req.body;
  
  // 验证必填字段
  if (!product.name) {
    res.status(400).json({ error: '商品名称是必填字段' });
    return;
  }
  
  updateProduct(id, product, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: '商品更新成功',
      data: { id: parseInt(id), ...product }
    });
  });
});

// 删除商品
app.delete('/products/:id', (req, res) => {
  const id = req.params.id;
  
  deleteProduct(id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: '商品删除成功'
    });
  });
});

// 批量删除商品
app.delete('/products', (req, res) => {
  const ids = req.body.ids;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: '请提供要删除的商品ID数组' });
    return;
  }
  
  deleteProducts(ids, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: `成功删除 ${ids.length} 个商品`
    });
  });
});

// 销量记录相关API

// 获取商品的所有销量记录
app.get('/products/:id/sales', (req, res) => {
  const productId = req.params.id;
  
  getSalesRecordsByProductId(productId, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// 根据ID获取销量记录
app.get('/sales/:id', (req, res) => {
  const id = req.params.id;
  
  getSalesRecordById(id, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: '销量记录未找到' });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// 新增销量记录
app.post('/sales', (req, res) => {
  const record = req.body;
  
  // 验证必填字段
  if (!record.product_id || !record.date || !record.quantity || !record.price) {
    res.status(400).json({ 
      error: 'product_id, date, quantity, price 都是必填字段' 
    });
    return;
  }
  
  createSalesRecord(record, (err, lastID) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: '销量记录创建成功',
      data: { id: lastID, ...record }
    });
  });
});

// 更新销量记录
app.put('/sales/:id', (req, res) => {
  const id = req.params.id;
  const record = req.body;
  
  // 验证必填字段
  if (!record.date || !record.quantity || !record.price) {
    res.status(400).json({ 
      error: 'date, quantity, price 都是必填字段' 
    });
    return;
  }
  
  updateSalesRecord(id, record, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: '销量记录更新成功',
      data: { id: parseInt(id), ...record }
    });
  });
});

// 删除销量记录
app.delete('/sales/:id', (req, res) => {
  const id = req.params.id;
  
  deleteSalesRecord(id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: '销量记录删除成功'
    });
  });
});

// 批量删除销量记录
app.delete('/sales', (req, res) => {
  const ids = req.body.ids;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: '请提供要删除的销量记录ID数组' });
    return;
  }
  
  deleteSalesRecords(ids, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: `成功删除 ${ids.length} 条销量记录`
    });
  });
});

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 跟卖产品相关API

// 获取商品的所有跟卖产品
app.get('/products/:id/competitors', (req, res) => {
  const productId = req.params.id;
  
  getCompetitorProductsByProductId(productId, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// 根据ID获取跟卖产品
app.get('/competitors/:id', (req, res) => {
  const id = req.params.id;
  
  getCompetitorProductById(id, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: '跟卖产品未找到' });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// 新增跟卖产品
app.post('/competitors', (req, res) => {
  const competitor = req.body;
  
  // 验证必填字段
  if (!competitor.product_id || !competitor.name || !competitor.price) {
    res.status(400).json({ 
      error: 'product_id, name, price 都是必填字段' 
    });
    return;
  }
  
  createCompetitorProduct(competitor, (err, lastID) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: '跟卖产品创建成功',
      data: { id: lastID, ...competitor }
    });
  });
});

// 更新跟卖产品
app.put('/competitors/:id', (req, res) => {
  const id = req.params.id;
  const competitor = req.body;
  
  // 验证必填字段
  if (!competitor.name || !competitor.price) {
    res.status(400).json({ 
      error: 'name, price 都是必填字段' 
    });
    return;
  }
  
  updateCompetitorProduct(id, competitor, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: '跟卖产品更新成功',
      data: { id: parseInt(id), ...competitor }
    });
  });
});

// 删除跟卖产品
app.delete('/competitors/:id', (req, res) => {
  const id = req.params.id;
  
  deleteCompetitorProduct(id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: '跟卖产品删除成功'
    });
  });
});

// 批量删除跟卖产品
app.delete('/competitors', (req, res) => {
  const ids = req.body.ids;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: '请提供要删除的跟卖产品ID数组' });
    return;
  }
  
  deleteCompetitorProducts(ids, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: `成功删除 ${ids.length} 个跟卖产品`
    });
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

export default app;