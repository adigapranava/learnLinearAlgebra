const parseVectorInput = (input) => {
  const values = input.split(",").map((v) => parseFloat(v.trim()) || 0);
  return { x: values[0] || 0, y: values[1] || 0, z: values[2] || 0 };
};

const parseMatrixInput = (input) => {
  const values = input.split(",").map((v) => parseFloat(v.trim()) || 0);
  return {
    m11: values[0] || 0,
    m12: values[1] || 0,
    m13: values[2] || 0,
    m21: values[3] || 0,
    m22: values[4] || 0,
    m23: values[5] || 0,
    m31: values[6] || 0,
    m32: values[7] || 0,
    m33: values[8] || 0,
  };
};

const validateVector = (input) => {
  const values = input.split(",");
  if (values.length !== 3) {
    return false;
  }
  for (let i = 0; i < values.length; i++) {
    if (isNaN(values[i])) {
      return false;
    }
  }
  return true;
};

const validateMatrix = (input) => {
  const values = input.split(",");
  if (values.length !== 9) {
    return false;
  }
  for (let i = 0; i < values.length; i++) {
    if (isNaN(values[i])) {
      return false;
    }
  }
  return true;
};

const multiplyVectorMatrix = (vector, matrix) => {
  const { x, y, z } = vector;
  const { m11, m12, m13, m21, m22, m23, m31, m32, m33 } = matrix;

  const ut = {
      x: x * m11 + y * m12 + z * m13,
      y: x * m21 + y * m22 + z * m23,
      z: x * m31 + y * m32 + z * m33,
  };

  return ut;
};

function calculateSpaceAndScale(vector1, vector2) {
  // Combine all the values from both vectors
  const values = [...Object.values(vector1), ...Object.values(vector2)];

  // Calculate the range
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;

  // Determine the scale, ensuring a minimum of 10 units
  const scale = Math.ceil(range / 10);

  // Ensure the length of the space is at least 10 times the scale
  const spaceLength = Math.max(10 * scale, maxValue);

  return {
      scale: scale,
      length: spaceLength
  };
}

export { parseVectorInput, parseMatrixInput, validateVector, validateMatrix, multiplyVectorMatrix, calculateSpaceAndScale };