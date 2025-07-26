
export interface MenuItem {
    label: string;
    path?: string;
    icon: string | [string, string]; // Single icon or an array of two icons for light/dark themes
    action?: string
  }