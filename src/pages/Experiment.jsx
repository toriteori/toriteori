import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

function Experiment() {
  const [inputText, setInputText] = useState("");
  const [todos, setTodos] = useState([]);
  const [showClock, setShowClock] = useState(true);
  const [theme, setTheme] = useState("light");

  // 시계 기능
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 할일 추가
  const addTodo = () => {
    if (inputText.trim()) {
      setTodos([...todos, { id: Date.now(), text: inputText, completed: false }]);
      setInputText("");
    }
  };

  // 할일 완료/미완료 토글
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  // 할일 삭제
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className={`page ${theme}`}>
      <div className="page-content">
        <h1>🧪 React 실험실</h1>
        <p>다양한 React 기능들을 직접 실험해보세요!</p>

        <div className="experiment-grid">
          {/* 시계 실험 */}
          <div className="experiment-card">
            <h3>⏰ 시계 컴포넌트</h3>
            <div className="clock-container">
              {showClock && <div className="clock">{time.toLocaleTimeString()}</div>}
              <button className="btn" onClick={() => setShowClock(!showClock)}>
                {showClock ? "시계 숨기기" : "시계 보이기"}
              </button>
            </div>
            <p>useEffect를 사용한 실시간 시계</p>
          </div>

          {/* 할일 목록 실험 */}
          <div className="experiment-card">
            <h3>📝 할일 목록</h3>
            <div className="todo-input">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="할일을 입력하세요"
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
              />
              <button className="btn" onClick={addTodo}>
                추가
              </button>
            </div>
            <div className="todo-list">
              {todos.map((todo) => (
                <div key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span>{todo.text}</span>
                  <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                    삭제
                  </button>
                </div>
              ))}
            </div>
            <p>State 관리와 이벤트 핸들링</p>
          </div>

          {/* 테마 변경 실험 */}
          <div className="experiment-card">
            <h3>🎨 테마 변경</h3>
            <div className="theme-buttons">
              <button
                className={`btn ${theme === "light" ? "active" : ""}`}
                onClick={() => setTheme("light")}
              >
                ☀️ 라이트
              </button>
              <button
                className={`btn ${theme === "dark" ? "active" : ""}`}
                onClick={() => setTheme("dark")}
              >
                🌙 다크
              </button>
              <button
                className={`btn ${theme === "colorful" ? "active" : ""}`}
                onClick={() => setTheme("colorful")}
              >
                🌈 컬러풀
              </button>
            </div>
            <p>조건부 스타일링과 상태 관리</p>
          </div>
        </div>

        <div className="navigation">
          <Link to="/study" className="btn">
            ← 학습하기
          </Link>
          <Link to="/" className="btn">
            홈으로 →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Experiment;
