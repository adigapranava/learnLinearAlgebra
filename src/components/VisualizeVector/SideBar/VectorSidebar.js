import React from "react";
import Form from "./Form";
import VectorDisplay from "../VectorDisplay";

const VectorSidebar = ({ onAddVector, onRemoveVector, vectors, showNotification, viewFromAxis, settings, handleSettingChange, onDragStart }) => {

  return (
    <div className="sidebar p-3" style={{ backgroundColor: "#f8f9fa", width: "250px", fontFamily: "Sour Gummy" }}>
      <h4>Visualize Vector</h4>
      <hr />
      <Form
        onAddVector={onAddVector}
        showNotification={showNotification}
      />
      <hr />
      <button className="btn btn-secondary w-auto m-2"
        style={{ fontFamily: "Sour Gummy", backgroundColor: "#343a40", fontSize: "0.8rem" }}
       onClick={()=>{viewFromAxis("z")}}><i className="bi bi-bootstrap-reboot"></i></button>

       <button className="btn btn-secondary w-auto m-2"
        style={{ fontFamily: "Sour Gummy", backgroundColor: "#343a40", fontSize: "0.8rem" }}
       onClick={()=>{handleSettingChange("showVectorAsLine", !settings.showVectorAsLine)}}>
        {settings.showVectorAsLine ?  
        <i className="bi bi-dot"></i>:
        <i className="bi bi-arrow-up-right"></i>
        }
       </button>
      <hr />
     <VectorDisplay vectors={vectors} onRemoveVector={onRemoveVector} onDragStart={onDragStart}/>
    </div>
  );
};

export default VectorSidebar;
