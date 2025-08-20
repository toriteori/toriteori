import React from "react";

interface GameResultProps {
  isSuccess: boolean;
  onRestart: () => void;
  totalScore: number;
  hintPenalty: number;
}

const GameResult: React.FC<GameResultProps> = ({
  isSuccess,
  onRestart,
  totalScore,
  hintPenalty,
}) => {
  return (
    <div className="game-result">
      <div className={`result-content ${isSuccess ? "success" : "failed"}`}>
        <h2>{isSuccess ? "🎉 폭탄 해제 성공!" : "💥 폭탄 폭발!"}</h2>

        <div className="result-message">
          {isSuccess ? (
            <p>모든 모듈을 성공적으로 해제했습니다!</p>
          ) : (
            <p>시간이 부족하거나 모듈 해제에 실패했습니다.</p>
          )}
        </div>

        <div className="final-score-display">
          <h3>최종 점수</h3>
          <div className="score-breakdown">
            <p>
              획득 점수: <span className="score-earned">{totalScore}</span>
            </p>
            <p>
              힌트 패널티: <span className="score-penalty">-{hintPenalty}</span>
            </p>
            <p className="final-score">
              최종 점수: <span className="score-final">{totalScore - hintPenalty}</span>
            </p>
          </div>
        </div>

        <div className="result-actions">
          <button className="restart-btn" onClick={onRestart}>
            다시 시작
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
