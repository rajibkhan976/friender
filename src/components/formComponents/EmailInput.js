import { useEffect } from "react";
const EmailInput = ({
  labelText,
  placeholderText,
  emailEntered,
  emailValidation,
  setEmailValidation,
  setEmailEntered,
}) => {
  useEffect(() => {
    //console.log("I am the Email Input::::",emailEntered);
    if (emailEntered.length === 0) {
      setEmailValidation(false);
    } else if (
      emailEntered.length !== 0 &&
      emailEntered.match(/\S+@\S+\.\S+/)
    ) {
      if (/\s/.test(emailEntered) === false) {
        //console.log('here');
        setEmailValidation(null);
      } else {
        // console.log("here");
        setEmailValidation("Email cannot have space");
      }
    } else {
      //console.log('here');
      setEmailValidation("Enter proper email id");
    }
  }, [emailEntered]);

  return (
    <div className="element-wraper">
      <label>{labelText}</label>
      <div className="form-field">
        <input
          type="email"
          // tabIndex="1"
          autoComplete="new-password"
          // onPaste={(e)=>{
          //   e.preventDefault()
          //   return false;
          // }} onCopy={(e)=>{
          //   e.preventDefault()
          //   return false;
          // }}
          value={emailEntered}
          className={emailValidation ? "form-control error" : "form-control"}
          placeholder={placeholderText}
          onChange={(e) => {
            setEmailEntered(e.target.value.trim());
          }}
        />
        {emailValidation && (
          <span className="error-mesage">{emailValidation}</span>
        )}
      </div>
    </div>
  );
};

export default EmailInput;
