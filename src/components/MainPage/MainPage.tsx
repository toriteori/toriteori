import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScore } from "../../contexts/ScoreContext";
import QuickMenu from "../QuickMenu/QuickMenu";
import "../../css/quickMenu.css";
import "./MainPage.css";

interface Game {
  id: string;
  title: string;
  description: string;
  status: "available" | "coming-soon" | "locked";
  requiresPassword?: boolean;
  password?: string;
}

interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
}

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { teams, resetScores, updateTeamName, addTeamScore } = useScore();
  const [showTeamSettings, setShowTeamSettings] = useState(false);
  const [teamNames, setTeamNames] = useState({ team1: "", team2: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const [showScores, setShowScores] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);
  const [showScoreInputModal, setShowScoreInputModal] = useState<boolean>(false);
  const [scoreInputs, setScoreInputs] = useState({ team1: "", team2: "" });

  const games: Game[] = [
    {
      id: "ox-game",
      title: "OX 게임",
      description: "O와 X로 정답을 맞춰보세요!",
      status: "available",
    },
    {
      id: "music-game",
      title: "노래 맞추기",
      description: "음악을 듣고 제목을 맞춰보세요!",
      status: "available",
      requiresPassword: true,
      password: "ssm1029!",
    },
    {
      id: "number-game",
      title: "숫자 맞추기",
      description: "숫자를 기억하고 순서대로 입력해주세요!",
      status: "available",
    },
    {
      id: "lotto-game",
      title: "로또 당첨 게임",
      description: "번호를 선택하고 당첨을 노려보세요!",
      status: "available",
    },
    {
      id: "team-battle-game",
      title: "유리의 세계와 시간의 계단",
      description: "팀별로 스토리를 진행하며 점수를 획득해주세요!",
      status: "available",
      requiresPassword: true,
      password: "1234",
    },
  ];

  const handleGameSelect = (gameId: string) => {
    const game = games.find((g) => g.id === gameId);
    if (game?.status === "coming-soon") {
      return; // 준비중인 게임은 클릭해도 아무것도 하지 않음
    }
    if (game?.requiresPassword) {
      setSelectedGameId(gameId);
      setShowPasswordModal(true);
      setPassword("");
      setPasswordError("");
    } else {
      navigate(`/${gameId}`);
    }
  };

  const handlePasswordSubmit = () => {
    const game = games.find((g) => g.id === selectedGameId);
    if (game && game.password && password === game.password) {
      setShowPasswordModal(false);
      navigate(`/${selectedGameId}`);
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

  const handleOpenTeamSettings = () => {
    setTeamNames({
      team1: teams[0]?.name || "",
      team2: teams[1]?.name || "",
    });
    setShowTeamSettings(true);
  };

  const handleSaveTeamNames = () => {
    if (teamNames.team1.trim() && teamNames.team2.trim()) {
      updateTeamName("team1", teamNames.team1.trim());
      updateTeamName("team2", teamNames.team2.trim());
      setShowTeamSettings(false);
    }
  };

  const handleBackToEntry = () => {
    navigate("/");
  };

  const handleResetScores = () => {
    setShowResetConfirmModal(true);
  };

  const handleConfirmReset = () => {
    resetScores();
    setShowResetConfirmModal(false);
  };

  const handleCancelReset = () => {
    setShowResetConfirmModal(false);
  };

  const handleOpenScoreInput = () => {
    setScoreInputs({
      team1: teams[0]?.score.toString() || "0",
      team2: teams[1]?.score.toString() || "0",
    });
    setShowScoreInputModal(true);
  };

  const handleScoreInputChange = (teamId: string, value: string) => {
    // 숫자만 입력 가능하도록
    const numericValue = value.replace(/[^0-9]/g, "");
    setScoreInputs((prev) => ({ ...prev, [teamId]: numericValue }));
  };

  const handleSaveScores = () => {
    const team1Score = parseInt(scoreInputs.team1) || 0;
    const team2Score = parseInt(scoreInputs.team2) || 0;

    // 현재 점수를 0으로 리셋하고 새로운 점수 설정
    resetScores();
    addTeamScore("team1", team1Score);
    addTeamScore("team2", team2Score);
    setShowScoreInputModal(false);
  };

  const handleCancelScoreInput = () => {
    setShowScoreInputModal(false);
  };

  // 팀 이름이 설정되지 않은 경우 안내 메시지 표시
  const showTeamNameWarning = !teams[0]?.name || !teams[1]?.name;

  return (
    <div className="main-page">
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
          <p className="main-subtitle">원하는 게임을 선택해주세요!</p>

          {/* 팀 이름 설정 안내 */}
          {showTeamNameWarning && (
            <div className="team-name-warning">
              <div className="warning-icon">⚠️</div>
              <div className="warning-content">
                <p className="warning-title">팀 이름을 먼저 설정해주세요!</p>
                <p className="warning-description">
                  게임을 시작하기 전에 팀 이름을 설정하면 모든 게임에서 동일한 팀 이름을 사용할 수
                  있습니다.
                </p>
                <button onClick={handleOpenTeamSettings} className="setup-team-btn">
                  👥 팀 이름 설정하기
                </button>
              </div>
            </div>
          )}
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
                    placeholder="팀 이름을 입력해주세요."
                  />
                </div>
                <div className="team-input">
                  <label>팀 2:</label>
                  <input
                    type="text"
                    value={teamNames.team2}
                    onChange={(e) => handleTeamNameChange("team2", e.target.value)}
                    placeholder="팀 이름을 입력해주세요."
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
                {games.find((g) => g.id === selectedGameId)?.title} 게임에 접근하려면 비밀번호를
                입력해주세요.
              </p>
              <div className="password-input-container">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handlePasswordKeyPress}
                  placeholder="비밀번호를 입력해주세요."
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

        {/* 점수 초기화 확인 모달 */}
        {showResetConfirmModal && (
          <div className="password-overlay">
            <div className="password-modal">
              <h3>🗑️ 점수 초기화</h3>
              <p className="password-description">
                정말로 모든 팀의 점수를 초기화하시겠습니까?
                <br />이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="password-buttons">
                <button onClick={handleConfirmReset} className="submit-btn">
                  ✅ 확인
                </button>
                <button onClick={handleCancelReset} className="cancel-btn">
                  ❌ 취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 점수 입력 모달 */}
        {showScoreInputModal && (
          <div className="password-overlay">
            <div className="password-modal">
              <h3>📊 점수 추가</h3>
              <p className="password-description">
                각 팀에 추가할 점수를 입력해주세요. (기존 점수에 더해집니다)
              </p>
              <div className="score-input-container">
                <div className="score-input">
                  <label>{teams[0]?.name || "팀 1"}:</label>
                  <input
                    type="text"
                    value={scoreInputs.team1}
                    onChange={(e) => handleScoreInputChange("team1", e.target.value)}
                    placeholder="추가할 점수"
                    className="score-input-field"
                  />
                </div>
                <div className="score-input">
                  <label>{teams[1]?.name || "팀 2"}:</label>
                  <input
                    type="text"
                    value={scoreInputs.team2}
                    onChange={(e) => handleScoreInputChange("team2", e.target.value)}
                    placeholder="추가할 점수"
                    className="score-input-field"
                  />
                </div>
              </div>
              <div className="password-buttons">
                <button onClick={handleSaveScores} className="submit-btn">
                  ➕ 추가
                </button>
                <button onClick={handleCancelScoreInput} className="cancel-btn">
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
              style={{ cursor: game.status === "coming-soon" ? "not-allowed" : "pointer" }}
            >
              <div className="game-icon">
                {game.status === "available"
                  ? game.id === "ox-game"
                    ? "⭕❌"
                    : game.id === "music-game"
                    ? "🎵"
                    : game.id === "number-game"
                    ? "🔢"
                    : game.id === "lotto-game"
                    ? "🎰"
                    : game.id === "team-battle-game"
                    ? "⚔️"
                    : "🎮"
                  : game.status === "coming-soon"
                  ? "🔒"
                  : "🔒"}
              </div>
              <h3 className="game-title">{game.title}</h3>
              <p className="game-description">
                {game.status === "coming-soon" ? "🚧 개발중입니다" : game.description}
              </p>
              {game.requiresPassword && <div className="password-badge">🔒 비밀번호 필요</div>}
              {game.status === "coming-soon" && <div className="coming-soon-badge">🚧 개발중</div>}
            </div>
          ))}
        </div>

        <div className="main-footer">
          <button className="back-button" onClick={handleBackToEntry}>
            🏠 입장 페이지로 돌아가기
          </button>
        </div>
      </div>

      {/* 퀵메뉴 */}
      <QuickMenu
        buttons={[
          {
            id: "score-toggle",
            icon: "📊",
            title: showScores ? "점수 숨기기" : "점수 보기",
            onClick: () => setShowScores(!showScores),
            color: "score",
          },
          {
            id: "score-input",
            icon: "✏️",
            title: "점수 추가",
            onClick: handleOpenScoreInput,
            color: "input",
          },
          {
            id: "team-settings",
            icon: "👥",
            title: "팀 설정",
            onClick: handleOpenTeamSettings,
            color: "team",
          },
          {
            id: "reset-scores",
            icon: "🗑️",
            title: "점수 초기화",
            onClick: handleResetScores,
            color: "reset",
          },
        ]}
      />
    </div>
  );
};

export default MainPage;
