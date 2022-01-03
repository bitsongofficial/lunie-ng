import Store from 'src/store';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router';
import routes from './routes';

const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,

  // Leave this as is and make changes in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  history: createHistory(
    process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
  )
});

Router.beforeEach((to, _, next) => {
  const logged = Store.state.authentication.session !== undefined;
  const match = to.matched.find(el => el.name === 'login');

  console.log(to);

  if (!logged && !match) {
    if (to.fullPath !== '/') {
      return next({ name: 'authentication', query: { r: to.fullPath } });
    }

    return next({ name: 'authentication' });
  }

  const defaultRoute = { name: 'wallet' };

  if (logged && (match || to.path === '/')) {
    return next(defaultRoute);
  }

  return next();
});

Router.afterEach(to => {
  const title = Array.isArray(to.meta.title) ? to.meta.title.join(' - ') : to.meta.title as string;
  window.document.documentElement.scrollTop = 0;
  window.document.title = `${title}`;
});

export default Router;
