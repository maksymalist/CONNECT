// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/circle-packing
import { Avatar } from "@mui/material";
import { ResponsiveCirclePackingCanvas } from "@nivo/circle-packing";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveCirclePackingCanvas = () => {
  const data = {
    name: "root",
    children: [
      {
        name: "Jake",
        value: 17,
        profile: "https://i.pravatar.cc/300",
      },
      {
        name: "David",
        value: 88,
        profile: "https://i.pravatar.cc/300",
      },
      {
        name: "Joe",
        value: 9,
        profile: "https://i.pravatar.cc/300",
      },
      {
        name: "Jane",
        value: 53,
        profile: "https://i.pravatar.cc/300",
      },
      {
        name: "John",
        value: 21,
        profile: "https://i.pravatar.cc/300",
      },
      {
        name: "Mary",
        value: 70,
        profile: "https://i.pravatar.cc/300",
      },
      {
        name: "Peter",
        value: 43,
        profile: "https://i.pravatar.cc/300",
      },
      {
        name: "Nicole",
        value: 60,
        profile: "https://i.pravatar.cc/300",
      },
      {
        name: "Tim",
        value: 92,
        profile: "https://i.pravatar.cc/300",
      },
      {
        name: "Tom",
        value: 66,
        profile: "https://i.pravatar.cc/300",
      },
      {
        name: "William",
        value: 56,
        profile: "https://i.pravatar.cc/300",
      },
    ],
  };

  const finalists = [
    {
      time: "11.9",
      position: "1",
      player: "Arrogant_Reindeer⠀",
      playerID: "107441883042764793504",
    },
    {
      time: "13.1",
      position: "2",
      player: "Upset_Camel⠀",
      playerID: "110652498476692336552",
    },
    {
      time: "36.9",
      position: "3",
      player: "Mike⠀",
      playerID: "113937164238966385301",
    },
  ];

  interface ToolTip {
    name: string;
    value: number;
    profile: string;
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
              <Avatar style={{ marginRight: "10px" }} src={data.profile}>
                {data.name.charAt(0)}
              </Avatar>
              <h3>
                {data.name} {data.value}
              </h3>
            </div>
          );
        }}
      />
    </div>
  );
};

export default MyResponsiveCirclePackingCanvas;
