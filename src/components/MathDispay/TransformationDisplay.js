import React from 'react';
import MathJax from 'react-mathjax';

const VectorDisplay = ({ vectorData }) => { 
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
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <MathJax.Node formula={vectorLatex} /> 
            </div>
        </MathJax.Provider>
    );
};

const MatrixDisplay = ({ matrixData }) => { 
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
            <div style={{ display: 'inline-flex', alignItems: 'center'}}>
                <MathJax.Node formula={matrixLatex} /> 
            </div>
        </MathJax.Provider>
    );
};

const TransformationDisplay = ({ vector, matrix, transformedVector }) => {
    if (!vector || !matrix || !transformedVector) {
        return <div>Provide vector, matrix, and transformed vector data.</div>;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <strong>u&#8407;&nbsp;=</strong> 
            <MatrixDisplay matrixData={matrix} /> 
            <span style={{ margin: '0 5px' }}>&#x22C5;</span>
            <VectorDisplay vectorData={vector} /> 
            <strong style={{ margin: '0 10px' }}>=</strong> 
            <VectorDisplay vectorData={transformedVector} />
        </div>
    );
};

export default TransformationDisplay;