import React, { useState, useEffect } from "react";
import type { TeamMember } from "./LadderGame";

interface LadderPlayProps {
  currentPlayer: TeamMember;
  ladderCount: number;
  scores: number[];
  onResult: (score: number) => void;
}

interface LadderPath {
  start: number;
  end: number;
  path: number[];
}

const LadderPlay: React.FC<LadderPlayProps> = ({
  currentPlayer,
  ladderCount,
  scores,
  onResult,
}) => {
  const [selectedLadder, setSelectedLadder] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationPath, setAnimationPath] = useState<number[]>([]);
  const [ladderPaths, setLadderPaths] = useState<LadderPath[]>([]);

  // 사다리 경로 생성
  useEffect(() => {
    generateLadderPaths();
  }, [ladderCount]);

  const generateLadderPaths = () => {
    const paths: LadderPath[] = [];
    const usedEnds = new Set<number>();

    for (let i = 0; i < ladderCount; i++) {
      let end: number;
      do {
        end = Math.floor(Math.random() * ladderCount);
      } while (usedEnds.has(end));
      usedEnds.add(end);

      // 실제 사다리처럼 수직선과 수평선으로 구성
      const path = [i];

      // 수직으로 내려가다가 수평으로 이동하는 패턴
      const steps = 5; // 더 많은 단계로 부드럽게
      for (let j = 1; j < steps; j++) {
        const progress = j / steps;

        if (j % 2 === 1) {
          // 수직 이동 (위치 유지)
          path.push(i);
        } else {
          // 수평 이동 (목표로 향해 이동)
          const startPos = i;
          const endPos = end;
          const currentPos = startPos + (endPos - startPos) * progress;
          // 약간의 랜덤성으로 자연스럽게
          const randomOffset = (Math.random() - 0.5) * 0.2;
          path.push(Math.max(0, Math.min(ladderCount - 1, currentPos + randomOffset)));
        }
      }
      path.push(end);

      paths.push({
        start: i,
        end: end,
        path: path,
      });
    }

    setLadderPaths(paths);
  };

  const handleLadderClick = (ladderIndex: number) => {
    if (isAnimating || selectedLadder !== null) return;

    setSelectedLadder(ladderIndex);
    setIsAnimating(true);

    // 애니메이션 경로 찾기
    const path = ladderPaths.find((p) => p.start === ladderIndex);
    if (path) {
      animatePath(path.path);
    }
  };

  const animatePath = (path: number[]) => {
    let currentStep = 0;

    const animation = setInterval(() => {
      if (currentStep < path.length) {
        setAnimationPath(path.slice(0, currentStep + 1));
        currentStep++;
      } else {
        clearInterval(animation);

        // 결과 계산
        const endIndex = Math.round(path[path.length - 1]);
        const score = scores[endIndex] || 0;

        setTimeout(() => {
          onResult(score);
        }, 1000);
      }
    }, 200);
  };

  const renderLadder = () => {
    const ladderElements = [];

    // 시작점 (클릭 가능한 사다리)
    for (let i = 0; i < ladderCount; i++) {
      ladderElements.push(
        <div key={`start-${i}`} className="ladder-start">
          <button
            className={`ladder-btn ${selectedLadder === i ? "selected" : ""}`}
            onClick={() => handleLadderClick(i)}
            disabled={isAnimating || selectedLadder !== null}
          >
            {i + 1}
          </button>
        </div>,
      );
    }

    // 사다리 선들
    ladderPaths.forEach((path, index) => {
      const pathElements = [];
      for (let i = 0; i < path.path.length - 1; i++) {
        const current = path.path[i];
        const next = path.path[i + 1];
        const isActive =
          selectedLadder === path.start &&
          animationPath.length > i &&
          animationPath.includes(current);

        const startX = (current / (ladderCount - 1)) * 100;
        const endX = (next / (ladderCount - 1)) * 100;
        const top = (i / 4) * 100;

        // 수직선인지 수평선인지 판단
        const isVertical = Math.abs(endX - startX) < 5; // 거의 같은 X 위치면 수직선

        if (isVertical) {
          // 수직선
          pathElements.push(
            <div
              key={`path-${index}-${i}`}
              className={`ladder-line vertical ${isActive ? "active" : ""}`}
              style={{
                left: `${startX}%`,
                top: `${top}%`,
                width: "4px",
                height: "20px",
                background: isActive ? "#ffd700" : "rgba(255, 255, 255, 0.3)",
                position: "absolute",
                borderRadius: "2px",
                transition: "all 0.3s ease",
              }}
            />,
          );
        } else {
          // 수평선
          const width = Math.abs(endX - startX);
          const left = Math.min(startX, endX);
          pathElements.push(
            <div
              key={`path-${index}-${i}`}
              className={`ladder-line horizontal ${isActive ? "active" : ""}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                height: "4px",
                background: isActive ? "#ffd700" : "rgba(255, 255, 255, 0.3)",
                position: "absolute",
                borderRadius: "2px",
                transition: "all 0.3s ease",
              }}
            />,
          );
        }
      }
      ladderElements.push(...pathElements);
    });

    // 끝점 (점수)
    for (let i = 0; i < ladderCount; i++) {
      ladderElements.push(
        <div key={`end-${i}`} className="ladder-end">
          <div className="score-display">{scores[i]}점</div>
        </div>,
      );
    }

    return ladderElements;
  };

  return (
    <div className="ladder-play">
      <div className="game-header">
        <h2>🎯 사다리 타기</h2>
        <div className="player-info">
          <h3>현재 플레이어: {currentPlayer.name}</h3>
          <p>사다리를 선택해서 타보세요!</p>
        </div>
      </div>

      <div className="ladder-container">
        <div className="ladder-grid">{renderLadder()}</div>
      </div>

      <div className="game-instructions">
        <p>• 원하는 사다리를 클릭하세요</p>
        <p>• 사다리를 타고 도착한 점수를 획득합니다</p>
      </div>
    </div>
  );
};

export default LadderPlay;
