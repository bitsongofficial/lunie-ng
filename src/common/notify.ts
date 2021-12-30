import { Notify } from 'quasar';

function notify(message: string, success = true) {
  return Notify.create({
    message,
    color: success ? 'positive' : 'negative',
    position: 'bottom',
    timeout: 2500,
  });
}

export function notifySuccess(message: string) {
  return notify(message, true);
}

export function notifyError(message: string) {
  return notify(message, false);
}
