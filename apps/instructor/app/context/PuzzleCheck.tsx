import { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

interface PuzzleCheckData {
  completion?: any[];
  message?: string;
  error?: string;
  [key: string]: any;
}

export class PuzzleCheck {
  private _data: PuzzleCheckData | null = null;
  private _totalScore: number = 0;
  private _score: number = 0;
  private _index: number = 0;
  private _loading: boolean = false;
  private _onDataChange?: (data: PuzzleCheckData | null) => void;
  private _onLoadingChange?: (loading: boolean) => void;
  private _onStreamChange?: (streamData: string) => void;
  private _onScoreChange?: (
    score: number,
    totalScore: number,
    index: number
  ) => void;

  constructor() {
    this.init();
  }

  init() {
    // Initialize the interface
  }

  set data(value: PuzzleCheckData | null) {
    this._data = value;
    this._onDataChange?.(value);
  }

  get data(): PuzzleCheckData | null {
    return this._data;
  }

  set totalScore(value: number) {
    this._totalScore = value;
    this._onScoreChange?.(this._score, this._totalScore, this._index);
  }

  get totalScore(): number {
    return this._totalScore;
  }

  set score(value: number) {
    this._score = value;
    this._onScoreChange?.(this._score, this._totalScore, this._index);
  }

  get score(): number {
    return this._score;
  }

  set index(value: number) {
    this._index = value;
    this._onScoreChange?.(this._score, this._totalScore, this._index);
  }

  get index(): number {
    return this._index;
  }

  setLoading(loading: boolean) {
    this._loading = loading;
    this._onLoadingChange?.(loading);
  }

  showStream(data: string) {
    this._onStreamChange?.(data);
  }

  updateCheck(data?: PuzzleCheckData) {
    if (data) {
      this.data = data;
    }
    // Trigger UI update
    this._onDataChange?.(this._data);
  }

  // Event listeners for React components
  onDataChange(callback: (data: PuzzleCheckData | null) => void) {
    this._onDataChange = callback;
  }

  onLoadingChange(callback: (loading: boolean) => void) {
    this._onLoadingChange = callback;
  }

  onStreamChange(callback: (streamData: string) => void) {
    this._onStreamChange = callback;
  }

  onScoreChange(
    callback: (score: number, totalScore: number, index: number) => void
  ) {
    this._onScoreChange = callback;
  }
}
