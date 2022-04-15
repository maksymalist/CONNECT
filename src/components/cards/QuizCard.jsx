import { AccountCircle, Lock } from "@mui/icons-material";
import Translations from "../../translations/translations.json";
import { Chip } from "@mui/material";
import { useState } from "react";
import Placeholder from "../../img/quizCoverPlaceholder.svg";

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
      onClick={() => {
        handleQuizClick(data._id, data.__typename, isPrivate);
      }}
      className="quizCard"
      style={{ overflowY: "auto", overflowX: "hidden", maxWidth: "300px" }}
    >
      {isPrivate ? (
        <Lock
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: "10",
          }}
          color="primary"
        />
      ) : null}
      <img
        style={{ width: "100%", height: "300px" }}
        src={data.coverImg || Placeholder}
        alt="cover-img"
      />
      <h2>{data.name}</h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {data.userProfilePic == undefined ? (
          <AccountCircle style={{ marginRight: "10px" }} color="primary" />
        ) : (
          <img
            width="25px"
            height="25px"
            src={data.userProfilePic}
            alt={data.userProfilePic}
            style={{
              borderRadius: "100%",
              marginRight: "10px",
            }}
          />
        )}
        <h3>{`${Translations[userLanguage].profile.quizzes.by} ${data.userName}`}</h3>
      </div>
      {/* <Button variant='contained' size='small' color='primary' style={{margin:'10px'}}>Edit</Button> */}
      <div>
        {data.tags == undefined ? null : (
          <div>
            <br></br>
            {data.tags.map((tag, index) => {
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
        )}
      </div>
    </div>
  );
};

export default QuizCard;
