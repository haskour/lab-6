const pool = require('../config/db');

async function getAll() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM products');
    return rows;
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

async function getById(id) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

async function create(product) {
  let connection;
  try {
    const { name, price, category_id } = product;
    connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO products (name,price,category_id) VALUES (?,?,?)',
      [name, price, category_id]
    );
    return { id: result.insertId, ...product };
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

async function update(id, product) {
  let connection;
  try {
    const { name, price, category_id } = product;
    connection = await pool.getConnection();
    await connection.execute(
      'UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?',
      [name, price, category_id, id]
    );
    return { id, ...product };
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

async function remove(id) {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.execute('DELETE FROM products WHERE id = ?', [id]);
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

async function search({ name, minPrice, maxPrice, categoryId, limit = 10, offset = 0, sort = 'name' }) {
  let connection;
  try {
    const allowedSortColumns = ['id', 'name', 'price', 'category_id'];
    const sortColumn = allowedSortColumns.includes(sort) ? sort : 'name';

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (name) {
      sql += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }
    if (minPrice !== undefined) {
      sql += ' AND price >= ?';
      params.push(minPrice);
    }
    if (maxPrice !== undefined) {
      sql += ' AND price <= ?';
      params.push(maxPrice);
    }
    if (categoryId !== undefined) {
      sql += ' AND category_id = ?';
      params.push(categoryId);
    }

    sql += ` ORDER BY ${sortColumn} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    connection = await pool.getConnection();
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

module.exports = { getAll, getById, create, update, remove, search };
