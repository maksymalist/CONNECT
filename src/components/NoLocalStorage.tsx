import { Typography } from "@mui/material";
import useTranslations from "../hooks/useTranslations";

function NoLocalStorage() {
  const translations = useTranslations();

  return (
    <div style={{ marginTop: "120px" }}>
      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <Typography variant="h3" color="white" style={{ maxWidth: "950px" }}>
          <strong>{translations.login.nolocalstorage.title}</strong>
        </Typography>
      </div>
      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            border: "2px solid black",
            boxShadow: "10px 10px 0 #262626",
            width: "100%",
            maxWidth: "600px",
            marginTop: "50px",
            marginBottom: "50px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "40px",
            }}
          >
            <div>
              <Typography variant="h3">
                {translations.login.nolocalstorage.howtofix.title}
              </Typography>
              <div
                style={{
                  backgroundColor: "#6c63ff",
                  height: "3px",
                  width: "100%",
                }}
              />
            </div>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              textAlign: "left",
              flexDirection: "column",
            }}
          >
            <Typography variant="h5">
              {translations.login.nolocalstorage.howtofix.step1}
            </Typography>
            <br />
            <Typography variant="h5">
              {translations.login.nolocalstorage.howtofix.step2}
            </Typography>
            <br />
            <Typography variant="h5">
              {" "}
              {translations.login.nolocalstorage.howtofix.step3}
            </Typography>
          </div>
          <div
            style={{ display: "flex", textAlign: "left", marginTop: "20px" }}
          >
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSey6V_tD3Sp4YDE9Q-PY5nuMFv6s5Q7_2BPfbFDXQ2CjoTfkg/viewform?usp=sf_link"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "underline",
                color: "#6c63ff",
              }}
            >
              {translations.login.reportissue}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default NoLocalStorage;
