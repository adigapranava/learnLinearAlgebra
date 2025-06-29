import React, { useState, createRef } from "react";

const Form = ({ onAddVector, showNotification}) => {
    const [vector, setVector] = useState("");
    const vectorRef = createRef();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (vector.trim() === "") return;
        const components = vector.split(",").map((v) => parseFloat(v.trim()));
        if (components.length === 3 && components.every((v) => !isNaN(v))) {
            onAddVector(components);
            setVector("");
            showNotification("Vector added successfully", "success");
        } else {
            showNotification("Please enter a valid vector (x, y, z)", "danger");
        }
    };
    
    return (
        <form onSubmit={handleSubmit} style={
        { backgroundColor: "#ffffff", border: "1px solid #ddd", borderRadius: "5px", padding: "10px" }  
        }>
            <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter vector (x,y,z)"
                value={vector}
                ref={vectorRef}
                onChange={(e) => setVector(e.target.value)}
            />
            <button type="submit"  className="btn btn-success w-100 mb-3">
                Add Vector
            </button>
        </form>
    );
}

export default Form;