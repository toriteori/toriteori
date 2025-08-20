import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScore } from "../../contexts/ScoreContext";

const MainPage: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showTeamSettings, setShowTeamSettings] = useState<boolean>(false);
  const [teamNames, setTeamNames] = useState<{ [key: string]: string }>({
    team1: "팀 정지윤",
    team2: "팀 한지우",
  });
  const navigate = useNavigate();
  const { teams, resetScores, updateTeamName } = useScore();

  const games = [
    {
      id: "music-game",
      title: "🎵 노래 맞추기",
      description: "음악을 듣고 제목과 아티스트를 맞춰보세요!",
      status: "available",
    },
    {
      id: "number-game",
      title: "🔢 같은 숫자 맞추기",
      description: "숫자를 기억하고 같은 숫자를 찾아보세요!",
      status: "available",
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
    } else if (gameId === "number-game") {
      navigate("/number-game");
    }
  };

  const handleTeamNameChange = (teamId: string, name: string) => {
    setTeamNames((prev) => ({ ...prev, [teamId]: name }));
  };

  const handleSaveTeamNames = () => {
    Object.entries(teamNames).forEach(([teamId, name]) => {
      updateTeamName(teamId, name);
    });
    setShowTeamSettings(false);
  };

  const handleOpenTeamSettings = () => {
    setTeamNames({
      team1: teams[0].name,
      team2: teams[1].name,
    });
    setShowTeamSettings(true);
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

          {/* 전역 점수 표시 */}
          <div className="global-scores">
            <div className="score-header">
              <h3>🏆 전체 점수</h3>
              <div className="score-buttons">
                <button onClick={handleOpenTeamSettings} className="team-settings-btn">
                  👥 팀 설정
                </button>
                <button onClick={resetScores} className="reset-scores-btn">
                  🔄 점수 초기화
                </button>
              </div>
            </div>
            <div className="score-display">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="team-score-display"
                  style={{ borderColor: team.color }}
                >
                  <span className="team-name">{team.name}</span>
                  <span className="team-total-score">{team.score}점</span>
                </div>
              ))}
            </div>
          </div>

          {/* 팀 이름 설정 팝업 */}
          {showTeamSettings && (
            <div className="team-settings-overlay">
              <div className="team-settings-modal">
                <h3>👥 팀 이름 설정</h3>
                <div className="team-inputs">
                  <div className="team-input">
                    <label>팀 1:</label>
                    <input
                      type="text"
                      value={teamNames.team1}
                      onChange={(e) => handleTeamNameChange("team1", e.target.value)}
                      placeholder="팀 이름을 입력하세요"
                    />
                  </div>
                  <div className="team-input">
                    <label>팀 2:</label>
                    <input
                      type="text"
                      value={teamNames.team2}
                      onChange={(e) => handleTeamNameChange("team2", e.target.value)}
                      placeholder="팀 이름을 입력하세요"
                    />
                  </div>
                </div>
                <div className="team-settings-buttons">
                  <button onClick={handleSaveTeamNames} className="save-btn">
                    💾 저장
                  </button>
                  <button onClick={() => setShowTeamSettings(false)} className="cancel-btn">
                    ❌ 취소
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="games-grid">
          {games.map((game) => (
            <div
              key={game.id}
              className={`game-card ${game.status}`}
              onClick={() => handleGameSelect(game.id)}
            >
              <div className="game-icon">
                {game.status === "available"
                  ? game.id === "music-game"
                    ? "🎵"
                    : game.id === "number-game"
                    ? "🔢"
                    : "🎮"
                  : "🔒"}
              </div>
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
