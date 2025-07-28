import { useCallback, useEffect, useRef, useState } from "react";

interface PuzzlePathData {
  error?: string;
  [key: string]: any;
}

interface VideoData {
  id: string;
  puzzlePaths?: any[];
  [key: string]: any;
}

export class PuzzlePath {
  private _data: VideoData | null = null;
  private _loading: boolean = false;
  private _onDataChange?: (data: VideoData | null) => void;
  private _onLoadingChange?: (loading: boolean) => void;

  constructor() {
    this.init();
  }

  init() {
    // Initialize the interface
  }

  set data(value: VideoData | null) {
    this._data = value;
    this._onDataChange?.(value);
  }

  get data(): VideoData | null {
    return this._data;
  }

  setLoading(loading: boolean) {
    this._loading = loading;
    this._onLoadingChange?.(loading);
  }

  updatePath(data?: VideoData) {
    if (data) {
      this.data = data;
    }
    // Trigger UI update
    this._onDataChange?.(this._data);
  }

  // Event listeners for React components
  onDataChange(callback: (data: VideoData | null) => void) {
    this._onDataChange = callback;
  }

  onLoadingChange(callback: (loading: boolean) => void) {
    this._onLoadingChange = callback;
  }
}
