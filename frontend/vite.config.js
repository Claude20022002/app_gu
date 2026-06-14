import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        host: true, // écoute sur toutes les interfaces (utile en conteneur)
        port: 5173,
        watch: { usePolling: true }, // détecte les changements de fichiers dans Docker
    },
});
