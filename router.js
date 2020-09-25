import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const page = (path) => () =>
  import(`~/pages/${path}`).then((m) => m.default || m)

const routes = [
  { path: '/', name: 'index', component: page('Index.vue') },
  { path: '/fr/', name: 'index___fr', component: page('Index.vue') },
  { path: '/en/', name: 'index___en', component: page('Index.vue') },
  {
    path: '/login/',
    name: 'login',
    component: page('auth/Login.vue'),
  },
  {
    path: '/login/fr/',
    name: 'login___fr',
    component: page('auth/Login.vue'),
  },
  {
    path: '/login/en/',
    name: 'login___en',
    component: page('auth/Login.vue'),
  },

  {
    path: '/verification/verify/:id',
    name: 'verify',
    component: page('auth/verification/Verify.vue'),
  },
  {
    path: '/verification/verify/:id/fr/',
    name: 'verify___fr',
    component: page('auth/verification/Verify.vue'),
  },
  {
    path: '/verification/verify/:id/en/',
    name: 'verify___en',
    component: page('auth/verification/Verify.vue'),
  },
  {
    path: '/password/reset/:token/',
    name: 'password.reset',
    component: page('auth/password/PasswordReset.vue'),
  },
  {
    path: '/password/reset/:token/fr',
    name: 'password.reset___fr',
    component: page('auth/password/PasswordReset.vue'),
  },
  {
    path: '/password/reset/:token/en',
    name: 'password.reset___en',
    component: page('auth/password/PasswordReset.vue'),
  },
  {
    path: '/upload',
    name: 'designs.upload',
    component: page('user/designs/Create.vue'),
  },
  {
    path: '/upload/fr/',
    name: 'designs.upload___fr',
    component: page('user/designs/Create.vue'),
  },
  {
    path: '/upload/en/',
    name: 'designs.upload___en',
    component: page('user/designs/Create.vue'),
  },
  {
    path: '/designs/:id/edit',
    name: 'designs.edit',
    component: page('user/designs/Edit.vue'),
  },
  {
    path: '/designs/:id/edit/fr/',
    name: 'designs.edit___fr',
    component: page('user/designs/Edit.vue'),
  },
  {
    path: '/designs/:id/edit/en/',
    name: 'designs.edit___en',
    component: page('user/designs/Edit.vue'),
  },
  {
    path: '/settings',
    component: page('user/settings/Index.vue'),
    children: [
      { path: '', redirect: { name: 'settings.dashboard' } },
      {
        path: 'dashboard',
        name: 'settings.dashboard',
        component: page('user/settings/Dashboard.vue'),
      },
      {
        path: 'profile',
        name: 'settings.profile',
        component: page('user/settings/Profile.vue'),
      },
      {
        path: 'profile/fr/',
        name: 'settings.profile___fr',
        component: page('user/settings/Profile.vue'),
      },
      {
        path: 'profile/en/',
        name: 'settings.profile___en',
        component: page('user/settings/Profile.vue'),
      },
      {
        path: 'designs',
        name: 'settings.designs',
        component: page('user/settings/Designs.vue'),
      },
      {
        path: 'designs/fr/',
        name: 'settings.designs___fr',
        component: page('user/settings/Designs.vue'),
      },
      {
        path: 'designs/en/',
        name: 'settings.designs___en',
        component: page('user/settings/Designs.vue'),
      },
    ],
  },
  {
    path: '/designs',
    name: 'designs.search',
    component: page('designs/Search.vue'),
  },
  {
    path: '/designs/fr/',
    name: 'designs.search___fr',
    component: page('designs/Search.vue'),
  },
  {
    path: '/designs/en/',
    name: 'designs.search___en',
    component: page('designs/Search.vue'),
  },
  {
    path: '/designs/:tag/tag',
    name: 'designs.tag',
    component: page('designs/Tag.vue'),
  },
  {
    path: '/designs/:tag/tag/fr/',
    name: 'designs.tag___fr',
    component: page('designs/Tag.vue'),
  },
  {
    path: '/designs/:tag/tag/en/',
    name: 'designs.tag___en',
    component: page('designs/Tag.vue'),
  },
  {
    path: '/designs/:id/user',
    name: 'designs.user',
    component: page('designs/User.vue'),
  },
  {
    path: '/designs/:id/user/fr/',
    name: 'designs.user___fr',
    component: page('designs/User.vue'),
  },
  {
    path: '/designs/:id/user/en/',
    name: 'designs.user___en',
    component: page('designs/User.vue'),
  },
  {
    path: '/design/:id',
    name: 'design.details',
    component: page('designs/Design.vue'),
  },
  {
    path: '/design/:id/fr/',
    name: 'design.details___fr',
    component: page('designs/Design.vue'),
  },
  {
    path: '/designs/:id/en/',
    name: 'design.details___en',
    component: page('designs/Design.vue'),
  },
  {
    path: '/users',
    name: 'users.search',
    component: page('user/UserIndex.vue'),
  },
  {
    path: '/users/fr/',
    name: 'users.search___fr',
    component: page('user/UserIndex.vue'),
  },
  {
    path: '/users/en/',
    name: 'users.search___en',
    component: page('user/UserIndex.vue'),
  },
  /* {
    path: '/design/:slug',
    name: 'designs.show',
    component: page('designs/Show.vue'),
  }, */
  /*  {
    path: '/upload',
    name: 'designs.upload',
    component: page('user/designs/CreatePage.vue'),
    meta: {
      showModal: true,
    },
  }, */
]

export function createRouter() {
  return new Router({
    routes,
    mode: 'history',
  })
}
