import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const STONE_W = 2.72;
const STONE_D = 1.74;
const BODY_H = 0.46;
const POOL_X = -0.58;
const POOL_Z = 0;

/**
 * three r186 reads getShaderPrecisionFormat().precision with no null check.
 * Lost contexts (and some software GL) return null and throw
 * "Cannot read properties of null (reading 'precision')", which used to
 * swap the sculpted inkstone for the flat schematic card.
 */
function patchShaderPrecision(gl) {
  if (!gl || gl.__yqPrecisionPatched) return;
  const original = gl.getShaderPrecisionFormat.bind(gl);
  gl.getShaderPrecisionFormat = (shaderType, precisionType) => {
    let result = null;
    try {
      result = original(shaderType, precisionType);
    } catch {
      result = null;
    }
    if (result && Number.isFinite(result.precision)) return result;
    const high = precisionType === gl.HIGH_FLOAT || precisionType === gl.HIGH_INT;
    return {
      rangeMin: high ? 127 : 31,
      rangeMax: high ? 127 : 30,
      precision: high ? 23 : 10,
    };
  };
  gl.__yqPrecisionPatched = true;
}

function obtainWebGL2(canvas) {
  const base = {
    alpha: true,
    depth: true,
    stencil: false,
    premultipliedAlpha: false,
    failIfMajorPerformanceCaveat: false,
  };
  const attempts = [
    { ...base, antialias: true, powerPreference: 'default' },
    { ...base, antialias: false, powerPreference: 'low-power' },
  ];
  let gl = null;
  for (const attributes of attempts) {
    try {
      gl = canvas.getContext('webgl2', attributes);
    } catch {
      gl = null;
    }
    if (gl) break;
  }
  if (!gl || gl.isContextLost?.()) return null;
  patchShaderPrecision(gl);
  return gl;
}

function roundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.absarc(x + width - r, y + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(x + width, y + height - r);
  shape.absarc(x + width - r, y + height - r, r, 0, Math.PI / 2, false);
  shape.lineTo(x + r, y + height);
  shape.absarc(x + r, y + height - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + r);
  shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return shape;
}

function makeGinkgoShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.04, 0.16, 0.05, 0.3, 0.01, 0.4);
  shape.bezierCurveTo(-0.2, 0.46, -0.46, 0.64, -0.4, 0.9);
  shape.bezierCurveTo(-0.34, 1.1, -0.14, 1.08, -0.02, 0.86);
  shape.bezierCurveTo(0.14, 1.08, 0.34, 1.1, 0.4, 0.9);
  shape.bezierCurveTo(0.46, 0.64, 0.2, 0.46, -0.01, 0.4);
  shape.bezierCurveTo(-0.05, 0.3, -0.04, 0.16, 0, 0);
  return shape;
}

function clampByte(value) {
  return Math.max(0, Math.min(255, value));
}

function makeStoneTextures(anisotropy) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#5a463c';
  ctx.fillRect(0, 0, size, size);
  const image = ctx.getImageData(0, 0, size, size);
  const { data } = image;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      const grain = (Math.random() - 0.5) * 34;
      const vein = Math.sin(x / 22 + y / 47) * 10 + Math.sin(y / 9) * 4;
      data[i] = clampByte(data[i] + grain + vein);
      data[i + 1] = clampByte(data[i + 1] + grain * 0.78 + vein * 0.35);
      data[i + 2] = clampByte(data[i + 2] + grain * 0.62);
    }
  }
  ctx.putImageData(image, 0, 0);
  for (let i = 0; i < 70; i += 1) {
    ctx.fillStyle = `rgba(214, 176, 110, ${0.05 + Math.random() * 0.16})`;
    ctx.beginPath();
    ctx.ellipse(
      Math.random() * size,
      Math.random() * size,
      1 + Math.random() * 3.2,
      0.5 + Math.random() * 1.2,
      Math.random() * Math.PI,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = anisotropy;
  map.wrapS = THREE.ClampToEdgeWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bumpCtx = bumpCanvas.getContext('2d');
  bumpCtx.filter = 'grayscale(1) contrast(1.35)';
  bumpCtx.drawImage(canvas, 0, 0);
  const bump = new THREE.CanvasTexture(bumpCanvas);
  bump.colorSpace = THREE.NoColorSpace;
  bump.anisotropy = anisotropy;
  return { map, bump };
}

function InkstonePhoto() {
  return (
    <div className="fallback" aria-hidden="true">
      <img src="/assets/inkstone-fallback.png" alt="" draggable="false" />
    </div>
  );
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
    const textures = new Set();
    let renderer;
    let timer;
    let resizeObserver;
    let envMap;

    const track = (object) => {
      if (object.geometry) geometries.add(object.geometry);
      const list = Array.isArray(object.material) ? object.material : [object.material];
      list.forEach((material) => {
        if (material) materials.add(material);
      });
      return object;
    };

    const pointer = { dragging: false, lastX: 0, x: 0, y: 0 };
    let targetRotY = -0.42;
    let targetRotX = 0.06;

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

    function onContextLost(event) {
      event.preventDefault();
      if (disposed) return;
      console.warn('WebGL 砚台场景上下文丢失，改用砚台照片。');
      disposed = true;
      cancelAnimationFrame(frame);
      setMode('fallback');
    }

    const cleanup = () => {
      disposed = true;
      cancelAnimationFrame(frame);
      timer?.disconnect();
      resizeObserver?.disconnect();
      wrap.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      wrap.removeEventListener('keydown', onKeyDown);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      envMap?.dispose();
      // Do not call forceContextLoss(). React StrictMode replays this effect
      // on the same canvas; a lost context makes the next WebGLRenderer throw
      // while reading shader precision, and the hero falls back to a flat card.
      renderer?.dispose();
    };

    let gl = null;
    try {
      gl = obtainWebGL2(canvas);
    } catch (error) {
      console.warn('WebGL 砚台场景未能启动，改用砚台照片。', error);
      setMode('fallback');
      return undefined;
    }
    if (!gl) {
      console.warn('WebGL2 不可用或上下文已丢失，改用砚台照片。');
      setMode('fallback');
      return undefined;
    }

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl,
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: 'default',
      });

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.setClearColor(0x000000, 0);
      canvas.addEventListener('webglcontextlost', onContextLost, false);

      try {
        const pmrem = new THREE.PMREMGenerator(renderer);
        envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envMap;
        pmrem.dispose();
      } catch {
        /* Reflections are optional. The stone still renders. */
      }

      scene.add(new THREE.AmbientLight(0xfff4e6, 0.38));
      scene.add(new THREE.HemisphereLight(0xffe2b8, 0x2a211c, 0.55));

      const key = new THREE.DirectionalLight(0xfff1d6, 2.8);
      key.position.set(4.8, 6.8, 2.6);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.bias = -0.0006;
      key.shadow.normalBias = 0.03;
      key.shadow.camera.near = 0.4;
      key.shadow.camera.far = 24;
      key.shadow.camera.left = -5;
      key.shadow.camera.right = 5;
      key.shadow.camera.top = 5;
      key.shadow.camera.bottom = -5;
      scene.add(key);

      const rim = new THREE.DirectionalLight(0xffb15a, 1.35);
      rim.position.set(-4.6, 3.1, -3.4);
      scene.add(rim);

      const fill = new THREE.DirectionalLight(0xc5d0dc, 0.45);
      fill.position.set(-1.2, 1.8, 5.2);
      scene.add(fill);

      const poolLight = new THREE.PointLight(0xffd7a0, 1.6, 4.2, 2);
      poolLight.position.set(POOL_X, 1.35, POOL_Z);
      scene.add(poolLight);

      const root = new THREE.Group();
      scene.add(root);
      const stone = new THREE.Group();
      root.add(stone);

      const anisotropy = renderer.capabilities.getMaxAnisotropy?.() || 4;
      const { map, bump } = makeStoneTextures(Math.min(anisotropy, 8));
      textures.add(map);
      textures.add(bump);

      const stoneMat = new THREE.MeshPhysicalMaterial({
        map,
        bumpMap: bump,
        bumpScale: 0.045,
        color: 0xffffff,
        roughness: 0.72,
        metalness: 0.04,
        clearcoat: 0.22,
        clearcoatRoughness: 0.46,
      });
      const poolMat = new THREE.MeshPhysicalMaterial({
        color: 0x100c0a,
        roughness: 0.08,
        metalness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        emissive: 0x4a2a16,
        emissiveIntensity: 0.22,
      });
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0x2c241f,
        roughness: 0.38,
        metalness: 0.12,
      });
      const inlayMat = new THREE.MeshStandardMaterial({
        color: 0xd7b56a,
        metalness: 0.82,
        roughness: 0.32,
        emissive: 0x8a6230,
        emissiveIntensity: 0.12,
      });
      materials.add(stoneMat);
      materials.add(poolMat);
      materials.add(rimMat);
      materials.add(inlayMat);

      const body = track(new THREE.Mesh(new RoundedBoxGeometry(STONE_W, BODY_H, STONE_D, 6, 0.09), stoneMat));
      body.position.y = BODY_H / 2;
      body.castShadow = true;
      body.receiveShadow = true;
      stone.add(body);

      const lipShape = roundedRectShape(STONE_W, STONE_D, 0.16);
      const poolHole = new THREE.Path();
      poolHole.absellipse(POOL_X, -POOL_Z, 0.52, 0.38, 0, Math.PI * 2, true, 0);
      lipShape.holes.push(poolHole);
      const lipGeo = new THREE.ExtrudeGeometry(lipShape, {
        depth: 0.12,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.028,
        bevelSegments: 3,
        curveSegments: 28,
      });
      lipGeo.rotateX(-Math.PI / 2);
      lipGeo.computeBoundingBox();
      geometries.add(lipGeo);
      const lip = new THREE.Mesh(lipGeo, stoneMat);
      lip.castShadow = true;
      lip.receiveShadow = true;
      lip.position.y = BODY_H - lipGeo.boundingBox.min.y;
      stone.add(lip);
      const lipTop = lip.position.y + lipGeo.boundingBox.max.y;

      const water = track(new THREE.Mesh(new THREE.SphereGeometry(0.5, 56, 28), poolMat));
      water.scale.set(0.96, 0.09, 0.7);
      water.position.set(POOL_X, BODY_H + 0.045, POOL_Z);
      stone.add(water);

      const rimMesh = track(new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.016, 10, 72), rimMat));
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.scale.set(1, 0.38 / 0.52, 1);
      rimMesh.position.set(POOL_X, lipTop - 0.02, POOL_Z);
      stone.add(rimMesh);

      const leafGeo = new THREE.ExtrudeGeometry(makeGinkgoShape(), {
        depth: 0.03,
        bevelEnabled: true,
        bevelThickness: 0.006,
        bevelSize: 0.006,
        bevelSegments: 1,
        curveSegments: 10,
      });
      leafGeo.rotateX(-Math.PI / 2);
      leafGeo.scale(0.62, 1, 0.62);
      geometries.add(leafGeo);
      const inlay = new THREE.Mesh(leafGeo, inlayMat);
      inlay.position.set(0.58, lipTop + 0.004, 0.02);
      inlay.castShadow = true;
      stone.add(inlay);

      const ribbonMat = new THREE.MeshStandardMaterial({
        color: 0xe2c27a,
        metalness: 0.72,
        roughness: 0.3,
        emissive: 0x8a6230,
        emissiveIntensity: 0.08,
        transparent: true,
        opacity: 0.82,
      });
      materials.add(ribbonMat);
      const ribbonPoints = [];
      const ribbonSteps = 100;
      for (let i = 0; i <= ribbonSteps; i += 1) {
        const t = i / ribbonSteps;
        const angle = t * Math.PI * 2 * 1.05 + 0.4;
        const y = (t - 0.5) * 1.55;
        const wobble = Math.sin(t * Math.PI * 2) * 0.1;
        ribbonPoints.push(new THREE.Vector3(Math.cos(angle) * (1.85 + wobble), y, Math.sin(angle) * (1.25 + wobble)));
      }
      const ribbon = track(
        new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ribbonPoints), 140, 0.018, 8, false), ribbonMat)
      );
      root.add(ribbon);

      const leafMat = new THREE.MeshStandardMaterial({
        color: 0xd7a64a,
        metalness: 0.28,
        roughness: 0.46,
        side: THREE.DoubleSide,
      });
      const leafMatRed = new THREE.MeshStandardMaterial({
        color: 0x8f4038,
        metalness: 0.12,
        roughness: 0.52,
        side: THREE.DoubleSide,
      });
      materials.add(leafMat);
      materials.add(leafMatRed);
      const flutterGeo = new THREE.ShapeGeometry(makeGinkgoShape());
      geometries.add(flutterGeo);
      const leaves = [];
      for (let i = 0; i < 10; i += 1) {
        const leaf = new THREE.Mesh(flutterGeo, i % 4 === 0 ? leafMatRed : leafMat);
        const angle = (i / 10) * Math.PI * 2;
        leaf.scale.setScalar(0.28 + (i % 3) * 0.06);
        leaf.userData = {
          angle,
          radius: 1.7 + (i % 3) * 0.16,
          speed: 0.12 + (i % 5) * 0.02,
          y0: 0.35 + (i % 4) * 0.22,
          spin: i,
        };
        root.add(leaf);
        leaves.push(leaf);
      }

      const dustCount = 48;
      const dustPositions = new Float32Array(dustCount * 3);
      for (let i = 0; i < dustCount; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 1.2 + Math.random() * 1.2;
        dustPositions[i * 3] = Math.cos(angle) * radius;
        dustPositions[i * 3 + 1] = Math.random() * 1.6;
        dustPositions[i * 3 + 2] = Math.sin(angle) * radius * 0.72;
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
      geometries.add(dustGeo);
      const dustMat = new THREE.PointsMaterial({
        color: 0xf3e2c0,
        size: 0.035,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      });
      materials.add(dustMat);
      const dust = new THREE.Points(dustGeo, dustMat);
      root.add(dust);

      const groundMat = new THREE.ShadowMaterial({ opacity: 0.38 });
      materials.add(groundMat);
      const ground = track(new THREE.Mesh(new THREE.CircleGeometry(2.6, 48), groundMat));
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.012;
      ground.receiveShadow = true;
      scene.add(ground);

      const look = new THREE.Vector3(0, 0.28, 0);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const frameCamera = () => {
        const width = wrap.clientWidth || 1;
        const height = wrap.clientHeight || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        const fov = (camera.fov * Math.PI) / 180;
        const distH = 2.15 / 2 / Math.tan(fov / 2);
        const distW = 3.5 / 2 / (Math.tan(fov / 2) * camera.aspect);
        const dist = Math.max(distH, distW) * 1.12;
        const dir = new THREE.Vector3(0.72, 0.7, 1.18).normalize();
        camera.position.copy(look).add(dir.multiplyScalar(dist));
        camera.lookAt(look);
      };

      frameCamera();
      resizeObserver = new ResizeObserver(frameCamera);
      resizeObserver.observe(wrap);
      wrap.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      wrap.addEventListener('keydown', onKeyDown);

      timer = new THREE.Timer();
      timer.connect(document);
      timer.update();

      const tick = (timestamp) => {
        if (disposed) return;
        timer.update(timestamp);
        const t = timer.getElapsed();
        if (!reduce && !pointer.dragging) targetRotY += 0.0024;
        root.rotation.y += (targetRotY - root.rotation.y) * 0.08;
        root.rotation.x += (targetRotX - root.rotation.x) * 0.08;
        root.position.y = Math.sin(t * 0.6) * 0.035;
        ribbon.rotation.y = t * 0.12;
        leaves.forEach((leaf) => {
          const angle = leaf.userData.angle + t * leaf.userData.speed;
          leaf.position.set(
            Math.cos(angle) * leaf.userData.radius,
            leaf.userData.y0 + Math.sin(t * 1.1 + leaf.userData.spin) * 0.08,
            Math.sin(angle) * leaf.userData.radius * 0.7
          );
          leaf.rotation.y = angle;
          leaf.rotation.z = Math.sin(t * 0.8 + leaf.userData.spin) * 0.35;
        });
        dust.rotation.y = t * 0.04;
        look.x = pointer.x * 0.06;
        look.y = 0.28 - pointer.y * 0.03;
        camera.lookAt(look);
        renderer.render(scene, camera);
        frame = requestAnimationFrame(tick);
      };

      renderer.render(scene, camera);
      if (!disposed) setMode('ready');
      tick();
    } catch (error) {
      console.warn('WebGL 砚台场景未能启动，改用砚台照片。', error);
      cleanup();
      setMode('fallback');
      return undefined;
    }

    return cleanup;
  }, []);

  const hint = mode === 'ready' ? '拖曳或使用方向键旋转' : mode === 'loading' ? '砚台展开中' : '';

  return (
    <div
      className={`stage is-${mode}`}
      ref={wrapRef}
      tabIndex={mode === 'ready' ? 0 : -1}
      aria-label={mode === 'fallback' ? '砚台照片' : '三维砚台，可拖曳旋转。石上有秋叶镶饰。'}
    >
      <canvas ref={canvasRef} />
      {mode === 'fallback' && <InkstonePhoto />}
      {hint ? <p className="stage-hint">{hint}</p> : null}
    </div>
  );
}
