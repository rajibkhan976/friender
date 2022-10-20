import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import EmailInput from '../../components/FormComponents/EmailInput';
import PasswordInput from '../../components/FormComponents/PasswordInput';
import Checkbox from '../../components/FormComponents/Checkbox';
import Button from '../../components/FormComponents/Button';
import module from "./styling/authpages.module.scss";

const LoginPage = (props) => {
  const [emailValidation, setEmailValidation] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [passwordEntered, setPasswordEntered] = useState(false);
  const emailErrors = (error) => {
    setEmailValidation(error);
  }
  const passwordErrors = (error) => {
    setPasswordValidation(error);
  }
  const passwordEnter = (enter) => {
    setPasswordEntered(enter);
    console.log (passwordEntered);
  }
  return (
      <div className={module['page-wrapers']}>
          <div className={module['logo-wraper']}>
            <img src={Logo} alt="" />
          </div>
          <div  className={module['auth-heading-info']}>
            <h3 className="text-center">Welcome Back !</h3>
            <p className="text-center">Login to continue with your account</p>
          </div>
          <form>
            <EmailInput labelText="Email" placeholderText="Enter Email" emailErrors = {emailErrors} />
            <PasswordInput labelText="Password" placeholderText="Enter Password" passwordErrors = {passwordErrors} passwordEntered = {passwordEnter}>
              <span className='forget-wraper float-right'>
                <Link to="/forget-password" className="text-right">Forgot Password</Link>
              </span>
            </PasswordInput>
            <Checkbox labelValue="Remember" boxText="Remember Me" />
            {emailValidation === null && passwordValidation === null ?
              <Button class="btn-primary" btnText="Continue" />
              :
              <Button class="btn-primary" btnText="Continue" disable="true" />
            }
          </form>
        <p className={module['footer-text']}>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
  );
}

export default LoginPage;
