import React, { useState, useEffect } from "react";

interface NumberPadModuleProps {
  moduleId: string;
  difficulty: "easy" | "medium" | "hard";
  status: "waiting" | "success" | "failed";
  onSuccess: () => void;
  onFail: () => void;
  showClues: boolean;
  onAddHintPenalty: (penalty: number) => void;
}

const NumberPadModule: React.FC<NumberPadModuleProps> = ({
  moduleId,
  difficulty,
  status,
  onSuccess,
  onFail,
  showClues,
  onAddHintPenalty,
}) => {
  const [targetNumber, setTargetNumber] = useState<string>("");
  const [currentInput, setCurrentInput] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [maxAttempts, setMaxAttempts] = useState<number>(3);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintCount, setHintCount] = useState<number>(0);
  const [maxHints, setMaxHints] = useState<number>(2);
  const [showClue, setShowClue] = useState<boolean>(true);

  useEffect(() => {
    if (status === "waiting") {
      generateTargetNumber();
      setCurrentInput("");
      setAttempts(0);
      setShowHint(false);
      setHintCount(0);
      setShowClue(showClues);
    }
  }, [difficulty, status, showClues]);

  const generateTargetNumber = () => {
    let digits: number;
    switch (difficulty) {
      case "easy":
        digits = 3;
        setMaxAttempts(5);
        setMaxHints(3);
        break;
      case "medium":
        digits = 4;
        setMaxAttempts(4);
        setMaxHints(2);
        break;
      case "hard":
        digits = 4;
        setMaxAttempts(3);
        setMaxHints(1);
        break;
      default:
        digits = 3;
        setMaxAttempts(3);
        setMaxHints(2);
    }

    const number = Math.floor(Math.random() * Math.pow(10, digits));
    setTargetNumber(number.toString().padStart(digits, "0"));
  };

  const handleNumberInput = (num: string) => {
    if (status !== "waiting") return;

    if (currentInput.length < targetNumber.length) {
      const newInput = currentInput + num;
      setCurrentInput(newInput);

      if (newInput.length === targetNumber.length) {
        checkAnswer(newInput);
      }
    }
  };

  const handleClear = () => {
    if (status === "waiting") {
      setCurrentInput("");
    }
  };

  const handleDelete = () => {
    if (status === "waiting") {
      setCurrentInput((prev) => prev.slice(0, -1));
    }
  };

  const handleShowHint = () => {
    if (status === "waiting" && hintCount < maxHints) {
      setShowHint(true);
      setHintCount((prev) => prev + 1);
      onAddHintPenalty(50); // 힌트 사용 시 50점 차감
      setTimeout(() => setShowHint(false), 3000);
    }
  };

  const getHintText = () => {
    if (!targetNumber) return "";

    const hints = [
      `첫 번째 숫자는 ${targetNumber[0]}입니다.`,
      `마지막 숫자는 ${targetNumber[targetNumber.length - 1]}입니다.`,
      `숫자의 합은 ${targetNumber.split("").reduce((sum, num) => sum + parseInt(num), 0)}입니다.`,
      `가장 큰 숫자는 ${Math.max(...targetNumber.split("").map(Number))}입니다.`,
      `가장 작은 숫자는 ${Math.min(...targetNumber.split("").map(Number))}입니다.`,
    ];

    return hints[hintCount - 1] || hints[0];
  };

  const getClueText = () => {
    if (!targetNumber) return "";

    const clues = [
      `이 숫자는 ${targetNumber.length}자리입니다.`,
      `이 숫자는 ${targetNumber.length}자리이며, ${targetNumber[0]}로 시작합니다.`,
      `이 숫자는 ${targetNumber.length}자리이며, ${targetNumber[0]}로 시작하고 ${
        targetNumber[targetNumber.length - 1]
      }로 끝납니다.`,
    ];

    return clues[difficulty === "easy" ? 0 : difficulty === "medium" ? 1 : 2];
  };

  const checkAnswer = (input: string) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (input === targetNumber) {
      onSuccess();
    } else if (newAttempts >= maxAttempts) {
      onFail();
    } else {
      setCurrentInput("");
    }
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
    <div className={`number-pad-module ${getStatusClass()}`}>
      <h4>숫자 패드 모드</h4>

      <div className="module-info">
        <p>난이도: {difficulty}</p>
        <p>
          시도: {attempts}/{maxAttempts}
        </p>
        <p>
          힌트: {hintCount}/{maxHints}
        </p>
      </div>

      <div className="display-section">
        <div className="target-display">목표: {status === "waiting" ? "?" : targetNumber}</div>
        <div className="input-display">입력: {currentInput.padEnd(targetNumber.length, "_")}</div>
      </div>

      {showClue && status === "waiting" && (
        <div className="clue-section">
          <p className="clue-text">💡 단서: {getClueText()}</p>
          <button onClick={() => setShowClue(false)} className="hide-clue-btn">
            단서 숨기기
          </button>
        </div>
      )}

      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberInput(num.toString())}
            disabled={status !== "waiting"}
            className="number-btn"
          >
            {num}
          </button>
        ))}
      </div>

      <div className="control-buttons">
        <button onClick={handleClear} disabled={status !== "waiting"} className="control-btn clear">
          지우기
        </button>
        <button
          onClick={handleDelete}
          disabled={status !== "waiting"}
          className="control-btn delete"
        >
          삭제
        </button>
        <button
          onClick={handleShowHint}
          disabled={status !== "waiting" || hintCount >= maxHints}
          className="control-btn hint"
        >
          💡 힌트
        </button>
      </div>

      {showHint && (
        <div className="hint-section">
          <p className="hint-text">{getHintText()}</p>
        </div>
      )}

      <div className="module-status">
        {status === "success" && <span className="status-success">✅ 해제 완료</span>}
        {status === "failed" && <span className="status-failed">❌ 해제 실패</span>}
        {status === "waiting" && <span className="status-waiting">⏳ 해제 중...</span>}
      </div>
    </div>
  );
};

export default NumberPadModule;
