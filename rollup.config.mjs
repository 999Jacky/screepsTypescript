"use strict";

import clear from "rollup-plugin-clear";
import commonjs from "@rollup/plugin-commonjs";
import screeps from "rollup-plugin-screeps";
import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from '@rollup/plugin-node-resolve';

let cfg;
const dest = process.env.DEST;
if (!dest) {
  console.log("No destination specified - code will be compiled but not uploaded");
} else if ((cfg = require("./screeps.json")[dest]) == null) {
  throw new Error("Invalid upload destination");
}

export default {
  input: "src/main.ts",
  external: ['lodash','source-map'],
  output: {
    file: "dist/main.js",
    format: "cjs",
    sourcemap: true
  },

  plugins: [
    nodeResolve(),
    clear({targets: ["dist"]}),
    commonjs(),
    typescript({tsconfig: "./tsconfig.json"}),
    screeps({config: cfg, dryRun: cfg == null})
  ]
};
