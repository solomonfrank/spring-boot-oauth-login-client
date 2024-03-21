export const isLogged = () => {
  let status = false;
  const token = localStorage.getItem("access_token");

  if (!token) {
    return status;
  }

  status = true;

  return status;
};
