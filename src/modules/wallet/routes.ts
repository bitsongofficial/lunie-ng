import { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/',
    redirect: '/portfolio',
    name: 'wallet',
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
          parent: '/validators',
          back: true,
        },
        props: true
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
          parent: '/proposals',
          back: true,
        },
        props: true
      }
    ]
  }
] as RouteRecordRaw[];
