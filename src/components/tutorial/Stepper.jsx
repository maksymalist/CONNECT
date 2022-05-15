import { useState } from "react";
import { Stepper, Step, StepLabel } from "@mui/material";
import Translations from "../../translations/translations.json";

const StepperComponent = ({ activeStep }) => {
  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );
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
        <StepLabel>
          {Translations[userLanguage].tutorial.stepper.join}
        </StepLabel>
      </Step>
      <Step>
        <StepLabel>
          {Translations[userLanguage].tutorial.stepper.waiting}
        </StepLabel>
      </Step>
      <Step>
        <StepLabel>
          {Translations[userLanguage].tutorial.stepper.game}
        </StepLabel>
      </Step>
    </Stepper>
  );
};

export default StepperComponent;
