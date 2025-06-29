import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

// Function to create axis lines with strips
export const createAxisLineWithStrips = (
  scene,
  start,
  end,
  color,
  unitLength = 1,
  stripLength = 0.1
) => {
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const material = new THREE.LineBasicMaterial({ color });
  const line = new THREE.Line(geometry, material);
  scene.add(line);

  const direction = new THREE.Vector3().subVectors(end, start).normalize();
  const length = start.distanceTo(end);

  const arbitraryVector = new THREE.Vector3(0, 0, 1);
  if (Math.abs(direction.z) > 0.99) {
    arbitraryVector.set(1, 0, 0);
  }

  const perpendicular = new THREE.Vector3()
    .crossVectors(direction, arbitraryVector)
    .normalize()
    .multiplyScalar(stripLength);

  for (let i = 0; i <= length; i += unitLength) {
    const pointOnAxis = start.clone().add(direction.clone().multiplyScalar(i));
    const stripGeometry = new THREE.BufferGeometry().setFromPoints([
      pointOnAxis.clone().add(perpendicular),
      pointOnAxis.clone().sub(perpendicular),
    ]);
    const stripMaterial = new THREE.LineBasicMaterial({ color });
    const stripLine = new THREE.Line(stripGeometry, stripMaterial);
    scene.add(stripLine);
  }

  return line;
};

// Function to create axis labels
export const createAxisLabel = (scene, unit, text, position) => {
  const loader = new FontLoader();
  loader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    (font) => {
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: 0.3 ,
        height: 0.05 ,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
      const mesh = new THREE.Mesh(textGeometry, textMaterial);
      mesh.position.set(position.x, position.y, position.z);
      scene.add(mesh);
    }
  );
};

// Function to create a grid mesh
export const createGridMesh = (scene, size, divisions, color) => {
  color = new THREE.Color(color);
  const gridHelper = new THREE.GridHelper(size, divisions, color, color);
  gridHelper.position.set(0, 0, 0);
  gridHelper.material.opacity = 0.3;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);
  return gridHelper;
};

// Function to create component lines
export const createComponentLines = (scene, unit, vector, color) => {
  const componentX = new THREE.Vector3(vector.x, 0, 0).multiplyScalar(1/unit);
  const componentY = new THREE.Vector3(0, vector.y, 0).multiplyScalar(1/unit);
  const componentZ = new THREE.Vector3(0, 0, vector.z).multiplyScalar(1/unit);

  const origin = new THREE.Vector3(0, 0, 0);
  const xLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([origin, componentX]),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 })
  );
  const yLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      componentX,
      componentX.clone().add(componentY),
    ]),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 })
  );
  const zLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      componentX.clone().add(componentY),
      vector.clone().multiplyScalar(1/unit),
    ]),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 })
  );

  scene.add(xLine, yLine, zLine);
  return [xLine, yLine, zLine];
};

// Function to create a vector arrow
export const createVectorArrow = (
  scene,
  unit,
  vector,
  color,
  showVectorAsLine = true,
  thickness = 0.05, 
  source = new THREE.Vector3(0, 0, 0) 
) => {
  const target = new THREE.Vector3(vector.x, vector.y, vector.z);
  const direction = target.clone().sub(source);
  const length = direction.length() / unit;

  if (showVectorAsLine) { 
    // Head: Create a cone for the arrowhead
    const headRadius = 0.05 * vector.length() / unit; 
    const headLength = 0.1 * vector.length() / unit;
    const shaftGeometry = new THREE.CylinderGeometry(thickness, thickness, length, 8);
    const shaftMaterial = new THREE.MeshBasicMaterial({ color });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);

    // Position the shaft along the vector
    shaft.position.set(source.x, source.y, source.z);
    shaft.geometry.translate(0, length / 2, 0);

    const target = new THREE.Vector3(vector.x, vector.y, vector.z);
    const direction = target.clone().sub(source); 
    const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());

    // Apply the rotation to orient the shaft correctly
    shaft.rotation.setFromQuaternion(rotation);

    // Head: Create a cone for the arrowhead
    const headGeometry = new THREE.ConeGeometry(headRadius, headLength, 8);
    const headMaterial = new THREE.MeshBasicMaterial({ color: '#333' });
    const head = new THREE.Mesh(headGeometry, headMaterial);

    // // Position the head at the end of the shaft
    head.geometry.translate(0, -headLength/2, 0);
    head.position.set(vector.x, vector.y, vector.z);
    head.rotation.setFromQuaternion(rotation);

    // Add both the shaft and the head to the scene
    scene.add(shaft);
    scene.add(head);
    return {shaft, head}; // Return the arrow group for further manipulations
  } else {
    // Create a point at the vector's position
    const pointGeometry = new THREE.SphereGeometry(0.1, 32, 32); // Small sphere as a point
    const pointMaterial = new THREE.MeshBasicMaterial({color });
    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    point.position.copy(vector); // Position the point at the vector's coordinates
    scene.add(point);
    return point; // Return the point for further manipulations
  }
};

