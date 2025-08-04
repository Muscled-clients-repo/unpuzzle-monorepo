#!/usr/bin/env ts-node

/**
 * Migration script to move from Clerk to Supabase Auth
 * 
 * Usage: npm run migrate-auth
 * 
 * This script:
 * 1. Exports users from current database
 * 2. Creates corresponding users in Supabase Auth
 * 3. Maintains user relationships and data integrity
 * 4. Provides rollback capabilities
 */

import { createClient } from '@supabase/supabase-js';
import UserModel from '../models/supabase/user.model';
import fs from 'fs';
import path from 'path';

interface MigrationUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
}

class AuthMigration {
  private supabase;
  private backupFile: string;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    this.backupFile = path.join(__dirname, '../backups', `users-backup-${Date.now()}.json`);
  }

  /**
   * Export current users to backup file
   */
  async exportUsers(): Promise<MigrationUser[]> {
    console.log('📤 Exporting current users...');
    
    try {
      // Get all users from current database
      const users = await UserModel.getAllUsers();
      
      // Create backup directory if it doesn't exist
      const backupDir = path.dirname(this.backupFile);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      // Save backup
      fs.writeFileSync(this.backupFile, JSON.stringify(users, null, 2));
      
      console.log(`✅ Exported ${users.length} users to ${this.backupFile}`);
      return users;
    } catch (error) {
      console.error('❌ Error exporting users:', error);
      throw error;
    }
  }

  /**
   * Import users to Supabase Auth
   */
  async importUsersToSupabase(users: MigrationUser[]): Promise<void> {
    console.log('📥 Importing users to Supabase Auth...');
    
    let successCount = 0;
    let errorCount = 0;
    const errors: any[] = [];

    for (const user of users) {
      try {
        // Create user in Supabase Auth
        const { data, error } = await this.supabase.auth.admin.createUser({
          id: user.id, // Preserve original user ID
          email: user.email,
          email_confirm: true,
          user_metadata: user.metadata || {},
          created_at: user.created_at
        });

        if (error) {
          throw error;
        }

        successCount++;
        console.log(`✅ Migrated user: ${user.email}`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        errorCount++;
        errors.push({ user: user.email, error: error.message });
        console.error(`❌ Failed to migrate user ${user.email}:`, error.message);
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`✅ Successfully migrated: ${successCount} users`);
    console.log(`❌ Failed migrations: ${errorCount} users`);
    
    if (errors.length > 0) {
      const errorFile = path.join(path.dirname(this.backupFile), `migration-errors-${Date.now()}.json`);
      fs.writeFileSync(errorFile, JSON.stringify(errors, null, 2));
      console.log(`📝 Error details saved to: ${errorFile}`);
    }
  }

  /**
   * Verify migration success
   */
  async verifyMigration(): Promise<boolean> {
    console.log('🔍 Verifying migration...');
    
    try {
      // Get user count from original database
      const originalUsers = JSON.parse(fs.readFileSync(this.backupFile, 'utf8'));
      
      // Get user count from Supabase Auth
      const { data: supabaseUsers, error } = await this.supabase.auth.admin.listUsers();
      
      if (error) {
        throw error;
      }

      const originalCount = originalUsers.length;
      const migratedCount = supabaseUsers.users.length;
      
      console.log(`📊 Original users: ${originalCount}`);
      console.log(`📊 Migrated users: ${migratedCount}`);
      
      if (originalCount === migratedCount) {
        console.log('✅ Migration verification successful!');
        return true;
      } else {
        console.log('⚠️  Migration verification failed - user counts don\'t match');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error verifying migration:', error);
      return false;
    }
  }

  /**
   * Rollback migration
   */
  async rollback(): Promise<void> {
    console.log('🔄 Rolling back migration...');
    
    try {
      // This would delete all users from Supabase Auth
      // BE VERY CAREFUL WITH THIS
      const { data: users, error } = await this.supabase.auth.admin.listUsers();
      
      if (error) {
        throw error;
      }

      for (const user of users.users) {
        await this.supabase.auth.admin.deleteUser(user.id);
      }
      
      console.log('✅ Rollback completed');
    } catch (error) {
      console.error('❌ Error during rollback:', error);
      throw error;
    }
  }

  /**
   * Run complete migration
   */
  async migrate(): Promise<void> {
    try {
      console.log('🚀 Starting authentication migration...\n');
      
      // Step 1: Export users
      const users = await this.exportUsers();
      
      // Step 2: Create users in Supabase Auth
      await this.importUsersToSupabase(users);
      
      // Step 3: Verify migration
      const verified = await this.verifyMigration();
      
      if (verified) {
        console.log('\n🎉 Migration completed successfully!');
        console.log('📝 Next steps:');
        console.log('1. Update AUTH_PROVIDER=supabase in your .env file');
        console.log('2. Deploy the updated authentication middleware');
        console.log('3. Test the authentication flow');
        console.log('4. Monitor for any issues');
      } else {
        console.log('\n⚠️  Migration completed with issues. Please review the logs.');
      }
      
    } catch (error) {
      console.error('💥 Migration failed:', error);
      console.log('\n🔄 You can run the rollback with: npm run rollback-auth');
    }
  }
}

// CLI Interface
const command = process.argv[2];
const migration = new AuthMigration();

switch (command) {
  case 'migrate':
    migration.migrate();
    break;
  case 'verify':
    migration.verifyMigration();
    break;
  case 'rollback':
    migration.rollback();
    break;
  case 'export':
    migration.exportUsers();
    break;
  default:
    console.log('Usage:');
    console.log('  npm run migrate-auth migrate   - Run full migration');
    console.log('  npm run migrate-auth verify    - Verify migration');
    console.log('  npm run migrate-auth rollback  - Rollback migration');
    console.log('  npm run migrate-auth export    - Export users only');
}