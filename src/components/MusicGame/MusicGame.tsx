import React, { useState, useEffect } from "react";
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
  contributor?: string;
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
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [canShowHint, setCanShowHint] = useState<boolean>(false);
  const [totalPlayTime, setTotalPlayTime] = useState<number>(0);
  const navigate = useNavigate();
  const { teams, updateTeamScore } = useScore();

  // 카테고리 데이터
  const categories: Category[] = [
    {
      id: "male-idol",
      name: "남자 아이돌",
      description: "남성 아이돌 그룹/솔로",
      icon: "👨‍🎤",
      color: "#ff6b6b",
    },
    {
      id: "female-idol",
      name: "여자 아이돌",
      description: "여성 아이돌 그룹/솔로",
      icon: "👩‍🎤",
      color: "#ff8e8e",
    },
    { id: "band", name: "밴드", description: "록/밴드 음악", icon: "🤘", color: "#45b7d1" },
    { id: "hiphop", name: "힙합", description: "힙합/랩 음악", icon: "🎤", color: "#96ceb4" },
    {
      id: "animation",
      name: "애니메이션",
      description: "애니메이션 OST",
      icon: "🎬",
      color: "#ff9ff3",
    },
    {
      id: "ost",
      name: "OST",
      description: "드라마/영화 OST",
      icon: "🎭",
      color: "#feca57",
      contributor: "강효진",
    },
    {
      id: "melon",
      name: "멜론 탑 100",
      description: "멜론 차트 인기곡",
      icon: "🍈",
      color: "#54a0ff",
    },
    { id: "2000s", name: "2000년대", description: "2000년대 음악", icon: "💿", color: "#5f27cd" },
    {
      id: "2010s",
      name: "2010년대",
      description: "2010년대 음악",
      icon: "📱",
      color: "#00d2d3",
      contributor: "안재우",
    },
    { id: "2020s", name: "2020년대", description: "2020년대 음악", icon: "🎧", color: "#ff6348" },
  ];

  // 문제 데이터 (각 카테고리별로 10개씩, 난이도 순서대로 정렬)
  const questions: Question[] = [
    // 남자 아이돌 (10개) - 난이도 순서대로
    {
      id: "male-idol1",
      title: "풍선",
      artist: "동방신기",
      file: "/music/midol1.mp4",
      category: "male-idol",
      difficulty: "very-easy",
      keyword: "맨땅에헤딩",
      hint: "벌룬",
    },
    {
      id: "male-idol2",
      title: "공허해",
      artist: "위너",
      file: "/music/midol2.mp4",
      category: "male-idol",
      difficulty: "very-easy",
      keyword: "슈스케",
      hint: "에베벱",
    },
    {
      id: "male-idol3",
      title: "셜록",
      artist: "샤이니",
      file: "/music/midol3.mp4",
      category: "male-idol",
      difficulty: "easy",
      keyword: "BBC",
      hint: "있겠냐",
    },
    {
      id: "male-idol4",
      title: "하루하루",
      artist: "빅뱅",
      file: "/music/midol4.mp4",
      category: "male-idol",
      difficulty: "easy",
      keyword: "무한도전",
      hint: "하루이틀",
    },
    {
      id: "male-idol5",
      title: "스노우프린스",
      artist: "더블에스오공일",
      file: "/music/midol5.mp4",
      category: "male-idol",
      difficulty: "medium",
      keyword: "소방관",
      hint: "겨울왕자",
    },
    {
      id: "male-idol6",
      title: "러브샷",
      artist: "엑소",
      file: "/music/midol6.mp4",
      category: "male-idol",
      difficulty: "medium",
      keyword: "엘",
      hint: "사랑의총알",
    },
    {
      id: "male-idol7",
      title: "숨",
      artist: "비스트",
      file: "/music/midol7.mp4",
      category: "male-idol",
      difficulty: "hard",
      keyword: "에이제이",
      hint: "들X날X",
    },
    {
      id: "male-idol8",
      title: "빛나리",
      artist: "펜타곤",
      file: "/music/midol8.mp4",
      category: "male-idol",
      difficulty: "hard",
      keyword: "찌질이",
      hint: "대머리",
    },
    {
      id: "male-idol9",
      title: "전하지못한진심",
      artist: "방탄소년단",
      file: "/music/midol9.mp4",
      category: "male-idol",
      difficulty: "very-hard",
      keyword: "메이플스토리",
      hint: "XXXXX진심",
    },
    {
      id: "male-idol10",
      title: "시오브러브",
      artist: "플라이투더스카이",
      file: "/music/midol10.mp4",
      category: "male-idol",
      difficulty: "very-hard",
      keyword: "런닝샤스",
      hint: "사랑의바다",
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
      title: "미스터",
      artist: "카라",
      file: "/music/feidol4.mp4",
      category: "female-idol",
      difficulty: "easy",
      keyword: "엉덩이",
      hint: "없어요 힌트 있었는데? 없어요",
    },
    {
      id: "female-idol5",
      title: "luv",
      artist: "에이핑크",
      file: "/music/feidol5.mp4",
      category: "female-idol",
      difficulty: "medium",
      keyword: "레깅스",
      hint: "손나 이쁜 손나은",
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
      title: "뱅",
      artist: "애프터스쿨",
      file: "/music/feidol7.mp4",
      category: "female-idol",
      difficulty: "hard",
      keyword: "군악대",
      hint: "방과 후",
    },
    {
      id: "female-idol8",
      title: "별별별",
      artist: "엔믹스",
      file: "/music/feidol8.mp4",
      category: "female-idol",
      difficulty: "hard",
      keyword: "밈 장인",
      hint: "오해원 이쁨!!",
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
      title: "나는아픈건딱질색이니까",
      artist: "아이들",
      file: "/music/feidol10.mp4",
      category: "female-idol",
      difficulty: "very-hard",
      keyword: "적십자논란",
      hint: "XX 아픈 건 X 질색이니까",
    },

    // 힙합 (10개) - 난이도 순서대로
    {
      id: "hiphop1",
      title: "우산",
      artist: "에픽하이",
      file: "/music/hip1.mp4",
      category: "hiphop",
      difficulty: "very-easy",
      keyword: "피처링",
      hint: "없없",
    },
    {
      id: "hiphop2",
      title: "죽일놈",
      artist: "다이나믹듀오",
      file: "/music/hip2.mp4",
      category: "hiphop",
      difficulty: "very-easy",
      keyword: "나레이션",
      hint: "왜그랬어",
    },
    {
      id: "hiphop3",
      title: "몸매",
      artist: "박재범",
      file: "/music/hip3.mp4",
      category: "hiphop",
      difficulty: "easy",
      keyword: "섹시",
      hint: "힌트쓰기귀찮",
    },
    {
      id: "hiphop4",
      title: "오아시스",
      artist: "크러쉬",
      file: "/music/hip4.mp4",
      category: "hiphop",
      difficulty: "easy",
      keyword: "두부",
      hint: "쉬스마인~",
    },
    {
      id: "hiphop5",
      title: "디",
      artist: "딘",
      file: "/music/hip5.mp4",
      category: "hiphop",
      difficulty: "medium",
      keyword: "퇴폐미",
      hint: "에이비씨",
    },
    {
      id: "hiphop6",
      title: "충분히예뻐",
      artist: "버벌진트",
      file: "/music/hip6.mp4",
      category: "hiphop",
      difficulty: "medium",
      keyword: "버벌리",
      hint: "쉽자나여",
    },
    {
      id: "hiphop7",
      title: "헤픈우연",
      artist: "헤이즈",
      file: "/music/hip7.mp4",
      category: "hiphop",
      difficulty: "hard",
      keyword: "장다혜",
      hint: "X픈X연",
    },
    {
      id: "hiphop8",
      title: "스몰걸",
      artist: "이영지",
      file: "/music/hip8.mp4",
      category: "hiphop",
      difficulty: "hard",
      keyword: "지락실",
      hint: "작은소녀",
    },
    {
      id: "hiphop9",
      title: "몽환의숲",
      artist: "키네틱플로우",
      file: "/music/hip9.mp4",
      category: "hiphop",
      difficulty: "very-hard",
      keyword: "피아노",
      hint: "XXX플로우",
    },
    {
      id: "hiphop10",
      title: "푸스",
      artist: "지민아이언",
      file: "/music/hip10.mp4",
      category: "hiphop",
      difficulty: "very-hard",
      keyword: "사무엘잭슨",
      hint: "철",
    },

    // 밴드 (10개) - 난이도 순서대로
    {
      id: "band1",
      title: "낭만고양이",
      artist: "체리필터",
      file: "/music/band1.mp4",
      category: "band",
      difficulty: "very-easy",
      keyword: "치어리딩",
      hint: "모르면나가세요",
    },
    {
      id: "band2",
      title: "너에게난나에게넌",
      artist: "자전거탄풍경",
      file: "/music/band2.mp4",
      category: "band",
      difficulty: "very-easy",
      keyword: "우산",
      hint: "꺼져",
    },
    {
      id: "band3",
      title: "스물다섯스물하나",
      artist: "자우림",
      file: "/music/band3.mp4",
      category: "band",
      difficulty: "easy",
      keyword: "남주혁",
      hint: "지우림",
    },
    {
      id: "band4",
      title: "예뻤어",
      artist: "데이식스",
      file: "/music/band4.mp4",
      category: "band",
      difficulty: "easy",
      keyword: "역주행",
      hint: "이걸?",
    },
    {
      id: "band5",
      title: "고백",
      artist: "뜨거운감자",
      file: "/music/band5.mp4",
      category: "band",
      difficulty: "medium",
      keyword: "1박2일",
      hint: "쉽죠,,?",
    },
    {
      id: "band6",
      title: "바래",
      artist: "에프티아일랜드",
      file: "/music/band6.mp4",
      category: "band",
      difficulty: "medium",
      keyword: "꽃미남",
      hint: "바라~",
    },
    {
      id: "band7",
      title: "나는반딧불",
      artist: "중식이",
      file: "/music/band7.mp4",
      category: "band",
      difficulty: "hard",
      keyword: "나의인생",
      hint: "한식양식일식",
    },
    {
      id: "band8",
      title: "사랑은은하수다방에서",
      artist: "십센치",
      file: "/music/band8.mp4",
      category: "band",
      difficulty: "hard",
      keyword: "커피",
      hint: "10글자",
    },
    {
      id: "band9",
      title: "사랑하긴했었나요",
      artist: "잔나비",
      file: "/music/band9.mp4",
      category: "band",
      difficulty: "very-hard",
      keyword: "42자",
      hint: "가사처음에나오는게정답임,,",
    },
    {
      id: "band10",
      title: "애국가",
      artist: "윤도현밴드",
      file: "/music/band10.mp4",
      category: "band",
      difficulty: "very-hard",
      keyword: "우리나라",
      hint: "거저준다",
    },

    // 멜론 탑 100 (10개) - 난이도 순서대로
    {
      id: "melon1",
      title: "골든",
      artist: "헌트릭스",
      file: "/music/mel1.mp4",
      category: "melon",
      difficulty: "very-easy",
      keyword: "최초",
      hint: "없없",
    },
    {
      id: "melon2",
      title: "드라우닝",
      artist: "우즈",
      file: "/music/mel2.mp4",
      category: "melon",
      difficulty: "very-easy",
      keyword: "홍대병",
      hint: "없없",
    },
    {
      id: "melon3",
      title: "마그네틱",
      artist: "아일릿",
      file: "/music/mel3.mp4",
      category: "melon",
      difficulty: "easy",
      keyword: "유튜버",
      hint: "없없",
    },
    {
      id: "melon4",
      title: "무제",
      artist: "지드래곤",
      file: "/music/mel4.mp4",
      category: "melon",
      difficulty: "easy",
      keyword: "1988.8.18",
      hint: "없없",
    },
    {
      id: "melon5",
      title: "내게사랑이뭐냐고물어본다면",
      artist: "로이킴",
      file: "/music/mel5.mp4",
      category: "melon",
      difficulty: "medium",
      keyword: "막걸리",
      hint: "없없",
    },
    {
      id: "melon6",
      title: "내이름맑음",
      artist: "qwer",
      file: "/music/mel6.mp4",
      category: "melon",
      difficulty: "medium",
      keyword: "계란",
      hint: "없없",
    },
    {
      id: "melon7",
      title: "라이크유배럴",
      artist: "프로미스나인",
      file: "/music/mel7.mp4",
      category: "melon",
      difficulty: "hard",
      keyword: "9-4",
      hint: "당신이더좋아",
    },
    {
      id: "melon8",
      title: "청혼하지않을이유를못찾았어",
      artist: "이무진",
      file: "/music/mel8.mp4",
      category: "melon",
      difficulty: "hard",
      keyword: "빨강노랑초록",
      hint: "ㅊㅎㅎㅈㅇㅇㅇㅇㄹㅁㅊㅇㅇ",
    },
    {
      id: "melon9",
      title: "모래알갱이",
      artist: "임영웅",
      file: "/music/mel9.mp4",
      category: "melon",
      difficulty: "very-hard",
      keyword: "히어로",
      hint: "ㅁㄹㅇㄱㅇ",
    },
    {
      id: "melon10",
      title: "멸종위기사랑",
      artist: "이찬혁",
      file: "/music/mel10.mp4",
      category: "melon",
      difficulty: "very-hard",
      keyword: "천재?",
      hint: "ㅁㅈㅇㄱㅅㄹ",
    },

    // 2000년대 (10개) - 난이도 순서대로
    {
      id: "2000s1",
      title: "쏘리쏘리",
      artist: "슈퍼주니어",
      file: "/music/ss1.mp4",
      category: "2000s",
      difficulty: "very-easy",
      keyword: "20주년",
      hint: "없없",
    },
    {
      id: "2000s2",
      title: "아브라카다브라",
      artist: "브라운아이드걸스",
      file: "/music/ss2.mp4",
      category: "2000s",
      difficulty: "very-easy",
      keyword: "육룡이",
      hint: "없없",
    },
    {
      id: "2000s3",
      title: "벌써일년",
      artist: "브라운아이즈",
      file: "/music/ss3.mp4",
      category: "2000s",
      difficulty: "easy",
      keyword: "한혜진",
      hint: "없없",
    },
    {
      id: "2000s4",
      title: "촛불하나",
      artist: "지오디",
      file: "/music/ss4.mp4",
      category: "2000s",
      difficulty: "easy",
      keyword: "집회",
      hint: "없없",
    },
    {
      id: "2000s5",
      title: "퍼팩트맨",
      artist: "신화",
      file: "/music/ss5.mp4",
      category: "2000s",
      difficulty: "medium",
      keyword: "그리스로마",
      hint: "완벽한남자",
    },
    {
      id: "2000s6",
      title: "투디프런티얼스",
      artist: "원더걸스",
      file: "/music/ss6.mp4",
      category: "2000s",
      difficulty: "medium",
      keyword: "어머나",
      hint: "두개의다른눈물",
    },
    {
      id: "2000s7",
      title: "유어마이걸",
      artist: "김조한",
      file: "/music/ss7.mp4",
      category: "2000s",
      difficulty: "hard",
      keyword: "하이킥",
      hint: "ㅇㅇㅁㅇㄱ",
    },
    {
      id: "2000s8",
      title: "우연",
      artist: "베이비복스",
      file: "/music/ss8.mp4",
      category: "2000s",
      difficulty: "hard",
      keyword: "X맨",
      hint: "ㅇㅇ",
    },
    {
      id: "2000s9",
      title: "그댄행복에살텐데",
      artist: "리즈",
      file: "/music/ss9.mp4",
      category: "2000s",
      difficulty: "very-hard",
      keyword: "전성기",
      hint: "ㄱㄷㅎㅂㅇㅅㅌㄷ",
    },
    {
      id: "2000s10",
      title: "미워도사랑하니까",
      artist: "다비치",
      file: "/music/ss10.mp4",
      category: "2000s",
      difficulty: "very-hard",
      keyword: "안경",
      hint: "ㅁㅇㄷㅅㄹㅎㄴㄲ",
    },

    // 2010년대 (10개) - 난이도 순서대로
    {
      id: "2010s1",
      title: "배드걸굿걸",
      artist: "미쓰에이",
      file: "/music/s1.mp4",
      category: "2010s",
      difficulty: "very-easy",
      keyword: "첫사랑",
      hint: "없없",
    },
    {
      id: "2010s2",
      title: "에이",
      artist: "레인보우",
      file: "/music/s2.mp4",
      category: "2010s",
      difficulty: "very-easy",
      keyword: "무지개",
      hint: "없없",
    },
    {
      id: "2010s3",
      title: "이게무슨일이야",
      artist: "비원에이포",
      file: "/music/s3.mp4",
      category: "2010s",
      difficulty: "easy",
      keyword: "용지",
      hint: "없없",
    },
    {
      id: "2010s4",
      title: "피노키오",
      artist: "에프엑스",
      file: "/music/s4.mp4",
      category: "2010s",
      difficulty: "easy",
      keyword: "코",
      hint: "없없",
    },
    {
      id: "2010s5",
      title: "상상더하기",
      artist: "라붐",
      file: "/music/s5.mp4",
      category: "2010s",
      difficulty: "medium",
      keyword: "군대",
      hint: "없없",
    },
    {
      id: "2010s6",
      title: "에브리띵",
      artist: "검정치마",
      file: "/music/s6.mp4",
      category: "2010s",
      difficulty: "medium",
      keyword: "릴스",
      hint: "없없",
    },
    {
      id: "2010s7",
      title: "명동콜링",
      artist: "카더가든",
      file: "/music/s7.mp4",
      category: "2010s",
      difficulty: "hard",
      keyword: "별명43051개",
      hint: "서울특별시중구전화중",
    },
    {
      id: "2010s8",
      title: "사랑은눈꽃처럼",
      artist: "김준수",
      file: "/music/s8.mp4",
      category: "2010s",
      difficulty: "hard",
      keyword: "뮤지컬남배우1위",
      hint: "XX은XX처럼",
    },
    {
      id: "2010s9",
      title: "댄스더나잇어웨이",
      artist: "트와이스",
      file: "/music/s9.mp4",
      category: "2010s",
      difficulty: "very-hard",
      keyword: "식스틴",
      hint: "밤새도록춤춰",
    },
    {
      id: "2010s10",
      title: "사랑이라쓰고아픔이라부른다",
      artist: "서인영",
      file: "/music/s10.mp4",
      category: "2010s",
      difficulty: "very-hard",
      keyword: "개미",
      hint: "ㅅㄹㅇㄹㅆㄱㅇㅍㅇㄹㅂㄹㄷ",
    },

    // 애니메이션 (10개) - 난이도 순서대로
    {
      id: "animation1",
      title: "코난",
      artist: "4기",
      file: "/music/ani1.mp4",
      category: "animation",
      difficulty: "very-easy",
      keyword: "APTX4869",
      hint: "극장판다봄",
    },
    {
      id: "animation2",
      title: "디지몬어드벤처",
      artist: "1기",
      file: "/music/ani2.mp4",
      category: "animation",
      difficulty: "very-easy",
      keyword: "이세계",
      hint: "태일아,,",
    },
    {
      id: "animation3",
      title: "귀멸의칼날",
      artist: "네즈코",
      file: "/music/ani3.mp4",
      category: "animation",
      difficulty: "easy",
      keyword: "2019년",
      hint: "무한성",
    },
    {
      id: "animation4",
      title: "진격의거인",
      artist: "조사병단",
      file: "/music/ani4.mp4",
      category: "animation",
      difficulty: "easy",
      keyword: "마크",
      hint: "거인",
    },
    {
      id: "animation5",
      title: "너의이름은",
      artist: "젠젠젠세",
      file: "/music/ani5.mp4",
      category: "animation",
      difficulty: "medium",
      keyword: "계단",
      hint: "타키미츠하",
    },
    {
      id: "animation6",
      title: "주토피아",
      artist: "한국어버전",
      file: "/music/ani6.mp4",
      category: "animation",
      difficulty: "medium",
      keyword: "실종",
      hint: "토끼경찰",
    },
    {
      id: "animation7",
      title: "겨울왕국",
      artist: "태어나서처음으로",
      file: "/music/ani7.mp4",
      category: "animation",
      difficulty: "hard",
      keyword: "천만",
      hint: "러브이스오픈더도오오오오",
    },
    {
      id: "animation8",
      title: "시간을달리는소녀",
      artist: "변하지않는것",
      file: "/music/ani8.mp4",
      category: "animation",
      difficulty: "hard",
      keyword: "기다릴게",
      hint: "XX을XXX소녀",
    },
    {
      id: "animation9",
      title: "환상게임",
      artist: "날아오르라주작이여",
      file: "/music/ani9.mp4",
      category: "animation",
      difficulty: "very-hard",
      keyword: "승부조작",
      hint: "XX게임",
    },
    {
      id: "animation10",
      title: "트롤",
      artist: "캔스탑더필링",
      file: "/music/ani10.mp4",
      category: "animation",
      difficulty: "very-hard",
      keyword: "요정",
      hint: "야XX짓하지마",
    },

    // OST (10개) - 난이도 순서대로
    {
      id: "ost1",
      title: "쾌걸춘향",
      artist: "응급실",
      file: "/music/ost1.mp4",
      category: "ost",
      difficulty: "very-easy",
      keyword: "도도기획",
      hint: "없없",
    },
    {
      id: "ost2",
      title: "이태원클라쓰",
      artist: "시작",
      file: "/music/ost2.mp4",
      category: "ost",
      difficulty: "very-easy",
      keyword: "조세호",
      hint: "없없",
    },
    {
      id: "ost3",
      title: "도깨비",
      artist: "첫눈",
      file: "/music/ost3.mp4",
      category: "ost",
      difficulty: "easy",
      keyword: "치킨집",
      hint: "없없",
    },
    {
      id: "ost4",
      title: "비긴어게인",
      artist: "로스타",
      file: "/music/ost4.mp4",
      category: "ost",
      difficulty: "easy",
      keyword: "기타",
      hint: "없없",
    },
    {
      id: "ost5",
      title: "풀하우스",
      artist: "별",
      file: "/music/ost5.mp4",
      category: "ost",
      difficulty: "medium",
      keyword: "츤데레",
      hint: "비송혜교",
    },
    {
      id: "ost6",
      title: "라라랜드",
      artist: "시티오브스타스",
      file: "/music/ost6.mp4",
      category: "ost",
      difficulty: "medium",
      keyword: "꿈의나라",
      hint: "라이언고슬링",
    },
    {
      id: "ost7",
      title: "위대한쇼맨",
      artist: "디스이스미",
      file: "/music/ost7.mp4",
      category: "ost",
      difficulty: "hard",
      keyword: "전기영화",
      hint: "휴잭맨",
    },
    {
      id: "ost8",
      title: "슬기로운의사생활1",
      artist: "화려하지않은고백",
      file: "/music/ost8.mp4",
      category: "ost",
      difficulty: "hard",
      keyword: "데블스플랜",
      hint: "슬기롭다슬기로워",
    },
    {
      id: "ost9",
      title: "웡카",
      artist: "어월드오프유어원",
      file: "/music/ost9.mp4",
      category: "ost",
      difficulty: "very-hard",
      keyword: "퇴폐미",
      hint: "초콜릿",
    },
    {
      id: "ost10",
      title: "슬픔보다더슬픈이야기",
      artist: "그런사람또없습니다",
      file: "/music/ost10.mp4",
      category: "ost",
      difficulty: "very-hard",
      keyword: "이승철",
      hint: "ㅅㅍㅂㄷㄷㅅㅍㅇㅇㄱ",
    },

    // 2020년대 (10개) - 난이도 순서대로
    {
      id: "2020s1",
      title: "러브다이브",
      artist: "아이브",
      file: "/music/sss1.mp4",
      category: "2020s",
      difficulty: "very-easy",
      keyword: "딸기",
      hint: "없없",
    },
    {
      id: "2020s2",
      title: "하입보이",
      artist: "뉴진스",
      file: "/music/sss2.mp4",
      category: "2020s",
      difficulty: "very-easy",
      keyword: "고점퇴장",
      hint: "없없",
    },
    {
      id: "2020s3",
      title: "캔디",
      artist: "엔시티드림",
      file: "/music/sss3.mp4",
      category: "2020s",
      difficulty: "easy",
      keyword: "꿈",
      hint: "없없",
    },
    {
      id: "2020s4",
      title: "살짝설렜어",
      artist: "오마이걸",
      file: "/music/sss4.mp4",
      category: "2020s",
      difficulty: "easy",
      keyword: "또루뀨막또",
      hint: "없없",
    },
    {
      id: "2020s5",
      title: "스파이시",
      artist: "에스파",
      file: "/music/sss5.mp4",
      category: "2020s",
      difficulty: "medium",
      keyword: "밀라노",
      hint: "매워요",
    },
    {
      id: "2020s6",
      title: "개화",
      artist: "루시",
      file: "/music/sss6.mp4",
      category: "2020s",
      difficulty: "medium",
      keyword: "슈퍼밴드",
      hint: "꽃이핀다",
    },
    {
      id: "2020s7",
      title: "아이두미",
      artist: "키키",
      file: "/music/sss7.mp4",
      category: "2020s",
      difficulty: "hard",
      keyword: "마녀배달부",
      hint: "이걸해야돼",
    },
    {
      id: "2020s8",
      title: "다시만나",
      artist: "더윈드",
      file: "/music/sss8.mp4",
      category: "2020s",
      difficulty: "hard",
      keyword: "노래방",
      hint: "바람",
    },
    {
      id: "2020s9",
      title: "17",
      artist: "핑크스웨츠",
      file: "/music/sss9.mp4",
      category: "2020s",
      difficulty: "very-hard",
      keyword: "조지아",
      hint: "분홍땀",
    },
    {
      id: "2020s10",
      title: "사막에서꽃을피우듯",
      artist: "우디",
      file: "/music/sss10.mp4",
      category: "2020s",
      difficulty: "very-hard",
      keyword: "KT김상수동생",
      hint: "ㅅㅁㅇㅅㄲㅊㅍㅇㄷ",
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
    setQuestionStartTime(Date.now());
    setCanShowHint(false);
    setTotalPlayTime(0);

    // 새로운 오디오 객체 생성
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }

    const newAudio = new Audio(question.file);
    newAudio.volume = 0.7; // 볼륨 설정

    // 오디오 로딩 이벤트 추가
    newAudio.addEventListener("loadeddata", () => {
      console.log("오디오 로딩 완료:", question.file);
      // duration 설정
      if (newAudio.duration && isFinite(newAudio.duration)) {
        setDuration(newAudio.duration);
      }
    });

    // 메타데이터 로드 이벤트 추가 (duration을 위해)
    newAudio.addEventListener("loadedmetadata", () => {
      if (newAudio.duration && isFinite(newAudio.duration)) {
        setDuration(newAudio.duration);
      }
    });

    // 시간 업데이트 이벤트 추가
    newAudio.addEventListener("timeupdate", () => {
      setCurrentTime(newAudio.currentTime);
    });

    newAudio.addEventListener("error", (e) => {
      console.error("오디오 로딩 실패:", e);
      alert("오디오 파일을 로드할 수 없습니다. 파일 경로를 확인해주세요.");
      setIsPlaying(false);
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
      audioRef
        .play()
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

  // 노래 재생 시간 추적하여 힌트 활성화
  useEffect(() => {
    if (isPlaying && audioRef) {
      const interval = setInterval(() => {
        // 오디오의 실제 currentTime을 기반으로 총 재생 시간 계산
        const currentPlayTime = audioRef.currentTime;
        setTotalPlayTime(currentPlayTime);

        if (currentPlayTime >= 30 && !canShowHint) {
          setCanShowHint(true);
        }
      }, 100); // 0.1초마다 체크

      return () => clearInterval(interval);
    }
  }, [isPlaying, audioRef, canShowHint]);

  // 5초 더 듣기 후 자동 정지 처리
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

    audioRef
      .play()
      .then(() => {
        setIsPlaying(true);
        // 5초 재생 시작 시점을 기록
        const startTime = Date.now();

        // 5초 동안 정확한 시간 추적
        const playInterval = setInterval(() => {
          const elapsed = (Date.now() - startTime) / 1000;
          if (elapsed >= 5) {
            clearInterval(playInterval);
          }
        }, 100);

        // 5초 후 정리
        setTimeout(() => {
          clearInterval(playInterval);
        }, 5000);
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

    // 애니메이션이나 OST 카테고리는 title만 맞추면 정답
    if (currentQuestion.category === "animation" || currentQuestion.category === "ost") {
      const cleanUserAnswer = userAnswer.toLowerCase().replace(/\s+/g, "");
      const cleanTitle = currentQuestion.title.toLowerCase().replace(/\s+/g, "");

      // title만 포함되어 있으면 정답
      const correct = cleanUserAnswer.includes(cleanTitle);

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
      return;
    }

    // 기존 로직 (남자아이돌, 여자아이돌, 밴드, 힙합 등)
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
    if (!currentQuestion || !canShowHint) return;

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

    const maxScore = Math.max(...teams.map((team) => team.score));
    const winningTeams = teams.filter((team) => team.score === maxScore);

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
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
              className={`category-card ${category.id === "2010s" ? "category-2010s" : ""}`}
              onClick={() => handleCategorySelect(category.id)}
              style={{ borderColor: category.color }}
            >
              <div className="category-icon" style={{ color: category.color }}>
                {category.icon}
              </div>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-description">{category.description}</p>
              {category.contributor && (
                <div className="contributor-badge">
                  🏷️{" "}
                  {category.contributor === "안재우"
                    ? "안재우님은 조금 참여해 주셨습니다"
                    : `${category.contributor}님이 참여해 주셨습니다`}
                </div>
              )}
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
          <p className="game-description">{currentCategory?.description} 문제를 선택해주세요!</p>
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
            <button
              onClick={() => {
                if (audioRef) {
                  audioRef.currentTime = 0;
                  setCurrentTime(0);
                }
              }}
              className="btn btn-restart"
              disabled={!currentQuestion}
            >
              🔄 처음부터 듣기
            </button>
          </div>
          <div className="timer-display">
            <div className="progress-container">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => {
                  const newTime = parseFloat(e.target.value);
                  setCurrentTime(newTime);
                  if (audioRef) {
                    audioRef.currentTime = newTime;
                  }
                }}
                className="progress-bar"
                disabled={!currentQuestion}
                style={
                  {
                    "--progress-percent": duration ? `${(currentTime / duration) * 100}%` : "0%",
                  } as React.CSSProperties
                }
              />
            </div>
          </div>
        </div>

        <div className="answer-section">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={
              currentQuestion &&
              (currentQuestion.category === "animation" || currentQuestion.category === "ost")
                ? "제목을 입력해주세요."
                : "가수 '이름'과 노래 '제목' 순서대로 말해주세요."
            }
            className={`answer-input ${isCorrect === false ? "wrong" : ""}`}
            disabled={showAnswer}
          />
          <div className="answer-buttons">
            <button
              onClick={() => handleCheckAnswer("team1")}
              className="btn btn-check-team1"
              disabled={showAnswer || !userAnswer.trim()}
              style={{ backgroundColor: teams.find((t) => t.id === "team1")?.color }}
            >
              {teams.find((t) => t.id === "team1")?.name}
            </button>
            <button
              onClick={() => handleCheckAnswer("team2")}
              className="btn btn-check-team2"
              disabled={showAnswer || !userAnswer.trim()}
              style={{ backgroundColor: teams.find((t) => t.id === "team2")?.color }}
            >
              {teams.find((t) => t.id === "team2")?.name}
            </button>
            <button
              onClick={handleShowHint}
              className={`btn btn-hint ${!canShowHint ? "disabled" : ""}`}
              disabled={showAnswer || showHint || !canShowHint}
            >
              {canShowHint
                ? "💡 힌트 보기"
                : `💡 힌트 보기 (${Math.max(0, Math.ceil(20 - totalPlayTime))}초 후 공개)`}
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
              🎉 정답입니다!{" "}
              {currentQuestion.category === "animation" || currentQuestion.category === "ost"
                ? currentQuestion.title
                : `${currentQuestion.artist} - ${currentQuestion.title}`}
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
