#version 300 es

in float a_position;
out float color;

void main() {
  // whether we want to compute min (first pass) or max (second pass) value
  bool isMinPass = gl_InstanceID % 2 == 0;

  /* determine depth */

    // first, we want to make sure position is not too big
    // otherwise normalizeDepth would not be able to distinguish between "big" values.
    // In this context "big" seems to be reached for values bigger than a few hundreds - to be refined
    // (e.g. 990 would appear to be as close to camera as 999, which could result
    // in the max value being returned to be 990, which is obvisouly wrong).
    // Presumably, this is because depth is encoded on 24 bits, hence loosing
    // granularity for big values of position.
    // => make it small enough for big values
    float normalizePosition = isMinPass? a_position : a_position / 100.;

    // ensure depth value is between -1 and 1
    //
    // line below is ok but most likely sqrt is an expensive computation
    // float normalizeDepth = normalizePosition / sqrt(normalizePosition * normalizePosition + 1.);
    // so prefer this instead:
    float pSquare = normalizePosition * normalizePosition;
    float normalizeDepth = sign(a_position) * pSquare / (pSquare + 1.);

  // required for rendering points, otherwise they would not be visible
  gl_PointSize = 1.;

  // use the depth to put the min (respectively max) value in front
  // in first texel for the min (respectively second texel for the max)
  gl_Position = vec4(
    0,
    isMinPass
      ? vec2( 0,  normalizeDepth)
      : vec2( 1, -normalizeDepth),
    1
  );

  // pass the value (i.e. position) as is
  color = a_position;
}
