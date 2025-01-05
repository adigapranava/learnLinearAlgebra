import React, { useRef } from 'react';
import MathDisplay from './MathDisplay'; 

const Sidebar = ({
  inputVector,
  setInputVector,
  inputMatrix,
  setInputMatrix,
  performTransformation,
  vector,
  matrix,
  transformedVector,
  units,
}) => {
  const vectorInputRef = useRef(null);
  const matrixInputRef = useRef(null);

  return (
    <div className="bg-light border-end vh-100 p-3 collapse show" id="sidebar">
      <h3 className="mb-3">Vector Transformation</h3>
      <hr />
      <form
        onSubmit={(e) => {
          e.preventDefault(); 
          performTransformation();
        }}
      >
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
        <button type="submit" onClick={performTransformation} className="btn btn-success w-100 mb-3">
          Transform
        </button>
      </form>
      {/* Divider */}
      <hr />

      {/* Display Results */}
      <MathDisplay
        vector={vector}
        matrix={matrix}
        transformedVector={transformedVector}
      />
      <p>
        * scale: {units} <br />
      </p>
    </div>
  );
};

export default Sidebar;
