import React, { useState } from "react";
import EntryPage from "./components/EntryPage/EntryPage";
import MainPage from "./components/MainPage/MainPage";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"entry" | "main">("entry");

  const handleGameStart = () => {
    setCurrentPage("main");
  };

  const handleBackToEntry = () => {
    setCurrentPage("entry");
  };

  return (
    <div className="App">
      {currentPage === "entry" ? (
        <EntryPage onEnter={handleGameStart} />
      ) : (
        <MainPage onBackToEntry={handleBackToEntry} />
      )}
    </div>
  );
};

export default App;
