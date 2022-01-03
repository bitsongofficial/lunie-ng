import { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/authentication',
    redirect: '/authentication/login',
    name: 'authentication',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('./views/Login.vue'),
        meta: {
          title: 'Login'
        },
        children: [
          {
            path: '',
            name: 'login-home',
            component: () => import('./views/LoginHome.vue'),
            meta: {
              title: 'Login'
            }
          },
          {
            path: 'ledger',
            name: 'ledger',
            component: () => import('./views/Ledger.vue'),
            meta: {
              title: 'Ledger'
            }
          },
          {
            path: 'explore',
            name: 'explore',
            component: () => import('./views/Explore.vue'),
            meta: {
              title: 'Explore with any address'
            }
          },
        ]
      },
    ]
  }
] as RouteRecordRaw[];
