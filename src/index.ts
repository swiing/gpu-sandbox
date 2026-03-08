import measurePerformance from "./utils/measurePerformance.ts";

import getMinMaxCpu from "./cpu/index.ts";
import getMinMaxGpu, { prepare } from "./webgl2/index.ts";

/**
 * compute the min and the max of an array of floats.
 */

// arbitrary size of the array, e.g. 100_000, and max value for floats, e.g. 1000
const length = 100_000;
const MAX = 1_000;

// Some arbitrary array of floats
const data = new Float32Array(
  // can be fixed values, e.g.
  // [0.3, 12.7, 0.2, 0.3, 0.3, 0.8]

  // or random, e.g.
  // (beware of size limit, as per https://github.com/openclaw/openclaw/issues/20789)
  Array.from({ length }, (_, i) => Math.random() * MAX),
);

/**
 * compute via gpu
 */
const { gl, program, fb, targetTexture, vao, bufferInfo } = prepare(data);
measurePerformance(function GPU() {
  return getMinMaxGpu(gl, { program, fb, targetTexture, vao, bufferInfo });
});

/**
 * compute via cpu
 */
measurePerformance(function CPU() {
  return getMinMaxCpu(data);
});
