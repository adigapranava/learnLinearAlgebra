import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


export const initializeThreeScene = (canvas, frustumSize = 8) => {
  const scene = new THREE.Scene();

  // Calculate aspect ratio
  const aspect = window.innerWidth / window.innerHeight;

  // Orthographic camera
  const camera = new THREE.OrthographicCamera(
    -frustumSize * aspect / 2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.1,
    1000
  );
  camera.position.set(0, 0, window.innerWidth / 2);
  camera.lookAt(10, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Orbit Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  return { scene, camera, renderer, controls };
};
