const categoryService = require('../services/categoryService');

async function getAll(req, res, next) {
  try {
    const categories = await categoryService.listCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const category = await categoryService.getCategory(req.params.id);
    res.json(category);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove };
