// 라디오 옵션 타입
export interface RadioOption {
  id: string;
  value: string;
  label: string;
  className?: string;
  description?: string;
}

// 폼 데이터 타입
export interface FormData {
  timeCare: string;
  placeCare: string;
}

// 질문 섹션 Props 타입
export interface QuestionSectionProps {
  questionNumber: number;
  title: string;
  options: RadioOption[];
  selectedValue: string;
  onOptionChange: (value: string) => void;
  name: string;
}
<<<<<<< HEAD

// 선택지 게임 타입들
export interface Choice {
  text: string;
  next: string;
  scoreA: number;
  scoreB: number;
  eventId?: string; // 동적 시스템을 위한 이벤트 ID
  effect?: {
    teamBNode?: string;
    teamANode?: string;
  };
}

export interface StoryNode {
  text: string;
  choices: Choice[];
}

export interface GameHistoryEntry {
  node: string;
  teamAChoice: Choice | null;
  teamBChoice: Choice | null;
  teamAScore: number;
  teamBScore: number;
}

export interface GameState {
  teamAName: string;
  teamBName: string;
  teamANode: string;
  teamBNode: string;
  teamAScore: number;
  teamBScore: number;
  teamAChoice: Choice | null;
  teamBChoice: Choice | null;
  gameHistory: GameHistoryEntry[];
}
=======
>>>>>>> origin/master
