import { useCallback, useEffect, useRef, useState } from "react";

interface PuzzleHintData {
  message?: string;
  error?: string;
  [key: string]: any;
}

export class PuzzleHint {
  private _data: PuzzleHintData | null = null;
  private _loading: boolean = false;
  private _onDataChange?: (data: PuzzleHintData | null) => void;
  private _onLoadingChange?: (loading: boolean) => void;
  private _onStreamChange?: (streamData: string) => void;

  constructor() {
    this.init();
  }

  init() {
    // Initialize the interface
  }

  set data(value: PuzzleHintData | null) {
    this._data = value;
    this._onDataChange?.(value);
  }

  get data(): PuzzleHintData | null {
    return this._data;
  }

  setLoading(loading: boolean) {
    this._loading = loading;
    this._onLoadingChange?.(loading);
  }

  showStream(data: string) {
    this._onStreamChange?.(data);
  }

  updateHint(data?: PuzzleHintData) {
    if (data) {
      this.data = data;
    }
    // Trigger UI update
    this._onDataChange?.(this._data);
  }

  // Event listeners for React components
  onDataChange(callback: (data: PuzzleHintData | null) => void) {
    this._onDataChange = callback;
  }

  onLoadingChange(callback: (loading: boolean) => void) {
    this._onLoadingChange = callback;
  }

  onStreamChange(callback: (streamData: string) => void) {
    this._onStreamChange = callback;
  }
}
