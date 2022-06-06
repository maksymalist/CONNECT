// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/circle-packing
import { Avatar } from "@mui/material";
import { ResponsiveCirclePackingCanvas } from "@nivo/circle-packing";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

type Props = {
  data: any;
};

const MyResponsiveCirclePackingCanvas = (props: Props) => {
  const data = props.data;

  interface ToolTip {
    userId: string;
    name: string;
    imageUrl: string;
    position: number;
    value: number;
  }

  return (
    <div style={{ width: "400px", height: "400px" }}>
      <ResponsiveCirclePackingCanvas
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        id="name"
        theme={{
          fontFamily: "Arial",
          fontSize: 15,
        }}
        colors={["#1BB978", "#FCC73E", "#1594DB", "#DC014E", "#6c63ff"]}
        colorBy="id"
        childColor={{
          from: "color",
          modifiers: [["brighter", 0.4]],
        }}
        label={(e) => {
          return e.id;
        }}
        labelTextColor="#ffffff"
        enableLabels={true}
        leavesOnly={true}
        padding={4}
        borderWidth={2}
        borderColor="#000000"
        animate={false}
        tooltip={(e: any) => {
          const data: ToolTip = e.data;
          return (
            <div
              style={{
                paddingLeft: "15px",
                paddingRight: "15px",
                paddingTop: "5px",
                paddingBottom: "5px",
                backgroundColor: "white",
                border: "1px solid black",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Avatar style={{ marginRight: "10px" }} src={data.imageUrl}>
                {data.name.charAt(0)}
              </Avatar>
              <h3>
                {data.name}{" "}
                <b style={{ color: "#6c63ff" }}>
                  {Math.round(data.position * 100) / 100}
                </b>
              </h3>
            </div>
          );
        }}
      />
    </div>
  );
};

export default MyResponsiveCirclePackingCanvas;
