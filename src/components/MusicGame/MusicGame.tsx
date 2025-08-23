import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScore } from "../../contexts/ScoreContext";
import QuickMenu from "../QuickMenu/QuickMenu";
import "../../css/quickMenu.css";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Question {
  id: string;
  title: string;
  artist: string;
  file: string;
  category: string;
  difficulty: "very-easy" | "easy" | "medium" | "hard" | "very-hard";
  keyword: string;
  hint: string;
}

interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
}

const MusicGame: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentTeam, setCurrentTeam] = useState<string>("team1");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const navigate = useNavigate();
  const { teams, updateTeamScore } = useScore();

  // 카테고리 데이터
  const categories: Category[] = [
    { id: "male-idol", name: "남자 아이돌", description: "남성 아이돌 그룹/솔로", icon: "👨‍🎤", color: "#ff6b6b" },
    { id: "female-idol", name: "여자 아이돌", description: "여성 아이돌 그룹/솔로", icon: "👩‍🎤", color: "#ff8e8e" },
    { id: "band", name: "밴드", description: "록/밴드 음악", icon: "🤘", color: "#45b7d1" },
    { id: "hiphop", name: "힙합", description: "힙합/랩 음악", icon: "🎤", color: "#96ceb4" },
    { id: "animation", name: "애니메이션", description: "애니메이션 OST", icon: "🎬", color: "#ff9ff3" },
    { id: "ost", name: "OST", description: "드라마/영화 OST", icon: "🎭", color: "#feca57" },
    { id: "melon", name: "멜론 탑 100", description: "멜론 차트 인기곡", icon: "🍈", color: "#54a0ff" },
    { id: "2000s", name: "2000년대", description: "2000년대 음악", icon: "💿", color: "#5f27cd" },
    { id: "2010s", name: "2010년대", description: "2010년대 음악", icon: "📱", color: "#00d2d3" },
    { id: "2020s", name: "2020년대", description: "2020년대 음악", icon: "🎧", color: "#ff6348" },
  ];

  // 문제 데이터 (각 카테고리별로 10개씩, 난이도 순서대로 정렬)
  const questions: Question[] = [
    // 남자 아이돌 (10개) - 난이도 순서대로
    {
      id: "male-idol1",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "male-idol2",
      title: "",
      artist: "",
      file: "https://youtu.be/8OAQ6RuYFGE?feature=shared",
      category: "male-idol",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "male-idol3",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "male-idol4",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "male-idol5",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "male-idol6",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "male-idol7",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "male-idol8",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "male-idol9",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },
    {
      id: "male-idol10",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },

    // 여자 아이돌 (10개) - 난이도 순서대로
    {
      id: "female-idol1",
      title: "붐바야",
      artist: "블랙핑크",
      file: "/music/feidol1.mp4",
      category: "female-idol",
      difficulty: "very-easy",
      keyword: "엠버서더",
      hint: "이걸 힌트봐?",
    },
    
    {
      id: "female-idol2",
      title: "언더워터",
      artist: "권은비",
      file: "/music/feidol2.mp4",
      category: "female-idol",
      difficulty: "very-easy",
      keyword: "여름",
      hint: "워터밤",
    },
    {
      id: "female-idol3",
      title: "테디베어",
      artist: "스테이씨",
      file: "/music/feidol3.mp4",
      category: "female-idol",
      difficulty: "easy",
      keyword: "4세대 걸그룹",
      hint: "박남정 딸",
    },
    
    {
      id: "female-idol4",
      title: "How You Like That",
      artist: "BLACKPINK",
      file: "/music/feidol4.mp4",
      category: "female-idol",
      difficulty: "easy",
      keyword: "블랙핑크",
      hint: "4인조 여성 그룹의 대표곡",
    },
    {
      id: "female-idol5",
      title: "Fancy",
      artist: "TWICE",
      file: "/music/feidol5.mp4",
      category: "female-idol",
      difficulty: "medium",
      keyword: "트와이스",
      hint: "9인조 여성 그룹의 히트곡",
    },
    
    {
      id: "female-idol6",
      title: "사뿐사뿐",
      artist: "에이오에이",
      file: "/music/feidol6.mp4",
      category: "female-idol",
      difficulty: "medium",
      keyword: "에이스오브엔젤",
      hint: "XXXX 걸어가",
    },
    {
      id: "female-idol7",
      title: "Lovesick Girls",
      artist: "BLACKPINK",
      file: "/music/feidol7.mp4",
      category: "female-idol",
      difficulty: "hard",
      keyword: "러브씩",
      hint: "블랙핑크의 팝 펑크 스타일 곡",
    },
    {
      id: "female-idol8",
      title: "IU - Good Day",
      artist: "IU",
      file: "/music/feidol8.mp4",
      category: "female-idol",
      difficulty: "hard",
      keyword: "아이유",
      hint: "솔로 여성 가수의 히트곡",
    },
    {
      id: "female-idol9",
      title: "이브프시케그리고푸른수염의아내",
      artist: "르세라핌",
      file: "/music/feidol9.mp4",
      category: "female-idol",
      difficulty: "very-hard",
      keyword: "대천사",
      hint: "이브 프시케 그리고 XXXX의 아내",
    },
    {
      id: "female-idol10",
      title: "DDU-DU DDU-DU",
      artist: "BLACKPINK",
      file: "/music/feidol10.mp4",
      category: "female-idol",
      difficulty: "very-hard",
      keyword: "두두두두",
      hint: "블랙핑크의 히트곡",
    },
    

    // 힙합 (10개) - 난이도 순서대로
    {
      id: "hiphop1",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "hiphop2",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "hiphop3",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "hiphop4",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "hiphop5",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "hiphop6",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "hiphop7",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "hiphop8",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "hiphop9",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },
    {
      id: "hiphop10",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },

    // 밴드 (10개) - 난이도 순서대로
    {
      id: "band1",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "band2",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "band3",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "band4",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "band5",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "band6",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "band7",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "band8",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "band9",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },
    {
      id: "band10",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },

    // 멜론 탑 100 (10개) - 난이도 순서대로
    {
      id: "melon1",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "melon",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "melon2",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "melon",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "melon3",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "melon",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "melon4",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "melon",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "melon5",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "melon",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "melon6",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "melon",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "melon7",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "melon",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "melon8",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "melon",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "melon9",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "melon",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },
    {
      id: "melon10",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "melon",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },

    // 2000년대 (10개) - 난이도 순서대로
    {
      id: "2000s1",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "2000s2",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "2000s3",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "2000s4",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "2000s5",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "2000s6",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },  
    {
      id: "2000s7",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "2000s8",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "2000s9",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },
    {
      id: "2000s10",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },

    // 2010년대 (10개) - 난이도 순서대로
    {
      id: "2010s1",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "2010s2",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "2010s3",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "2010s4",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "2010s5",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "2010s6",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "2010s7",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "2010s8",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "2010s9",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },
    {
      id: "2010s10",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },

    // 애니메이션 (10개) - 난이도 순서대로
    {
      id: "animation1",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "animation2",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "animation3",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "animation4",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "animation5",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "animation6",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "animation7",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "animation8",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "animation9",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },
    {
      id: "animation10",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },

    // OST (10개) - 난이도 순서대로
    {
      id: "ost1",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "ost2",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "ost3",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "ost4",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "ost5",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "ost6",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "ost7",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "ost8",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "ost9",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },
    {
      id: "ost10",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },

    // 2020년대 (10개) - 난이도 순서대로
    {
      id: "2020s1",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "2020s2",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "very-easy",
      keyword: "",
      hint: "",
    },
    {
      id: "2020s3",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "2020s4",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "easy",
      keyword: "",
      hint: "",
    },
    {
      id: "2020s5",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "2020s6",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "medium",
      keyword: "",
      hint: "",
    },
    {
      id: "2020s7",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "2020s8",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "hard",
      keyword: "",
      hint: "",
    },
    {
      id: "2020s9",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },
    {
      id: "2020s10",
      title: "",
      artist: "",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "very-hard",
      keyword: "",
      hint: "",
    },
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentQuestion(null);
    setUserAnswer("");
    setShowAnswer(false);
    setIsPlaying(false);
    // 히스토리에 상태 추가
    window.history.pushState({ screen: "questions" }, "", "");
  };

  const handleBackToMain = () => {
    navigate("/main");
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setCurrentQuestion(null);
    setUserAnswer("");
    setShowAnswer(false);
    setIsPlaying(false);
    // 히스토리에서 뒤로가기
    window.history.back();
  };

  const handleQuestionSelect = (question: Question) => {
    // 이미 완료된 문제는 선택 불가
    if (completedQuestions.has(question.id)) return;

    setCurrentQuestion(question);
    setUserAnswer("");
    setShowAnswer(false);
    setIsPlaying(false);
    setShowHint(false);
    setCurrentTime(0);

    // 새로운 오디오 객체 생성
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }

    const newAudio = new Audio(question.file);
    newAudio.volume = 0.7; // 볼륨 설정
    
    // 오디오 로딩 이벤트 추가
    newAudio.addEventListener('loadeddata', () => {
      console.log('오디오 로딩 완료:', question.file);
    });
    
    // 시간 업데이트 이벤트 추가
    newAudio.addEventListener('timeupdate', () => {
      setCurrentTime(newAudio.currentTime);
    });
    
    newAudio.addEventListener('error', (e) => {
      console.error('오디오 로딩 실패:', e);
      alert('오디오 파일을 로드할 수 없습니다. 파일 경로를 확인해주세요.');
    });
    
    setAudioRef(newAudio);

    // 히스토리에 상태 추가
    window.history.pushState({ screen: "game" }, "", "");
  };

  const handlePlayPause = () => {
    if (!audioRef) return;

    if (isPlaying) {
      audioRef.pause();
      setIsPlaying(false);
    } else {
      audioRef.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("오디오 재생 실패:", error);
          alert("오디오를 재생할 수 없습니다. 링크를 확인해주세요.");
          setIsPlaying(false);
        });
    }
  };

  const handlePlay5Seconds = () => {
    if (!audioRef) return;

    // 현재 재생 중이면 정지
    if (isPlaying) {
      audioRef.pause();
      setIsPlaying(false);
    }

    // 5초 후 자동 정지
    const stopAfter5Seconds = setTimeout(() => {
      if (audioRef) {
        audioRef.pause();
        setIsPlaying(false);
      }
    }, 5000);
    
    audioRef.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("오디오 재생 실패:", error);
        alert("오디오를 재생할 수 없습니다. 링크를 확인해주세요.");
        setIsPlaying(false);
        clearTimeout(stopAfter5Seconds);
      });
  };

  // 오디오 종료 시 상태 업데이트
  React.useEffect(() => {
    if (audioRef) {
      const handleEnded = () => {
        setIsPlaying(false);
      };

      audioRef.addEventListener("ended", handleEnded);

      return () => {
        audioRef.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioRef]);

  // 브라우저 뒤로가기 버튼 처리
  React.useEffect(() => {
    const handlePopState = () => {
      // 현재 상태에 따라 순서대로 뒤로가기
      if (currentQuestion) {
        // 게임 플레이 화면 → 문제 선택 화면
        setCurrentQuestion(null);
        setUserAnswer("");
        setShowAnswer(false);
        setIsPlaying(false);
        setShowHint(false);
      } else if (selectedCategory) {
        // 문제 선택 화면 → 카테고리 선택 화면
        setSelectedCategory(null);
        setCurrentQuestion(null);
        setUserAnswer("");
        setShowAnswer(false);
        setIsPlaying(false);
      }
      // 카테고리 선택 화면 → 메인으로 (기본 동작)
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentQuestion, selectedCategory]);

  const handleCheckAnswer = (teamId: string) => {
    if (!currentQuestion) return;

    // 입력값 정규화 (띄어쓰기 제거)
    const cleanUserAnswer = userAnswer.toLowerCase().replace(/\s+/g, "");
    const cleanTitle = currentQuestion.title.toLowerCase().replace(/\s+/g, "");
    const cleanArtist = currentQuestion.artist.toLowerCase().replace(/\s+/g, "");

    // 띄어쓰기 없이 입력된 경우도 고려하여 정답 체크
    // 방법 1: 띄어쓰기 없이 입력된 경우
    const noSpaceCorrect =
      cleanUserAnswer.includes(cleanTitle) && cleanUserAnswer.includes(cleanArtist);

    // 방법 2: 띄어쓰기가 있는 경우 (기존 로직)
    const spacedUserAnswer = userAnswer.toLowerCase().replace(/\s+/g, " ").trim();
    const spacedTitle = currentQuestion.title.toLowerCase().replace(/\s+/g, " ").trim();
    const spacedArtist = currentQuestion.artist.toLowerCase().replace(/\s+/g, " ").trim();

    const userWords = spacedUserAnswer.split(/\s+/);
    const titleWords = spacedTitle.split(/\s+/);
    const artistWords = spacedArtist.split(/\s+/);

    const titleCorrect = titleWords.every((word) => userWords.includes(word));
    const artistCorrect = artistWords.every((word) => userWords.includes(word));
    const spacedCorrect = titleCorrect && artistCorrect;

    const correct = noSpaceCorrect || spacedCorrect;

    if (correct) {
      // 난이도별 점수 계산
      const getScoreByDifficulty = (difficulty: string) => {
        switch (difficulty) {
          case "very-easy":
            return 10;
          case "easy":
            return 20;
          case "medium":
            return 30;
          case "hard":
            return 40;
          case "very-hard":
            return 50;
          default:
            return 10;
        }
      };

      const scoreToAdd = getScoreByDifficulty(currentQuestion.difficulty);

      // 해당 팀의 점수 증가
      updateTeamScore(teamId, scoreToAdd);
      // 완료된 문제에 추가
      setCompletedQuestions((prev) => new Set([...prev, currentQuestion.id]));
      setIsCorrect(true);
      setShowAnswer(true);
    } else {
      setIsCorrect(false);
      // 틀렸을 때는 입력값만 초기화하고 계속 도전 가능
      setUserAnswer("");
      // 2초 후 틀림 표시 제거
      setTimeout(() => {
        setIsCorrect(null);
      }, 2000);
    }
  };



  const handleShowHint = () => {
    if (!currentQuestion) return;

    setShowHint(true);
  };



  const getCategoryQuestions = (categoryId: string) => {
    return questions.filter((q) => q.category === categoryId);
  };

  const getCurrentCategory = () => {
    return categories.find((c) => c.id === selectedCategory);
  };



  const getTotalScore = () => {
    return teams.reduce((total, team) => total + team.score, 0);
  };

  // 이기는 팀을 판단하는 함수
  const getWinningTeam = () => {
    if (teams.length === 0) return null;
    
    const maxScore = Math.max(...teams.map(team => team.score));
    const winningTeams = teams.filter(team => team.score === maxScore);
    
    // 동점인 경우 null 반환 (무승부)
    if (winningTeams.length > 1) return null;
    
    return winningTeams[0];
  };

  const getHintText = (question: Question) => {
    return question.hint;
  };

  // 시간 포맷팅 함수 (초를 mm:ss 형태로 변환)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 카테고리 선택 화면
  if (!selectedCategory) {
    return (
      <div className="music-game">
        <div className="game-header">
          <div className="header-top">
            <button onClick={handleBackToMain} className="back-to-main-btn">
              ← 메인으로
            </button>
            <h1>🎵 음악 맞추기 게임</h1>
            <div className="team-scores">
              {teams.map((team) => {
                const winningTeam = getWinningTeam();
                const isWinning = winningTeam && winningTeam.id === team.id;
                
                return (
                  <div
                    key={team.id}
                    className={`team-score ${isWinning ? "winning" : ""}`}
                    style={{ borderColor: team.color }}
                  >
                    <span className="team-name">{team.name}</span>
                    <span className="team-points">{team.score}점</span>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="game-description">카테고리를 선택하고 음악을 맞춰보세요!</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategorySelect(category.id)}
              style={{ borderColor: category.color }}
            >
              <div className="category-icon" style={{ color: category.color }}>
                {category.icon}
              </div>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-description">{category.description}</p>
              <div className="question-count">{getCategoryQuestions(category.id).length}문제</div>
            </div>
          ))}
        </div>

      </div>
    );
  }

  // 문제 선택 화면
  if (selectedCategory && !currentQuestion) {
    const categoryQuestions = getCategoryQuestions(selectedCategory);
    const currentCategory = getCurrentCategory();

    return (
      <div className="music-game">
        <div className="game-header">
          <div className="header-top">
            <button onClick={handleBackToCategories} className="back-to-main-btn">
              ← 카테고리로
            </button>
            <h1>
              {currentCategory?.icon} {currentCategory?.name}
            </h1>
            <div className="team-scores">
              {teams.map((team) => {
                const winningTeam = getWinningTeam();
                const isWinning = winningTeam && winningTeam.id === team.id;
                
                return (
                  <div
                    key={team.id}
                    className={`team-score ${isWinning ? "winning" : ""}`}
                    style={{ borderColor: team.color }}
                  >
                    <span className="team-name">{team.name}</span>
                    <span className="team-points">{team.score}점</span>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="game-description">{currentCategory?.description} 문제를 선택하세요!</p>
        </div>

        <div className="questions-grid">
          {categoryQuestions.map((question, index) => (
            <div
              key={question.id}
              className={`question-card ${question.difficulty} ${
                completedQuestions.has(question.id) ? "completed" : ""
              }`}
              onClick={() => handleQuestionSelect(question)}
            >
              <div className="question-number">#{index + 1}</div>
              <div className="question-info">
                <h3>{question.keyword || "음악"}</h3>
              </div>
              <div className={`difficulty-badge ${question.difficulty}`}>
                {question.difficulty === "very-easy"
                  ? "매우 쉬움"
                  : question.difficulty === "easy"
                  ? "쉬움"
                  : question.difficulty === "medium"
                  ? "보통"
                  : question.difficulty === "hard"
                  ? "어려움"
                  : "매우 어려움"}
              </div>
              {completedQuestions.has(question.id) && (
                <div className="completed-badge">✅ 완료</div>
              )}
            </div>
          ))}
        </div>

      </div>
    );
  }

  // 게임 플레이 화면
  return (
    <div className="music-game">
      <div className="game-header">
        <div className="header-top">
          <button onClick={handleBackToCategories} className="back-to-main-btn">
            ← 카테고리로
          </button>
          <h1>🎵 음악 맞추기</h1>
          <div className="team-scores">
            {teams.map((team) => {
              const winningTeam = getWinningTeam();
              const isWinning = winningTeam && winningTeam.id === team.id;
              
              return (
                <div
                  key={team.id}
                  className={`team-score ${isWinning ? "winning" : ""}`}
                  style={{ borderColor: team.color }}
                >
                  <span className="team-name">{team.name}</span>
                  <span className="team-points">{team.score}점</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="game-area">
        <div className="question-info">
          <h3>음악을 듣고 제목과 아티스트를 맞춰보세요!</h3>
          <p>카테고리: {getCurrentCategory()?.name}</p>
        </div>

        <div className="audio-controls">
          <div className="audio-buttons">
            <button
              onClick={handlePlayPause}
              className={`btn ${isPlaying ? "btn-pause" : "btn-play"}`}
              disabled={!currentQuestion}
            >
              {isPlaying ? "⏸️ 정지" : "▶️ 재생"}
            </button>
            <button
              onClick={handlePlay5Seconds}
              className="btn btn-play-5s"
              disabled={!currentQuestion || isPlaying}
            >
              ⏱️ 5초 더 듣기
            </button>
          </div>
          <div className="timer-display">
            <span className="timer-text">⏱️ {formatTime(currentTime)}</span>
          </div>
        </div>

        <div className="answer-section">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="가수 '이름'과 노래 '제목' 순서대로 말해주세요."
            className={`answer-input ${isCorrect === false ? "wrong" : ""}`}
            disabled={showAnswer}
          />
          <div className="answer-buttons">
            <button
              onClick={() => handleCheckAnswer("team1")}
              className="btn btn-check-team1"
              disabled={showAnswer || !userAnswer.trim()}
              style={{ backgroundColor: teams.find(t => t.id === "team1")?.color }}
            >
              {teams.find(t => t.id === "team1")?.name}
            </button>
            <button
              onClick={() => handleCheckAnswer("team2")}
              className="btn btn-check-team2"
              disabled={showAnswer || !userAnswer.trim()}
              style={{ backgroundColor: teams.find(t => t.id === "team2")?.color }}
            >
              {teams.find(t => t.id === "team2")?.name}
            </button>
            <button
              onClick={handleShowHint}
              className="btn btn-hint"
              disabled={showAnswer || showHint}
            >
              💡 힌트 보기
            </button>
          </div>
        </div>

        {showHint && currentQuestion && (
          <div className="hint-section">
            <h4>💡 힌트</h4>
            <p>{getHintText(currentQuestion)}</p>
          </div>
        )}

        {isCorrect === false && (
          <div className="wrong-answer">
            <span>❌ 틀렸습니다! 다시 시도해보세요!</span>
          </div>
        )}

        {showAnswer && currentQuestion && (
          <div className="correct-answer">
            <h4>
              🎉 정답입니다! {currentQuestion.artist} - {currentQuestion.title}
            </h4>
            <p className="score-info">
              {currentQuestion.difficulty === "very-easy"
                ? "10점"
                : currentQuestion.difficulty === "easy"
                ? "20점"
                : currentQuestion.difficulty === "medium"
                ? "30점"
                : currentQuestion.difficulty === "hard"
                ? "40점"
                : "50점"}{" "}
              획득!
            </p>
            <button onClick={() => setCurrentQuestion(null)} className="btn btn-primary">
              문제 보기
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default MusicGame;
