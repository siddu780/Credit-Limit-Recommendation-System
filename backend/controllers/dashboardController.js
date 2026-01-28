const dashboardController = {
  getDashboardData: (req, res) => {
    try {
      const dashboardData = {
        totalUsers: 1234,
        avgCreditLimit: 15450,
        defaultRate: 5.2,
        modelAccuracy: 92.5,
        creditRiskDistribution: {
          labels: ['Low Risk', 'Medium Risk', 'High Risk'],
          data: [45, 35, 20],
        },
        incomeVsDebt: {
          labels: ['$0-25K', '$25K-50K', '$50K-75K', '$75K+'],
          data: [120, 150, 100, 80],
        },
      };

      res.json(dashboardData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
  },
};

module.exports = dashboardController;
