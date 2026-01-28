const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const UserCreditProfile = sequelize.define('UserCreditProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  age: DataTypes.INTEGER,
  income: DataTypes.FLOAT,
  debtRatio: DataTypes.FLOAT,
  creditLimit: DataTypes.FLOAT,
  creditUtilization: DataTypes.FLOAT,
  paymentHistory: DataTypes.JSON,
  creditScore: DataTypes.INTEGER,
  
  // Bank-specific fields
  existingLoans: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    comment: 'Total existing loans',
  },
  outstandingBalances: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    comment: 'Total outstanding balances',
  },
  creditHistoryMonths: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Months of credit history',
  },
  employmentStatus: {
    type: DataTypes.ENUM('employed', 'self-employed', 'unemployed', 'retired'),
    defaultValue: 'employed',
  },
  yearsAtCurrentJob: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  riskCategory: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
    comment: 'Bank risk assessment',
  },
  defaultProbability: {
    type: DataTypes.FLOAT,
    defaultValue: 5.0,
    comment: 'Default probability percentage',
  },
  recommendedCreditLimit: {
    type: DataTypes.FLOAT,
    comment: 'Bank recommended limit',
  },
  goalTargetScore: {
    type: DataTypes.INTEGER,
    defaultValue: 750,
    comment: 'Customer target credit score',
  },
  goalTargetLimit: {
    type: DataTypes.FLOAT,
    comment: 'Customer target credit limit',
  },
  loanEligibilityMilestones: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Loan eligibility tracking',
  },
  
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_credit_profiles',
  timestamps: true,
});

module.exports = UserCreditProfile;
