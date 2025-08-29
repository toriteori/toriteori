import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScore } from "../../contexts/ScoreContext";
import QuickMenu from "../QuickMenu/QuickMenu";
import "../../css/quickMenu.css";
import "./OXGame.css";

interface Question {
  id: string;
  question: string;
  answer: "O" | "X";
  explanation: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
  members: string[];
}

interface Player {
  id: string;
  name: string;
  teamId: string;
  correctAnswers: number;
  totalAnswers: number;
}

interface PlayerAnswer {
  playerId: string;
  answer: "O" | "X";
}

const OXGame: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string>("");
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [canShowExplanation, setCanShowExplanation] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());
  const [gameStats, setGameStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const [showPlayerInput, setShowPlayerInput] = useState(false);
  const [playerInputs, setPlayerInputs] = useState({ name: "", teamId: "" });
  const [localTeams, setLocalTeams] = useState<Team[]>([
    { id: "team1", name: "", score: 0, color: "#ff6b6b", members: [] },
    { id: "team2", name: "", score: 0, color: "#4ecdc4", members: [] },
  ]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const [playerAnswers, setPlayerAnswers] = useState<PlayerAnswer[]>([]);
  const [showCheckAnswerButton, setShowCheckAnswerButton] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [resultData, setResultData] = useState<{
    correctCount: number;
    wrongCount: number;
    totalScore: number;
  } | null>(null);

  const navigate = useNavigate();
  const { teams, updateTeamScore } = useScore();

  // OX 문제 데이터 (석현이 관련 10문제)
  const questions: Question[] = [
    {
      id: "1",
      question: "석현이는 이씨이다.",
      answer: "X",
      explanation: "석현이는 김씨입니다.",
      category: "개인정보",
      difficulty: "easy",
    },
    {
      id: "2",
      question: "석현이는 95년생이다.",
      answer: "X",
      explanation: "석현이는 96년생입니다.",
      category: "개인정보",
      difficulty: "easy",
    },
    {
      id: "3",
      question: "석현이는 손성모와 중학교때 친구이다.",
      answer: "X",
      explanation: "석현이는 손성모와 초등학교 친구입니다.",
      category: "친구관계",
      difficulty: "easy",
    },
    {
      id: "4",
      question: "석현이는 형이 있다.",
      answer: "O",
      explanation: "석현이는 형이 있습니다.",
      category: "가족관계",
      difficulty: "easy",
    },
    {
      id: "5",
      question: "석현이는 현장직이다.",
      answer: "O",
      explanation: "석현이는 현장직입니다.",
      category: "직업",
      difficulty: "easy",
    },
    {
      id: "6",
      question: "석현이는 프로미스나인을 좋아한다.",
      answer: "O",
      explanation: "석현이는 프로미스나인을 좋아합니다.",
      category: "취미",
      difficulty: "easy",
    },
    {
      id: "7",
      question: "석현이는 공군 출신이다.",
      answer: "X",
      explanation: "석현이는 해군 출신입니다.",
      category: "군복무",
      difficulty: "medium",
    },
    {
      id: "8",
      question:
        "석현이는 한양대 축제에서 손성모와 헌팅한 후, 맘에드는 여성분 때문에 싸운적이 있다.",
      answer: "X",
      explanation: "한양대 축제만 같이 갔습니다.",
      category: "대학생활",
      difficulty: "medium",
    },
    {
      id: "9",
      question: "석현이는 돌발성난청으로 인해 오른쪽 귀가 안들린다.",
      answer: "O",
      explanation: "석현이는 돌발성난청으로 인해 오른쪽 귀가 안들립니다.",
      category: "건강",
      difficulty: "medium",
    },
    {
      id: "10",
      question: "석현이는 6년전, 손성모를 게이라고 의심한적이 있다.",
      answer: "X",
      explanation: "있겠어요? 저 게이 아닙니다!",
      category: "친구관계",
      difficulty: "hard",
    },
  ];

  useEffect(() => {
    setGameStats({
      totalQuestions: questions.length,
      correctAnswers: 0,
      wrongAnswers: 0,
    });
    setQuestionStartTime(Date.now());
  }, []);

  // ScoreContext의 팀 정보를 localTeams에 동기화
  useEffect(() => {
    if (teams && teams.length > 0) {
      setLocalTeams((prev) =>
        prev.map((team) => {
          const globalTeam = teams.find((t) => t.id === team.id);
          return {
            ...team,
            name: globalTeam?.name || team.name,
            score: globalTeam?.score || 0,
          };
        }),
      );
    }
  }, [teams]);

  useEffect(() => {
    if (showAnswer) {
      const timer = setTimeout(() => {
        setShowAnswer(false);
        setPlayerAnswers([]);
        setShowExplanation(false);
        setCanShowExplanation(false);
        setShowCheckAnswerButton(false);
        handleNextQuestion();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAnswer]);

  useEffect(() => {
    if (showAnswer) {
      const timer = setTimeout(() => {
        setCanShowExplanation(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showAnswer]);

  // 모든 플레이어가 답변했는지 확인
  useEffect(() => {
    if (players.length > 0 && playerAnswers.length === players.length) {
      setShowCheckAnswerButton(true);
    }
  }, [playerAnswers, players]);

  const handleAnswer = (answer: "O" | "X", playerId: string) => {
    // 이미 답변한 플레이어인지 확인
    const existingAnswer = playerAnswers.find((pa) => pa.playerId === playerId);
    if (existingAnswer) {
      // 기존 답변 업데이트
      setPlayerAnswers((prev) =>
        prev.map((pa) => (pa.playerId === playerId ? { ...pa, answer } : pa)),
      );
    } else {
      // 새로운 답변 추가
      setPlayerAnswers((prev) => [...prev, { playerId, answer }]);
    }
  };

  const handleCheckAnswers = () => {
    if (playerAnswers.length === 0) return;

    const currentQuestion = questions[currentQuestionIndex];
    let correctCount = 0;
    let wrongCount = 0;
    let totalScore = 0;

    // 각 플레이어의 답변 확인 및 점수 계산
    playerAnswers.forEach((playerAnswer) => {
      const isCorrectAnswer = playerAnswer.answer === currentQuestion.answer;
      const player = players.find((p) => p.id === playerAnswer.playerId);

      if (isCorrectAnswer) {
        correctCount++;
        totalScore += 30;
        if (player) {
          // 개인이 정답을 맞추면 해당 팀에 30점 추가
          updateTeamScore(player.teamId, 30);

          // 개인 통계 업데이트
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === playerAnswer.playerId
                ? { ...p, correctAnswers: p.correctAnswers + 1, totalAnswers: p.totalAnswers + 1 }
                : p,
            ),
          );

          // 팀 점수 업데이트
          setLocalTeams((prev) =>
            prev.map((team) =>
              team.id === player.teamId ? { ...team, score: team.score + 30 } : team,
            ),
          );
        }
      } else {
        wrongCount++;
        // 오답 시에도 개인 통계 업데이트
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === playerAnswer.playerId ? { ...p, totalAnswers: p.totalAnswers + 1 } : p,
          ),
        );
      }
    });

    // 게임 통계 업데이트
    setGameStats((prev) => ({
      ...prev,
      correctAnswers: prev.correctAnswers + correctCount,
      wrongAnswers: prev.wrongAnswers + wrongCount,
    }));

    setCompletedQuestions((prev) => new Set([...prev, currentQuestionIndex]));

    // 결과 데이터 설정 및 팝업 표시
    setResultData({
      correctCount,
      wrongCount,
      totalScore,
    });
    setShowResultPopup(true);
  };

  const handleNextQuestion = () => {
    setShowResultPopup(false);
    setResultData(null);
    setPlayerAnswers([]);
    setShowCheckAnswerButton(false);
    setShowExplanation(false);
    setCanShowExplanation(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
    } else {
      // 모든 문제 완료
      alert("🎉 모든 문제를 완료했습니다!");
    }
  };

  const handleShowExplanation = () => {
    if (canShowExplanation) {
      setShowExplanation(true);
    }
  };

  const handleBackToMain = () => {
    navigate("/main");
  };

  const handlePlayerNameChange = (name: string) => {
    setPlayerInputs((prev) => ({ ...prev, name }));
  };

  const handleTeamIdChange = (teamId: string) => {
    setPlayerInputs((prev) => ({ ...prev, teamId }));
  };

  const handleSavePlayer = () => {
    if (playerInputs.name.trim() && playerInputs.teamId) {
      const newPlayer: Player = {
        id: `player_${Date.now()}`,
        name: playerInputs.name.trim(),
        teamId: playerInputs.teamId,
        correctAnswers: 0,
        totalAnswers: 0,
      };

      setPlayers((prev) => [...prev, newPlayer]);

      // 팀에 멤버 추가
      setLocalTeams((prev) =>
        prev.map((team) =>
          team.id === playerInputs.teamId
            ? { ...team, members: [...team.members, newPlayer.name] }
            : team,
        ),
      );

      setPlayerInputs({ name: "", teamId: "" });
      setShowPlayerInput(false);
    }
  };

  const handleOpenPlayerInput = () => {
    setPlayerInputs({ name: "", teamId: "team1" });
    setShowPlayerInput(true);
  };

  const handleStartGame = () => {
    if (players.length >= 2) {
      setGameStarted(true);
    } else {
      alert("게임을 시작하려면 최소 2명의 플레이어가 필요합니다!");
    }
  };

  const handleResetGame = () => {
    setGameStarted(false);
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
    setIsCorrect(null);
    setCurrentPlayer("");
    setShowExplanation(false);
    setCanShowExplanation(false);
    setCompletedQuestions(new Set());
    setPlayerAnswers([]);
    setShowCheckAnswerButton(false);
    setShowResultPopup(false);
    setResultData(null);
    setGameStats({
      totalQuestions: questions.length,
      correctAnswers: 0,
      wrongAnswers: 0,
    });

    // 플레이어 통계 초기화
    setPlayers((prev) => prev.map((p) => ({ ...p, correctAnswers: 0, totalAnswers: 0 })));

    // 팀 점수 초기화
    setLocalTeams((prev) => prev.map((team) => ({ ...team, score: 0 })));
  };

  // 드래그 앤 드롭 관련 함수들
  const handleDragStart = (e: React.DragEvent, playerId: string) => {
    setDraggedPlayer(playerId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, answer: "O" | "X") => {
    e.preventDefault();
    if (draggedPlayer) {
      handleAnswer(answer, draggedPlayer);
      setDraggedPlayer(null);
    }
  };

  const getCurrentQuestion = () => questions[currentQuestionIndex];
  const getCurrentCategory = () => {
    const category = getCurrentQuestion()?.category;
    const iconMap: { [key: string]: string } = {
      개인정보: "👤",
      친구관계: "🤝",
      가족관계: "👨‍👩‍👧‍👦",
      직업: "💼",
      취미: "🎵",
      군복무: "🎖️",
      대학생활: "🎓",
      건강: "🏥",
    };
    return iconMap[category || ""] || "❓";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colorMap = { easy: "#4CAF50", medium: "#FF9800", hard: "#F44336" };
    return colorMap[difficulty as keyof typeof colorMap] || "#999";
  };

  const getDifficultyText = (difficulty: string) => {
    const textMap = { easy: "쉬움", medium: "보통", hard: "어려움" };
    return textMap[difficulty as keyof typeof colorMap] || difficulty;
  };

  // 게임 시작 전 설정 화면
  if (!gameStarted) {
    return (
      <div className="ox-game">
        <div className="game-header">
          <div className="header-top">
            <button onClick={handleBackToMain} className="back-to-main-btn">
              ← 메인으로
            </button>
            <h1>🎯 OX 게임 설정</h1>
            <div className="team-scores">
              {localTeams.map((team) => (
                <div key={team.id} className="team-score" style={{ borderColor: team.color }}>
                  <span className="team-name">{team.name || `팀 ${team.id.slice(-1)}`}</span>
                  <div className="team-members-count">{team.members.length}명</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="game-area">
          {/* 팀 이름이 설정되지 않은 경우 안내 */}
          {(!teams[0]?.name || !teams[1]?.name) && (
            <div className="team-name-warning">
              <div className="warning-icon">⚠️</div>
              <div className="warning-content">
                <p className="warning-title">팀 이름을 먼저 설정해주세요!</p>
                <p className="warning-description">
                  메인 페이지에서 팀 이름을 설정한 후 게임을 시작해주세요.
                </p>
                <button onClick={handleBackToMain} className="setup-team-btn">
                  🏠 메인으로 돌아가기
                </button>
              </div>
            </div>
          )}

          <div className="setup-section">
            <h2>👥 플레이어 설정</h2>
            <p className="setup-description">
              게임을 시작하려면 최소 2명의 플레이어를 추가해주세요.
            </p>

            {players.length === 0 ? (
              <div className="no-players-message">
                <p>🎮 게임을 시작하려면 먼저 플레이어를 추가해주세요!</p>
                <button onClick={handleOpenPlayerInput} className="add-player-btn">
                  👤 첫 번째 플레이어 추가
                </button>
              </div>
            ) : (
              <div className="players-list">
                <h3>현재 플레이어 목록</h3>
                <div className="players-grid">
                  {players.map((player) => {
                    const team = localTeams.find((t) => t.id === player.teamId);
                    return (
                      <div
                        key={player.id}
                        className="player-card"
                        style={{ borderColor: team?.color }}
                      >
                        <div className="player-name">{player.name}</div>
                        <div className="player-team">
                          {team?.name || `팀 ${player.teamId.slice(-1)}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={handleOpenPlayerInput} className="add-player-btn">
                  👤 플레이어 추가
                </button>
              </div>
            )}

            {players.length >= 2 && (
              <div className="start-game-section">
                <button onClick={handleStartGame} className="start-game-btn">
                  🚀 게임 시작하기
                </button>
                <p className="start-game-info">
                  총 {players.length}명의 플레이어가 준비되었습니다!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 플레이어 추가 팝업 */}
        {showPlayerInput && (
          <div className="team-input-overlay">
            <div className="team-input-modal">
              <h3>👤 플레이어 추가</h3>
              <div className="team-inputs">
                <div className="team-input">
                  <label>이름:</label>
                  <input
                    type="text"
                    value={playerInputs.name}
                    onChange={(e) => handlePlayerNameChange(e.target.value)}
                    placeholder="플레이어 이름을 입력해주세요."
                  />
                </div>
                <div className="team-input">
                  <label>팀:</label>
                  <select
                    value={playerInputs.teamId}
                    onChange={(e) => handleTeamIdChange(e.target.value)}
                    className="team-select"
                  >
                    <option value="team1">
                      {localTeams.find((t) => t.id === "team1")?.name || "팀 1"}
                    </option>
                    <option value="team2">
                      {localTeams.find((t) => t.id === "team2")?.name || "팀 2"}
                    </option>
                  </select>
                </div>
              </div>
              <div className="team-input-buttons">
                <button onClick={handleSavePlayer} className="save-btn">
                  💾 추가
                </button>
                <button onClick={() => setShowPlayerInput(false)} className="cancel-btn">
                  ❌ 취소
                </button>
              </div>
            </div>
          </div>
        )}

        <QuickMenu
          buttons={[
            {
              id: "add-player",
              icon: "👤",
              title: "플레이어 추가",
              onClick: handleOpenPlayerInput,
              color: "player",
            },
            {
              id: "back-to-main",
              icon: "🏠",
              title: "메인으로",
              onClick: handleBackToMain,
              color: "main",
            },
          ]}
        />
      </div>
    );
  }

  if (!getCurrentQuestion()) {
    return (
      <div className="ox-game">
        <div className="game-header">
          <h1>🎯 OX 게임 완료!</h1>
          <div className="final-stats">
            <h2>📊 최종 결과</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">총 문제</span>
                <span className="stat-value">{gameStats.totalQuestions}개</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">정답</span>
                <span className="stat-value correct">{gameStats.correctAnswers}개</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">오답</span>
                <span className="stat-value wrong">{gameStats.wrongAnswers}개</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">정답률</span>
                <span className="stat-value">
                  {gameStats.totalQuestions > 0
                    ? Math.round((gameStats.correctAnswers / gameStats.totalQuestions) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>

            {/* 팀별 결과 */}
            <div className="team-results">
              <h3>🏆 팀별 결과</h3>
              <div className="team-results-grid">
                {localTeams.map((team) => (
                  <div
                    key={team.id}
                    className="team-result-item"
                    style={{ borderColor: team.color }}
                  >
                    <h4>{team.name || `팀 ${team.id.slice(-1)}`}</h4>
                    <div className="team-final-score">{team.score}점</div>
                    <div className="team-members">
                      {team.members.length > 0 ? (
                        team.members.map((member, index) => (
                          <span key={index} className="team-member">
                            {member}
                          </span>
                        ))
                      ) : (
                        <span className="no-members">멤버 없음</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 개인별 결과 */}
            {players.length > 0 && (
              <div className="player-results">
                <h3>👤 개인별 결과</h3>
                <div className="player-results-grid">
                  {players.map((player) => {
                    const team = localTeams.find((t) => t.id === player.teamId);
                    return (
                      <div
                        key={player.id}
                        className="player-result-item"
                        style={{ borderColor: team?.color }}
                      >
                        <div className="player-name">{player.name}</div>
                        <div className="player-team">
                          {team?.name || `팀 ${player.teamId.slice(-1)}`}
                        </div>
                        <div className="player-stats">
                          <span>정답: {player.correctAnswers}개</span>
                          <span>
                            정답률:{" "}
                            {player.totalAnswers > 0
                              ? Math.round((player.correctAnswers / player.totalAnswers) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="final-buttons">
              <button onClick={handleResetGame} className="reset-game-btn">
                🔄 다시하기
              </button>
              <button onClick={handleBackToMain} className="back-btn">
                🏠 메인으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();

  return (
    <div className="ox-game">
      <div className="game-header">
        <div className="header-top">
          <button onClick={handleBackToMain} className="back-to-main-btn">
            ← 메인으로
          </button>
          <h1>🎯 OX 게임</h1>
          <div className="team-scores">
            {localTeams.map((team) => (
              <div
                key={team.id}
                className={`team-score ${
                  currentPlayer && players.find((p) => p.id === currentPlayer)?.teamId === team.id
                    ? "current"
                    : ""
                }`}
                style={{ borderColor: team.color }}
              >
                <span className="team-name">{team.name || `팀 ${team.id.slice(-1)}`}</span>
                <span className="team-points">{team.score}점</span>
                <div className="team-members-count">{team.members.length}명</div>
              </div>
            ))}
          </div>
        </div>
        <div className="progress-info">
          <span className="question-counter">
            문제 {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      <div className="game-area">
        <div className="question-section">
          <h2 className="question-text">{currentQuestion.question}</h2>
        </div>

        <div className="answer-section">
          <div className="answer-zones">
            <div
              className="answer-zone o-zone"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "O")}
            >
              <div className="zone-label">O 구역</div>
              <div className="zone-instruction">플레이어를 여기에 드래그하세요</div>
              {/* O 구역에 답변한 플레이어들 표시 */}
              {playerAnswers
                .filter((pa) => pa.answer === "O")
                .map((pa) => {
                  const player = players.find((p) => p.id === pa.playerId);
                  const team = localTeams.find((t) => t.id === player?.teamId);
                  return (
                    <div
                      key={pa.playerId}
                      className="zone-player"
                      style={{ borderColor: team?.color }}
                    >
                      {player?.name}
                    </div>
                  );
                })}
            </div>
            <div
              className="answer-zone x-zone"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "X")}
            >
              <div className="zone-label">X 구역</div>
              <div className="zone-instruction">플레이어를 여기에 드래그하세요</div>
              {/* X 구역에 답변한 플레이어들 표시 */}
              {playerAnswers
                .filter((pa) => pa.answer === "X")
                .map((pa) => {
                  const player = players.find((p) => p.id === pa.playerId);
                  const team = localTeams.find((t) => t.id === player?.teamId);
                  return (
                    <div
                      key={pa.playerId}
                      className="zone-player"
                      style={{ borderColor: team?.color }}
                    >
                      {player?.name}
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="players-draggable">
            <h3>👥 플레이어를 O 또는 X 구역에 드래그하세요</h3>
            <div className="players-grid-draggable">
              {players.map((player) => {
                const team = localTeams.find((t) => t.id === player.teamId);
                const hasAnswered = playerAnswers.some((pa) => pa.playerId === player.id);
                return (
                  <div
                    key={player.id}
                    className={`player-draggable ${hasAnswered ? "answered" : ""}`}
                    draggable={!hasAnswered}
                    onDragStart={(e) => handleDragStart(e, player.id)}
                    style={{ borderColor: team?.color }}
                  >
                    <div className="player-name">{player.name}</div>
                    <div className="player-team">
                      {team?.name || `팀 ${player.teamId.slice(-1)}`}
                    </div>
                    {hasAnswered && <div className="player-answer-status">답변 완료</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 정답확인 버튼 */}
          {showCheckAnswerButton && (
            <div className="check-answer-section">
              <button onClick={handleCheckAnswers} className="check-answer-btn">
                ✅ 정답확인하기
              </button>
              <p className="check-answer-info">
                모든 플레이어가 답변했습니다! 정답을 확인해보세요.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 결과 팝업 */}
      {showResultPopup && resultData && (
        <div className="result-popup-overlay">
          <div className="result-popup">
            <div className="result-popup-header">
              <h2>📊 문제 {currentQuestionIndex + 1} 결과</h2>
              <div className="result-summary">
                <div className="result-summary-item">
                  <span className="result-label">정답:</span>
                  <span className="result-value correct">{resultData.correctCount}명</span>
                </div>
                <div className="result-summary-item">
                  <span className="result-label">오답:</span>
                  <span className="result-value wrong">{resultData.wrongCount}명</span>
                </div>
                <div className="result-summary-item">
                  <span className="result-label">획득 점수:</span>
                  <span className="result-value score">+{resultData.totalScore}점</span>
                </div>
              </div>
            </div>

            <div className="result-popup-content">
              <div className="correct-answer-section">
                <h3>🎯 정답: {currentQuestion.answer}</h3>
                <p className="explanation-text">{currentQuestion.explanation}</p>
              </div>

              <div className="player-answers-summary">
                <h3>👥 플레이어별 답변</h3>
                {playerAnswers.map((pa) => {
                  const player = players.find((p) => p.id === pa.playerId);
                  const team = localTeams.find((t) => t.id === player?.teamId);
                  const isCorrectAnswer = pa.answer === currentQuestion.answer;
                  return (
                    <div
                      key={pa.playerId}
                      className={`player-answer-result ${
                        isCorrectAnswer ? "correct" : "incorrect"
                      }`}
                    >
                      <span className="player-name">{player?.name}</span>
                      <span className="player-team">
                        ({team?.name || `팀 ${player?.teamId?.slice(-1)}`})
                      </span>
                      <span className="player-answer">{pa.answer}</span>
                      <span className="player-result">{isCorrectAnswer ? "정답" : "오답"}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="result-popup-footer">
              <button onClick={handleNextQuestion} className="next-question-btn">
                {currentQuestionIndex < questions.length - 1 ? "다음 문제" : "게임 완료"}
              </button>
            </div>
          </div>
        </div>
      )}

      <QuickMenu
        buttons={[
          {
            id: "reset-game",
            icon: "🔄",
            title: "게임 리셋",
            onClick: handleResetGame,
            color: "reset",
          },
          {
            id: "back-to-main",
            icon: "🏠",
            title: "메인으로",
            onClick: handleBackToMain,
            color: "main",
          },
        ]}
      />
    </div>
  );
};

export default OXGame;
