import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./app/page/LoginPage/Signin";
import Signup from "./app/page/SignupPage/Singup";
import Home from "./app/page/HomePage/Home";


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;