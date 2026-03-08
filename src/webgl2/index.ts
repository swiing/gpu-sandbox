import createGL from "gl";

import { createDepthTexture, createTargetTexture } from "./createTexture.ts";
import init from "./init.ts";
import render from "./render.ts";

import vertexShaderSource from "./passthrough.vert" with { type: "glsl" };
import fragmentShaderSource from "./passthrough.frag" with { type: "glsl" };

export function prepare(data: Float32Array) {
  const gl = createGL(1, 1, {
    createWebGL2Context: true,
  });

  // Create and bind a framebuffer
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

  // create and attach a texture as the first color attachment to the framebuffer
  const targetTexture = createTargetTexture(gl);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0, // attachmentPoint,
    gl.TEXTURE_2D,
    targetTexture,
    0, // level
  );

  // create and attach a depth texture to the framebuffer
  const depthTexture = createDepthTexture(gl);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.TEXTURE_2D,
    depthTexture,
    0, //level
  );

  // because, according to specification,  there is no guarantee
  // that the combination of framebuffer attachments we have is supported,
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    throw "Combination of framebuffer attachments is not supported.";
  }

  //
  const { program, vao, bufferInfo } = init(gl, {
    vertexShaderSource,
    fragmentShaderSource,
    positions: data,
    size: 1, // components per iteration
  })!;

  // we are now all set to make the actual calculation of min/max for our set of floats
  // this can be done by calling getMinMax() with the gl context and the objects we just created.

  return {
    gl,
    program,
    fb,
    targetTexture,
    vao,
    bufferInfo,
  };
}

export default function getMinMax(
  gl: WebGL2RenderingContext,
  {
    program,
    fb,
    targetTexture,
    vao,
    bufferInfo,
  }: {
    program: WebGLProgram;
    fb: WebGLFramebuffer;
    targetTexture: WebGLTexture;
    vao: WebGLVertexArrayObject;
    bufferInfo: { numElements: number };
  },
  begin = 0,
  end = bufferInfo.numElements - begin,
) {
  // compute the min and the max in gpu
  render(gl, program, fb, targetTexture, vao, bufferInfo, begin, end);

  // read the result from gpu
  const result = new Float32Array(
    2, // targetTextureWidth * targetTextureHeight
  );

  // read back the result from the GPU
  gl.readPixels(
    0, // x
    0, // y
    1, // targetTextureWidth,
    2, // targetTextureHeight,
    gl.RED, // gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_FORMAT)
    gl.FLOAT, // gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_TYPE)
    result,
  );
  const [min, max] = result;

  return { min, max };
}
