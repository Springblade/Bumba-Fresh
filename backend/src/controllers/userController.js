const { query } = require('../config/database');
const { validationResult } = require('express-validator');
const ProfileManager = require('../../../database/src/profileManager');

/**
 * Get user profile information
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user profile data
    const profile = await ProfileManager.getUserProfileById(userId);
    
    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'User profile does not exist'
      });
    }

    // Get user statistics
    const stats = await ProfileManager.getUserStats(userId);

    // Format response to match frontend expectations
    const formattedProfile = {
      id: profile.user_id,
      username: profile.username,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      phone: profile.phone || '',
      address: profile.address || '',
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      lastLogin: profile.last_login
    };

    res.json({
      profile: formattedProfile,
      stats: stats
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch user profile'
    });
  }
};

/**
 * Update user profile information
 */
const updateUserProfile = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.user.id;
    const { firstName, lastName, phone, address } = req.body;

    // Prepare update data with database field names
    const updateData = {};
    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    // Update profile using ProfileManager
    const result = await ProfileManager.updateUserProfile(userId, updateData);

    if (!result.success) {
      return res.status(400).json({
        error: 'Update failed',
        message: result.message
      });
    }

    // Format response to match frontend expectations
    const formattedProfile = {
      id: result.user.user_id,
      username: result.user.username,
      email: result.user.email,
      firstName: result.user.first_name,
      lastName: result.user.last_name,
      phone: result.user.phone || '',
      address: result.user.address || '',
      updatedAt: result.user.updated_at
    };

    res.json({
      message: 'Profile updated successfully',
      profile: formattedProfile
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update user profile'
    });
  }
};

/**
 * Update user password
 */
const updatePassword = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Update password using ProfileManager
    const result = await ProfileManager.updatePassword(userId, currentPassword, newPassword);

    if (!result.success) {
      return res.status(400).json({
        error: 'Password update failed',
        message: result.message
      });
    }

    res.json({
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update password'
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updatePassword
};
