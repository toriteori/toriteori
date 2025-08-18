import React from "react";
import { Link } from "react-router-dom";
import { resources, learningTips } from "../constants/resourcesData";
import "./Pages.css";

function Resources() {
  return (
    <div className="page">
      <div className="page-content">
        <h1>📖 React 참고자료</h1>
        <p>React 학습에 도움이 되는 다양한 자료들을 모았습니다!</p>

        <div className="resources-grid">
          {resources.map((category, categoryIndex) => (
            <div key={categoryIndex} className="resource-category">
              <h3>{category.category}</h3>
              <div className="resource-items">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="resource-item">
                    <div className="resource-icon">{item.icon}</div>
                    <div className="resource-content">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        바로가기 →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="learning-tips">
          <h3>💡 학습 팁</h3>
          <div className="tips-grid">
            {learningTips.map((tip, index) => (
              <div key={index} className="tip">
                <h4>{tip.title}</h4>
                <p>{tip.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="navigation">
          <Link to="/experiment" className="btn">
            ← 실험하기
          </Link>
          <Link to="/" className="btn">
            홈으로 →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Resources;
