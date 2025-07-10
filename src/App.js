import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./app/page/LoginPage/Signin";
import Signup from "./app/page/SignupPage/Singup";
import Home from "./app/page/HomePage/Home";
import ProtectedRoute from "./app/page/components/ProtectedRoute.js";
import PersonalInfoForm from "./app/page/SignupPage/PersonalInfoForm.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/personal-info" element={<PersonalInfoForm />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
