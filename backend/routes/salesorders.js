const router = require('express').Router();
const SalesOrder = require('../models/SalesOrder');

// Get all sales orders
router.get('/', async (req, res) => {
  try {
    const orders = await SalesOrder.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create sales order
router.post('/', async (req, res) => {
  try {
    const order = await SalesOrder.create(req.body);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update sales order
router.put('/:id', async (req, res) => {
  try {
    const order = await SalesOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete sales order
router.delete('/:id', async (req, res) => {
  try {
    await SalesOrder.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;