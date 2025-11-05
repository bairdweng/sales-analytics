import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据库文件路径
const dbPath = path.join(__dirname, '..', 'data.db');

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('连接数据库失败:', err.message);
  } else {
    console.log('成功连接到 SQLite 数据库');
    initDatabase();
  }
});

// 初始化数据库表
function initDatabase() {
  const createProductsTableSQL = `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT,
      model TEXT,
      link TEXT,
      cost REAL,
      price REAL,
      sales INTEGER,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createSalesRecordsTableSQL = `
    CREATE TABLE IF NOT EXISTS sales_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      date DATE NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    )
  `;

  const createCompetitorProductsTableSQL = `
    CREATE TABLE IF NOT EXISTS competitor_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      link TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    )
  `;

  db.run(createProductsTableSQL, (err) => {
    if (err) {
      console.error('创建products表失败:', err.message);
    } else {
      console.log('products 表已就绪');
      
      // 创建销量记录表
      db.run(createSalesRecordsTableSQL, (err) => {
        if (err) {
          console.error('创建sales_records表失败:', err.message);
        } else {
          console.log('sales_records 表已就绪');
          
          // 创建跟卖产品表
          db.run(createCompetitorProductsTableSQL, (err) => {
            if (err) {
              console.error('创建competitor_products表失败:', err.message);
            } else {
              console.log('competitor_products 表已就绪');
            }
          });
        }
      });
    }
  });
}

// 获取所有商品
function getAllProducts(callback) {
  const sql = 'SELECT * FROM products ORDER BY created_at DESC';
  db.all(sql, [], callback);
}

// 根据ID获取商品
function getProductById(id, callback) {
  const sql = 'SELECT * FROM products WHERE id = ?';
  db.get(sql, [id], callback);
}

// 新增商品
function createProduct(product, callback) {
  const sql = `
    INSERT INTO products (name, brand, model, link, cost, price, sales, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    product.name,
    product.brand,
    product.model,
    product.link,
    product.cost,
    product.price,
    product.sales,
    product.notes
  ];
  
  db.run(sql, params, function(err) {
    callback(err, this.lastID);
  });
}

// 更新商品
function updateProduct(id, product, callback) {
  const sql = `
    UPDATE products 
    SET name = ?, brand = ?, model = ?, link = ?, cost = ?, price = ?, sales = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  const params = [
    product.name,
    product.brand,
    product.model,
    product.link,
    product.cost,
    product.price,
    product.sales,
    product.notes,
    id
  ];
  
  db.run(sql, params, callback);
}

// 删除商品
function deleteProduct(id, callback) {
  const sql = 'DELETE FROM products WHERE id = ?';
  db.run(sql, [id], callback);
}

// 批量删除商品
function deleteProducts(ids, callback) {
  const placeholders = ids.map(() => '?').join(',');
  const sql = `DELETE FROM products WHERE id IN (${placeholders})`;
  db.run(sql, ids, callback);
}

// 销量记录相关函数

// 获取商品的所有销量记录
function getSalesRecordsByProductId(productId, callback) {
  const sql = 'SELECT * FROM sales_records WHERE product_id = ? ORDER BY date DESC';
  db.all(sql, [productId], callback);
}

// 根据ID获取销量记录
function getSalesRecordById(id, callback) {
  const sql = 'SELECT * FROM sales_records WHERE id = ?';
  db.get(sql, [id], callback);
}

// 新增销量记录
function createSalesRecord(record, callback) {
  const sql = `
    INSERT INTO sales_records (product_id, date, quantity, price, notes)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [
    record.product_id,
    record.date,
    record.quantity,
    record.price,
    record.notes
  ];
  
  db.run(sql, params, function(err) {
    callback(err, this.lastID);
  });
}

// 更新销量记录
function updateSalesRecord(id, record, callback) {
  const sql = `
    UPDATE sales_records 
    SET date = ?, quantity = ?, price = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  const params = [
    record.date,
    record.quantity,
    record.price,
    record.notes,
    id
  ];
  
  db.run(sql, params, callback);
}

// 删除销量记录
function deleteSalesRecord(id, callback) {
  const sql = 'DELETE FROM sales_records WHERE id = ?';
  db.run(sql, [id], callback);
}

// 批量删除销量记录
function deleteSalesRecords(ids, callback) {
  const placeholders = ids.map(() => '?').join(',');
  const sql = `DELETE FROM sales_records WHERE id IN (${placeholders})`;
  db.run(sql, ids, callback);
}

// 跟卖产品相关函数

// 获取商品的所有跟卖产品
function getCompetitorProductsByProductId(productId, callback) {
  const sql = 'SELECT * FROM competitor_products WHERE product_id = ? ORDER BY created_at DESC';
  db.all(sql, [productId], callback);
}

// 根据ID获取跟卖产品
function getCompetitorProductById(id, callback) {
  const sql = 'SELECT * FROM competitor_products WHERE id = ?';
  db.get(sql, [id], callback);
}

// 新增跟卖产品
function createCompetitorProduct(competitor, callback) {
  const sql = `
    INSERT INTO competitor_products (product_id, name, price, link)
    VALUES (?, ?, ?, ?)
  `;
  const params = [
    competitor.product_id,
    competitor.name,
    competitor.price,
    competitor.link
  ];
  
  db.run(sql, params, function(err) {
    callback(err, this.lastID);
  });
}

// 更新跟卖产品
function updateCompetitorProduct(id, competitor, callback) {
  const sql = `
    UPDATE competitor_products 
    SET name = ?, price = ?, link = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  const params = [
    competitor.name,
    competitor.price,
    competitor.link,
    id
  ];
  
  db.run(sql, params, callback);
}

// 删除跟卖产品
function deleteCompetitorProduct(id, callback) {
  const sql = 'DELETE FROM competitor_products WHERE id = ?';
  db.run(sql, [id], callback);
}

// 批量删除跟卖产品
function deleteCompetitorProducts(ids, callback) {
  const placeholders = ids.map(() => '?').join(',');
  const sql = `DELETE FROM competitor_products WHERE id IN (${placeholders})`;
  db.run(sql, ids, callback);
}

export {
  db,
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
};