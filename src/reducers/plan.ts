const plan = (state = "Starter", action: any) => {
  switch (action.type) {
    case "SET_STARTER":
      return (state = "Starter");
    case "SET_CLASSROOM":
      return (state = "Classroom");
    case "SET_ENTERPRISE":
      return (state = "Enterprise");
    default:
      return state;
  }
};
export default plan;
