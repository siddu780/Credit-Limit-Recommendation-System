const UserCreditProfile = require('../models/UserCreditProfile');
const User = require('../models/User');
const bcryptjs = require('bcryptjs');

// Calculate Credit Score based on bank inputs
exports.calculateBankCreditScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      income,
      existingLoans,
      outstandingBalances,
      creditHistoryMonths,
      employmentStatus,
      yearsAtCurrentJob,
    } = req.body;

    // Validate inputs
    if (!income || income <= 0) {
      return res.status(400).json({ error: 'Invalid income' });
    }

    // Find or create profile
    let profile = await UserCreditProfile.findOne({ where: { userId } });

    // Calculate credit score (300-850)
    let creditScore = 600; // Base score

    // Factor 1: Income Level (0-100 points)
    if (income < 30000) creditScore += 20;
    else if (income < 60000) creditScore += 40;
    else if (income < 100000) creditScore += 70;
    else creditScore += 100;

    // Factor 2: Debt vs Income (0-150 points)
    const debtToIncomeRatio = existingLoans / income;
    if (debtToIncomeRatio < 0.1) creditScore += 150;
    else if (debtToIncomeRatio < 0.3) creditScore += 120;
    else if (debtToIncomeRatio < 0.5) creditScore += 80;
    else if (debtToIncomeRatio < 0.7) creditScore += 40;
    else creditScore -= 20;

    // Factor 3: Credit History Length (0-80 points)
    if (creditHistoryMonths < 6) creditScore += 10;
    else if (creditHistoryMonths < 12) creditScore += 30;
    else if (creditHistoryMonths < 24) creditScore += 50;
    else creditScore += 80;

    // Factor 4: Employment Stability (0-100 points)
    if (employmentStatus === 'employed') {
      if (yearsAtCurrentJob < 1) creditScore += 40;
      else if (yearsAtCurrentJob < 3) creditScore += 70;
      else creditScore += 100;
    } else if (employmentStatus === 'self-employed') {
      creditScore += 50;
    } else if (employmentStatus === 'retired') {
      creditScore += 70;
    } else {
      creditScore -= 50;
    }

    // Factor 5: Outstanding Balances (0-100 points)
    const utilizationRatio = outstandingBalances / income;
    if (utilizationRatio < 0.1) creditScore += 100;
    else if (utilizationRatio < 0.2) creditScore += 80;
    else if (utilizationRatio < 0.3) creditScore += 60;
    else if (utilizationRatio < 0.5) creditScore += 30;
    else creditScore -= 20;

    // Ensure score is between 300-850
    creditScore = Math.max(300, Math.min(850, creditScore));

    // Determine risk category
    let riskCategory = 'low';
    let defaultProbability = 2;
    if (creditScore < 650) {
      riskCategory = 'high';
      defaultProbability = 12;
    } else if (creditScore < 700) {
      riskCategory = 'medium';
      defaultProbability = 7;
    }

    // Calculate recommended credit limit
    const recommendedCreditLimit = Math.round((income * 0.3) / (1 + debtToIncomeRatio));

    // Calculate debt ratio
    const debtRatio = (existingLoans + outstandingBalances) / income;

    // Update or create profile
    if (profile) {
      await profile.update({
        income,
        existingLoans,
        outstandingBalances,
        creditHistoryMonths,
        employmentStatus,
        yearsAtCurrentJob,
        creditScore,
        riskCategory,
        defaultProbability,
        recommendedCreditLimit,
        debtRatio,
      });
    } else {
      profile = await UserCreditProfile.create({
        userId,
        income,
        existingLoans,
        outstandingBalances,
        creditHistoryMonths,
        employmentStatus,
        yearsAtCurrentJob,
        creditScore,
        riskCategory,
        defaultProbability,
        recommendedCreditLimit,
        debtRatio,
        age: 30, // Default
      });
    }

    res.json({
      creditScore,
      riskCategory,
      defaultProbability,
      recommendedCreditLimit,
      debtRatio: debtRatio.toFixed(2),
      message: 'Credit score calculated successfully',
    });
  } catch (error) {
    console.error('Bank Controller Error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: error.message || 'Failed to calculate credit score' });
  }
};

// Get user's current credit profile
exports.getUserCreditProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await UserCreditProfile.findOne({ where: { userId } });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Get user goals based on current profile
exports.getUserGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await UserCreditProfile.findOne({ where: { userId } });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const currentScore = profile.creditScore || 650;
    const targetScore = profile.goalTargetScore || 750;
    const currentLimit = profile.recommendedCreditLimit || 5000;
    const targetLimit = profile.goalTargetLimit || 15000;

    // Calculate milestones
    const scoreGap = targetScore - currentScore;
    const limitGap = targetLimit - currentLimit;

    const goals = {
      creditScoreGoal: {
        current: currentScore,
        target: targetScore,
        gap: scoreGap,
        timeline: scoreGap > 50 ? '6 months' : scoreGap > 20 ? '3 months' : '1 month',
        actionItems: [
          'Pay all bills on time',
          'Reduce credit utilization to below 30%',
          'Keep old accounts open',
          `You need ${scoreGap} more points to reach target`,
        ],
      },
      creditLimitGoal: {
        current: currentLimit,
        target: targetLimit,
        gap: limitGap,
        timeline: limitGap > 5000 ? '6 months' : limitGap > 2000 ? '3 months' : '1 month',
        actionItems: [
          'Increase income if possible',
          'Reduce outstanding debt',
          'Improve credit score',
          `You can get up to $${Math.round(limitGap)} more in credit limit`,
        ],
      },
      loanEligibility: {
        status: profile.riskCategory === 'low' ? 'Pre-approved' : profile.riskCategory === 'medium' ? 'Conditional' : 'Not eligible yet',
        defaultRisk: `${profile.defaultProbability}%`,
        recommendations: [
          profile.riskCategory === 'high' ? 'Work on reducing debt first' : 'You\'re on track',
          profile.riskCategory === 'high' ? 'Build 6 months of on-time payments' : 'Consider a higher amount',
          'Interest rate: Based on credit score',
          'Approval likely within 2-3 business days',
        ],
      },
    };

    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Validate password strength (uppercase, number, special char)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        error: 'Password must contain uppercase letter, number, and special character (@$!%*?&)',
      });
    }

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update password
    await user.update({ password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

// Generate bank report data
exports.generateBankReport = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    const profile = await UserCreditProfile.findOne({ where: { userId } });

    if (!user || !profile) {
      return res.status(404).json({ error: 'User or profile not found' });
    }

    const reportData = {
      user: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      profile: {
        creditScore: profile.creditScore,
        riskCategory: profile.riskCategory,
        defaultProbability: profile.defaultProbability,
        recommendedCreditLimit: profile.recommendedCreditLimit,
        income: profile.income,
        existingLoans: profile.existingLoans,
        outstandingBalances: profile.outstandingBalances,
        debtRatio: profile.debtRatio,
        employmentStatus: profile.employmentStatus,
        yearsAtCurrentJob: profile.yearsAtCurrentJob,
      },
      generatedAt: new Date().toISOString(),
    };

    res.json(reportData);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

// Get user data for download
exports.getUserDataForDownload = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    const profile = await UserCreditProfile.findOne({ where: { userId } });

    if (!user || !profile) {
      return res.status(404).json({ error: 'User or profile not found' });
    }

    const userData = {
      profile: {
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      creditProfile: {
        creditScore: profile.creditScore,
        creditLimit: profile.creditLimit,
        income: profile.income,
        debtRatio: profile.debtRatio,
        riskCategory: profile.riskCategory,
        employmentStatus: profile.employmentStatus,
        creditHistoryMonths: profile.creditHistoryMonths,
      },
      recommendations: {
        recommendedCreditLimit: profile.recommendedCreditLimit,
        defaultProbability: profile.defaultProbability,
        riskAssessment: profile.riskCategory,
      },
      goals: {
        targetScore: profile.goalTargetScore,
        targetLimit: profile.goalTargetLimit,
        milestones: profile.loanEligibilityMilestones,
      },
      generatedAt: new Date().toISOString(),
    };

    res.json(userData);
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Delete user credit profile first (due to foreign key constraint)
    await UserCreditProfile.destroy({ where: { userId } });

    // Delete user
    await user.destroy();

    res.json({ 
      message: 'Account deleted successfully',
      status: 'deleted'
    });
  } catch (error) {
    console.error('Bank Controller Error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete account' });
  }
};
