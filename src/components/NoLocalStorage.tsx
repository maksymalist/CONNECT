import { Typography } from "@mui/material";
import React from "react";
function NoLocalStorage() {
  return (
    <div style={{ marginTop: "120px" }}>
      <Typography variant="h3" color="white">
        <strong>
          Wow, it seems there might be a <br /> problem with your browser 😱
        </strong>
      </Typography>
      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            border: "2px solid black",
            boxShadow: "10px 10px 0 #262626",
            width: "100%",
            maxWidth: "500px",
            marginTop: "50px"
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "40px"
            }}
          >
            <div>
              <Typography variant="h3">How to fix ⚒️?</Typography>
              <div
                style={{
                  backgroundColor: "#6c63ff",
                  height: "3px",
                  width: "100%"
                }}
              />
            </div>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              textAlign: "left",
              flexDirection: "column"
            }}
          >
            <Typography variant="h5">
              ✅ If you’re using private mode turn it off
            </Typography>
            <br />
            <Typography variant="h5">
              ✅ Make sure your cookies are enabled
            </Typography>
            <br />
            <Typography variant="h5">✅ Restart your browser</Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
export default NoLocalStorage;
