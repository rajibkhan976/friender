import React, { useState } from "react";
const EmailInput = (props) => { 
  const [emailId, setEmailId] = useState('');
  const [emailErrors, setEmailErrors] = useState(false);  
  const handleChangeEmail = (event) => {
    setEmailId(event.target.value.trim());
      if (event.target.value.length !== 0 && emailId.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
        // alert("Valid mail Format");        
          setEmailErrors(null);
          props.emailErrors(null);
          console.log('Email Current State 30:', emailErrors);
          console.log('Email latest value is 31:', event.target.value);
          setEmailId(event.target.value.trim());                       
        } else {          
        setEmailErrors("Enter proper email id");
        //console.log('Email State:', emailErrors);
        props.emailErrors("Enter proper email id");
      }    
  };
  return (
  <div className="element-wraper">
      <label>{props.labelText}</label>
    <div className="form-field">
      <input type="email"  value={emailId} className= {emailErrors ? "form-control error" : "form-control" } placeholder={props.placeholderText} onChange={handleChangeEmail} />
      {emailErrors && <span className="error-mesage">{emailErrors}</span> }
    </div>
  </div>
  );
}

export default EmailInput;
