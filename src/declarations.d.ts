// https://github.com/microsoft/TypeScript/issues/40694#issuecomment-697121163
// https://github.com/microsoft/TypeScript/issues/9748#issuecomment-232822688

declare module '*.glsl' {
  const glsl: string
  export default glsl
}
