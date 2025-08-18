import React, { useState, useEffect } from "react";

interface EntryPageProps {
  onEnter: () => void;
}

const EntryPage: React.FC<EntryPageProps> = ({ onEnter }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 애니메이션 시작
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 모든 애니메이션이 완료된 후 클릭 가능하도록 설정
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (isReady) {
      onEnter();
    }
  };

  return (
    <div className="entry-page">
      <div className="entry-container">
        <div className={`title-container ${isVisible ? "visible" : ""}`}>
          <h1 className="main-title">🎮</h1>
          <h2 className="sub-title">오락실 입장중...</h2>
        </div>

        <div className={`loading-container ${isVisible ? "visible" : ""}`}>
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <p className="loading-text">게임 시스템 초기화 중...</p>
        </div>

        <div className={`enter-button-container ${isReady ? "ready" : ""}`}>
          <button
            className={`enter-button ${isReady ? "ready" : ""}`}
            onClick={handleClick}
            disabled={!isReady}
          >
            🎯 게임 시작!
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
