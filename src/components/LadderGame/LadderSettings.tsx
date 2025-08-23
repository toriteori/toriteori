import React, { useState } from "react";
import type { LadderSettings, TeamMember } from "./LadderGame";

interface LadderSettingsProps {
  teams: any[];
  settings: LadderSettings;
  onStartGame: (settings: LadderSettings) => void;
}

const LadderSettings: React.FC<LadderSettingsProps> = ({ teams, settings, onStartGame }) => {
  const [localSettings, setLocalSettings] = useState<LadderSettings>(settings);
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [currentTeam, setCurrentTeam] = useState<number>(1); // 1 또는 2

  const handleLadderCountChange = (count: number) => {
    const newScores = Array.from({ length: count }, (_, i) => {
      const baseScore = 100 * (i + 1);
      return baseScore + Math.floor(Math.random() * 200);
    });
    setLocalSettings((prev) => ({ ...prev, ladderCount: count, scores: newScores }));
  };

  const addTeamMember = () => {
    if (!newMemberName.trim()) return;

    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: newMemberName.trim(),
      score: 0,
    };

    if (currentTeam === 1) {
      setLocalSettings((prev) => ({
        ...prev,
        team1Members: [...prev.team1Members, newMember],
      }));
    } else {
      setLocalSettings((prev) => ({
        ...prev,
        team2Members: [...prev.team2Members, newMember],
      }));
    }
    setNewMemberName("");
  };

  const removeTeamMember = (memberId: string, teamNumber: number) => {
    if (teamNumber === 1) {
      setLocalSettings((prev) => ({
        ...prev,
        team1Members: prev.team1Members.filter((member) => member.id !== memberId),
      }));
    } else {
      setLocalSettings((prev) => ({
        ...prev,
        team2Members: prev.team2Members.filter((member) => member.id !== memberId),
      }));
    }
  };

  const handleStartGame = () => {
    if (localSettings.team1Members.length === 0 && localSettings.team2Members.length === 0) {
      alert("최소 한 팀에 팀원을 추가해주세요!");
      return;
    }
    onStartGame(localSettings);
  };

  return (
    <div className="ladder-settings">
      <h2>🎯 사다리 타기 게임</h2>

      <div className="setting-section">
        <h3>팀원 등록</h3>

        <div className="team-tabs">
          <button
            className={`team-tab ${currentTeam === 1 ? "active" : ""}`}
            onClick={() => setCurrentTeam(1)}
          >
            {teams[0]?.name || "팀 1"}
          </button>
          <button
            className={`team-tab ${currentTeam === 2 ? "active" : ""}`}
            onClick={() => setCurrentTeam(2)}
          >
            {teams[1]?.name || "팀 2"}
          </button>
        </div>

        <div className="member-input">
          <input
            type="text"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            placeholder={`${
              teams[currentTeam - 1]?.name || `팀 ${currentTeam}`
            } 팀원 이름을 입력하세요`}
            onKeyPress={(e) => e.key === "Enter" && addTeamMember()}
          />
          <button onClick={addTeamMember} className="add-member-btn">
            추가
          </button>
        </div>

        <div className="teams-container">
          <div className="team-members">
            <h4>
              {teams[0]?.name || "팀 1"} ({localSettings.team1Members.length}명)
            </h4>
            <div className="member-list">
              {localSettings.team1Members.map((member) => (
                <div key={member.id} className="member-item">
                  <span className="member-name">{member.name}</span>
                  <button
                    onClick={() => removeTeamMember(member.id, 1)}
                    className="remove-member-btn"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="team-members">
            <h4>
              {teams[1]?.name || "팀 2"} ({localSettings.team2Members.length}명)
            </h4>
            <div className="member-list">
              {localSettings.team2Members.map((member) => (
                <div key={member.id} className="member-item">
                  <span className="member-name">{member.name}</span>
                  <button
                    onClick={() => removeTeamMember(member.id, 2)}
                    className="remove-member-btn"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="setting-section">
        <h3>사다리 개수</h3>
        <div className="ladder-count-input">
          <input
            type="range"
            min="3"
            max="6"
            value={localSettings.ladderCount}
            onChange={(e) => handleLadderCountChange(parseInt(e.target.value))}
          />
          <span>{localSettings.ladderCount}개</span>
        </div>

        <div className="score-preview">
          <h4>점수 배치</h4>
          <div className="score-list">
            {localSettings.scores.map((score, index) => (
              <span key={index} className="score-item">
                {score}점
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="setting-summary">
        <h3>설정 요약</h3>
        <p>
          {teams[0]?.name || "팀 1"}: {localSettings.team1Members.length}명
        </p>
        <p>
          {teams[1]?.name || "팀 2"}: {localSettings.team2Members.length}명
        </p>
        <p>사다리 개수: {localSettings.ladderCount}개</p>
        <div className="game-info">
          <h4>게임 규칙</h4>
          <p>• 두 팀의 팀원들이 순서대로 사다리를 탑니다</p>
          <p>• 각 사다리 끝에는 점수가 배치되어 있습니다</p>
          <p>• 획득한 점수는 해당 팀 총점에 반영됩니다</p>
        </div>
      </div>

      <button
        className="start-game-btn"
        onClick={handleStartGame}
        disabled={
          localSettings.team1Members.length === 0 && localSettings.team2Members.length === 0
        }
      >
        {localSettings.team1Members.length === 0 && localSettings.team2Members.length === 0
          ? "팀원을 추가하세요"
          : "게임 시작"}
      </button>
    </div>
  );
};

export default LadderSettings;
