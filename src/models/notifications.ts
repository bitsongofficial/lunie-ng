export interface Notification {
  id: number;
  type: string;
  message: string;
}

export type NotificationPosition = 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'left' | 'right' | 'center' | undefined;
