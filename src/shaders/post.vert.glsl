varying vec2 vU;

void main() {
  vU = uv;
  gl_Position = vec4(position.xy, 0., 1.);
}
