const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

const riskController = {
  getRiskAnalysis: (req, res) => {
    try {
      const riskAnalysis = {
        riskDistribution: {
          labels: ['Low Risk', 'Medium Risk', 'High Risk'],
          data: [67500, 52500, 30000],
          percentages: [45, 35, 20]
        },
        defaultProbabilityTrend: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [4.2, 4.5, 4.8, 5.1, 5.2, 5.3]
        },
        riskFactors: {
          'Debt Ratio': { impact: 40, trend: 'increasing' },
          'Payment History': { impact: 25, trend: 'stable' },
          'Income Level': { impact: 20, trend: 'stable' },
          'Credit Score': { impact: 15, trend: 'improving' }
        },
        userRiskMetrics: {
          avgDebtRatio: 0.42,
          avgCreditScore: 650,
          defaultRate: 0.052,
          avgAge: 39
        }
      };

      res.json(riskAnalysis);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch risk analysis' });
    }
  }
};

router.get('/', authenticateToken, riskController.getRiskAnalysis);

module.exports = router;
