import React from "react";
import MathJax from "react-mathjax";
import MetrixDisplay from "./MetrixDisplay";
import VectorDisplay from "./VectorDisplay";
import TransformationDisplay from "./TransformationDisplay";

const MathDisplay = ({ vector, matrix, transformedVector }) => {
  if (!vector || !matrix || !transformedVector) {
    return <div>Missing vector or matrix data.</div>;
  }

return (
    <MathJax.Provider>
        <div className="bg-light text-dark">
            <h5>Result:</h5>
            <p className="p-3 mb-2 ">
                <MetrixDisplay matrixData={matrix} matrixName="T" />
            </p>
            <p className="p-3 mb-2 ">
                <VectorDisplay vectorData={vector} vectorName="v" />
            </p>
            <p className="p-3 mb-2 bg-secondary text-white rounded">
                <TransformationDisplay vector={vector} matrix={matrix} transformedVector={transformedVector} />
            </p>
        </div>
    </MathJax.Provider>
);
};

export default MathDisplay;