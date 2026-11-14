// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode', '@pinia/nuxt'],
  colorMode: {
    // keep the .dark-mode / .light-mode classes used in assets/css
    classSuffix: '-mode'
  },
  css: ['~/assets/css/globals.css', '~/assets/css/theme.css'],
  runtimeConfig: {
    public: {
    }
  },
  routeRules: {
    '/': { redirect: '/portfolio' },
  },
  devtools: { enabled: true },
})

