import { Notify } from 'quasar';
import { NotificationPosition } from 'src/models';

function notify(message: string, success = true, position: NotificationPosition = 'bottom') {
  return Notify.create({
    message,
    color: success ? 'positive' : 'negative',
    icon: success ? 'svguse:icons.svg#check|0 0 70 70' : 'svguse:icons.svg#error-outlined|0 0 70 70',
    position,
    timeout: 2500,
    classes: position === 'top-right' || position === 'bottom-right' ? 'offset-notify' : ''
  });
}

export function notifySuccess(message: string, position: NotificationPosition = 'bottom') {
  return notify(message, true, position);
}

export function notifyError(message: string, position: NotificationPosition = 'bottom') {
  return notify(message, false, position);
}
