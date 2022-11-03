import { useState, useEffect } from "react";
const PasswordInput = (props) => {
  const [checkPassword, setCheckPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState(false);
  useEffect(() => {}, [checkPassword, passwordErrors]);
  const handleChangePassword = (event) => {
    setCheckPassword(event.target.value.trim());
    if (event.target.value.length > 4) {
      if (/\s/.test(event.target.value) === false) {
        setPasswordErrors(null);
        props.passwordErrors(null);
        props.passwordEntered(event.target.value);
      } else {
        setPasswordErrors("Password cannot have space");
        props.passwordErrors("Password cannot have space");
      }
    } else {
      setPasswordErrors("Invalid Password");
      props.passwordErrors("Invalid Password");
    }
  };

  const [showHidePassword, setShowHidePassword] = useState(false);
  const setShowHidePasswordFn = (e) => {
    setShowHidePassword((current) => !current);
  };
  return (
    <div className="element-wraper">
      <label>{props.labelText}</label>
      {props.children}
      <div className="form-field">
        <input
          tabIndex="1"
          autoComplete="new-password"
          type={!showHidePassword ? "password" : "text"}
          className={passwordErrors ? "form-control error" : "form-control"}
          placeholder={props.placeholderText}
          onChange={handleChangePassword}
        />
        <span className="show-hide" onClick={setShowHidePasswordFn}>
          {!showHidePassword ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1488_27591)">
                <path
                  d="M7.00731 16.086L5.55906 15.6975L6.14931 13.4933C5.26579 13.1674 4.44465 12.6926 3.72156 12.0893L2.10681 13.7048L1.04556 12.6435L2.66106 11.0288C1.74912 9.9366 1.13638 8.62635 0.882812 7.22628L2.35881 6.95703C2.92806 10.1085 5.68506 12.4995 9.00081 12.4995C12.3158 12.4995 15.0736 10.1085 15.6428 6.95703L17.1188 7.22553C16.8656 8.62579 16.2531 9.93631 15.3413 11.0288L16.9561 12.6435L15.8948 13.7048L14.2801 12.0893C13.557 12.6926 12.7358 13.1674 11.8523 13.4933L12.4426 15.6983L10.9943 16.086L10.4033 13.881C9.47508 14.0401 8.52655 14.0401 7.59831 13.881L7.00731 16.086Z"
                  fill="#B3B3BF"
                />
              </g>
              <defs>
                <clipPath id="clip0_1488_27591">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.8446 8.81719C15.7241 5.562 12.5719 3.375 9 3.375C5.42812 3.375 2.27587 5.562 1.15537 8.81719C1.11487 8.93531 1.11487 9.06469 1.15537 9.18281C2.27587 12.438 5.42812 14.625 9 14.625C12.5719 14.625 15.7241 12.438 16.8446 9.18281C16.8851 9.06469 16.8851 8.93531 16.8446 8.81719ZM9 12.375C7.13869 12.375 5.625 10.8613 5.625 9C5.625 7.13869 7.13869 5.625 9 5.625C10.8613 5.625 12.375 7.13869 12.375 9C12.375 10.8613 10.8613 12.375 9 12.375Z"
                fill="#B3B3BF"
              />
              <circle cx="9" cy="9" r="2" fill="#B3B3BF" />
            </svg>
          )}
        </span>
        {passwordErrors && (
          <span className="error-mesage">{passwordErrors}</span>
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
