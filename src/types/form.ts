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
