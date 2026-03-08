export function createTargetTexture(gl: WebGL2RenderingContext) {
  // we want to use floats in our buffer
  const ext = gl.getExtension("EXT_color_buffer_float");
  if (!ext) {
    throw "need EXT_color_buffer_float";
  }

  // create texture to render to
  // The texture is 1x2 in size, to hold the min and max values
  // (could equally be 2x1 in size)
  const targetTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, targetTexture);

  // define size and format of level 0
  gl.texImage2D(
    gl.TEXTURE_2D,
    0, // level,
    gl.R32F, // internalFormat,
    1, // targetTextureWidth,
    2, // targetTextureHeight,
    0, // border,
    gl.RED, // format,
    gl.FLOAT, // type,
    null, // data
  );

  // ok in principle, but not used in practice
  //
  // set the filtering so we don't need mips
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  return targetTexture;
}

export function createDepthTexture(gl: WebGL2RenderingContext) {
  gl.enable(gl.DEPTH_TEST);

  // create a depth texture
  const depthTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, depthTexture);

  // make a depth buffer with the same size as the targetTexture

  // define size and format of level 0
  gl.texImage2D(
    gl.TEXTURE_2D,
    0, // level,
    gl.DEPTH_COMPONENT24, // internalFormat,
    1, // targetTextureWidth,
    2, // targetTextureHeight,
    0, // border,
    gl.DEPTH_COMPONENT, // format,
    gl.UNSIGNED_INT, // type,
    null, // data
  );

  // ok in principle, but not used in practice
  //
  // set the filtering so we don't need mips
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  return depthTexture;
}
