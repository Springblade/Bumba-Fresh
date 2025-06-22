const { query } = require('../config/database');
const { validationResult } = require('express-validator');
const ProfileManager = require('../../../database/src/profileManager');

/**
 * Get user profile information
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('UserController: Getting profile for user ID:', userId);

    // Get user profile data
    const profile = await ProfileManager.getUserProfileById(userId);
    console.log('UserController: Profile data from database:', profile);
    
    if (!profile) {
      console.log('UserController: Profile not found for user ID:', userId);
      return res.status(404).json({
        error: 'Profile not found',
        message: 'User profile does not exist'
      });
    }

    // Get user statistics
    const stats = await ProfileManager.getUserStats(userId);
    console.log('UserController: User stats:', stats);    // Format response to match frontend expectations
    const formattedProfile = {
      id: profile.user_id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      phone: profile.phone || '',
      address: profile.address || '',
      createdAt: profile.created_at,
      lastLogin: profile.last_login
    };

    console.log('UserController: Sending profile response:', { profile: formattedProfile, stats });
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
    console.log('UserController: Update profile request received');
    console.log('UserController: Request body:', req.body);
    console.log('UserController: User from auth middleware:', req.user);
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('UserController: Validation errors:', errors.array());
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.user.id;
    const { firstName, lastName, phone, address } = req.body;

    console.log('UserController: Updating profile for user ID:', userId);
    console.log('UserController: Update data:', { firstName, lastName, phone, address });

    // Validate user ID exists
    if (!userId) {
      console.error('UserController: No user ID found in request');
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'User ID not found in token'
      });
    }

    // Prepare update data with database field names
    const updateData = {};
    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    console.log('UserController: Prepared update data for database:', updateData);

    // Ensure we have at least one field to update
    if (Object.keys(updateData).length === 0) {
      console.log('UserController: No fields provided for update');
      return res.status(400).json({
        error: 'Validation failed',
        message: 'At least one field must be provided for update'
      });
    }

    // Update profile using ProfileManager
    const result = await ProfileManager.updateUserProfile(userId, updateData);
    console.log('UserController: Profile update result:', result);

    if (!result.success) {
      console.log('UserController: Profile update failed:', result.message);
      return res.status(400).json({
        error: 'Update failed',
        message: result.message
      });
    }    // Format response to match frontend expectations
    const formattedProfile = {
      id: result.user.user_id,
      email: result.user.email,
      firstName: result.user.first_name,
      lastName: result.user.last_name,
      phone: result.user.phone || '',
      address: result.user.address || ''
    };

    console.log('UserController: Profile successfully updated in database');
    console.log('UserController: Sending update response:', { message: 'Profile updated successfully', profile: formattedProfile });
    
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
