// Forma de tinta do hero: icosaedro deformado por ruído senoidal.
// t: tempo | s: hover | p: pulso do clique | m: mouse (-1..1) | dis: dissolução no scroll
uniform float t, s, p, dis;
uniform vec2 m;
varying vec3 vN, vP, vO;
varying float vD;

float n(vec3 q) {
  return sin(q.x * 1.7 + t * .7) * sin(q.y * 2.1 + t * .9) * sin(q.z * 1.9 + t * .6)
       + .5 * sin(q.x * 4.3 - t) * sin(q.y * 3.7 + t * 1.2) * sin(q.z * 4.1 + t * .8)
       + .25 * sin(q.x * 8. + t * 1.5) * sin(q.y * 7. + t) * sin(q.z * 9. - t * .5);
}

void main() {
  vec3 q = position;
  float d = n(q * 1.2 + vec3(m * .6, 0.)) * (.2 + s * .25 + p * .5);
  d += smoothstep(.6, 1., dot(normalize(q), normalize(vec3(m, 1.)))) * s * .4;
  d += sin(length(q) * 10. - t * 8.) * p * .15;
  // turbulência extra enquanto a forma se desfaz
  d += dis * .3 * n(q * 3. + t);
  vD = d;
  vO = q;
  vN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(q + normal * d, 1.);
  vP = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
