import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useScore } from "../../contexts/ScoreContext";
import QuickMenu from "../QuickMenu/QuickMenu";
import "../../css/numberGame.css";
import "../../css/quickMenu.css";

interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
}

interface NumberCard {
  id: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
  isSelected: boolean;
}

const NumberGame: React.FC = () => {
  const { teams, updateTeamScore } = useScore();
  const [currentTeam, setCurrentTeam] = useState<string>("team1");
  const [gameState, setGameState] = useState<"dice" | "start" | "preview" | "playing" | "finished">(
    "dice",
  );
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [numberCards, setNumberCards] = useState<NumberCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [correctMatches, setCorrectMatches] = useState<{ [key: string]: number }>({
    team1: 0,
    team2: 0,
  });
  const [maxNumber, setMaxNumber] = useState<number>(25);
  const [diceResults, setDiceResults] = useState<{ team1: number; team2: number }>({
    team1: 0,
    team2: 0,
  });
  const [diceRolling, setDiceRolling] = useState<boolean>(false);
  const [diceWinner, setDiceWinner] = useState<string | null>(null);

  // 10초 턴 타이머 관련 상태 추가
  const [turnTimeLeft, setTurnTimeLeft] = useState<number>(10);
  const turnTimerRef = useRef<number | null>(null);

  const navigate = useNavigate();

  // 턴 타이머 시작 함수
  const startTurnTimer = () => {
    // 기존 타이머가 있다면 정리
    if (turnTimerRef.current) {
      clearTimeout(turnTimerRef.current);
    }

    setTurnTimeLeft(10);

    // 10초 타이머 시작
    turnTimerRef.current = window.setTimeout(() => {
      // 시간이 다 되면 자동으로 턴 변경
      setCurrentTeam(currentTeam === "team1" ? "team2" : "team1");
      setTurnTimeLeft(10); // 새로운 턴의 타이머 시작
      startTurnTimer(); // 새로운 턴의 타이머 시작
    }, 10000);
  };

  // 턴 타이머 정리 함수
  const clearTurnTimer = () => {
    if (turnTimerRef.current) {
      clearTimeout(turnTimerRef.current);
      turnTimerRef.current = null;
    }
  };

  // 턴 타이머 초기화 함수 (맞췄을 때 호출)
  const resetTurnTimer = () => {
    clearTurnTimer();
    startTurnTimer();
  };

  // 화면 크기 감지 및 숫자 개수 조정
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1023) {
        setMaxNumber(10);
      } else {
        setMaxNumber(25);
      }
    };

    // 초기 설정
    handleResize();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 클린업
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      clearTurnTimer();
    };
  }, []);

  // 턴 타이머 실시간 업데이트
  useEffect(() => {
    if (gameState === "playing" && turnTimeLeft > 0) {
      const interval = setInterval(() => {
        setTurnTimeLeft((prev) => {
          if (prev <= 1) {
            return 10; // 0이 되면 10으로 리셋 (startTurnTimer에서 처리됨)
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState, turnTimeLeft]);

  // 게임 초기화
  useEffect(() => {
    initializeGame();
  }, [maxNumber]);

  // 타이머
  useEffect(() => {
    if (gameState === "preview" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === "preview") {
      startGame();
    }
  }, [timeLeft, gameState]);

  const initializeGame = () => {
    // maxNumber까지의 숫자를 두 세트로 생성
    const numbers = [];
    for (let i = 1; i <= maxNumber; i++) {
      numbers.push(i, i); // 각 숫자를 두 번씩
    }

    // 랜덤으로 섞기
    const shuffledNumbers = numbers.sort(() => Math.random() - 0.5);

    // 카드 배열 생성
    const cards: NumberCard[] = shuffledNumbers.map((value, index) => ({
      id: index,
      value,
      isFlipped: false, // 처음에는 숫자가 보이도록 false
      isMatched: false,
      isSelected: false,
    }));

    setNumberCards(cards);
    setTimeLeft(maxNumber === 10 ? 15 : 20); // 숫자 개수에 따라 시간 조정
    // gameState는 주사위 화면에서 결정되므로 여기서 설정하지 않음
    setSelectedCards([]);
    setCorrectMatches({ team1: 0, team2: 0 });
  };

  const startPreview = () => {
    setGameState("preview");
  };

  const startGame = () => {
    // 모든 카드를 뒤집기
    setNumberCards((prev) => prev.map((card) => ({ ...card, isFlipped: true })));
    setGameState("playing");

    // 게임 시작 시 턴 타이머 시작
    startTurnTimer();
  };

  const handleCardClick = (cardId: number) => {
    if (gameState !== "playing") return;

    const card = numberCards.find((c) => c.id === cardId);
    if (!card || card.isMatched || card.isSelected) return;

    // 이미 2개가 선택된 상태라면 더 이상 선택 불가
    if (selectedCards.length >= 2) return;

    // 카드 선택
    const newSelectedCards = [...selectedCards, cardId];
    setSelectedCards(newSelectedCards);

    // 선택된 카드 표시 (뒤집힌 상태에서 클릭하면 숫자가 보이도록)
    setNumberCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isSelected: true, isFlipped: false } : c)),
    );

    // 두 번째 카드 선택 시 매칭 확인
    if (newSelectedCards.length === 2) {
      setTimeout(() => {
        checkMatch(newSelectedCards);
      }, 1000); // 모션을 보기 위해 시간을 늘림
    }
  };

  const checkMatch = (selectedCardIds: number[]) => {
    const [card1, card2] = selectedCardIds.map((id) => numberCards.find((c) => c.id === id)!);

    if (card1.value === card2.value) {
      // 매칭 성공
      setNumberCards((prev) =>
        prev.map((c) =>
          selectedCardIds.includes(c.id)
            ? { ...c, isMatched: true, isSelected: false, isFlipped: false }
            : c,
        ),
      );

      // 현재 팀 점수 증가
      setCorrectMatches((prev) => ({
        ...prev,
        [currentTeam]: prev[currentTeam] + 1,
      }));

      // 짝을 맞출 때마다 20점 추가
      updateTeamScore(currentTeam, 20);

      // 턴 유지 (맞췄으므로)
      // 턴 타이머 초기화
      resetTurnTimer();
    } else {
      // 매칭 실패 - 턴 변경 (카드를 다시 뒤집기)
      setNumberCards((prev) =>
        prev.map((c) =>
          selectedCardIds.includes(c.id) ? { ...c, isSelected: false, isFlipped: true } : c,
        ),
      );

      // 턴 변경
      setCurrentTeam(currentTeam === "team1" ? "team2" : "team1");

      // 턴 변경 시 타이머 초기화
      resetTurnTimer();
    }

    setSelectedCards([]);

    // 게임 종료 체크
    checkGameEnd();
  };

  const checkGameEnd = () => {
    const matchedCards = numberCards.filter((card) => card.isMatched);
    if (matchedCards.length === numberCards.length) {
      endGame();
    }
  };

  const endGame = () => {
    setGameState("finished");

    // 게임 종료 시 턴 타이머 정리
    clearTurnTimer();

    // 승자 결정 및 점수 부여
    const team1Score = correctMatches.team1;
    const team2Score = correctMatches.team2;

    if (team1Score > team2Score) {
      // 더 많이 맞춘 팀에게 700점 추가
      updateTeamScore("team1", 700);
    } else if (team2Score > team1Score) {
      // 더 많이 맞춘 팀에게 700점 추가
      updateTeamScore("team2", 700);
    }
    // 동점인 경우 점수 부여 안함
  };

  const handleTeamSwitch = () => {
    setCurrentTeam(currentTeam === "team1" ? "team2" : "team1");

    // 턴 변경 시 타이머 초기화
    resetTurnTimer();
  };

  const handleResetScores = () => {
    // 전역 점수 초기화는 ScoreContext에서 처리
    // 이 함수는 게임 내 점수만 초기화
  };

  const handleBackToMain = () => {
    navigate("/main");
  };

  const handleRestartGame = () => {
    initializeGame();
  };

  const getCurrentTeam = () => {
    return teams.find((team) => team.id === currentTeam);
  };

  const rollDice = () => {
    setDiceRolling(true);

    // 주사위 굴리기 애니메이션을 위한 타이머
    setTimeout(() => {
      const team1Result = Math.floor(Math.random() * 6) + 1;
      const team2Result = Math.floor(Math.random() * 6) + 1;

      setDiceResults({ team1: team1Result, team2: team2Result });

      // 승자 결정
      if (team1Result > team2Result) {
        setDiceWinner("team1");
        setCurrentTeam("team1");
      } else if (team2Result > team1Result) {
        setDiceWinner("team2");
        setCurrentTeam("team2");
      } else {
        setDiceWinner("tie");
      }

      setDiceRolling(false);
    }, 2000); // 2초 후 결과 표시
  };

  const startGameAfterDice = () => {
    if (diceWinner === "tie") {
      // 동점이면 다시 굴리기
      setDiceResults({ team1: 0, team2: 0 });
      setDiceWinner(null);
      return;
    }

    // 게임 초기화 후 시작
    clearTurnTimer(); // 기존 타이머 정리
    initializeGame();
    setGameState("start");
  };

  // 행열 위치 계산 함수
  const getCardPosition = (index: number) => {
    const columnsPerRow = maxNumber === 10 ? 5 : 10;
    const row = Math.floor(index / columnsPerRow) + 1;
    const col = (index % columnsPerRow) + 1;
    const rowLabel = String.fromCharCode(64 + row); // A, B, C, D, E
    return `${rowLabel}${col}`;
  };

  // 그리드 레이아웃 계산
  const getGridLayout = () => {
    if (maxNumber === 10) {
      return {
        columns: 5,
        rows: 4,
        maxRowLabel: "D",
      };
    } else {
      return {
        columns: 10,
        rows: 5,
        maxRowLabel: "E",
      };
    }
  };

  const gridLayout = getGridLayout();

  return (
    <div className="number-game">
      {/* 디버깅용 팀 정보 확인 */}
      {teams.length === 0 && (
        <div style={{ color: "red", padding: "20px", textAlign: "center" }}>
          팀 정보를 불러오는 중... {JSON.stringify(teams)}
        </div>
      )}

      {/* 주사위 굴리기 화면 */}
      {gameState === "dice" && teams.length > 0 && (
        <div className="dice-screen">
          <div className="dice-content">
            <h2>🎲 팀 순서 정하기</h2>
            <p className="dice-description">
              주사위를 굴려서 높은 숫자가 나온 팀이 먼저 시작합니다!
            </p>

            <div className="dice-container">
              <div className="dice-section">
                <h3>{teams[0].name || "팀 1"}</h3>
                <div className={`dice ${diceRolling ? "rolling" : ""}`}>
                  {diceRolling ? "🎲" : diceResults.team1 || "?"}
                </div>
              </div>

              <div className="dice-section">
                <h3>{teams[1].name || "팀 2"}</h3>
                <div className={`dice ${diceRolling ? "rolling" : ""}`}>
                  {diceRolling ? "🎲" : diceResults.team2 || "?"}
                </div>
              </div>
            </div>

            {!diceResults.team1 && !diceResults.team2 && (
              <button onClick={rollDice} className="dice-btn" disabled={diceRolling}>
                🎲 주사위 굴리기!
              </button>
            )}

            {diceWinner && diceWinner !== "tie" && (
              <div className="dice-result">
                <p className="winner-announcement">
                  🎉{" "}
                  <strong>
                    {teams.find((t) => t.id === diceWinner)?.name ||
                      `팀 ${diceWinner === "team1" ? "1" : "2"}`}
                  </strong>
                  가 먼저 시작합니다!
                </p>
                <button onClick={startGameAfterDice} className="start-game-btn">
                  🎮 게임 시작!
                </button>
              </div>
            )}

            {diceWinner === "tie" && (
              <div className="dice-result">
                <p className="tie-announcement">🤝 동점입니다! 다시 굴려주세요.</p>
                <button onClick={rollDice} className="dice-btn">
                  🎲 다시 굴리기!
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 기존 시작 화면 */}
      {gameState === "start" && (
        <div className="start-screen">
          <div className="start-content">
            <h2>🔢 같은 숫자 맞추기</h2>
            <div className="game-rules">
              <p>• 두 팀이 번갈아가며 카드를 선택합니다</p>
              <p>• 같은 숫자가 적힌 카드를 찾아주세요</p>
              <p>• 짝을 맞출 때마다 20점을 획득합니다</p>
              <p>• 더 많이 맞춘 팀이 승리하고 700점을 추가로 획득합니다</p>
              <p>
                • 현재 턴:{" "}
                <strong style={{ color: getCurrentTeam()?.color }}>{getCurrentTeam()?.name}</strong>
              </p>
            </div>
            <button onClick={startPreview} className="start-btn">
              🎯 게임 시작!
            </button>
          </div>
        </div>
      )}

      {/* 게임 헤더 */}
      {gameState !== "start" && gameState !== "dice" && (
        <div className="game-header">
          <div className="header-top">
            <button onClick={handleBackToMain} className="back-to-main-btn">
              ← 메인으로
            </button>
            <h1>🔢 같은 숫자 맞추기</h1>
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
        </div>
      )}

      {/* 플로팅 게임 정보 */}
      {gameState !== "start" && (
        <div className="floating-game-info">
          <div className="current-team-display">
            현재 턴:{" "}
            <span style={{ color: getCurrentTeam()?.color }}>{getCurrentTeam()?.name}</span>
          </div>

          {gameState === "preview" && (
            <div className="preview-info">
              <p className="game-description">
                1~{maxNumber} 숫자를 {maxNumber === 10 ? 15 : 20}초 동안 기억하세요! (
                <strong>{timeLeft}</strong>초 남음)
              </p>
            </div>
          )}

          {gameState === "playing" && (
            <div className="game-info">
              <p className="game-description">
                같은 숫자를 찾아보세요! A1~{gridLayout.maxRowLabel}
                {gridLayout.columns} 위치로 말할 수 있습니다!
              </p>
              <div className="match-scores">
                <div className="match-score">
                  <span style={{ color: teams[0].color }}>
                    {teams[0].name}: {correctMatches.team1}개
                  </span>
                </div>
                <div className="match-score">
                  <span style={{ color: teams[1].color }}>
                    {teams[1].name}: {correctMatches.team2}개
                  </span>
                </div>
              </div>
              {/* 턴 타이머 표시 */}
              <div className={`turn-timer ${turnTimeLeft <= 5 ? "warning" : ""}`}>
                <span style={{ color: getCurrentTeam()?.color }}>
                  {getCurrentTeam()?.name} 턴: {turnTimeLeft}초 남음
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {gameState === "finished" && (
        <div className="game-result">
          <h2>게임 종료!</h2>
          <div className="final-scores">
            <p>
              {teams[0].name}: {correctMatches.team1}개
            </p>
            <p>
              {teams[1].name}: {correctMatches.team2}개
            </p>
          </div>
          {correctMatches.team1 > correctMatches.team2 ? (
            <p className="winner">🎉 {teams[0].name} 승리! 700점 획득!</p>
          ) : correctMatches.team2 > correctMatches.team1 ? (
            <p className="winner">🎉 {teams[1].name} 승리! 700점 획득!</p>
          ) : (
            <p className="draw">무승부!</p>
          )}
          <div className="game-result-buttons">
            <button onClick={handleRestartGame} className="btn btn-restart">
              🎮 다시 시작
            </button>
            <button onClick={handleBackToMain} className="btn btn-secondary">
              🏠 메인으로
            </button>
          </div>
        </div>
      )}

      {/* 숫자 그리드 컨테이너 */}
      {gameState !== "start" && gameState !== "finished" && gameState !== "dice" && (
        <div className="number-grid-container">
          {/* 열 헤더 */}
          <div className="grid-header">
            <div className="corner-cell"></div>
            {Array.from({ length: gridLayout.columns }, (_, i) => (
              <div key={i} className="column-header">
                {i + 1}
              </div>
            ))}
          </div>

          {/* 행과 그리드 */}
          <div className="grid-content">
            {Array.from({ length: gridLayout.rows }, (_, rowIndex) => (
              <div key={rowIndex} className="grid-row">
                {/* 행 헤더 */}
                <div className="row-header">{String.fromCharCode(65 + rowIndex)}</div>

                {/* 카드들 */}
                {numberCards
                  .slice(rowIndex * gridLayout.columns, (rowIndex + 1) * gridLayout.columns)
                  .map((card) => (
                    <div
                      key={card.id}
                      className={`number-card ${card.isFlipped ? "flipped" : ""} ${
                        card.isMatched ? "matched" : ""
                      } ${card.isSelected ? "selected" : ""}`}
                      onClick={() => handleCardClick(card.id)}
                    >
                      <div className="card-front">
                        <div className="card-value">{card.value}</div>
                      </div>
                      <div className="card-back">
                        <div className="card-position">{getCardPosition(card.id)}</div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 퀵메뉴 */}
      <QuickMenu
        buttons={[
          {
            id: "team-switch",
            icon: "🔄",
            title: "턴 변경",
            onClick: handleTeamSwitch,
            color: "switch",
          },
          {
            id: "restart",
            icon: "🎮",
            title: "다시 시작",
            onClick: handleRestartGame,
            color: "restart",
          },
          {
            id: "reset-scores",
            icon: "🗑️",
            title: "점수 초기화",
            onClick: handleResetScores,
            color: "reset",
          },
        ]}
      />
    </div>
  );
};

export default NumberGame;
