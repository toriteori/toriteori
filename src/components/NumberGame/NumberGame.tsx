import React, { useState, useEffect } from "react";
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
  const [gameState, setGameState] = useState<"start" | "preview" | "playing" | "finished">("start");
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [numberCards, setNumberCards] = useState<NumberCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [correctMatches, setCorrectMatches] = useState<{ [key: string]: number }>({
    team1: 0,
    team2: 0,
  });
  const [maxNumber, setMaxNumber] = useState<number>(25);
  const navigate = useNavigate();

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
    setGameState("start");
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

      // 턴 유지 (맞췄으므로)
    } else {
      // 매칭 실패 - 턴 변경 (카드를 다시 뒤집기)
      setNumberCards((prev) =>
        prev.map((c) =>
          selectedCardIds.includes(c.id) ? { ...c, isSelected: false, isFlipped: true } : c,
        ),
      );

      // 턴 변경
      setCurrentTeam(currentTeam === "team1" ? "team2" : "team1");
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

    // 승자 결정 및 점수 부여
    const team1Score = correctMatches.team1;
    const team2Score = correctMatches.team2;

    if (team1Score > team2Score) {
      updateTeamScore("team1", 500);
    } else if (team2Score > team1Score) {
      updateTeamScore("team2", 500);
    }
    // 동점인 경우 점수 부여 안함
  };

  const handleTeamSwitch = () => {
    setCurrentTeam(currentTeam === "team1" ? "team2" : "team1");
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

        {gameState === "start" && (
          <div className="start-screen">
            <div className="start-content">
              <h2>🍎 같은 숫자 맞추기</h2>
              <p className="game-rules">
                • 1~{maxNumber} 숫자를 {maxNumber === 10 ? 15 : 20}초 동안 기억하세요
                <br />
                • 같은 숫자를 찾아보세요
                <br />• 바둑판처럼 A1~{gridLayout.maxRowLabel}
                {gridLayout.columns} 위치로 말할 수 있습니다!
                <br />
                • 예: "A3에 7이 있다!" 또는 "B5와 D2가 같다!"
                <br />• 더 많이 맞춘 팀이 500점을 획득합니다!
              </p>
              <button onClick={startPreview} className="start-btn">
                🎮 게임 시작
              </button>
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
                  1~{maxNumber} 숫자를 {maxNumber === 10 ? 15 : 20}초 동안 기억하세요! ({timeLeft}초
                  남음)
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
              <p className="winner">🎉 {teams[0].name} 승리! 500점 획득!</p>
            ) : correctMatches.team2 > correctMatches.team1 ? (
              <p className="winner">🎉 {teams[1].name} 승리! 500점 획득!</p>
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
      </div>

      {gameState !== "start" && gameState !== "finished" && (
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
