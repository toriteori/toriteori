import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameSettings from "./GameSettings";
import GamePlay from "./GamePlay";
import GameResult from "./GameResult";
import { useScore } from "../../contexts/ScoreContext";
import "../../css/teamBattleGame.css";

export interface GameState {
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
  currentNode: string;
  teamANode: string; // 팀별 노드 추가
  teamBNode: string; // 팀별 노드 추가
  teamAChoice: string | null;
  teamBChoice: string | null;
  gameHistory: Array<{
    node: string;
    teamAChoice: string | null;
    teamBChoice: string | null;
    teamAScore: number;
    teamBScore: number;
  }>;
}

export type GamePhase = "settings" | "playing" | "result";

const TeamBattleGame: React.FC = () => {
  const { teams } = useScore();
  const navigate = useNavigate();
  const [gamePhase, setGamePhase] = useState<GamePhase>("settings");
  const [gameState, setGameState] = useState<GameState>({
    teamAName: "",
    teamBName: "",
    teamAScore: 0,
    teamBScore: 0,
    currentNode: "start",
    teamANode: "start",
    teamBNode: "start",
    teamAChoice: null,
    teamBChoice: null,
    gameHistory: [],
  });

  // 메인 화면의 팀 데이터로 초기화
  useEffect(() => {
    if (teams.length >= 2) {
      setGameState((prev) => ({
        ...prev,
        teamAName: teams[0].name,
        teamBName: teams[1].name,
      }));
    }
  }, [teams]);

  const startGame = (teamAName: string, teamBName: string) => {
    setGameState({
      teamAName,
      teamBName,
      teamAScore: 0,
      teamBScore: 0,
      currentNode: "start",
      teamANode: "start",
      teamBNode: "start",
      teamAChoice: null,
      teamBChoice: null,
      gameHistory: [],
    });
    setGamePhase("playing");
  };

  const endGame = () => {
    setGamePhase("result");
  };

  const resetGame = () => {
    navigate("/");
  };

  return (
    <div className="team-battle-game">
      {gamePhase === "settings" && <GameSettings onStart={startGame} />}
      {gamePhase === "playing" && (
        <GamePlay gameState={gameState} setGameState={setGameState} onEndGame={endGame} />
      )}
      {gamePhase === "result" && <GameResult gameState={gameState} onReset={resetGame} />}
    </div>
  );
};

export default TeamBattleGame;
