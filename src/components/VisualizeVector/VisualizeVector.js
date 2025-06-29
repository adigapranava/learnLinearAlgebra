import React, { useEffect, useState, useRef } from "react";
import VectorSidebar from "./SideBar/VectorSidebar";
import Notification from "../Notification";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

import * as THREE from "three";
import { getRandomBrightColor } from "../../utils/utils";
import { initializeThreeScene } from "../../utils/threeSetup";
import { createAxisLineWithStrips, createGridMesh, createVectorArrow, createAxisLabel, createComponentLines } from "../../utils/ThreeUtils";
import { COLORS } from "../../utils/colors";
import SettingsModal from "../SettingsModal";
import PlayGround from "./Playground";

const VisualizeVector = () => {
  const [vectors, setVectors] = useState([]);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const [settings, setSettings] = useState({
    showGrid: true,
    showTransformedGrid: true,
    showLabels: true,
    showVectorBreakDown: true,
    showVectorAsLine: true,
  });
  const [notification, setNotification] = useState(null);
  let cal = {scale: 1, length: 10};
  const [unit, setUnit] = useState(cal.scale);
  const [length, setLength] = useState(cal.length);

  const showNotification = (message, type = 'danger') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: value,
    }));
  };

  const handleAddVector = (newVector) => {
    let vector = {value: newVector, selected: false};
    setVectors((prevVectors) => [...prevVectors, vector]);
    localStorage.setItem("vectors", JSON.stringify([...vectors, vector]));
  };

  const onDragStart = (event, index) => {
    event.dataTransfer.setData("text/plain", index);
    event.currentTarget.style.opacity = "0.5";  
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };


  const handleDrop  = (event) => {
    showNotification("Vector added successfully", "success");
    event.currentTarget.style.opacity = "1";
    let index = event.dataTransfer.getData("text/plain");
    let updatedVectors = [...vectors];
    updatedVectors[index].selected = true;
    setVectors(updatedVectors);
    localStorage.setItem("vectors", JSON.stringify(updatedVectors));
  };

  const handelUnSelect = (index) => {
    let updatedVectors = [...vectors];
    updatedVectors[index].selected = false;
    setVectors(updatedVectors);
    localStorage.setItem("vectors", JSON.stringify(updatedVectors));
  };

  const handleRemoveVector = (index) => {
    let vector = vectors[index];
    const updatedVectors = vectors.filter((_, i) => i !== index);
    setVectors(updatedVectors);
    // update local storage
    localStorage.setItem("vectors", JSON.stringify(updatedVectors));
    showNotification(`Vector V${index+1}(${vector.value}) removed successfully`, "success");
  }

  const viewFromAxis = (axis) => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 0);
      switch (axis) {
        case "x":
          cameraRef.current.position.x = 20;
          break;
        case "y":
          cameraRef.current.position.y = 20;
          break;
        case "z":
          cameraRef.current.position.z = 20;
          break;
        default:
          break;
      }      
    }
  };

  useEffect(() => {
    // Initialize scene, camera, renderer, and controls
    if (!cameraRef.current) return;
    const camera = cameraRef.current;
    const { scene, renderer, controls } = initializeThreeScene(canvasRef.current, camera);

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

    // Add labels if enabled
    if (settings.showLabels) {
      createAxisLabel(scene, unit, "X", new THREE.Vector3(axisLength + 0.5, 0, 0));
      createAxisLabel(scene, unit, "Y", new THREE.Vector3(0, axisLength + 0.5, 0));
      createAxisLabel(scene, unit, "Z", new THREE.Vector3(0, 0, axisLength + 0.5));
    }

    for (let i = 0; i < vectors.length; i++) {
      if (!vectors[i].selected) continue;
      let vector = new THREE.Vector3(...vectors[i].value);
      // create a random color for each vector
      const color = getRandomBrightColor();
      createVectorArrow(scene, unit, vector, color, settings.showVectorAsLine);
      if (settings.showVectorBreakDown) {
        createComponentLines(scene, unit, vector, color);
      }
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
      renderer.dispose();
    };
  }, [vectors, settings]);

  useEffect(() => {
    const storedVectors = JSON.parse(localStorage.getItem("vectors"));
    
    if (storedVectors) {
      setVectors(storedVectors);
    }
    let cal = {scale: 1, length: 10}; //calculateSpaceAndScale(storedVectors);
    setUnit(cal.scale);
    setLength(cal.length);

    const frustumSize = 8;
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

    cameraRef.current = camera;
  }, []);

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <VectorSidebar 
        onAddVector={handleAddVector} 
        onRemoveVector={handleRemoveVector}
        vectors={vectors}
        showNotification={showNotification}
        viewFromAxis={viewFromAxis}
        settings={settings}
        handleSettingChange={handleSettingChange}
        onDragStart={onDragStart}
      />
       <div className="d-flex flex-column" style={{ height: "100vh" }}>
          {/* Canvas Section */}
          <canvas ref={canvasRef} className="w-100 h-100 flex-grow-1" />
        </div>
      <button
        className="btn btn-secondary position-fixed"
        style={{ bottom: '10px', right: '10px', zIndex: 1050 }}
        data-bs-toggle="modal"
        data-bs-target="#settingsModal"
      >
        <i className="bi bi-gear"></i>
      </button>
      <SettingsModal
        settings={settings}
        handleSettingChange={handleSettingChange}
      />
      <PlayGround 
        vectors={vectors}
        handleDrop={handleDrop}
        handleDragOver={handleDragOver}
        handelUnSelect={handelUnSelect}
      />
    </div>
  );
};

export default VisualizeVector;
