import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { worldInfo, storyMap, StoryNode, StoryChoice } from "../../data/storyData";

interface GameProgress {
  currentNodeId: string;
  score: number;
  visitedNodes: string[];
  hiddenFlags: number; // 손성모 히든 플래그
  trustLevel: number; // 동료 신뢰도
  alliances: string[]; // 맺은 동맹 목록
}

const SimpleStoryGame: React.FC = () => {
  const navigate = useNavigate();

  const [progress, setProgress] = useState<GameProgress>({
    currentNodeId: "start",
    score: 0,
    visitedNodes: [],
    hiddenFlags: 0,
    trustLevel: 0,
    alliances: [],
  });

  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [showScoreChange, setShowScoreChange] = useState(false);
  const [scoreChange, setScoreChange] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [typingInterval, setTypingInterval] = useState<number | null>(null);
  const [scoreTimeout, setScoreTimeout] = useState<number | null>(null);

  // 현재 노드 업데이트
  useEffect(() => {
    if (gameStarted) {
      const node = storyMap.get(progress.currentNodeId);
      if (node) {
        setCurrentNode(node);
        setDisplayedText("");
        setIsTyping(true);
        setShowChoices(false);

        // 타이핑 효과 시작
        startTypingEffect(node.text);
      }
    }
  }, [progress.currentNodeId, gameStarted]);

  // 컴포넌트 언마운트 시 인터벌 정리
  useEffect(() => {
    return () => {
      if (typingInterval) {
        clearInterval(typingInterval);
      }
      if (scoreTimeout) {
        clearTimeout(scoreTimeout);
      }
    };
  }, [typingInterval, scoreTimeout]);

  // 타이핑 효과
  const startTypingEffect = (text: string) => {
    let index = 0;
    setDisplayedText("");

    // 이전 인터벌이 있다면 클리어
    if (typingInterval) {
      clearInterval(typingInterval);
    }

    const newInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(newInterval);
        setTypingInterval(null);
        setIsTyping(false);
        setTimeout(() => {
          setShowChoices(true);
        }, 200); // 선택지 표시 대기시간 (500ms → 200ms로 단축)
      }
    }, 15); // 타이핑 속도 (30ms → 15ms로 2배 빠르게)

    setTypingInterval(newInterval);
  };

  // 텍스트 포맷팅 (가독성 개선)
  const formatStoryText = (text: string) => {
    return text.split("\n\n").map((paragraph, index) => (
      <p key={index} className="story-paragraph">
        {paragraph}
      </p>
    ));
  };

  // 타이핑 중에도 문단 구분 적용
  const formatTypingText = (text: string) => {
    const paragraphs = text.split("\n\n");
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="story-paragraph">
        {paragraph}
      </p>
    ));
  };

  // 타이핑 스킵
  const skipTyping = () => {
    if (currentNode && isTyping && typingInterval) {
      // 타이핑 인터벌 중지
      clearInterval(typingInterval);
      setTypingInterval(null);

      // 전체 텍스트 표시
      setDisplayedText(currentNode.text);
      setIsTyping(false);
      // 즉시 선택지 표시 (딜레이 없음)
      setShowChoices(true);
    }
  };

  // 점수 표시 스킵
  const skipScoreChange = () => {
    if (showScoreChange && scoreTimeout) {
      // 현재 진행중인 timeout 중지
      clearTimeout(scoreTimeout);
      setScoreTimeout(null);
      setShowScoreChange(false);

      // 즉시 다음 노드로 이동
      const nextNodeId = sessionStorage.getItem("nextNodeId");
      const newScore = parseInt(sessionStorage.getItem("newScore") || "0");
      const newVisitedNodes = JSON.parse(sessionStorage.getItem("newVisitedNodes") || "[]");
      const newHiddenFlags = parseInt(sessionStorage.getItem("newHiddenFlags") || "0");
      const newTrustLevel = parseInt(sessionStorage.getItem("newTrustLevel") || "0");
      const newAlliances = JSON.parse(sessionStorage.getItem("newAlliances") || "[]");

      if (nextNodeId) {
        setProgress({
          currentNodeId: nextNodeId,
          score: newScore,
          visitedNodes: newVisitedNodes,
          hiddenFlags: newHiddenFlags,
          trustLevel: newTrustLevel,
          alliances: newAlliances,
        });

        // 임시 저장된 데이터 정리
        sessionStorage.removeItem("nextNodeId");
        sessionStorage.removeItem("newScore");
        sessionStorage.removeItem("newVisitedNodes");
        sessionStorage.removeItem("newHiddenFlags");
        sessionStorage.removeItem("newTrustLevel");
        sessionStorage.removeItem("newAlliances");
      }
    }
  };

  // 선택지 선택
  const handleChoice = (choice: StoryChoice) => {
    const newScore = progress.score + choice.score;
    const newVisitedNodes = [...progress.visitedNodes, progress.currentNodeId];
    const newHiddenFlags = progress.hiddenFlags + (choice.hidden || 0);
    const newTrustLevel = progress.trustLevel + (choice.trust || 0);
    const newAlliances = choice.alliance
      ? [...progress.alliances, progress.currentNodeId]
      : progress.alliances;

    // 점수 변화 표시
    setScoreChange(choice.score);
    setShowScoreChange(true);
    setShowChoices(false);

    // 다음 노드 정보를 임시 저장 (스킵 기능용)
    sessionStorage.setItem("nextNodeId", choice.next);
    sessionStorage.setItem("newScore", newScore.toString());
    sessionStorage.setItem("newVisitedNodes", JSON.stringify(newVisitedNodes));
    sessionStorage.setItem("newHiddenFlags", newHiddenFlags.toString());
    sessionStorage.setItem("newTrustLevel", newTrustLevel.toString());
    sessionStorage.setItem("newAlliances", JSON.stringify(newAlliances));

    // 점수 변화 애니메이션 후 다음 노드로 이동
    const timeout = setTimeout(() => {
      setShowScoreChange(false);
      setProgress({
        currentNodeId: choice.next,
        score: newScore,
        visitedNodes: newVisitedNodes,
        hiddenFlags: newHiddenFlags,
        trustLevel: newTrustLevel,
        alliances: newAlliances,
      });

      // 임시 저장된 데이터 정리
      sessionStorage.removeItem("nextNodeId");
      sessionStorage.removeItem("newScore");
      sessionStorage.removeItem("newVisitedNodes");
      sessionStorage.removeItem("newHiddenFlags");
      sessionStorage.removeItem("newTrustLevel");
      sessionStorage.removeItem("newAlliances");
      setScoreTimeout(null);
    }, 800); // 점수 표시 시간 (2000ms → 800ms로 대폭 단축)

    setScoreTimeout(timeout);
  };

  // 게임 종료
  const endGame = () => {
    navigate("/");
  };

  // 게임 시작
  const startGame = () => {
    setGameStarted(true);
  };

  // 게임 재시작
  const restartGame = () => {
    setProgress({
      currentNodeId: "start",
      score: 0,
      visitedNodes: [],
      hiddenFlags: 0,
      trustLevel: 0,
      alliances: [],
    });
    setGameStarted(true);
  };

  // 게임 시작 전 소개 페이지
  if (!gameStarted) {
    return (
      <div className="story-game">
        <div className="game-intro">
          <div className="intro-header">
            <h1>{worldInfo.title}</h1>
            <p className="intro-subtitle">{worldInfo.description}</p>
          </div>

          <div className="intro-content">
            <div className="world-info">
              <h2>🌍 {worldInfo.world.name} 대륙</h2>
              <p>{worldInfo.world.description}</p>
            </div>

            <div className="game-features">
              <h3>🎮 게임 특징</h3>
              <div className="features-grid">
                <div className="feature">
                  <span className="feature-icon">📖</span>
                  <h4>선택형 스토리</h4>
                  <p>당신의 선택이 이야기의 흐름을 결정합니다</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">⚡</span>
                  <h4>점수 시스템</h4>
                  <p>선택에 따라 점수가 변화하며 최종 결과에 영향을 줍니다</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">🏘️</span>
                  <h4>아렌델 마을</h4>
                  <p>모험의 시작점, 중요한 정보와 동료를 만날 수 있는 곳</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔮</span>
                  <h4>시간의 계단</h4>
                  <p>9개 마을을 거쳐 최종 목적지 시간의 계단에 도달하세요</p>
                </div>
              </div>
            </div>

            <div className="game-tips">
              <h3>💡 게임 팁</h3>
              <ul>
                <li>📱 텍스트를 클릭하면 타이핑 효과를 건너뛸 수 있습니다</li>
                <li>🤔 신중하게 선택하세요 - 모든 선택에는 결과가 따릅니다</li>
                <li>🎯 때로는 감점이 될 수도 있으니 주의하세요</li>
                <li>🏆 최종 점수에 따라 다양한 엔딩을 경험할 수 있습니다</li>
              </ul>
            </div>

            <div className="start-button-container">
              <button className="start-game-button" onClick={startGame}>
                🚀 모험 시작하기
              </button>
              <button className="back-button" onClick={endGame}>
                🏠 메인으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentNode) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="story-game">
      {/* 헤더 */}
      <div className="game-header">
        <h1>{worldInfo.title}</h1>
      </div>

      {/* 메인 스토리 */}
      <div className="story-content">
        <div className="story-text" onClick={skipTyping}>
          {isTyping ? (
            <>
              {formatTypingText(displayedText)}
              <span className="typing-cursor">|</span>
            </>
          ) : (
            formatStoryText(displayedText)
          )}
        </div>

        {/* 게임 종료 */}
        {showChoices && currentNode.isEnding && (
          <div className="ending-container">
            <h2>🎉 게임 완료!</h2>
            <p>최종 점수: {progress.score}</p>
            <div className="ending-buttons">
              <button className="restart-button" onClick={restartGame}>
                다시 시작
              </button>
              <button className="exit-button" onClick={endGame}>
                메인으로
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 점수 변화 플로팅 버튼 */}
      {showScoreChange && (
        <div className="score-floating-button" onClick={skipScoreChange}>
          <div
            className={`score-indicator ${
              scoreChange > 0 ? "positive" : scoreChange < 0 ? "negative" : "neutral"
            }`}
            title="클릭하면 빠르게 넘어갑니다"
          ></div>
        </div>
      )}

      {/* 선택지 팝업 - 컨테이너 밖에 위치 */}
      {showChoices && !currentNode.isEnding && (
        <div className="choice-popup-overlay">
          <div className="choice-popup">
            <h3>선택하세요</h3>
            <div className="choice-buttons">
              {currentNode.choices.map((choice, index) => (
                <button
                  key={index}
                  className="choice-popup-button"
                  onClick={() => handleChoice(choice)}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleStoryGame;
