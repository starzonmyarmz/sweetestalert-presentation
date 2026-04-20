import { defineConfig } from "vite"
import { resolve } from "node:path"

export default defineConfig({
  base: "/sweetestalert-presentation/",
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        presenter: resolve(import.meta.dirname, "presenter.html"),
      },
    },
  },
})
