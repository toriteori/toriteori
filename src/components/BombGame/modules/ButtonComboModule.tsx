import React, { useState, useEffect } from "react";

interface ButtonComboModuleProps {
  moduleId: string;
  difficulty: "easy" | "medium" | "hard";
  status: "waiting" | "success" | "failed";
  onSuccess: () => void;
  onFail: () => void;
  showClues: boolean;
  onAddHintPenalty: (penalty: number) => void;
}

const ButtonComboModule: React.FC<ButtonComboModuleProps> = ({
  moduleId,
  difficulty,
  status,
  onSuccess,
  onFail,
  showClues,
  onAddHintPenalty,
}) => {
  const [targetSequence, setTargetSequence] = useState<number[]>([]);
  const [currentSequence, setCurrentSequence] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<number>(0);
  const [maxAttempts, setMaxAttempts] = useState<number>(3);
  const [showSequence, setShowSequence] = useState<boolean>(false);
  const [hintCount, setHintCount] = useState<number>(0);
  const [maxHints, setMaxHints] = useState<number>(2);
  const [showClue, setShowClue] = useState<boolean>(true);

  useEffect(() => {
    if (status === "waiting") {
      generateTargetSequence();
      setCurrentSequence([]);
      setAttempts(0);
      setHintCount(0);
      setShowClue(showClues);

      // 게임 시작 시 순서를 빠르게 보여줌
      setTimeout(() => {
        setShowSequence(true);
        setTimeout(() => setShowSequence(false), 1000); // 1초간 표시
      }, 500);
    }
  }, [difficulty, status, showClues]);

  const generateTargetSequence = () => {
    let sequenceLength: number;
    switch (difficulty) {
      case "easy":
        sequenceLength = 3;
        setMaxAttempts(5);
        setMaxHints(3);
        break;
      case "medium":
        sequenceLength = 4;
        setMaxAttempts(4);
        setMaxHints(2);
        break;
      case "hard":
        sequenceLength = 5;
        setMaxAttempts(3);
        setMaxHints(1);
        break;
      default:
        sequenceLength = 3;
        setMaxAttempts(3);
        setMaxHints(2);
    }

    const sequence = [];
    for (let i = 0; i < sequenceLength; i++) {
      sequence.push(Math.floor(Math.random() * 4) + 1);
    }
    setTargetSequence(sequence);
  };

  const showTargetSequence = () => {
    if (status !== "waiting") return;

    setShowSequence(true);
    setTimeout(() => {
      setShowSequence(false);
    }, 2000);
  };

  const handleButtonClick = (buttonNumber: number) => {
    if (status !== "waiting" || showSequence) return;

    const newSequence = [...currentSequence, buttonNumber];
    setCurrentSequence(newSequence);

    if (newSequence.length === targetSequence.length) {
      checkSequence(newSequence);
    }
  };

  const checkSequence = (sequence: number[]) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const isCorrect = sequence.every((num, index) => num === targetSequence[index]);

    if (isCorrect) {
      onSuccess();
    } else if (newAttempts >= maxAttempts) {
      onFail();
    } else {
      setCurrentSequence([]);
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

  const getButtonColor = (buttonNumber: number) => {
    const colors = ["red", "blue", "green", "yellow"];
    return colors[buttonNumber - 1];
  };

  const handleShowHint = () => {
    if (status === "waiting" && hintCount < maxHints) {
      setHintCount((prev) => prev + 1);
      onAddHintPenalty(50); // 힌트 사용 시 50점 차감
      // 힌트로 첫 번째 숫자 보여주기
      setShowSequence(true);
      setTimeout(() => setShowSequence(false), 2000);
    }
  };

  const getHintText = () => {
    if (!targetSequence.length) return "";

    const hints = [
      `첫 번째 버튼은 ${targetSequence[0]}번입니다.`,
      `마지막 버튼은 ${targetSequence[targetSequence.length - 1]}번입니다.`,
      `순서에 ${targetSequence[0]}이(가) ${
        targetSequence.filter((num) => num === targetSequence[0]).length
      }번 나옵니다.`,
      `가장 많이 나오는 숫자는 ${Math.max(
        ...[1, 2, 3, 4].map((num) => targetSequence.filter((n) => n === num).length),
      )}번입니다.`,
    ];

    return hints[hintCount - 1] || hints[0];
  };

  const getClueText = () => {
    if (!targetSequence.length) return "";

    const clues = [
      `순서는 ${targetSequence.length}개 버튼으로 구성되어 있습니다.`,
      `순서는 ${targetSequence.length}개이며, ${targetSequence[0]}번으로 시작합니다.`,
      `순서는 ${targetSequence.length}개이며, ${targetSequence[0]}번으로 시작하고 ${
        targetSequence[targetSequence.length - 1]
      }번으로 끝납니다.`,
    ];

    return clues[difficulty === "easy" ? 0 : difficulty === "medium" ? 1 : 2];
  };

  return (
    <div className={`button-combo-module ${getStatusClass()}`}>
      <h4>버튼 조합 모듈</h4>

      <div className="module-info">
        <p>난이도: {difficulty}</p>
        <p>
          시도: {attempts}/{maxAttempts}
        </p>
        <p>순서 길이: {targetSequence.length}</p>
        <p>
          힌트: {hintCount}/{maxHints}
        </p>
      </div>

      <div className="sequence-display">
        <div className="sequence-buttons">
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

        {showSequence && (
          <div className="target-sequence">
            {targetSequence.map((num, index) => (
              <div
                key={index}
                className={`sequence-button ${getButtonColor(num)}`}
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                {num}
              </div>
            ))}
          </div>
        )}

        {hintCount > 0 && (
          <div className="hint-section">
            <p className="hint-text">{getHintText()}</p>
          </div>
        )}
      </div>

      <div className="current-sequence">
        <p>입력한 순서:</p>
        <div className="sequence-display">
          {currentSequence.map((num, index) => (
            <div key={index} className={`sequence-button ${getButtonColor(num)}`}>
              {num}
            </div>
          ))}
        </div>
      </div>

      <div className="button-grid">
        {[1, 2, 3, 4].map((num) => (
          <button
            key={num}
            onClick={() => handleButtonClick(num)}
            disabled={status !== "waiting" || showSequence}
            className={`combo-btn ${getButtonColor(num)}`}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="module-status">
        {status === "success" && <span className="status-success">✅ 해제 완료</span>}
        {status === "failed" && <span className="status-failed">❌ 해제 실패</span>}
        {status === "waiting" && <span className="status-waiting">⏳ 해제 중...</span>}
      </div>
    </div>
  );
};

export default ButtonComboModule;
