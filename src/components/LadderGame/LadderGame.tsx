import React, { useState } from "react";
import { useScore } from "../../contexts/ScoreContext";
import LadderSettings from "./LadderSettings";
import LadderPlay from "./LadderPlay";
import LadderResult from "./LadderResult";
import "../../css/ladderGame.css";

export interface TeamMember {
  id: string;
  name: string;
  score: number;
}

export interface LadderSettings {
  team1Members: TeamMember[];
  team2Members: TeamMember[];
  ladderCount: number;
  scores: number[];
}

export type GameState = "settings" | "playing" | "result";

const LadderGame: React.FC = () => {
  const { teams, updateTeamScore } = useScore();
  const [gameState, setGameState] = useState<GameState>("settings");
  const [settings, setSettings] = useState<LadderSettings>({
    team1Members: [],
    team2Members: [],
    ladderCount: 3,
    scores: [100, 200, 300],
  });
  const [currentPlayer, setCurrentPlayer] = useState<TeamMember | null>(null);
  const [gameResult, setGameResult] = useState<{ player: TeamMember; score: number } | null>(null);

  const startGame = (newSettings: LadderSettings) => {
    setSettings(newSettings);
    // 모든 팀원을 합쳐서 순서대로 플레이
    const allMembers = [...newSettings.team1Members, ...newSettings.team2Members];
    setCurrentPlayer(allMembers[0]);
    setGameState("playing");
  };

  const handleLadderResult = (score: number) => {
    if (!currentPlayer) return;

    const result = { player: currentPlayer, score };
    setGameResult(result);

    // 팀 점수에 반영 (현재 플레이어가 어느 팀인지 확인)
    const allMembers = [...settings.team1Members, ...settings.team2Members];
    const currentIndex = allMembers.findIndex((member) => member.id === currentPlayer?.id);
    const isTeam1 = currentIndex < settings.team1Members.length;
    const team = teams[isTeam1 ? 0 : 1];
    if (team) {
      updateTeamScore(team.id, score);
    }

    setGameState("result");
  };

  const nextPlayer = () => {
    const allMembers = [...settings.team1Members, ...settings.team2Members];
    const currentIndex = allMembers.findIndex((member) => member.id === currentPlayer?.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < allMembers.length) {
      setCurrentPlayer(allMembers[nextIndex]);
      setGameResult(null);
      setGameState("playing");
    } else {
      // 모든 팀원이 완료
      setGameState("settings");
      setCurrentPlayer(null);
      setGameResult(null);
    }
  };

  const restartGame = () => {
    setGameState("settings");
    setCurrentPlayer(null);
    setGameResult(null);
  };

  return (
    <div className="ladder-game">
      {gameState === "settings" && (
        <LadderSettings teams={teams} settings={settings} onStartGame={startGame} />
      )}

      {gameState === "playing" && currentPlayer && (
        <LadderPlay
          currentPlayer={currentPlayer}
          ladderCount={settings.ladderCount}
          scores={settings.scores}
          onResult={handleLadderResult}
        />
      )}

      {gameState === "result" && gameResult && (
        <LadderResult
          result={gameResult}
          onNextPlayer={nextPlayer}
          onRestart={restartGame}
          isLastPlayer={
            settings.teamMembers.findIndex((m) => m.id === currentPlayer?.id) ===
            settings.teamMembers.length - 1
          }
        />
      )}
    </div>
  );
};

export default LadderGame;
