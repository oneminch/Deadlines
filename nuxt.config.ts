import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "en"
      },
      title: "Deadlines",
      meta: [
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        { name: "author", content: "Dawit (@oneminch)" },
        { name: "robots", content: "index, follow" }
      ],
      link: [
        {
          rel: "icon",
          href: "/favicon.ico"
        }
      ],
      script: [
        {
          src: "https://measure.minch.dev/minch-measure",
          async: true,
          "data-website-id": "29c33fb8-48e5-4081-9414-7a94aebcdde8"
        }
      ]
    }
  },
  colorMode: {
    classSuffix: ""
  },
  compatibilityDate: "2024-04-03",
  components: [{ path: "~/components", pathPrefix: false }],
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "@primevue/nuxt-module",
    "@nuxtjs/color-mode"
  ],
  ssr: false,
  tailwindcss: {
    config: {
      mode: "jit",
      darkMode: "class",
      content: [
        "./app.vue",
        "./components/**/*.vue",
        "./layouts/**/*.vue",
        "./pages/**/*.vue"
      ]
    }
  },
  telemetry: false,
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  }
});
