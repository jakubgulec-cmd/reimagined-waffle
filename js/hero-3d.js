/**
 * hero-3d.js — Three.js GLB viewer for hero section
 * Proper 3D mouse tracking via nested pivot groups.
 * Outer group rotates around world Y (left/right).
 * Inner group rotates around local X (up/down).
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

(function () {
  'use strict';

  const container = document.getElementById('hero-3d');
  const canvas    = document.getElementById('stl-canvas');
  const loading   = document.getElementById('stl-loading');
  if (!container || !canvas) return;

  /* ── Renderer ── */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  /* ── Camera ── */
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 1000);
  camera.position.set(-0.2, 0, 9);

  /* ── Scene ── */
  const scene = new THREE.Scene();

  const ambient = new THREE.AmbientLight(0xd9e2f3, 0.7);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0x6aafff, 2.2);
  keyLight.position.set(-3, 4, 5);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xff8d3f, 0.6);
  fillLight.position.set(4, -1, 2);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.9);
  rimLight.position.set(0, -3, -4);
  scene.add(rimLight);

  /* ── Pivot groups for proper 3D rotation ──
     pivotY  — rotates left/right around world Y axis
       └─ pivotX — rotates up/down around local X axis
            └─ model (with base orientation baked in)
  */
  const pivotY = new THREE.Group();
  const pivotX = new THREE.Group();
  pivotY.add(pivotX);
  scene.add(pivotY);

  /* ── Load GLB ── */
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  loader.load(
    'assets/edge_placeholder.glb',
    function (gltf) {
      const model = gltf.scene;

      /* Centre the model */
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);

      /* Scale to fit */
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.0 / maxDim;
      model.scale.setScalar(scale);

      /* Enable shadows on all meshes */
      model.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      /* Base orientation — adjust if the model needs a different starting angle */
      model.rotation.x = Math.PI / 8;
      model.rotation.z = -Math.PI / 40;

      pivotX.add(model);
      loading.classList.add('hidden');
    },
    function (xhr) {
      if (xhr.total) {
        const pct = Math.round(xhr.loaded / xhr.total * 100);
        loading.textContent = 'Loading 3D model… ' + pct + '%';
      }
    },
    function (err) {
      loading.textContent = 'Model not found — place edge_placeholder.glb in assets/';
      console.error('GLB load error:', err);
    }
  );

  /* ── Mouse / touch tracking ── */
  let targetY = 0;   /* left/right → pivotY */
  let targetX = 0;   /* up/down    → pivotX */

  const RANGE_Y = 0.4;   /* radians, left-right sweep */
  const RANGE_X = 0.4;   /* radians, up-down sweep    */

  function onMove(clientX, clientY) {
    const nx = (clientX / window.innerWidth)  - 0.5;
    const ny = (clientY / window.innerHeight) - 0.5;
    targetY =  nx * RANGE_Y;
    targetX =  ny * RANGE_X;
  }

  window.addEventListener('mousemove', function (e) {
    onMove(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    onMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  /* ── Render loop ── */
  const LERP = 0.06;

  function animate() {
    requestAnimationFrame(animate);

    pivotY.rotation.y += (targetY - pivotY.rotation.y) * LERP;
    pivotX.rotation.x += (targetX - pivotX.rotation.x) * LERP;

    renderer.render(scene, camera);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  animate();

})();
