import React from "react";
import { useState } from "react";
import { ReactComponent as UserIcon } from "../assets/user.svg";
import { ReactComponent as LockIcon } from "../assets/lock.svg";
import { ReactComponent as EyeIconON } from "../assets/eye.svg";
import { ReactComponent as EyeIconOFF } from "../assets/eye-off.svg";

const LoginForm = () => {
  // This handles getting the values from the textboxes
  const [userName, setUserName] = useState<string>("");
  const [passWord, setPassWord] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // stops the browser from reloading when the form is submitted
    console.log("Username: ", userName);
    console.log("Password:", passWord);

    // send these values to authentication

    // route to dashboard if values are correct, else prompt with incorrect user/password
  };

  // This handles the button in the password textbox and shows the text if it is pressed
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {/* Username Textbox */}
        <div>
          <UserIcon />
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
            required
          ></input>
        </div>
        {/* Password Textbox */}
        <div>
          <LockIcon />
          <input
            type={passwordVisible ? "text" : "password"}
            value={passWord}
            onChange={(e) => setPassWord(e.target.value)}
            placeholder="Password"
            required
          ></input>
          <button type="button" onClick={togglePasswordVisibility}>
            {passwordVisible ? <EyeIconON /> : <EyeIconOFF />}
          </button>
        </div>
        {/* Remember me? checkbox */}
        <div>
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#"> Forgot Password?</a>
        </div>
        {/* Log in Button */}
        <div>
          <button type="submit"> Login </button>
        </div>
        {/* Register Link */}
        <div>
          <a href="#">New? Sign up and start traveling!</a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
