const getData = async () => {
  try {
    const data = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const loginData = await data.json();
    return loginData;
  } catch (error) {
    console.error(error);
  }
};

export default getData;
