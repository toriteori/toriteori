import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { GameState, Choice, StoryNode } from "../../types/form";
import { storyData } from "./SimpleGameSettings";
=======
import { GameState } from "./TeamBattleGame";
import { storyData } from "./GameSettings";
>>>>>>> origin/master
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
<<<<<<< HEAD
  

  
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

  // 노드 데이터 로드 (정적 시스템으로 복원)
  useEffect(() => {
    const teamAData = storyData[gameState.teamANode as keyof typeof storyData];
    const teamBData = storyData[gameState.teamBNode as keyof typeof storyData];
    
    setTeamANodeData(teamAData || null);
    setTeamBNodeData(teamBData || null);
    setStoryCompleted(false);
    setTeamAChoice(null);
    setTeamBChoice(null);
  }, [gameState.teamANode, gameState.teamBNode]);

=======
  const [teamANodeData, setTeamANodeData] = useState<any>(
    storyData[gameState.teamANode as keyof typeof storyData] || null,
  );
  const [teamBNodeData, setTeamBNodeData] = useState<any>(
    storyData[gameState.teamBNode as keyof typeof storyData] || null,
  );
  const [teamAReady, setTeamAReady] = useState(false);
  const [teamBReady, setTeamBReady] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState("");
  const [teamAFinished, setTeamAFinished] = useState(false);
  const [teamBFinished, setTeamBFinished] = useState(false);
  const [teamAScoreChange, setTeamAScoreChange] = useState<number | null>(null);
  const [teamBScoreChange, setTeamBScoreChange] = useState<number | null>(null);
  const [storyCompleted, setStoryCompleted] = useState(false);
  const [showChoicePopup, setShowChoicePopup] = useState(false);
  const [teamAStoryCompleted, setTeamAStoryCompleted] = useState(false);
  const [teamBStoryCompleted, setTeamBStoryCompleted] = useState(false);

  // 현재 노드 데이터 가져오기
  useEffect(() => {
    const teamANodeData = storyData[gameState.teamANode as keyof typeof storyData];
    const teamBNodeData = storyData[gameState.teamBNode as keyof typeof storyData];
    if (teamANodeData) {
      setTeamANodeData(teamANodeData);
    }
    if (teamBNodeData) {
      setTeamBNodeData(teamBNodeData);
    }
    // 노드가 변경되면 스토리 완료 상태 리셋
    setStoryCompleted(false);
    setShowChoicePopup(false);
    setTeamAStoryCompleted(false);
    setTeamBStoryCompleted(false);
  }, [gameState.teamANode, gameState.teamBNode]);

  // 팀별 엔딩 확인
  useEffect(() => {
    if (teamANodeData && teamANodeData.choices.length === 0 && !teamAFinished) {
      setTeamAFinished(true);
      // 엔딩 점수 계산
      const endingScore = calculateEndingScore(gameState.teamANode, gameState.teamAScore);
      setGameState((prev) => ({
        ...prev,
        teamAScore: endingScore,
      }));
      updateTeamScore("team1", endingScore - gameState.teamAScore);
    }

    if (teamBNodeData && teamBNodeData.choices.length === 0 && !teamBFinished) {
      setTeamBFinished(true);
      // 엔딩 점수 계산
      const endingScore = calculateEndingScore(gameState.teamBNode, gameState.teamBScore);
      setGameState((prev) => ({
        ...prev,
        teamBScore: endingScore,
      }));
      updateTeamScore("team2", endingScore - gameState.teamBScore);
    }
  }, [
    teamANodeData,
    teamBNodeData,
    teamAFinished,
    teamBFinished,
    gameState.teamANode,
    gameState.teamBNode,
    gameState.teamAScore,
    gameState.teamBScore,
    updateTeamScore,
  ]);

  // 선택 완료 확인 (팀별 독립적 처리)
  useEffect(() => {
    // 한 파티가 완료된 경우, 다른 파티만 선택하면 바로 처리
    if (teamAFinished && gameState.teamBChoice && !teamBFinished) {
      console.log("팀 A 완료, 팀 B 선택 처리");
      setTimeout(() => {
        processSingleTeamChoice("B");
      }, 1000);
    } else if (teamBFinished && gameState.teamAChoice && !teamAFinished) {
      console.log("팀 B 완료, 팀 A 선택 처리");
      setTimeout(() => {
        processSingleTeamChoice("A");
      }, 1000);
    } else if (gameState.teamAChoice && gameState.teamBChoice && !teamAFinished && !teamBFinished) {
      // 두 팀 모두 선택 완료
      console.log("두 팀 모두 선택 완료, 처리 시작");
      setTimeout(() => {
        processChoices();
      }, 1000); // 1초 대기 후 처리
    } else if (gameState.teamAChoice && !gameState.teamBChoice && !teamBFinished) {
      setWaitingMessage(`${gameState.teamBName} 파티의 선택을 기다리는 중...`);
    } else if (!gameState.teamAChoice && gameState.teamBChoice && !teamAFinished) {
      setWaitingMessage(`${gameState.teamAName} 파티의 선택을 기다리는 중...`);
    } else if (teamAFinished && !teamBFinished) {
      setWaitingMessage(`${gameState.teamBName} 파티가 계속 모험을 진행하고 있습니다...`);
    } else if (teamBFinished && !teamAFinished) {
      setWaitingMessage(`${gameState.teamAName} 파티가 계속 모험을 진행하고 있습니다...`);
    } else {
      setWaitingMessage("");
    }
  }, [
    gameState.teamAChoice,
    gameState.teamBChoice,
    gameState.teamAName,
    gameState.teamBName,
    teamAFinished,
    teamBFinished,
  ]);

  // 전체 게임 종료 확인 (모든 팀이 엔딩에 도달했을 때)
  useEffect(() => {
    if (teamAFinished && teamBFinished) {
      setTimeout(() => {
        onEndGame();
      }, 3000);
    }
  }, [teamAFinished, teamBFinished, onEndGame]);

>>>>>>> origin/master
  // 점수 변화 표시 후 리셋
  useEffect(() => {
    if (teamAScoreChange !== null || teamBScoreChange !== null) {
      const timer = setTimeout(() => {
        setTeamAScoreChange(null);
        setTeamBScoreChange(null);
<<<<<<< HEAD
      }, 2000);
=======
      }, 2000); // 2초 후 리셋

>>>>>>> origin/master
      return () => clearTimeout(timer);
    }
  }, [teamAScoreChange, teamBScoreChange]);

<<<<<<< HEAD
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

  // 선택지 처리 함수 (정적 시스템으로 복원)
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

  // 스토리 완료 처리 (간단하게)
  const handleStoryComplete = () => {
    // 모든 TypingText 컴포넌트에 스킵 이벤트 발생
    window.dispatchEvent(new Event('skip-typing'));
    setStoryCompleted(true);
  };

  // 텍스트 포맷팅
=======
  // 엔딩 점수 계산 함수
  const calculateEndingScore = (nodeName: string, currentScore: number): number => {
    switch (nodeName) {
      // 최고 점수 엔딩들 (900-1000점)
      case "complete_sonseongmo_puzzle":
        return 1000; // 히든 엔딩 - 손성모 퍼즐 완성
      case "perfect_time_balance":
        return 950; // 완벽한 시간 균형 엔딩
      case "all_fragments_collected":
        return 920; // 모든 시간 조각 수집 엔딩
      case "time_wisdom_master":
        return 900; // 시간의 지혜 마스터 엔딩

      // 종족별 특별 엔딩들 (850-899점)
      case "ethereal_guardian_ending":
        return 890; // 에테르족 수호자 엔딩
      case "sylphred_wind_master":
        return 880; // 실프레드족 바람 마스터 엔딩
      case "veloir_pack_leader":
        return 870; // 벨로아족 무리 지도자 엔딩
      case "noir_shadow_lord":
        return 860; // 누아르족 그림자 군주 엔딩
      case "runmare_prophet_ending":
        return 850; // 룬마레족 예언자 엔딩
      case "drakar_dragon_lord":
        return 840; // 드라카르족 용의 군주 엔딩
      case "moras_ancient_sage":
        return 830; // 모라스족 고대 현자 엔딩

      // 고득점 엔딩들 (700-899점)
      case "save_world":
        return 800; // 세계 구하기 엔딩
      case "time_guardian":
        return 780; // 시간의 수호자 엔딩
      case "peaceful_resolution":
        return 750; // 평화로운 해결 엔딩
      case "use_time_fragment":
        return 700; // 시간 조각 사용 엔딩

      // 중간 점수 엔딩들 (500-699점)
      case "reverse_time":
        return 600; // 시간 되돌리기 엔딩
      case "find_gem_together":
        return 500; // 협력 엔딩
      case "team_reunion":
        return 400; // 팀 재회 엔딩
      case "normal_adventure":
        return 350; // 일반 모험 엔딩

      // 낮은 점수 엔딩들 (100-399점)
      case "partial_success":
        return 300; // 부분적 성공 엔딩
      case "safe_return":
        return 250; // 안전한 귀환 엔딩
      case "minimal_impact":
        return 200; // 최소한의 영향 엔딩
      case "basic_completion":
        return 150; // 기본 완료 엔딩
      case "survival_ending":
        return 100; // 생존 엔딩

      // 부정적 엔딩들 (0-99점)
      case "failed_attempt":
        return 50; // 실패한 시도 엔딩
      case "partial_failure":
        return 25; // 부분적 실패 엔딩
      case "minimal_success":
        return 10; // 최소한의 성공 엔딩
      case "barely_survived":
        return 0; // 간신히 생존 엔딩

      // 매우 부정적 엔딩들 (-1000점 ~ -1점)
      case "continue_time_manipulation_dark":
        return -1000; // 흑화 엔딩 - 손성모 흑화
      case "world_destruction":
        return -800; // 세계 파괴 엔딩
      case "time_chaos":
        return -600; // 시간 혼돈 엔딩
      case "complete_failure":
        return -400; // 완전한 실패 엔딩
      case "dangerous_choice":
        return -200; // 위험한 선택 엔딩
      case "regret_ending":
        return -100; // 후회 엔딩

      // 종족별 부정적 엔딩들 (-50점 ~ -99점)
      case "ethereal_weakness_exploited":
        return -90; // 에테르족 약점 이용 엔딩
      case "sylphred_caught_in_trap":
        return -85; // 실프레드족 함정에 걸림 엔딩
      case "veloir_emotional_breakdown":
        return -80; // 벨로아족 감정적 붕괴 엔딩
      case "noir_light_destruction":
        return -75; // 누아르족 빛에 파괴 엔딩
      case "runmare_water_loss":
        return -70; // 룬마레족 물의 힘 상실 엔딩
      case "drakar_betrayal_rage":
        return -65; // 드라카르족 배신에 대한 분노 엔딩
      case "moras_immobility_trap":
        return -60; // 모라스족 움직임 불가 엔딩

      case "minor_mistake":
        return -50; // 작은 실수 엔딩
      case "slight_failure":
        return -25; // 약간의 실패 엔딩
      case "small_error":
        return -10; // 작은 오류 엔딩
      case "tiny_mistake":
        return -1; // 아주 작은 실수 엔딩

      default:
        return currentScore; // 기본 점수 유지
    }
  };

  // 단일 팀 선택 처리 함수
  const processSingleTeamChoice = (team: "A" | "B") => {
    const nodeData = team === "A" ? teamANodeData : teamBNodeData;
    const choice = team === "A" ? gameState.teamAChoice : gameState.teamBChoice;

    if (!nodeData || !choice) return;

    // 선택지 찾기 - choice 객체로 저장되므로 text로 비교
    const choiceData = nodeData.choices.find((c: any) => c.text === choice.text);
    if (!choiceData) return;

    // 점수 계산
    const scoreChange = team === "A" ? choiceData.scoreA : choiceData.scoreB;
    const newScore =
      team === "A" ? gameState.teamAScore + scoreChange : gameState.teamBScore + scoreChange;

    // 점수 변화 추적
    if (team === "A") {
      setTeamAScoreChange(scoreChange);
    } else {
      setTeamBScoreChange(scoreChange);
    }

    // 전역 점수 업데이트
    updateTeamScore(team === "A" ? "team1" : "team2", scoreChange);

    // 다음 노드 결정
    const nextNode = choiceData.next;

    // 게임 히스토리 업데이트
    const newHistory = [
      ...gameState.gameHistory,
      {
        node: team === "A" ? gameState.teamANode : gameState.teamBNode,
        teamAChoice: team === "A" ? choice : null,
        teamBChoice: team === "B" ? choice : null,
        teamAScore: team === "A" ? newScore : gameState.teamAScore,
        teamBScore: team === "B" ? newScore : gameState.teamBScore,
      },
    ];

    // 게임 상태 업데이트
    setGameState((prev) => ({
      ...prev,
      teamAScore: team === "A" ? newScore : prev.teamAScore,
      teamBScore: team === "B" ? newScore : prev.teamBScore,
      teamANode: team === "A" ? nextNode : prev.teamANode,
      teamBNode: team === "B" ? nextNode : prev.teamBNode,
      teamAChoice: null,
      teamBChoice: null,
      gameHistory: newHistory,
    }));

    if (team === "A") {
      setTeamAReady(false);
    } else {
      setTeamBReady(false);
    }
    setWaitingMessage("");
  };

  const processChoices = () => {
    if (!teamANodeData || !teamBNodeData || !gameState.teamAChoice || !gameState.teamBChoice)
      return;

    // 선택지 찾기 - choice 객체로 저장되므로 text로 비교
    const teamAChoiceData = teamANodeData.choices.find(
      (choice: any) => choice.text === gameState.teamAChoice.text,
    );
    const teamBChoiceData = teamBNodeData.choices.find(
      (choice: any) => choice.text === gameState.teamBChoice.text,
    );

    if (!teamAChoiceData || !teamBChoiceData) return;

    // 점수 계산 (음수 점수도 허용)
    const newTeamAScore = gameState.teamAScore + teamAChoiceData.scoreA;
    const newTeamBScore = gameState.teamBScore + teamBChoiceData.scoreB;

    // 점수 변화 추적
    setTeamAScoreChange(teamAChoiceData.scoreA);
    setTeamBScoreChange(teamBChoiceData.scoreB);

    // 전역 점수 업데이트
    updateTeamScore("team1", teamAChoiceData.scoreA);
    updateTeamScore("team2", teamBChoiceData.scoreB);

    // 팀별 다음 노드 결정
    const nextTeamANode = teamAChoiceData.next;
    const nextTeamBNode = teamBChoiceData.next;

    // 효과 처리 (팀 상호작용)
    let finalTeamANode = nextTeamANode;
    let finalTeamBNode = nextTeamBNode;

    if (teamAChoiceData.effect) {
      // Team A의 선택이 Team B에 영향을 주는 경우
      if (teamAChoiceData.effect.teamBNode) {
        finalTeamBNode = teamAChoiceData.effect.teamBNode;
      }
    }

    // 게임 히스토리 업데이트
    const newHistory = [
      ...gameState.gameHistory,
      {
        node: gameState.currentNode,
        teamAChoice: gameState.teamAChoice,
        teamBChoice: gameState.teamBChoice,
        teamAScore: newTeamAScore,
        teamBScore: newTeamBScore,
      },
    ];

    // 게임 상태 업데이트
    setGameState((prev) => ({
      ...prev,
      teamAScore: newTeamAScore,
      teamBScore: newTeamBScore,
      teamANode: finalTeamANode,
      teamBNode: finalTeamBNode,
      teamAChoice: null,
      teamBChoice: null,
      gameHistory: newHistory,
    }));

    setTeamAReady(false);
    setTeamBReady(false);
    setWaitingMessage("");
  };

  const handleTeamChoice = (team: "A" | "B", choice: any) => {
    console.log(`${team}팀 선택:`, choice.text);

    if (team === "A") {
      // 이미 선택된 선택지를 다시 클릭하면 선택 취소
      if (gameState.teamAChoice && gameState.teamAChoice.text === choice.text) {
        console.log("팀 A 선택 취소");
        setGameState((prev) => ({ ...prev, teamAChoice: null }));
        setTeamAReady(false);
      } else {
        console.log("팀 A 선택 완료");
        setGameState((prev) => ({ ...prev, teamAChoice: choice }));
        setTeamAReady(true);
      }
    } else {
      // 이미 선택된 선택지를 다시 클릭하면 선택 취소
      if (gameState.teamBChoice && gameState.teamBChoice.text === choice.text) {
        console.log("팀 B 선택 취소");
        setGameState((prev) => ({ ...prev, teamBChoice: null }));
        setTeamBReady(false);
      } else {
        console.log("팀 B 선택 완료");
        setGameState((prev) => ({ ...prev, teamBChoice: choice }));
        setTeamBReady(true);
      }
    }
  };

>>>>>>> origin/master
  const formatText = (text: string) => {
    return text
      .replace("{teamAName}", gameState.teamAName)
      .replace("{teamBName}", gameState.teamBName);
  };

<<<<<<< HEAD
  // 시작 노드인지 확인
  const isStartNode = gameState.teamANode === "start" && gameState.teamBNode === "start";

  // 엔딩 노드인지 확인 (선택지가 없는 노드)
  const isTeamAEnding = teamANodeData && teamANodeData.choices.length === 0;
  const isTeamBEnding = teamBNodeData && teamBNodeData.choices.length === 0;

  // 게임 종료 확인
  const handleEndGame = () => {
    onEndGame();
  };

=======
  // 팀별 스토리 텍스트 생성
  const getTeamStoryText = (team: "A" | "B") => {
    const nodeData = team === "A" ? teamANodeData : teamBNodeData;
    if (!nodeData) return "";

    let storyText = nodeData.text;
    return formatText(storyText);
  };

  // 팀별 스토리 완료 콜백
  const handleTeamAStoryComplete = () => {
    console.log("팀 A 스토리 완료");
    setTeamAStoryCompleted(true);
  };

  const handleTeamBStoryComplete = () => {
    console.log("팀 B 스토리 완료");
    setTeamBStoryCompleted(true);
  };

  // 공통 스토리 완료 콜백
  const handleCommonStoryComplete = () => {
    console.log("공통 스토리 완료");
    setStoryCompleted(true);
  };

  // 모든 스토리 완료 확인
  useEffect(() => {
    const isStartNode = gameState.teamANode === "start" && gameState.teamBNode === "start";

    if (isStartNode) {
      // 시작 노드: 공통 스토리만 있음
      // storyCompleted는 handleCommonStoryComplete에서만 설정됨
      if (storyCompleted) {
        console.log("시작 노드 스토리 완료, 선택지 표시 준비");
      }
    } else {
      // 일반 노드: 팀별 스토리
      if (teamAStoryCompleted && teamBStoryCompleted && !storyCompleted) {
        console.log("모든 팀 스토리 완료, 선택지 표시 준비");
        setStoryCompleted(true);
      }
    }
  }, [teamAStoryCompleted, teamBStoryCompleted, gameState.teamANode, gameState.teamBNode]);

  // 두 팀이 같은 노드에 있는지 확인
  const isSameNode = gameState.teamANode === gameState.teamBNode;

  // 시작 노드인지 확인
  const isStartNode = gameState.teamANode === "start" && gameState.teamBNode === "start";

>>>>>>> origin/master
  if (!teamANodeData || !teamBNodeData) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="game-play">
<<<<<<< HEAD
      {/* 점수 변화 표시 */}
      <div className="floating-score-indicators">
        <div className="team-a-indicator">
          <div className={`score-icon team-a-icon ${teamAScoreChange !== null ? (teamAScoreChange >= 0 ? "positive" : "negative") : ""}`}>
=======
      {/* 플로팅 점수 아이콘 */}
      <div className="floating-score-indicators">
        <div className="team-a-indicator">
          <div
            className={`score-icon team-a-icon ${
              teamAScoreChange !== null ? (teamAScoreChange >= 0 ? "positive" : "negative") : ""
            }`}
          >
>>>>>>> origin/master
            A
          </div>
        </div>
        <div className="team-b-indicator">
<<<<<<< HEAD
          <div className={`score-icon team-b-icon ${teamBScoreChange !== null ? (teamBScoreChange >= 0 ? "positive" : "negative") : ""}`}>
=======
          <div
            className={`score-icon team-b-icon ${
              teamBScoreChange !== null ? (teamBScoreChange >= 0 ? "positive" : "negative") : ""
            }`}
          >
>>>>>>> origin/master
            B
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* 스토리 텍스트 */}
      {isStartNode ? (
        // 시작 노드: 공통 스토리
=======
      {/* 스토리 텍스트 - 조건부 렌더링 */}
      {isStartNode ? (
        // 시작 노드일 때만 공통 스토리 표시
>>>>>>> origin/master
        <div className="story-sections">
          <div className="team-story-section common-story">
            <h3>스토리</h3>
            <div className="story-text">
              <TypingText
                text={formatText(teamANodeData.text)}
                speed={50}
                className="story-typing"
                skipable={true}
<<<<<<< HEAD
                onComplete={handleStoryComplete}
=======
                onComplete={handleCommonStoryComplete}
>>>>>>> origin/master
              />
            </div>
          </div>
        </div>
      ) : (
<<<<<<< HEAD
        // 일반 노드: 팀별 스토리를 하나의 스킵 버튼으로 통합
=======
        // 그 외에는 항상 팀별로 나눠서 표시
>>>>>>> origin/master
        <div className="story-sections">
          <div className="team-story-section team-a-story">
            <h3>{gameState.teamAName} 파티 스토리</h3>
            <div className="story-text">
              <TypingText
                text={formatText(teamANodeData.text)}
                speed={50}
                className="story-typing"
                skipable={true}
<<<<<<< HEAD
                onComplete={() => {}}
=======
                onComplete={handleTeamAStoryComplete}
>>>>>>> origin/master
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
<<<<<<< HEAD
                onComplete={() => {}}
=======
                onComplete={handleTeamBStoryComplete}
>>>>>>> origin/master
              />
            </div>
          </div>
        </div>
      )}

<<<<<<< HEAD


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
=======
      {/* 대기 메시지 */}
      {waitingMessage && <div className="waiting-message">{waitingMessage}</div>}

      {/* 스토리 진행 중 메시지 */}
      {!storyCompleted &&
        (teamANodeData.choices.length > 0 || teamBNodeData.choices.length > 0) && (
          <div className="story-progress-message">
            <div className="progress-indicator">
              <span className="typing-cursor">|</span>
              <span>스토리를 읽고 있습니다...</span>
            </div>
          </div>
        )}

      {/* 좌우 선택지 영역 */}
      {storyCompleted &&
        (teamANodeData.choices.length > 0 || teamBNodeData.choices.length > 0) &&
        !waitingMessage.includes("스토리를 읽고 있습니다") && (
          <div className="side-choices-container">
            {/* 왼쪽 선택지 (팀 A) */}
            <div className="left-choices">
              {!teamAFinished && teamANodeData.choices.length > 0 ? (
                <div className="team-choices">
                  <h3>{gameState.teamAName} 파티 선택</h3>
                  <div className="choices-list">
                    {teamANodeData.choices.map((choice: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleTeamChoice("A", choice)}
                        className={`choice-button ${
                          gameState.teamAChoice && gameState.teamAChoice.text === choice.text
                            ? "selected"
                            : ""
                        }`}
                      >
                        {choice.text}
                      </button>
                    ))}
                  </div>
                </div>
              ) : teamAFinished ? (
                <div className="team-finished">
                  <h3>{gameState.teamAName} 파티</h3>
                  <p>모험이 완료되었습니다!</p>
                </div>
              ) : (
                <div className="no-choices">
                  <h3>{gameState.teamAName} 파티</h3>
                  <p>선택지가 없습니다.</p>
                </div>
              )}
            </div>

            {/* 오른쪽 선택지 (팀 B) */}
            <div className="right-choices">
              {!teamBFinished && teamBNodeData.choices.length > 0 ? (
                <div className="team-choices">
                  <h3>{gameState.teamBName} 파티 선택</h3>
                  <div className="choices-list">
                    {teamBNodeData.choices.map((choice: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleTeamChoice("B", choice)}
                        className={`choice-button ${
                          gameState.teamBChoice && gameState.teamBChoice.text === choice.text
                            ? "selected"
                            : ""
                        }`}
                      >
                        {choice.text}
                      </button>
                    ))}
                  </div>
                </div>
              ) : teamBFinished ? (
                <div className="team-finished">
                  <h3>{gameState.teamBName} 파티</h3>
                  <p>모험이 완료되었습니다!</p>
                </div>
              ) : (
                <div className="no-choices">
                  <h3>{gameState.teamBName} 파티</h3>
                  <p>선택지가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}

      {/* 게임 종료 메시지 */}
      {teamAFinished && teamBFinished && (
        <div className="game-end-message">
          <h2>모든 파티의 모험이 완료되었습니다!</h2>
          <p>최종 결과를 확인해보세요!</p>
>>>>>>> origin/master
        </div>
      )}
    </div>
  );
};

export default GamePlay;
