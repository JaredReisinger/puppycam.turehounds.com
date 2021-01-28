import "dotenv/config";
import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import url from "@rollup/plugin-url";
import svelte from "rollup-plugin-svelte";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import config from "sapper/config/rollup.js";
import pkg from "./package.json";

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

// // Expose environment variables by default?  Maybe only those with certain
// // prefixes?
// const passthroughEnvs = ["NODE_ENV", /^APP_/];

// const envReplacements = Object.fromEntries(
//   Object.entries(process.env)
//     .filter(([name]) => isMatch(name, passthroughEnvs))
//     .map(([name, value]) => [`process.env.${name}`, JSON.stringify(value)])
// );

const envReplacements = {
  "process.env.NODE_ENV": JSON.stringify(mode),
  "process.env.APP_GOOGLE_TRACKING_ID": JSON.stringify(
    process.env.APP_GOOGLE_TRACKING_ID
  ),
};

console.log("env replacements:", envReplacements);

const onwarn = (warning, onwarn) =>
  (warning.code === "MISSING_EXPORT" && /'preload'/.test(warning.message)) ||
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  warning.code === "THIS_IS_UNDEFINED" ||
  onwarn(warning);

export default {
  client: {
    input: config.client.input().replace(/\.js$/, ".ts"),
    output: config.client.output(),
    plugins: [
      replace({
        "process.browser": true,
        ...envReplacements,
      }),
      svelte({
        preprocess: sveltePreprocess(),
        compilerOptions: {
          dev,
          hydratable: true,
        },
      }),
      url({
        sourceDir: path.resolve(__dirname, "src/node_modules/images"),
        publicPath: "/client/",
      }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),
      json(),
      typescript({ sourceMap: dev }),

      legacy &&
        babel({
          extensions: [".js", ".mjs", ".html", ".svelte"],
          babelHelpers: "runtime",
          exclude: ["node_modules/@babel/**"],
          presets: [
            [
              "@babel/preset-env",
              {
                targets: "> 0.25%, not dead",
              },
            ],
          ],
          plugins: [
            "@babel/plugin-syntax-dynamic-import",
            [
              "@babel/plugin-transform-runtime",
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev &&
        terser({
          module: true,
        }),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: { server: config.server.input().server.replace(/\.js$/, ".ts") },
    output: config.server.output(),
    plugins: [
      replace({
        "process.browser": false,
        ...envReplacements,
      }),
      svelte({
        preprocess: sveltePreprocess(),
        compilerOptions: {
          dev,
          generate: "ssr",
          hydratable: true,
        },
        emitCss: false,
      }),
      url({
        sourceDir: path.resolve(__dirname, "src/node_modules/images"),
        publicPath: "/client/",
        emitFiles: false, // already emitted by client build
      }),
      resolve({
        dedupe: ["svelte"],
      }),
      commonjs(),
      json(),
      typescript({ sourceMap: dev }),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require("module").builtinModules
    ),

    preserveEntrySignatures: "strict",
    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input().replace(/\.js$/, ".ts"),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        "process.browser": true,
        ...envReplacements,
      }),
      commonjs(),
      json(),
      typescript({ sourceMap: dev }),

      !dev && terser(),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },
};

// function isMatch(candidate, allowList) {
//   return allowList.some((a) => {
//     if (a instanceof RegExp) {
//       return a.test(candidate);
//     }

//     switch (typeof a) {
//       case "string":
//         return a === candidate;

//       default:
//         throw new Error("expected string or RegExp in allowList");
//     }
//   });
// }
