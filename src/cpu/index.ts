// This version of getMinMax runs on the CPU,
// and is here for comparison with the GPU version.

export default function getMinMax(data: Float32Array) {
  return {
    min: Math.min(...data),
    max: Math.max(...data),
  };
}
