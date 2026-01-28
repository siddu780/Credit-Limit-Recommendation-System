const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

const userController = {
  getProfile: (req, res) => {
    try {
      // In production, fetch from database using req.user.id
      const userProfile = {
        id: req.user.id,
        name: req.user.name || 'User',
        email: req.user.email,
        role: req.user.role,
        createdAt: new Date(),
        lastLogin: new Date(),
        status: 'Active'
      };

      res.json(userProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch profile' });
    }
  },

  updateProfile: (req, res) => {
    try {
      const { name } = req.body;

      // In production, update database
      const updatedProfile = {
        id: req.user.id,
        name,
        email: req.user.email,
        role: req.user.role,
        message: 'Profile updated successfully'
      };

      res.json(updatedProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  }
};

router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);

module.exports = router;
