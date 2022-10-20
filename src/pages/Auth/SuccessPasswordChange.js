import React from "react";
import { useNavigate  } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import Email from "../../assets/images/email.png";
import Button from "../../components/FormComponents/Button";
import module from "./styling/authpages.module.scss";
const SuccessPasswordChange = () => {
  const navigate = useNavigate();  
  return (    
      <div className={module['page-wrapers']}>
          <div className={module['logo-wraper']}>
            <img src={Logo} alt="" />
          </div>
        <div className={module['auth-heading-info']}>
          <div  className={module['success-image']}>
            <img src={Email} alt='' />
          </div>
          <h3 className="text-center">Forgot Password?</h3> 
          <p className="text-center">Reset password link has been sent <br /> to your registered email.</p>
        </div>
        <Button class="btn-primary" btnText ="Back to Login" pageLink="/create-password" navigate={navigate} />  
        <p className={module['footer-text']}>&nbsp;</p>    
      </div>
    );
}

export default SuccessPasswordChange;
