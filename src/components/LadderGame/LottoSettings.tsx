import React, { useState } from "react";
import { LottoSettings, TeamMember } from "./LottoGame";

interface LottoSettingsProps {
  teams: Array<{ id: string; name: string; score: number; color: string }>;
  settings: LottoSettings;
  onStartGame: (settings: LottoSettings) => void;
}

const LottoSettingsComponent: React.FC<LottoSettingsProps> = ({
  teams,
  settings,
  onStartGame,
}) => {
  const [team1Members, setTeam1Members] = useState<TeamMember[]>(settings.team1Members);
  const [team2Members, setTeam2Members] = useState<TeamMember[]>(settings.team2Members);
  const [newMemberName, setNewMemberName] = useState("");
  const [currentTeam, setCurrentTeam] = useState<1 | 2>(1);

  const addMember = () => {
    if (!newMemberName.trim()) return;

    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: newMemberName.trim(),
      score: 0,
    };

    if (currentTeam === 1) {
      setTeam1Members([...team1Members, newMember]);
    } else {
      setTeam2Members([...team2Members, newMember]);
    }

    setNewMemberName("");
  };

  const removeMember = (memberId: string, team: 1 | 2) => {
    if (team === 1) {
      setTeam1Members(team1Members.filter((m) => m.id !== memberId));
    } else {
      setTeam2Members(team2Members.filter((m) => m.id !== memberId));
    }
  };

  const handleStartGame = () => {
    const totalMembers = team1Members.length + team2Members.length;
    if (totalMembers < 2) {
      alert("최소 2명의 플레이어가 필요합니다.");
      return;
    }

    if (team1Members.length === 0 || team2Members.length === 0) {
      alert("각 팀에 최소 1명씩은 있어야 합니다.");
      return;
    }

    onStartGame({
      team1Members,
      team2Members,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addMember();
    }
  };

  return (
    <div className="lotto-settings">
      <div className="settings-header">
        <h1>🎰 로또 당첨 게임</h1>
        <p className="game-description">
          각 플레이어가 일반번호 1~10 중 6개 + 보너스 1~10 중 1개를 선택하세요!<br />
          실제 로또처럼 겹쳐도 됩니다. 맞춘 개수에 따라 점수를 획득합니다.<br />
          <strong>⚠️ 번호 수정 시 50점 차감, 1인당 1회만 가능!</strong>
        </p>
      </div>

      <div className="prize-info">
        <h3>🏆 당첨 등급</h3>
        <div className="prize-header">
          <span>등급</span>
          <span>점수</span>
          <span>확률</span>
        </div>
                    <div className="prize-table">
              <div className="prize-row first">
                <span className="rank">🥇 1등 (6개 맞춤)</span>
                <span className="points">1000점</span>
                <span className="probability">0.48%</span>
              </div>
              <div className="prize-row second">
                <span className="rank">🥈 2등 (5개 + 보너스)</span>
                <span className="points">500점</span>
                <span className="probability">2.86%</span>
              </div>
              <div className="prize-row third">
                <span className="rank">🥉 3등 (5개 맞춤)</span>
                <span className="points">300점</span>
                <span className="probability">25.71%</span>
              </div>
              <div className="prize-row fourth">
                <span className="rank">🏆 4등 (4개 맞춤)</span>
                <span className="points">150점</span>
                <span className="probability">35.71%</span>
              </div>
              <div className="prize-row fifth">
                <span className="rank">🎖️ 5등 (3개 맞춤)</span>
                <span className="points">100점</span>
                <span className="probability">23.81%</span>
              </div>
              <div className="prize-row sixth">
                <span className="rank">🎗️ 6등 (2개 맞춤)</span>
                <span className="points">70점</span>
                <span className="probability">8.57%</span>
              </div>
              <div className="prize-row seventh">
                <span className="rank">🏅 7등 (1개 맞춤)</span>
                <span className="points">50점</span>
                <span className="probability">2.38%</span>
              </div>
              <div className="prize-row eighth">
                <span className="rank">🎁 8등 (0개 맞춤)</span>
                <span className="points">30점</span>
                <span className="probability">0.48%</span>
              </div>
            </div>
      </div>

      <div className="team-setup">
        <div className="team-tabs">
          <button
            className={`team-tab ${currentTeam === 1 ? "active" : ""}`}
            style={{ backgroundColor: currentTeam === 1 ? teams[0]?.color : "#f0f0f0" }}
            onClick={() => setCurrentTeam(1)}
          >
            {teams[0]?.name || "팀 1"} ({team1Members.length}명)
          </button>
          <button
            className={`team-tab ${currentTeam === 2 ? "active" : ""}`}
            style={{ backgroundColor: currentTeam === 2 ? teams[1]?.color : "#f0f0f0" }}
            onClick={() => setCurrentTeam(2)}
          >
            {teams[1]?.name || "팀 2"} ({team2Members.length}명)
          </button>
        </div>

        <div className="member-input">
          <input
            type="text"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`${
              teams[currentTeam - 1]?.name || `팀 ${currentTeam}`
            } 팀원 이름을 입력해주세요.`}
            maxLength={10}
          />
          <button onClick={addMember} className="add-btn">
            ➕ 추가
          </button>
        </div>

        <div className="members-list">
          {currentTeam === 1 &&
            team1Members.map((member) => (
              <div key={member.id} className="member-item">
                <span className="member-name">{member.name}</span>
                <button
                  onClick={() => removeMember(member.id, 1)}
                  className="remove-btn"
                >
                  ✖️
                </button>
              </div>
            ))}
          {currentTeam === 2 &&
            team2Members.map((member) => (
              <div key={member.id} className="member-item">
                <span className="member-name">{member.name}</span>
                <button
                  onClick={() => removeMember(member.id, 2)}
                  className="remove-btn"
                >
                  ✖️
                </button>
              </div>
            ))}
        </div>
      </div>

      <div className="game-summary">
        <h3>📊 게임 요약</h3>
        <div className="summary-info">
          <div className="summary-item">
            <span className="label">{teams[0]?.name || "팀 1"}:</span>
            <span className="value">{team1Members.length}명</span>
          </div>
          <div className="summary-item">
            <span className="label">{teams[1]?.name || "팀 2"}:</span>
            <span className="value">{team2Members.length}명</span>
          </div>
          <div className="summary-item total">
            <span className="label">총 플레이어:</span>
            <span className="value">{team1Members.length + team2Members.length}명</span>
          </div>
        </div>
      </div>

      <div className="start-section">
        <button
          onClick={handleStartGame}
          className="start-game-btn"
          disabled={team1Members.length === 0 || team2Members.length === 0}
        >
          🎲 게임 시작하기
        </button>
      </div>
    </div>
  );
};

export default LottoSettingsComponent;
