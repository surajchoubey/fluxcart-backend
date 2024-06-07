const express = require('express');
const router = express.Router();
const { identify, createOrder, getOrders} = require('./controllers');

// GET API to fetch messages
router.post('/identify', identify);

// POST API to add a new message
router.post('/orders', createOrder);

router.get('/orders', getOrders);

module.exports = router;
