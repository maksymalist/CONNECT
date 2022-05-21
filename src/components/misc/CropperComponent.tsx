//@ts-nocheck
import React, { useState, useRef, useEffect } from "react";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";

import "react-image-crop/dist/ReactCrop.css";

import { getFirebase } from "../../App";
import { v4 } from "uuid";

import "firebase/storage";

import uploadImg from "../../img/uploadImg.svg";
import { Button, Typography, ClickAwayListener } from "@mui/material";
import { toast } from "react-toastify";
import useTranslations from "../../hooks/useTranslations";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function CropperComponent({
  setImage,
  index,
  subIndex,
  mode,
  close,
}) {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState(centerAspectCrop(150, 150));
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(16 / 9);

  const inputRef = useRef(null);

  const firebase = getFirebase();
  const translations = useTranslations();

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  const handleSave = () => {
    if (!Boolean(completedCrop)) {
      toast.error("Please crop the image first.");
    } else {
      previewCanvasRef.current.toBlob((blob) => {
        const file = new File([blob], "image.png");
        handleUpload(file);
      });
    }
  };

  const handleUpload = async (file) => {
    if (!firebase) return;

    const uploadedFile = file;
    if (!uploadedFile) return;

    const storage = firebase.storage();
    const storageRef = storage.ref("quizImg");
    const id = v4();
    try {
      await storageRef.child(id).put(file, {
        contentType: "image/png",
      });
      const url = await storage.ref(`quizImg/${id}`).getDownloadURL();
      console.log(url);
      if (mode === "normal") {
        setImage(url, index);
      } else if (mode === "multi") {
        setImage(subIndex, index, url);
      }
      toast.success(translations.alerts.uploadedpic);
    } catch (error) {
      console.log("error", error);
    }
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );
  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else if (imgRef.current) {
      const { width, height } = imgRef.current;
      setAspect(16 / 9);
      setCrop(centerAspectCrop(width, height, 16 / 9));
    }
  }

  useEffect(() => {
    if (imgRef === null) return;
    handleToggleAspectClick();
  }, [imgRef]);

  return (
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
          close();
        }}
      >
        <div
          style={{
            width: "fit-content",
            padding: "1rem",
            height: "auto",
            backgroundColor: "white",
            border: "2px solid black",
            padding: "10px",
          }}
        >
          <div className="Crop-Controls">
            <div
              onClick={() => {
                if (Boolean(imgSrc)) return;
                inputRef.current.click();
              }}
              className={Boolean(imgSrc) ? "uploaded-box" : "upload-box"}
            >
              {Boolean(imgSrc) ? (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    style={{
                      transform: `scale(${scale}) rotate(${rotate}deg)`,
                      width: "100%",
                      height: "400px",
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              ) : (
                <img
                  src={uploadImg}
                  alt="upload"
                  style={{ width: "100%", height: "100%" }}
                />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              ref={inputRef}
              hidden
            />
          </div>
          <div>
            {Boolean(completedCrop) && (
              <>
                <Typography variant="h6">150 x 150</Typography>
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    width: 150,
                    height: 150,
                    margin: 10,
                    border: "1px solid black",
                  }}
                />
              </>
            )}
          </div>
          <div>
            <Button
              style={{ margin: 20 }}
              variant={Boolean(completedCrop) ? "contained" : "outlined"}
              color="primary"
              onClick={() => {
                handleSave();
              }}
              disabled={!Boolean(completedCrop)}
            >
              ✨ {translations.newquiz.questions.save} ✨
            </Button>
          </div>
        </div>
      </ClickAwayListener>
    </div>
  );
}
