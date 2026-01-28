const User = require('../models/User');

const adminController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
      });

      res.json({
        users,
        totalUsers: users.length,
        activeUsers: users.filter(u => u.role === 'user').length,
        adminUsers: users.filter(u => u.role === 'admin').length,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
  },

  // Get single user
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
  },

  // Update user role
  updateUserRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.role = role;
      await user.save();

      res.json({
        message: 'User role updated successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update user role', error: error.message });
    }
  },

  // Disable user (soft delete)
  disableUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Add a status field or soft delete column
      await user.destroy();

      res.json({ message: 'User disabled successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to disable user', error: error.message });
    }
  },

  // Get system analytics
  getSystemAnalytics: async (req, res) => {
    try {
      const totalUsers = await User.count();
      const adminUsers = await User.count({ where: { role: 'admin' } });
      const regularUsers = totalUsers - adminUsers;

      // Mock predictions and accuracy data
      const analytics = {
        totalUsers,
        activeUsers: regularUsers,
        adminUsers,
        totalPredictions: Math.floor(Math.random() * 10000) + 5000,
        systemAccuracy: 92.5,
        defaultRate: 5.2,
        avgCreditLimit: 15450,
      };

      res.json(analytics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
    }
  },
};

module.exports = adminController;
