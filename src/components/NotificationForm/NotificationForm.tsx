import React, { useState, useRef } from "react";
import Header from "./Header";
import QuestionSection from "./QuestionSection";
import FloatingButton from "./FloatingButton";
import { FormData, RadioOption } from "../../types/form";
import "./NotificationForm.css";

const NotificationForm: React.FC = () => {
  // 상태 관리
  const [formData, setFormData] = useState<FormData>({
    timeCare: "", // 기간제/시간제 간병
    placeCare: "", // 병원/집
  });

  // 음악 관련 상태
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  // 질문 1 옵션
  const timeCareOptions: RadioOption[] = [
    {
      id: "timeCare02",
      value: "period",
      label: "기간제 간병",
      description: "24시간 이상의 간병이 필요해요.",
      className: "dayCare",
    },
    {
      id: "timeCare01",
      value: "hourly",
      label: "시간제 간병",
      description: "24시간 미만의 간병이 필요해요.",
      className: "timeCare",
    },
  ];

  // 질문 2 옵션
  const placeCareOptions: RadioOption[] = [
    {
      id: "placeCare01",
      value: "hospital",
      label: "병·의원",
      className: "hospital",
    },
    {
      id: "placeCare02",
      value: "home",
      label: "집",
      className: "home",
    },
  ];

  // 클릭 효과음 재생
  const playClickSound = (): void => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {
        console.log("효과음 재생 실패");
      });
    }
  };

  // 음악 재생/정지 토글
  const toggleMusic = (): void => {
    playClickSound(); // 효과음 재생

    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play().catch(() => {
          console.log("음악 재생 실패");
        });
        setIsMusicPlaying(true);
      }
    }
  };

  // 옵션 변경 핸들러
  const handleTimeCareChange = (value: string): void => {
    playClickSound(); // 효과음 재생
    setFormData((prev) => ({
      ...prev,
      timeCare: value,
    }));
  };

  const handlePlaceCareChange = (value: string): void => {
    playClickSound(); // 효과음 재생
    setFormData((prev) => ({
      ...prev,
      placeCare: value,
    }));
  };

  // 다음 버튼 클릭 핸들러
  const handleNextClick = (): void => {
    playClickSound(); // 효과음 재생

    if (!formData.timeCare || !formData.placeCare) {
      alert("모든 질문에 답변해주세요.");
      return;
    }

    console.log("폼 데이터:", formData);
    // 다음 페이지로 이동하거나 API 호출
    alert("다음 단계로 이동합니다!");
  };

  // 다음 버튼 활성화 여부
  const isNextButtonEnabled: boolean = Boolean(formData.timeCare && formData.placeCare);

  return (
    <>
      <Header />

      {/* 배경 음악 */}
      <audio
        ref={audioRef}
        src="/music/background-music.mp3"
        loop
        preload="metadata"
        onEnded={() => setIsMusicPlaying(false)}
        onError={() => console.log("음악 파일을 찾을 수 없습니다.")}
      />

      {/* 클릭 효과음 */}
      <audio
        ref={clickSoundRef}
        src="/music/click-sound.mp3"
        preload="auto"
        onError={() => console.log("효과음 파일을 찾을 수 없습니다.")}
      />

      {/* 음악 컨트롤 버튼 */}
      <div className="music-control">
        <button
          type="button"
          className={`music-btn ${isMusicPlaying ? "playing" : ""}`}
          onClick={toggleMusic}
          title={isMusicPlaying ? "음악 정지" : "음악 재생"}
        >
          {isMusicPlaying ? "🔇" : "🎵"}
        </button>
      </div>

      <main className="mt0">
        <div className="basicWrap bgGrey">
          <div className="basicWrap__flex">
            <section className="notifiCustom">
              <div className="pageTit">
                <h2>공고 등록</h2>
              </div>

              <QuestionSection
                questionNumber={1}
                title="보호자님에게 필요한 간병 서비스는 무엇인가요?"
                options={timeCareOptions}
                selectedValue={formData.timeCare}
                onOptionChange={handleTimeCareChange}
                name="timeCare"
              />

              <QuestionSection
                questionNumber={2}
                title="보호자님이 원하는 간병장소를 선택해 주세요!"
                options={placeCareOptions}
                selectedValue={formData.placeCare}
                onOptionChange={handlePlaceCareChange}
                name="placeCare"
              />
            </section>
          </div>

          <div className="btnWrap">
            <button
              type="button"
              className={`solidBtn ${!isNextButtonEnabled ? "disabled" : ""}`}
              onClick={handleNextClick}
              disabled={!isNextButtonEnabled}
            >
              다음
            </button>
          </div>
        </div>
      </main>
      <FloatingButton />
    </>
  );
};

export default NotificationForm;
