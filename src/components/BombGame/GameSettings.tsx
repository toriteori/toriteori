import React, { useState } from "react";
import { useScore } from "../../contexts/ScoreContext";
import type { GameSettings as GameSettingsType } from "./BombGame";

interface GameSettingsProps {
  settings: GameSettingsType;
  onStartGame: (settings: GameSettingsType) => void;
}

const GameSettings: React.FC<GameSettingsProps> = ({ settings, onStartGame }) => {
  const { teams } = useScore();
  const [localSettings, setLocalSettings] = useState<GameSettingsType>(settings);

  const handleDifficultyChange = (difficulty: GameSettingsType["difficulty"]) => {
    setLocalSettings((prev) => {
      const newSettings = { ...prev, difficulty };

      // 난이도에 따른 기본값 설정
      switch (difficulty) {
        case "easy":
          newSettings.timeLimit = 600; // 10분
          newSettings.moduleCount = 2;
          break;
        case "medium":
          newSettings.timeLimit = 300; // 5분
          newSettings.moduleCount = 3;
          break;
        case "hard":
          newSettings.timeLimit = 180; // 3분
          newSettings.moduleCount = 4;
          break;
      }

      return newSettings;
    });
  };

  const handleTimeLimitChange = (minutes: number, seconds: number) => {
    const totalSeconds = minutes * 60 + seconds;
    setLocalSettings((prev) => ({ ...prev, timeLimit: totalSeconds }));
  };

  const handleModuleCountChange = (count: number) => {
    setLocalSettings((prev) => ({ ...prev, moduleCount: count }));
  };

  const handleShowCluesChange = (showClues: boolean) => {
    setLocalSettings((prev) => ({ ...prev, showClues }));
  };

  const handleTeamChange = (teamName: string) => {
    setLocalSettings((prev) => ({ ...prev, selectedTeam: teamName }));
  };

  const handleStartGame = () => {
    if (!localSettings.selectedTeam) {
      alert("팀을 선택해주세요!");
      return;
    }
    onStartGame(localSettings);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return { minutes, seconds: remainingSeconds };
  };

  const { minutes, seconds } = formatTime(localSettings.timeLimit);

  return (
    <div className="game-settings">
      <h2>폭탄 해제 게임 설정</h2>

      <div className="setting-section">
        <h3>팀 선택</h3>
        <div className="team-selection">
          {teams.map((team: any) => (
            <button
              key={team.name}
              className={`team-btn ${localSettings.selectedTeam === team.name ? "active" : ""}`}
              onClick={() => handleTeamChange(team.name)}
            >
              <span className="team-name">{team.name}</span>
              <span className="team-score">현재 점수: {team.score}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="setting-section">
        <h3>난이도 선택</h3>
        <div className="difficulty-options">
          <button
            className={`difficulty-btn ${localSettings.difficulty === "easy" ? "active" : ""}`}
            onClick={() => handleDifficultyChange("easy")}
          >
            쉬움
          </button>
          <button
            className={`difficulty-btn ${localSettings.difficulty === "medium" ? "active" : ""}`}
            onClick={() => handleDifficultyChange("medium")}
          >
            보통
          </button>
          <button
            className={`difficulty-btn ${localSettings.difficulty === "hard" ? "active" : ""}`}
            onClick={() => handleDifficultyChange("hard")}
          >
            어려움
          </button>
        </div>
      </div>

      <div className="setting-section">
        <h3>제한 시간</h3>
        <div className="time-input">
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => handleTimeLimitChange(parseInt(e.target.value) || 0, seconds)}
          />
          <span>분</span>
          <input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => handleTimeLimitChange(minutes, parseInt(e.target.value) || 0)}
          />
          <span>초</span>
        </div>
        <p>총 시간: {localSettings.timeLimit}초</p>
      </div>

      <div className="setting-section">
        <h3>단서 표시</h3>
        <div className="clue-option">
          <label className="clue-toggle">
            <input
              type="checkbox"
              checked={localSettings.showClues}
              onChange={(e) => handleShowCluesChange(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">
              {localSettings.showClues ? "단서 표시" : "단서 숨김"}
            </span>
          </label>
          <p className="clue-description">
            {localSettings.showClues
              ? "게임 시작 시 기본 단서가 표시됩니다."
              : "게임 시작 시 단서 없이 시작됩니다."}
          </p>
        </div>
      </div>

      <div className="setting-summary">
        <h3>설정 요약</h3>
        <p>팀: {localSettings.selectedTeam || "선택되지 않음"}</p>
        <p>난이도: {localSettings.difficulty}</p>
        <p>
          제한 시간: {minutes}분 {seconds}초
        </p>
        <p>단서: {localSettings.showClues ? "표시" : "숨김"}</p>
        <div className="score-info">
          <h4>점수 시스템</h4>
          <p>쉬움: 300점 / 보통: 500점 / 어려움: 700점</p>
          <p>힌트 사용 시 -50점씩 차감</p>
        </div>
      </div>

      <button
        className="start-game-btn"
        onClick={handleStartGame}
        disabled={!localSettings.selectedTeam}
      >
        {!localSettings.selectedTeam ? "팀을 선택하세요" : "게임 시작"}
      </button>
    </div>
  );
};

export default GameSettings;
