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
  updateTeamName: (teamId: string, name: string) => void;
  clearAllScores: () => void;
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
  // 로컬 스토리지에서 팀 데이터 불러오기
  const getInitialTeams = (): Team[] => {
    const savedTeams = localStorage.getItem('gameTeams');
    if (savedTeams) {
      try {
        return JSON.parse(savedTeams);
      } catch (error) {
        console.error('저장된 팀 데이터 파싱 실패:', error);
      }
    }
    return [
      { id: "team1", name: "", score: 0, color: "#ff6b6b" },
      { id: "team2", name: "", score: 0, color: "#4ecdc4" },
    ];
  };

  const [teams, setTeams] = useState<Team[]>(getInitialTeams);

  const updateTeamScore = (teamId: string, points: number) => {
    setTeams((prev) => {
      const updatedTeams = prev.map((team) => 
        team.id === teamId ? { ...team, score: team.score + points } : team
      );
      // 로컬 스토리지에 저장
      localStorage.setItem('gameTeams', JSON.stringify(updatedTeams));
      return updatedTeams;
    });
  };

  const resetScores = () => {
    // 로컬 스토리지에서 완전히 삭제
    localStorage.removeItem('gameTeams');
    setTeams((prev) => {
      const resetTeams = prev.map((team) => ({ ...team, score: 0 }));
      return resetTeams;
    });
  };

  const getTotalScore = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.score : 0;
  };

  const updateTeamName = (teamId: string, name: string) => {
    setTeams((prev) => {
      const updatedTeams = prev.map((team) => 
        team.id === teamId ? { ...team, name } : team
      );
      // 로컬 스토리지에 저장
      localStorage.setItem('gameTeams', JSON.stringify(updatedTeams));
      return updatedTeams;
    });
  };

  const clearAllScores = () => {
    // 로컬 스토리지에서 완전히 삭제
    localStorage.removeItem('gameTeams');
    setTeams([
      { id: "team1", name: "", score: 0, color: "#ff6b6b" },
      { id: "team2", name: "", score: 0, color: "#4ecdc4" },
    ]);
  };

  return (
    <ScoreContext.Provider
      value={{ teams, updateTeamScore, resetScores, getTotalScore, updateTeamName, clearAllScores }}
    >
      {children}
    </ScoreContext.Provider>
  );
};
