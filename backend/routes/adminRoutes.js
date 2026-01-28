const express = require('express');
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Admin routes - require authentication
router.get('/users', authenticateToken, adminController.getAllUsers);
router.get('/users/:id', authenticateToken, adminController.getUserById);
router.put('/users/:id/role', authenticateToken, adminController.updateUserRole);
router.delete('/users/:id', authenticateToken, adminController.disableUser);
router.get('/analytics', authenticateToken, adminController.getSystemAnalytics);

module.exports = router;
