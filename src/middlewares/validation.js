const { body, param, validationResult } = require('express-validator');

const productRules = [
  body('name')
    .isString()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 chars'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be positive'),
  body('category_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('category_id must be a positive integer')
];

const categoryRules = [
  body('name')
    .isString()
    .isLength({ min: 2 })
    .withMessage('Category name too short')
];

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = { productRules, categoryRules, validate };
