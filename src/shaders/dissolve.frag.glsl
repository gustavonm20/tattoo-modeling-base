varying float vA, vR;

void main() {
  float d = length(gl_PointCoord - .5);
  if (d > .5 || vA < .002) discard;
  vec3 c = mix(vec3(.8, .1, .15), vec3(.92, .9, .86), step(.6, vR));
  gl_FragColor = vec4(c, (1. - d * 2.) * vA);
}
