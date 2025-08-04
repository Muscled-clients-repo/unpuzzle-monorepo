interface CodeChange {
  id: string;
  timestamp: string;
  description: string;
  filePath: string;
  changeType: 'CREATE' | 'EDIT' | 'DELETE' | 'MULTIEDIT';
  beforeContent?: string;
  afterContent?: string;
  edits?: Array<{
    oldString: string;
    newString: string;
  }>;
}

class ChangeTracker {
  private changes: CodeChange[] = [];
  private currentChangeId = 1;

  private generateChangeId(): string {
    return `CHANGE_${this.currentChangeId++}_${Date.now()}`;
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  trackCreate(filePath: string, content: string, description: string): string {
    const changeId = this.generateChangeId();
    const change: CodeChange = {
      id: changeId,
      timestamp: this.getCurrentTimestamp(),
      description,
      filePath,
      changeType: 'CREATE',
      afterContent: content,
    };
    
    this.changes.push(change);
    console.log(`🔄 TRACKED CREATE: ${changeId} - ${description}`);
    return changeId;
  }

  trackEdit(filePath: string, beforeContent: string, afterContent: string, description: string): string {
    const changeId = this.generateChangeId();
    const change: CodeChange = {
      id: changeId,
      timestamp: this.getCurrentTimestamp(),
      description,
      filePath,
      changeType: 'EDIT',
      beforeContent,
      afterContent,
    };
    
    this.changes.push(change);
    console.log(`🔄 TRACKED EDIT: ${changeId} - ${description}`);
    return changeId;
  }

  trackMultiEdit(filePath: string, beforeContent: string, afterContent: string, edits: Array<{oldString: string, newString: string}>, description: string): string {
    const changeId = this.generateChangeId();
    const change: CodeChange = {
      id: changeId,
      timestamp: this.getCurrentTimestamp(),
      description,
      filePath,
      changeType: 'MULTIEDIT',
      beforeContent,
      afterContent,
      edits,
    };
    
    this.changes.push(change);
    console.log(`🔄 TRACKED MULTIEDIT: ${changeId} - ${description}`);
    return changeId;
  }

  trackDelete(filePath: string, beforeContent: string, description: string): string {
    const changeId = this.generateChangeId();
    const change: CodeChange = {
      id: changeId,
      timestamp: this.getCurrentTimestamp(),
      description,
      filePath,
      changeType: 'DELETE',
      beforeContent,
    };
    
    this.changes.push(change);
    console.log(`🔄 TRACKED DELETE: ${changeId} - ${description}`);
    return changeId;
  }

  getAllChanges(): CodeChange[] {
    return [...this.changes];
  }

  getChangeById(changeId: string): CodeChange | undefined {
    return this.changes.find(change => change.id === changeId);
  }

  getChangesByFile(filePath: string): CodeChange[] {
    return this.changes.filter(change => change.filePath === filePath);
  }

  getRecentChanges(count: number = 10): CodeChange[] {
    return this.changes.slice(-count).reverse();
  }

  exportChanges(): string {
    return JSON.stringify(this.changes, null, 2);
  }

  importChanges(jsonString: string): void {
    try {
      const importedChanges = JSON.parse(jsonString);
      this.changes = importedChanges;
      // Update current change ID to prevent conflicts
      const maxId = Math.max(...this.changes.map(c => parseInt(c.id.split('_')[1]) || 0));
      this.currentChangeId = maxId + 1;
      console.log(`📥 Imported ${this.changes.length} changes`);
    } catch (error) {
      console.error('❌ Failed to import changes:', error);
    }
  }

  printChangesSummary(): void {
    console.log('\n📋 CHANGES SUMMARY:');
    console.log('==================');
    this.getRecentChanges(20).forEach(change => {
      const time = new Date(change.timestamp).toLocaleTimeString();
      console.log(`${change.id} | ${time} | ${change.changeType} | ${change.filePath}`);
      console.log(`  └─ ${change.description}`);
    });
    console.log(`\nTotal tracked changes: ${this.changes.length}\n`);
  }
}

// Export singleton instance
export const changeTracker = new ChangeTracker();
export type { CodeChange };