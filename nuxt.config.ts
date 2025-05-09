import Aura from "@primevue/themes/aura";
import defaultTheme from "tailwindcss/defaultTheme";

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
      ]
    }
  },
  colorMode: {
    classSuffix: ""
  },
  compatibilityDate: "2024-04-03",
  components: [{ path: "~/components", pathPrefix: false }],
  devtools: { enabled: false },
  icon: {
    mode: "svg",
    serverBundle: "local"
  },
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
      ],
      theme: {
        extend: {
          fontFamily: {
            mono: ["Inter", ...defaultTheme.fontFamily.sans]
          }
        }
      }
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
