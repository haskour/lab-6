USE lab_product;

INSERT INTO categories (name)
VALUES ('Électronique'), ('Livres'), ('Vêtements');

INSERT INTO products (name, price, category_id)
VALUES
  ('Smartphone', 699.99, 1),
  ('Roman', 14.99, 2),
  ('T-shirt', 19.99, 3);
