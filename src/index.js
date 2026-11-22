require('dotenv').config();

const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(express.json());
app.use('/products', productRoutes);

app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
