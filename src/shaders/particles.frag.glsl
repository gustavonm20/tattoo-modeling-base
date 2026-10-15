varying float vA;

void main() {
  float d = length(gl_PointCoord - .5);
  if (d > .5) discard;
  gl_FragColor = vec4(mix(vec3(.92, .9, .86), vec3(.8, .1, .15), step(.85, vA)), (1. - d * 2.) * vA);
}
