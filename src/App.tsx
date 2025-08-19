import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EntryPage from "./components/EntryPage/EntryPage";
import MainPage from "./components/MainPage/MainPage";
import MusicGame from "./components/MusicGame/MusicGame";
import NumberGame from "./components/NumberGame/NumberGame";
import { ScoreProvider } from "./contexts/ScoreContext";

const App: React.FC = () => {
  return (
    <ScoreProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<EntryPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/music-game" element={<MusicGame />} />
            <Route path="/number-game" element={<NumberGame />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ScoreProvider>
  );
};

export default App;
