import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";

const port = process.env.PORT || 5003;

export default {
    input: ["src/ampli-panel-card.ts"],
    output: {
        dir: "./dist",
        format: "es",
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript(),
        json(),
        babel({
            exclude: "node_modules/**",
        }),
        terser(),
        serve({
            contentBase: "./dist",
            host: "0.0.0.0",
            port: port,
            allowCrossOrigin: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ],
};
