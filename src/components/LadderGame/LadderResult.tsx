import React from "react";
import type { TeamMember } from "./LadderGame";

interface LadderResultProps {
  result: {
    player: TeamMember;
    score: number;
  };
  onNextPlayer: () => void;
  onRestart: () => void;
  isLastPlayer: boolean;
}

const LadderResult: React.FC<LadderResultProps> = ({
  result,
  onNextPlayer,
  onRestart,
  isLastPlayer,
}) => {
  return (
    <div className="ladder-result">
      <div className="result-content">
        <h2>🎉 사다리 타기 결과!</h2>

        <div className="player-result">
          <div className="player-info">
            <h3>{result.player.name}</h3>
            <p>님이 획득한 점수</p>
          </div>

          <div className="score-display">
            <span className="score-number">{result.score}</span>
            <span className="score-unit">점</span>
          </div>

          <div className="score-message">
            {result.score >= 500 ? (
              <p className="high-score">🎊 대박! 높은 점수입니다!</p>
            ) : result.score >= 300 ? (
              <p className="good-score">👍 좋은 점수입니다!</p>
            ) : (
              <p className="normal-score">💪 다음에 더 좋은 점수를 노려보세요!</p>
            )}
          </div>
        </div>

        <div className="result-actions">
          {isLastPlayer ? (
            <button className="restart-btn" onClick={onRestart}>
              🏠 메인으로 돌아가기
            </button>
          ) : (
            <button className="next-player-btn" onClick={onNextPlayer}>
              👤 다음 플레이어
            </button>
          )}
        </div>

        <div className="game-summary">
          <h4>게임 요약</h4>
          <p>
            • {result.player.name}: {result.score}점 획득
          </p>
          <p>• 획득한 점수는 팀 총점에 반영됩니다</p>
          {isLastPlayer && <p>• 모든 팀원의 사다리 타기가 완료되었습니다</p>}
        </div>
      </div>
    </div>
  );
};

export default LadderResult;
