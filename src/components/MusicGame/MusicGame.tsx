import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Question {
  id: string;
  title: string;
  artist: string;
  file: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

const MusicGame: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const navigate = useNavigate();

  // 카테고리 데이터
  const categories: Category[] = [
    { id: "kpop", name: "K-POP", description: "한국 대중음악", icon: "🇰🇷", color: "#ff6b6b" },
    { id: "pop", name: "POP", description: "팝 음악", icon: "🎵", color: "#4ecdc4" },
    { id: "rock", name: "ROCK", description: "록 음악", icon: "🤘", color: "#45b7d1" },
    { id: "hiphop", name: "HIP-HOP", description: "힙합 음악", icon: "🎤", color: "#96ceb4" },
    { id: "jazz", name: "JAZZ", description: "재즈 음악", icon: "🎷", color: "#feca57" },
    {
      id: "classical",
      name: "CLASSICAL",
      description: "클래식 음악",
      icon: "🎻",
      color: "#ff9ff3",
    },
    {
      id: "electronic",
      name: "ELECTRONIC",
      description: "일렉트로닉",
      icon: "🎧",
      color: "#54a0ff",
    },
    { id: "r&b", name: "R&B", description: "리듬 앤 블루스", icon: "🎹", color: "#5f27cd" },
    { id: "country", name: "COUNTRY", description: "컨트리 음악", icon: "🎸", color: "#00d2d3" },
    { id: "indie", name: "INDIE", description: "인디 음악", icon: "🎼", color: "#ff6348" },
  ];

  // 샘플 문제 데이터 (실제로는 각 카테고리별로 10개씩)
  const questions: Question[] = [
    // K-POP 샘플
    {
      id: "kpop1",
      title: "샘플 K-POP 1",
      artist: "아티스트 1",
      file: "/music/kpop1.mp3",
      category: "kpop",
      difficulty: "easy",
    },
    {
      id: "kpop2",
      title: "샘플 K-POP 2",
      artist: "아티스트 2",
      file: "/music/kpop2.mp3",
      category: "kpop",
      difficulty: "medium",
    },
    // POP 샘플
    {
      id: "pop1",
      title: "샘플 POP 1",
      artist: "아티스트 3",
      file: "/music/pop1.mp3",
      category: "pop",
      difficulty: "easy",
    },
    {
      id: "pop2",
      title: "샘플 POP 2",
      artist: "아티스트 4",
      file: "/music/pop2.mp3",
      category: "pop",
      difficulty: "hard",
    },
    // 나머지 카테고리들도 비슷하게 추가...
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentQuestion(null);
    setUserAnswer("");
    setShowAnswer(false);
    setIsPlaying(false);
  };

  const handleBackToMain = () => {
    navigate("/main");
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setCurrentQuestion(null);
    setUserAnswer("");
    setShowAnswer(false);
    setIsPlaying(false);
  };

  const handleQuestionSelect = (question: Question) => {
    setCurrentQuestion(question);
    setUserAnswer("");
    setShowAnswer(false);
    setIsPlaying(false);
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion) return;

    const isCorrect =
      userAnswer.toLowerCase().includes(currentQuestion.title.toLowerCase()) ||
      userAnswer.toLowerCase().includes(currentQuestion.artist.toLowerCase());

    if (isCorrect) {
      setScore(score + 10);
      alert("정답입니다! 🎉");
    } else {
      alert(`틀렸습니다! 정답은 "${currentQuestion.title} - ${currentQuestion.artist}" 입니다.`);
    }

    setShowAnswer(true);
  };

  const getCategoryQuestions = (categoryId: string) => {
    return questions.filter((q) => q.category === categoryId);
  };

  const getCurrentCategory = () => {
    return categories.find((c) => c.id === selectedCategory);
  };

  // 카테고리 선택 화면
  if (!selectedCategory) {
    return (
      <div className="music-game">
        <div className="game-header">
          <div className="header-top">
            <button onClick={handleBackToMain} className="back-to-main-btn">
              ← 메인으로
            </button>
            <h1>🎵 음악 맞추기 게임</h1>
            <div className="score">점수: {score}점</div>
          </div>
          <p className="game-description">카테고리를 선택하고 음악을 맞춰보세요!</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategorySelect(category.id)}
              style={{ borderColor: category.color }}
            >
              <div className="category-icon" style={{ color: category.color }}>
                {category.icon}
              </div>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-description">{category.description}</p>
              <div className="question-count">{getCategoryQuestions(category.id).length}문제</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 문제 선택 화면
  if (selectedCategory && !currentQuestion) {
    const categoryQuestions = getCategoryQuestions(selectedCategory);
    const currentCategory = getCurrentCategory();

    return (
      <div className="music-game">
        <div className="game-header">
          <div className="header-top">
            <button onClick={handleBackToCategories} className="back-to-main-btn">
              ← 카테고리로
            </button>
            <h1>
              {currentCategory?.icon} {currentCategory?.name}
            </h1>
            <div className="score">점수: {score}점</div>
          </div>
          <p className="game-description">{currentCategory?.description} 문제를 선택하세요!</p>
        </div>

        <div className="questions-grid">
          {categoryQuestions.map((question, index) => (
            <div
              key={question.id}
              className={`question-card ${question.difficulty}`}
              onClick={() => handleQuestionSelect(question)}
            >
              <div className="question-number">#{index + 1}</div>
              <div className="question-info">
                <h3>{question.title}</h3>
                <p>{question.artist}</p>
              </div>
              <div className={`difficulty-badge ${question.difficulty}`}>
                {question.difficulty === "easy"
                  ? "쉬움"
                  : question.difficulty === "medium"
                  ? "보통"
                  : "어려움"}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 게임 플레이 화면
  return (
    <div className="music-game">
      <div className="game-header">
        <div className="header-top">
          <button onClick={handleBackToCategories} className="back-to-main-btn">
            ← 카테고리로
          </button>
          <h1>🎵 {currentQuestion?.title}</h1>
          <div className="score">점수: {score}점</div>
        </div>
      </div>

      <div className="game-area">
        <div className="question-info">
          <h3>음악을 듣고 제목과 아티스트를 맞춰보세요!</h3>
          <p>카테고리: {getCurrentCategory()?.name}</p>
        </div>

        <div className="audio-controls">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`btn ${isPlaying ? "btn-pause" : "btn-play"}`}
          >
            {isPlaying ? "⏸️ 정지" : "▶️ 재생"}
          </button>
        </div>

        <div className="answer-section">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="노래 제목 또는 아티스트 이름을 입력하세요"
            className="answer-input"
            disabled={showAnswer}
          />
          <button
            onClick={handleCheckAnswer}
            className="btn btn-check"
            disabled={showAnswer || !userAnswer.trim()}
          >
            정답 확인
          </button>
        </div>

        {showAnswer && currentQuestion && (
          <div className="correct-answer">
            <h4>
              정답: {currentQuestion.title} - {currentQuestion.artist}
            </h4>
            <button
              onClick={() => handleQuestionSelect(currentQuestion)}
              className="btn btn-primary"
            >
              다시 도전
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicGame;
