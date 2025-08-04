import { changeTracker } from './changeTracker';
import { changeManager } from './changeManager';
import * as fs from 'fs';

/**
 * Enhanced file operations that automatically track changes
 */
export class TrackedFileOperations {
  
  /**
   * Create a new file with tracking
   */
  static async trackedWrite(filePath: string, content: string, description: string): Promise<string> {
    try {
      // Check if file already exists to get before content
      let beforeContent: string | undefined;
      if (fs.existsSync(filePath)) {
        beforeContent = fs.readFileSync(filePath, 'utf8');
      }

      // Write the file
      fs.writeFileSync(filePath, content, 'utf8');
      
      // Track the change
      if (beforeContent === undefined) {
        // New file creation
        return changeTracker.trackCreate(filePath, content, description);
      } else {
        // File edit
        return changeTracker.trackEdit(filePath, beforeContent, content, description);
      }
    } catch (error) {
      console.error(`❌ Failed to write file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Edit a file with tracking
   */
  static async trackedEdit(
    filePath: string, 
    oldString: string, 
    newString: string, 
    description: string, 
    replaceAll: boolean = false
  ): Promise<string> {
    try {
      // Read current content
      if (!fs.existsSync(filePath)) {
        throw new Error(`File ${filePath} does not exist`);
      }
      
      const beforeContent = fs.readFileSync(filePath, 'utf8');
      
      // Perform the edit
      let afterContent: string;
      if (replaceAll) {
        afterContent = beforeContent.split(oldString).join(newString);
      } else {
        afterContent = beforeContent.replace(oldString, newString);
      }
      
      // Check if any changes were made
      if (beforeContent === afterContent) {
        console.log(`⚠️ No changes made to ${filePath} - content was identical`);
        return '';
      }
      
      // Write the updated content
      fs.writeFileSync(filePath, afterContent, 'utf8');
      
      // Track the change
      return changeTracker.trackEdit(filePath, beforeContent, afterContent, description);
    } catch (error) {
      console.error(`❌ Failed to edit file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Multiple edits in one operation with tracking
   */
  static async trackedMultiEdit(
    filePath: string,
    edits: Array<{ oldString: string; newString: string; replaceAll?: boolean }>,
    description: string
  ): Promise<string> {
    try {
      // Read current content
      if (!fs.existsSync(filePath)) {
        throw new Error(`File ${filePath} does not exist`);
      }
      
      const beforeContent = fs.readFileSync(filePath, 'utf8');
      let afterContent = beforeContent;
      
      // Apply all edits sequentially
      for (const edit of edits) {
        if (edit.replaceAll) {
          afterContent = afterContent.split(edit.oldString).join(edit.newString);
        } else {
          afterContent = afterContent.replace(edit.oldString, edit.newString);
        }
      }
      
      // Check if any changes were made
      if (beforeContent === afterContent) {
        console.log(`⚠️ No changes made to ${filePath} - content was identical after all edits`);
        return '';
      }
      
      // Write the updated content
      fs.writeFileSync(filePath, afterContent, 'utf8');
      
      // Track the change
      const editsSummary = edits.map(e => ({ oldString: e.oldString, newString: e.newString }));
      return changeTracker.trackMultiEdit(filePath, beforeContent, afterContent, editsSummary, description);
    } catch (error) {
      console.error(`❌ Failed to multi-edit file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Delete a file with tracking
   */
  static async trackedDelete(filePath: string, description: string): Promise<string> {
    try {
      // Read content before deletion
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️ File ${filePath} already doesn't exist`);
        return '';
      }
      
      const beforeContent = fs.readFileSync(filePath, 'utf8');
      
      // Delete the file
      fs.unlinkSync(filePath);
      
      // Track the change
      return changeTracker.trackDelete(filePath, beforeContent, description);
    } catch (error) {
      console.error(`❌ Failed to delete file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Read a file (for reference, doesn't need tracking)
   */
  static async readFile(filePath: string): Promise<string> {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error(`❌ Failed to read file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Utility functions for change management
   */
  static getChangeHistory() {
    return changeTracker.getAllChanges();
  }

  static getRecentChanges(count: number = 10) {
    return changeTracker.getRecentChanges(count);
  }

  static async revertChange(changeId: string) {
    return changeManager.revertChange(changeId);
  }

  static async revertToChange(changeId: string) {
    return changeManager.revertToChange(changeId);
  }

  static getRevertPreview(changeId: string) {
    return changeManager.getRevertPreview(changeId);
  }

  static printChangesSummary() {
    changeTracker.printChangesSummary();
  }

  static exportChanges() {
    return changeManager.exportChangeHistory();
  }

  static importChanges(jsonString: string) {
    changeManager.importChangeHistory(jsonString);
  }
}

// Convenience exports
export const { 
  trackedWrite, 
  trackedEdit, 
  trackedMultiEdit, 
  trackedDelete, 
  readFile,
  getChangeHistory,
  getRecentChanges,
  revertChange,
  revertToChange,
  getRevertPreview,
  printChangesSummary,
  exportChanges,
  importChanges
} = TrackedFileOperations;