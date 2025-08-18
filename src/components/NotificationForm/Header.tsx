import React from "react";
import "./NotificationForm.css";

const Header: React.FC = () => {
  const handleBackClick = (): void => {
    // 뒤로가기 로직
    window.history.back();
  };

  return (
    <header className="headerComu">
      <div className="headerWrap">
        <div>
          <button type="button" className="backBtn" onClick={handleBackClick}>
            뒤로가기
          </button>
          <h1 className="a11y-hidden">공고 등록</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
