/**
 * NISU Harbor Reunion — streak celebration cinematic.
 * Golden-hour dock: penguins meet as pillar lanterns ignite over calm water.
 * Conceptually opposite of summit/mountain — intimate, couple-forward, horizontal.
 */

import * as THREE from "three";
import { createHarborSky } from "./sky";

const SCENE_DURATION_SEC = 11;

export type CelebrationKind = "streak" | "perfect";

const PILLAR_COLORS = [
  0x5eb8ff, // fitness — sky
  0xff7a6a, // fuel — coral
  0xff8ab8, // skill — pink
  0xffc85a, // reset — amber
] as const;

export interface HarborCinematicOptions {
  rootEl: HTMLElement;
  kind: CelebrationKind;
  pillarCount: number;
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

function makeDock(
  x: number,
  z: number,
  width: number,
  depth: number
): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  const plankMat = new THREE.MeshStandardMaterial({
    color: 0x8b6f52,
    roughness: 0.88,
  });
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.35, depth),
    plankMat
  );
  deck.position.y = 0.18;
  deck.castShadow = true;
  deck.receiveShadow = true;
  g.add(deck);

  for (let i = 0; i < 4; i++) {
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.14, 1.1, 8),
      plankMat
    );
    post.position.set(-width / 2 + 0.4 + i * (width / 3.5), 0.7, depth / 2 - 0.2);
    g.add(post);
  }
  return g;
}

export function bootstrapHarborCinematic(
  opts: HarborCinematicOptions
): () => void {
  const { rootEl, pillarCount, heroTextureUrl, partnerTextureUrl, onComplete } =
    opts;
  let disposed = false;
  let rafId = 0;

  const scene = new THREE.Scene();
  const clock = new THREE.Clock();

  const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    500_000
  );
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0xc8a8e8, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  rootEl.appendChild(renderer.domElement);

  scene.add(createHarborSky());

  const sun = new THREE.Mesh(
    new THREE.CircleGeometry(8, 40),
    new THREE.MeshBasicMaterial({
      color: 0xffe0a8,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    })
  );
  sun.position.set(0, 6, -120);
  scene.add(sun);

  const keyLight = new THREE.DirectionalLight(0xffc8a0, 1.2);
  keyLight.position.set(-8, 14, 10);
  keyLight.castShadow = true;
  scene.add(keyLight);
  scene.add(new THREE.HemisphereLight(0xa8c8ff, 0x4a3828, 0.45));
  scene.add(new THREE.AmbientLight(0xfff0e8, 0.35));

  const waterGeo = new THREE.PlaneGeometry(200, 200, 64, 64);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x4a8ab8,
    roughness: 0.15,
    metalness: 0.35,
    transparent: true,
    opacity: 0.92,
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0;
  scene.add(water);

  const harbor = new THREE.Group();
  scene.add(harbor);

  harbor.add(makeDock(-9, 1.5, 5, 3.5));
  harbor.add(makeDock(9, 1.5, 5, 3.5));

  const centerDock = makeDock(0, -0.5, 7, 4);
  harbor.add(centerDock);

  const lanternGroup = new THREE.Group();
  lanternGroup.position.set(0, 0, -0.8);
  harbor.add(lanternGroup);

  const lanterns: { mesh: THREE.Mesh; light: THREE.PointLight; lit: boolean }[] =
    [];
  const lanternAngles = [-1.1, -0.35, 0.35, 1.1];
  for (let i = 0; i < 4; i++) {
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 1.6, 6),
      new THREE.MeshStandardMaterial({ color: 0x6a5040, roughness: 0.9 })
    );
    pole.position.set(lanternAngles[i] * 2.2, 0.9, 0);
    lanternGroup.add(pole);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 12, 12),
      new THREE.MeshStandardMaterial({
        color: PILLAR_COLORS[i],
        emissive: PILLAR_COLORS[i],
        emissiveIntensity: 0,
        roughness: 0.4,
      })
    );
    glow.position.set(lanternAngles[i] * 2.2, 1.75, 0);
    lanternGroup.add(glow);

    const pl = new THREE.PointLight(PILLAR_COLORS[i], 0, 6);
    pl.position.copy(glow.position);
    lanternGroup.add(pl);

    lanterns.push({
      mesh: glow,
      light: pl,
      lit: i < pillarCount,
    });
  }

  const heroGroup = new THREE.Group();
  const partnerGroup = new THREE.Group();
  scene.add(heroGroup);
  scene.add(partnerGroup);

  void (async () => {
    try {
      const [heroTex, partnerTex] = await Promise.all([
        loadBillboard(heroTextureUrl),
        loadBillboard(partnerTextureUrl),
      ]);
      if (disposed) return;

      const makePenguin = (tex: THREE.Texture) => {
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        return new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), mat);
      };
      heroGroup.add(makePenguin(heroTex));
      partnerGroup.add(makePenguin(partnerTex));
    } catch (e) {
      console.warn("[HarborCinematic] textures failed", e);
    }
  })();

  const embers: THREE.Mesh[] = [];
  const emberMat = new THREE.MeshBasicMaterial({
    color: 0xffd8c0,
    transparent: true,
    opacity: 0.7,
  });
  for (let i = 0; i < 24; i++) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), emberMat.clone());
    e.position.set(
      (Math.random() - 0.5) * 30,
      0.3 + Math.random() * 0.5,
      (Math.random() - 0.5) * 20
    );
    e.userData.phase = Math.random() * Math.PI * 2;
    scene.add(e);
    embers.push(e);
  }

  const meetPoint = new THREE.Vector3(0, 0.55, 0);
  const heroStart = new THREE.Vector3(-7.5, 0.55, 2.2);
  const partnerStart = new THREE.Vector3(7.5, 0.55, 2.2);

  const camPos = new THREE.Vector3();
  const camTarget = new THREE.Vector3();

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
    const focus = meetPoint.clone();
    focus.y += 0.4;

    const skimPos = new THREE.Vector3(-4, 0.35, 14);
    const dockPos = new THREE.Vector3(-2, 2.2, 8);
    const meetPos = new THREE.Vector3(0, 3.2, 6.5);
    const widePos = new THREE.Vector3(0, 5.5, 16);

    if (t < 2.2) {
      lerpV3(camPos, skimPos, dockPos, easeOutCubic(t / 2.2));
      camTarget.set(0, 1, 0);
    } else if (t < 5) {
      lerpV3(camPos, dockPos, meetPos, easeInOutCubic((t - 2.2) / 2.8));
      camTarget.copy(focus);
    } else if (t < 8.5) {
      const ang = (t - 5) * 0.35;
      camPos.set(Math.sin(ang) * 7, 3.5, 6 + Math.cos(ang) * 2);
      camTarget.copy(focus);
    } else if (t < 10.5) {
      const orbitEnd = new THREE.Vector3(
        Math.sin(3.5 * 0.35) * 7,
        3.5,
        6 + Math.cos(3.5 * 0.35) * 2
      );
      lerpV3(camPos, orbitEnd, widePos, easeInOutCubic((t - 8.5) / 2));
      camTarget.set(0, 1.2, 0);
    } else {
      camPos.copy(widePos);
      camTarget.set(0, 1.2, 0);
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

    sun.lookAt(camera.position);

    const heroT = easeOutCubic(Math.min(1, Math.max(0, (t - 1.5) / 3)));
    const partnerT = easeOutCubic(Math.min(1, Math.max(0, (t - 2.2) / 3)));
    heroGroup.position.lerpVectors(heroStart, meetPoint, heroT);
    partnerGroup.position.lerpVectors(partnerStart, meetPoint, partnerT);
    heroGroup.lookAt(meetPoint.x, meetPoint.y, meetPoint.z + 1);
    partnerGroup.lookAt(meetPoint.x, meetPoint.y, meetPoint.z + 1);
    for (const child of heroGroup.children) {
      (child as THREE.Mesh).lookAt(camera.position);
    }
    for (const child of partnerGroup.children) {
      (child as THREE.Mesh).lookAt(camera.position);
    }

    for (let i = 0; i < lanterns.length; i++) {
      const target = lanterns[i].lit ? 1 : 0;
      const delay = 2.8 + i * 0.35;
      const intensity = easeOutCubic(Math.min(1, Math.max(0, (t - delay) / 1.2))) * target;
      const mat = lanterns[i].mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = intensity * 1.8;
      lanterns[i].light.intensity = intensity * 2.2;
    }

    const posAttr = waterGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const wave =
        Math.sin(x * 0.25 + t * 0.9) * 0.06 +
        Math.cos(z * 0.2 + t * 0.7) * 0.05;
      posAttr.setY(i, wave);
    }
    posAttr.needsUpdate = true;
    waterGeo.computeVertexNormals();

    for (const e of embers) {
      const ph = e.userData.phase as number;
      e.position.y = 0.25 + Math.sin(t * 0.8 + ph) * 0.15;
      e.position.x += Math.sin(t * 0.3 + ph) * dt * 0.08;
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
      console.error("[HarborCinematic] onComplete threw", e);
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
    renderer.dispose();
    if (renderer.domElement.parentElement) {
      renderer.domElement.parentElement.removeChild(renderer.domElement);
    }
  };
}
