import React from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

function Home() {
  return (
    <div className="page">
      <div className="page-content">
        <h1>🏠 홈페이지</h1>
        <p>React 공부를 위한 메인 페이지입니다!</p>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>📚 학습하기</h3>
            <p>React 기초부터 고급까지 단계별로 학습해보세요</p>
            <Link to="/study" className="btn">
              학습 시작
            </Link>
          </div>

          <div className="feature-card">
            <h3>🧪 실험하기</h3>
            <p>다양한 React 기능들을 직접 실험해보세요</p>
            <Link to="/experiment" className="btn">
              실험하기
            </Link>
          </div>

          <div className="feature-card">
            <h3>📝 공고 등록</h3>
            <p>HTML을 React로 변환한 폼 예제를 확인해보세요</p>
            <Link to="/notification-form" className="btn">
              폼 보기
            </Link>
          </div>

          <div className="feature-card">
            <h3>🎵 음악 게임</h3>
            <p>개인용 음악 맞추기 게임을 즐겨보세요</p>
            <Link to="/music-game" className="btn">
              게임 시작
            </Link>
          </div>
        </div>

        <div className="quick-start">
          <h3>🚀 빠른 시작</h3>
          <p>지금 바로 React 컴포넌트를 만들어보세요!</p>
          <Link to="/study" className="btn btn-primary">
            시작하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
