import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            "/socket.io": {
                target: "https://manajemen-anak-kos-web-app-service-607494574887.asia-southeast1.run.app",
                ws: true,
            },
        },
    },
});
