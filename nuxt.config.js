export default {
  privateRuntimeConfig: {
    apiKey: process.env.API_KEY,
    apiHost: process.env.API_HOST,
  },

  publicRuntimeConfig: {
    appName: process.env.APP_NAME,
    description: 'Book your favorite Anime here',
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'hyakunime',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'msapplication-TileColor', content: '#da532c' },
      { name: 'theme-color', content: '#ffffff' }
    ],
    link: [
      { rel: 'apple-touch-icon', size: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/x-icon', size: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/x-icon', size: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: 'site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
    ],
    script: [
      { src: 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js', type: 'module' },
      { src: 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js', type: 'nomodule' }
    ]
  },

  target: 'server',
  ssr: false,
  loadingIndicator: {
    name: 'cube-grid',
    color: '#fff',
    background: '#2E3938'
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/style/main.scss',
    '@/assets/style/_animation.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/axios.js' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://www.npmjs.com/package/cookie-universal-nuxt
    'cookie-universal-nuxt'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://github.com/supabase-community/nuxt-supabase
    ['nuxt-supabase', {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_CLIENT_KEY
    }]
  ],

  cookies: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 30,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    prefix: process.env.API_URL,
    https: true,
    proxy: true
  },

  env: {
    'SUPABASE_URL': process.env.SUPABASE_URL,
    'SUPABASE_CLIENT_KEY': process.env.SUPABASE_CLIENT_KEY,
    'API_KEY': process.env.API_KEY,
    'API_HOST': process.env.API_HOST
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  tailwindcss: {
    scssPath: '~/assets/style/_tailwind.scss',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    exposeLevel: 2,
    injectPosition: 'first',
    viewer: true,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // Router Configuration
  router: {
    // Add your repo name /<-repository-name->/
    base: '/',
    extendRoutes(routes, resolve) {
      routes.push(
        {
          name: 'anime-base',
          path: '/anime/page/',
          component: resolve(__dirname, 'pages/index.vue')
        },
        {
          name: 'anime-pages',
          path: '/anime/page/:page(\\d+)?',
          component: resolve(__dirname, 'pages/index.vue')
        },
        {
          name: 'Custom 404 Page',
          path: '*',
          component: resolve(__dirname, 'pages/page404.vue')
        }
      )
    }
  },
}
