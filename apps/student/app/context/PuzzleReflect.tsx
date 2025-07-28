interface PuzzleReflectData {
  completion?: any[];
  error?: string;
  [key: string]: any;
}

export class PuzzleReflect {
  private _data: PuzzleReflectData | null = null;
  private _loading: boolean = false;
  private _totalScore: number = 0;
  private _score: number = 0;
  private _onDataChange?: (data: PuzzleReflectData | null) => void;
  private _onLoadingChange?: (loading: boolean) => void;
  private _onScoreChange?: (score: number, totalScore: number) => void;
  private _onReset?: () => void;

  constructor() {
    this.init();
  }

  init() {
    // Initialize the interface
  }

  set data(value: PuzzleReflectData | null) {
    this._data = value;
    this._onDataChange?.(value);
  }

  get data(): PuzzleReflectData | null {
    return this._data;
  }

  set totalScore(value: number) {
    this._totalScore = value;
    this._onScoreChange?.(this._score, this._totalScore);
  }

  get totalScore(): number {
    return this._totalScore;
  }

  set score(value: number) {
    this._score = value;
    this._onScoreChange?.(this._score, this._totalScore);
  }

  get score(): number {
    return this._score;
  }

  setLoading(loading: boolean) {
    this._loading = loading;
    this._onLoadingChange?.(loading);
  }

  updateReflect(data?: PuzzleReflectData) {
    if (data) {
      this.data = data;
    }
    // Trigger UI update
    this._onDataChange?.(this._data);
  }

  resetPuzzleReflect() {
    this._onReset?.();
  }

  // Event listeners for React components
  onDataChange(callback: (data: PuzzleReflectData | null) => void) {
    this._onDataChange = callback;
  }

  onLoadingChange(callback: (loading: boolean) => void) {
    this._onLoadingChange = callback;
  }

  onScoreChange(callback: (score: number, totalScore: number) => void) {
    this._onScoreChange = callback;
  }

  onReset(callback: () => void) {
    this._onReset = callback;
  }
}
