const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, dashboardController.getDashboardData);

module.exports = router;
