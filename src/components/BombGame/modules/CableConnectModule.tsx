import React, { useState, useEffect } from "react";

interface CableConnectModuleProps {
  moduleId: string;
  difficulty: "easy" | "medium" | "hard";
  status: "waiting" | "success" | "failed";
  onSuccess: () => void;
  onFail: () => void;
  showClues: boolean;
  onAddHintPenalty: (penalty: number) => void;
}

interface Cable {
  id: number;
  color: string;
  isDisconnected: boolean;
  order: number; // 해제 순서
}

const CableConnectModule: React.FC<CableConnectModuleProps> = ({
  moduleId,
  difficulty,
  status,
  onSuccess,
  onFail,
  showClues,
  onAddHintPenalty,
}) => {
  const [cables, setCables] = useState<Cable[]>([]);
  const [currentOrder, setCurrentOrder] = useState<number>(1);
  const [attempts, setAttempts] = useState<number>(0);
  const [maxAttempts, setMaxAttempts] = useState<number>(3);
  const [hintCount, setHintCount] = useState<number>(0);
  const [maxHints, setMaxHints] = useState<number>(2);
  const [showClue, setShowClue] = useState<boolean>(true);

  const colors = ["red", "blue", "green", "yellow", "purple", "orange"];

  useEffect(() => {
    if (status === "waiting") {
      generateCables();
      setCurrentOrder(1);
      setAttempts(0);
      setHintCount(0);
      setShowClue(showClues);
    }
  }, [difficulty, status, showClues]);

  const generateCables = () => {
    let cableCount: number;
    switch (difficulty) {
      case "easy":
        cableCount = 3;
        setMaxAttempts(5);
        setMaxHints(3);
        break;
      case "medium":
        cableCount = 4;
        setMaxAttempts(4);
        setMaxHints(2);
        break;
      case "hard":
        cableCount = 5;
        setMaxAttempts(3);
        setMaxHints(1);
        break;
      default:
        cableCount = 3;
        setMaxAttempts(3);
        setMaxHints(2);
    }

    const newCables: Cable[] = [];
    const orders = Array.from({ length: cableCount }, (_, i) => i + 1);

    // 순서를 랜덤하게 섞기
    for (let i = orders.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [orders[i], orders[j]] = [orders[j], orders[i]];
    }

    for (let i = 0; i < cableCount; i++) {
      newCables.push({
        id: i,
        color: colors[i],
        isDisconnected: false,
        order: orders[i],
      });
    }

    setCables(newCables);
  };

  const handleCableClick = (cableId: number) => {
    if (status !== "waiting") return;

    const cable = cables.find((c) => c.id === cableId);
    if (!cable || cable.isDisconnected) return;

    // 올바른 순서인지 확인
    if (cable.order === currentOrder) {
      setCables((prev) => prev.map((c) => (c.id === cableId ? { ...c, isDisconnected: true } : c)));
      setCurrentOrder((prev) => prev + 1);

      // 모든 케이블이 해제되었는지 확인
      if (currentOrder >= cables.length) {
        onSuccess();
      }
    } else {
      // 잘못된 순서로 클릭
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        onFail();
      }
    }
  };

  const handleShowHint = () => {
    if (status === "waiting" && hintCount < maxHints) {
      setHintCount((prev) => prev + 1);
      onAddHintPenalty(50); // 힌트 사용 시 50점 차감
    }
  };

  const getHintText = () => {
    if (!cables.length) return "";

    const currentCable = cables.find((c) => c.order === currentOrder);
    const hints = [
      `현재 해제해야 할 케이블은 ${currentCable?.color}색입니다.`,
      `다음 순서는 ${currentOrder + 1}번째입니다.`,
      `마지막 케이블은 ${cables.find((c) => c.order === cables.length)?.color}색입니다.`,
      `총 ${cables.length}개의 케이블을 순서대로 해제하세요.`,
      `잘못된 순서로 클릭하면 시도 횟수가 차감됩니다.`,
    ];

    return hints[hintCount - 1] || hints[0];
  };

  const getClueText = () => {
    if (!cables.length) return "";

    const currentCable = cables.find((c) => c.order === currentOrder);
    const clues = [
      `총 ${cables.length}개의 케이블을 순서대로 해제하세요.`,
      `총 ${cables.length}개의 케이블이며, 첫 번째는 ${currentCable?.color}색입니다.`,
      `총 ${cables.length}개의 케이블이며, 첫 번째는 ${currentCable?.color}색이고 마지막은 ${
        cables.find((c) => c.order === cables.length)?.color
      }색입니다.`,
    ];

    return clues[difficulty === "easy" ? 0 : difficulty === "medium" ? 1 : 2];
  };

  const getStatusClass = () => {
    switch (status) {
      case "success":
        return "module-success";
      case "failed":
        return "module-failed";
      default:
        return "module-waiting";
    }
  };

  return (
    <div className={`cable-connect-module ${getStatusClass()}`}>
      <h4>케이블 해제 모듈</h4>

      <div className="module-info">
        <p>난이도: {difficulty}</p>
        <p>
          시도: {attempts}/{maxAttempts}
        </p>
        <p>케이블: {cables.length}개</p>
        <p>
          힌트: {hintCount}/{maxHints}
        </p>
        <p>
          현재 순서: {currentOrder}/{cables.length}
        </p>
      </div>

      <div className="cable-instructions">
        <p>케이블을 순서대로 해제하세요!</p>
        <button
          onClick={handleShowHint}
          disabled={status !== "waiting" || hintCount >= maxHints}
          className="hint-btn"
        >
          💡 힌트
        </button>
      </div>

      {showClue && status === "waiting" && (
        <div className="clue-section">
          <p className="clue-text">💡 단서: {getClueText()}</p>
          <button onClick={() => setShowClue(false)} className="hide-clue-btn">
            단서 숨기기
          </button>
        </div>
      )}

      {hintCount > 0 && (
        <div className="hint-section">
          <p className="hint-text">{getHintText()}</p>
        </div>
      )}

      <div className="cable-grid">
        <div className="cable-positions">
          {cables.map((cable) => (
            <div key={`start-${cable.id}`} className="cable-position start">
              <div
                className={`cable-end ${cable.color} ${
                  cable.isDisconnected ? "disconnected" : ""
                } ${cable.order === currentOrder ? "current" : ""}`}
                onClick={() => handleCableClick(cable.id)}
              >
                {!cable.isDisconnected && cable.order}
              </div>
            </div>
          ))}
        </div>

        <div className="cable-connections">
          {cables.map((cable) => (
            <div key={`connection-${cable.id}`} className="cable-connection">
              <div
                className={`cable-line ${cable.color} ${
                  cable.isDisconnected ? "disconnected" : ""
                }`}
              />
            </div>
          ))}
        </div>

        <div className="cable-positions">
          {cables.map((cable) => (
            <div key={`end-${cable.id}`} className="cable-position end">
              <div
                className={`cable-end ${cable.color} ${
                  cable.isDisconnected ? "disconnected" : ""
                } ${cable.order === currentOrder ? "current" : ""}`}
                onClick={() => handleCableClick(cable.id)}
              >
                {!cable.isDisconnected && cable.order}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cable-status">
        <p>
          해제된 케이블: {cables.filter((c) => c.isDisconnected).length}/{cables.length}
        </p>
        <p>다음 순서: {currentOrder}</p>
      </div>

      <div className="module-status">
        {status === "success" && <span className="status-success">✅ 해제 완료</span>}
        {status === "failed" && <span className="status-failed">❌ 해제 실패</span>}
        {status === "waiting" && <span className="status-waiting">⏳ 해제 중...</span>}
      </div>
    </div>
  );
};

export default CableConnectModule;
