import React, { useState, useEffect, useRef } from "react";
import "../../style/NewQuizStyle.css";

import {
  Chip,
  TextField,
  Button,
  Typography,
  Divider,
  Switch,
  TextareaAutosize,
  ClickAwayListener,
} from "@mui/material";

import { toast } from "react-toastify";
import {
  AddCard,
  AddCircleRounded,
  DeleteRounded,
  SaveAs,
} from "@mui/icons-material";
import UploadButton from "../misc/UploadButton";

import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import Translations from "../../translations/translations.json";

import { useMutation, gql } from "@apollo/client";

//hooks
import getUser from "../../hooks/getUser";
import useUnsavedChangesWarning from "../../hooks/useUnsavedChangesWarning";

//imgs
import QuesImg from "../../img/CardType/Image_Answer.svg";
import QuesAns from "../../img/CardType/Question_Answer.svg";
import uploadImg from "../../img/uploadImg.svg";
import CropperComponent from "../misc/CropperComponent";

const CREATE_QUIZ = gql`
  mutation createQuiz(
    $name: String!
    $coverImg: String!
    $tags: [String]
    $userID: ID!
    $userProfilePic: String!
    $userName: String!
    $questions: [String]!
    $description: String!
  ) {
    createQuiz(
      name: $name
      coverImg: $coverImg
      tags: $tags
      userID: $userID
      userProfilePic: $userProfilePic
      userName: $userName
      questions: $questions
      description: $description
    )
  }
`;

const CREATE_PRIVATE_QUIZ = gql`
  mutation createPrivateQuiz(
    $name: String!
    $coverImg: String!
    $tags: [String]
    $userID: ID!
    $userProfilePic: String!
    $userName: String!
    $questions: [String]!
    $description: String!
  ) {
    createPrivateQuiz(
      name: $name
      coverImg: $coverImg
      tags: $tags
      userID: $userID
      userProfilePic: $userProfilePic
      userName: $userName
      questions: $questions
      description: $description
    )
  }
`;

export default function NewQuiz() {
  const user = getUser();
  const [name, setName] = useState("");
  const [questionArray, setQuestionArray] = useState([]);

  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [tagNumber, setTagNumber] = useState(0);
  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );
  const [description, setDescription] = useState("");

  const imgRef = useRef(null);

  const [createQuiz] = useMutation(CREATE_QUIZ);
  const [createPrivateQuiz] = useMutation(CREATE_PRIVATE_QUIZ);

  const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();

  const [isPrivate, setIsPrivate] = useState(false);
  const [isAddQuestion, setIsAddQuestion] = useState(false);
  const [isUploadingCard, setIsUploadingCard] = useState({
    isUploading: false,
    index: null,
  });

  const quizObj = {
    questions: [],
    name: "",
    coverImg: "",
    tags: "",
    userID: "",
    userProfilePic: "",
    userName: "",
    description: "",
  };

  useEffect(() => {
    toast.info(Translations[userLanguage].alerts.eachansdifferent);
    document.getElementById("root").style.padding = "0px";

    return () => {
      document.getElementById("root").style.padding = "10px";
    };
  }, []);

  const Submit = (isPrivate) => {
    for (
      let i = 0;
      i < document.getElementsByClassName("userInput").length;
      i++
    ) {
      console.log("userIn");
      if (document.getElementsByClassName("userInput")[i].value == "") {
        toast.error(Translations[userLanguage].alerts.fieldleftempty);
        return;
      }
    }
    if (isPrivate) {
      createPrivateQuiz({
        variables: {
          name: quizObj.name,
          coverImg: quizObj.coverImg,
          tags: quizObj.tags,
          userID: quizObj.userID,
          userProfilePic: quizObj.userProfilePic,
          userName: quizObj.userName,
          questions: quizObj.questions,
          description: quizObj.description,
        },
      });
    } else {
      createQuiz({
        variables: {
          name: quizObj.name,
          coverImg: quizObj.coverImg,
          tags: quizObj.tags,
          userID: quizObj.userID,
          userProfilePic: quizObj.userProfilePic,
          userName: quizObj.userName,
          questions: quizObj.questions,
          description: quizObj.description,
        },
      });
    }
    toast.success(Translations[userLanguage].alerts.quizcreated);
    window.location.reload();
  };
  const getTags = () => {
    const newTagArr = [];
    tags.map((tag) => {
      newTagArr.push(tag);
    });
    return newTagArr;
  };

  const setQuizObj = (isPrivate, name, description) => {
    if (user == null) {
      window.location = "/login";
      toast.error(Translations[userLanguage].alerts.logincreatequiz);
      return;
    }
    if (name === "") {
      toast.error(Translations[userLanguage].alerts.quiznameempty);
      return;
    }
    const newQuestionArray = [...questionArray];
    if (newQuestionArray.length < 6) {
      toast.error(Translations[userLanguage].alerts.min6questions);
      return;
    }
    if (newQuestionArray.length > 12) {
      return;
    }

    for (let i = 0; i < newQuestionArray.length; i++) {
      const data = newQuestionArray[i];
      if (data.question == "" || data.answer == "") {
        toast.error(Translations[userLanguage].alerts.fieldleftempty);
        return;
      }
    }

    quizObj.name = name || "";
    quizObj.userName = user?.profileObj.name || "";
    quizObj.userProfilePic = user?.profileObj.imageUrl || "";
    quizObj.userID = user?.profileObj.googleId || "";
    quizObj.coverImg = imgRef.current ? imgRef.current.src : "" || "";
    quizObj.tags = getTags() || [];
    quizObj.description = description || "";

    for (let i = 0; i < newQuestionArray.length; i++) {
      const data = newQuestionArray[i];
      quizObj.questions.push(
        JSON.stringify({
          index: i,
          question: data.question,
          answer: data.answer,
          type: data.type,
        })
      );
    }

    console.log(quizObj);
    Submit(isPrivate);
  };

  const Card = ({ data, index }) => {
    const [question, setQuestion] = useState(data.question);
    const [answer, setAnswer] = useState(data.answer);

    const type = data.type;

    return (
      <div className="card2">
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography variant="h3" style={{ textAlign: "left" }}>
              {index + 1}
            </Typography>

            <TextareaAutosize
              className="questions userInput"
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
              style={{
                minWidth: "250px",
                width: "250px",
                height: "100px",
                maxHeight: "150px",
                borderRadius: "5px",
                border: "1px solid #e0e0e0",
              }}
              placeholder={
                Translations[userLanguage].newquiz.questions.question + " 💭"
              }
            />
            <br></br>
            <TextareaAutosize
              className="answers userInput"
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
              style={{
                minWidth: "250px",
                width: "250px",
                height: "100px",
                maxHeight: "150px",
                borderRadius: "5px",
                border: "1px solid #e0e0e0",
              }}
              placeholder={
                Translations[userLanguage].newquiz.questions.answer + "💡"
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <Button
              color="success"
              onClick={() => SaveQuestion(question, answer, index)}
            >
              ✨ {Translations[userLanguage].newquiz.questions.save} ✨
            </Button>
            <div style={{ width: "10px", height: "10px" }} />
            <Button color="secondary" onClick={() => DeleteQuestion(index)}>
              ❌ {Translations[userLanguage].newquiz.questions.delete} ❌
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const CardImg = ({ data, index }) => {
    const [question, setQuestion] = useState(data.question);
    const [answer, setAnswer] = useState(data.answer);

    const type = data.type;

    return (
      <div className="card2">
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography variant="h3" style={{ textAlign: "left" }}>
              {index + 1}
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <div
                onClick={() => {
                  setIsUploadingCard({
                    index: index,
                    isUploading: true,
                  });
                }}
                className="upload-box-button"
              >
                {question === "" ? (
                  <img
                    src={uploadImg}
                    alt="upload"
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <img
                    src={question}
                    alt="upload"
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </div>
            </div>
            <br></br>
            <TextareaAutosize
              className="answers userInput"
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
              style={{
                minWidth: "250px",
                width: "250px",
                height: "100px",
                maxHeight: "150px",
                borderRadius: "5px",
                border: "1px solid #e0e0e0",
              }}
              placeholder={
                Translations[userLanguage].newquiz.questions.answer + "💡"
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <Button
              color="success"
              onClick={() => SaveQuestion(question, answer, index)}
            >
              ✨ {Translations[userLanguage].newquiz.questions.save} ✨
            </Button>
            <div style={{ width: "10px", height: "10px" }} />
            <Button color="secondary" onClick={() => DeleteQuestion(index)}>
              ❌ {Translations[userLanguage].newquiz.questions.delete} ❌
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const AddQuestion = (type) => {
    const len = [...questionArray].length;
    if (len >= 12) {
      return;
    }
    const obj = {
      question: "",
      answer: "",
      type: type,
    };
    setQuestionArray([...questionArray, obj]);
  };

  const setImage = (img, index) => {
    const newArray = [...questionArray];
    newArray[index].question = img;
    setQuestionArray(newArray);
    setIsUploadingCard({ index: null, isUploading: false });
  };

  const SaveQuestion = (question, answer, index) => {
    const newQuestionArray = [...questionArray];
    newQuestionArray[index].question = question;
    newQuestionArray[index].answer = answer;
    setQuestionArray(newQuestionArray);

    toast.success(Translations[userLanguage].alerts.saved, {
      autoClose: 500,
    });
  };

  const DeleteQuestion = (index) => {
    const newQuestionArray = [...questionArray];
    newQuestionArray.splice(index, 1);
    setQuestionArray(newQuestionArray);

    toast.error(Translations[userLanguage].alerts.delete, {
      autoClose: 500,
    });
  };

  const AddTag = (tag) => {
    if (tag === "") return;
    if (tagNumber >= 5) return;
    setTags([...tags, tag]);
    setCurrentTag("");
    setTagNumber(tagNumber + 1);
  };

  const handleDelete = (id, name) => {
    const newTags = [];
    tags.map((tag) => {
      newTags.push(tag);
    });
    newTags.splice(name, 1);
    setTags(newTags);
    setTagNumber(newTags.length);
  };

  const AddQuestionForm = () => (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: "0",
        zIndex: "9999",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <ClickAwayListener
        onClickAway={() => {
          setIsAddQuestion(false);
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            height: "auto",
            backgroundColor: "white",
            border: "2px solid black",
            padding: "10px",
          }}
        >
          <Typography variant="h3" style={{ textAlign: "center" }}>
            {Translations[userLanguage].newquiz.questions.select}
          </Typography>
          <br></br>
          <Divider />
          <br></br>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              className="card_type"
              style={{
                margin: "20px",
                border: "2px solid black",
              }}
              onClick={() => {
                AddQuestion("ques_ans");
              }}
            >
              <img src={QuesAns} style={{ width: "150px", height: "150px" }} />
            </div>
            <div
              className="card_type"
              style={{
                margin: "20px",
                border: "2px solid black",
              }}
              onClick={() => {
                AddQuestion("ques_img");
              }}
            >
              <img src={QuesImg} style={{ width: "150px", height: "150px" }} />
            </div>
          </div>
        </div>
      </ClickAwayListener>
    </div>
  );

  return (
    <>
      {isAddQuestion ? <AddQuestionForm /> : null}
      {isUploadingCard.isUploading ? (
        <CropperComponent
          setImage={setImage}
          index={isUploadingCard.index}
          mode={"normal"}
          close={() => {
            setIsUploadingCard({
              index: null,
              isUploading: false,
            });
          }}
        />
      ) : null}
      <div style={{ marginTop: "100px" }}>
        {Prompt}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            backgroundColor: "white",
            margin: "10px",
            border: "2px solid black",
            boxShadow: "10px 10px 0 #262626",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="h2" style={{ margin: "10px" }}>
              <b>{Translations[userLanguage].newquiz.title}</b>
            </Typography>
            <br></br>
            <Divider style={{ width: "90vw" }} light />
            <br></br>
            <input
              className="userInput quizName"
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder={Translations[userLanguage].newquiz.input}
            ></input>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "10px",
            }}
          >
            <UploadButton imgRef={imgRef} />
          </div>
          <ReactQuill
            theme="snow"
            value={description}
            placeholder={Translations[userLanguage].newmultiquiz.description}
            onChange={setDescription}
            style={{
              width: "100%",
              maxWidth: "700px",
              height: "400px",
              marginTop: "10px",
              marginBottom: "50px",
            }}
          />
          <div
            style={{
              backgroundColor: "white",
              padding: "15px",
              border: "2px solid black",
              boxShadow: "10px 10px 0 #262626",
              width: "80vw",
              maxWidth: "700px",
              marginTop: "10px",
            }}
          >
            <Typography variant="h4">
              {Translations[userLanguage].newquiz.tags.title}
            </Typography>
            <br></br>
            <Divider light />
            <br></br>
            <TextField
              variant="outlined"
              size="small"
              label={Translations[userLanguage].newquiz.tags.input}
              helperText={
                <span style={{ color: "black" }}>
                  {5 - tagNumber}{" "}
                  {Translations[userLanguage].newquiz.tags.helpertext}
                </span>
              }
              onChange={(e) => {
                setCurrentTag(e.target.value);
              }}
              value={currentTag}
            />
            <Button
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => {
                AddTag(currentTag);
              }}
            >
              {Translations[userLanguage].newquiz.tags.button}
            </Button>
            <br></br>
            {tags.map((tag, index) => (
              <Chip
                style={{ marginTop: "10px" }}
                key={tag + index}
                id={tag + index}
                label={"#" + tag}
                onDelete={() => handleDelete(tag + index, tag)}
                color="primary"
              />
            ))}
          </div>
          <Typography
            variant="h4"
            style={{ margin: "10px", marginTop: "50px" }}
          >
            {Translations[userLanguage].newquiz.qna}
          </Typography>
          <br></br>
          <Divider style={{ width: "90vw" }} light />
          <br></br>
          <div
            className="cardContainer2"
            style={{ margin: "1%", marginTop: "10px" }}
          >
            {questionArray.map((data, i) =>
              data.type === "ques_ans" ? (
                <Card key={i} index={i} data={data} />
              ) : data.type === "ques_img" ? (
                <CardImg key={i} index={i} data={data} />
              ) : null
            )}
            <div
              onClick={() => {
                setIsAddQuestion(true);
              }}
              className="card2-2"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AddCircleRounded
                style={{ width: "75px", height: "75px" }}
                color="primary"
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1" style={{ margin: "10px" }}>
                {Translations[userLanguage].newquiz.private}
              </Typography>
              <Switch
                size="medium"
                checked={isPrivate}
                onChange={() => {
                  setIsPrivate(!isPrivate);
                }}
                color="primary"
                name="checked"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
            <Button
              style={{ marginBottom: "1vh" }}
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                setQuizObj(isPrivate, name, description);
              }}
            >
              {Translations[userLanguage].newquiz.button}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
