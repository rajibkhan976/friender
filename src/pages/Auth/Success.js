import React from "react";
import Logo from "../../assets/images/logo.png";
import Email from "../../assets/images/email.png";
import Button from "../../components/FormComponents/Button";
import module from "./styling/authpages.module.scss";
const Success = () => {
 
  return (
    
      <div className={module['page-wrapers']}>
          <div className={module['logo-wraper']}>
            <img src={Logo} alt="" />
          </div>
        <div className={module['auth-heading-info']}>
          <div  className={module['success-image']}>
            <img src={Email} alt='' />
          </div>
          <h3 className="text-center">Almost Done</h3>
          <p className="text-center">An email sent to your registered email id <br /> please open it up to activate your <br /> account.</p>
        </div>
        <Button class="btn-primary" btnText ="Back to Login" />  
        <p className={module['footer-text']}>&nbsp;</p>    
      </div>
    );
}

export default Success;
