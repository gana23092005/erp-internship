const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products',       require('./routes/products'));
app.use('/api/customers',      require('./routes/customers'));
app.use('/api/suppliers',      require('./routes/suppliers'));
app.use('/api/salesorders',    require('./routes/salesorders'));
app.use('/api/purchaseorders', require('./routes/purchaseorders'));
app.use('/api/grns',           require('./routes/grns'));
app.use('/api/invoices',       require('./routes/invoices'));
app.use('/api/users',          require('./routes/users'));

// Test route
app.get('/', (req, res) => res.send('ERP Backend is running! ✅'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.log('❌ DB Error:', err));