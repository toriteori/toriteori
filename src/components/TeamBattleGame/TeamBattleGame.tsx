import React, { useState } from "react";
import SimpleStoryGame from "./SimpleStoryGame";
import DualTeamGame from "./DualTeamGame";
import "../../css/teamBattleGame.css";
import "../../css/dualTeamGame.css";

const TeamBattleGame: React.FC = () => {
  const [gameMode, setGameMode] = useState<"select" | "single" | "dual">("select");

  // 모드 선택 화면
  if (gameMode === "select") {
    return (
      <div className="team-battle-game">
        <div className="mode-selection">
          <div className="mode-header">
            <h1>🎮 게임 모드 선택</h1>
            <p>어떤 방식으로 플레이하시겠습니까?</p>
          </div>

          <div className="mode-options">
            <div className="mode-card" onClick={() => setGameMode("single")}>
              <div className="mode-icon">👤</div>
              <h3>싱글 플레이</h3>
              <p>혼자서 스토리를 체험하고 최고 점수에 도전해보세요</p>
              <div className="mode-features">
                <span>✨ 몰입감 있는 스토리</span>
                <span>🎯 개인 기록 도전</span>
                <span>📖 자신만의 속도로</span>
              </div>
            </div>

            <div className="mode-card" onClick={() => setGameMode("dual")}>
              <div className="mode-icon">👥</div>
              <h3>팀 대전</h3>
              <p>두 팀이 동시에 플레이하여 더 높은 점수를 겨뤄보세요</p>
              <div className="mode-features">
                <span>⚔️ 실시간 경쟁</span>
                <span>🏆 팀 협력 필요</span>
                <span>🔥 짜릿한 대결</span>
              </div>
            </div>
          </div>

          <button className="back-button" onClick={() => window.history.back()}>
            ← 뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  // 선택된 모드에 따라 게임 렌더링
  if (gameMode === "single") {
    return (
      <div className="team-battle-game">
        <SimpleStoryGame />
      </div>
    );
  }

  if (gameMode === "dual") {
    return (
      <div className="team-battle-game">
        <DualTeamGame />
      </div>
    );
  }

  return null;
};

export default TeamBattleGame;
