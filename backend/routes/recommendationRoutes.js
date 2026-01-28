const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

const recommendationController = {
  getRecommendation: (req, res) => {
    try {
      const {
        age,
        income,
        debtRatio,
        dependents,
        creditScore,
        monthlyIncome,
        numberOfOpenCreditLinesAndLoans,
        numberOfTimes90DaysLate,
      } = req.body;

      // Simple calculation logic (in production, call ML model)
      const baseLimit = income * 0.3;
      const creditAdjustment = (creditScore - 300) / 550;
      const debtAdjustment = (1 - debtRatio) * 0.5;
      
      const recommendedLimit = baseLimit * (0.5 + creditAdjustment + debtAdjustment);
      const riskLevel = numberOfTimes90DaysLate > 0 ? 'High Risk' : 'Low Risk';
      const riskProbability = (numberOfTimes90DaysLate * 0.2) + (debtRatio * 0.3);
      const defaultProbability = Math.min(riskProbability, 0.8);

      // Financial health score
      let healthScore = 50;
      if (income > 50000) healthScore += 15;
      if (debtRatio < 0.3) healthScore += 20;
      if (creditScore > 700) healthScore += 15;
      if (numberOfTimes90DaysLate === 0) healthScore += 10;

      healthScore = Math.min(100, healthScore);

      const recommendations = [];
      if (debtRatio > 0.5) {
        recommendations.push('⚠️ Focus on reducing debt ratio for better credit profile');
      }
      if (creditScore < 600) {
        recommendations.push('📈 Work on improving credit score');
      }
      if (numberOfTimes90DaysLate > 0) {
        recommendations.push('⏰ Ensure timely payments going forward');
      }
      if (income < 30000) {
        recommendations.push('💰 Consider increasing income sources');
      }

      res.json({
        creditLimit: Math.round(recommendedLimit),
        creditCategory: recommendedLimit > 15000 ? 'Premium' : recommendedLimit > 8000 ? 'Standard' : 'Basic',
        riskLevel,
        riskProbability: Math.min(1, riskProbability),
        defaultProbability: Math.min(1, defaultProbability),
        healthScore,
        healthStatus: healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Fair',
        recommendations: recommendations.slice(0, 5)
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to get recommendation' });
    }
  }
};

router.post('/', authenticateToken, recommendationController.getRecommendation);

module.exports = router;
