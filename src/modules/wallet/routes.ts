import { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/',
    redirect: '/portfolio',
    name: 'mod-2',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'portfolio',
        name: 'portfolio',
        component: () => import('./views/Portfolio.vue'),
        meta: {
          title: 'Portfolio'
        },
      },
      {
        path: 'validators',
        name: 'validators',
        component: () => import('./views/Validators.vue'),
        meta: {
          title: 'Validators'
        },
      },
      {
        path: 'validators/:address',
        name: 'validator',
        component: () => import('./views/Validator.vue'),
        meta: {
          title: 'Validator',
          back: true,
        },
      },
      {
        path: 'proposals',
        name: 'proposals',
        component: () => import('./views/Proposals.vue'),
        meta: {
          title: 'Proposals'
        },
      },
      {
        path: 'proposals/:id',
        name: 'proposal',
        component: () => import('./views/Proposal.vue'),
        meta: {
          title: 'Proposal',
          back: true,
        },
      }
    ]
  }
] as RouteRecordRaw[];
