import React from "react";
import { GameState } from "./TeamBattleGame";
import { useScore } from "../../contexts/ScoreContext";

interface GameResultProps {
  gameState: GameState;
  onReset: () => void;
}

const GameResult: React.FC<GameResultProps> = ({ gameState, onReset }) => {
  const { teams } = useScore();
  const { teamAName, teamBName, teamAScore, teamBScore, gameHistory } = gameState;

  const getWinner = () => {
    if (teamAScore > teamBScore) {
      return { winner: teamAName, loser: teamBName, isDraw: false };
    } else if (teamBScore > teamAScore) {
      return { winner: teamBName, loser: teamAName, isDraw: false };
    } else {
      return { winner: "", loser: "", isDraw: true };
    }
  };

  const { winner, loser, isDraw } = getWinner();

  const getResultMessage = () => {
    if (isDraw) {
      return "무승부!";
    } else {
      return `${winner} 팀의 승리!`;
    }
  };

  const getResultClass = () => {
    if (isDraw) return "result-draw";
    return teamAScore > teamBScore ? "result-team-a" : "result-team-b";
  };

  return (
    <div className="game-result">
      <div className={`result-header ${getResultClass()}`}>
        <h1>게임 결과</h1>
        <div className="final-result">
          <h2>{getResultMessage()}</h2>
        </div>
      </div>

      <div className="final-scores">
        <div className="final-score-card team-a">
          <h3>{teamAName} 팀</h3>
          <div className="final-score">{teamAScore}점</div>
        </div>
        <div className="final-score-card team-b">
          <h3>{teamBName} 팀</h3>
          <div className="final-score">{teamBScore}점</div>
        </div>
      </div>

      <div className="game-summary">
        <h3>게임 요약</h3>
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-label">총 라운드:</span>
            <span className="stat-value">{gameHistory.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">최고 점수:</span>
            <span className="stat-value">{Math.max(teamAScore, teamBScore)}점</span>
          </div>
          <div className="stat">
            <span className="stat-label">점수 차이:</span>
            <span className="stat-value">{Math.abs(teamAScore - teamBScore)}점</span>
          </div>
        </div>
      </div>

      <div className="result-actions">
        <button className="reset-button" onClick={onReset}>
          메인으로 가기
        </button>
      </div>

      <div className="result-message">
        {isDraw ? (
          <p>두 팀 모두 훌륭한 모험을 완료했습니다! 다시 한번 도전해보세요.</p>
        ) : (
          <p>축하합니다! {winner} 팀이 전설의 유물을 찾는 모험에서 승리했습니다!</p>
        )}
      </div>
    </div>
  );
};

export default GameResult;
