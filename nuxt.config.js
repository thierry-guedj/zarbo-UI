import colors from 'vuetify/es5/util/colors'
require('dotenv').config()
export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    /*
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
     */
    titleTemplate: 'Zarbo',
    title: 'Zarbo',
    script: [
      {
        src: 'https://unpkg.com/masonry-layout@4.2.2/dist/masonry.pkgd.min.js',
      },
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,400;0,500;0,600;1,100&display=swap',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@500;600&display=swap',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;600&display=swap',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900',
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~plugins/vform',
    '~plugins/vuelidate',
    '~plugins/filters.js',
    { src: '~plugins/infiniteloading', mode: 'client' },
    '~plugins/components.js',
    '~/plugins/vue-masonry-css.js',
    { src: '~/plugins/vue-masonry', ssr: false },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  // components: true,

  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify', '@nuxtjs/router'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'vue-social-sharing/nuxt',
    'nuxt-i18n',
    'nuxt-moment',
  ],
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en-US.js',
      },
      {
        code: 'fr',
        name: 'Français',
        file: 'fr-FR.js',
      },
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'fr',
  },
  auth: {
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'access_token',
          maxAge: 1800,
          // type: 'Bearer'
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30,
        },

        endpoints: {
          login: { url: '/login', method: 'post', propertyName: 'token' },
          logout: { url: '/logout', method: 'post' },
          user: { url: '/me', method: 'get', propertyName: 'data' },
          refresh: { url: '/refresh', method: 'post', propertyName: 'token' },
        },

        /* tokenRequired: true,
        tokenType: 'bearer',
        globalToken: true,
        autoFetchUser: true, */
      },
    },
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: { baseUrl: process.env.API_URL },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    defaultAssets: false,

    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    extend(config, { isClient, isDev, loaders: { vue } }) {
      vue.transformAssetUrls.LazyImage = ['src']
    },
    // SDU: This will be fixed in future versions of nuxt https://github.com/nuxt/nuxt.js/issues/7703
    filenames: {
      chunk: ({ isDev }) => (isDev ? 'c[name].js' : 'c[id].[contenthash].js'),
    },
  },
}
