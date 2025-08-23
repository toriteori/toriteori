import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScore } from "../../contexts/ScoreContext";

interface Game {
  id: string;
  title: string;
  description: string;
  status: "available" | "coming-soon" | "locked";
  requiresPassword?: boolean;
}

interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
}

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { teams, resetScores, updateTeamName } = useScore();
  const [showTeamSettings, setShowTeamSettings] = useState(false);
  const [teamNames, setTeamNames] = useState({ team1: "", team2: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showScores, setShowScores] = useState(false);

  const games: Game[] = [
    {
      id: "music-game",
      title: "노래 맞추기",
      description: "음악을 듣고 제목을 맞춰보세요!",
      status: "available",
      requiresPassword: true,
    },
    {
      id: "number-game",
      title: "숫자 맞추기",
      description: "숫자를 기억하고 순서대로 입력하세요!",
      status: "available",
    },
    {
      id: "ladder-game",
      title: "사다리 게임",
      description: "사다리를 타고 상품을 찾아보세요!",
      status: "available",
    },
    {
      id: "team-battle-game",
      title: "유리의 세계와 시간의 계단",
      description: "팀별로 스토리를 진행하며 점수를 획득하세요!",
      status: "available",
    },
  ];

  const handleGameSelect = (gameId: string) => {
    const game = games.find((g) => g.id === gameId);
    if (game?.requiresPassword) {
      setShowPasswordModal(true);
      setPassword("");
      setPasswordError("");
    } else {
      navigate(`/${gameId}`);
    }
  };

  const handlePasswordSubmit = () => {
    if (password === "ssm1029!") {
      setShowPasswordModal(false);
      navigate("/music-game");
    } else {
      setPasswordError("비밀번호가 올바르지 않습니다.");
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPassword("");
    setPasswordError("");
  };

  const handlePasswordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePasswordSubmit();
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
    // setShowScores(false); // 점수판 닫기 제거
  };

  const handleBackToEntry = () => {
    navigate("/");
  };

  return (
    <div className="main-page">
      {/* 우측하단 점수 토글 버튼 */}
      <div className="floating-buttons">
        <button onClick={() => setShowScores(!showScores)} className="floating-button score-toggle">
          {showScores ? "📊 점수 숨기기" : "📊 점수 보기"}
        </button>
        <button onClick={handleOpenTeamSettings} className="floating-button team-settings">
          👥 팀 설정
        </button>
        <button onClick={resetScores} className="floating-button">
          🔄 점수 초기화
        </button>
      </div>

      {/* 우측하단 슬라이드 점수판 */}
      <div className={`floating-scores ${showScores ? "show" : ""}`}>
        <div className="score-header">
          <h3>🏆 전체 점수</h3>
        </div>
        <div className="score-display">
          {teams.map((team: Team) => (
            <div
              key={team.id}
              className={`team-score-display ${
                team.score === Math.max(...teams.map((t: Team) => t.score)) && team.score > 0
                  ? "winner"
                  : ""
              }`}
              style={{ borderColor: team.color }}
            >
              <span className="team-name">{team.name}</span>
              <span className="team-total-score">{team.score}점</span>
              {team.score === Math.max(...teams.map((t: Team) => t.score)) && team.score > 0 && (
                <span className="winner-badge">👑 승리!</span>
              )}
            </div>
          ))}
        </div>
        {/* 승리팀 표시 */}
        {teams.some((team: Team) => team.score > 0) && (
          <div className="winner-announcement">
            {(() => {
              const maxScore = Math.max(...teams.map((t: Team) => t.score));
              const winners = teams.filter((team: Team) => team.score === maxScore);
              if (winners.length === 1) {
                return (
                  <div className="winner-message">
                    <span className="crown">👑</span>
                    <span className="winner-text">
                      현재 승리: <strong>{winners[0].name}</strong> ({maxScore}점)
                    </span>
                  </div>
                );
              } else if (winners.length > 1 && maxScore > 0) {
                return (
                  <div className="tie-message">
                    <span className="tie-icon">🤝</span>
                    <span className="tie-text">
                      현재 동점: {winners.map((w: Team) => w.name).join(", ")} ({maxScore}점)
                    </span>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
      </div>

      <div className="main-container">
        <div className="main-header">
          <h1 className="main-title">🎮 오락실</h1>
          <p className="main-subtitle">원하는 게임을 선택하세요!</p>
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

        {/* 비밀번호 입력 팝업 */}
        {showPasswordModal && (
          <div className="password-overlay">
            <div className="password-modal">
              <h3>🔒 비밀번호 입력</h3>
              <p className="password-description">
                노래 맞추기 게임에 접근하려면 비밀번호를 입력하세요.
              </p>
              <div className="password-input-container">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handlePasswordKeyPress}
                  placeholder="비밀번호를 입력하세요"
                  className="password-input"
                  autoFocus
                />
                {passwordError && <p className="password-error">{passwordError}</p>}
              </div>
              <div className="password-buttons">
                <button onClick={handlePasswordSubmit} className="submit-btn">
                  🔓 접속
                </button>
                <button onClick={handlePasswordCancel} className="cancel-btn">
                  ❌ 취소
                </button>
              </div>
            </div>
          </div>
        )}

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
                    : game.id === "ladder-game"
                    ? "🪜"
                    : game.id === "team-battle-game"
                    ? "⚔️"
                    : "🎮"
                  : "🔒"}
              </div>
              <h3 className="game-title">{game.title}</h3>
              <p className="game-description">{game.description}</p>
              {game.requiresPassword && <div className="password-badge">🔒 비밀번호 필요</div>}
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
