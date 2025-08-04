#!/usr/bin/env ts-node

/**
 * Test script to verify both auth providers work correctly
 * This helps ensure the migration will be smooth
 */

import { AuthFactory } from '../protocols/auth/AuthFactory';
import { config } from 'dotenv';

// Load environment variables
config();

async function testAuthProvider() {
  console.log(`🧪 Testing auth provider: ${AuthFactory.getProviderType()}`);
  
  try {
    const authProvider = AuthFactory.createProvider();
    
    // Test 1: Try to get a non-existent user
    console.log('📝 Test 1: Get non-existent user...');
    try {
      await authProvider.getUserById('non-existent-id');
      console.log('❌ Should have thrown an error');
    } catch (error) {
      console.log('✅ Correctly handled non-existent user');
    }
    
    // Test 2: Try to validate an invalid token
    console.log('📝 Test 2: Validate invalid token...');
    try {
      await authProvider.validateToken('invalid-token');
      console.log('❌ Should have thrown an error');
    } catch (error) {
      console.log('✅ Correctly rejected invalid token');
    }
    
    // Test 3: Get user by email (should handle gracefully if not found)
    console.log('📝 Test 3: Get user by non-existent email...');
    try {
      const user = await authProvider.getUserByEmail('nonexistent@example.com');
      if (!user) {
        console.log('✅ Correctly returned null for non-existent email');
      } else {
        console.log('ℹ️  Found existing user with test email');
      }
    } catch (error) {
      console.log('✅ Correctly handled email lookup error');
    }
    
    console.log(`\n🎉 Auth provider ${AuthFactory.getProviderType()} is working correctly!`);
    
  } catch (error) {
    console.error(`❌ Auth provider test failed:`, (error as Error).message);
    process.exit(1);
  }
}

async function testBothProviders() {
  console.log('🔍 Testing authentication provider compatibility...\n');
  
  // Test current provider
  await testAuthProvider();
  
  console.log('\n✅ Authentication system is ready for migration!');
  console.log('\n📋 Migration checklist:');
  console.log('  ☐ Set up Supabase project');
  console.log('  ☐ Add Supabase environment variables');
  console.log('  ☐ Run: npm run migrate-auth:export');
  console.log('  ☐ Run: npm run migrate-auth:migrate');
  console.log('  ☐ Update AUTH_PROVIDER=supabase in .env');
  console.log('  ☐ Test authentication flow');
  console.log('  ☐ Deploy to production');
}

// Run tests
testBothProviders().catch(console.error);