const express = require('express');
const bankController = require('../controllers/bankController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Calculate credit score with bank inputs
router.post('/calculate-credit-score', bankController.calculateBankCreditScore);

// Get user's credit profile
router.get('/profile', bankController.getUserCreditProfile);

// Get user's goals
router.get('/goals', bankController.getUserGoals);

// Change password
router.post('/change-password', bankController.changePassword);

// Generate bank report (for PDF generation)
router.get('/generate-report', bankController.generateBankReport);

// Get user data for download
router.get('/download-data', bankController.getUserDataForDownload);

// Delete account
router.delete('/delete-account', bankController.deleteAccount);

module.exports = router;
