import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MainPage: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const navigate = useNavigate();

  const games = [
    {
      id: "music-game",
      title: "🎵 노래 맞추기",
      description: "음악을 듣고 제목과 아티스트를 맞춰보세요!",
      status: "available",
    },
    {
      id: "game-2",
      title: "🎮 게임 2",
      description: "준비 중인 게임입니다.",
      status: "coming-soon",
    },
    {
      id: "game-3",
      title: "🎯 게임 3",
      description: "준비 중인 게임입니다.",
      status: "coming-soon",
    },
    {
      id: "game-4",
      title: "🏆 게임 4",
      description: "준비 중인 게임입니다.",
      status: "coming-soon",
    },
  ];

  const handleGameSelect = (gameId: string) => {
    if (gameId === "music-game") {
      navigate("/music-game");
    }
  };

  const handleBackToEntry = () => {
    navigate("/");
  };

  return (
    <div className="main-page">
      <div className="main-container">
        <div className="main-header">
          <h1 className="main-title">🎮 오락실</h1>
          <p className="main-subtitle">원하는 게임을 선택하세요!</p>
        </div>

        <div className="games-grid">
          {games.map((game) => (
            <div
              key={game.id}
              className={`game-card ${game.status}`}
              onClick={() => handleGameSelect(game.id)}
            >
              <div className="game-icon">{game.status === "available" ? "🎵" : "🔒"}</div>
              <h3 className="game-title">{game.title}</h3>
              <p className="game-description">{game.description}</p>
              {game.status === "coming-soon" && <div className="coming-soon-badge">준비중</div>}
            </div>
          ))}
        </div>

        <div className="main-footer">
          <button className="back-button" onClick={handleBackToEntry}>
            🏠 입장 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
