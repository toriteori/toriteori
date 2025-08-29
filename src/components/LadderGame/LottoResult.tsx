import React, { useState, useEffect } from "react";
import { LottoEntry } from "./LottoGame";

interface LottoResultProps {
  winningNumbers: number[];
  bonusNumber: number;
  entries: LottoEntry[];
  onRestart: () => void;
  onBackToMain: () => void;
}

const LottoResult: React.FC<LottoResultProps> = ({
  winningNumbers,
  bonusNumber,
  entries,
  onRestart,
  onBackToMain,
}) => {
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [showBonusNumber, setShowBonusNumber] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isDrawing, setIsDrawing] = useState(true);
  const [shuffledNumbers, setShuffledNumbers] = useState<number[]>([]);

  // 컴포넌트 마운트 시 번호 순서 섞기
  useEffect(() => {
    const shuffled = [...winningNumbers].sort(() => Math.random() - 0.5);
    setShuffledNumbers(shuffled);
  }, [winningNumbers]);

  useEffect(() => {
    if (shuffledNumbers.length === 0) return; // 아직 섞인 번호가 준비되지 않음

    if (currentNumberIndex < shuffledNumbers.length) {
      const timer = setTimeout(() => {
        setCurrentNumberIndex(currentNumberIndex + 1);
      }, 1500); // 1.5초마다 번호 공개

      return () => clearTimeout(timer);
    } else if (currentNumberIndex === shuffledNumbers.length && !showBonusNumber && isDrawing) {
      // 모든 일반번호가 공개되면 1초 후 보너스번호 공개
      const timer = setTimeout(() => {
        setShowBonusNumber(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (showBonusNumber && isDrawing) {
      // 보너스번호가 공개되면 2초 후 결과 표시
      const timer = setTimeout(() => {
        setIsDrawing(false);
        setShowResults(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentNumberIndex, showBonusNumber, shuffledNumbers.length, isDrawing]);

  const getRankText = (matches: number, bonusMatch: boolean) => {
    if (matches === 6) return "🥇 1등";
    if (matches === 5 && bonusMatch) return "🥈 2등";
    if (matches === 5) return "🥉 3등";
    if (matches === 4) return "🏆 4등";
    if (matches === 3) return "🎖️ 5등";
    if (matches === 2) return "🎗️ 6등";
    if (matches === 1) return "🏅 7등";
    return "🎁 8등";
  };

  const getRankClass = (matches: number, bonusMatch: boolean) => {
    if (matches === 6) return "rank-1";
    if (matches === 5 && bonusMatch) return "rank-2";
    if (matches === 5) return "rank-3";
    if (matches === 4) return "rank-4";
    if (matches === 3) return "rank-5";
    if (matches === 2) return "rank-6";
    if (matches === 1) return "rank-7";
    return "rank-8";
  };

  const getWinners = () => {
    const winners = {
      rank1: entries.filter((e) => e.matches === 6),
      rank2: entries.filter((e) => e.matches === 5 && e.bonusMatch),
      rank3: entries.filter((e) => e.matches === 5 && !e.bonusMatch),
      rank4: entries.filter((e) => e.matches === 4),
      rank5: entries.filter((e) => e.matches === 3),
      rank6: entries.filter((e) => e.matches === 2),
      rank7: entries.filter((e) => e.matches === 1),
      rank8: entries.filter((e) => e.matches === 0),
    };
    return winners;
  };

  const winners = getWinners();

  return (
    <div className="lotto-result">
      <div className="result-header">
        <h1>🎰 로또 추첨 결과</h1>
      </div>

      {isDrawing && (
        <div className="drawing-section">
          <h2>🎲 당첨번호 발표</h2>
          <div className="numbers-reveal-container">
            <div className="normal-numbers-reveal">
              <h3>일반번호</h3>
              <div className="winning-numbers-reveal">
                {shuffledNumbers.map((number, index) => (
                  <div
                    key={index}
                    className={`winning-number ${
                      index < currentNumberIndex ? "revealed" : "hidden"
                    } ${index === currentNumberIndex - 1 ? "latest" : ""}`}
                  >
                    {index < currentNumberIndex ? number : "?"}
                  </div>
                ))}
              </div>
            </div>

            {currentNumberIndex >= shuffledNumbers.length && (
              <div className="bonus-number-reveal">
                <h3>보너스번호</h3>
                <div className="winning-numbers-reveal">
                  <div
                    className={`winning-number bonus ${showBonusNumber ? "revealed" : "hidden"} ${
                      showBonusNumber ? "latest" : ""
                    }`}
                  >
                    {showBonusNumber ? bonusNumber : "?"}
                  </div>
                </div>
              </div>
            )}
          </div>
          {currentNumberIndex < shuffledNumbers.length && (
            <div className="drawing-status">
              <p>당첨번호를 발표하고 있습니다...</p>
              <div className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          )}
          {currentNumberIndex >= shuffledNumbers.length && !showBonusNumber && (
            <div className="drawing-complete">
              <p>🎉 일반번호 발표 완료!</p>
              <p>보너스번호를 발표하는 중...</p>
            </div>
          )}
          {showBonusNumber && (
            <div className="drawing-complete">
              <p>🎉 모든 당첨번호가 발표되었습니다!</p>
              <p>결과를 확인하는 중...</p>
            </div>
          )}
        </div>
      )}

      {showResults && (
        <div className="results-section">
          <div className="final-winning-numbers">
            <h3>🎯 최종 당첨번호</h3>
            <div className="final-numbers-container">
              <div className="final-normal-numbers">
                <span className="number-label">일반번호:</span>
                <div className="winning-numbers-final">
                  {winningNumbers.map((number, index) => (
                    <div key={index} className="winning-number final">
                      {number}
                    </div>
                  ))}
                </div>
              </div>
              <div className="final-bonus-number">
                <span className="number-label">보너스:</span>
                <div className="winning-numbers-final">
                  <div className="winning-number final bonus">{bonusNumber}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="winners-announcement">
            <h3>🏆 당첨자 발표</h3>

            {winners.rank1.length > 0 && (
              <div className="winner-group rank-1">
                <h4>🥇 1등 (6개 맞춤) - 1000점</h4>
                {winners.rank1.map((entry, index) => (
                  <div key={index} className="winner-item">
                    <span className="winner-name">{entry.player.name}</span>
                    <div className="winner-numbers">
                      {entry.numbers.map((num, i) => (
                        <span
                          key={i}
                          className={`number ${
                            winningNumbers.includes(num) ? "match" : "no-match"
                          }`}
                        >
                          {num}
                        </span>
                      ))}
                      <span className={`number bonus ${entry.bonusMatch ? "match" : "no-match"}`}>
                        +{entry.bonusNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {winners.rank2.length > 0 && (
              <div className="winner-group rank-2">
                <h4>🥈 2등 (5개 + 보너스) - 500점</h4>
                {winners.rank2.map((entry, index) => (
                  <div key={index} className="winner-item">
                    <span className="winner-name">{entry.player.name}</span>
                    <div className="winner-numbers">
                      {entry.numbers.map((num, i) => (
                        <span
                          key={i}
                          className={`number ${
                            winningNumbers.includes(num) ? "match" : "no-match"
                          }`}
                        >
                          {num}
                        </span>
                      ))}
                      <span className={`number bonus ${entry.bonusMatch ? "match" : "no-match"}`}>
                        +{entry.bonusNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {winners.rank3.length > 0 && (
              <div className="winner-group rank-3">
                <h4>🥉 3등 (5개 맞춤) - 300점</h4>
                {winners.rank3.map((entry, index) => (
                  <div key={index} className="winner-item">
                    <span className="winner-name">{entry.player.name}</span>
                    <div className="winner-numbers">
                      {entry.numbers.map((num, i) => (
                        <span
                          key={i}
                          className={`number ${
                            winningNumbers.includes(num) ? "match" : "no-match"
                          }`}
                        >
                          {num}
                        </span>
                      ))}
                      <span className={`number bonus ${entry.bonusMatch ? "match" : "no-match"}`}>
                        +{entry.bonusNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {winners.rank4.length > 0 && (
              <div className="winner-group rank-4">
                <h4>🏆 4등 (4개 맞춤) - 150점</h4>
                {winners.rank4.map((entry, index) => (
                  <div key={index} className="winner-item">
                    <span className="winner-name">{entry.player.name}</span>
                    <div className="winner-numbers">
                      {entry.numbers.map((num, i) => (
                        <span
                          key={i}
                          className={`number ${
                            winningNumbers.includes(num) ? "match" : "no-match"
                          }`}
                        >
                          {num}
                        </span>
                      ))}
                      <span className={`number bonus ${entry.bonusMatch ? "match" : "no-match"}`}>
                        +{entry.bonusNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {winners.rank5.length > 0 && (
              <div className="winner-group rank-5">
                <h4>🎖️ 5등 (3개 맞춤) - 100점</h4>
                {winners.rank5.map((entry, index) => (
                  <div key={index} className="winner-item">
                    <span className="winner-name">{entry.player.name}</span>
                    <div className="winner-numbers">
                      {entry.numbers.map((num, i) => (
                        <span
                          key={i}
                          className={`number ${
                            winningNumbers.includes(num) ? "match" : "no-match"
                          }`}
                        >
                          {num}
                        </span>
                      ))}
                      <span className={`number bonus ${entry.bonusMatch ? "match" : "no-match"}`}>
                        +{entry.bonusNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {winners.rank6.length > 0 && (
              <div className="winner-group rank-6">
                <h4>🎗️ 6등 (2개 맞춤) - 70점</h4>
                {winners.rank6.map((entry, index) => (
                  <div key={index} className="winner-item">
                    <span className="winner-name">{entry.player.name}</span>
                    <div className="winner-numbers">
                      {entry.numbers.map((num, i) => (
                        <span
                          key={i}
                          className={`number ${
                            winningNumbers.includes(num) ? "match" : "no-match"
                          }`}
                        >
                          {num}
                        </span>
                      ))}
                      <span className={`number bonus ${entry.bonusMatch ? "match" : "no-match"}`}>
                        +{entry.bonusNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {winners.rank7.length > 0 && (
              <div className="winner-group rank-7">
                <h4>🏅 7등 (1개 맞춤) - 50점</h4>
                {winners.rank7.map((entry, index) => (
                  <div key={index} className="winner-item">
                    <span className="winner-name">{entry.player.name}</span>
                    <div className="winner-numbers">
                      {entry.numbers.map((num, i) => (
                        <span
                          key={i}
                          className={`number ${
                            winningNumbers.includes(num) ? "match" : "no-match"
                          }`}
                        >
                          {num}
                        </span>
                      ))}
                      <span className={`number bonus ${entry.bonusMatch ? "match" : "no-match"}`}>
                        +{entry.bonusNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {winners.rank8.length > 0 && (
              <div className="winner-group rank-8">
                <h4>🎁 8등 (0개 맞춤) - 30점</h4>
                {winners.rank8.map((entry, index) => (
                  <div key={index} className="winner-item">
                    <span className="winner-name">{entry.player.name}</span>
                    <div className="winner-numbers">
                      {entry.numbers.map((num, i) => (
                        <span
                          key={i}
                          className={`number ${
                            winningNumbers.includes(num) ? "match" : "no-match"
                          }`}
                        >
                          {num}
                        </span>
                      ))}
                      <span className={`number bonus ${entry.bonusMatch ? "match" : "no-match"}`}>
                        +{entry.bonusNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button onClick={onRestart} className="btn btn-primary">
              🎮 다시 하기
            </button>
            <button onClick={onBackToMain} className="btn btn-secondary">
              🏠 메인으로
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LottoResult;
