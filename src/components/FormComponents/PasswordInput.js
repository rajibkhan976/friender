import React, { useState } from "react";
import showPassword from "../../assets/images/showPassword.png";
import hidePassword from "../../assets/images/hidePassword.png";
const PasswordInput = (props) => {
  const [checkPassword, setCheckPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState(false);
  const handleChangePassword = event => {
    setCheckPassword(event.target.value);
    console.log('Password value is:', event.target.value);
    console.log('Password length:', checkPassword.length);
    console.log('Password State:', passwordErrors);
    if(checkPassword.length > 4) {
      setPasswordErrors(null);
      props.passwordErrors(null);
      props.passwordEntered(event.target.value); 
      console.log('Password Current State:', passwordErrors);   
    } else {
      setPasswordErrors("Invalid Password");  
      props.passwordErrors("Invalid Password");  
    }
  };

  const [showHidePassword, setShowHidePassword] = useState(false);
  const setShowHidePasswordFn  = (e) => {
    setShowHidePassword(current => !current);
  };
  return (
  <div className="element-wraper">
      <label>{props.labelText}</label>
      {props.children}
    <div className="form-field">
      <input type={!showHidePassword ? "password" : "text"}  className= {passwordErrors ? "form-control error" : "form-control" } placeholder={props.placeholderText} onChange={handleChangePassword} />
      <span className="show-hide">
        {!showHidePassword ?
        <img src={hidePassword} className="hide-pass" onClick={setShowHidePasswordFn} />
        :
        <img src={showPassword} className="show-pass" onClick={setShowHidePasswordFn} />
        }
      </span>
      {passwordErrors && <span className="error-mesage">{passwordErrors}</span> }
    </div>
  </div>
  );
}

export default PasswordInput;
