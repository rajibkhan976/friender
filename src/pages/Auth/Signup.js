import React, { useState } from "react";
import { Link ,  useNavigate  } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import EmailInput from '../../components/FormComponents/EmailInput';
import TextInput from '../../components/FormComponents/TextInput';
import Button from '../../components/FormComponents/Button';
import module from "./styling/authpages.module.scss";

const SignupPage = (props) => {
  const [emailValidation, setEmailValidation] = useState(false);
  const emailErrors = (error) => {
    setEmailValidation(error);
  }
  const navigate = useNavigate();   
  return (
      <div className={module['page-wrapers']}>
          <div className={module['logo-wraper']}>
            <img src={Logo} alt="" />
          </div>
          <div  className={module['auth-heading-info']}>
            <h3 className="text-center">Sign up for FREE trial and start using Friender in seconds!</h3>
            <p className="text-center">Manage organic marketing through automation</p>
          </div>
          <form>
            <EmailInput labelText="Email" placeholderText="Enter Email" emailErrors = {emailErrors} />
            <TextInput labelText="Full Name" labelSubText = "(Optional)" placeholderText="Enter Full Name" />
            <div className="remember-wraper">
              <label className="check-container d-block">I accept Friender <Link to="/">terms and conditions</Link>
                <input type="checkbox" value={props.labelValue} />
                <span className="checkmark"></span>
              </label>
            </div>
            {emailValidation === null  ?
              <Button class="btn-primary" btnText="Sign Up" pageLink="/success" navigate={navigate} />
            :
              <Button class="btn-primary" btnText="Sign Up" disable="true" />
            }
          </form>
        <p className={module['footer-text']}>Already have an account <Link to="/">Log in</Link></p>
      </div>
  );
}

export default SignupPage;
