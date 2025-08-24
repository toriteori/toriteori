import React, { useState, useEffect } from 'react';
import { useScore } from '../../contexts/ScoreContext';
import { useNavigate } from 'react-router-dom';
import { worldInfo, storyNodes, storyMap, StoryNode, StoryChoice } from '../../data/storyData';

type GameState = 'setup' | 'playing' | 'finished';

interface TeamChoice {
  teamId: string;
  choiceIndex: number;
  choice: StoryChoice;
}

interface GameProgress {
  currentNodeId: string;
  teamAScore: number;
  teamBScore: number;
  visitedNodes: string[];
  teamChoices: {
    teamA: StoryChoice | null;
    teamB: StoryChoice | null;
  };
  waitingForChoices: boolean;
  lastChoicesSame: boolean | null;
  dynamicStoryText: string;
}

const StoryGame: React.FC = () => {
  const { teams, updateTeamScore } = useScore();
  const navigate = useNavigate();
  
  const [gameState, setGameState] = useState<GameState>('setup');
  const [progress, setProgress] = useState<GameProgress>({
    currentNodeId: 'start',
    teamAScore: 0,
    teamBScore: 0,
    visitedNodes: [],
    teamChoices: {
      teamA: null,
      teamB: null
    },
    waitingForChoices: false,
    lastChoicesSame: null,
    dynamicStoryText: ''
  });
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [isTextAnimating, setIsTextAnimating] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChoicesPanel, setShowChoicesPanel] = useState(false);
  const [teamACurrentNode, setTeamACurrentNode] = useState<string>('start');
  const [teamBCurrentNode, setTeamBCurrentNode] = useState<string>('start');
  const [individualMode, setIndividualMode] = useState(false);
  const [teamADisplayedText, setTeamADisplayedText] = useState('');
  const [teamBDisplayedText, setTeamBDisplayedText] = useState('');
  const [teamATyping, setTeamATyping] = useState(false);
  const [teamBTyping, setTeamBTyping] = useState(false);
  const [showIndividualChoices, setShowIndividualChoices] = useState(false);
  const [teamAHasChosen, setTeamAHasChosen] = useState(false);
  const [teamBHasChosen, setTeamBHasChosen] = useState(false);

  // 현재 노드 업데이트
  useEffect(() => {
    const node = storyMap.get(progress.currentNodeId);
    if (node) {
      setCurrentNode(node);
      setIsTextAnimating(true);
      setDisplayedText('');
      setIsTyping(true);
      setShowChoicesPanel(false);
      
      // 타이핑 효과 시작
      startTypingEffect(node);
    }
  }, [progress.currentNodeId]);



  // 타이핑 효과 스킵 함수들
  const skipMainTyping = () => {
    const node = storyMap.get(progress.currentNodeId);
    if (node) {
      const fullText = formatText(node.text) + (progress.dynamicStoryText ? '\n\n' + formatText(progress.dynamicStoryText) : '');
      setDisplayedText(fullText);
      setIsTyping(false);
      setIsTextAnimating(false);
      
      setTimeout(() => {
        setShowChoicesPanel(true);
      }, 100);
    }
  };

  const skipAllTyping = () => {
    // 메인 스토리 스킵
    if (isTyping) {
      skipMainTyping();
    }
    
    // 개별 모드에서 두 팀 모두 스킵
    if (teamATyping) {
      const nodeA = storyMap.get(teamACurrentNode);
      if (nodeA) {
        setTeamADisplayedText(formatText(nodeA.text));
        setTeamATyping(false);
      }
    }
    
    if (teamBTyping) {
      const nodeB = storyMap.get(teamBCurrentNode);
      if (nodeB) {
        setTeamBDisplayedText(formatText(nodeB.text));
        setTeamBTyping(false);
      }
    }
    
    // 스킵 완료 (자동 선택지 표시 제거)
  };

  // 두 팀의 스토리가 모두 끝났는지 확인
  const areBothTeamsReady = () => {
    if (!individualMode) return false;
    
    const teamANode = storyMap.get(teamACurrentNode);
    const teamBNode = storyMap.get(teamBCurrentNode);
    
    // 두 팀 모두 타이핑이 끝났고, 선택지가 있는 상태여야 함
    return !teamATyping && !teamBTyping && 
           teamANode && teamBNode && 
           teamANode.choices.length > 0 && teamBNode.choices.length > 0 &&
           !teamANode.isEnding && !teamBNode.isEnding;
  };

  // 선택지 표시 버튼 클릭
  const handleShowChoices = () => {
    setShowIndividualChoices(true);
  };

  // 개별 팀용 타이핑 효과 함수
  const startTeamTypingEffect = (team: 'teamA' | 'teamB', text: string) => {
    const setDisplayedText = team === 'teamA' ? setTeamADisplayedText : setTeamBDisplayedText;
    const setIsTyping = team === 'teamA' ? setTeamATyping : setTeamBTyping;
    
    let currentIndex = 0;
    setDisplayedText('');
    setIsTyping(true);
    
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        
        // 타이핑 완료만 처리 (자동 선택지 표시 제거)
      }
    }, 30);
    
    return () => clearInterval(typingInterval);
  };

  // 타이핑 효과 함수
  const startTypingEffect = (node: StoryNode) => {
    const fullText = formatText(node.text) + (progress.dynamicStoryText ? '\n\n' + formatText(progress.dynamicStoryText) : '');
    let currentIndex = 0;
    setDisplayedText('');
    
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setIsTextAnimating(false);
        
        // 타이핑 완료 후 선택지 패널 표시
        setTimeout(() => {
          setShowChoicesPanel(true);
        }, 500);
      }
    }, 30); // 30ms마다 한 글자씩
    
    return () => clearInterval(typingInterval);
  };

  const startGame = () => {
    if (teams.length >= 2) {
      setGameState('playing');
      setProgress({
        currentNodeId: 'start',
        teamAScore: 0,
        teamBScore: 0,
        visitedNodes: ['start'],
        teamChoices: {
          teamA: null,
          teamB: null
        },
        waitingForChoices: false,
        lastChoicesSame: null,
        dynamicStoryText: ''
      });
    }
  };

  const handleTeamChoice = (teamId: 'teamA' | 'teamB', choice: StoryChoice) => {
    if (isTextAnimating) return;

    // 해당 팀의 선택 저장
    const newProgress = {
      ...progress,
      teamChoices: {
        ...progress.teamChoices,
        [teamId]: choice
      },
      waitingForChoices: true
    };

    setProgress(newProgress);

    // 두 팀이 모두 선택했는지 확인
    const otherTeamId = teamId === 'teamA' ? 'teamB' : 'teamA';
    if (newProgress.teamChoices[otherTeamId] !== null) {
      // 두 팀이 모두 선택했으면 다음 단계로 진행
      processTeamChoices(newProgress);
    }
  };

  const processTeamChoices = (currentProgress: GameProgress) => {
    const teamAChoice = currentProgress.teamChoices.teamA!;
    const teamBChoice = currentProgress.teamChoices.teamB!;


    // 점수 업데이트
    updateTeamScore(teams[0].id, teamAChoice.scoreA);
    updateTeamScore(teams[1].id, teamBChoice.scoreB);

    // 첫 번째 선택 후부터는 개별 모드로 전환
    setIndividualMode(true);
    setTeamACurrentNode(teamAChoice.next);
    setTeamBCurrentNode(teamBChoice.next);
    
    // 각 팀의 첫 개별 스토리 타이핑 효과 시작
    const teamANode = storyMap.get(teamAChoice.next);
    const teamBNode = storyMap.get(teamBChoice.next);
    if (teamANode) {
      startTeamTypingEffect('teamA', formatText(teamANode.text));
    }
    if (teamBNode) {
      startTeamTypingEffect('teamB', formatText(teamBNode.text));
    }
    
    // progress 초기화
    setProgress({
      ...currentProgress,
      teamChoices: { teamA: null, teamB: null },
      waitingForChoices: false
    });
  };

  // 개별 모드에서 팀 선택 처리
  const handleIndividualChoice = (team: 'teamA' | 'teamB', choice: StoryChoice) => {
    // 점수 업데이트
    const teamId = team === 'teamA' ? teams[0].id : teams[1].id;
    const score = team === 'teamA' ? choice.scoreA : choice.scoreB;
    updateTeamScore(teamId, score);

    // 해당 팀의 선택 완료 표시
    if (team === 'teamA') {
      setTeamAHasChosen(true);
    } else {
      setTeamBHasChosen(true);
    }

    // 두 팀 모두 선택했으면 선택지 패널 숨기고 상태 초기화
    const bothChosen = (team === 'teamA' ? true : teamAHasChosen) && 
                      (team === 'teamB' ? true : teamBHasChosen);
    
    if (bothChosen) {
      setShowIndividualChoices(false);
      setTeamAHasChosen(false);
      setTeamBHasChosen(false);
    }

    // 각 팀의 노드 업데이트
    if (team === 'teamA') {
      setTeamACurrentNode(choice.next);
      const nextNode = storyMap.get(choice.next);
      if (nextNode) {
        startTeamTypingEffect('teamA', formatText(nextNode.text));
      }
    } else {
      setTeamBCurrentNode(choice.next);
      const nextNode = storyMap.get(choice.next);
      if (nextNode) {
        startTeamTypingEffect('teamB', formatText(nextNode.text));
      }
    }

    // 엔딩 체크
    const nextNode = storyMap.get(choice.next);
    if (nextNode?.isEnding) {
      // 두 팀 모두 엔딩에 도달했는지 확인
      const otherTeamNode = team === 'teamA' ? 
        storyMap.get(teamBCurrentNode) : 
        storyMap.get(teamACurrentNode);
      
      if (otherTeamNode?.isEnding) {
        setTimeout(() => {
          setGameState('finished');
        }, 2000);
      }
    }
  };

  const resolveConflictingChoices = (teamAChoice: StoryChoice, teamBChoice: StoryChoice): string => {
    // 갈등 상황에서 어떤 선택을 따를지 결정하는 로직
    // 여러 방법이 있습니다:
    
    // 1. 점수가 높은 선택을 따르기
    const teamATotalScore = teamAChoice.scoreA + teamAChoice.scoreB;
    const teamBTotalScore = teamBChoice.scoreA + teamBChoice.scoreB;
    
    if (teamATotalScore >= teamBTotalScore) {
      return teamAChoice.next;
    } else {
      return teamBChoice.next;
    }
    
    // 2. 랜덤하게 선택하기 (대안)
    // return Math.random() > 0.5 ? teamAChoice.next : teamBChoice.next;
    
    // 3. 특별한 갈등 노드로 이동 (나중에 구현 가능)
    // return 'conflict_resolution';
  };

  const restartGame = () => {
    setGameState('setup');
    setProgress({
      currentNodeId: 'start',
      teamAScore: 0,
      teamBScore: 0,
      visitedNodes: [],
      teamChoices: {
        teamA: null,
        teamB: null
      },
      waitingForChoices: false,
      lastChoicesSame: null,
      dynamicStoryText: ''
    });
  };

  const goToMain = () => {
    navigate('/main');
  };

  // 텍스트에서 팀 이름 치환
  const formatText = (text: string) => {
    return text
      .replace(/{teamA}/g, teams[0]?.name || '팀 A')
      .replace(/{teamB}/g, teams[1]?.name || '팀 B');
  };

  if (gameState === 'setup') {
    return (
      <div className="story-game">
        <div className="game-setup">
          <h1>{worldInfo.title}</h1>
          
          <div className="world-description">
            <h3>🌍 {worldInfo.world.name} 세계관</h3>
            <p>{worldInfo.world.description}</p>
            
            <div className="world-elements">
              <div className="element">
                <h4>⏰ 시간의 계단</h4>
                <p>{worldInfo.keyElements.timeStairs}</p>
              </div>
              
              <div className="element">
                <h4>🕐 시간 지분</h4>
                <p>{worldInfo.keyElements.timeDivision}</p>
              </div>
              
              <div className="element">
                <h4>👥 7대 종족</h4>
                <p>{worldInfo.keyElements.sevenTribes}</p>
              </div>
            </div>
          </div>

          <div className="team-display">
            <div className="team-info">
              <h3>참가 팀</h3>
              {teams.length >= 2 ? (
                <div className="teams">
                  <div className="team" style={{ color: teams[0].color }}>
                    <span className="team-name">{teams[0].name || '팀 A'}</span>
                    <span className="team-score">현재 점수: {teams[0].score}</span>
                  </div>
                  <div className="team" style={{ color: teams[1].color }}>
                    <span className="team-name">{teams[1].name || '팀 B'}</span>
                    <span className="team-score">현재 점수: {teams[1].score}</span>
                  </div>
                </div>
              ) : (
                <p className="error">⚠️ 메인 화면에서 팀을 먼저 설정해주세요!</p>
              )}
            </div>
          </div>

          <div className="game-controls">
            <button 
              className="start-btn" 
              onClick={startGame}
              disabled={teams.length < 2}
            >
              🚀 모험 시작하기
            </button>
            <button className="back-btn" onClick={goToMain}>
              🏠 메인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing' && currentNode) {
    return (
      <div className="story-game">
        <div className="game-header">
          <h2>{worldInfo.title}</h2>
          <p className="game-subtitle">
            🔮 시간의 세계에서 펼쳐지는 모험
          </p>
        </div>

        <div className="story-content">
          {individualMode ? (
            // 개별 진행 모드 - 각 팀이 독립적으로 진행
            <div className="individual-story-layout">
              {/* 팀 A 스토리 */}
              <div className="team-story-panel" style={{ borderColor: teams[0].color }}>
                <div className="team-story-header" style={{ backgroundColor: teams[0].color }}>
                  <h3>{teams[0].name}의 모험</h3>
                  <p className="time-dimension">🕐 독립적 진행</p>
                </div>
                <div className="team-story-content">
                  {(() => {
                    const teamANode = storyMap.get(teamACurrentNode);
                    return teamANode ? (
                      <>
                        <div className="team-story-container">
                          <div className={`team-story-text ${teamATyping ? 'typing' : ''}`}>
                            {(teamADisplayedText || teamANode.text).split('\n').map((line, index) => (
                              <p key={index}>
                                {line}
                                {teamATyping && index === (teamADisplayedText || teamANode.text).split('\n').length - 1 && (
                                  <span className="typing-cursor">|</span>
                                )}
                              </p>
                            ))}
                          </div>
                        </div>
                        {teamANode.isEnding && (
                          <div className="team-ending">
                            <h4>🏁 {teams[0].name} 모험 완료!</h4>
                          </div>
                        )}
                      </>
                    ) : null;
                  })()}
                </div>
              </div>
              
              <div className="story-divider">
                <div className="divider-line"></div>
                <div className="divider-icon">⚡</div>
                <div className="divider-text">독립 진행</div>
                <div className="divider-line"></div>
              </div>
              
              {/* 팀 B 스토리 */}
              <div className="team-story-panel" style={{ borderColor: teams[1].color }}>
                <div className="team-story-header" style={{ backgroundColor: teams[1].color }}>
                  <h3>{teams[1].name}의 모험</h3>
                  <p className="time-dimension">🕕 독립적 진행</p>
                </div>
                <div className="team-story-content">
                  {(() => {
                    const teamBNode = storyMap.get(teamBCurrentNode);
                    return teamBNode ? (
                      <>
                        <div className="team-story-container">
                          <div className={`team-story-text ${teamBTyping ? 'typing' : ''}`}>
                            {(teamBDisplayedText || teamBNode.text).split('\n').map((line, index) => (
                              <p key={index}>
                                {line}
                                {teamBTyping && index === (teamBDisplayedText || teamBNode.text).split('\n').length - 1 && (
                                  <span className="typing-cursor">|</span>
                                )}
                              </p>
                            ))}
                          </div>
                        </div>
                        {teamBNode.isEnding && (
                          <div className="team-ending">
                            <h4>🏁 {teams[1].name} 모험 완료!</h4>
                          </div>
                        )}
                      </>
                    ) : null;
                  })()}
                </div>
              </div>
              
              {/* 개별 모드 통합 스킵 버튼 */}
              {(teamATyping || teamBTyping) && (
                <button className="skip-btn unified-skip" onClick={skipAllTyping}>
                  ⏭️ 스킵
                </button>
              )}
              
              {/* 선택하기 버튼 - 두 팀 스토리가 모두 끝났을 때 */}
              {areBothTeamsReady() && !showIndividualChoices && (
                <div className="choice-ready-notice">
                  <div className="ready-content">
                    <h4>📝 두 팀의 스토리가 완료되었습니다!</h4>
                    <p>이제 각 팀이 다음 선택을 할 수 있습니다.</p>
                    <button className="show-choices-btn" onClick={handleShowChoices}>
                      🎯 선택하기
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // 단일 레이아웃 - 두 팀이 같은 선택을 했을 때
            <div className="main-story-container">
              <div className={`story-text ${isTyping ? 'typing' : ''}`}>
                {displayedText.split('\n').map((line, index) => (
                  <p key={index}>
                    {line}
                    {isTyping && index === displayedText.split('\n').length - 1 && (
                      <span className="typing-cursor">|</span>
                    )}
                  </p>
                ))}
              </div>
              {isTyping && (
                <button className="skip-btn main-skip" onClick={skipAllTyping}>
                  ⏭️ 스킵
                </button>
              )}
            </div>
          )}

          {/* 플로팅 선택지 패널 - 메인 모드 */}
          {showChoicesPanel && currentNode.choices.length > 0 && !individualMode && (
            <div className="choices-panels">
              <div className="floating-overlay"></div>
              {/* 왼쪽 팀 선택지 */}
              <div className={`choice-panel left-panel slide-in-left`} 
                   style={{ borderColor: teams[0].color }}>
                <div className="panel-header" style={{ backgroundColor: teams[0].color }}>
                  <h3>{teams[0].name}의 선택</h3>
                  <div className="status-indicator">
                    {progress.teamChoices.teamA ? '✅' : '⏳'}
                  </div>
                </div>
                <div className="panel-content">
                  {currentNode.choices.map((choice, index) => (
                    <button
                      key={index}
                      className={`panel-choice-btn ${progress.teamChoices.teamA === choice ? 'selected' : ''}`}
                      onClick={() => handleTeamChoice('teamA', choice)}
                      disabled={progress.teamChoices.teamA !== null}
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* 오른쪽 팀 선택지 */}
              <div className={`choice-panel right-panel slide-in-right`} 
                   style={{ borderColor: teams[1].color }}>
                <div className="panel-header" style={{ backgroundColor: teams[1].color }}>
                  <h3>{teams[1].name}의 선택</h3>
                  <div className="status-indicator">
                    {progress.teamChoices.teamB ? '✅' : '⏳'}
                  </div>
                </div>
                <div className="panel-content">
                  {currentNode.choices.map((choice, index) => (
                    <button
                      key={index}
                      className={`panel-choice-btn ${progress.teamChoices.teamB === choice ? 'selected' : ''}`}
                      onClick={() => handleTeamChoice('teamB', choice)}
                      disabled={progress.teamChoices.teamB !== null}
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 양 팀이 모두 선택했을 때 결과 표시 */}
          {progress.teamChoices.teamA && progress.teamChoices.teamB && (
            <div className="choices-result">
              <h4>📊 선택 결과</h4>
              <div className="choice-comparison">
                <div className="team-choice" style={{ borderColor: teams[0].color }}>
                  <strong>{teams[0].name}</strong>
                  <span className="choice-name">{progress.teamChoices.teamA.text}</span>
                </div>
                <div className="team-choice" style={{ borderColor: teams[1].color }}>
                  <strong>{teams[1].name}</strong>
                  <span className="choice-name">{progress.teamChoices.teamB.text}</span>
                </div>
              </div>
              {progress.teamChoices.teamA.next === progress.teamChoices.teamB.next ? (
                <p className="agreement-notice">
                  🤝 두 팀이 같은 선택을 했습니다! 조화로운 결정이네요!
                </p>
              ) : (
                <p className="conflict-notice">
                  ⚔️ 두 팀의 선택이 다릅니다! 결과를 처리 중...
                </p>
              )}
            </div>
          )}

          {currentNode.isEnding && (
            <div className="ending-notice">
              <h3>🎭 스토리가 곧 종료됩니다...</h3>
              <p>최종 점수가 팀 점수에 반영됩니다.</p>
            </div>
          )}

          {/* 플로팅 선택지 패널 - 개별 모드 */}
          {showIndividualChoices && individualMode && (
            <div className="choices-panels">
              <div className="floating-overlay"></div>
              {/* 왼쪽 팀 선택지 */}
              <div className={`choice-panel left-panel slide-in-left`} 
                   style={{ borderColor: teams[0].color }}>
                <div className="panel-header" style={{ backgroundColor: teams[0].color }}>
                  <h3>{teams[0].name}의 선택</h3>
                  <div className="status-indicator">
                    {teamAHasChosen ? '✅' : '⏳'}
                  </div>
                </div>
                <div className="panel-content">
                  {(() => {
                    const teamANode = storyMap.get(teamACurrentNode);
                    if (teamAHasChosen) {
                      return <p style={{color: '#4caf50', fontWeight: 'bold'}}>✅ 선택 완료!</p>;
                    }
                    return teamANode && teamANode.choices.length > 0 && !teamANode.isEnding ? 
                      teamANode.choices.map((choice, index) => (
                        <button
                          key={index}
                          className="panel-choice-btn"
                          onClick={() => handleIndividualChoice('teamA', choice)}
                        >
                          {choice.text}
                        </button>
                      )) : <p>선택지가 없습니다.</p>;
                  })()}
                </div>
              </div>

              {/* 오른쪽 팀 선택지 */}
              <div className={`choice-panel right-panel slide-in-right`} 
                   style={{ borderColor: teams[1].color }}>
                <div className="panel-header" style={{ backgroundColor: teams[1].color }}>
                  <h3>{teams[1].name}의 선택</h3>
                  <div className="status-indicator">
                    {teamBHasChosen ? '✅' : '⏳'}
                  </div>
                </div>
                <div className="panel-content">
                  {(() => {
                    const teamBNode = storyMap.get(teamBCurrentNode);
                    if (teamBHasChosen) {
                      return <p style={{color: '#4caf50', fontWeight: 'bold'}}>✅ 선택 완료!</p>;
                    }
                    return teamBNode && teamBNode.choices.length > 0 && !teamBNode.isEnding ? 
                      teamBNode.choices.map((choice, index) => (
                        <button
                          key={index}
                          className="panel-choice-btn"
                          onClick={() => handleIndividualChoice('teamB', choice)}
                        >
                          {choice.text}
                        </button>
                      )) : <p>선택지가 없습니다.</p>;
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    );
  }

  if (gameState === 'finished') {
    // 승자 결정
    const winner = progress.teamAScore > progress.teamBScore ? teams[0] : 
                   progress.teamBScore > progress.teamAScore ? teams[1] : null;
    
    return (
      <div className="story-game">
        <div className="game-finished">
          <h1>🎭 아를리아 모험 완료!</h1>
          
          <div className="dramatic-reveal">
            <h2>🎁 숨겨진 점수 공개!</h2>
            <p>두 팀의 선택들이 어떤 결과를 가져왔을까요?</p>
          </div>
          
          <div className="final-scores">
            <h3>⚡ 최종 점수 발표 ⚡</h3>
            <div className="score-reveal">
              <div className={`team-final ${winner === teams[0] ? 'winner' : ''}`} 
                   style={{ borderColor: teams[0].color }}>
                <div className="team-name" style={{ color: teams[0].color }}>
                  {winner === teams[0] ? '👑 ' : ''}{teams[0].name}
                </div>
                <div className="score-breakdown">
                  <span className="story-score">스토리 점수: {progress.teamAScore}점</span>
                  <span className="previous-score">이전 점수: {teams[0].score - progress.teamAScore}점</span>
                  <div className="total-score">
                    총 점수: <strong>{teams[0].score}점</strong>
                  </div>
                </div>
              </div>
              
              <div className="vs-final">VS</div>
              
              <div className={`team-final ${winner === teams[1] ? 'winner' : ''}`} 
                   style={{ borderColor: teams[1].color }}>
                <div className="team-name" style={{ color: teams[1].color }}>
                  {winner === teams[1] ? '👑 ' : ''}{teams[1].name}
                </div>
                <div className="score-breakdown">
                  <span className="story-score">스토리 점수: {progress.teamBScore}점</span>
                  <span className="previous-score">이전 점수: {teams[1].score - progress.teamBScore}점</span>
                  <div className="total-score">
                    총 점수: <strong>{teams[1].score}점</strong>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="winner-announcement">
              {winner ? (
                <h2 className="winner-text" style={{ color: winner.color }}>
                  🏆 {winner.name} 승리! 🏆
                </h2>
              ) : (
                <h2 className="tie-text">
                  🤝 무승부! 두 팀 모두 훌륭했습니다! 🤝
                </h2>
              )}
            </div>
          </div>

          <div className="story-summary">
            <h3>📖 모험 기록</h3>
            <div className="adventure-stats">
              <div className="stat">
                <span className="stat-icon">🗺️</span>
                <span>방문한 장소: {progress.visitedNodes.length}곳</span>
              </div>
              <div className="stat">
                <span className="stat-icon">⏰</span>
                <span>시간의 세계 탐험 완료</span>
              </div>
              <div className="stat">
                <span className="stat-icon">🔮</span>
                <span>두 팀의 선택이 만든 독특한 이야기</span>
              </div>
            </div>
          </div>

          <div className="final-controls">
            <button className="restart-btn" onClick={restartGame}>
              🔄 새로운 모험 시작
            </button>
            <button className="main-btn" onClick={goToMain}>
              🏠 메인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StoryGame;
