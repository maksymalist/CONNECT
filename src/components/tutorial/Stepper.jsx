import { useState } from "react";
import { Stepper, Step, StepLabel } from "@mui/material";
import useTranslations from "../../hooks/useTranslations";

const StepperComponent = ({ activeStep }) => {
  const translations = useTranslations();
  return (
    <Stepper
      activeStep={activeStep}
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "20px",
        overflowX: "auto",
        backgroundColor: "white",
        padding: "15px",
      }}
    >
      <Step>
        <StepLabel>{translations.tutorial.stepper.join}</StepLabel>
      </Step>
      <Step>
        <StepLabel>{translations.tutorial.stepper.waiting}</StepLabel>
      </Step>
      <Step>
        <StepLabel>{translations.tutorial.stepper.game}</StepLabel>
      </Step>
    </Stepper>
  );
};

export default StepperComponent;
