import React from "react";

const VectorDisplay = ({ vectors, onRemoveVector, onDragStart }) => {
  const handleDragEnd = (event) => {
    event.currentTarget.style.opacity = "1";
  };

  return (
    <div
      className="vector-display p-3"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #ddd",
        borderRadius: "5px",
        overflowY: "auto",
        maxHeight: "300px",
      }}
    >
      <h5>Vectors</h5>
      <div
        className="d-flex flex-wrap gap-3"
        style={{
          justifyContent: "flex-start",
        }}
      >
        {vectors.length > 0 ? (
          vectors.map((vector, index) => (
            <div
              key={index}
              draggable="true" // Enable dragging
              onDragStart={(event) => onDragStart(event, index)} 
              onDragEnd={handleDragEnd} // Drag end handler
              onDoubleClick={() => onRemoveVector(index)}
              className="d-flex flex-column align-items-center justify-content-center"
              style={{
                width: "60px",
                height: "60px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#007bff",
                }}
              >
                V{index + 1}
              </span>
              <small
                style={{
                  fontSize: "0.8rem",
                  color: "#6c757d",
                  textAlign: "center",
                }}
              >
                ({vector.value.join(", ")} )
              </small>
            </div>
          ))
        ) : (
          <p className="text-muted">No vectors added yet.</p>
        )}
      </div>
    </div>
  );
};

export default VectorDisplay;
