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
  difficulty: "very-easy" | "easy" | "medium" | "hard" | "very-hard";
  keyword: string;
  hint: string;
}

interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
}

const MusicGame: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentTeam, setCurrentTeam] = useState<string>("team1");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  // 팀 데이터
  const [teams, setTeams] = useState<Team[]>([
    { id: "team1", name: "팀 정지윤", score: 0, color: "#ff6b6b" },
    { id: "team2", name: "팀 한지우", score: 0, color: "#4ecdc4" },
  ]);

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
      title: "손성모",
      artist: "손성모",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "kpop",
      difficulty: "very-easy",
      keyword: "K-POP",
      hint: "가수 이름과 노래 제목이 같습니다",
    },
    {
      id: "kpop2",
      title: "샘플 K-POP 2",
      artist: "아티스트 2",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "kpop",
      difficulty: "easy",
      keyword: "아이돌",
      hint: "인기 아이돌 그룹의 대표곡",
    },
    {
      id: "kpop3",
      title: "샘플 K-POP 3",
      artist: "아티스트 3",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "kpop",
      difficulty: "medium",
      keyword: "그룹",
      hint: "5인조 남성 그룹의 데뷔곡",
    },
    {
      id: "kpop4",
      title: "샘플 K-POP 4",
      artist: "아티스트 4",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "kpop",
      difficulty: "hard",
      keyword: "솔로",
      hint: "여성 솔로 가수의 발라드",
    },
    {
      id: "kpop5",
      title: "샘플 K-POP 5",
      artist: "아티스트 5",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "kpop",
      difficulty: "very-hard",
      keyword: "인디",
      hint: "독립 음악인의 실험적 곡",
    },
    // POP 샘플
    {
      id: "pop1",
      title: "샘플 POP 1",
      artist: "아티스트 6",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "pop",
      difficulty: "very-easy",
      keyword: "팝송",
      hint: "전 세계적으로 유명한 팝송",
    },
    {
      id: "pop2",
      title: "샘플 POP 2",
      artist: "아티스트 7",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "pop",
      difficulty: "easy",
      keyword: "클래식 팝",
      hint: "80년대 클래식 팝의 대표곡",
    },
    {
      id: "pop3",
      title: "샘플 POP 3",
      artist: "아티스트 8",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "pop",
      difficulty: "medium",
      keyword: "팝락",
      hint: "팝과 록이 결합된 곡",
    },
    {
      id: "pop4",
      title: "샘플 POP 4",
      artist: "아티스트 9",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "pop",
      difficulty: "hard",
      keyword: "얼터너티브",
      hint: "얼터너티브 록 밴드의 히트곡",
    },
    {
      id: "pop5",
      title: "샘플 POP 5",
      artist: "아티스트 10",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "pop",
      difficulty: "very-hard",
      keyword: "익스페리멘탈",
      hint: "실험적인 사운드의 전자음악",
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
    // 이미 완료된 문제는 선택 불가
    if (completedQuestions.has(question.id)) return;

    setCurrentQuestion(question);
    setUserAnswer("");
    setShowAnswer(false);
    setIsPlaying(false);
    setShowHint(false);

    // 새로운 오디오 객체 생성
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }

    const newAudio = new Audio(question.file);
    newAudio.volume = 0.7; // 볼륨 설정
    setAudioRef(newAudio);
  };

  const handlePlayPause = () => {
    if (!audioRef) return;

    if (isPlaying) {
      audioRef.pause();
      setIsPlaying(false);
    } else {
      audioRef.play().catch((error) => {
        console.error("오디오 재생 실패:", error);
        alert("오디오를 재생할 수 없습니다. 링크를 확인해주세요.");
      });
      setIsPlaying(true);
    }
  };

  // 오디오 종료 시 상태 업데이트
  React.useEffect(() => {
    if (audioRef) {
      const handleEnded = () => {
        setIsPlaying(false);
      };

      audioRef.addEventListener("ended", handleEnded);

      return () => {
        audioRef.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioRef]);

  const handleCheckAnswer = () => {
    if (!currentQuestion) return;

    // 입력값에서 띄어쓰기 제거
    const cleanUserAnswer = userAnswer.toLowerCase().replace(/\s/g, "");
    const cleanTitle = currentQuestion.title.toLowerCase().replace(/\s/g, "");
    const cleanArtist = currentQuestion.artist.toLowerCase().replace(/\s/g, "");

    // 가수명과 제목을 둘 다 정확히 맞춰야 정답
    const correct = cleanUserAnswer.includes(cleanTitle) && cleanUserAnswer.includes(cleanArtist);

    if (correct) {
      // 난이도별 점수 계산
      const getScoreByDifficulty = (difficulty: string) => {
        switch (difficulty) {
          case "very-easy":
            return 10;
          case "easy":
            return 20;
          case "medium":
            return 30;
          case "hard":
            return 40;
          case "very-hard":
            return 50;
          default:
            return 10;
        }
      };

      const scoreToAdd = getScoreByDifficulty(currentQuestion.difficulty);

      // 현재 팀의 점수 증가
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === currentTeam ? { ...team, score: team.score + scoreToAdd } : team,
        ),
      );
      // 완료된 문제에 추가
      setCompletedQuestions((prev) => new Set([...prev, currentQuestion.id]));
      setIsCorrect(true);
      setShowAnswer(true);
    } else {
      setIsCorrect(false);
      // 틀렸을 때는 입력값만 초기화하고 계속 도전 가능
      setUserAnswer("");
      // 2초 후 틀림 표시 제거
      setTimeout(() => {
        setIsCorrect(null);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userAnswer.trim() && !showAnswer) {
      handleCheckAnswer();
    }
  };

  const handleShowHint = () => {
    if (!currentQuestion) return;

    setShowHint(true);
  };

  const handleTeamSwitch = () => {
    setCurrentTeam(currentTeam === "team1" ? "team2" : "team1");
  };

  const handleResetScores = () => {
    setTeams((prevTeams) => prevTeams.map((team) => ({ ...team, score: 0 })));
  };

  const getCategoryQuestions = (categoryId: string) => {
    return questions.filter((q) => q.category === categoryId);
  };

  const getCurrentCategory = () => {
    return categories.find((c) => c.id === selectedCategory);
  };

  const getCurrentTeam = () => {
    return teams.find((team) => team.id === currentTeam);
  };

  const getTotalScore = () => {
    return teams.reduce((total, team) => total + team.score, 0);
  };

  const getHintText = (question: Question) => {
    return question.hint;
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
            <div className="team-scores">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`team-score ${team.id === currentTeam ? "active" : ""}`}
                  style={{ borderColor: team.color }}
                >
                  <span className="team-name">{team.name}</span>
                  <span className="team-points">{team.score}점</span>
                </div>
              ))}
            </div>
          </div>
          <div className="team-controls">
            <div className="current-team">
              현재 턴:{" "}
              <span style={{ color: getCurrentTeam()?.color }}>{getCurrentTeam()?.name}</span>
            </div>
            <div className="team-buttons">
              <button onClick={handleTeamSwitch} className="btn btn-switch">
                턴 변경
              </button>
              <button onClick={handleResetScores} className="btn btn-reset">
                점수 초기화
              </button>
            </div>
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
            <div className="team-scores">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`team-score ${team.id === currentTeam ? "active" : ""}`}
                  style={{ borderColor: team.color }}
                >
                  <span className="team-name">{team.name}</span>
                  <span className="team-points">{team.score}점</span>
                </div>
              ))}
            </div>
          </div>
          <div className="team-controls">
            <div className="current-team">
              현재 턴:{" "}
              <span style={{ color: getCurrentTeam()?.color }}>{getCurrentTeam()?.name}</span>
            </div>
            <div className="team-buttons">
              <button onClick={handleTeamSwitch} className="btn btn-switch">
                턴 변경
              </button>
              <button onClick={handleResetScores} className="btn btn-reset">
                점수 초기화
              </button>
            </div>
          </div>
          <p className="game-description">{currentCategory?.description} 문제를 선택하세요!</p>
        </div>

        <div className="questions-grid">
          {categoryQuestions.map((question, index) => (
            <div
              key={question.id}
              className={`question-card ${question.difficulty} ${
                completedQuestions.has(question.id) ? "completed" : ""
              }`}
              onClick={() => handleQuestionSelect(question)}
            >
              <div className="question-number">#{index + 1}</div>
              <div className="question-info">
                <h3>{question.keyword || "음악"}</h3>
              </div>
              <div className={`difficulty-badge ${question.difficulty}`}>
                {question.difficulty === "very-easy"
                  ? "매우 쉬움"
                  : question.difficulty === "easy"
                  ? "쉬움"
                  : question.difficulty === "medium"
                  ? "보통"
                  : question.difficulty === "hard"
                  ? "어려움"
                  : "매우 어려움"}
              </div>
              {completedQuestions.has(question.id) && (
                <div className="completed-badge">✅ 완료</div>
              )}
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
          <div className="team-scores">
            {teams.map((team) => (
              <div
                key={team.id}
                className={`team-score ${team.id === currentTeam ? "active" : ""}`}
                style={{ borderColor: team.color }}
              >
                <span className="team-name">{team.name}</span>
                <span className="team-points">{team.score}점</span>
              </div>
            ))}
          </div>
        </div>
        <div className="team-controls">
          <div className="current-team">
            현재 턴:{" "}
            <span style={{ color: getCurrentTeam()?.color }}>{getCurrentTeam()?.name}</span>
          </div>
          <div className="team-buttons">
            <button onClick={handleTeamSwitch} className="btn btn-switch">
              턴 변경
            </button>
            <button onClick={handleResetScores} className="btn btn-reset">
              점수 초기화
            </button>
          </div>
        </div>
      </div>

      <div className="game-area">
        <div className="question-info">
          <h3>음악을 듣고 제목과 아티스트를 맞춰보세요!</h3>
          <p>카테고리: {getCurrentCategory()?.name}</p>
        </div>

        <div className="audio-controls">
          <button
            onClick={handlePlayPause}
            className={`btn ${isPlaying ? "btn-pause" : "btn-play"}`}
            disabled={!currentQuestion}
          >
            {isPlaying ? "⏸️ 정지" : "▶️ 재생"}
          </button>
        </div>

        <div className="answer-section">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="가수 '이름'과 노래 '제목' 순서대로 말해주세요."
            className={`answer-input ${isCorrect === false ? "wrong" : ""}`}
            disabled={showAnswer}
          />
          <div className="answer-buttons">
            <button
              onClick={handleCheckAnswer}
              className="btn btn-check"
              disabled={showAnswer || !userAnswer.trim()}
            >
              정답 확인
            </button>
            <button
              onClick={handleShowHint}
              className="btn btn-hint"
              disabled={showAnswer || showHint}
            >
              💡 힌트 보기
            </button>
          </div>
        </div>

        {showHint && currentQuestion && (
          <div className="hint-section">
            <h4>💡 힌트</h4>
            <p>{getHintText(currentQuestion)}</p>
          </div>
        )}

        {isCorrect === false && (
          <div className="wrong-answer">
            <span>❌ 틀렸습니다! 다시 시도해보세요!</span>
          </div>
        )}

        {showAnswer && currentQuestion && (
          <div className="correct-answer">
            <h4>
              🎉 정답입니다! {currentQuestion.title} - {currentQuestion.artist}
            </h4>
            <p className="score-info">
              {currentQuestion.difficulty === "very-easy"
                ? "10점"
                : currentQuestion.difficulty === "easy"
                ? "20점"
                : currentQuestion.difficulty === "medium"
                ? "30점"
                : currentQuestion.difficulty === "hard"
                ? "40점"
                : "50점"}{" "}
              획득!
            </p>
            <button onClick={() => setCurrentQuestion(null)} className="btn btn-primary">
              문제 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicGame;
