import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LearnLinearAlgebra from "./components/LearnAlgebra/LearnLinearAlgebra";
import './App.css'
import VisualizeVector from "./components/VisualizeVector/VisualizeVector";
import VectorTransformation from "./components/VectorTransformation/VectorTransformation";

const VectorAddition = () => <h2>Vector Addition Page</h2>;
const Multiplication = () => <h2>Multiplication Page</h2>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LearnLinearAlgebra />} />
        <Route path="/visualize-vector" element={<VisualizeVector />} />
        <Route path="/vector-addition" element={<VectorAddition />} />
        <Route path="/multiplication" element={<Multiplication />} />
        <Route path="/vector-transformation" element={<VectorTransformation />} />
      </Routes>
    </Router>
  );
}

export default App;