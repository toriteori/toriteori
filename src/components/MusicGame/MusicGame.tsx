import React, { useState, useRef } from "react";

interface Song {
  id: string;
  title: string;
  artist: string;
  file: string;
  genre: string;
}

interface MusicGameProps {
  onBackToMain?: () => void;
}

const MusicGame: React.FC<MusicGameProps> = ({ onBackToMain }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 샘플 음악 목록 (개인용)
  const songs: Song[] = [
    {
      id: "1",
      title: "샘플 노래 1",
      artist: "아티스트 1",
      file: "/music/sample1.mp3",
      genre: "팝",
    },
    {
      id: "2",
      title: "샘플 노래 2",
      artist: "아티스트 2",
      file: "/music/sample2.mp3",
      genre: "록",
    },
    // 여기에 본인의 음악 파일들을 추가
  ];

  // 랜덤 노래 선택
  const selectRandomSong = (): void => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    const song = songs[randomIndex];
    setCurrentSong(song);
    setUserAnswer("");
    setShowAnswer(false);

    if (audioRef.current) {
      audioRef.current.src = song.file;
      audioRef.current.load();
    }
  };

  // 음악 재생/정지
  const togglePlay = (): void => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {
          console.log("음악 재생 실패");
        });
        setIsPlaying(true);
      }
    }
  };

  // 정답 확인
  const checkAnswer = (): void => {
    if (!currentSong) return;

    const isCorrect =
      userAnswer.toLowerCase().includes(currentSong.title.toLowerCase()) ||
      userAnswer.toLowerCase().includes(currentSong.artist.toLowerCase());

    if (isCorrect) {
      setScore(score + 10);
      alert("정답입니다! 🎉");
    } else {
      alert(`틀렸습니다! 정답은 "${currentSong.title} - ${currentSong.artist}" 입니다.`);
    }

    setShowAnswer(true);
  };

  // 힌트 보기
  const showHint = (): void => {
    if (currentSong) {
      alert(`힌트: 장르는 "${currentSong.genre}" 입니다!`);
    }
  };

  return (
    <div className="music-game">
      <div className="game-header">
        <div className="header-top">
          {onBackToMain && (
            <button onClick={onBackToMain} className="back-to-main-btn">
              ← 메인으로
            </button>
          )}
          <h1>🎵 음악 맞추기 게임 (Vercel 배포 테스트)</h1>
          <div className="score">점수: {score}점</div>
        </div>
      </div>

      <div className="game-controls">
        <button onClick={selectRandomSong} className="btn btn-primary">
          🎲 새 노래 선택
        </button>
        <button onClick={togglePlay} className={`btn ${isPlaying ? "btn-pause" : "btn-play"}`}>
          {isPlaying ? "⏸️ 정지" : "▶️ 재생"}
        </button>
        <button onClick={showHint} className="btn btn-hint">
          💡 힌트
        </button>
      </div>

      {currentSong && (
        <div className="game-area">
          <div className="song-info">
            <h3>현재 노래</h3>
            <p>노래를 듣고 제목과 아티스트를 맞춰보세요!</p>
          </div>

          <div className="answer-section">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="노래 제목 또는 아티스트 이름을 입력하세요"
              className="answer-input"
              disabled={showAnswer}
            />
            <button
              onClick={checkAnswer}
              className="btn btn-check"
              disabled={showAnswer || !userAnswer.trim()}
            >
              정답 확인
            </button>
          </div>

          {showAnswer && (
            <div className="correct-answer">
              <h4>
                정답: {currentSong.title} - {currentSong.artist}
              </h4>
              <p>장르: {currentSong.genre}</p>
            </div>
          )}
        </div>
      )}

      {/* 음악 플레이어 */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => console.log("음악 파일을 찾을 수 없습니다.")}
      />

      <div className="instructions">
        <h3>게임 방법</h3>
        <ul>
          <li>1. "새 노래 선택" 버튼을 클릭하세요</li>
          <li>2. "재생" 버튼으로 음악을 들어보세요</li>
          <li>3. 노래 제목이나 아티스트 이름을 입력하세요</li>
          <li>4. "정답 확인" 버튼으로 답을 확인하세요</li>
          <li>5. 맞추면 10점을 획득합니다!</li>
        </ul>
      </div>
    </div>
  );
};

export default MusicGame;
