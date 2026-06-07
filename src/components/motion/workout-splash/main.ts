/**
 * Workout Victory Splash — ~4s mini-cinematic after finishing a workout.
 * Fitness penguin cannonballs into a pastel pool; ripples + spray, not a landscape epic.
 */

import * as THREE from "three";

const SPLASH_DURATION_SEC = 4;

export interface WorkoutSplashOptions {
  rootEl: HTMLElement;
  penguinTextureUrl: string;
  onComplete?: () => void;
}

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function bootstrapWorkoutSplash(opts: WorkoutSplashOptions): () => void {
  const { rootEl, penguinTextureUrl, onComplete } = opts;
  let disposed = false;
  let rafId = 0;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb8e8ff);
  const clock = new THREE.Clock();

  const camera = new THREE.PerspectiveCamera(
    50,
    rootEl.clientWidth / Math.max(rootEl.clientHeight, 1),
    0.1,
    100
  );
  camera.position.set(0, 2.5, 7);
  camera.lookAt(0, 0.5, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(rootEl.clientWidth, rootEl.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  rootEl.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x88c8ff, 1.1));
  scene.add(new THREE.AmbientLight(0xfff8f0, 0.4));

  const pool = new THREE.Mesh(
    new THREE.CylinderGeometry(3.2, 3.5, 0.4, 48),
    new THREE.MeshStandardMaterial({
      color: 0x5eb8ff,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    })
  );
  pool.position.y = -0.1;
  scene.add(pool);

  const deck = new THREE.Mesh(
    new THREE.RingGeometry(3.4, 4.2, 48),
    new THREE.MeshStandardMaterial({ color: 0xffd4c8, roughness: 0.85 })
  );
  deck.rotation.x = -Math.PI / 2;
  deck.position.y = 0.05;
  scene.add(deck);

  const penguinGroup = new THREE.Group();
  scene.add(penguinGroup);

  const ripples: { mesh: THREE.Mesh; born: number }[] = [];

  void new THREE.TextureLoader().load(penguinTextureUrl, (tex) => {
    if (disposed) return;
    tex.colorSpace = THREE.SRGBColorSpace;
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 1.4),
      new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide,
      })
    );
    penguinGroup.add(plane);
  });

  function spawnRipple(t: number) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.2, 0.35, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.12;
    scene.add(ring);
    ripples.push({ mesh: ring, born: t });
  }

  let splashFired = false;

  function tick() {
    if (disposed) return;
    rafId = requestAnimationFrame(tick);
    const t = clock.elapsedTime;

    if (t < 1.4) {
      const u = easeOutBack(Math.min(1, t / 1.4));
      penguinGroup.position.set(0, 4.5 - u * 4.2, 0);
      penguinGroup.rotation.z = Math.sin(t * 8) * 0.15 * (1 - u);
    } else if (!splashFired) {
      splashFired = true;
      spawnRipple(t);
      spawnRipple(t + 0.08);
      penguinGroup.position.y = 0.35;
      penguinGroup.rotation.z = 0;
    } else {
      penguinGroup.position.y = 0.35 + Math.sin(t * 3) * 0.04;
    }

    penguinGroup.lookAt(camera.position);

    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      const age = t - r.born;
      const scale = 1 + age * 2.8;
      r.mesh.scale.set(scale, scale, 1);
      (r.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(
        0,
        0.7 - age * 0.55
      );
      if (age > 1.4) {
        scene.remove(r.mesh);
        ripples.splice(i, 1);
      }
    }

    camera.position.x = Math.sin(t * 0.4) * 0.3;
    camera.lookAt(0, 0.5, 0);

    renderer.render(scene, camera);
  }
  rafId = requestAnimationFrame(tick);

  const timer = window.setTimeout(() => {
    if (disposed) return;
    onComplete?.();
  }, SPLASH_DURATION_SEC * 1000);

  const onResize = () => {
    const w = rootEl.clientWidth;
    const h = Math.max(rootEl.clientHeight, 1);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", onResize);

  return () => {
    disposed = true;
    cancelAnimationFrame(rafId);
    window.clearTimeout(timer);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
    if (renderer.domElement.parentElement) {
      renderer.domElement.parentElement.removeChild(renderer.domElement);
    }
  };
}
