import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({topic}) =>{
    const navigate = useNavigate();
    
    return (
        <div
            key={topic.id}
            className="card"
            style={{
              width: "200px",
              minWidth: "200px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
            onClick={() => navigate(topic.route)}
          >
            <img
              src={topic.image}
              className="card-img-top"
              alt={topic.title}
              style={{ height: "150px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h5
                className="card-title text-center text-primary"
                style={{ cursor: "pointer" }}
              >
                {topic.title}
              </h5>
            </div>
          </div>
    )
}

export default Card;