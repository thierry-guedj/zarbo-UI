import colors from 'vuetify/es5/util/colors'
require('dotenv').config()
export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  // mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',

  // custom loading
  loading: '~/components/Loading.vue',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    /*
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
     */
    // titleTemplate: 'Zarbo',
    title: 'Zarbo, galerie privée en ligne',
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
        hid: 'canonical',
        rel: 'canonical',
        href: 'https://zarbo.fr',
      },
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
          'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300&display=swap',
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
    '~plugins/vue-masonry-css.js',
    { src: '~/plugins/vue-tags-input', ssr: false },
    '~/plugins/vue-lazysizes.client.js',
    { src: '~/plugins/vue-lazyload', ssr: false },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */

  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    '@nuxtjs/router',
    '@aceforth/nuxt-optimized-images',
    // '@nuxtjs/moment',
  ],
  optimizedImages: {
    optimizeImages: true,
  },
  moment: {
    timezone: true,
    locales: ['fr'],
  },
  /* moment: {
    defaultLocale: 'fr',
    locales: ['en'],
  }, */
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'vue-social-sharing/nuxt',
    'nuxt-i18n',
    // 'nuxt-lazy-load',
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
    /* detectBrowserLanguage: {
      useCookie: false,
      cookieKey: 'i18n_redirected',
      onlyOnRoot: true,
    }, */
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
        globalToken: true, */
        autoFetchUser: true,
      },
    },
  },
  /*
   **  Axios module configuration
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
          primary: '#1f7c8e',
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
      if (isClient) {
        vue.transformAssetUrls.img = ['data-src', 'src']
        vue.transformAssetUrls.source = ['data-srcset', 'srcset']
      }
    },
    // SDU: This will be fixed in future versions of nuxt https://github.com/nuxt/nuxt.js/issues/7703
    filenames: {
      chunk: ({ isDev }) => (isDev ? 'c[name].js' : 'c[id].[contenthash].js'),
    },
    // vendor: ['@johmun/vue-tags-input'],
  },
}
