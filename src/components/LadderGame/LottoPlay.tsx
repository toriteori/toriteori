import React, { useState } from "react";
import { TeamMember, LottoEntry } from "./LottoGame";

interface LottoPlayProps {
  currentPlayer: TeamMember;
  currentPlayerIndex: number;
  totalPlayers: number;
  onNumberSubmit: (numbers: number[], bonusNumber: number) => void;
  existingEntries: LottoEntry[];
}

const LottoPlay: React.FC<LottoPlayProps> = ({
  currentPlayer,
  currentPlayerIndex,
  totalPlayers,
  onNumberSubmit,
  existingEntries,
}) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedBonusNumber, setSelectedBonusNumber] = useState<number | null>(null);

  const toggleNumber = (number: number) => {
    if (selectedNumbers.includes(number)) {
      // 이미 선택된 번호면 제거
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else if (selectedNumbers.length < 6) {
      // 6개 미만이면 추가
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const toggleBonusNumber = (number: number) => {
    if (selectedBonusNumber === number) {
      // 이미 선택된 보너스번호면 제거
      setSelectedBonusNumber(null);
    } else {
      // 새로운 보너스번호 선택
      setSelectedBonusNumber(number);
    }
  };

  const submitNumbers = () => {
    if (selectedNumbers.length !== 6) {
      alert("정확히 6개의 번호를 선택해주세요!");
      return;
    }

    if (selectedBonusNumber === null) {
      alert("보너스 번호를 선택해주세요!");
      return;
    }

    // 보너스 번호는 1~11 범위이므로 일반번호(1~11)와 겹칠 수 있음

    const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
    onNumberSubmit(sortedNumbers, selectedBonusNumber);
    setSelectedNumbers([]);
    setSelectedBonusNumber(null);
  };

  const generateNumbers = () => {
    const numbers: number[] = [];
    while (numbers.length < 6) {
      const num = Math.floor(Math.random() * 11) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }

    // 보너스 번호는 1~11 중에서 자동 생성 (일반번호와 독립적)
    const bonusNum = Math.floor(Math.random() * 11) + 1;

    setSelectedNumbers(numbers.sort((a, b) => a - b));
    setSelectedBonusNumber(bonusNum);
  };

  const clearNumbers = () => {
    setSelectedNumbers([]);
    setSelectedBonusNumber(null);
  };

  return (
    <div className="lotto-play">
      <div className="play-header">
        <h1>🎰 번호 선택</h1>
        <div className="player-info">
          <div className="current-player">
            <h2>🎯 {currentPlayer.name}님의 차례</h2>
            <p className="progress">
              {currentPlayerIndex + 1} / {totalPlayers} 플레이어
            </p>
          </div>
        </div>
      </div>

      <div className="number-selection">
        <div className="selection-header">
          <h3>일반번호 1~11 중 6개 + 보너스 1~11 중 1개를 선택해주세요.</h3>
          <div className="selected-count">
            일반번호: {selectedNumbers.length} / 6 | 보너스: {selectedBonusNumber ? 1 : 0} / 1
          </div>
        </div>

        <div className="selected-numbers">
          <h4>🎯 선택한 번호</h4>
          <div className="selected-display">
            <div className="normal-numbers">
              <span className="number-type">일반번호:</span>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={`number-slot ${selectedNumbers[i] ? "filled" : "empty"}`}>
                  {selectedNumbers[i] || "?"}
                </div>
              ))}
            </div>
            <div className="bonus-number">
              <span className="number-type">보너스:</span>
              <div className={`number-slot bonus ${selectedBonusNumber ? "filled" : "empty"}`}>
                {selectedBonusNumber || "?"}
              </div>
            </div>
          </div>
        </div>

        <div className="number-grids">
          <div className="normal-grid">
            <h4>일반번호 선택 (1~11 중 6개)</h4>
            <div className="number-grid compact">
              {Array.from({ length: 11 }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  className={`number-btn ${selectedNumbers.includes(number) ? "selected" : ""}`}
                  onClick={() => toggleNumber(number)}
                  disabled={!selectedNumbers.includes(number) && selectedNumbers.length >= 6}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>

          <div className="bonus-grid">
            <h4>보너스번호 선택 (1~11 중 1개)</h4>
            <div className="number-grid compact">
              {Array.from({ length: 11 }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  className={`number-btn bonus ${selectedBonusNumber === number ? "selected" : ""}`}
                  onClick={() => toggleBonusNumber(number)}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={generateNumbers} className="btn btn-secondary">
            🎲 자동 선택
          </button>
          <button onClick={clearNumbers} className="btn btn-tertiary">
            🗑️ 초기화
          </button>
          <button
            onClick={submitNumbers}
            className="btn btn-primary"
            disabled={selectedNumbers.length !== 6 || selectedBonusNumber === null}
          >
            ✅ 번호 확정
          </button>
        </div>
      </div>

      {existingEntries.length > 0 && (
        <div className="submitted-entries">
          <h3>📝 제출된 번호들</h3>
          <div className="entries-list">
            {existingEntries.map((entry, index) => (
              <div key={index} className="entry-item">
                <span className="player-name">{entry.player.name}:</span>
                <div className="entry-numbers">
                  {entry.numbers.map((num, i) => (
                    <span key={i} className="entry-number">
                      {num}
                    </span>
                  ))}
                  <span className="entry-bonus">+{entry.bonusNumber}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="game-instructions">
        <h4>📋 게임 방법</h4>
        <ul>
          <li>• 일반번호: 1~11 중에서 6개를 선택하세요</li>
          <li>• 보너스번호: 1~11 중에서 1개를 선택하세요</li>
          <li>• 실제 로또처럼 일반번호와 보너스번호가 겹치지 않습니다</li>
          <li>• 자동 선택 버튼으로 랜덤하게 선택할 수 있습니다</li>
          <li>• 모든 플레이어가 번호를 선택하면 추첨이 시작됩니다</li>
        </ul>
      </div>
    </div>
  );
};

export default LottoPlay;
