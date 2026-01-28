const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

const analyticsController = {
  getAnalytics: (req, res) => {
    try {
      const analyticsData = {
        totalRecords: 150000,
        totalFeatures: 11,
        numericFeatures: 8,
        categoricalFeatures: 3,
        outliersCount: 245,
        missingValues: 0,
        classDistribution: {
          labels: ['No Default', 'Default'],
          data: [141500, 8500]
        },
        ageDistribution: {
          labels: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'],
          data: [12000, 35000, 42000, 38000, 20000, 3000]
        },
        incomeDistribution: {
          labels: ['<$25K', '$25K-$50K', '$50K-$75K', '$75K-$100K', '>$100K'],
          data: [28000, 45000, 38000, 25000, 14000]
        },
        debtRatioDistribution: {
          labels: ['<0.3', '0.3-0.5', '0.5-0.8', '>0.8'],
          data: [55000, 52000, 32000, 11000]
        }
      };

      res.json(analyticsData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  },

  getCorrelationMatrix: (req, res) => {
    try {
      const correlationMatrix = {
        features: ['Age', 'Income', 'DebtRatio', 'CreditScore', 'Default'],
        matrix: [
          [1.0, 0.32, -0.15, 0.28, -0.22],
          [0.32, 1.0, -0.67, 0.45, -0.51],
          [-0.15, -0.67, 1.0, -0.38, 0.61],
          [0.28, 0.45, -0.38, 1.0, -0.58],
          [-0.22, -0.51, 0.61, -0.58, 1.0]
        ]
      };

      res.json(correlationMatrix);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch correlation matrix' });
    }
  }
};

router.get('/', authenticateToken, analyticsController.getAnalytics);
router.get('/correlation', authenticateToken, analyticsController.getCorrelationMatrix);

module.exports = router;
