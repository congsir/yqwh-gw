import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

function InkstoneFallback() {
  return (
    <div className="fallback" aria-hidden="true">
      <div className="fallback-orbit">
        <span />
        <span />
        <span />
      </div>
      <svg className="fallback-stone" viewBox="0 0 640 460">
        <defs>
          <linearGradient id="stoneFace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6a5348" />
            <stop offset="0.45" stopColor="#3d312b" />
            <stop offset="1" stopColor="#241c19" />
          </linearGradient>
          <linearGradient id="deckFace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7a6154" />
            <stop offset="1" stopColor="#4a3b33" />
          </linearGradient>
          <radialGradient id="poolFace" cx="50%" cy="40%" r="60%">
            <stop offset="0" stopColor="#6a4328" />
            <stop offset="0.45" stopColor="#1a120f" />
            <stop offset="1" stopColor="#0c0908" />
          </radialGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000" floodOpacity="0.45" />
          </filter>
        </defs>
        <ellipse cx="320" cy="360" rx="210" ry="28" fill="rgba(0,0,0,0.35)" />
        <g filter="url(#soft)">
          <rect x="120" y="150" width="400" height="176" rx="28" fill="url(#stoneFace)" />
          <rect x="128" y="158" width="384" height="160" rx="22" fill="none" stroke="#e7d3a1" strokeOpacity="0.35" />
          <rect x="300" y="176" width="186" height="124" rx="16" fill="url(#deckFace)" />
          <ellipse cx="230" cy="238" rx="72" ry="48" fill="url(#poolFace)" stroke="#e7c98a" strokeWidth="3" />
          <path
            d="M360 214c18 4 34 2 48-10-4 22-20 36-42 40-8-10-10-20-6-30z"
            fill="#e7c98a"
          />
        </g>
      </svg>
    </div>
  );
}

function makeGinkgoShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.18, 0.12, 0.26, 0.34);
  shape.quadraticCurveTo(0.08, 0.3, 0, 0.46);
  shape.quadraticCurveTo(-0.08, 0.3, -0.26, 0.34);
  shape.quadraticCurveTo(-0.18, 0.12, 0, 0);
  return shape;
}

function makeRibbon(radius, turns, tubular, color, ySpan) {
  const points = [];
  const steps = 120;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const angle = t * Math.PI * 2 * turns + 0.6;
    const y = (t - 0.5) * ySpan;
    const wobble = Math.sin(t * Math.PI * 2) * 0.16;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * (radius + wobble),
        y,
        Math.sin(angle) * (radius * 0.7 + wobble * 0.35)
      )
    );
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 180, tubular, 10, false);
  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.94,
    roughness: 0.16,
    emissive: color,
    emissiveIntensity: 0.55,
  });
  return new THREE.Mesh(geometry, material);
}

export default function HeroScene() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('loading');

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;

    let disposed = false;
    let frame = 0;
    const geometries = new Set();
    const materials = new Set();
    let renderer;
    let resizeObserver;

    const track = (object) => {
      if (object.geometry) geometries.add(object.geometry);
      const list = Array.isArray(object.material) ? object.material : [object.material];
      list.forEach((material) => {
        if (material) materials.add(material);
      });
      return object;
    };

    const dispose = () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      wrap.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      wrap.removeEventListener('keydown', onKeyDown);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss?.();
      }
    };

    const pointer = { dragging: false, lastX: 0, x: 0, y: 0 };
    let targetRotY = -0.55;
    let targetRotX = 0.12;

    function onPointerDown(event) {
      pointer.dragging = true;
      pointer.lastX = event.clientX;
      wrap.setPointerCapture?.(event.pointerId);
    }

    function onPointerMove(event) {
      const rect = wrap.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      if (!pointer.dragging) return;
      const dx = event.clientX - pointer.lastX;
      pointer.lastX = event.clientX;
      targetRotY += dx * 0.008;
    }

    function onPointerUp() {
      pointer.dragging = false;
    }

    function onKeyDown(event) {
      if (event.key === 'ArrowLeft') targetRotY -= 0.28;
      if (event.key === 'ArrowRight') targetRotY += 0.28;
    }

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: 'high-performance',
      });
      if (!renderer.getContext()) {
        dispose();
        setMode('fallback');
        return undefined;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.28;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setClearColor(0x000000, 0);

      try {
        const pmrem = new THREE.PMREMGenerator(renderer);
        const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = env;
        pmrem.dispose();
      } catch {
        /* Reflections are optional. The stone still renders. */
      }

      scene.add(new THREE.AmbientLight(0xfff6ea, 0.62));
      const hemi = new THREE.HemisphereLight(0xffe1b0, 0x2a211c, 0.7);
      scene.add(hemi);

      const key = new THREE.DirectionalLight(0xfff0d2, 3.6);
      key.position.set(4.5, 6.4, 3.4);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.near = 0.4;
      key.shadow.camera.far = 24;
      key.shadow.camera.left = -5;
      key.shadow.camera.right = 5;
      key.shadow.camera.top = 5;
      key.shadow.camera.bottom = -5;
      scene.add(key);

      const rim = new THREE.DirectionalLight(0xffb25a, 3.1);
      rim.position.set(-5.2, 2.6, -3.2);
      scene.add(rim);

      const cool = new THREE.DirectionalLight(0xb7c7d6, 0.7);
      cool.position.set(-1.5, 1.4, 5.4);
      scene.add(cool);

      const poolLight = new THREE.PointLight(0xffc56a, 12, 7, 2);
      poolLight.position.set(-0.7, 1.15, 0.1);
      scene.add(poolLight);

      const root = new THREE.Group();
      scene.add(root);

      const stoneMat = new THREE.MeshPhysicalMaterial({
        color: 0x5a463c,
        roughness: 0.36,
        metalness: 0.08,
        clearcoat: 0.72,
        clearcoatRoughness: 0.28,
        sheen: 0.6,
        sheenRoughness: 0.45,
        sheenColor: new THREE.Color(0xe7c98a),
      });
      const deckMat = new THREE.MeshPhysicalMaterial({
        color: 0x6b5348,
        roughness: 0.42,
        metalness: 0.05,
        clearcoat: 0.45,
        clearcoatRoughness: 0.36,
      });
      const poolMat = new THREE.MeshPhysicalMaterial({
        color: 0x140e0c,
        roughness: 0.05,
        metalness: 0.42,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        emissive: 0x7a4320,
        emissiveIntensity: 0.7,
      });
      const gold = new THREE.MeshStandardMaterial({
        color: 0xf3d48a,
        metalness: 1,
        roughness: 0.2,
        emissive: 0xc48a32,
        emissiveIntensity: 0.62,
      });
      materials.add(stoneMat);
      materials.add(deckMat);
      materials.add(poolMat);
      materials.add(gold);

      const base = track(
        new THREE.Mesh(new RoundedBoxGeometry(2.85, 0.32, 1.82, 5, 0.1), stoneMat)
      );
      base.castShadow = true;
      base.receiveShadow = true;
      root.add(base);

      const deck = track(
        new THREE.Mesh(new RoundedBoxGeometry(1.38, 0.1, 1.36, 4, 0.045), deckMat)
      );
      deck.position.set(0.52, 0.2, 0.02);
      deck.castShadow = true;
      root.add(deck);

      const pool = track(new THREE.Mesh(new THREE.SphereGeometry(0.46, 48, 32), poolMat));
      pool.scale.set(1.22, 0.32, 0.9);
      pool.position.set(-0.72, 0.14, 0.02);
      root.add(pool);

      const ring = track(new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.02, 14, 80), gold));
      ring.rotation.x = Math.PI / 2;
      ring.scale.set(1.16, 0.86, 1);
      ring.position.set(-0.72, 0.24, 0.02);
      root.add(ring);

      const seam = track(new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.016, 1.28), gold));
      seam.position.set(-0.02, 0.22, 0.02);
      root.add(seam);

      const leafGeo = new THREE.ShapeGeometry(makeGinkgoShape());
      geometries.add(leafGeo);
      const token = new THREE.Mesh(leafGeo, gold);
      token.scale.setScalar(1.15);
      token.rotation.x = -Math.PI / 2;
      token.position.set(0.78, 0.28, 0.08);
      root.add(token);

      const ribbonA = track(makeRibbon(1.72, 1.05, 0.038, 0xf2c96a, 2.15));
      const ribbonB = track(makeRibbon(1.98, 1.25, 0.018, 0xe08a48, 1.7));
      ribbonA.castShadow = true;
      root.add(ribbonA, ribbonB);

      const leafMat = new THREE.MeshStandardMaterial({
        color: 0xe2b45c,
        metalness: 0.4,
        roughness: 0.38,
        emissive: 0xc4842a,
        emissiveIntensity: 0.4,
        side: THREE.DoubleSide,
      });
      const leafMatRed = new THREE.MeshStandardMaterial({
        color: 0xa8483c,
        metalness: 0.18,
        roughness: 0.48,
        emissive: 0x6e2c28,
        emissiveIntensity: 0.28,
        side: THREE.DoubleSide,
      });
      materials.add(leafMat);
      materials.add(leafMatRed);

      const leaves = [];
      for (let i = 0; i < 16; i += 1) {
        const leaf = new THREE.Mesh(leafGeo, i % 4 === 0 ? leafMatRed : leafMat);
        const angle = (i / 16) * Math.PI * 2;
        const radius = 1.55 + (i % 4) * 0.16;
        leaf.scale.setScalar(0.85 + (i % 3) * 0.22);
        leaf.userData = {
          angle,
          radius,
          speed: 0.18 + (i % 5) * 0.035,
          y0: 0.15 + (i % 5) * 0.22,
          spin: i,
        };
        root.add(leaf);
        leaves.push(leaf);
      }

      const dustCount = 90;
      const dustPositions = new Float32Array(dustCount * 3);
      for (let i = 0; i < dustCount; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 1.15 + Math.random() * 1.45;
        dustPositions[i * 3] = Math.cos(angle) * radius;
        dustPositions[i * 3 + 1] = (Math.random() - 0.25) * 2.1;
        dustPositions[i * 3 + 2] = Math.sin(angle) * radius * 0.72;
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
      geometries.add(dustGeo);
      const dustMat = new THREE.PointsMaterial({
        color: 0xf6e0b0,
        size: 0.055,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      });
      materials.add(dustMat);
      const dust = new THREE.Points(dustGeo, dustMat);
      root.add(dust);

      const groundMat = new THREE.ShadowMaterial({ opacity: 0.42 });
      materials.add(groundMat);
      const ground = track(new THREE.Mesh(new THREE.CircleGeometry(2.3, 48), groundMat));
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.2;
      ground.receiveShadow = true;
      scene.add(ground);

      const look = new THREE.Vector3(0, 0.05, 0);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const frameCamera = () => {
        const width = wrap.clientWidth || 1;
        const height = wrap.clientHeight || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        const fov = (camera.fov * Math.PI) / 180;
        const targetWidth = 4.35;
        const targetHeight = 2.55;
        const distH = targetHeight / 2 / Math.tan(fov / 2);
        const distW = targetWidth / 2 / (Math.tan(fov / 2) * camera.aspect);
        const dist = Math.max(distH, distW) * 1.08;
        const dir = new THREE.Vector3(0.78, 0.58, 0.95).normalize();
        camera.position.copy(dir.multiplyScalar(dist));
        camera.lookAt(look);
      };

      frameCamera();
      resizeObserver = new ResizeObserver(frameCamera);
      resizeObserver.observe(wrap);
      wrap.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      wrap.addEventListener('keydown', onKeyDown);

      const clock = new THREE.Clock();
      const tick = () => {
        if (disposed) return;
        const t = clock.getElapsedTime();
        if (!reduce && !pointer.dragging) targetRotY += 0.003;
        root.rotation.y += (targetRotY - root.rotation.y) * 0.08;
        root.rotation.x += (targetRotX - root.rotation.x) * 0.08;
        root.position.y = Math.sin(t * 0.7) * 0.05;
        ribbonA.rotation.y = t * 0.15;
        ribbonB.rotation.y = -t * 0.1;
        leaves.forEach((leaf) => {
          const angle = leaf.userData.angle + t * leaf.userData.speed;
          leaf.position.set(
            Math.cos(angle) * leaf.userData.radius,
            leaf.userData.y0 + Math.sin(t * 1.3 + leaf.userData.spin) * 0.1,
            Math.sin(angle) * leaf.userData.radius * 0.72
          );
          leaf.rotation.y = angle;
          leaf.rotation.z = Math.sin(t + leaf.userData.spin) * 0.45;
        });
        dust.rotation.y = t * 0.05;
        look.x = pointer.x * 0.08;
        look.y = 0.05 - pointer.y * 0.04;
        camera.lookAt(look);
        renderer.render(scene, camera);
        frame = requestAnimationFrame(tick);
      };

      renderer.render(scene, camera);
      if (!disposed) setMode('ready');
      tick();
    } catch (error) {
      console.warn('WebGL 砚台场景未能启动，改用平面示意。', error);
      dispose();
      setMode('fallback');
      return undefined;
    }

    return dispose;
  }, []);

  const hint =
    mode === 'fallback' ? '平面砚台示意' : mode === 'ready' ? '拖曳或使用方向键旋转' : '砚台展开中';

  return (
    <div
      className={`stage is-${mode}`}
      ref={wrapRef}
      tabIndex={0}
      aria-label="三维砚台，可拖曳旋转。周围有秋金色丝带与落叶。"
    >
      <canvas ref={canvasRef} />
      {mode !== 'ready' && <InkstoneFallback />}
      <p className="stage-hint">{hint}</p>
    </div>
  );
}
