import React, { useState, useEffect } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  skipable?: boolean;
}

const TypingText: React.FC<TypingTextProps> = ({
  text,
  speed = 50,
  onComplete,
  className = "",
  skipable = true,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // 텍스트가 변경되면 초기화
  useEffect(() => {
    if (text && text.length > 0) {
      setDisplayedText("");
      setCurrentIndex(0);
      setIsTyping(true);
    }
  }, [text]);

  // 타이핑 효과
  useEffect(() => {
    if (!isTyping || !text) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, isTyping, text, speed, onComplete]);

  // 스킵 함수
  const skipTyping = () => {
    if (skipable && isTyping) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      setIsTyping(false);
      if (onComplete) {
        onComplete();
      }
    }
  };

  // 전역 스킵 이벤트 리스너
  useEffect(() => {
    const handleGlobalSkip = () => {
      skipTyping();
    };

    // 커스텀 이벤트 리스너 추가
    window.addEventListener('skip-typing', handleGlobalSkip);
    
    return () => {
      window.removeEventListener('skip-typing', handleGlobalSkip);
    };
  }, [skipable, isTyping, text, onComplete]);

  return (
    <div className={`typing-text ${className}`}>
      <span style={{ whiteSpace: "pre-line" }}>{displayedText}</span>
      {isTyping && <span className="typing-cursor">|</span>}
    </div>
  );
};

export default TypingText;
