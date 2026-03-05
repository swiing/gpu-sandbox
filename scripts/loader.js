import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";

/**
 * This is a customized node loader,
 * so that glsl files can be import by js/ts modules,
 * as follows:
 *
 * ```js
 * import shader from "./path/to/shader.glsl with { type: "glsl" }
 * ```
 *
 * The loader must be invoked when calling node, as follows:
 *
 * ```sh
 * $ node --import ./scripts/loader.js src/index.ts
 * ```
 */

function resolve(specifier, context, nextResolve) {
  const { importAttributes, parentURL } = context;

  if (importAttributes?.type === "glsl")
    return {
      format: "glsl",
      url: new URL(specifier, parentURL).href,
      shortCircuit: true,
    };

  return nextResolve(specifier);
}

function load(url, context, nextLoad) {
  const { format } = context;

  if (format === "glsl") {
    const source = readFileSync(new URL(url), "utf8");

    return {
      source: `export default \`${source}\``,
      format: "module",
      shortCircuit: true, // This is mandatory if nextLoad() is not called.
    };
  }

  return nextLoad(url, context);
}

registerHooks({ resolve, load });
