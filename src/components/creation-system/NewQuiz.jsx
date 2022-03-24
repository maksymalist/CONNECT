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
} from "@mui/material";

import { toast } from "react-toastify";
import { AddCircleRounded, DeleteRounded, SaveAs } from "@mui/icons-material";
import UploadButton from "../misc/UploadButton";

import Translations from "../../translations/translations.json";

import { useMutation, gql } from "@apollo/client";
import "react-quill/dist/quill.snow.css";

const CREATE_QUIZ = gql`
  mutation createQuiz(
    $name: String!
    $coverImg: String!
    $tags: [String]
    $userID: ID!
    $userProfilePic: String!
    $userName: String!
    $questions: [String]
  ) {
    createQuiz(
      name: $name
      coverImg: $coverImg
      tags: $tags
      userID: $userID
      userProfilePic: $userProfilePic
      userName: $userName
      questions: $questions
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
    $questions: [String]
  ) {
    createPrivateQuiz(
      name: $name
      coverImg: $coverImg
      tags: $tags
      userID: $userID
      userProfilePic: $userProfilePic
      userName: $userName
      questions: $questions
    )
  }
`;

export default function NewQuiz() {
  const [name, setName] = useState("");
  const [questionArray, setQuestionArray] = useState([]);

  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [tagNumber, setTagNumber] = useState(0);
  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const imgRef = useRef(null);

  const [createQuiz] = useMutation(CREATE_QUIZ);
  const [createPrivateQuiz] = useMutation(CREATE_PRIVATE_QUIZ);

  const [isPrivate, setIsPrivate] = useState(false);

  const quizObj = {
    questions: [],
    name: "",
    coverImg: "",
    tags: "",
    userID: "",
    userProfilePic: "",
    userName: "",
  };

  useEffect(() => {
    toast.info(Translations[userLanguage].alerts.eachansdifferent);
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
        },
      });
    }
    toast.success(Translations[userLanguage].alerts.quizcreated);
    setName("");
    setQuestionArray([]);
    setTags([]);
    imgRef.current.src = "";
  };
  const getTags = () => {
    const newTagArr = [];
    tags.map((tag) => {
      newTagArr.push(tag);
    });
    return newTagArr;
  };

  const setQuizObj = (isPrivate, name) => {
    if (JSON.parse(localStorage.getItem("user")) == null) {
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
    quizObj.userName =
      JSON.parse(localStorage.getItem("user"))?.profileObj.name || "";
    quizObj.userProfilePic =
      JSON.parse(localStorage.getItem("user"))?.profileObj.imageUrl || "";
    quizObj.userID =
      JSON.parse(localStorage.getItem("user"))?.profileObj.googleId || "";
    quizObj.coverImg = imgRef.current ? imgRef.current.src : "" || "";
    quizObj.tags = getTags() || [];

    for (let i = 0; i < newQuestionArray.length; i++) {
      const data = newQuestionArray[i];
      quizObj.questions.push(
        JSON.stringify({
          index: i,
          question: data.question,
          answer: data.answer,
        })
      );
    }

    console.log(quizObj);
    Submit(isPrivate);
  };

  const Card = ({ data, index }) => {
    const [question, setQuestion] = useState(data.question);
    const [answer, setAnswer] = useState(data.answer);

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
            <Typography variant="h3" style={{ textAlign: "right" }}>
              {index + 1}
            </Typography>
            <input
              className="questions userInput"
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
              type="text"
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
                minWidth: "160px",
                width: "160px",
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
            <SaveAs
              htmlColor="#1bb978"
              style={{ width: "30px", height: "30px" }}
              onClick={() => SaveQuestion(question, answer, index)}
            />
            <div style={{ width: "10px", height: "10px" }} />
            <DeleteRounded
              color="secondary"
              style={{ width: "30px", height: "30px" }}
              onClick={() => DeleteQuestion(index)}
            />
          </div>
        </div>
      </div>
    );
  };

  const AddQuestion = () => {
    const len = [...questionArray].length;
    if (len >= 12) {
      return;
    }
    const obj = {
      question: "",
      answer: "",
    };
    setQuestionArray([...questionArray, obj]);
  };

  const SaveQuestion = (question, answer, index) => {
    const newQuestionArray = [...questionArray];
    newQuestionArray[index].question = question;
    newQuestionArray[index].answer = answer;
    setQuestionArray(newQuestionArray);

    toast.success("Saved ✨", {
      autoClose: 500,
    });
  };

  const DeleteQuestion = (index) => {
    const newQuestionArray = [...questionArray];
    newQuestionArray.splice(index, 1);
    setQuestionArray(newQuestionArray);

    toast.error("Deleted ❌", {
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

  return (
    <div style={{ marginTop: "100px" }}>
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
              label={tag}
              onDelete={() => handleDelete(tag + index, tag)}
              color="primary"
            />
          ))}
        </div>
        <Typography variant="h4" style={{ margin: "10px", marginTop: "50px" }}>
          {Translations[userLanguage].newquiz.qna}
        </Typography>
        <br></br>
        <Divider style={{ width: "90vw" }} light />
        <br></br>
        <div
          className="cardContainer2"
          style={{ margin: "1%", marginTop: "10px" }}
        >
          {questionArray.map((data, i) => (
            <Card key={i} index={i} data={data} />
          ))}
          <div
            onClick={() => {
              AddQuestion();
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
              setQuizObj(isPrivate, name);
            }}
          >
            {Translations[userLanguage].newquiz.button}
          </Button>
        </div>
      </div>
    </div>
  );
}
