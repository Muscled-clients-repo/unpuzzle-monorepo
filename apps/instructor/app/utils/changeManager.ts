import { changeTracker, CodeChange } from './changeTracker';
import * as fs from 'fs';
import * as path from 'path';

class ChangeManager {
  
  /**
   * Revert a specific change by its ID
   */
  async revertChange(changeId: string): Promise<boolean> {
    const change = changeTracker.getChangeById(changeId);
    if (!change) {
      console.error(`❌ Change with ID ${changeId} not found`);
      return false;
    }

    try {
      switch (change.changeType) {
        case 'CREATE':
          return this.revertCreate(change);
        case 'EDIT':
          return this.revertEdit(change);
        case 'MULTIEDIT':
          return this.revertMultiEdit(change);
        case 'DELETE':
          return this.revertDelete(change);
        default:
          console.error(`❌ Unknown change type: ${change.changeType}`);
          return false;
      }
    } catch (error) {
      console.error(`❌ Failed to revert change ${changeId}:`, error);
      return false;
    }
  }

  /**
   * Revert multiple changes in reverse chronological order
   */
  async revertChanges(changeIds: string[]): Promise<boolean> {
    let allSuccessful = true;
    
    // Revert in reverse order (most recent first)
    for (const changeId of changeIds.reverse()) {
      const success = await this.revertChange(changeId);
      if (!success) {
        allSuccessful = false;
        console.error(`❌ Failed to revert change: ${changeId}`);
      }
    }
    
    return allSuccessful;
  }

  /**
   * Revert all changes to a specific file
   */
  async revertFileChanges(filePath: string): Promise<boolean> {
    const fileChanges = changeTracker.getChangesByFile(filePath);
    const changeIds = fileChanges.map(change => change.id);
    return this.revertChanges(changeIds);
  }

  /**
   * Revert to a specific point in time (all changes after a certain change ID)
   */
  async revertToChange(targetChangeId: string): Promise<boolean> {
    const allChanges = changeTracker.getAllChanges();
    const targetIndex = allChanges.findIndex(change => change.id === targetChangeId);
    
    if (targetIndex === -1) {
      console.error(`❌ Target change ${targetChangeId} not found`);
      return false;
    }

    // Get all changes after the target change
    const changesToRevert = allChanges.slice(targetIndex + 1);
    const changeIds = changesToRevert.map(change => change.id);
    
    console.log(`🔄 Reverting ${changeIds.length} changes to get back to ${targetChangeId}`);
    return this.revertChanges(changeIds);
  }

  private async revertCreate(change: CodeChange): Promise<boolean> {
    try {
      if (fs.existsSync(change.filePath)) {
        fs.unlinkSync(change.filePath);
        console.log(`✅ Reverted CREATE: Deleted file ${change.filePath}`);
        return true;
      } else {
        console.log(`⚠️ File ${change.filePath} already doesn't exist`);
        return true;
      }
    } catch (error) {
      console.error(`❌ Failed to delete file ${change.filePath}:`, error);
      return false;
    }
  }

  private async revertEdit(change: CodeChange): Promise<boolean> {
    if (!change.beforeContent) {
      console.error(`❌ No before content available for change ${change.id}`);
      return false;
    }

    try {
      fs.writeFileSync(change.filePath, change.beforeContent, 'utf8');
      console.log(`✅ Reverted EDIT: Restored ${change.filePath} to previous state`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to revert edit to ${change.filePath}:`, error);
      return false;
    }
  }

  private async revertMultiEdit(change: CodeChange): Promise<boolean> {
    if (!change.beforeContent) {
      console.error(`❌ No before content available for change ${change.id}`);
      return false;
    }

    try {
      fs.writeFileSync(change.filePath, change.beforeContent, 'utf8');
      console.log(`✅ Reverted MULTIEDIT: Restored ${change.filePath} to previous state`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to revert multiedit to ${change.filePath}:`, error);
      return false;
    }
  }

  private async revertDelete(change: CodeChange): Promise<boolean> {
    if (!change.beforeContent) {
      console.error(`❌ No before content available for change ${change.id}`);
      return false;
    }

    try {
      // Ensure directory exists
      const dir = path.dirname(change.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(change.filePath, change.beforeContent, 'utf8');
      console.log(`✅ Reverted DELETE: Restored file ${change.filePath}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to restore deleted file ${change.filePath}:`, error);
      return false;
    }
  }

  /**
   * Get a preview of what would be reverted without actually doing it
   */
  getRevertPreview(changeId: string): string {
    const change = changeTracker.getChangeById(changeId);
    if (!change) {
      return `❌ Change ${changeId} not found`;
    }

    switch (change.changeType) {
      case 'CREATE':
        return `Would delete file: ${change.filePath}`;
      case 'EDIT':
        return `Would restore ${change.filePath} to previous version`;
      case 'MULTIEDIT':
        return `Would restore ${change.filePath} to previous version (undoing ${change.edits?.length || 0} edits)`;
      case 'DELETE':
        return `Would restore deleted file: ${change.filePath}`;
      default:
        return `Unknown change type: ${change.changeType}`;
    }
  }

  /**
   * Export changes history for backup
   */
  exportChangeHistory(): string {
    return changeTracker.exportChanges();
  }

  /**
   * Import changes history from backup
   */
  importChangeHistory(jsonString: string): void {
    changeTracker.importChanges(jsonString);
  }
}

export const changeManager = new ChangeManager();