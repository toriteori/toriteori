import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Study from "./pages/Study";
import Experiment from "./pages/Experiment";
import NotificationForm from "./components/NotificationForm/NotificationForm";
import MusicGame from "./components/MusicGame/MusicGame";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/study" element={<Study />} />
          <Route path="/experiment" element={<Experiment />} />
          <Route path="/notification-form" element={<NotificationForm />} />
          <Route path="/music-game" element={<MusicGame />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
