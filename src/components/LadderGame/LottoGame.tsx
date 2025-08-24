import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScore } from "../../contexts/ScoreContext";
import LottoSettings from "./LottoSettings";
import LottoPlay from "./LottoPlay";
import LottoResult from "./LottoResult";
import "../../css/lottoGame.css";

export interface TeamMember {
  id: string;
  name: string;
  score: number;
}

export interface LottoEntry {
  player: TeamMember;
  numbers: number[];
  bonusNumber: number;
  matches: number;
  bonusMatch: boolean;
  score: number;
  hasEdited: boolean;  // 수정했는지 여부
}

export interface LottoSettings {
  team1Members: TeamMember[];
  team2Members: TeamMember[];
}

export type GameState = "settings" | "playing" | "result";

const LottoGame: React.FC = () => {
  const navigate = useNavigate();
  const { teams, updateTeamScore } = useScore();
  const [gameState, setGameState] = useState<GameState>("settings");
  const [settings, setSettings] = useState<LottoSettings>({
    team1Members: [],
    team2Members: [],
  });
  const [lottoEntries, setLottoEntries] = useState<LottoEntry[]>([]);
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [bonusNumber, setBonusNumber] = useState<number>(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showDrawConfirmModal, setShowDrawConfirmModal] = useState(false);
  const [editingPlayers, setEditingPlayers] = useState<Set<string>>(new Set());

  const startGame = (newSettings: LottoSettings) => {
    setSettings(newSettings);
    setGameState("playing");
    setCurrentPlayerIndex(0);
    setLottoEntries([]);
    setWinningNumbers([]);
  };

  const handleNumberSubmission = (playerNumbers: number[], playerBonusNumber: number) => {
    const allMembers = [...settings.team1Members, ...settings.team2Members];
    const currentPlayer = allMembers[currentPlayerIndex];
    
    // 수정 중인 플레이어인지 확인
    const isEditing = editingPlayers.has(currentPlayer.id);
    
    const newEntry: LottoEntry = {
      player: currentPlayer,
      numbers: playerNumbers,
      bonusNumber: playerBonusNumber,
      matches: 0,
      bonusMatch: false,
      score: isEditing ? -50 : 0, // 수정이면 -50점으로 시작
      hasEdited: isEditing,
    };
    
    // 수정이 완료되면 editingPlayers에서 제거
    if (isEditing) {
      setEditingPlayers(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentPlayer.id);
        return newSet;
      });
    }

    // 기존 엔트리 배열을 복사하고 현재 플레이어 위치에 삽입
    const updatedEntries = [...lottoEntries];
    updatedEntries.splice(currentPlayerIndex, 0, newEntry);
    setLottoEntries(updatedEntries);

    // 다음 플레이어로 이동 또는 모든 플레이어 완료 확인
    const nextPlayerIndex = currentPlayerIndex + 1;
    if (nextPlayerIndex < allMembers.length) {
      // 다음 플레이어가 이미 제출했는지 확인
      const nextPlayerAlreadySubmitted = updatedEntries.some((entry, index) => 
        index > currentPlayerIndex && entry.player.id === allMembers[nextPlayerIndex].id
      );
      
      if (nextPlayerAlreadySubmitted) {
        // 다음 플레이어가 이미 제출했다면, 모든 플레이어가 완료되었는지 확인
        if (updatedEntries.length === allMembers.length) {
          setShowDrawConfirmModal(true);
        } else {
          // 아직 제출하지 않은 플레이어 찾기
          for (let i = 0; i < allMembers.length; i++) {
            const playerExists = updatedEntries.some(entry => entry.player.id === allMembers[i].id);
            if (!playerExists) {
              setCurrentPlayerIndex(i);
              break;
            }
          }
        }
      } else {
        setCurrentPlayerIndex(nextPlayerIndex);
      }
    } else {
      // 모든 플레이어가 완료되면 추첨 확인 모달 표시
      setShowDrawConfirmModal(true);
    }
  };

  const startDraw = (entries: LottoEntry[]) => {
    // 당첨번호 생성 (1~10 중 6개)
    const numbers: number[] = [];
    while (numbers.length < 6) {
      const num = Math.floor(Math.random() * 10) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    numbers.sort((a, b) => a - b);
    setWinningNumbers(numbers);

    // 보너스번호 생성 (1~10 중 1개, 일반번호와 독립적으로 추첨)
    const bonus = Math.floor(Math.random() * 10) + 1;
    setBonusNumber(bonus);

    // 각 플레이어의 맞춘 개수와 점수 계산
    const updatedEntries = entries.map(entry => {
      const matches = entry.numbers.filter(num => numbers.includes(num)).length;
      const bonusMatch = entry.bonusNumber === bonus;
      let score = 0;
      
      // 꽝 없는 당첨 등급 체계 (1~10 중 6개)
      if (matches === 6) {
        score = 1000; // 1등: 6개 맞춤
      } else if (matches === 5 && bonusMatch) {
        score = 500;  // 2등: 5개 + 보너스
      } else if (matches === 5) {
        score = 300;  // 3등: 5개
      } else if (matches === 4) {
        score = 150;  // 4등: 4개
      } else if (matches === 3) {
        score = 100;  // 5등: 3개
      } else if (matches === 2) {
        score = 70;   // 6등: 2개
      } else if (matches === 1) {
        score = 50;   // 7등: 1개
      } else {
        score = 30;   // 8등: 0개 (참가상)
      }

      return { ...entry, matches, bonusMatch, score };
    });

    setLottoEntries(updatedEntries);

    // 팀 점수에 반영
    updatedEntries.forEach(entry => {
      const isTeam1 = settings.team1Members.some(m => m.id === entry.player.id);
      const team = teams[isTeam1 ? 0 : 1];
      if (team && entry.score > 0) {
        updateTeamScore(team.id, entry.score);
      }
    });

    setGameState("result");
  };

  const handleConfirmDraw = () => {
    setShowDrawConfirmModal(false);
    startDraw(lottoEntries);
  };

  const handleCancelDraw = () => {
    setShowDrawConfirmModal(false);
    // 마지막 플레이어로 돌아가서 수정할 수 있게 (번호 교체를 위해 엔트리 제거)
    const allMembers = [...settings.team1Members, ...settings.team2Members];
    setCurrentPlayerIndex(allMembers.length - 1);
    setLottoEntries(lottoEntries.slice(0, -1));
  };

  const handleEditPlayer = (playerIndex: number) => {
    const entryToEdit = lottoEntries[playerIndex];
    
    // 이미 수정한 플레이어는 수정 불가
    if (entryToEdit.hasEdited) {
      alert(`${entryToEdit.player.name}님은 이미 수정을 사용하셨습니다!`);
      return;
    }
    
    // 수정 비용 50점 차감 확인
    const confirmEdit = window.confirm(
      `${entryToEdit.player.name}님의 번호를 수정하시겠습니까?\n\n⚠️ 수정 시 50점이 차감되며, 한 번만 수정 가능합니다.`
    );
    
    if (!confirmEdit) {
      return;
    }
    
    setShowDrawConfirmModal(false);
    
    // 수정 중인 플레이어로 표시
    setEditingPlayers(prev => new Set(prev).add(entryToEdit.player.id));
    
    // 선택한 플레이어로 돌아가서 수정할 수 있게 (해당 플레이어 엔트리만 제거)
    setCurrentPlayerIndex(playerIndex);
    // 해당 플레이어의 엔트리만 제거하고 나머지는 유지
    const newEntries = [...lottoEntries];
    newEntries.splice(playerIndex, 1);
    setLottoEntries(newEntries);
  };

  const restartGame = () => {
    setGameState("settings");
    setLottoEntries([]);
    setWinningNumbers([]);
    setBonusNumber(0);
    setCurrentPlayerIndex(0);
    setShowDrawConfirmModal(false);
    setEditingPlayers(new Set());
  };

  const handleBackToMain = () => {
    // 메인페이지로 이동 (react-router 사용)
    navigate('/main');
  };

  const getAllMembers = () => [...settings.team1Members, ...settings.team2Members];

  return (
    <div className="lotto-game">
      {gameState === "settings" && (
        <LottoSettings teams={teams} settings={settings} onStartGame={startGame} />
      )}

      {gameState === "playing" && (
        <LottoPlay
          currentPlayer={getAllMembers()[currentPlayerIndex]}
          currentPlayerIndex={currentPlayerIndex}
          totalPlayers={getAllMembers().length}
          onNumberSubmit={handleNumberSubmission}
          existingEntries={lottoEntries}
        />
      )}

      {gameState === "result" && (
        <LottoResult
          winningNumbers={winningNumbers}
          bonusNumber={bonusNumber}
          entries={lottoEntries}
          onRestart={restartGame}
          onBackToMain={handleBackToMain}
        />
      )}

      {/* 추첨 확인 모달 */}
      {showDrawConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>🎰 추첨 시작</h2>
            <p className="modal-description">
              모든 플레이어의 번호 선택이 완료되었습니다.<br />
              추첨을 시작하시겠습니까?
            </p>
            <div className="modal-summary">
              <h3>📋 참가자 현황</h3>
              <div className="participants-list">
                {lottoEntries.map((entry, index) => (
                  <div key={index} className="participant-item">
                    <span className="participant-name">{entry.player.name}:</span>
                    <div className="participant-numbers">
                      {entry.numbers.map((num, i) => (
                        <span key={i} className="number-display">{num}</span>
                      ))}
                      <span className="bonus-display">+{entry.bonusNumber}</span>
                    </div>
                    <button 
                      onClick={() => handleEditPlayer(index)}
                      className={`edit-btn ${entry.hasEdited ? 'disabled' : ''}`}
                      title={
                        entry.hasEdited 
                          ? `${entry.player.name} - 이미 수정함` 
                          : `${entry.player.name} 번호 수정 (-50점)`
                      }
                      disabled={entry.hasEdited}
                    >
                      {entry.hasEdited ? '🚫' : '✏️'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={handleCancelDraw} className="btn btn-secondary">
                ❌ 전체 취소
              </button>
              <button onClick={handleConfirmDraw} className="btn btn-primary">
                🎲 추첨 시작!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LottoGame;
