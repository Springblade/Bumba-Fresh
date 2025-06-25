const { FavoriteManager } = require('../src');
const { Pool } = require('pg');
const path = require('path');

// Load environment variables from backend directory
require('dotenv').config({ path: path.join(__dirname, '../../backend/.env') });

/**
 * Comprehensive test suite for FavoriteManager functionality
 * Tests all major operations and edge cases
 */
class FavoriteManagerTest {
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'Bumba_fresh',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '12345',
    });
    
    this.testResults = [];
    this.testUserId = null;
    this.testMealIds = [];
  }

  async runTest(testName, testFunction) {
    try {
      console.log(`\n Running test: ${testName}`);
      await testFunction();
      console.log(` ${testName} - PASSED`);
      this.testResults.push({ name: testName, status: 'PASSED' });
    } catch (error) {
      console.error(` ${testName} - FAILED: ${error.message}`);
      this.testResults.push({ name: testName, status: 'FAILED', error: error.message });
    }
  }

  async setupTestData() {
    console.log(' Setting up test data...');
    
    // Get or create a test user
    const userQuery = `
      INSERT INTO account (email, password, first_name, last_name, role) 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
      RETURNING user_id
    `;
    
    const userResult = await this.pool.query(userQuery, [
      'test.favorites@example.com',
      '$2b$12$dummy.hash.for.testing',
      'Test',
      'User',
      'user'
    ]);
    
    this.testUserId = userResult.rows[0].user_id;
    
    // Get existing meal IDs
    const mealQuery = 'SELECT meal_id FROM inventory LIMIT 5';
    const mealResult = await this.pool.query(mealQuery);
    
    if (mealResult.rows.length === 0) {
      throw new Error('No meals found in inventory table. Please add some test meals first.');
    }
    
    this.testMealIds = mealResult.rows.map(row => row.meal_id);
    
    // Clean up any existing test favorites
    await this.pool.query('DELETE FROM favorite WHERE user_id = $1', [this.testUserId]);
    
    console.log(` Test setup complete. User ID: ${this.testUserId}, Meal IDs: ${this.testMealIds.join(', ')}`);
  }

  async cleanupTestData() {
    console.log('\n Cleaning up test data...');
    
    if (this.testUserId) {
      await this.pool.query('DELETE FROM favorite WHERE user_id = $1', [this.testUserId]);
      console.log(' Test favorites cleaned up');
    }
  }

  async testAddFavorite() {
    const mealId = this.testMealIds[0];
    const result = await FavoriteManager.addFavorite(this.testUserId, mealId);
    
    if (!result.success) {
      throw new Error(`Add favorite failed: ${result.message}`);
    }
    
    if (!result.data || !result.data.favorite_id) {
      throw new Error('Add favorite did not return expected data structure');
    }
    
    console.log(`    Added favorite: meal ${mealId} for user ${this.testUserId}`);
  }

  async testAddDuplicateFavorite() {
    const mealId = this.testMealIds[0];
    const result = await FavoriteManager.addFavorite(this.testUserId, mealId);
    
    if (result.success) {
      throw new Error('Adding duplicate favorite should have failed');
    }
    
    if (result.error !== 'ALREADY_FAVORITED') {
      throw new Error(`Expected ALREADY_FAVORITED error, got: ${result.error}`);
    }
    
    console.log('    Duplicate favorite correctly rejected');
  }

  async testAddNonExistentMeal() {
    const nonExistentMealId = 99999;
    const result = await FavoriteManager.addFavorite(this.testUserId, nonExistentMealId);
    
    if (result.success) {
      throw new Error('Adding non-existent meal should have failed');
    }
    
    if (result.error !== 'MEAL_NOT_FOUND') {
      throw new Error(`Expected MEAL_NOT_FOUND error, got: ${result.error}`);
    }
    
    console.log('    Non-existent meal correctly rejected');
  }

  async testGetUserFavorites() {
    // Add multiple favorites first
    await FavoriteManager.addFavorite(this.testUserId, this.testMealIds[1]);
    await FavoriteManager.addFavorite(this.testUserId, this.testMealIds[2]);
    
    const favorites = await FavoriteManager.getUserFavorites(this.testUserId);
    
    if (favorites.length !== 3) {
      throw new Error(`Expected 3 favorites, got ${favorites.length}`);
    }
    
    // Check that all required fields are present
    const requiredFields = ['favorite_id', 'meal_id', 'meal_name', 'description', 'price'];
    const firstFavorite = favorites[0];
    
    for (const field of requiredFields) {
      if (!(field in firstFavorite)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    console.log(`    Retrieved ${favorites.length} favorites with complete meal details`);
  }

  async testGetUserFavoritesWithSearch() {
    const favorites = await FavoriteManager.getUserFavorites(this.testUserId, {
      search: 'chicken'
    });
    
    // Should return favorites that match the search (if any chicken meals exist)
    console.log(`    Search returned ${favorites.length} favorites matching 'chicken'`);
  }

  async testGetUserFavoritesWithSorting() {
    const favoritesAsc = await FavoriteManager.getUserFavorites(this.testUserId, {
      sort: 'meal_name',
      order: 'asc'
    });
    
    const favoritesDesc = await FavoriteManager.getUserFavorites(this.testUserId, {
      sort: 'meal_name',
      order: 'desc'
    });
    
    if (favoritesAsc.length !== favoritesDesc.length) {
      throw new Error('Sort order should not change the number of results');
    }
    
    console.log(`    Sorting test passed (${favoritesAsc.length} favorites sorted)`);
  }

  async testCheckFavoriteStatus() {
    const favoritedMealId = this.testMealIds[0];
    const notFavoritedMealId = this.testMealIds[3];
    
    // Test favorited meal
    const favoritedResult = await FavoriteManager.isFavorited(this.testUserId, favoritedMealId);
    if (!favoritedResult.success || !favoritedResult.is_favorite) {
      throw new Error('Should return true for favorited meal');
    }
    
    // Test non-favorited meal
    const notFavoritedResult = await FavoriteManager.isFavorited(this.testUserId, notFavoritedMealId);
    if (!notFavoritedResult.success || notFavoritedResult.is_favorite) {
      throw new Error('Should return false for non-favorited meal');
    }
    
    console.log('    Favorite status check working correctly');
  }

  async testRemoveFavorite() {
    const mealId = this.testMealIds[1];
    const result = await FavoriteManager.removeFavorite(this.testUserId, mealId);
    
    if (!result.success) {
      throw new Error(`Remove favorite failed: ${result.message}`);
    }
    
    // Verify it's actually removed
    const checkResult = await FavoriteManager.isFavorited(this.testUserId, mealId);
    if (checkResult.is_favorite) {
      throw new Error('Favorite was not actually removed');
    }
    
    console.log(`    Removed favorite: meal ${mealId}`);
  }

  async testRemoveNonExistentFavorite() {
    const mealId = this.testMealIds[4];
    const result = await FavoriteManager.removeFavorite(this.testUserId, mealId);
    
    if (result.success) {
      throw new Error('Removing non-existent favorite should have failed');
    }
    
    if (result.error !== 'FAVORITE_NOT_FOUND') {
      throw new Error(`Expected FAVORITE_NOT_FOUND error, got: ${result.error}`);
    }
    
    console.log('    Non-existent favorite removal correctly handled');
  }

  async testGetFavoriteStats() {
    const stats = await FavoriteManager.getFavoriteStats(this.testUserId);
    
    const requiredFields = ['total_favorites', 'unique_categories', 'average_price', 'categories'];
    for (const field of requiredFields) {
      if (!(field in stats)) {
        throw new Error(`Missing required stats field: ${field}`);
      }
    }
    
    if (typeof stats.total_favorites !== 'number') {
      throw new Error('total_favorites should be a number');
    }
    
    console.log(`    Stats: ${stats.total_favorites} favorites, ${stats.unique_categories} categories`);
  }

  async testGetFavoritesCount() {
    const count = await FavoriteManager.getFavoritesCount(this.testUserId);
    
    if (typeof count !== 'number') {
      throw new Error('Count should be a number');
    }
    
    // Verify count matches actual favorites
    const favorites = await FavoriteManager.getUserFavorites(this.testUserId);
    if (count !== favorites.length) {
      throw new Error(`Count mismatch: got ${count}, expected ${favorites.length}`);
    }
    
    console.log(`    Favorites count: ${count}`);
  }

  async testGetPopularFavorites() {
    const popular = await FavoriteManager.getPopularFavorites(5);
    
    if (!Array.isArray(popular)) {
      throw new Error('Popular favorites should return an array');
    }
    
    // Each item should have required fields
    if (popular.length > 0) {
      const requiredFields = ['meal_id', 'meal_name', 'favorite_count'];
      const firstItem = popular[0];
      
      for (const field of requiredFields) {
        if (!(field in firstItem)) {
          throw new Error(`Missing required field in popular favorites: ${field}`);
        }
      }
    }
    
    console.log(`    Popular favorites: ${popular.length} meals`);
  }

  async runAllTests() {
    console.log(' Starting FavoriteManager comprehensive test suite...\n');
    
    try {
      await this.setupTestData();
      
      // Core functionality tests
      await this.runTest('Add Favorite', () => this.testAddFavorite());
      await this.runTest('Add Duplicate Favorite', () => this.testAddDuplicateFavorite());
      await this.runTest('Add Non-existent Meal', () => this.testAddNonExistentMeal());
      await this.runTest('Get User Favorites', () => this.testGetUserFavorites());
      await this.runTest('Get User Favorites with Search', () => this.testGetUserFavoritesWithSearch());
      await this.runTest('Get User Favorites with Sorting', () => this.testGetUserFavoritesWithSorting());
      await this.runTest('Check Favorite Status', () => this.testCheckFavoriteStatus());
      await this.runTest('Remove Favorite', () => this.testRemoveFavorite());
      await this.runTest('Remove Non-existent Favorite', () => this.testRemoveNonExistentFavorite());
      await this.runTest('Get Favorite Stats', () => this.testGetFavoriteStats());
      await this.runTest('Get Favorites Count', () => this.testGetFavoritesCount());
      await this.runTest('Get Popular Favorites', () => this.testGetPopularFavorites());
      
      await this.cleanupTestData();
      
    } catch (error) {
      console.error(' Test setup/cleanup failed:', error.message);
      this.testResults.push({ name: 'Test Setup/Cleanup', status: 'FAILED', error: error.message });
    } finally {
      await this.pool.end();
    }
    
    // Print summary
    this.printTestSummary();
  }

  printTestSummary() {
    console.log('\n' + '='.repeat(60));
    console.log(' TEST SUMMARY');
    console.log('='.repeat(60));
    
    const passed = this.testResults.filter(r => r.status === 'PASSED').length;
    const failed = this.testResults.filter(r => r.status === 'FAILED').length;
    
    console.log(`Total tests: ${this.testResults.length}`);
    console.log(` Passed: ${passed}`);
    console.log(` Failed: ${failed}`);
    console.log(`Success rate: ${((passed / this.testResults.length) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n Failed tests:');
      this.testResults
        .filter(r => r.status === 'FAILED')
        .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (failed === 0) {
      console.log(' All tests passed! FavoriteManager is working correctly.');
      process.exit(0);
    } else {
      console.log(' Some tests failed. Please review the errors above.');
      process.exit(1);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const testSuite = new FavoriteManagerTest();
  testSuite.runAllTests().catch(error => {
    console.error(' Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = FavoriteManagerTest;
