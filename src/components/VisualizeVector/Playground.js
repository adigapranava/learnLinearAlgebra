import React, { useEffect, useState, useRef } from "react";

const PlayGround = ({vectors, handleDrop, handleDragOver, handelUnSelect}) => {
    return (
        <div
        className="p-3 rounded bg-white"
        style={{
          position: "fixed",
          bottom: "0%",
          left: "57%",
          width: "80%",
          transform: "translate(-50%, -10%)",
          zIndex: 1000,
        }}
        >
        <div
          className="container w-100 d-flex flex-wrap gap-3 justify-content-center align-items-center bg-light p-1 rounded text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            height: "70px",
            justifyContent: "flex-start",
          }}
        >
          { vectors && vectors.filter((vector) => vector.selected).length > 0 ? (
            vectors.map((vector, index) => {
              if (vector.selected) {
                return (
                  <div
                  key={index}
                  onDoubleClick={() => handelUnSelect(index)}
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
                );
              }
            })
          ):(
          <p className="text-secondary m-3">
            Drag and drop vectors to view them in 3D 
          </p>
          )}
        </div>
      </div>
    );
}

export default PlayGround;