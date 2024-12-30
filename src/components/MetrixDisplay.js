import React from 'react';
import MathJax from 'react-mathjax';

const MatrixDisplay = ({ matrixData, matrixName }) => {
    if (!matrixData) {
      return <div>No matrix data provided.</div>;
    }
  
      const { m11, m12, m13, m21, m22, m23, m31, m32, m33 } = matrixData;
  
    const matrixLatex = `\\begin{bmatrix}
      ${m11 || 0} & ${m12 || 0} & ${m13 || 0} \\\\
      ${m21 || 0} & ${m22 || 0} & ${m23 || 0} \\\\
      ${m31 || 0} & ${m32 || 0} & ${m33 || 0}
    \\end{bmatrix}`;
  
    return (
      <MathJax.Provider>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px' }}>
            {matrixName && <strong>{matrixName} =</strong>}
          </span>
          <MathJax.Node formula={matrixLatex} />
        </div>
      </MathJax.Provider>
    );
  };

export default MatrixDisplay;