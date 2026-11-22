const categoryRepo = require('../repositories/categoryRepository');
const productRepo = require('../repositories/productRepository');

async function listCategories() {
  return await categoryRepo.getAll();
}

async function getCategory(id) {
  const category = await categoryRepo.getById(id);
  if (!category) throw new Error('Category not found');
  return category;
}

async function createCategory(data) {
  return await categoryRepo.create(data);
}

async function updateCategory(id, data) {
  const existing = await categoryRepo.getById(id);
  if (!existing) throw new Error('Category not found');
  return await categoryRepo.update(id, data);
}

async function deleteCategory(id) {
  const existing = await categoryRepo.getById(id);
  if (!existing) throw new Error('Category not found');

  const products = await productRepo.getAll();
  const linked = products.filter((product) =>
    String(product.category_id) === String(id)
  );

  if (linked.length) {
    throw new Error('Cannot delete category with linked products');
  }

  await categoryRepo.remove(id);
}

module.exports = {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
