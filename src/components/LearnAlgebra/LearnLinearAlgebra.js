import React from "react";
import Card from "./Card";
import "../../style/LearnLinearAlgebra.css";

const LearnLinearAlgebra = () => {

  // Array of topics
  const topics = [
    {
      id: 1,
      title: "Visualize Vector",
      image: "https://via.placeholder.com/150",
      route: "/visualize-vector",
    },
    {
      id: 2,
      title: "Vector Addition",
      image: "https://via.placeholder.com/150",
      route: "/vector-addition",
    },
    {
      id: 3,
      title: "Multiplication",
      image: "https://via.placeholder.com/150",
      route: "/multiplication",
    },
    {
      id: 4,
      title: "Transformation",
      image: "https://via.placeholder.com/150",
      route: "/vector-transformation",
    },
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">
        LEARN LINEAR ALGEBRA
      </h1>
      <div
        className="d-flex overflow-auto sour-gummy-sub"
        style={{ whiteSpace: "nowrap", gap: "20px" }}
      >
        {topics.map((topic) => (
          <Card key={topic.id} topic={topic} />
          
        ))}
      </div>
    </div>
  );
};

export default LearnLinearAlgebra;