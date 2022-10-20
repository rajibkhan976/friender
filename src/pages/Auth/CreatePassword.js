import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import PasswordInput from '../../components/FormComponents/PasswordInput';
import Button from '../../components/FormComponents/Button';
import Footer from '../../components/Common/Footer';
import module from "./styling/authpages.module.scss";

const CreatePasswordPage = () => {
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState(false);
  const [passwordNew, setPasswordNew] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState(false);
  const passwordErrors = (error) => {
    setPasswordValidation(error);
  }
  const ConfirmPasswordErrors = (error) => {
    setConfirmPasswordValidation(error);
  }
  const passwordEnter = (enter) => {
    setPasswordNew(enter);
  }
  const passwordReEntered = (enter) => {
    setPasswordConfirm(enter);

    console.log("the new password is" , passwordNew);
    console.log("the confirm password is" , passwordConfirm);
  }
  return (
      <div className={module['page-wrapers']}>
          <div className={module['logo-wraper']}>
            <img src={Logo} alt="" />
        </div>
        <div  className={module['auth-heading-info']}>
          <h3 className="text-center">Create Password</h3>
          <p className="text-center">Create a new strong password to<br /> continue using friender</p>
        </div>
        <form>
          <PasswordInput labelText="New Password" placeholderText="New Password"  passwordErrors = {passwordErrors} passwordEntered = {passwordEnter}/>
          <PasswordInput labelText="Confirm new password" placeholderText="Confirm new password" passwordErrors = {ConfirmPasswordErrors} passwordEntered = {passwordReEntered} />
          {passwordValidation === null && confirmPasswordValidation === null ?
          <div className="reset-password">
            {passwordNew === passwordConfirm ?
            <Button class="btn-primary" btnText ="Continue" />
            :
            <Button class="btn-primary" btnText ="Passwords did not matched" disable="true" />
            }
          </div>
          :
          <Button class="btn-primary" btnText ="Continue" disable="true" />
          }
        </form>
        <p className={module['footer-text']}>If you don’t want to reset password &nbsp; <Link to="/">Log in</Link></p>
      </div>
  );
}

export default CreatePasswordPage;
