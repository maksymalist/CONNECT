//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useMutation, gql } from "@apollo/client";
import getUser from "../../hooks/getUser";
import { Button, CircularProgress, Typography } from "@mui/material";
import Emotes from "../../emotes/emotes.json";
import { useLocation } from "react-router-dom";
import useTranslations from "../../hooks/useTranslations";

const CLAIM_EMOTE = gql`
  mutation ($emoteId: ID!, $owner: ID!, $secret: ID!) {
    addEmote(emoteId: $emoteId, owner: $owner, secret: $secret)
  }
`;

function ClaimEmote() {
  const [addEmote, { data, loading, error }] = useMutation(CLAIM_EMOTE);
  const user = getUser();

  const search = useLocation().search;

  const secret = new URLSearchParams(search).get("secret");
  const emoteId = new URLSearchParams(search).get("emoteId");

  const translations = useTranslations();

  useEffect(() => {
    if (user) {
      addEmote({
        variables: {
          emoteId: emoteId,
          owner: user?.profileObj.googleId,
          secret: secret,
        },
      });
    } else {
      window.location = `/login?secret=${secret}&emoteId=${emoteId}`;
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "150px",
      }}
    >
      <div>
        {loading ? (
          <CircularProgress
            size={100}
            thickness={3}
            style={{ color: "white" }}
          />
        ) : data?.addEmote === true ? (
          <div>
            <Typography
              style={{ color: "white", fontWeight: "bold" }}
              variant="h3"
            >
              {translations.claimemote.title1}
            </Typography>
            <div style={{ marginTop: "50px" }}>
              <img
                width={250}
                height={250}
                src={Emotes[emoteId].icon}
                alt="emote"
              />
            </div>
            <div>
              <Button
                style={{ marginTop: "50px" }}
                variant="contained"
                color="primary"
                onClick={() => (window.location.href = "/profile")}
              >
                {translations.claimemote.button1}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Typography
              style={{ color: "white", fontWeight: "bold" }}
              variant="h3"
            >
              {translations.claimemote.title2}
            </Typography>
            <div style={{ marginTop: "50px" }}>
              <img
                width={250}
                height={250}
                src={
                  "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/325/cross-mark_274c.png"
                }
                alt="emote"
              />
            </div>
            <div>
              <Button
                style={{ marginTop: "50px" }}
                variant="contained"
                color="primary"
                onClick={() => (window.location.href = "/")}
              >
                {translations.claimemote.button2}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClaimEmote;
