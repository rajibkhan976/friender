import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import EmailInput from '../../components/FormComponents/EmailInput';
import Button from '../../components/FormComponents/Button';
import Footer from '../../components/Common/Footer';
import module from "./styling/authpages.module.scss";

const ForgetPasswordPage = (props) => {
  const [emailValidation, setEmailValidation] = useState(false);
  const emailErrors = (error) => {
    setEmailValidation(error);
  }
  return (
      <div className={module['page-wrapers']}>
          <div className={module['logo-wraper']}>
            <img src={Logo} alt="" />
          </div>
          <div  className={module['auth-heading-info']}>
            <h3 className="text-center">Forgot Password?</h3>
            <p className="text-center">Don't worry! Please enter your registered email & <br />we will send reset link shortly</p>
        </div>
          <form>
            <EmailInput labelText="Email" placeholderText="Enter Email"  emailErrors = {emailErrors} />
            {emailValidation === null  ?
              <Button class="btn-primary" btnText="Continue" />
            :
              <Button class="btn-primary disabled" btnText="Continue" />
            }
          </form>
        <p className={module['footer-text']}>If you don’t want to reset password &nbsp; <Link to="/">Log in</Link></p>
      </div>
  );

}

export default ForgetPasswordPage;
