import { Typography } from "@mui/material";
import useTranslations from "../../hooks/useTranslations";
import BubbleChart from "../charts/Bubble";

type Props = {
  data: any;
  members: number;
};

const Analytics = (props: Props) => {
  const nodes = props.data;
  const data = {
    name: "root",
    children: nodes,
  };

  const translations = useTranslations();

  return (
    <div>
      <Typography variant="h3" gutterBottom>
        {translations.classroom.analytics.title}
      </Typography>
      <BubbleChart data={data} />
    </div>
  );
};

export default Analytics;
