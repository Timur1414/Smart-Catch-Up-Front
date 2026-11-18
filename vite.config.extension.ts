import { defineConfig, build } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function extensionBuildPlugin() {
    return {
        name: "extension-build-plugin",
        async closeBundle() {
            // 1. Build content script as an isolated IIFE bundle (Chrome MV3 requirement)
            await build({
                configFile: false,
                publicDir: false,
                build: {
                    outDir: path.resolve(__dirname, "dist-ext"),
                    emptyOutDir: false,
                    lib: {
                        entry: path.resolve(__dirname, "src/extension/content/index.ts"),
                        name: "VKSmartCatchUpContent",
                        formats: ["iife"],
                        fileName: () => "content.js",
                    },
                },
            });

            // 2. Flatten popup.html to root of dist-ext for clean manifest paths
            const nestedPopupPath = path.resolve(__dirname, "dist-ext/src/extension/popup/popup.html");
            const targetPopupPath = path.resolve(__dirname, "dist-ext/popup.html");

            if (fs.existsSync(nestedPopupPath)) {
                let html = fs.readFileSync(nestedPopupPath, "utf-8");
                html = html.replace(/\.\.\/\.\.\/\.\.\//g, "./");
                fs.writeFileSync(targetPopupPath, html, "utf-8");
                fs.rmSync(path.resolve(__dirname, "dist-ext/src"), { recursive: true, force: true });
            }
        },
    };
}

export default defineConfig({
    base: "./",
    publicDir: path.resolve(__dirname, "extension"),
    plugins: [
        extensionBuildPlugin(),
    ],
    build: {
        outDir: "dist-ext",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: path.resolve(__dirname, "src/extension/popup/popup.html"),
                background: path.resolve(__dirname, "src/extension/background/service_worker.ts"),
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name === "background") {
                        return "background.js";
                    }
                    return "assets/[name]-[hash].js";
                },
                chunkFileNames: "assets/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash].[ext]",
            },
        },
    },
});
