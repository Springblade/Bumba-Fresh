#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Favorite Functionality
 * Tests all database operations and API endpoints
 */

const { FavoriteManager, InventoryManager, AccountCreator } = require('./src');
const axios = require('axios');

// Test configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';
const TEST_CONFIG = {
  testUser: {
    email: 'testfavorites@example.com',
    password: 'testPassword123',
    firstName: 'Test',
    lastName: 'User'
  },
  cleanup: true // Set to false to keep test data for inspection
};

let testUserId = null;
let testMealIds = [];
let authToken = null;

/**
 * Test Suite Runner
 */
async function runTests() {
  console.log('🧪 Starting Favorite Functionality Test Suite...\n');
  
  try {
    // Setup
    await setupTestData();
    
    // Database Layer Tests
    console.log('📦 Running Database Layer Tests...');
    await testDatabaseOperations();
    
    // API Layer Tests  
    console.log('\n🌐 Running API Layer Tests...');
    await testAPIEndpoints();
    
    // Edge Cases and Error Handling
    console.log('\n🔍 Running Edge Case Tests...');
    await testErrorHandling();
    
    // Performance Tests (basic)
    console.log('\n⚡ Running Basic Performance Tests...');
    await testPerformance();
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  } finally {
    // Cleanup
    if (TEST_CONFIG.cleanup) {
      await cleanupTestData();
    }
  }
}

/**
 * Setup test data
 */
async function setupTestData() {
  console.log('🔧 Setting up test data...');
  
  try {
    // Create test user
    const userResult = await AccountCreator.createAccount(
      TEST_CONFIG.testUser.password,
      TEST_CONFIG.testUser.email,
      TEST_CONFIG.testUser.firstName,
      TEST_CONFIG.testUser.lastName
    );
    
    if (!userResult.success) {
      // User might already exist, try to get existing user
      const existingUser = await AccountCreator.getUserByEmail(TEST_CONFIG.testUser.email);
      if (existingUser) {
        testUserId = existingUser.user_id;
        console.log(`✓ Using existing test user: ${testUserId}`);
      } else {
        throw new Error('Failed to create or find test user');
      }
    } else {
      testUserId = userResult.user.user_id;
      console.log(`✓ Created test user: ${testUserId}`);
    }
    
    // Get test meal IDs from inventory
    const meals = await InventoryManager.getAllMeals();
    if (meals.length === 0) {
      throw new Error('No meals found in inventory for testing');
    }
    testMealIds = meals.slice(0, 3).map(meal => meal.meal_id);
    console.log(`✓ Found ${testMealIds.length} test meals: ${testMealIds.join(', ')}`);
    
    // Authenticate for API tests
    try {
      const authResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: TEST_CONFIG.testUser.email,
        password: TEST_CONFIG.testUser.password
      });
      authToken = authResponse.data.token;
      console.log('✓ Authenticated for API tests');
    } catch (error) {
      console.log('⚠️  Could not authenticate for API tests - API might not be running');
    }
    
  } catch (error) {
    console.error('Failed to setup test data:', error);
    throw error;
  }
}

/**
 * Test database operations
 */
async function testDatabaseOperations() {
  console.log('\n--- Database Layer Tests ---');
  
  // Cleanup any existing favorites for test user first
  console.log('🧪 Cleanup: Removing any existing favorites...');
  await FavoriteManager.removeAllUserFavorites(testUserId);
  console.log('✓ Cleanup completed');
  
  // Test 1: Add favorite
  console.log('🧪 Test 1: Add favorite');
  const addResult = await FavoriteManager.addFavorite(testUserId, testMealIds[0]);
  assert(addResult.success, 'Should successfully add favorite');
  assert(addResult.data.meal_id === testMealIds[0], 'Should return correct meal ID');
  console.log('✓ Add favorite successful');
  
  // Test 2: Add duplicate favorite (should fail)
  console.log('🧪 Test 2: Add duplicate favorite');
  const duplicateResult = await FavoriteManager.addFavorite(testUserId, testMealIds[0]);
  assert(!duplicateResult.success, 'Should fail to add duplicate favorite');
  assert(duplicateResult.error === 'ALREADY_FAVORITED', 'Should return correct error code');
  console.log('✓ Duplicate favorite correctly rejected');
  
  // Test 3: Check favorite
  console.log('🧪 Test 3: Check favorite');
  const checkResult = await FavoriteManager.checkFavorite(testUserId, testMealIds[0]);
  assert(checkResult.success, 'Check should succeed');
  assert(checkResult.is_favorite === true, 'Should indicate meal is favorited');
  console.log('✓ Check favorite successful');
  
  // Test 4: Get user favorites
  console.log('🧪 Test 4: Get user favorites');
  const favoritesResult = await FavoriteManager.getUserFavorites(testUserId);
  assert(Array.isArray(favoritesResult), 'Should return array');
  assert(favoritesResult.length === 1, 'Should have one favorite');
  assert(favoritesResult[0].meal_id === testMealIds[0], 'Should contain correct meal');
  console.log('✓ Get user favorites successful');
  
  // Test 5: Add more favorites for testing
  console.log('🧪 Test 5: Add multiple favorites');
  await FavoriteManager.addFavorite(testUserId, testMealIds[1]);
  await FavoriteManager.addFavorite(testUserId, testMealIds[2]);
  const multipleFavorites = await FavoriteManager.getUserFavorites(testUserId);
  assert(multipleFavorites.length === 3, 'Should have three favorites');
  console.log('✓ Multiple favorites added');
  
  // Test 6: Search favorites
  console.log('🧪 Test 6: Search favorites');
  const searchResult = await FavoriteManager.getUserFavorites(testUserId, { 
    search: 'chicken' 
  });
  assert(Array.isArray(searchResult), 'Search should return array');
  console.log(`✓ Search returned ${searchResult.length} results`);
  
  // Test 7: Get favorite stats
  console.log('🧪 Test 7: Get favorite statistics');
  const statsResult = await FavoriteManager.getUserFavoriteStats(testUserId);
  assert(typeof statsResult === 'object', 'Should return stats object');
  assert(statsResult.total_favorites >= 3, 'Should show correct total favorites');
  console.log('✓ Favorite statistics retrieved');
  
  // Test 8: Remove favorite
  console.log('🧪 Test 8: Remove favorite');
  const removeResult = await FavoriteManager.removeFavorite(testUserId, testMealIds[0]);
  assert(removeResult.success, 'Should successfully remove favorite');
  const afterRemove = await FavoriteManager.getUserFavorites(testUserId);
  assert(afterRemove.length === 2, 'Should have two favorites after removal');
  console.log('✓ Remove favorite successful');
  
  // Test 9: Remove non-existent favorite
  console.log('🧪 Test 9: Remove non-existent favorite');
  const removeNonExistent = await FavoriteManager.removeFavorite(testUserId, testMealIds[0]);
  assert(!removeNonExistent.success, 'Should fail to remove non-existent favorite');
  assert(removeNonExistent.error === 'FAVORITE_NOT_FOUND', 'Should return correct error');
  console.log('✓ Non-existent favorite correctly rejected');
  
  console.log('✅ All database tests passed!\n');
}

/**
 * Test API endpoints
 */
async function testAPIEndpoints() {
  if (!authToken) {
    console.log('⚠️  Skipping API tests - no auth token available');
    return;
  }
  
  console.log('\n--- API Layer Tests ---');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  try {
    // Test 1: Get favorites (empty state)
    console.log('🧪 API Test 1: Get empty favorites');
    await FavoriteManager.removeAllUserFavorites(testUserId); // Clean slate
    const emptyResponse = await axios.get(`${API_BASE_URL}/favorites`, { headers });
    assert(emptyResponse.status === 200, 'Should return 200');
    assert(emptyResponse.data.success === true, 'Should indicate success');
    assert(emptyResponse.data.data.length === 0, 'Should be empty');
    console.log('✓ Empty favorites retrieved via API');
    
    // Test 2: Add favorite via API
    console.log('🧪 API Test 2: Add favorite via API');
    const addResponse = await axios.post(`${API_BASE_URL}/favorites`, {
      meal_id: testMealIds[0]
    }, { headers });
    assert(addResponse.status === 201, 'Should return 201');
    assert(addResponse.data.success === true, 'Should indicate success');
    console.log('✓ Favorite added via API');
    
    // Test 3: Check favorite via API
    console.log('🧪 API Test 3: Check favorite via API');
    const checkResponse = await axios.get(`${API_BASE_URL}/favorites/check/${testMealIds[0]}`, { headers });
    assert(checkResponse.status === 200, 'Should return 200');
    assert(checkResponse.data.is_favorite === true, 'Should indicate favorited');
    console.log('✓ Favorite status checked via API');
    
    // Test 4: Get favorites with data
    console.log('🧪 API Test 4: Get favorites with data');
    const favoritesResponse = await axios.get(`${API_BASE_URL}/favorites`, { headers });
    assert(favoritesResponse.status === 200, 'Should return 200');
    assert(favoritesResponse.data.data.length === 1, 'Should have one favorite');
    console.log('✓ Favorites retrieved via API');
    
    // Test 5: Get favorite stats
    console.log('🧪 API Test 5: Get favorite stats');
    const statsResponse = await axios.get(`${API_BASE_URL}/favorites/stats`, { headers });
    assert(statsResponse.status === 200, 'Should return 200');
    assert(statsResponse.data.data.total_favorites >= 1, 'Should show favorites');
    console.log('✓ Favorite stats retrieved via API');
    
    // Test 6: Remove favorite via API
    console.log('🧪 API Test 6: Remove favorite via API');
    const removeResponse = await axios.delete(`${API_BASE_URL}/favorites/${testMealIds[0]}`, { headers });
    assert(removeResponse.status === 200, 'Should return 200');
    assert(removeResponse.data.success === true, 'Should indicate success');
    console.log('✓ Favorite removed via API');
    
    // Test 7: Get popular meals (public endpoint)
    console.log('🧪 API Test 7: Get popular meals');
    const popularResponse = await axios.get(`${API_BASE_URL}/favorites/popular`);
    assert(popularResponse.status === 200, 'Should return 200');
    assert(Array.isArray(popularResponse.data.data), 'Should return array');
    console.log('✓ Popular meals retrieved via API');
    
    console.log('✅ All API tests passed!\n');
    
  } catch (error) {
    console.error('API test failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Test error handling and edge cases
 */
async function testErrorHandling() {
  console.log('\n--- Error Handling Tests ---');
  
  // Test 1: Add favorite with invalid meal ID
  console.log('🧪 Error Test 1: Invalid meal ID');
  const invalidMealResult = await FavoriteManager.addFavorite(testUserId, 99999);
  assert(!invalidMealResult.success, 'Should fail with invalid meal ID');
  assert(invalidMealResult.error === 'MEAL_NOT_FOUND', 'Should return correct error');
  console.log('✓ Invalid meal ID correctly handled');
  
  // Test 2: Check favorite with invalid user ID
  console.log('🧪 Error Test 2: Invalid user ID');
  const invalidUserResult = await FavoriteManager.checkFavorite(99999, testMealIds[0]);
  assert(invalidUserResult.success, 'Check should succeed even with invalid user');
  assert(invalidUserResult.is_favorite === false, 'Should indicate not favorited');
  console.log('✓ Invalid user ID correctly handled');
  
  // Test 3: API validation errors (if API is available)
  if (authToken) {
    try {
      console.log('🧪 Error Test 3: API validation');
      const headers = { Authorization: `Bearer ${authToken}` };
      
      // Invalid meal ID format
      await axios.post(`${API_BASE_URL}/favorites`, {
        meal_id: 'invalid'
      }, { headers });
      
      assert(false, 'Should have thrown validation error');
    } catch (error) {
      assert(error.response?.status === 400, 'Should return 400 for validation error');
      console.log('✓ API validation correctly handled');
    }
  }
  
  console.log('✅ All error handling tests passed!\n');
}

/**
 * Basic performance tests
 */
async function testPerformance() {
  console.log('\n--- Performance Tests ---');
  
  // Test 1: Bulk add favorites
  console.log('🧪 Performance Test 1: Bulk operations');
  const startTime = Date.now();
  
  // Add multiple favorites
  for (let i = 0; i < testMealIds.length; i++) {
    await FavoriteManager.addFavorite(testUserId, testMealIds[i]);
  }
  
  const addTime = Date.now() - startTime;
  console.log(`✓ Added ${testMealIds.length} favorites in ${addTime}ms`);
  
  // Test 2: Query performance
  const queryStart = Date.now();
  const favorites = await FavoriteManager.getUserFavorites(testUserId);
  const queryTime = Date.now() - queryStart;
  console.log(`✓ Retrieved ${favorites.length} favorites in ${queryTime}ms`);
  
  // Test 3: Stats performance
  const statsStart = Date.now();
  await FavoriteManager.getUserFavoriteStats(testUserId);
  const statsTime = Date.now() - statsStart;
  console.log(`✓ Generated stats in ${statsTime}ms`);
  
  console.log('✅ Performance tests completed!\n');
}

/**
 * Cleanup test data
 */
async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...');
  
  try {
    if (testUserId) {
      // Remove all favorites for test user
      await FavoriteManager.removeAllUserFavorites(testUserId);
      console.log('✓ Removed test favorites');
      
      // Note: We don't delete the test user as it might be used by other tests
      // In a real scenario, you might want to delete the test user too
    }
  } catch (error) {
    console.error('Cleanup failed:', error.message);
  }
}

/**
 * Simple assertion helper
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// Run tests if called directly
if (require.main === module) {
  runTests()
    .then(() => {
      console.log('🎉 Test suite completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = { runTests };
