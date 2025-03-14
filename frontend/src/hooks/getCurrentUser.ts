const getCurrentUser = (): string | null => {
    return window.localStorage.getItem("userID");
  };
  
  export default getCurrentUser;
  