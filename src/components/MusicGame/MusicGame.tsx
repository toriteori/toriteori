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
    { id: "1990s", name: "1990년대", description: "90년대 음악", icon: "📻", color: "#54a0ff" },
    { id: "2000s", name: "2000년대", description: "2000년대 음악", icon: "💿", color: "#5f27cd" },
    { id: "2010s", name: "2010년대", description: "2010년대 음악", icon: "📱", color: "#00d2d3" },
    { id: "2020s", name: "2020년대", description: "2020년대 음악", icon: "🎧", color: "#ff6348" },
  ];

  // 문제 데이터 (각 카테고리별로 10개씩)
  const questions: Question[] = [
    // 남자 아이돌 (10개)
    {
      id: "male-idol1",
      title: "Dynamite",
      artist: "BTS",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "easy",
      keyword: "방탄소년단",
      hint: "세계적인 인기를 얻은 7인조 그룹",
    },
    {
      id: "male-idol2",
      title: "Spring Day",
      artist: "BTS",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "hard",
      keyword: "봄날",
      hint: "방탄소년단의 감성적인 발라드",
    },
    {
      id: "male-idol3",
      title: "Butter",
      artist: "BTS",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "very-hard",
      keyword: "버터",
      hint: "방탄소년단의 영어 싱글",
    },
    {
      id: "male-idol4",
      title: "하루하루",
      artist: "빅뱅",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "very-easy",
      keyword: "빅뱅",
      hint: "무한도전에서 나온 곡",
    },
    {
      id: "male-idol5",
      title: "Gangnam Style",
      artist: "PSY",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "easy",
      keyword: "강남스타일",
      hint: "전 세계적으로 유명해진 K-POP 곡",
    },
    {
      id: "male-idol6",
      title: "손성모",
      artist: "손성모",
      file: "https://youtu.be/8OAQ6RuYFGE?feature=shared",
      category: "male-idol",
      difficulty: "very-easy",
      keyword: "일이삼사오륙칠팔",
      hint: "가수 이름과 노래 제목이 같습니다",
    },
    {
      id: "male-idol7",
      title: "EXO - Growl",
      artist: "EXO",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "medium",
      keyword: "엑소",
      hint: "12인조 남성 그룹의 대표곡",
    },
    {
      id: "male-idol8",
      title: "SHINee - Ring Ding Dong",
      artist: "SHINee",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "medium",
      keyword: "샤이니",
      hint: "5인조 남성 그룹의 히트곡",
    },
    {
      id: "male-idol9",
      title: "Super Junior - Sorry Sorry",
      artist: "Super Junior",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "hard",
      keyword: "슈퍼주니어",
      hint: "13인조 남성 그룹의 대표곡",
    },
    {
      id: "male-idol10",
      title: "Big Bang - Fantastic Baby",
      artist: "Big Bang",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "male-idol",
      difficulty: "very-hard",
      keyword: "빅뱅",
      hint: "5인조 남성 그룹의 히트곡",
    },

    // 여자 아이돌 (10개)
    {
      id: "female-idol1",
      title: "How You Like That",
      artist: "BLACKPINK",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "female-idol",
      difficulty: "medium",
      keyword: "블랙핑크",
      hint: "4인조 여성 그룹의 대표곡",
    },
    {
      id: "female-idol2",
      title: "Lovesick Girls",
      artist: "BLACKPINK",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "female-idol",
      difficulty: "hard",
      keyword: "러브씩",
      hint: "블랙핑크의 팝 펑크 스타일 곡",
    },
    {
      id: "female-idol3",
      title: "DDU-DU DDU-DU",
      artist: "BLACKPINK",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "female-idol",
      difficulty: "very-hard",
      keyword: "두두두두",
      hint: "블랙핑크의 히트곡",
    },
    {
      id: "female-idol4",
      title: "Fancy",
      artist: "TWICE",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "female-idol",
      difficulty: "medium",
      keyword: "트와이스",
      hint: "9인조 여성 그룹의 히트곡",
    },
    {
      id: "female-idol5",
      title: "TT",
      artist: "TWICE",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "female-idol",
      difficulty: "easy",
      keyword: "트와이스",
      hint: "9인조 여성 그룹의 대표곡",
    },
    {
      id: "female-idol6",
      title: "Red Velvet - Red Flavor",
      artist: "Red Velvet",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "female-idol",
      difficulty: "medium",
      keyword: "레드벨벳",
      hint: "5인조 여성 그룹의 히트곡",
    },
    {
      id: "female-idol7",
      title: "Girls' Generation - Gee",
      artist: "Girls' Generation",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "female-idol",
      difficulty: "easy",
      keyword: "소녀시대",
      hint: "9인조 여성 그룹의 대표곡",
    },
    {
      id: "female-idol8",
      title: "IU - Good Day",
      artist: "IU",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "female-idol",
      difficulty: "hard",
      keyword: "아이유",
      hint: "솔로 여성 가수의 히트곡",
    },
    {
      id: "female-idol9",
      title: "2NE1 - I Am The Best",
      artist: "2NE1",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "female-idol",
      difficulty: "very-hard",
      keyword: "투애니원",
      hint: "4인조 여성 그룹의 히트곡",
    },
    {
      id: "female-idol10",
      title: "Wonder Girls - Nobody",
      artist: "Wonder Girls",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "female-idol",
      difficulty: "very-easy",
      keyword: "원더걸스",
      hint: "5인조 여성 그룹의 대표곡",
    },

    // 힙합  (10개)
    {
      id: "hiphop1",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "easy",
      keyword: "퀸",
      hint: "영국의 전설적인 록 밴드",
    },
    {
      id: "hiphop2",
      title: "Blinding Lights",
      artist: "The Weeknd",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "very-easy",
      keyword: "위켄드",
      hint: "캐나다의 R&B 가수",
    },
    {
      id: "hiphop3",
      title: "Bad Guy",
      artist: "Billie Eilish",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "easy",
      keyword: "빌리아일리시",
      hint: "미국의 젊은 팝스타",
    },
    {
      id: "hiphop4",
      title: "Levitating",
      artist: "Dua Lipa",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "easy",
      keyword: "듀아리파",
      hint: "영국의 팝 가수",
    },
    {
      id: "hiphop5",
      title: "Watermelon Sugar",
      artist: "Harry Styles",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "medium",
      keyword: "해리스타일즈",
      hint: "원디렉션 출신 솔로 가수",
    },
    {
      id: "hiphop6",
      title: "Don't Start Now",
      artist: "Dua Lipa",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "medium",
      keyword: "듀아리파",
      hint: "디스코 팝 스타일의 곡",
    },
    {
      id: "hiphop7",
      title: "Circles",
      artist: "Post Malone",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "hard",
      keyword: "포스트말론",
      hint: "미국의 힙합/팝 가수",
    },
    {
      id: "hiphop8",
      title: "Adore You",
      artist: "Harry Styles",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "hard",
      keyword: "해리스타일즈",
      hint: "해리 스타일즈의 감성적인 곡",
    },
    {
      id: "hiphop9",
      title: "Therefore I Am",
      artist: "Billie Eilish",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "very-hard",
      keyword: "빌리아일리시",
      hint: "빌리 아일리시의 자신감 넘치는 곡",
    },
    {
      id: "hiphop10",
      title: "Mood",
      artist: "24kGoldn",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "hiphop",
      difficulty: "very-hard",
      keyword: "24kgoldn",
      hint: "미국의 래퍼이자 가수",
    },
    // 밴드 (10개)
    {
      id: "band1",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "very-easy",
      keyword: "퀸",
      hint: "영국의 전설적인 록 밴드",
    },
    {
      id: "band2",
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "very-easy",
      keyword: "레드제플린",
      hint: "클래식 록의 대표곡",
    },
    {
      id: "band3",
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "easy",
      keyword: "건즈앤로지즈",
      hint: "미국의 하드 록 밴드",
    },
    {
      id: "band4",
      title: "Hotel California",
      artist: "Eagles",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "easy",
      keyword: "이글스",
      hint: "미국의 록 밴드",
    },
    {
      id: "band5",
      title: "Smells Like Teen Spirit",
      artist: "Nirvana",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "medium",
      keyword: "너바나",
      hint: "그런지 록의 대표 밴드",
    },
    {
      id: "band6",
      title: "Wonderwall",
      artist: "Oasis",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "medium",
      keyword: "오아시스",
      hint: "영국의 브릿팝 밴드",
    },
    {
      id: "band7",
      title: "Creep",
      artist: "Radiohead",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "hard",
      keyword: "라디오헤드",
      hint: "영국의 얼터너티브 록 밴드",
    },
    {
      id: "band8",
      title: "Zombie",
      artist: "The Cranberries",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "hard",
      keyword: "크랜베리스",
      hint: "아일랜드의 록 밴드",
    },
    {
      id: "band9",
      title: "Paranoid Android",
      artist: "Radiohead",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "very-hard",
      keyword: "라디오헤드",
      hint: "라디오헤드의 실험적인 곡",
    },
    {
      id: "band10",
      title: "Karma Police",
      artist: "Radiohead",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "band",
      difficulty: "very-hard",
      keyword: "라디오헤드",
      hint: "라디오헤드의 대표곡",
    },
    // 1990년대 (10개)
    {
      id: "1990s1",
      title: "In Da Club",
      artist: "50 Cent",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "1990s",
      difficulty: "very-easy",
      keyword: "50센트",
      hint: "미국의 래퍼",
    },
    {
      id: "1990s2",
      title: "Lose Yourself",
      artist: "Eminem",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "1990s",
      difficulty: "very-easy",
      keyword: "에미넴",
      hint: "8마일 영화 주제곡",
    },
    {
      id: "1990s3",
      title: "Stronger",
      artist: "Kanye West",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "1990s",
      difficulty: "easy",
      keyword: "카니예웨스트",
      hint: "미국의 힙합 아티스트",
    },
    {
      id: "1990s4",
      title: "Empire State of Mind",
      artist: "Jay-Z",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "1990s",
      difficulty: "easy",
      keyword: "제이지",
      hint: "뉴욕을 노래한 힙합 곡",
    },
    {
      id: "1990s5",
      title: "God's Plan",
      artist: "Drake",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "1990s",
      difficulty: "medium",
      keyword: "드레이크",
      hint: "캐나다의 래퍼",
    },
    {
      id: "1990s6",
      title: "Sicko Mode",
      artist: "Travis Scott",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "1990s",
      difficulty: "medium",
      keyword: "트래비스스캇",
      hint: "미국의 트랩 아티스트",
    },
    {
      id: "1990s7",
      title: "Old Town Road",
      artist: "Lil Nas X",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "1990s",
      difficulty: "hard",
      keyword: "릴나스엑스",
      hint: "컨트리와 힙합을 결합한 곡",
    },
    {
      id: "1990s8",
      title: "The Box",
      artist: "Roddy Ricch",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "1990s",
      difficulty: "hard",
      keyword: "로디리치",
      hint: "미국의 래퍼",
    },
    {
      id: "1990s9",
      title: "Blinding Lights",
      artist: "The Weeknd",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "1990s",
      difficulty: "very-hard",
      keyword: "위켄드",
      hint: "R&B와 힙합이 결합된 곡",
    },
    {
      id: "1990s10",
      title: "Savage",
      artist: "Megan Thee Stallion",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "1990s",
      difficulty: "very-hard",
      keyword: "메간더스탤리언",
      hint: "미국의 여성 래퍼",
    },
    // 2000년대 (10개)
    {
      id: "2000s1",
      title: "Take Five",
      artist: "Dave Brubeck",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "very-easy",
      keyword: "데이브브루벡",
      hint: "5/4 박자의 재즈 곡",
    },
    {
      id: "2000s2",
      title: "So What",
      artist: "Miles Davis",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "very-easy",
      keyword: "마일스데이비스",
      hint: "재즈의 대가",
    },
    {
      id: "2000s3",
      title: "Take the A Train",
      artist: "Duke Ellington",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "easy",
      keyword: "듀크엘링턴",
      hint: "스윙 재즈의 대표곡",
    },
    {
      id: "2000s4",
      title: "What a Wonderful World",
      artist: "Louis Armstrong",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "easy",
      keyword: "루이암스트롱",
      hint: "재즈의 전설적인 트럼펫 연주자",
    },
    {
      id: "2000s5",
      title: "Giant Steps",
      artist: "John Coltrane",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "medium",
      keyword: "존콜트레인",
      hint: "비밥 재즈의 대표곡",
    },
    {
      id: "2000s6",
      title: "Blue in Green",
      artist: "Miles Davis",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "medium",
      keyword: "마일스데이비스",
      hint: "모달 재즈의 대표곡",
    },  
    {
      id: "2000s7",
      title: "A Love Supreme",
      artist: "John Coltrane",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "hard",
      keyword: "존콜트레인",
      hint: "스피리추얼 재즈의 대표작",
    },
    {
      id: "2000s8",
      title: "Kind of Blue",
      artist: "Miles Davis",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "hard",
      keyword: "마일스데이비스",
      hint: "모달 재즈의 대표 앨범",
    },
    {
      id: "2000s9",
      title: "My Favorite Things",
      artist: "John Coltrane",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "very-hard",
      keyword: "존콜트레인",
      hint: "사운드 오브 뮤직의 재즈 버전",
    },
    {
      id: "2000s10",
      title: "Bitches Brew",
      artist: "Miles Davis",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2000s",
      difficulty: "very-hard",
      keyword: "마일스데이비스",
      hint: "퓨전 재즈의 대표작",
    },
    // 2010년대 (10개)
    {
      id: "2010s1",
      title: "Symphony No. 5",
      artist: "Beethoven",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "very-easy",
      keyword: "베토벤",
      hint: "운명 교향곡",
    },
    {
      id: "2010s2",
      title: "Für Elise",
      artist: "Beethoven",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "very-easy",
      keyword: "베토벤",
      hint: "피아노 소곡",
    },
    {
      id: "2010s3",
      title: "Moonlight Sonata",
      artist: "Beethoven",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "easy",
      keyword: "베토벤",
      hint: "월광 소나타",
    },
    {
      id: "2010s4",
      title: "Symphony No. 9",
      artist: "Beethoven",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "easy",
      keyword: "베토벤",
      hint: "합창 교향곡",
    },
    {
      id: "2010s5",
      title: "The Four Seasons",
      artist: "Vivaldi",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "medium",
      keyword: "비발디",
      hint: "사계",
    },
    {
      id: "2010s6",
      title: "Canon in D",
      artist: "Pachelbel",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "medium",
      keyword: "파헬벨",
      hint: "바로크 시대의 대표곡",
    },
    {
      id: "2010s7",
      title: "Symphony No. 40",
      artist: "Mozart",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "hard",
      keyword: "모차르트",
      hint: "교향곡 40번",
    },
    {
      id: "2010s8",
      title: "Requiem",
      artist: "Mozart",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "hard",
      keyword: "모차르트",
      hint: "모차르트의 마지막 작품",
    },
    {
      id: "2010s9",
      title: "Toccata and Fugue",
      artist: "Bach",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "very-hard",
      keyword: "바흐",
      hint: "오르간 작품",
    },
    {
      id: "2010s10",
      title: "Goldberg Variations",
      artist: "Bach",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2010s",
      difficulty: "very-hard",
      keyword: "바흐",
      hint: "피아노 변주곡",
    },
    // 애니메이션 (10개)
    {
      id: "animation1",
      title: "겨울왕국",
      artist: "겨울왕국",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "very-easy",
      keyword: "겨울왕국",
      hint: "디즈니 애니메이션의 히트곡",
    },
    {
      id: "animation2",
      title: "모아나",
      artist: "모아나",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "very-easy",
      keyword: "모아나",
      hint: "디즈니 애니메이션의 주제곡",
    },
    {
      id: "animation3",
      title: "코코",
      artist: "코코",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "easy",
      keyword: "코코",
      hint: "픽사 애니메이션의 감동적인 곡",
    },
    {
      id: "animation4",
      title: "주토피아",
      artist: "주토피아",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "easy",
      keyword: "주토피아",
      hint: "디즈니 애니메이션의 활기찬 곡",
    },
    {
      id: "animation5",
      title: "토이스토리",
      artist: "토이스토리",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "medium",
      keyword: "토이스토리",
      hint: "픽사의 대표 애니메이션",
    },
    {
      id: "animation6",
      title: "알라딘",
      artist: "알라딘",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "medium",
      keyword: "알라딘",
      hint: "디즈니 클래식 애니메이션",
    },
    {
      id: "animation7",
      title: "라이온킹",
      artist: "라이온킹",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "hard",
      keyword: "라이온킹",
      hint: "디즈니의 명작 애니메이션",
    },
    {
      id: "animation8",
      title: "인어공주",
      artist: "인어공주",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "hard",
      keyword: "인어공주",
      hint: "디즈니 애니메이션의 클래식",
    },
    {
      id: "animation9",
      title: "미녀와야수",
      artist: "미녀와야수",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "very-hard",
      keyword: "미녀와야수",
      hint: "디즈니의 로맨틱 애니메이션",
    },
    {
      id: "animation10",
      title: "라이온킹",
      artist: "라이온킹",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "animation",
      difficulty: "very-hard",
      keyword: "라이온킹",
      hint: "디즈니 애니메이션의 오프닝 곡",
    },
    // OST (10개)
    {
      id: "ost1",
      title: "타이타닉",
      artist: "타이타닉",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "very-easy",
      keyword: "타이타닉",
      hint: "레오나르도 디카프리오 주연의 로맨틱 영화",
    },
    {
      id: "ost2",
      title: "보디가드",
      artist: "보디가드",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "very-easy",
      keyword: "보디가드",
      hint: "휘트니 휴스턴 주연의 영화",
    },
    {
      id: "ost3",
      title: "화이트나이츠",
      artist: "화이트나이츠",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "easy",
      keyword: "화이트나이츠",
      hint: "발레리나와 댄서의 이야기",
    },
    {
      id: "ost4",
      title: "탑건",
      artist: "탑건",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "easy",
      keyword: "탑건",
      hint: "톰 크루즈 주연의 액션 영화",
    },
    {
      id: "ost5",
      title: "록키",
      artist: "록키",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "medium",
      keyword: "록키",
      hint: "실베스터 스탤론 주연의 스포츠 영화",
    },
    {
      id: "ost6",
      title: "탑건",
      artist: "탑건",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "medium",
      keyword: "탑건",
      hint: "톰 크루즈의 전투기 조종사 영화",
    },
    {
      id: "ost7",
      title: "고스트",
      artist: "고스트",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "hard",
      keyword: "고스트",
      hint: "패트릭 스웨이지 주연의 판타지 로맨스",
    },
    {
      id: "ost8",
      title: "마네킹",
      artist: "마네킹",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "hard",
      keyword: "마네킹",
      hint: "인형이 살아나는 판타지 영화",
    },
    {
      id: "ost9",
      title: "오피서앤젠틀맨",
      artist: "오피서앤젠틀맨",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "very-hard",
      keyword: "오피서앤젠틀맨",
      hint: "리처드 기어 주연의 로맨틱 드라마",
    },
    {
      id: "ost10",
      title: "어게인스트올오즈",
      artist: "어게인스트올오즈",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "ost",
      difficulty: "very-hard",
      keyword: "어게인스트올오즈",
      hint: "제프 브리지스 주연의 스릴러 영화",
    },
    // 2020년대 (10개)
    {
      id: "2020s1",
      title: "Old Town Road",
      artist: "Lil Nas X",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "very-easy",
      keyword: "릴나스엑스",
      hint: "컨트리와 힙합의 결합",
    },
    {
      id: "2020s2",
      title: "The Gambler",
      artist: "Kenny Rogers",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "very-easy",
      keyword: "케니로저스",
      hint: "컨트리 음악의 전설",
    },
    {
      id: "2020s3",
      title: "Jolene",
      artist: "Dolly Parton",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "easy",
      keyword: "돌리파튼",
      hint: "컨트리 음악의 여왕",
    },
    {
      id: "2020s4",
      title: "Ring of Fire",
      artist: "Johnny Cash",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "easy",
      keyword: "조니캐시",
      hint: "맨 인 블랙",
    },
    {
      id: "2020s5",
      title: "Friends in Low Places",
      artist: "Garth Brooks",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "medium",
      keyword: "가스브룩스",
      hint: "미국의 컨트리 가수",
    },
    {
      id: "2020s6",
      title: "I Walk the Line",
      artist: "Johnny Cash",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "medium",
      keyword: "조니캐시",
      hint: "조니 캐시의 대표곡",
    },
    {
      id: "2020s7",
      title: "9 to 5",
      artist: "Dolly Parton",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "hard",
      keyword: "돌리파튼",
      hint: "돌리 파튼의 히트곡",
    },
    {
      id: "2020s8",
      title: "A Boy Named Sue",
      artist: "Johnny Cash",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "hard",
      keyword: "조니캐시",
      hint: "조니 캐시의 스토리텔링 곡",
    },
    {
      id: "2020s9",
      title: "Coat of Many Colors",
      artist: "Dolly Parton",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "very-hard",
      keyword: "돌리파튼",
      hint: "돌리 파튼의 자전적 곡",
    },
    {
      id: "2020s10",
      title: "Folsom Prison Blues",
      artist: "Johnny Cash",
      file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      category: "2020s",
      difficulty: "very-hard",
      keyword: "조니캐시",
      hint: "조니 캐시의 감옥 콘서트",
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

    // 새로운 오디오 객체 생성
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }

    const newAudio = new Audio(question.file);
    newAudio.volume = 0.7; // 볼륨 설정
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
      audioRef.play().catch((error) => {
        console.error("오디오 재생 실패:", error);
        alert("오디오를 재생할 수 없습니다. 링크를 확인해주세요.");
      });
      setIsPlaying(true);
    }
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

  const handleCheckAnswer = () => {
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

      // 현재 팀의 점수 증가
      updateTeamScore(currentTeam, scoreToAdd);
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userAnswer.trim() && !showAnswer) {
      handleCheckAnswer();
    }
  };

  const handleShowHint = () => {
    if (!currentQuestion) return;

    setShowHint(true);
  };

  const handleTeamSwitch = () => {
    setCurrentTeam(currentTeam === "team1" ? "team2" : "team1");
  };

  const handleResetScores = () => {
    // 전역 점수 초기화는 ScoreContext에서 처리
    // 이 함수는 게임 내 점수만 초기화
  };

  const getCategoryQuestions = (categoryId: string) => {
    return questions.filter((q) => q.category === categoryId);
  };

  const getCurrentCategory = () => {
    return categories.find((c) => c.id === selectedCategory);
  };

  const getCurrentTeam = () => {
    return teams.find((team) => team.id === currentTeam);
  };

  const getTotalScore = () => {
    return teams.reduce((total, team) => total + team.score, 0);
  };

  const getHintText = (question: Question) => {
    return question.hint;
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
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`team-score ${team.id === currentTeam ? "active" : ""}`}
                  style={{ borderColor: team.color }}
                >
                  <span className="team-name">{team.name}</span>
                  <span className="team-points">{team.score}점</span>
                </div>
              ))}
            </div>
          </div>
          <div className="current-team-display">
            현재 턴:{" "}
            <span style={{ color: getCurrentTeam()?.color }}>{getCurrentTeam()?.name}</span>
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

        {/* 퀵메뉴 */}
        <QuickMenu
          buttons={[
            {
              id: "team-switch",
              icon: "🔄",
              title: "턴 변경",
              onClick: handleTeamSwitch,
              color: "switch",
            },
            {
              id: "reset-scores",
              icon: "🗑️",
              title: "점수 초기화",
              onClick: handleResetScores,
              color: "reset",
            },
          ]}
        />
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
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`team-score ${team.id === currentTeam ? "active" : ""}`}
                  style={{ borderColor: team.color }}
                >
                  <span className="team-name">{team.name}</span>
                  <span className="team-points">{team.score}점</span>
                </div>
              ))}
            </div>
          </div>
          <div className="current-team-display">
            현재 턴:{" "}
            <span style={{ color: getCurrentTeam()?.color }}>{getCurrentTeam()?.name}</span>
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

        {/* 퀵메뉴 */}
        <QuickMenu
          buttons={[
            {
              id: "team-switch",
              icon: "🔄",
              title: "턴 변경",
              onClick: handleTeamSwitch,
              color: "switch",
            },
            {
              id: "reset-scores",
              icon: "🗑️",
              title: "점수 초기화",
              onClick: handleResetScores,
              color: "reset",
            },
          ]}
        />
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
            {teams.map((team) => (
              <div
                key={team.id}
                className={`team-score ${team.id === currentTeam ? "active" : ""}`}
                style={{ borderColor: team.color }}
              >
                <span className="team-name">{team.name}</span>
                <span className="team-points">{team.score}점</span>
              </div>
            ))}
          </div>
        </div>
        <div className="current-team-display">
          현재 턴: <span style={{ color: getCurrentTeam()?.color }}>{getCurrentTeam()?.name}</span>
        </div>
      </div>

      <div className="game-area">
        <div className="question-info">
          <h3>음악을 듣고 제목과 아티스트를 맞춰보세요!</h3>
          <p>카테고리: {getCurrentCategory()?.name}</p>
        </div>

        <div className="audio-controls">
          <button
            onClick={handlePlayPause}
            className={`btn ${isPlaying ? "btn-pause" : "btn-play"}`}
            disabled={!currentQuestion}
          >
            {isPlaying ? "⏸️ 정지" : "▶️ 재생"}
          </button>
        </div>

        <div className="answer-section">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="가수 '이름'과 노래 '제목' 순서대로 말해주세요."
            className={`answer-input ${isCorrect === false ? "wrong" : ""}`}
            disabled={showAnswer}
          />
          <div className="answer-buttons">
            <button
              onClick={handleCheckAnswer}
              className="btn btn-check"
              disabled={showAnswer || !userAnswer.trim()}
            >
              정답 확인
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

      {/* 퀵메뉴 */}
      <QuickMenu
        buttons={[
          {
            id: "team-switch",
            icon: "🔄",
            title: "턴 변경",
            onClick: handleTeamSwitch,
            color: "switch",
          },
          {
            id: "reset-scores",
            icon: "🗑️",
            title: "점수 초기화",
            onClick: handleResetScores,
            color: "reset",
          },
        ]}
      />
    </div>
  );
};

export default MusicGame;
