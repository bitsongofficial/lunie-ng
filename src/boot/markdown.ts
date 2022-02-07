/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { boot } from 'quasar/wrappers';

import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import enUS from '@kangc/v-md-editor/lib/lang/en-US';

// Prism
import Prism from 'prismjs';
// highlight code
import 'prismjs/components/prism-json';

export default boot(({ app }) => {
  // Set i18n instance on app
  VMdEditor.use(vuepressTheme, {
    Prism,
  });

  VMdEditor.lang.use('en-US', enUS);

  app.use(VMdEditor);
});
