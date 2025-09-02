import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@nuxt/icon", "@nuxtjs/color-mode", "shadcn-nuxt"],
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
  components: [{ path: "~/components", pathPrefix: false }],
  css: ["~/assets/css/main.css"],
  devtools: { enabled: false },
  future: {
    compatibilityVersion: 4
  },
  icon: {
    mode: "svg",
    provider: "none",
    clientBundle: {
      scan: true
    }
  },
  ssr: false,
  telemetry: false,
  vite: {
    plugins: [tailwindcss()]
  }
});