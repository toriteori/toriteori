import React, { useEffect, useState } from "react";
import type { GameSettings, Module } from "./BombGame";
import NumberPadModule from "./modules/NumberPadModule";
import ButtonComboModule from "./modules/ButtonComboModule";
import CableConnectModule from "./modules/CableConnectModule";

interface GamePlayProps {
  settings: GameSettings;
  modules: Module[];
  timeLeft: number;
  setTimeLeft: (time: number) => void;
  onUpdateModuleStatus: (moduleId: string, status: "success" | "failed") => void;
  onCheckGameResult: () => void;
  totalScore: number;
  hintPenalty: number;
  onAddHintPenalty: (penalty: number) => void;
}

const GamePlay: React.FC<GamePlayProps> = ({
  settings,
  modules,
  timeLeft,
  setTimeLeft,
  onUpdateModuleStatus,
  onCheckGameResult,
  totalScore,
  hintPenalty,
  onAddHintPenalty,
}) => {
  const [isGameActive, setIsGameActive] = useState(true);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);

  // 타이머 효과
  useEffect(() => {
    if (!isGameActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setIsGameActive(false);
          onCheckGameResult();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, timeLeft, setTimeLeft, onCheckGameResult]);

  // 모듈 상태 변경 감지
  useEffect(() => {
    onCheckGameResult();
  }, [modules, onCheckGameResult]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getModuleComponent = (module: Module) => {
    const commonProps = {
      key: module.id,
      moduleId: module.id,
      difficulty: module.difficulty,
      status: module.status,
      onSuccess: () => {
        onUpdateModuleStatus(module.id, "success");
        // 다음 모듈로 이동
        if (currentModuleIndex < modules.length - 1) {
          setCurrentModuleIndex(currentModuleIndex + 1);
        }
      },
      onFail: () => onUpdateModuleStatus(module.id, "failed"),
      showClues: settings.showClues,
      onAddHintPenalty,
    };

    switch (module.type) {
      case "numberPad":
        return <NumberPadModule {...commonProps} />;
      case "buttonCombo":
        return <ButtonComboModule {...commonProps} />;
      case "cableConnect":
        return <CableConnectModule {...commonProps} />;
      default:
        return <div>알 수 없는 모듈</div>;
    }
  };

  const currentModule = modules[currentModuleIndex];
  const moduleNames = {
    numberPad: "숫자 패드",
    buttonCombo: "버튼 조합",
    cableConnect: "케이블 해제",
  };

  const getStatusColor = () => {
    if (timeLeft <= 30) return "red";
    if (timeLeft <= 60) return "orange";
    return "green";
  };

  return (
    <div className="game-play">
      <div className="game-header">
        <h2>폭탄 해제 게임</h2>
        <div className="game-info">
          <div className="difficulty">난이도: {settings.difficulty}</div>
          <div className="module-progress">
            모듈 {currentModuleIndex + 1}/{modules.length}
          </div>
          <div className="score-display">
            <span className="score">점수: {totalScore}</span>
            <span className="penalty">패널티: -{hintPenalty}</span>
            <span className="final-score">최종: {totalScore - hintPenalty}</span>
          </div>
        </div>
      </div>

      <div className="timer-section">
        <div className="timer" style={{ color: getStatusColor() }}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
        </div>
      </div>

      <div className="current-module-header">
        <h3>{moduleNames[currentModule.type as keyof typeof moduleNames]}</h3>
        <div className="module-status">
          상태: <span className={`status-${currentModule.status}`}>{currentModule.status}</span>
        </div>
      </div>

      <div className="current-module-container">{getModuleComponent(currentModule)}</div>
    </div>
  );
};

export default GamePlay;
