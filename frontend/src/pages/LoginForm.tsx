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
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgb(59,59,59);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  align-items: center;
`;

const Wrapper = styled.div`
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
`

const Input = styled.input`
  padding: 10px 25px 10px 30px;
  width: 350px;
  height: 40px;
  margin: 2px;
  border: 2px solid #cc;
  outline: none;
  border-radius: 10px;  
  font-size: 16px;
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

const SubmitButton = styled.button`
  width: 100%;
  height: 60px;
  background:#4A90E2;
  border: none;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .1);
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  margin: 3px 3px 10px 3px;

  &: hover{
    border: 2px solid #4A90E2;
    box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
  }
`;
const SvgLockIcon = styled(LockIcon)`
  position: absolute;
  left: 10px; /* Place it on the left inside the input */
  top: 50%;
  transform: translateY(-50%);
`;
const SvgUserIcon = styled(UserIcon)`
  position: absolute;
  left: 10px; /* Place it on the left inside the input */
  top: 50%;
  transform: translateY(-50%);
`;
const RememberMe = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  margin: 15px 0 15px;
  color: darkgray;
`;
const ForgotLink = styled.a`
  color: darkgray;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
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
    <div>
      <form onSubmit={handleSubmit}>
        <H1>Login</H1>
        {/* Username Textbox */}
        <InputWrapper>
          <SvgUserIcon />
          <Input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
            required
          ></Input>
        </InputWrapper>
        {/* Password Textbox */}
        <InputWrapper>
          <SvgLockIcon />
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
        <RememberMe>
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <ForgotLink href="#"> Forgot Password?</ForgotLink>
        </RememberMe>
        {/* Log in Button */}
        <div>
          <SubmitButton type="submit"> Login </SubmitButton>
        </div>
        {/* Register Link */}
        <div>
          <ForgotLink href="#">New? Sign up and start traveling!</ForgotLink>
        </div>
      </form>
    </div>
    </FormContainer>
    </Wrapper>
    </>
  );
};

export default LoginForm;
