import * as THREE from "three";

const VS = `
varying vec3 vWorldPos;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FS = `
uniform vec3 uHorizon;
uniform vec3 uMid;
uniform vec3 uZenith;
varying vec3 vWorldPos;
void main() {
  vec3 dir = normalize(vWorldPos);
  float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.45, h));
  col = mix(col, uZenith, smoothstep(0.35, 1.0, h));
  gl_FragColor = vec4(col, 1.0);
}
`;

export function createHarborSky(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(400_000, 32, 16);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uHorizon: { value: new THREE.Color(0xff9a7a) },
      uMid: { value: new THREE.Color(0xc8a8e8) },
      uZenith: { value: new THREE.Color(0x2a4a8a) },
    },
    vertexShader: VS,
    fragmentShader: FS,
  });
  return new THREE.Mesh(geo, mat);
}
