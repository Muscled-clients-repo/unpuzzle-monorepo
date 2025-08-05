import { TrackedFileOperations } from './trackedFileOperations';

/**
 * Simple interface for managing tracked changes
 */
export class ChangeInterface {
  
  /**
   * Show all recent changes
   */
  static showRecentChanges(count: number = 10): void {
    console.log(`\n📋 RECENT CHANGES (Last ${count}):`);
    console.log('=====================================');
    
    const changes = TrackedFileOperations.getRecentChanges(count);
    
    if (changes.length === 0) {
      console.log('No changes tracked yet.');
      return;
    }
    
    changes.forEach((change, index) => {
      const time = new Date(change.timestamp).toLocaleString();
      console.log(`\n${index + 1}. 🔄 ${change.id}`);
      console.log(`   📅 ${time}`);
      console.log(`   📁 ${change.filePath}`);
      console.log(`   🏷️  ${change.changeType}`);
      console.log(`   📝 ${change.description}`);
      
      if (change.edits && change.edits.length > 0) {
        console.log(`   ✏️  ${change.edits.length} edits made`);
      }
    });
    
    console.log(`\n💡 Use revertChange('CHANGE_ID') to revert any change\n`);
  }

  /**
   * Show changes for a specific file
   */
  static showFileChanges(filePath: string): void {
    console.log(`\n📋 CHANGES FOR: ${filePath}`);
    console.log('=====================================');
    
    const allChanges = TrackedFileOperations.getChangeHistory();
    const fileChanges = allChanges.filter(change => change.filePath === filePath);
    
    if (fileChanges.length === 0) {
      console.log('No changes found for this file.');
      return;
    }
    
    fileChanges.forEach((change, index) => {
      const time = new Date(change.timestamp).toLocaleString();
      console.log(`\n${index + 1}. 🔄 ${change.id}`);
      console.log(`   📅 ${time}`);
      console.log(`   🏷️  ${change.changeType}`);
      console.log(`   📝 ${change.description}`);
    });
    
    console.log(`\n💡 Use revertChange('CHANGE_ID') to revert any change\n`);
  }

  /**
   * Show detailed information about a specific change
   */
  static showChangeDetails(changeId: string): void {
    const allChanges = TrackedFileOperations.getChangeHistory();
    const change = allChanges.find(c => c.id === changeId);
    
    if (!change) {
      console.log(`❌ Change with ID '${changeId}' not found.`);
      return;
    }
    
    console.log(`\n🔍 CHANGE DETAILS: ${changeId}`);
    console.log('=====================================');
    console.log(`📅 Timestamp: ${new Date(change.timestamp).toLocaleString()}`);
    console.log(`📁 File: ${change.filePath}`);
    console.log(`🏷️  Type: ${change.changeType}`);
    console.log(`📝 Description: ${change.description}`);
    
    if (change.edits && change.edits.length > 0) {
      console.log(`\n✏️  EDITS MADE (${change.edits.length}):`);
      change.edits.forEach((edit, index) => {
        console.log(`\n  ${index + 1}. Old: "${edit.oldString.substring(0, 100)}${edit.oldString.length > 100 ? '...' : ''}"`);
        console.log(`     New: "${edit.newString.substring(0, 100)}${edit.newString.length > 100 ? '...' : ''}"`);
      });
    }
    
    console.log(`\n🔄 Revert Preview: ${TrackedFileOperations.getRevertPreview(changeId)}`);
    console.log(`\n💡 Use revertChange('${changeId}') to revert this change\n`);
  }

  /**
   * Quick help guide
   */
  static showHelp(): void {
    console.log(`
📚 CHANGE TRACKING SYSTEM HELP
====================================

📋 VIEW CHANGES:
• showRecentChanges(10)        - Show last 10 changes
• showFileChanges(filePath)    - Show changes for specific file  
• showChangeDetails(changeId)  - Show detailed info about a change

🔄 REVERT CHANGES:
• revertChange(changeId)       - Revert a specific change
• revertToChange(changeId)     - Revert all changes after a specific point
• getRevertPreview(changeId)   - Preview what would be reverted

💾 BACKUP/RESTORE:
• exportChanges()              - Export change history as JSON
• importChanges(jsonString)    - Import change history from JSON

🏷️  CHANGE TYPES:
• CREATE    - New file created
• EDIT      - File modified (single edit)
• MULTIEDIT - File modified (multiple edits in one operation)
• DELETE    - File deleted

💡 EXAMPLES:
• showRecentChanges(5)
• revertChange('CHANGE_3_1234567890')
• showFileChanges('app/components/VideoAnalytics.tsx')

`);
  }

  /**
   * Interactive revert with confirmation
   */
  static async interactiveRevert(changeId: string): Promise<boolean> {
    const preview = TrackedFileOperations.getRevertPreview(changeId);
    
    console.log(`\n🔄 REVERT PREVIEW:`);
    console.log(`${preview}`);
    console.log(`\n⚠️  This will modify your files. Are you sure? (This is just a preview - actual revert would need confirmation)`);
    
    // In a real CLI, you'd wait for user input here
    // For now, just show what would happen
    console.log(`💡 To actually revert, call: await revertChange('${changeId}')`);
    
    return false; // Not actually reverting in preview mode
  }
}

// Global convenience functions you can use directly
declare global {
  var showRecentChanges: (count?: number) => void;
  var showFileChanges: (filePath: string) => void;
  var showChangeDetails: (changeId: string) => void;
  var revertChange: (changeId: string) => Promise<boolean>;
  var revertToChange: (changeId: string) => Promise<boolean>;
  var getRevertPreview: (changeId: string) => string;
  var exportChanges: () => string;
  var importChanges: (jsonString: string) => void;
  var helpChanges: () => void;
}

// Make functions globally available for easy access
if (typeof globalThis !== 'undefined') {
  globalThis.showRecentChanges = ChangeInterface.showRecentChanges;
  globalThis.showFileChanges = ChangeInterface.showFileChanges;
  globalThis.showChangeDetails = ChangeInterface.showChangeDetails;
  globalThis.revertChange = TrackedFileOperations.revertChange;
  globalThis.revertToChange = TrackedFileOperations.revertToChange;
  globalThis.getRevertPreview = TrackedFileOperations.getRevertPreview;
  globalThis.exportChanges = TrackedFileOperations.exportChanges;
  globalThis.importChanges = TrackedFileOperations.importChanges;
  globalThis.helpChanges = ChangeInterface.showHelp;
}

