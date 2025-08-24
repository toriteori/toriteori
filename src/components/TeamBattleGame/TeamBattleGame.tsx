import React from "react";
import StoryGame from "./StoryGame";
import "../../css/teamBattleGame.css";

const TeamBattleGame: React.FC = () => {
  return (
    <div className="team-battle-game">
      <StoryGame />
    </div>
  );
};

export default TeamBattleGame;