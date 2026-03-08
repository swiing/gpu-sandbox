Computes in the GPU, the min and max values of a set of floats.

## Implementation details

We render to a texture of floats, of size 1x2,
i.e. hosting 2 values, one for the min, one for the max.

We go twice through each float value to compare (`drawArraysInstanced()` with 2 instances),
so as to render each value in both texels of the texture. This is done by passing
the value as is, as the "color" for the texel.

For the first texel, we set the depth such that a small value is in front;
while for the second texel, we set the value such that big value is in front.
In the end, the GPU will find for us which is the smallest (respectively biggest)
value, by making depth comparison.

### Note

The depth value is taken from the float value, and normalized to fit the [-1; 1] range.
In the process, precision can be lost for "high" values. This can result in wrong
result in the gpu computation. E.g. giving max of 999.9910278320312, while the correct
answer is 999.9928588867188.

Solution could be to divide the float values by a fixed factor when setting the depth.
A compromise needs to be found.
