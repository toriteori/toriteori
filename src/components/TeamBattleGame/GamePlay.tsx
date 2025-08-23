import React, { useState, useEffect } from "react";
import { GameState, Choice, StoryNode } from "../../types/form";
import { storyData } from "./SimpleGameSettings";
import { useScore } from "../../contexts/ScoreContext";
import TypingText from "./TypingText";
import ChoicePopup from "./ChoicePopup";

interface GamePlayProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onEndGame: () => void;
}

const GamePlay: React.FC<GamePlayProps> = ({ gameState, setGameState, onEndGame }) => {
  const { updateTeamScore } = useScore();
  
  // 현재 노드 데이터
  const [teamANodeData, setTeamANodeData] = useState<StoryNode | null>(null);
  const [teamBNodeData, setTeamBNodeData] = useState<StoryNode | null>(null);
  
  // 스토리 완료 상태
  const [storyCompleted, setStoryCompleted] = useState(false);
  
  // 팀별 선택 상태
  const [teamAChoice, setTeamAChoice] = useState<Choice | null>(null);
  const [teamBChoice, setTeamBChoice] = useState<Choice | null>(null);
  
  // 점수 변화 표시
  const [teamAScoreChange, setTeamAScoreChange] = useState<number | null>(null);
  const [teamBScoreChange, setTeamBScoreChange] = useState<number | null>(null);

  // 노드 데이터 로드
  useEffect(() => {
    const teamAData = storyData[gameState.teamANode as keyof typeof storyData];
    const teamBData = storyData[gameState.teamBNode as keyof typeof storyData];
    
    setTeamANodeData(teamAData || null);
    setTeamBNodeData(teamBData || null);
    setStoryCompleted(false);
    setTeamAChoice(null);
    setTeamBChoice(null);
  }, [gameState.teamANode, gameState.teamBNode]);

  // 점수 변화 표시 후 리셋
  useEffect(() => {
    if (teamAScoreChange !== null || teamBScoreChange !== null) {
      const timer = setTimeout(() => {
        setTeamAScoreChange(null);
        setTeamBScoreChange(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [teamAScoreChange, teamBScoreChange]);

  // 두 팀 모두 선택 완료 시 처리
  useEffect(() => {
    const isTeamAEnding = teamANodeData && teamANodeData.choices.length === 0;
    const isTeamBEnding = teamBNodeData && teamBNodeData.choices.length === 0;
    
    // 두 팀 모두 선택을 완료했거나, 한 팀이 엔딩에 도달한 경우
    if ((teamAChoice && teamBChoice) || 
        (teamAChoice && isTeamBEnding) || 
        (teamBChoice && isTeamAEnding)) {
      
      console.log("두 팀 선택 완료, 다음 단계로 진행");
      
      setTimeout(() => {
        processChoices();
      }, 1000);
    }
  }, [teamAChoice, teamBChoice, teamANodeData, teamBNodeData]);

  // 선택지 처리 함수
  const handleChoice = (team: "A" | "B", choice: Choice) => {
    console.log(`${team}팀 선택:`, choice.text);
    
    // 선택 저장
    if (team === "A") {
      setTeamAChoice(choice);
    } else {
      setTeamBChoice(choice);
    }
  };

  // 선택지 처리 함수
  const processChoices = () => {
    if (!teamAChoice && !teamBChoice) return;
    
    const isTeamAEnding = teamANodeData && teamANodeData.choices.length === 0;
    const isTeamBEnding = teamBNodeData && teamBNodeData.choices.length === 0;
    
    // 점수 계산 및 업데이트
    if (teamAChoice && !isTeamAEnding) {
      const scoreChange = teamAChoice.scoreA;
      const newScore = gameState.teamAScore + scoreChange;
      setTeamAScoreChange(scoreChange);
      updateTeamScore("team1", scoreChange);
      
      setGameState(prev => ({
        ...prev,
        teamAScore: newScore,
        teamANode: teamAChoice.next,
      }));
    }
    
    if (teamBChoice && !isTeamBEnding) {
      const scoreChange = teamBChoice.scoreB;
      const newScore = gameState.teamBScore + scoreChange;
      setTeamBScoreChange(scoreChange);
      updateTeamScore("team2", scoreChange);
      
      setGameState(prev => ({
        ...prev,
        teamBScore: newScore,
        teamBNode: teamBChoice.next,
      }));
    }
    
    // 히스토리 업데이트
    setGameState(prev => ({
      ...prev,
      gameHistory: [
        ...prev.gameHistory,
        {
          node: prev.teamANode,
          teamAChoice: teamAChoice,
          teamBChoice: teamBChoice,
          teamAScore: teamAChoice ? prev.teamAScore + teamAChoice.scoreA : prev.teamAScore,
          teamBScore: teamBChoice ? prev.teamBScore + teamBChoice.scoreB : prev.teamBScore,
        }
      ]
    }));
  };

  // 스토리 완료 처리
  const handleStoryComplete = () => {
    // 모든 TypingText 컴포넌트에 스킵 이벤트 발생
    window.dispatchEvent(new Event('skip-typing'));
    setStoryCompleted(true);
  };

  // 텍스트 포맷팅
  const formatText = (text: string) => {
    return text
      .replace("{teamAName}", gameState.teamAName)
      .replace("{teamBName}", gameState.teamBName);
  };

  // 시작 노드인지 확인
  const isStartNode = gameState.teamANode === "start" && gameState.teamBNode === "start";

  // 엔딩 노드인지 확인 (선택지가 없는 노드)
  const isTeamAEnding = teamANodeData && teamANodeData.choices.length === 0;
  const isTeamBEnding = teamBNodeData && teamBNodeData.choices.length === 0;

  // 게임 종료 확인
  const handleEndGame = () => {
    onEndGame();
  };

  if (!teamANodeData || !teamBNodeData) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="game-play">
      {/* 점수 변화 표시 */}
      <div className="floating-score-indicators">
        <div className="team-a-indicator">
          <div className={`score-icon team-a-icon ${teamAScoreChange !== null ? (teamAScoreChange >= 0 ? "positive" : "negative") : ""}`}>
            A
          </div>
        </div>
        <div className="team-b-indicator">
          <div className={`score-icon team-b-icon ${teamBScoreChange !== null ? (teamBScoreChange >= 0 ? "positive" : "negative") : ""}`}>
            B
          </div>
        </div>
      </div>

      {/* 스토리 텍스트 */}
      {isStartNode ? (
        // 시작 노드: 공통 스토리
        <div className="story-sections">
          <div className="team-story-section common-story">
            <h3>스토리</h3>
            <div className="story-text">
              <TypingText
                text={formatText(teamANodeData.text)}
                speed={50}
                className="story-typing"
                skipable={true}
                onComplete={handleStoryComplete}
              />
            </div>
          </div>
        </div>
      ) : (
        // 일반 노드: 팀별 스토리를 하나의 스킵 버튼으로 통합
        <div className="story-sections">
          <div className="team-story-section team-a-story">
            <h3>{gameState.teamAName} 파티 스토리</h3>
            <div className="story-text">
              <TypingText
                text={formatText(teamANodeData.text)}
                speed={50}
                className="story-typing"
                skipable={true}
                onComplete={() => {}}
              />
            </div>
          </div>

          <div className="team-story-section team-b-story">
            <h3>{gameState.teamBName} 파티 스토리</h3>
            <div className="story-text">
              <TypingText
                text={formatText(teamBNodeData.text)}
                speed={50}
                className="story-typing"
                skipable={true}
                onComplete={() => {}}
              />
            </div>
          </div>
        </div>
      )}

      {/* 플로팅 스킵 버튼 */}
      {!storyCompleted && !isTeamAEnding && !isTeamBEnding && (
        <div className="floating-skip-button">
          <button 
            className="skip-btn"
            onClick={handleStoryComplete}
            title="스토리 스킵"
          >
            ⏭️ 스킵
          </button>
        </div>
      )}

      {/* 대기 메시지 */}
      {storyCompleted && (teamAChoice || teamBChoice) && !(teamAChoice && teamBChoice) && (
        <div className="waiting-message">
          {teamAChoice && !teamBChoice && `${gameState.teamBName} 파티의 선택을 기다리는 중...`}
          {teamBChoice && !teamAChoice && `${gameState.teamAName} 파티의 선택을 기다리는 중...`}
        </div>
      )}

      {/* 선택지 영역 */}
      {storyCompleted && (
        <div className="side-choices-container">
          {/* 팀 A 선택지 */}
          <div className="left-choices">
            {!isTeamAEnding && teamANodeData.choices.length > 0 ? (
              <div className="team-choices">
                <h3>{gameState.teamAName} 파티 선택</h3>
                <div className="choices-list">
                  {teamANodeData.choices.map((choice: Choice, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleChoice("A", choice)}
                      className={`choice-button ${teamAChoice && teamAChoice.text === choice.text ? "selected" : ""}`}
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="team-finished">
                <h3>{gameState.teamAName} 파티</h3>
                <p>모험이 완료되었습니다!</p>
              </div>
            )}
          </div>

          {/* 팀 B 선택지 */}
          <div className="right-choices">
            {!isTeamBEnding && teamBNodeData.choices.length > 0 ? (
              <div className="team-choices">
                <h3>{gameState.teamBName} 파티 선택</h3>
                <div className="choices-list">
                  {teamBNodeData.choices.map((choice: Choice, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleChoice("B", choice)}
                      className={`choice-button ${teamBChoice && teamBChoice.text === choice.text ? "selected" : ""}`}
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="team-finished">
                <h3>{gameState.teamBName} 파티</h3>
                <p>모험이 완료되었습니다!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 게임 종료 메시지 */}
      {isTeamAEnding && isTeamBEnding && (
        <div className="game-end-message">
          <h2>모든 파티의 모험이 완료되었습니다!</h2>
          <p>최종 결과를 확인해보세요!</p>
          <button className="end-game-btn" onClick={handleEndGame}>
            🏆 결과 보기
          </button>
        </div>
      )}
    </div>
  );
};

export default GamePlay;
