/**
 * NISU streak summit cinematic — inspired by HackKU26 MountainSuccess:
 * rise through cloud sea → reveal peak → orbit → wide pullback → fade.
 * Vanilla Three.js; penguins as billboards on the summit.
 */

import * as THREE from "three";
import { createSkydome } from "./skydome";

export type CelebrationKind = "streak" | "perfect";

const SCENE_DURATION_SEC = 12;

export interface StreakCinematicOptions {
  rootEl: HTMLElement;
  kind: CelebrationKind;
  heroTextureUrl: string;
  partnerTextureUrl: string;
  onComplete: () => void;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function createRadialAlphaTexture(size: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.55, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createVerticalAlphaTexture(h: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createMountain(): { group: THREE.Group; summitY: number } {
  const group = new THREE.Group();
  const points: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const y = t * 13.5;
    const r =
      (1 - Math.pow(t, 0.85)) * 7.2 +
      Math.sin(t * Math.PI * 2.4) * 0.25 * (1 - t);
    points.push(new THREE.Vector2(Math.max(0.15, r), y));
  }
  const geo = new THREE.LatheGeometry(points, 40);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x9a7b5c,
    roughness: 0.92,
    metalness: 0.02,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  const rockGeo = new THREE.DodecahedronGeometry(1.1, 0);
  for (let i = 0; i < 8; i++) {
    const rock = new THREE.Mesh(
      rockGeo,
      new THREE.MeshStandardMaterial({ color: 0x7a6350, roughness: 1 })
    );
    const ang = (i / 8) * Math.PI * 2;
    rock.position.set(Math.cos(ang) * 5.5, 1.2 + (i % 3) * 0.4, Math.sin(ang) * 5.5);
    rock.scale.setScalar(0.5 + (i % 3) * 0.15);
    rock.castShadow = true;
    group.add(rock);
  }

  group.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(group);
  return { group, summitY: box.max.y };
}

function spawnClouds(
  cloudGroup: THREE.Group,
  bobs: { mesh: THREE.Object3D; baseY: number; phase: number }[]
): void {
  const puffGeo = new THREE.SphereGeometry(1, 10, 8);
  const puffMat = new THREE.MeshStandardMaterial({
    color: 0xfff8ee,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 0.92,
  });

  const rng = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  };
  const rand = rng(0x4e15);

  const bands = [
    { count: 28, rMin: 16, rMax: 32, y: 3.6, jitter: 0.5, scale: [0.7, 1.2] as const },
    { count: 42, rMin: 30, rMax: 68, y: 4.4, jitter: 0.7, scale: [0.9, 1.5] as const },
    { count: 14, rMin: 9, rMax: 18, y: 2.1, jitter: 0.35, scale: [0.5, 0.95] as const },
  ];

  for (const band of bands) {
    for (let i = 0; i < band.count; i++) {
      const ang = (i / band.count) * Math.PI * 2 + rand() * 0.4;
      const radius = band.rMin + rand() * (band.rMax - band.rMin);
      const x = Math.cos(ang) * radius;
      const z = Math.sin(ang) * radius;
      const y = band.y + (rand() - 0.5) * band.jitter * 2;
      if (Math.hypot(x, z) < 10 && y < 12) continue;

      const cluster = new THREE.Group();
      const sc = band.scale[0] + rand() * (band.scale[1] - band.scale[0]);
      for (let p = 0; p < 4; p++) {
        const puff = new THREE.Mesh(puffGeo, puffMat.clone());
        puff.position.set(
          (rand() - 0.5) * 2.2,
          (rand() - 0.5) * 0.8,
          (rand() - 0.5) * 2.2
        );
        puff.scale.setScalar(0.85 + rand() * 0.55);
        cluster.add(puff);
      }
      cluster.position.set(x, y, z);
      cluster.scale.setScalar(sc);
      cluster.rotation.y = rand() * Math.PI * 2;
      cloudGroup.add(cluster);
      bobs.push({ mesh: cluster, baseY: y, phase: rand() * Math.PI * 2 });
    }
  }
}

function loadBillboard(url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        resolve(tex);
      },
      undefined,
      reject
    );
  });
}

export function bootstrapStreakCinematic(
  opts: StreakCinematicOptions
): () => void {
  const { rootEl, heroTextureUrl, partnerTextureUrl, onComplete } = opts;
  let disposed = false;
  let rafId = 0;

  const scene = new THREE.Scene();
  const clock = new THREE.Clock();

  const camera = new THREE.PerspectiveCamera(
    48,
    window.innerWidth / window.innerHeight,
    0.1,
    500_000
  );
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0xffd4c8, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  rootEl.appendChild(renderer.domElement);

  scene.add(createSkydome());

  const keyLight = new THREE.DirectionalLight(0xffd49a, 1.5);
  keyLight.position.set(-12, 22, -18);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x9ed4ff, 0.45);
  fillLight.position.set(16, 8, 20);
  scene.add(fillLight);
  scene.add(new THREE.HemisphereLight(0xa3c8ff, 0x5a4a3a, 0.5));
  scene.add(new THREE.AmbientLight(0xfff4ea, 0.35));

  const { group: mountainGroup, summitY } = createMountain();
  scene.add(mountainGroup);
  const summitPoint = new THREE.Vector3(0, summitY, 0);

  const fogTex = createRadialAlphaTexture(256);
  const fogWash = new THREE.Mesh(
    new THREE.PlaneGeometry(180, 180),
    new THREE.MeshBasicMaterial({
      color: 0xfff4e0,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      alphaMap: fogTex,
      side: THREE.DoubleSide,
    })
  );
  fogWash.rotation.x = -Math.PI / 2;
  fogWash.position.y = 2.1;
  scene.add(fogWash);

  const cloudGroup = new THREE.Group();
  scene.add(cloudGroup);
  const cloudBobs: { mesh: THREE.Object3D; baseY: number; phase: number }[] =
    [];
  spawnClouds(cloudGroup, cloudBobs);

  const sunGroup = new THREE.Group();
  sunGroup.position.set(-9, 4, -52);
  scene.add(sunGroup);

  const sunDisc = new THREE.Mesh(
    new THREE.CircleGeometry(12, 48),
    new THREE.MeshBasicMaterial({
      color: 0xffe8a8,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    })
  );
  sunGroup.add(sunDisc);

  const raysAlpha = createVerticalAlphaTexture(64);
  const raysMesh = new THREE.Mesh(
    new THREE.ConeGeometry(16, 38, 24, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xffe6b0,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      alphaMap: raysAlpha,
      opacity: 0.75,
    })
  );
  raysMesh.position.y = -19;
  sunGroup.add(raysMesh);

  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  void (async () => {
    try {
      const [heroTex, partnerTex] = await Promise.all([
        loadBillboard(heroTextureUrl),
        loadBillboard(partnerTextureUrl),
      ]);
      if (disposed) return;

      const makePenguin = (tex: THREE.Texture, x: number) => {
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4), mat);
        plane.position.set(x, 0.7, 0);
        plane.renderOrder = 10;
        return plane;
      };

      heroGroup.add(makePenguin(heroTex, -0.55));
      heroGroup.add(makePenguin(partnerTex, 0.55));
    } catch (e) {
      console.warn("[StreakCinematic] penguin textures failed", e);
    }
  })();

  const ORBIT_RADIUS = 20;
  const ORBIT_OMEGA = 0.065;
  const ORBIT_BASE = 0.2 * Math.PI;
  const camPos = new THREE.Vector3();
  const camTarget = new THREE.Vector3();
  const heroFocus = new THREE.Vector3();

  function lerpV3(
    out: THREE.Vector3,
    a: THREE.Vector3,
    b: THREE.Vector3,
    k: number
  ) {
    out.set(
      a.x + (b.x - a.x) * k,
      a.y + (b.y - a.y) * k,
      a.z + (b.z - a.z) * k
    );
  }

  function evalCamera(t: number): void {
    const sy = summitPoint.y;
    heroFocus.set(
      heroGroup.position.x,
      heroGroup.position.y + 0.5,
      heroGroup.position.z
    );

    const closePos = new THREE.Vector3(2.2, sy + 0.6, 5.8);
    const witnessPos = new THREE.Vector3(5.5, sy + 1.6, 10.5);
    const revealPos = new THREE.Vector3(11.5, sy + 4.2, 20);
    const finalPos = new THREE.Vector3(0, sy + 6.8, 28);

    if (t < 2.5) {
      lerpV3(camPos, closePos, witnessPos, easeOutCubic(t / 2.5));
      camTarget.copy(heroFocus);
    } else if (t < 5.5) {
      lerpV3(
        camPos,
        witnessPos,
        revealPos,
        easeInOutCubic((t - 2.5) / 3)
      );
      camTarget.copy(heroFocus);
    } else if (t < 9) {
      const ang = ORBIT_BASE + (t - 5.5) * ORBIT_OMEGA;
      const yLift = easeInOutCubic(Math.min(1, (t - 5.5) / 3.5));
      camPos.set(
        Math.cos(ang) * ORBIT_RADIUS,
        sy + 3.4 - yLift * 1.1,
        Math.sin(ang) * ORBIT_RADIUS
      );
      camTarget.copy(heroFocus);
    } else if (t < 10.5) {
      const orbitEndAngle = ORBIT_BASE + (9 - 5.5) * ORBIT_OMEGA;
      const orbitEnd = new THREE.Vector3(
        Math.cos(orbitEndAngle) * ORBIT_RADIUS,
        sy + 2.3,
        Math.sin(orbitEndAngle) * ORBIT_RADIUS
      );
      lerpV3(camPos, orbitEnd, finalPos, easeInOutCubic((t - 9) / 1.5));
      camTarget.copy(heroFocus);
    } else {
      camPos.copy(finalPos);
      camTarget.copy(heroFocus);
    }

    camera.position.copy(camPos);
    camera.lookAt(camTarget);
  }

  function tick() {
    if (disposed) return;
    rafId = requestAnimationFrame(tick);
    const dt = clock.getDelta();
    const t = clock.elapsedTime;

    evalCamera(t);

    sunGroup.position.y = THREE.MathUtils.lerp(4, 17, easeOutCubic(Math.min(1, t / 6)));
    raysMesh.rotation.y += dt * 0.2;
    sunDisc.lookAt(camera.position);

    cloudGroup.rotation.y += dt * 0.011;
    for (const b of cloudBobs) {
      b.mesh.position.y = b.baseY + Math.sin(t * 0.55 + b.phase) * 0.05;
    }

    heroGroup.position.set(summitPoint.x, summitPoint.y + 0.02, summitPoint.z);
    heroGroup.lookAt(sunGroup.position.x, summitPoint.y + 0.6, sunGroup.position.z);
    for (const child of heroGroup.children) {
      (child as THREE.Mesh).lookAt(camera.position);
    }

    renderer.render(scene, camera);
  }
  rafId = requestAnimationFrame(tick);

  let completionFired = false;
  const completionTimer = window.setTimeout(() => {
    if (disposed || completionFired) return;
    completionFired = true;
    try {
      onComplete();
    } catch (e) {
      console.error("[StreakCinematic] onComplete threw", e);
    }
  }, SCENE_DURATION_SEC * 1000);

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  return () => {
    disposed = true;
    cancelAnimationFrame(rafId);
    window.clearTimeout(completionTimer);
    window.removeEventListener("resize", onResize);
    fogTex.dispose();
    raysAlpha.dispose();
    renderer.dispose();
    if (renderer.domElement.parentElement) {
      renderer.domElement.parentElement.removeChild(renderer.domElement);
    }
  };
}
