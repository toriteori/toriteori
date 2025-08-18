import React, { useState } from "react";
import { Link } from "react-router-dom";
import { lessons, categories } from "../constants/studyData";
import "./Pages.css";

function Study() {
  const [currentLesson, setCurrentLesson] = useState(1);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const completeLesson = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const currentLessonData = lessons.find((lesson) => lesson.id === currentLesson);

  // 카테고리별 필터링
  const filteredLessons =
    selectedCategory === "all"
      ? lessons
      : lessons.filter((lesson) => {
          const categoryMap = {
            basic: "기초",
            intermediate: "중급",
            advanced: "고급",
          };
          return lesson.category === categoryMap[selectedCategory];
        });

  return (
    <div className="page">
      <div className="page-content">
        <h1>📚 React 학습</h1>

        <div className="study-layout">
          <div className="lesson-sidebar">
            <h3>학습 목차</h3>

            {/* 카테고리 필터 */}
            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* 강의 목록 */}
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`lesson-item ${currentLesson === lesson.id ? "active" : ""} ${
                  completedLessons.includes(lesson.id) ? "completed" : ""
                }`}
                onClick={() => setCurrentLesson(lesson.id)}
              >
                <span className="lesson-number">{lesson.id}</span>
                <div className="lesson-info">
                  <span className="lesson-title">{lesson.title}</span>
                  <span className="lesson-category">{lesson.category}</span>
                </div>
                {completedLessons.includes(lesson.id) && <span className="checkmark">✓</span>}
              </div>
            ))}
          </div>

          <div className="lesson-content">
            {currentLessonData && (
              <>
                <h2>{currentLessonData.title}</h2>
                <p>{currentLessonData.content}</p>

                <div className="code-example">
                  <h4>코드 예제:</h4>
                  <pre>
                    <code>{currentLessonData.code}</code>
                  </pre>
                </div>

                <div className="lesson-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => completeLesson(currentLessonData.id)}
                  >
                    {completedLessons.includes(currentLessonData.id) ? "완료됨 ✓" : "완료하기"}
                  </button>

                  {currentLesson < lessons.length && (
                    <button className="btn" onClick={() => setCurrentLesson(currentLesson + 1)}>
                      다음 강의 →
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="navigation">
          <Link to="/" className="btn">
            ← 홈으로
          </Link>
          <Link to="/experiment" className="btn">
            실험하기 →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Study;
