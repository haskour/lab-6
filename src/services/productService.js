const productRepo = require('../repositories/productRepository');
const categoryRepo = require('../repositories/categoryRepository');
const pool = require('../config/db');

async function listProducts() {
  return await productRepo.getAll();
}

async function getProduct(id) {
  const product = await productRepo.getById(id);
  if (!product) throw new Error('Product not found');
  return product;
}

async function createProduct(data) {
  // Vérifier que la catégorie existe
  if (data.category_id) {
    const category = await categoryRepo.getById(data.category_id);
    if (!category) throw new Error('Invalid category_id');
  }
  return await productRepo.create(data);
}

async function updateProduct(id, data) {
  const existing = await productRepo.getById(id);
  if (!existing) throw new Error('Product not found');

  if (data.category_id) {
    const category = await categoryRepo.getById(data.category_id);
    if (!category) throw new Error('Invalid category_id');
  }

  return await productRepo.update(id, data);
}

async function deleteProduct(id) {
  const existing = await productRepo.getById(id);
  if (!existing) throw new Error('Product not found');
  await productRepo.remove(id);
}

async function searchProducts(filters) {
  return await productRepo.search(filters);
}

async function createProductWithCategory(product, categoryName) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let categoryId = product.category_id;

    if (categoryName) {
      const [categoryRows] = await connection.execute(
        'SELECT id FROM categories WHERE name = ?',
        [categoryName]
      );

      if (categoryRows.length) {
        categoryId = categoryRows[0].id;
      } else {
        const [categoryResult] = await connection.execute(
          'INSERT INTO categories (name) VALUES (?)',
          [categoryName]
        );
        categoryId = categoryResult.insertId;
      }
    }

    const [result] = await connection.execute(
      'INSERT INTO products (name,price,category_id) VALUES (?,?,?)',
      [product.name, product.price, categoryId]
    );

    await connection.commit();

    return {
      id: result.insertId,
      ...product,
      category_id: categoryId
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  createProductWithCategory
};
