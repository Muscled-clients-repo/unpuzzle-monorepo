/**
 * Notification Service
 * Handles in-app notifications and toasts
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  id?: string;
  title?: string;
  message: string;
  type?: NotificationType;
  duration?: number; // in milliseconds, 0 for persistent
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  actions?: NotificationAction[];
  dismissible?: boolean;
  onDismiss?: () => void;
  onClick?: () => void;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  primary?: boolean;
}

export interface Notification extends Required<Omit<NotificationOptions, 'actions' | 'onDismiss' | 'onClick'>> {
  id: string;
  timestamp: number;
  dismissed: boolean;
  actions?: NotificationAction[];
  onDismiss?: () => void;
  onClick?: () => void;
}

export class NotificationService {
  private notifications: Map<string, Notification> = new Map();
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private defaultPosition: NotificationOptions['position'] = 'top-right';
  private nextId = 1;

  /**
   * Set default position for notifications
   */
  setDefaultPosition(position: NotificationOptions['position']): void {
    this.defaultPosition = position;
  }

  /**
   * Generate unique notification ID
   */
  private generateId(): string {
    return `notification_${this.nextId++}_${Date.now()}`;
  }

  /**
   * Add listener for notification changes
   */
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.add(listener);
    
    // Send current notifications to new listener
    listener(this.getAll());
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of changes
   */
  private notifyListeners(): void {
    const notifications = this.getAll();
    this.listeners.forEach(listener => listener(notifications));
  }

  /**
   * Show a success notification
   */
  success(message: string, options?: Omit<NotificationOptions, 'message' | 'type'>): string {
    return this.show({
      ...options,
      message,
      type: 'success',
    });
  }

  /**
   * Show an error notification
   */
  error(message: string, options?: Omit<NotificationOptions, 'message' | 'type'>): string {
    return this.show({
      ...options,
      message,
      type: 'error',
      duration: options?.duration ?? 0, // Errors are persistent by default
    });
  }

  /**
   * Show a warning notification
   */
  warning(message: string, options?: Omit<NotificationOptions, 'message' | 'type'>): string {
    return this.show({
      ...options,
      message,
      type: 'warning',
    });
  }

  /**
   * Show an info notification
   */
  info(message: string, options?: Omit<NotificationOptions, 'message' | 'type'>): string {
    return this.show({
      ...options,
      message,
      type: 'info',
    });
  }

  /**
   * Show a notification
   */
  show(options: NotificationOptions): string {
    const id = options.id || this.generateId();
    
    const notification: Notification = {
      id,
      title: options.title || '',
      message: options.message,
      type: options.type || 'info',
      duration: options.duration ?? 5000,
      position: (options.position || this.defaultPosition) as 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
      dismissible: options.dismissible ?? true,
      timestamp: Date.now(),
      dismissed: false,
      actions: options.actions,
      onDismiss: options.onDismiss,
      onClick: options.onClick,
    };

    // Remove existing notification with same ID
    if (this.notifications.has(id)) {
      this.dismiss(id);
    }

    this.notifications.set(id, notification);

    // Auto-dismiss after duration (if not persistent)
    if (notification.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, notification.duration);
    }

    this.notifyListeners();
    return id;
  }

  /**
   * Dismiss a notification
   */
  dismiss(id: string): boolean {
    const notification = this.notifications.get(id);
    if (!notification || notification.dismissed) return false;

    notification.dismissed = true;
    notification.onDismiss?.();
    
    // Remove from map after animation time
    setTimeout(() => {
      this.notifications.delete(id);
      this.notifyListeners();
    }, 300);

    this.notifyListeners();
    return true;
  }

  /**
   * Dismiss all notifications
   */
  dismissAll(): void {
    this.notifications.forEach((_, id) => {
      this.dismiss(id);
    });
  }

  /**
   * Clear all notifications immediately
   */
  clearAll(): void {
    this.notifications.clear();
    this.notifyListeners();
  }

  /**
   * Get a specific notification
   */
  get(id: string): Notification | undefined {
    return this.notifications.get(id);
  }

  /**
   * Get all active notifications
   */
  getAll(): Notification[] {
    return Array.from(this.notifications.values())
      .filter(notification => !notification.dismissed)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get notifications by type
   */
  getByType(type: NotificationType): Notification[] {
    return this.getAll().filter(notification => notification.type === type);
  }

  /**
   * Get notifications by position
   */
  getByPosition(position: NotificationOptions['position']): Notification[] {
    return this.getAll().filter(notification => notification.position === position);
  }

  /**
   * Update an existing notification
   */
  update(id: string, updates: Partial<NotificationOptions>): boolean {
    const notification = this.notifications.get(id);
    if (!notification || notification.dismissed) return false;

    // Apply updates
    Object.assign(notification, updates);
    
    // Update timestamp to reflect the change
    notification.timestamp = Date.now();

    this.notifyListeners();
    return true;
  }

  /**
   * Check if any notifications of a specific type exist
   */
  hasType(type: NotificationType): boolean {
    return this.getByType(type).length > 0;
  }

  /**
   * Get notification count
   */
  getCount(): number {
    return this.getAll().length;
  }

  /**
   * Get notification count by type
   */
  getCountByType(type: NotificationType): number {
    return this.getByType(type).length;
  }

  /**
   * Show a confirmation notification with actions
   */
  confirm(
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    options?: Omit<NotificationOptions, 'message' | 'actions' | 'duration'>
  ): string {
    return this.show({
      ...options,
      message,
      type: 'warning',
      duration: 0, // Persistent until action is taken
      actions: [
        {
          label: 'Confirm',
          action: () => {
            onConfirm();
            this.dismiss(options?.id || this.generateId());
          },
          primary: true,
        },
        {
          label: 'Cancel',
          action: () => {
            onCancel?.();
            this.dismiss(options?.id || this.generateId());
          },
        },
      ],
    });
  }

  /**
   * Show a loading notification
   */
  loading(message: string, options?: Omit<NotificationOptions, 'message' | 'type' | 'duration'>): string {
    return this.show({
      ...options,
      message,
      type: 'info',
      duration: 0, // Persistent until manually dismissed
      dismissible: false,
    });
  }

  /**
   * Update loading notification to success
   */
  loadingSuccess(id: string, message: string, duration: number = 3000): boolean {
    return this.update(id, {
      message,
      type: 'success',
      duration,
      dismissible: true,
    });
  }

  /**
   * Update loading notification to error
   */
  loadingError(id: string, message: string): boolean {
    return this.update(id, {
      message,
      type: 'error',
      duration: 0,
      dismissible: true,
    });
  }
}

// Service class is exported, instances created in services/index.ts