const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');

router.post('/signup', adminController.createAdmin);
router.post('/login', adminController.authenticate);

module.exports = router;
