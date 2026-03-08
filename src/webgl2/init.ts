import { createShader, createProgram } from "../utils/program.ts";

export default function init(
  gl: WebGL2RenderingContext,
  {
    vertexShaderSource,
    fragmentShaderSource,
    positions,
    size,
  }: {
    vertexShaderSource: string;
    fragmentShaderSource: string;
    positions: Float32Array;
    size: number;
  },
) {
  // create GLSL shaders, upload the GLSL source, compile the shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );
  if (!vertexShader || !fragmentShader) return null;

  // Link the two shaders into a program
  const program = createProgram(gl, vertexShader, fragmentShader);
  if (!program) throw Error("Failed to create program");

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer to host our data
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Create a vertex array object (attribute state)
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // Turn on the attribute
  // and tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    gl.FLOAT, // type = gl.FLOAT // the data is 32bit floats
    false, // normalize = false // don't normalize the data
    0, // stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
    0, // offset = 0 // start at the beginning of the buffer
  );

  const bufferInfo = { numElements: 0 };

  bufferInfo.numElements = positions.length / size;

  return { program, vao, bufferInfo };
}
