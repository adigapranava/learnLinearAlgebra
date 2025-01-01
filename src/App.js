import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

import Notification from './components/Notification';
import Sidebar from './components/SideBar';
import SettingsModal from './components/SettingsModal';
import { parseMatrixInput, parseVectorInput, validateMatrix, validateVector, multiplyVectorMatrix } from './utils/utils';

const App = () => {
  const canvasRef = useRef(null);
  const [unit, setUnit] = useState(1);
  const [length, setLength] = useState(10);
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
  const [settings, setSettings] = useState({
    showGrid: true,
    showTransformedGrid: true,
    showLabels: true,
    showVectorBreakDown: true,
  });

  const handleSettingChange = (setting, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: value,
    }));
  };


  const showNotification = (message, type = 'danger') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const performTransformation = (e) => {
    const validatedVector = validateVector(inputVector);
    const validatedMatrix = validateMatrix(inputMatrix);

    if (validatedVector && validatedMatrix) {
        const parsedVector = parseVectorInput(inputVector);
        const parsedMatrix = parseMatrixInput(inputMatrix);
        const ut = multiplyVectorMatrix(parsedVector, parsedMatrix);

        // Update the vector and matrix states
        setVector(parsedVector);
        setMatrix(parsedMatrix);
        setTransformedVector({ x: ut.x, y: ut.y, z: ut.z });

        showNotification('Transformation successful.', 'success');
    } else if (!validatedVector) { 
        showNotification("Invalid vector input. Please enter 3 numerical values separated by commas.", "danger");
        setTimeout(() => {
            if (vectorInputRef.current) {
                vectorInputRef.current.focus();
            }
        }, 0);
    } else { 
        showNotification("Invalid matrix input. Please enter 9 numerical values separated by commas.", "danger");
        setTimeout(() => {
            if (matrixInputRef.current) {
                matrixInputRef.current.focus();
            }
        }, 0);
    }
};

  useEffect(() => {
    setTransformedVector(multiplyVectorMatrix(vector, matrix));
  },[]);


  useEffect(() => {
    const scene = new THREE.Scene();
    const frustumSize = 8; 
    const aspect = window.innerWidth / window.innerHeight;
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

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const createAxisLineWithStrips = (start, end, color, unitLength = 1, stripLength = 0.1) => {
      // Create the main axis line
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      const material = new THREE.LineBasicMaterial({ color });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    
      // Calculate direction of the axis
      const direction = new THREE.Vector3().subVectors(end, start).normalize();
      const length = start.distanceTo(end);
    
      // Define a perpendicular vector for strip calculation
      const arbitraryVector = new THREE.Vector3(0, 0, 1);
      if (Math.abs(direction.z) > 0.99) {
        arbitraryVector.set(1, 0, 0); // Switch if aligned with the X-axis
      }
      
      const perpendicular = new THREE.Vector3().crossVectors(direction, arbitraryVector).normalize().multiplyScalar(stripLength);
    
      // Iterate through each unit interval to draw strips
      for (let i = 0; i <= length; i += unitLength) {
        const pointOnAxis = start.clone().add(direction.clone().multiplyScalar(i));
    
        // Create the strip line geometry (perpendicular to the axis)
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

    const createComponentLines = (vector, color) => {
      const componentX = new THREE.Vector3(vector.x, 0, 0);
      const componentY = new THREE.Vector3(0, vector.y, 0);
      const componentZ = new THREE.Vector3(0, 0, vector.z);
  
      // Lines for the vector breakdown
      const origin = new THREE.Vector3(0, 0, 0);
      const xLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([origin, componentX]),
        new THREE.LineBasicMaterial({ 
          color ,
          transparent: true, 
          opacity: 0.5,
        })
      );
      const yLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([componentX, componentX.clone().add(componentY)]),
        new THREE.LineBasicMaterial({ 
          color ,
          transparent: true, 
          opacity: 0.5, })
      );
      const zLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([componentX.clone().add(componentY), vector]),
        new THREE.LineBasicMaterial({ 
          color ,
          transparent: true, 
          opacity: 0.5, })
      );
  
      scene.add(xLine, yLine, zLine);
      return [xLine, yLine, zLine];
    };

    // Function to create a vector with an arrow
    const createVectorArrow = (vector, color) => {
      const dir = vector.clone().normalize(); 
      const length = vector.length(); 
      const arrowHelper = new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), length, color, 0.3, 0.2);
      scene.add(arrowHelper);
      return arrowHelper;
    };

    // Create axes lines
    const axisLength = length / unit;
    const axisColor = 0xffff00;
    createAxisLineWithStrips(new THREE.Vector3(-axisLength, 0, 0), new THREE.Vector3(axisLength, 0, 0), axisColor);
    createAxisLineWithStrips(new THREE.Vector3(0, -axisLength, 0), new THREE.Vector3(0, axisLength, 0), axisColor);
    createAxisLineWithStrips(new THREE.Vector3(0, 0, -axisLength), new THREE.Vector3(0, 0, axisLength), axisColor);

    // Create grids if enabled
    let gridX, gridY, gridZ;
    if (settings.showGrid) {
      const gridSize = axisLength*2;
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
    if (settings.showLabels) {
      createAxisLabel("X", new THREE.Vector3(axisLength + 0.5, 0, 0));
      createAxisLabel("Y", new THREE.Vector3(0, axisLength + 0.5, 0));
      createAxisLabel("Z", new THREE.Vector3(0, 0, axisLength + 0.5));
      createAxisLabel("v", initialVectorT.clone().multiplyScalar(0.5));
      createAxisLabel("u", transformedVectorT.clone().multiplyScalar(0.5));
    }

    let vectorBreakdownLines = [];
    if (settings.showVectorBreakDown) {
      vectorBreakdownLines = [
        ...createComponentLines(initialVectorT, 0xffffff),
        ...createComponentLines(transformedVectorT, 0xffffff),
      ];
    }else{
      vectorBreakdownLines = [];
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
      if (settings.showGrid) scene.remove(gridX, gridY, gridZ); // Remove grids
      if(settings.showVectorBreakDown) vectorBreakdownLines.forEach((line) => scene.remove(line));
      scene.remove(initialVectorArrow, transformedVectorArrow);
      renderer.dispose();
    };
  }, [vector, matrix, settings, transformedVector]); 
  
  

  return (
    <div className="d-flex">
      {notification && <Notification message={notification.message} type={notification.type} />}

      <Sidebar
        inputVector={inputVector}
        setInputVector={setInputVector}
        inputMatrix={inputMatrix}
        setInputMatrix={setInputMatrix}
        performTransformation={performTransformation}
        vector={vector}
        matrix={matrix}
        transformedVector={transformedVector}/>

      <button
        className="btn btn-primary position-fixed"
        style={{ bottom: '10px', left: '10px', zIndex: 1050 }}
        data-bs-toggle="collapse"
        data-bs-target="#sidebar"
      >
        <i className="bi bi-list"></i>
      </button>

      <button
        className="btn btn-secondary position-fixed"
        style={{ bottom: '10px', right: '10px', zIndex: 1050 }}
        data-bs-toggle="modal"
        data-bs-target="#settingsModal"
      >
        <i className="bi bi-gear"></i>
      </button>

      <div className="flex-grow-1">
        <canvas ref={canvasRef} className="w-100" />
      </div>

      <SettingsModal
        settings={settings}
        handleSettingChange={handleSettingChange}
      />
  </div>
  
  );
};

export default App;
