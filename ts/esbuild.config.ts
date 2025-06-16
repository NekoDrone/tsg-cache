import { build } from "esbuild";

await build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    platform: "node",
    target: "node18",
    format: "cjs",
    outfile: "dist/index.js",
    sourcemap: true,
    minify: true,
    external: ["@aws-sdk/*"],
    banner: {
        js: "// Lambda function built with esbuild",
    },
});
