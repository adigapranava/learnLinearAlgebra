import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import MathDisplay from './components/MathDisplay';

const App = () => {
  const canvasRef = useRef(null);
  const [unit, setUnit] = useState(1);
  const [axisLength, setAxisLength] = useState(10);
  const [vector, setVector] = useState({ x: 1, y: 2, z: 1 });
  const [matrix, setMatrix] = useState({
    m11: 1, m12: 0, m13: 0,
    m21: 0, m22: 1, m23: 0,
    m31: 0, m32: 0, m33: 1,
  });
  const [transformedVector, setTransformedVector] = useState(vector);

  // state for input fields
  const [inputVector, setInputVector] = useState(`${vector.x},${vector.y},${vector.z}`);
  const vectorInputRef = useRef(null);
  const [inputMatrix, setInputMatrix] = useState(`${matrix.m11},${matrix.m12},${matrix.m13},${matrix.m21},${matrix.m22},${matrix.m23},${matrix.m31},${matrix.m32},${matrix.m33}`);
  const matrixInputRef = useRef(null);

  // state for notification
  const [notification, setNotification] = useState(null);
  
  // state for toggling grid and labels
  const [showGrid, setShowGrid] = useState(true); 
  const [showTransformedGrid, setShowTransformedGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true); 

  const showNotification = (message, type = 'danger') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000); // Hide after 5 seconds
  };

  const parseVectorInput = (input) => {
    const values = input.split(',').map((v) => parseFloat(v.trim()) || 0);
    return { x: values[0] || 0, y: values[1] || 0, z: values[2] || 0 };
  };

  const parseMatrixInput = (input) => {
    const values = input.split(',').map((v) => parseFloat(v.trim()) || 0);
    return {
      m11: values[0] || 0, m12: values[1] || 0, m13: values[2] || 0,
      m21: values[3] || 0, m22: values[4] || 0, m23: values[5] || 0,
      m31: values[6] || 0, m32: values[7] || 0, m33: values[8] || 0,
    };
  };

  const validateVector = (input) => {
    const values = input.split(',');
    if (values.length !== 3) {
      showNotification('Invalid vector input. Please enter 3 numerical values separated by commas.', 'danger');
      setTimeout(() => { 
        if (vectorInputRef.current) {
          vectorInputRef.current.focus();
        }
      }, 0);
      return false;
    }
    for (let i = 0; i < values.length; i++) {
      if (isNaN(values[i])) {
        showNotification('Invalid vector input. Please enter numerical values only.', 'danger');
        setTimeout(() => { 
          if (vectorInputRef.current) {
            vectorInputRef.current.focus();
          }
        }, 0);
        return false;
      }
    }
    return true;
  };

  const validateMatrix = (input) => {
    const values = input.split(',');
    if (values.length !== 9) {
      showNotification('Invalid matrix input. Please enter 9 values separated by commas.', 'danger');
      setTimeout(() => {
        if (matrixInputRef.current) {
          matrixInputRef.current.focus();
        }
      }, 0);
      return false;
    }
    for (let i = 0; i < values.length; i++) {
      if (isNaN(values[i])) {
        showNotification('Invalid matrix input. Please enter numerical values only.', 'danger');
        setTimeout(() => {
          if (matrixInputRef.current) {
            matrixInputRef.current.focus();
          }
        }, 0);
        return false;
      }
    }
    return true;
  };

const performTransformation = (e) => {
  if (validateVector(inputVector) && validateMatrix(inputMatrix)) {
    const parsedVector = parseVectorInput(inputVector);
    const parsedMatrix = parseMatrixInput(inputMatrix);

    // Use parsed inputs directly for transformation
    let vt = new THREE.Vector3(parsedVector.x, parsedVector.y, parsedVector.z);
    const transformationMatrix = new THREE.Matrix4().set(
      parsedMatrix.m11, parsedMatrix.m12, parsedMatrix.m13, 0,
      parsedMatrix.m21, parsedMatrix.m22, parsedMatrix.m23, 0,
      parsedMatrix.m31, parsedMatrix.m32, parsedMatrix.m33, 0,
      0, 0, 0, 1
    );

    const ut = vt.clone().applyMatrix4(transformationMatrix);

    // Update state after transformation
    setVector(parsedVector);
    setMatrix(parsedMatrix);
    setTransformedVector({ x: ut.x, y: ut.y, z: ut.z });

    showNotification('Transformation successful.', 'success');
  }
};


  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    camera.position.z = 10;

    // Function to create axis lines (thicker and extended in both directions)
    const createAxisLine = (start, end, color) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      const material = new THREE.LineBasicMaterial({ color, linewidth: 3 });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      return line;
    };

    // Function to create axis labels
    const createAxisLabel = (text, position) => {
      const loader = new FontLoader();
      loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        const textGeometry = new TextGeometry(text, {
          font: font,
          size: 0.3,
          height: 0.05,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
        const mesh = new THREE.Mesh(textGeometry, textMaterial);
        mesh.position.set(position.x, position.y, position.z);
        scene.add(mesh);
      });
    };

    // Function to create a grid mesh around the space
    const createGridMesh = (size, divisions, color) => {
      const gridHelper = new THREE.GridHelper(size, divisions, color, color);
      gridHelper.position.set(0, 0, 0);
      gridHelper.material.opacity = 0.3;
      gridHelper.material.transparent = true;
      scene.add(gridHelper);
      return gridHelper;
    };

    // Function to create a vector with an arrow
    const createVectorArrow = (vector, color) => {
      const dir = vector.clone().normalize(); 
      const length = vector.length(); 
      const shaftRadius = 0.5;
      const arrowHelper = new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), length, color, 0.3, 0.2);
      scene.add(arrowHelper);
      return arrowHelper;
    };

    // Create axes lines
    const axisLength = 10;
    const axisColor = 0xffff00;
    createAxisLine(new THREE.Vector3(-axisLength, 0, 0), new THREE.Vector3(axisLength, 0, 0), axisColor);
    createAxisLine(new THREE.Vector3(0, -axisLength, 0), new THREE.Vector3(0, axisLength, 0), axisColor);
    createAxisLine(new THREE.Vector3(0, 0, -axisLength), new THREE.Vector3(0, 0, axisLength), axisColor);

    // Create grids if enabled
    let gridX, gridY, gridZ;
    if (showGrid) {
      const gridSize = axisLength;
      const gridDivisions = 2 * axisLength;
      const gridColor = new THREE.Color(0x808080);

      gridX = createGridMesh(gridSize, gridDivisions, gridColor);
      gridX.rotation.x = Math.PI / 2; // Rotate for YZ grid
      gridY = createGridMesh(gridSize, gridDivisions, gridColor);
      gridY.rotation.z = Math.PI / 2; // Rotate for XZ grid
      gridZ = createGridMesh(gridSize, gridDivisions, gridColor);
      gridZ.rotation.y = Math.PI / 2; // Rotate for XY grid
    }

    // Initial vector and transformed vector
    const initialVectorT = new THREE.Vector3(vector.x, vector.y, vector.z);
    const initialVectorArrow = createVectorArrow(initialVectorT, 0x00ffff);

    const transformedVectorT = new THREE.Vector3(transformedVector.x, transformedVector.y, transformedVector.z);
    const transformedVectorArrow = createVectorArrow(transformedVectorT, 0xff0000);
    // Add labels if enabled
    if (showLabels) {
      createAxisLabel("X", new THREE.Vector3(axisLength + 0.5, 0, 0));
      createAxisLabel("Y", new THREE.Vector3(0, axisLength + 0.5, 0));
      createAxisLabel("Z", new THREE.Vector3(0, 0, axisLength + 0.5));
      createAxisLabel("v", initialVectorT.clone().multiplyScalar(0.5));
      createAxisLabel("u", transformedVectorT.clone().multiplyScalar(0.5));
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on component unmount
    return () => {
      if (showGrid) scene.remove(gridX, gridY, gridZ); // Remove grids
      scene.remove(initialVectorArrow, transformedVectorArrow);
      renderer.dispose();
    };
  }, [vector, matrix, showGrid, showLabels, transformedVector]); 
  
  

  return (
    <div className="d-flex">
       {/* Notification */}
       {notification && (
        <div
          className={`alert alert-${notification.type} position-fixed top-0 start-50 translate-middle-x mt-3`}
          style={{ zIndex: 1060 }} // Ensure it's on top
          role="alert"
        >
          {notification.message}
        </div>
      )}
      <div className="bg-light border-end vh-100 p-3 collapse show" id="sidebar" >
          <h3 className="mb-3">Vector Transformation</h3>
          <hr />

          {/* Vector Input */}
          <div className="d-flex align-items-center mb-3">
            <h5 className="me-2 mb-0">v&#8407;</h5>
            <input
              type="text"
              value={inputVector.toString()}
              onChange={(e) => setInputVector(e.target.value)}
              className="form-control"
              ref={vectorInputRef} 
              placeholder="x,y,z"
            />
          </div>

          {/* Matrix Input */}
          <div className="d-flex align-items-center mb-3">
            <h5 className="me-2 mb-0">&#x22A4;</h5>
            <input
              type="text"
              value={inputMatrix}
              onChange={(e) => setInputMatrix(e.target.value)}
              className="form-control"
              placeholder="m11,m12,m13,...,m33"
              ref={matrixInputRef}
            />
          </div>

          {/* Submit Button */}
          <button onClick={performTransformation} className="btn btn-success w-100 mb-3">
            Transform
          </button>

          {/* Divider */}
          <hr />

          {/* Display Results */}
          <MathDisplay 
            vector={vector} 
            matrix={matrix} 
            transformedVector={transformedVector}
            />
      </div>


      {/* Toggle Button */}
      <button
        className="btn btn-primary position-absolute"
        style={{ bottom: '10px', left: '10px', zIndex: 1050 }}
        data-bs-toggle="collapse"
        data-bs-target="#sidebar"
      >
        <i className="bi bi-list"></i>
      </button>

      {/* Main Canvas */}
      <div className="flex-grow-1">
        <canvas ref={canvasRef} className="w-100" />
      </div>
    </div>
  );
};

export default App;
