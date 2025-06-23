const axios = require('axios');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

/**
 * API Test Suite for Favorites endpoints
 * Tests the complete API functionality with authentication
 */
class FavoritesAPITest {  constructor() {
    this.baseURL = process.env.BACKEND_URL || 'http://localhost:8000';
    this.apiURL = `${this.baseURL}/api`;
    this.authToken = null;
    this.testResults = [];
    this.testMealId = null;
    
    // Database connection for cleanup
    this.dbPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'Bumba_fresh',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '12345',
    });
  }
  async runTest(testName, testFunction, needsCleanup = false) {
    try {
      console.log(`\n🧪 Running API test: ${testName}`);
      await testFunction();
      console.log(`✅ ${testName} - PASSED`);
      this.testResults.push({ name: testName, status: 'PASSED' });
      
      // Clean up test data if needed
      if (needsCleanup) {
        await this.cleanupTestData();
      }
    } catch (error) {
      console.error(`❌ ${testName} - FAILED: ${error.message}`);
      this.testResults.push({ name: testName, status: 'FAILED', error: error.message });
      
      // Clean up even on failure to prevent affecting other tests
      if (needsCleanup) {
        try {
          await this.cleanupTestData();
        } catch (cleanupError) {
          console.warn(`⚠️ Cleanup failed for ${testName}: ${cleanupError.message}`);
        }
      }
    }
  }

  async setupTestAuth() {
    console.log('🔐 Setting up authentication...');
      // Try to login with test credentials
    try {
      const loginResponse = await axios.post(`${this.apiURL}/auth/login`, {
        email: 'testing1.favorites@example.com',
        password: 'Password123'
      });
      
      this.authToken = loginResponse.data.token;
      console.log('✅ Authentication successful');
      
    } catch (error) {
      // If login fails, try to register first
      console.log('🔄 Login failed, attempting registration...');
        try {
        await axios.post(`${this.apiURL}/auth/register`, {
          email: 'testing1.favorites@example.com',
          password: 'Password123',
          firstName: 'Test',
          lastName: 'User'
        });
        
        console.log('✅ Registration successful, attempting login...');
          const loginResponse = await axios.post(`${this.apiURL}/auth/login`, {
          email: 'testing1.favorites@example.com',
          password: 'Password123'
        });
        
        this.authToken = loginResponse.data.token;
        console.log('✅ Authentication successful after registration');
        
      } catch (regError) {
        throw new Error(`Authentication setup failed: ${regError.response?.data?.message || regError.message}`);
      }
    }
  }

  async setupTestMeal() {
    console.log('🍽️ Getting test meal...');
    
    const response = await axios.get(`${this.apiURL}/meals`);
    
    if (!response.data.success || response.data.data.length === 0) {
      throw new Error('No meals found for testing');
    }
    
    this.testMealId = response.data.data[0].meal_id;
    console.log(`✅ Test meal ID: ${this.testMealId}`);
  }
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    };
  }
  /**
   * Clean up test data by clearing the favorites table for the test user
   * This ensures test isolation by removing any favorites created during testing
   */
  async cleanupTestData() {
    try {
      // Get user ID from token or use the test email to find the user
      const getUserQuery = `
        SELECT user_id FROM account 
        WHERE email = $1
      `;
      
      const userResult = await this.dbPool.query(getUserQuery, ['testing1.favorites@example.com']);
      
      if (userResult.rows.length > 0) {
        const userId = userResult.rows[0].user_id;
        
        // Delete all favorites for this test user
        const deleteQuery = `
          DELETE FROM favorite 
          WHERE user_id = $1
        `;
        
        const result = await this.dbPool.query(deleteQuery, [userId]);
        console.log(`   🧹 Cleaned up ${result.rowCount} favorite records for test user`);
      }
    } catch (error) {
      console.warn(`   ⚠️ Cleanup warning: ${error.message}`);
      // Don't throw error for cleanup failures to avoid breaking test flow
    }
  }

  async testAddFavorite() {
    const response = await axios.post(
      `${this.apiURL}/favorites`,
      { meal_id: this.testMealId },
      { headers: this.getAuthHeaders() }
    );
    
    if (response.status !== 201) {
      throw new Error(`Expected status 201, got ${response.status}`);
    }
    
    if (!response.data.success) {
      throw new Error('Response should indicate success');
    }
    
    if (!response.data.data || !response.data.data.favorite_id) {
      throw new Error('Response should include favorite data');
    }
    
    console.log(`   📝 Added favorite with ID: ${response.data.data.favorite_id}`);
  }

  async testAddDuplicateFavorite() {
    try {
      await axios.post(
        `${this.apiURL}/favorites`,
        { meal_id: this.testMealId },
        { headers: this.getAuthHeaders() }
      );
      
      throw new Error('Should have failed with duplicate favorite');
    } catch (error) {
      if (error.response?.status !== 409) {
        throw new Error(`Expected status 409, got ${error.response?.status}`);
      }
      
      if (error.response.data.error_code !== 'ALREADY_FAVORITED') {
        throw new Error(`Expected ALREADY_FAVORITED error code, got ${error.response.data.error_code}`);
      }
      
      console.log('   📝 Duplicate favorite correctly rejected');
    }
  }

  async testAddInvalidMeal() {
    try {
      await axios.post(
        `${this.apiURL}/favorites`,
        { meal_id: 'invalid' },
        { headers: this.getAuthHeaders() }
      );
      
      throw new Error('Should have failed with invalid meal ID');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected status 400, got ${error.response?.status}`);
      }
      
      console.log('   📝 Invalid meal ID correctly rejected');
    }
  }

  async testGetFavorites() {
    const response = await axios.get(
      `${this.apiURL}/favorites`,
      { headers: this.getAuthHeaders() }
    );
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (!response.data.success) {
      throw new Error('Response should indicate success');
    }
    
    if (!Array.isArray(response.data.data)) {
      throw new Error('Response data should be an array');
    }
    
    if (response.data.data.length === 0) {
      throw new Error('Should have at least one favorite from previous test');
    }
    
    const favorite = response.data.data[0];
    const requiredFields = ['favorite_id', 'meal_id', 'meal_name', 'description', 'price'];
    
    for (const field of requiredFields) {
      if (!(field in favorite)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    console.log(`   📝 Retrieved ${response.data.data.length} favorites`);
  }

  async testGetFavoritesWithSearch() {
    const response = await axios.get(
      `${this.apiURL}/favorites?search=chicken`,
      { headers: this.getAuthHeaders() }
    );
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    console.log(`   📝 Search returned ${response.data.data.length} favorites`);
  }

  async testCheckFavorite() {
    const response = await axios.get(
      `${this.apiURL}/favorites/check/${this.testMealId}`,
      { headers: this.getAuthHeaders() }
    );
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (!response.data.success) {
      throw new Error('Response should indicate success');
    }
    
    if (response.data.is_favorite !== true) {
      throw new Error('Should return true for favorited meal');
    }
    
    console.log('   📝 Favorite check returned correct status');
  }

  async testGetFavoriteStats() {
    const response = await axios.get(
      `${this.apiURL}/favorites/stats`,
      { headers: this.getAuthHeaders() }
    );
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (!response.data.success) {
      throw new Error('Response should indicate success');
    }
    
    const requiredFields = ['total_favorites', 'unique_categories', 'average_price', 'categories'];
    
    for (const field of requiredFields) {
      if (!(field in response.data.data)) {
        throw new Error(`Missing required stats field: ${field}`);
      }
    }
    
    console.log(`   📝 Stats: ${response.data.data.total_favorites} favorites`);
  }

  async testGetPopularFavorites() {
    const response = await axios.get(
      `${this.apiURL}/favorites/popular?limit=5`,
      { headers: this.getAuthHeaders() }
    );
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (!response.data.success) {
      throw new Error('Response should indicate success');
    }
    
    if (!Array.isArray(response.data.data)) {
      throw new Error('Response data should be an array');
    }
    
    console.log(`   📝 Popular favorites: ${response.data.data.length} meals`);
  }

  async testRemoveFavorite() {
    const response = await axios.delete(
      `${this.apiURL}/favorites/${this.testMealId}`,
      { headers: this.getAuthHeaders() }
    );
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (!response.data.success) {
      throw new Error('Response should indicate success');
    }
    
    // Verify it was actually removed
    const checkResponse = await axios.get(
      `${this.apiURL}/favorites/check/${this.testMealId}`,
      { headers: this.getAuthHeaders() }
    );
    
    if (checkResponse.data.is_favorite !== false) {
      throw new Error('Favorite should be removed');
    }
    
    console.log('   📝 Favorite successfully removed');
  }

  async testRemoveNonExistentFavorite() {
    try {
      await axios.delete(
        `${this.apiURL}/favorites/${this.testMealId}`,
        { headers: this.getAuthHeaders() }
      );
      
      throw new Error('Should have failed with non-existent favorite');
    } catch (error) {
      if (error.response?.status !== 404) {
        throw new Error(`Expected status 404, got ${error.response?.status}`);
      }
      
      console.log('   📝 Non-existent favorite removal correctly handled');
    }
  }

  async testUnauthorizedAccess() {
    try {
      await axios.get(`${this.apiURL}/favorites`);
      throw new Error('Should have failed without authentication');
    } catch (error) {
      if (error.response?.status !== 401) {
        throw new Error(`Expected status 401, got ${error.response?.status}`);
      }
      
      console.log('   📝 Unauthorized access correctly blocked');
    }
  }
  async runAllTests() {
    console.log('🚀 Starting Favorites API test suite...\n');
    
    try {
      await this.setupTestAuth();
      await this.setupTestMeal();
      
      // Initial cleanup to start with clean state
      await this.cleanupTestData();
      console.log('🧹 Initial test data cleanup completed');
      
      // Authentication tests
      await this.runTest('Unauthorized Access', () => this.testUnauthorizedAccess());
        // Core functionality tests (with strategic cleanup)
      await this.runTest('Add Favorite', () => this.testAddFavorite());
      await this.runTest('Add Duplicate Favorite', () => this.testAddDuplicateFavorite());
      await this.runTest('Add Invalid Meal', () => this.testAddInvalidMeal());
      await this.runTest('Get Favorites', () => this.testGetFavorites());
      await this.runTest('Get Favorites with Search', () => this.testGetFavoritesWithSearch());
      await this.runTest('Check Favorite Status', () => this.testCheckFavorite());
      await this.runTest('Get Favorite Stats', () => this.testGetFavoriteStats());
      await this.runTest('Get Popular Favorites', () => this.testGetPopularFavorites());
      await this.runTest('Remove Favorite', () => this.testRemoveFavorite());
      await this.runTest('Remove Non-existent Favorite', () => this.testRemoveNonExistentFavorite(), true);
      
      // Final cleanup
      await this.cleanupTestData();
      console.log('🧹 Final test data cleanup completed');
      
    } catch (error) {
      console.error('💥 Test setup failed:', error.message);
      this.testResults.push({ name: 'Test Setup', status: 'FAILED', error: error.message });
    } finally {
      // Ensure database connection is closed
      await this.dbPool.end();
    }
    
    // Print summary
    this.printTestSummary();
  }

  printTestSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 API TEST SUMMARY');
    console.log('='.repeat(60));
    
    const passed = this.testResults.filter(r => r.status === 'PASSED').length;
    const failed = this.testResults.filter(r => r.status === 'FAILED').length;
    
    console.log(`Total tests: ${this.testResults.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success rate: ${((passed / this.testResults.length) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed tests:');
      this.testResults
        .filter(r => r.status === 'FAILED')
        .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (failed === 0) {
      console.log('🎉 All API tests passed! Favorites endpoints are working correctly.');
      process.exit(0);
    } else {
      console.log('💥 Some API tests failed. Please review the errors above.');
      process.exit(1);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const testSuite = new FavoritesAPITest();
  testSuite.runAllTests().catch(error => {
    console.error('💥 API test execution failed:', error);
    process.exit(1);
  });
}

module.exports = FavoritesAPITest;
