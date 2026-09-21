import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// });

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Any request starting with /api will be proxied
      "/api": {
        target: "https://restcountries.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
