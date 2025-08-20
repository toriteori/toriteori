import React, { useState } from "react";
import { useScore } from "../../contexts/ScoreContext";
import GameSettings from "./GameSettings";
import GamePlay from "./GamePlay";
import GameResult from "./GameResult";
import "../../css/bombGame.css";

export interface GameSettings {
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number; // 초 단위
  moduleCount: number;
  showClues: boolean;
  selectedTeam: string;
}

export interface Module {
  id: string;
  type: "numberPad" | "buttonCombo" | "cableConnect";
  status: "waiting" | "success" | "failed";
  difficulty: "easy" | "medium" | "hard";
}

export type GameState = "settings" | "playing" | "success" | "failed";

const BombGame: React.FC = () => {
  const { teams, updateTeamScore } = useScore();
  const [gameState, setGameState] = useState<GameState>("settings");
  const [settings, setSettings] = useState<GameSettings>({
    difficulty: "medium",
    timeLimit: 300, // 5분
    moduleCount: 3,
    showClues: true,
    selectedTeam: "",
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [hintPenalty, setHintPenalty] = useState<number>(0);

  const startGame = (newSettings: GameSettings) => {
    setSettings(newSettings);
    setTimeLeft(newSettings.timeLimit);
    setTotalScore(0);
    setHintPenalty(0);

    // 모듈 생성 - 항상 3개 모듈, 중복 없이
    const moduleTypes: Module["type"][] = ["numberPad", "buttonCombo", "cableConnect"];
    const newModules: Module[] = [];

    for (let i = 0; i < 3; i++) {
      newModules.push({
        id: `module-${i}`,
        type: moduleTypes[i],
        status: "waiting",
        difficulty: newSettings.difficulty,
      });
    }

    setModules(newModules);
    setGameState("playing");
  };

  const updateModuleStatus = (moduleId: string, status: "success" | "failed") => {
    setModules((prev) =>
      prev.map((module) => (module.id === moduleId ? { ...module, status } : module)),
    );

    // 모듈 성공 시 점수 추가
    if (status === "success") {
      const baseScore =
        settings.difficulty === "easy" ? 300 : settings.difficulty === "medium" ? 500 : 700;
      setTotalScore((prev) => prev + baseScore);

      // 팀 점수에 반영
      if (settings.selectedTeam) {
        const baseScore =
          settings.difficulty === "easy" ? 300 : settings.difficulty === "medium" ? 500 : 700;
        // 팀 이름으로 팀 ID 찾기
        const team = teams.find((t) => t.name === settings.selectedTeam);
        if (team) {
          updateTeamScore(team.id, baseScore);
        }
      }
    }
  };

  const addHintPenalty = (penalty: number) => {
    setHintPenalty((prev) => prev + penalty);
  };

  const checkGameResult = () => {
    const allSuccess = modules.every((module) => module.status === "success");
    const anyFailed = modules.some((module) => module.status === "failed");

    if (allSuccess) {
      setGameState("success");
    } else if (anyFailed || timeLeft <= 0) {
      setGameState("failed");
    }
  };

  const restartGame = () => {
    setGameState("settings");
    setModules([]);
    setTimeLeft(0);
    setTotalScore(0);
    setHintPenalty(0);
  };

  return (
    <div className="bomb-game">
      {gameState === "settings" && <GameSettings settings={settings} onStartGame={startGame} />}

      {gameState === "playing" && (
        <GamePlay
          settings={settings}
          modules={modules}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          onUpdateModuleStatus={updateModuleStatus}
          onCheckGameResult={checkGameResult}
          totalScore={totalScore}
          hintPenalty={hintPenalty}
          onAddHintPenalty={addHintPenalty}
        />
      )}

      {(gameState === "success" || gameState === "failed") && (
        <GameResult isSuccess={gameState === "success"} onRestart={restartGame} />
      )}
    </div>
  );
};

export default BombGame;
