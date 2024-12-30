import React from 'react';
import MathJax from 'react-mathjax';

const VectorDisplay = ({ vectorData, vectorName }) => {
  if (!vectorData) {
    return <div>No vector data provided.</div>;
  }

  const { x, y, z } = vectorData;

  const vectorLatex = `\\begin{bmatrix}
    ${x || 0} \\\\
    ${y || 0} \\\\
    ${z || 0}
  \\end{bmatrix}`;

  return (
    <MathJax.Provider>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }}>
          {vectorName && <strong>{vectorName}&#8407; =</strong>}
        </span>
        <MathJax.Node formula={vectorLatex} />
      </div>
    </MathJax.Provider>
  );
};

export default VectorDisplay;