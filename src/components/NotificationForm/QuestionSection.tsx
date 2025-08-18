import React from "react";
import { QuestionSectionProps } from "../../types/form";
import "./NotificationForm.css";

const QuestionSection: React.FC<QuestionSectionProps> = ({
  questionNumber,
  title,
  options,
  selectedValue,
  onOptionChange,
  name,
}) => {
  return (
    <article className={`notifiCustom__sel ${questionNumber === 1 ? "first" : "second"}`}>
      <h3>
        <span>Q{questionNumber}</span>
        {title}
      </h3>
      <ul className="radioSelectCheck">
        {options.map((option) => (
          <li key={option.id} className="radioSelectCheck__box">
            <input
              type="radio"
              id={option.id}
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onOptionChange(e.target.value)}
            />
            <label htmlFor={option.id} className={option.className || ""}>
              {option.label}
              {option.description && <span>{option.description}</span>}
            </label>
          </li>
        ))}
      </ul>
    </article>
  );
};

export default QuestionSection;
