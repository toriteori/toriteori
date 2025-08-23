import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameSettings from "./SimpleGameSettings";
import GamePlay from "./GamePlay";
import GameResult from "./GameResult";
import { useScore } from "../../contexts/ScoreContext";
import { GameState, Choice } from "../../types/form";
import "../../css/teamBattleGame.css";
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
    navigate("/main");
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
