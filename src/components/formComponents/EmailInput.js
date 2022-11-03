import { useState, useEffect } from "react";
const EmailInput = (props) => {
  const [emailId, setEmailId] = useState("");
  const [emailErrors, setEmailErrors] = useState(false);
  useEffect(() => {
    setEmailErrors(emailErrors);
  }, [emailId, emailErrors]);
  const handleChangeEmail = (event) => {
    setEmailId(event.target.value.trim());
    if (
      event.target.value.length !== 0 &&
      emailId.trim().match(/\S+@\S+\.\S+/)
    ) {
      if (/\s/.test(event.target.value) === false) {
        setEmailErrors(null);
        props.emailErrors(null);
        setEmailId(event.target.value);
        props.emailEntered(event.target.value);
      } else {
        setEmailErrors("Email cannot have space");
        props.emailErrors("Email cannot have space");
      }
    } else {
      setEmailErrors("Enter proper email id");
      props.emailErrors("Enter proper email id");
    }
  };
  return (
    <div className="element-wraper">
      <label>{props.labelText}</label>
      <div className="form-field">
        <input
          type="email"
          tabIndex="1"
          autoComplete="new-password"
          value={emailId}
          className={emailErrors ? "form-control error" : "form-control"}
          placeholder={props.placeholderText}
          onChange={handleChangeEmail}
        />
        {emailErrors && <span className="error-mesage">{emailErrors}</span>}
      </div>
    </div>
  );
};

export default EmailInput;
