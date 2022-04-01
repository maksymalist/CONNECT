const getUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user !== null && user !== undefined && user !== "") {
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export default getUser;
