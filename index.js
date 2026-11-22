require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
// ... routes seront ajoutées plus tard
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));