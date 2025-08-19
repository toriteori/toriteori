import React, { createContext, useContext, useState, ReactNode } from "react";

interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
}

interface ScoreContextType {
  teams: Team[];
  updateTeamScore: (teamId: string, points: number) => void;
  resetScores: () => void;
  getTotalScore: (teamId: string) => number;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error("useScore must be used within a ScoreProvider");
  }
  return context;
};

interface ScoreProviderProps {
  children: ReactNode;
}

export const ScoreProvider: React.FC<ScoreProviderProps> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([
    { id: "team1", name: "팀 정지윤", score: 0, color: "#ff6b6b" },
    { id: "team2", name: "팀 한지우", score: 0, color: "#4ecdc4" },
  ]);

  const updateTeamScore = (teamId: string, points: number) => {
    setTeams((prev) =>
      prev.map((team) => (team.id === teamId ? { ...team, score: team.score + points } : team)),
    );
  };

  const resetScores = () => {
    setTeams((prev) => prev.map((team) => ({ ...team, score: 0 })));
  };

  const getTotalScore = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.score : 0;
  };

  return (
    <ScoreContext.Provider value={{ teams, updateTeamScore, resetScores, getTotalScore }}>
      {children}
    </ScoreContext.Provider>
  );
};
