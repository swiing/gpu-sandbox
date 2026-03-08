// This version of getMinMax runs on the CPU,
// and is here for comparison with the GPU version.

export default function getMinMax(
  data: Float32Array,
  begin = 0,
  end = data.length,
) {
  return {
    min: Math.min(...data.subarray(begin, end)),
    max: Math.max(...data.subarray(begin, end)),
  };
}
