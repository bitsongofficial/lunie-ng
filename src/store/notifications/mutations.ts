import { notifyError } from 'src/common/notify';
import { Notification } from 'src/models';
import { MutationTree } from 'vuex'
import { NotificationsStateInterface } from './state'

const mutation: MutationTree<NotificationsStateInterface> = {
  add(state, { type, message }: Partial<Notification>) {
    if (type && message) {
      notifyError(message, 'top-right');

      state.notifications.push({
        id: state.notificationIdCounter++,
        type,
        message,
      });
    }
  },
  remove(state, id: number) {
    state.notifications = state.notifications.filter(
      (notification) => notification.id !== id
    );
  },
  reset(state) {
    state.notifications = [];
    state.notificationIdCounter = 0;
  },
}

export default mutation;
