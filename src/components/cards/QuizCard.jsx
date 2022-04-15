import { Lock } from "@mui/icons-material";
import Translations from "../../translations/translations.json";
import { Chip, Avatar, Typography } from "@mui/material";
import { useState } from "react";
import Placeholder from "../../img/quizCoverPlaceholder.png";

const QuizCard = ({ data, isPrivate }) => {
  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );
  const handleQuizClick = (key, type, isPrivate) => {
    if (isPrivate) {
      if (type === "Quiz") {
        window.location = `/quiz/normal/private/${key}`;
      }
      if (type === "Multi") {
        window.location = `/quiz/multi/private/${key}`;
      }
    } else {
      if (type === "Quiz") {
        window.location = `/quiz/normal/${key}`;
      }
      if (type === "Multi") {
        window.location = `/quiz/multi/${key}`;
      }
    }
  };

  return (
    <div
      className="quiz__card"
      onClick={() => {
        handleQuizClick(data._id, data.__typename, isPrivate);
      }}
    >
      <img
        src={data.coverImg || Placeholder}
        className="quiz__card__image"
        alt=""
      />
      <div className="quiz__card__overlay">
        <div className="quiz__card__header">
          <svg className="quiz__card__arc" xmlns="http://www.w3.org/2000/svg">
            <path />
          </svg>
          <img
            className="quiz__card__thumb"
            src={
              data.userProfilePic || (
                <Avatar style={{ width: "50px", height: "50px" }}>
                  {data.userName}
                </Avatar>
              )
            }
            alt=""
          />
          <div className="quiz__card__header-text">
            <h3 className="quiz__card__title">
              {data.name} {isPrivate ? "🔒" : null}
            </h3>
            <span className="quiz__card__status">
              {Translations[userLanguage].profile.quizzes.by} {data.userName}
            </span>
          </div>
        </div>
        <div class="card__description">
          {data.tags == undefined
            ? null
            : data.tags.map((tag, index) => {
                return (
                  <Chip
                    style={{ margin: "5px" }}
                    key={tag + index}
                    label={"#" + tag}
                    color="primary"
                  />
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
