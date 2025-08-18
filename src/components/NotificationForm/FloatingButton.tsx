import React from "react";
import "./NotificationForm.css";

const FloatingButton: React.FC = () => {
  const handleConsultationClick = (): void => {
    // 고객상담 로직
    alert("고객상담 서비스로 연결됩니다.");
  };

  return (
    <div className="floatingBtn">
      <button type="button" onClick={handleConsultationClick}>
        <span>고객상담</span>
      </button>
    </div>
  );
};

export default FloatingButton;
