import React from "react";

interface Choice {
  text: string;
  next: string;
  scoreA: number;
  scoreB: number;
}

interface ChoicePopupProps {
  isOpen: boolean;
  onClose: () => void;
  teamAName: string;
  teamBName: string;
  teamAChoices: Choice[];
  teamBChoices: Choice[];
  teamAChoice: string | null;
  teamBChoice: string | null;
  onTeamChoice: (team: "A" | "B", choice: string) => void;
  teamAFinished: boolean;
  teamBFinished: boolean;
}

const ChoicePopup: React.FC<ChoicePopupProps> = ({
  isOpen,
  onClose,
  teamAName,
  teamBName,
  teamAChoices,
  teamBChoices,
  teamAChoice,
  teamBChoice,
  onTeamChoice,
  teamAFinished,
  teamBFinished,
}) => {
  if (!isOpen) return null;

  return (
    <div className="choice-popup-overlay" onClick={onClose}>
      <div className="choice-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>선택지를 선택하세요</h2>
          <button className="popup-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="popup-content">
          <div className="team-section team-a-section">
            <h3>
              {teamAName} 파티 {teamAFinished && "🏁 완료"}
            </h3>
            {teamAChoices.length > 0 ? (
              <div className="choices">
                {teamAChoices.map((choice: Choice, index: number) => (
                  <button
                    key={`teamA-${index}`}
                    className={`choice-button ${teamAChoice === choice.text ? "selected" : ""}`}
                    onClick={() => onTeamChoice("A", choice.text)}
                    disabled={teamAFinished}
                  >
                    <div className="choice-number">{index + 1}.</div>
                    <div className="choice-text">{choice.text}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="no-choices-message">
                <p>🏁 이 파티는 모험을 완료했습니다!</p>
              </div>
            )}
            {teamAChoice && <div className="choice-status ready">✓ 선택 완료: {teamAChoice}</div>}
            {teamAFinished && <div className="choice-status finished">🏁 모험 완료!</div>}
          </div>

          <div className="team-section team-b-section">
            <h3>
              {teamBName} 파티 {teamBFinished && "🏁 완료"}
            </h3>
            {teamBChoices.length > 0 ? (
              <div className="choices">
                {teamBChoices.map((choice: Choice, index: number) => (
                  <button
                    key={`teamB-${index}`}
                    className={`choice-button ${teamBChoice === choice.text ? "selected" : ""}`}
                    onClick={() => onTeamChoice("B", choice.text)}
                    disabled={teamBFinished}
                  >
                    <div className="choice-number">{index + 1}.</div>
                    <div className="choice-text">{choice.text}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="no-choices-message">
                <p>🏁 이 파티는 모험을 완료했습니다!</p>
              </div>
            )}
            {teamBChoice && <div className="choice-status ready">✓ 선택 완료: {teamBChoice}</div>}
            {teamBFinished && <div className="choice-status finished">🏁 모험 완료!</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoicePopup;
