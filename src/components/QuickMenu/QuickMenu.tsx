import React, { useState } from "react";

interface QuickMenuButton {
  id: string;
  icon: string;
  title: string;
  onClick: () => void;
  color?: string;
}

interface QuickMenuProps {
  buttons: QuickMenuButton[];
}

const QuickMenu: React.FC<QuickMenuProps> = ({ buttons }) => {
  const [showQuickMenu, setShowQuickMenu] = useState<boolean>(false);

  const toggleQuickMenu = () => {
    setShowQuickMenu(!showQuickMenu);
  };

  return (
    <div className="quick-menu-container">
      {/* 메인 퀵버튼 */}
      <button onClick={toggleQuickMenu} className="quick-menu-main-btn">
        ⚙️
      </button>

      {/* 퀵메뉴 옵션들 */}
      <div className={`quick-menu-options ${showQuickMenu ? "show" : ""}`}>
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => {
              button.onClick();
              setShowQuickMenu(false); // 버튼 클릭 후 메뉴 닫기
            }}
            className={`quick-menu-btn ${button.color ? `btn-${button.color}` : ""}`}
            title={button.title}
          >
            {button.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickMenu;
