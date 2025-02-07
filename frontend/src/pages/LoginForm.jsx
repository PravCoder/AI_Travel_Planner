import React from 'react';
import { useState} from 'react';
import {ReactComponent as UserIcon } from '../assets/user.svg';
import {ReactComponent as LockIcon } from '../assets/lock.svg';
import {ReactComponent as EyeIconON } from '../assets/eye.svg';
import {ReactComponent as EyeIconOFF } from '../assets/eye-off.svg';




const LoginForm = () => {

    
    // This handles the button in the password textbox and shows the text if it is pressed
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

  return (
    <div>
        <h1>Login</h1>
        {/* Username Textbox */}
        <div>
            <UserIcon/>
            <input type="text" placeholder="Username" required></input>
        </div>
        {/* Password Textbox */}
        <div>
            <LockIcon/>
            <input 
                type={passwordVisible ? 'text' : 'password'} 
                placeholder="Password" 
                required>
            </input>
            <button
                type = "button"
                onClick={(togglePasswordVisibility)}
            >
                {passwordVisible ? <EyeIconON/> : <EyeIconOFF/>}
            </button>
        </div>
        {/* Remember me? checkbox */}
        <div>
            <label><input type="checkbox" /> Remember me</label>
            <a href="#"> Forgot Password?</a>
        </div>
        {/* Log in Button */}
        <div>
            <button > Login </button>
        </div>
        {/* Register Link */}
        <div>
            <a href = "#">New? Sign up and start traveling!</a>
        </div>
    </div>
  )
}

export default LoginForm;