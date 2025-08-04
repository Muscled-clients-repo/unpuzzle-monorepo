export interface DestinationCallback {
    (error: Error | null, destination: string): void;
}
  
export interface FileNameCallback {
    (error: Error | null, filename: string): void;
}