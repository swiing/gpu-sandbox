export default function measurePerformance(
  getMinMax: () => { min: number; max: number },
) {
  const T0 = performance.now();
  const { min, max } = getMinMax();
  const duration = performance.now() - T0;

  console.log(
    `${getMinMax.name}:`,
    { min, max },
    `computed in ${duration.toPrecision(5)} ms`,
  );

  return duration;
}
