import React, { useState } from "react";
const EmailInput = (props) => { 
  const [emailId, setEmailId] = useState('');
  const [emailErrors, setEmailErrors] = useState(false);
  const handleChangeEmail = event => {
    setEmailId(event.target.value);
    console.log('Email value is:', event.target.value);
    console.log('Email length:', emailId.length);
    console.log('Email State:', emailErrors);
    if(emailId.length > 4) {
      if (emailId.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
        // alert("Valid mail Format");
        setEmailErrors(null);
        props.emailErrors(null);
        console.log('Email Current State:', emailErrors);
        } else {
        setEmailErrors("Invalid Email Id");
        console.log('Email State:', emailErrors);
        props.emailErrors("Invalid Email Id");
      }
    } else {
      setEmailErrors("Invalid Email Id length");
      props.emailErrors("Invalid Email Id length");
    }
  };
  return (
  <div className="element-wraper">
      <label>{props.labelText}</label>
    <div className="form-field">
      <input type="email" className= {emailErrors ? "form-control error" : "form-control" } placeholder={props.placeholderText} onChange={handleChangeEmail} />
      {emailErrors && <span className="error-mesage">{emailErrors}</span> }
    </div>
  </div>
  );
}

export default EmailInput;
