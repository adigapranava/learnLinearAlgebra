import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

import Notification from './components/Notification';
import Sidebar from './components/SideBar';
import SettingsModal from './components/SettingsModal';
import { parseMatrixInput, parseVectorInput, validateMatrix, validateVector, multiplyVectorMatrix } from './utils/utils';
import { initializeThreeScene } from './utils/threeSetup';
import {
  createAxisLineWithStrips,
  createAxisLabel,
  createGridMesh,
  createComponentLines,
  createVectorArrow,
} from './utils/ThreeUtils';
import COLORS from './utils/colors';

const App = () => {
  const canvasRef = useRef(null);
  const [unit, setUnit] = useState(5);
  const [length, setLength] = useState(100);
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
    // Initialize scene, camera, renderer, and controls
    const { scene, camera, renderer, controls } = initializeThreeScene(canvasRef.current);

    // Create axes lines
    const axisLength = length / unit;
    createAxisLineWithStrips(scene, new THREE.Vector3(-axisLength, 0, 0), new THREE.Vector3(axisLength, 0, 0), COLORS.axis);
    createAxisLineWithStrips(scene, new THREE.Vector3(0, -axisLength, 0), new THREE.Vector3(0, axisLength, 0), COLORS.axis);
    createAxisLineWithStrips(scene, new THREE.Vector3(0, 0, -axisLength), new THREE.Vector3(0, 0, axisLength), COLORS.axis);

    // Create grids if enabled
    let gridX, gridY, gridZ;
    if (settings.showGrid) {
      const gridSize = axisLength * 2;
      const gridDivisions = 2 * axisLength;

      gridX = createGridMesh(scene, gridSize, gridDivisions, COLORS.grid);
      gridX.rotation.x = Math.PI / 2;
      gridY = createGridMesh(scene, gridSize, gridDivisions, COLORS.grid);
      gridY.rotation.z = Math.PI / 2;
      gridZ = createGridMesh(scene, gridSize, gridDivisions, COLORS.grid);
      gridZ.rotation.y = Math.PI / 2;
    }

    // Create initial and transformed vectors
    const initialVector = new THREE.Vector3(vector.x, vector.y, vector.z);
    const initialVectorArrow = createVectorArrow(scene, initialVector, COLORS.vectorInitial);

    const transformedVectorT = new THREE.Vector3(transformedVector.x, transformedVector.y, transformedVector.z);
    const transformedVectorArrow = createVectorArrow(scene, transformedVectorT, COLORS.vectorTransformed);

    // Add labels if enabled
    if (settings.showLabels) {
      createAxisLabel(scene, "X", new THREE.Vector3(axisLength + 0.5, 0, 0));
      createAxisLabel(scene, "Y", new THREE.Vector3(0, axisLength + 0.5, 0));
      createAxisLabel(scene, "Z", new THREE.Vector3(0, 0, axisLength + 0.5));
      createAxisLabel(scene, "v", initialVector.clone().multiplyScalar(0.5));
      createAxisLabel(scene, "u", transformedVectorT.clone().multiplyScalar(0.5));
    }

    // Create vector breakdowns if enabled
    let vectorBreakdownLines = [];
    if (settings.showVectorBreakDown) {
      vectorBreakdownLines = [
        ...createComponentLines(scene, initialVector, COLORS.vectorBreakdown),
        ...createComponentLines(scene, transformedVectorT, COLORS.vectorBreakdown),
      ];
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
      if (settings.showGrid) scene.remove(gridX, gridY, gridZ);
      if (settings.showVectorBreakDown) vectorBreakdownLines.forEach((line) => scene.remove(line));
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