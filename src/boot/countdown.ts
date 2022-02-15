import { boot } from 'quasar/wrappers';

import VueCountdown from '@chenfengyuan/vue-countdown';

export default boot(({ app }) => {
  app.component(VueCountdown.name, VueCountdown);
});
