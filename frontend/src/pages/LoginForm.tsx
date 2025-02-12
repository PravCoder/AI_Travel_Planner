import React from "react";
import { useState } from "react";
import { ReactComponent as UserIcon } from "../assets/user.svg";
import { ReactComponent as LockIcon } from "../assets/lock.svg";
import { ReactComponent as EyeIconON } from "../assets/eye.svg";
import { ReactComponent as EyeIconOFF } from "../assets/eye-off.svg";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";


const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;


const FormContainer = styled.div`
  width: 100%
  max-width: 700px;
  display: flex;
  background-color: rgb(59,59,59);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Wrapper = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  background-color: darkgray;
  align-items: center;
  min-height: 100vh;
`;
const H1 = styled.h1`
  text-align: center;
  font-size: 40px;
`;


const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px; 
`

const Input = styled.input`
  padding: 10px 25px 10px 25px;
  width: 100%;
  height: 40px;
  margin: 00px 0;
  border: 2px solid #cc;
  outline: none;
  border-radius: 10px;  
  font-size: 14px;
  background: rgb(99,99,99);
  
  &:focus {
    border: 2px solid #4A90E2;
    box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
    outline: none;
  }
  &::placeholder {
    color: rgb(144,213,255);
    opacity: 0.7;
  }
`;
const ToggleButton = styled.button`
  position: absolute;
  right: 10px; /* Adjust to move it inside the input */
  top: 55%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
`;

const Button = styled.button`


`
const SvgIcon = styled(LockIcon)`
  position: absolute;
  left: 10px; /* Place it on the left inside the input */
  top: 50%;
  transform: translateY(-50%);
  fill: #555;   /* Set color of the icon */
`;

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
    <>
    <GlobalStyles/>
    <Wrapper>
      <FormContainer>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit}>
        <H1>Login</H1>
        {/* Username Textbox */}
        <div>
          <UserIcon />
          <Input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
            required
          ></Input>
        </div>
        {/* Password Textbox */}
        <InputWrapper>
          <SvgIcon />
          <Input
            type={passwordVisible ? "text" : "password"}
            value={passWord}
            onChange={(e) => setPassWord(e.target.value)}
            placeholder="Password"
            required
          ></Input>
          <ToggleButton type="button" onClick={togglePasswordVisibility}>
            {passwordVisible ? <EyeIconON /> : <EyeIconOFF />}
          </ToggleButton>
        </InputWrapper>
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
    </FormContainer>
    </Wrapper>
    </>
  );
};

export default LoginForm;
