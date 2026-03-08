export default function render(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  fb: WebGLFramebuffer,
  targetTexture: WebGLTexture,
  vao: WebGLVertexArrayObject,
  bufferInfo: { numElements: number },
) {
  gl.useProgram(program);
  {
    // render to our targetTexture by binding the framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    gl.bindTexture(gl.TEXTURE_2D, targetTexture);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(
      0,
      0,
      1, // targetTextureWidth,
      2, // targetTextureHeight,
    );

    // Clear the canvas AND the depth buffer.
    // gl.clearColor(0, 0, 0, 1)
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    const offset = 0;
    gl.drawArraysInstanced(
      gl.POINTS, // primitiveType,
      offset,
      bufferInfo.numElements - offset, // count,
      2, // go through eah value twice, once for determining min, once for max
    );
  }
}
