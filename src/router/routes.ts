import { RouteRecordRaw } from 'vue-router';
import { routes as moduleRoutes } from 'src/modules';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/portfolio'
  },
  ...moduleRoutes,
];

export default routes;
