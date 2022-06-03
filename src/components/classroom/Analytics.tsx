import React from "react";
import BubbleChart from "../charts/Bubble";

type Props = {
  data: any;
};

const Analytics = (props: Props) => {
  return (
    <div>
      <BubbleChart data={props.data} />
    </div>
  );
};

export default Analytics;
