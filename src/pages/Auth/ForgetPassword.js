import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Logo from "../../assets/images/logo.png";
import EmailInput from "../../components/formComponents/EmailInput";
import Button from "../../components/formComponents/Button";
import Email from "../../assets/images/email.png";
import module from "./styling/authpages.module.scss";
import AuthAction from "../../actions/AuthAction";

const ForgetPasswordPage = () => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [emailEntered, setEmailEntered] = useState(false);
  const [emailExisting, setEmailExisting] = useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const [successMailSent, setSuccessMailSent] = useState(false);
  const emailErrors = (error) => {
    setEmailValidation(error);
  };
  const emailEnter = (enter) => {
    setEmailEntered(enter);
  };
  const navigate = useNavigate();
  const handelerSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    dispatch(AuthAction.forgetpassword(emailEntered))
      .then((response) => {
        // console.log("response", response);
        if (response) {
          setEmailExisting(false);
          setSuccessMailSent(true);
        }
      })
      .catch((error) => {
        // console.log("error", error);
        setEmailExisting(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const successMailClick = (event) => {
    setSuccessMailSent(false);
    navigate("/");
  };

  return (
    <div className={module["page-wrapers"]}>
      <div className={module["logo-wraper"]}>
        <img src={Logo} alt="" />
      </div>
      {successMailSent ? (
        <div className={module["auth-heading-info"]}>
          <div className={module["success-image"]}>
            <img src={Email} alt="" />
          </div>
          <h3 className="text-center">Email Sent Successfully!</h3>
          <p className="text-center">
            Reset password link has been sent
            <br /> to your registered email.
          </p>
        </div>
      ) : (
        <div className={module["auth-heading-info"]}>
          <h3 className="text-center">Forgot Password?</h3>
          <p className="text-center">
            Don't worry! Please enter your registered email & <br />
            we will send reset link shortly
          </p>
        </div>
      )}
      {successMailSent ? (
        <button className="btn-primary d-block" onClick={successMailClick}>
          Back to Login
        </button>
      ) : (
        <>
          <form onSubmit={handelerSubmit} autoComplete="new-password">
            <EmailInput
              labelText="Email"
              placeholderText="Enter Email"
              emailErrors={emailErrors}
              emailEntered={emailEnter}
            />
            {emailValidation === null ? (
              // <button className="btn-primary">Continue</button>
              <Button
                extraClass="btn-primary"
                loaderValue={loader}
                btnText="Continue"
              />
            ) : (
              <Button
                extraClass="btn-primary"
                loaderValue={loader}
                btnText="Continue"
                disable={true}
              />
            )}
          </form>
          {emailExisting && (
            <span className="error-mesage text-center existing-email">
              {emailExisting}
            </span>
          )}
        </>
      )}

      {successMailSent ? (
        <p className={module["footer-text"]}>&nbsp;</p>
      ) : (
        <p className={module["footer-text"]}>
          If you don’t want to reset password <Link to="/">Log in</Link>
        </p>
      )}
    </div>
  );
};

export default ForgetPasswordPage;
