const pool = require('../config/db');

async function getAll() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM categories');
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
    const [rows] = await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

async function create(category) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO categories (name) VALUES (?)',
      [category.name]
    );
    return { id: result.insertId, ...category };
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

async function update(id, category) {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.execute(
      'UPDATE categories SET name = ? WHERE id = ?',
      [category.name, id]
    );
    return { id, ...category };
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
    await connection.execute('DELETE FROM categories WHERE id = ?', [id]);
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

module.exports = { getAll, getById, create, update, remove };
