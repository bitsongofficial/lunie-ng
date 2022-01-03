import { Notification } from 'src/models';

export interface NotificationsStateInterface {
  notificationIdCounter: number;
  notifications: Notification[];
}

function state (): NotificationsStateInterface {
  return {
    notificationIdCounter: 0,
    notifications: [],
  }
}

export default state;
