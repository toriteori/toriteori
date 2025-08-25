import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { worldInfo, storyMap, StoryNode, StoryChoice } from "../../data/storyData";
import { useScore } from "../../contexts/ScoreContext";

interface GameProgress {
  currentNodeId: string;
  score: number;
  visitedNodes: string[];
  hiddenFlags: number;
  trustLevel: number;
  alliances: string[];
}

interface TeamState {
  progress: GameProgress;
  currentNode: StoryNode | null;
  displayedText: string;
  isTyping: boolean;
  showChoices: boolean;
  showScoreChange: boolean;
  scoreChange: number;
  gameStarted: boolean;
  typingInterval: number | null;
  scoreTimeout: number | null;
}

const DualTeamGame: React.FC = () => {
  const navigate = useNavigate();
  const { teams, updateTeamScore, getTotalScore } = useScore();

  // 팀 1 상태
  const [team1, setTeam1] = useState<TeamState>({
    progress: {
      currentNodeId: "start",
      score: 0,
      visitedNodes: [],
      hiddenFlags: 0,
      trustLevel: 0,
      alliances: [],
    },
    currentNode: null,
    displayedText: "",
    isTyping: false,
    showChoices: false,
    showScoreChange: false,
    scoreChange: 0,
    gameStarted: false,
    typingInterval: null,
    scoreTimeout: null,
  });

  // 팀 2 상태
  const [team2, setTeam2] = useState<TeamState>({
    progress: {
      currentNodeId: "start",
      score: 0,
      visitedNodes: [],
      hiddenFlags: 0,
      trustLevel: 0,
      alliances: [],
    },
    currentNode: null,
    displayedText: "",
    isTyping: false,
    showChoices: false,
    showScoreChange: false,
    scoreChange: 0,
    gameStarted: false,
    typingInterval: null,
    scoreTimeout: null,
  });

  const [bothGamesStarted, setBothGamesStarted] = useState(false);
  const [showScores, setShowScores] = useState(false); // 점수 표시 제어 (기본값: 숨김)
  const [waitingForBothTeams, setWaitingForBothTeams] = useState(false); // 두 팀 모두 선택할 때까지 대기

  // 팀별 노드 업데이트
  const updateTeamNode = (teamNumber: 1 | 2) => {
    const team = teamNumber === 1 ? team1 : team2;
    const setTeam = teamNumber === 1 ? setTeam1 : setTeam2;

    if (team.gameStarted) {
      const node = storyMap.get(team.progress.currentNodeId);
      if (node) {
        setTeam((prev) => ({
          ...prev,
          currentNode: node,
          displayedText: "",
          isTyping: true,
          showChoices: false,
        }));

        // 타이핑 효과 시작
        startTypingEffect(node.text, teamNumber);
      }
    }
  };

  // 팀 1 노드 업데이트
  useEffect(() => {
    updateTeamNode(1);
  }, [team1.progress.currentNodeId, team1.gameStarted]);

  // 팀 2 노드 업데이트
  useEffect(() => {
    updateTeamNode(2);
  }, [team2.progress.currentNodeId, team2.gameStarted]);

  // 타이핑 효과
  const startTypingEffect = (text: string, teamNumber: 1 | 2) => {
    let index = 0;
    const team = teamNumber === 1 ? team1 : team2;
    const setTeam = teamNumber === 1 ? setTeam1 : setTeam2;

    // 이전 인터벌 클리어
    if (team.typingInterval) {
      clearInterval(team.typingInterval);
    }

    const newInterval = setInterval(() => {
      if (index < text.length) {
        setTeam((prev) => ({
          ...prev,
          displayedText: text.substring(0, index + 1),
        }));
        index++;
      } else {
        clearInterval(newInterval);
        setTeam((prev) => ({
          ...prev,
          typingInterval: null,
          isTyping: false,
        }));
        setTimeout(() => {
          setTeam((prev) => ({
            ...prev,
            showChoices: true,
          }));
        }, 200);
      }
    }, 15);

    setTeam((prev) => ({
      ...prev,
      typingInterval: newInterval,
    }));
  };

  // 텍스트 포맷팅
  const formatStoryText = (text: string) => {
    return text.split("\n\n").map((paragraph, index) => (
      <p key={index} className="story-paragraph">
        {paragraph}
      </p>
    ));
  };

  const formatTypingText = (text: string) => {
    const paragraphs = text.split("\n\n");
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="story-paragraph">
        {paragraph}
      </p>
    ));
  };

  // 타이핑 스킵
  const skipTyping = (teamNumber: 1 | 2) => {
    const team = teamNumber === 1 ? team1 : team2;
    const setTeam = teamNumber === 1 ? setTeam1 : setTeam2;

    if (team.currentNode && team.isTyping && team.typingInterval) {
      clearInterval(team.typingInterval);
      setTeam((prev) => ({
        ...prev,
        typingInterval: null,
        displayedText: team.currentNode!.text,
        isTyping: false,
        showChoices: true,
      }));
    }
  };

  // 선택지 처리
  const handleChoice = (choice: StoryChoice, teamNumber: 1 | 2) => {
    const team = teamNumber === 1 ? team1 : team2;
    const setTeam = teamNumber === 1 ? setTeam1 : setTeam2;
    const teamId = teamNumber === 1 ? "team1" : "team2";

    const newScore = team.progress.score + choice.score;
    const newVisitedNodes = [...team.progress.visitedNodes, team.progress.currentNodeId];
    const newHiddenFlags = team.progress.hiddenFlags + (choice.hidden || 0);
    const newTrustLevel = team.progress.trustLevel + (choice.trust || 0);
    const newAlliances = choice.alliance
      ? [...team.progress.alliances, team.progress.currentNodeId]
      : team.progress.alliances;

    // 전체 점수 시스템에 점수 추가
    if (choice.score !== 0) {
      updateTeamScore(teamId, choice.score);
    }

    // 점수 변화 표시
    setTeam((prev) => ({
      ...prev,
      scoreChange: choice.score,
      showScoreChange: true,
      showChoices: false,
    }));

    // 점수 변화 애니메이션 후 다음 노드로 이동
    const timeout = setTimeout(() => {
      setTeam((prev) => ({
        ...prev,
        showScoreChange: false,
        progress: {
          currentNodeId: choice.next,
          score: newScore,
          visitedNodes: newVisitedNodes,
          hiddenFlags: newHiddenFlags,
          trustLevel: newTrustLevel,
          alliances: newAlliances,
        },
        scoreTimeout: null,
      }));
    }, 800);

    setTeam((prev) => ({
      ...prev,
      scoreTimeout: timeout,
    }));
  };

  // 게임 시작
  const startBothGames = () => {
    setBothGamesStarted(true);
    setTeam1((prev) => ({ ...prev, gameStarted: true }));
    setTeam2((prev) => ({ ...prev, gameStarted: true }));
  };

  // 점수 표시 토글
  const toggleScoreDisplay = () => {
    setShowScores(!showScores);
  };

  // 게임 재시작
  const restartGames = () => {
    const initialProgress = {
      currentNodeId: "start",
      score: 0,
      visitedNodes: [],
      hiddenFlags: 0,
      trustLevel: 0,
      alliances: [],
    };

    setTeam1((prev) => ({
      ...prev,
      progress: initialProgress,
      gameStarted: true,
      displayedText: "",
      isTyping: false,
      showChoices: false,
      showScoreChange: false,
    }));

    setTeam2((prev) => ({
      ...prev,
      progress: initialProgress,
      gameStarted: true,
      displayedText: "",
      isTyping: false,
      showChoices: false,
      showScoreChange: false,
    }));

    setBothGamesStarted(true);
  };

  // 게임 종료
  const endGame = () => {
    navigate("/");
  };

  // 게임 시작 전 화면
  if (!bothGamesStarted) {
    return (
      <div className="dual-team-game">
        <div className="game-intro">
          <div className="intro-header">
            <h1>🔥 {worldInfo.title} - 팀 대전 🔥</h1>
            <p className="intro-subtitle">두 팀이 동시에 플레이하여 더 높은 점수를 얻어보세요!</p>
          </div>

          <div className="intro-content">
            <div className="intro-section">
              <h2>🎮 게임 방법</h2>
              <ul>
                <li>
                  👥 <strong>팀 1</strong>과 <strong>팀 2</strong>가 같은 스토리를 동시에 진행
                </li>
                <li>⚡ 각 팀은 독립적으로 선택지를 선택</li>
                <li>🏆 최종 점수가 높은 팀이 승리</li>
                <li>🤝 협력과 전략이 중요합니다!</li>
              </ul>
            </div>

            <div className="intro-section">
              <h2>📋 게임 규칙</h2>
              <ul>
                <li>🎯 선택지마다 점수가 다름</li>
                <li>🕵️ 히든 플래그와 신뢰도 시스템</li>
                <li>⏰ 타이핑 중 클릭하면 스킵 가능</li>
                <li>🎊 점수 변화도 클릭으로 스킵 가능</li>
                <li>👁️ 점수 숨기기로 공정한 경쟁</li>
              </ul>
            </div>
          </div>

          <button className="start-button" onClick={startBothGames}>
            ⚔️ 팀 대전 시작! ⚔️
          </button>
        </div>
      </div>
    );
  }

  // 메인 게임 화면 (분할)
  return (
    <div className="dual-team-game">
      {/* 팀 스코어보드 */}
      <div className="team-scoreboard">
        <div className="team-score team-1">
          <h3>👥 팀 1</h3>
          {showScores ? (
            <div className="score-details">
              <span className="game-score">게임: {team1.progress.score}점</span>
              <span className="total-score">총합: {getTotalScore("team1")}점</span>
            </div>
          ) : (
            <div className="score-hidden">점수 숨김</div>
          )}
        </div>
        <div className="vs-divider">VS</div>
        <div className="team-score team-2">
          <h3>👥 팀 2</h3>
          {showScores ? (
            <div className="score-details">
              <span className="game-score">게임: {team2.progress.score}점</span>
              <span className="total-score">총합: {getTotalScore("team2")}점</span>
            </div>
          ) : (
            <div className="score-hidden">점수 숨김</div>
          )}
        </div>
      </div>

      {/* 게임 화면 분할 */}
      <div className="game-split-container">
        {/* 팀 1 게임 화면 */}
        <div className="team-game-area team-1-area">
          <div className="team-header">
            <h2>👥 팀 1</h2>
          </div>

          <div className="story-content">
            <div className="story-text" onClick={() => skipTyping(1)}>
              {team1.isTyping ? (
                <>
                  {formatTypingText(team1.displayedText)}
                  <span className="typing-cursor">|</span>
                </>
              ) : (
                formatStoryText(team1.displayedText)
              )}
            </div>

            {/* 팀 1 게임 종료 */}
            {team1.showChoices && team1.currentNode?.isEnding && (
              <div className="ending-container">
                <h2>🎉 팀 1 완료!</h2>
                <p>게임 점수: {team1.progress.score}점</p>
                <p>전체 누적: {getTotalScore("team1")}점</p>
              </div>
            )}
          </div>

          {/* 팀 1 점수 변화 */}
          {team1.showScoreChange && (
            <div className="score-floating-button">
              <div
                className={`score-indicator ${
                  team1.scoreChange > 0
                    ? "positive"
                    : team1.scoreChange < 0
                    ? "negative"
                    : "neutral"
                }`}
              ></div>
            </div>
          )}

          {/* 팀 1 선택지 */}
          {team1.showChoices && !team1.currentNode?.isEnding && (
            <div className="choice-popup-overlay">
              <div className="choice-popup">
                <h3>팀 1 - 선택하세요</h3>
                <div className="choice-buttons">
                  {team1.currentNode?.choices.map((choice, index) => (
                    <button
                      key={index}
                      className="choice-popup-button"
                      onClick={() => handleChoice(choice, 1)}
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 팀 2 게임 화면 */}
        <div className="team-game-area team-2-area">
          <div className="team-header">
            <h2>👥 팀 2</h2>
          </div>

          <div className="story-content">
            <div className="story-text" onClick={() => skipTyping(2)}>
              {team2.isTyping ? (
                <>
                  {formatTypingText(team2.displayedText)}
                  <span className="typing-cursor">|</span>
                </>
              ) : (
                formatStoryText(team2.displayedText)
              )}
            </div>

            {/* 팀 2 게임 종료 */}
            {team2.showChoices && team2.currentNode?.isEnding && (
              <div className="ending-container">
                <h2>🎉 팀 2 완료!</h2>
                <p>게임 점수: {team2.progress.score}점</p>
                <p>전체 누적: {getTotalScore("team2")}점</p>
              </div>
            )}
          </div>

          {/* 팀 2 점수 변화 */}
          {team2.showScoreChange && (
            <div className="score-floating-button">
              <div
                className={`score-indicator ${
                  team2.scoreChange > 0
                    ? "positive"
                    : team2.scoreChange < 0
                    ? "negative"
                    : "neutral"
                }`}
              ></div>
            </div>
          )}

          {/* 팀 2 선택지 */}
          {team2.showChoices && !team2.currentNode?.isEnding && (
            <div className="choice-popup-overlay">
              <div className="choice-popup">
                <h3>팀 2 - 선택하세요</h3>
                <div className="choice-buttons">
                  {team2.currentNode?.choices.map((choice, index) => (
                    <button
                      key={index}
                      className="choice-popup-button"
                      onClick={() => handleChoice(choice, 2)}
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 컨트롤 */}
      <div className="game-controls">
        <button className="score-toggle-button" onClick={toggleScoreDisplay}>
          {showScores ? "👁️ 점수 숨기기" : "👁️‍🗨️ 점수 보기"}
        </button>
        <button className="restart-button" onClick={restartGames}>
          🔄 다시 시작
        </button>
        <button className="exit-button" onClick={endGame}>
          🏠 메인으로
        </button>
      </div>
    </div>
  );
};

export default DualTeamGame;
