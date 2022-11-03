import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import EmailInput from "../../components/formComponents/EmailInput";
import TextInput from "../../components/formComponents/TextInput";
import Button from "../../components/formComponents/Button";
import Email from "../../assets/images/email.png";
import module from "./styling/authpages.module.scss";
import AuthAction from "../../actions/AuthAction";
import { useDispatch } from "react-redux";

const SignupPage = () => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [emailEntered, setEmailEntered] = useState(false);
  const [emailExisting, setEmailExisting] = useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [success, setSuccess] = useState(false);
  const emailErrors = (error) => {
    setEmailValidation(error);
    setEmailExisting(false);
  };
  const emailEnter = (enter) => {
    setEmailEntered(enter);
  };
  const navigate = useNavigate();
  const handleCheck = (event) => {
    setIsSubscribed((current) => !current);
  };
  const handelerSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    dispatch(AuthAction.register(emailEntered))
      .then((response) => {
        setEmailExisting(false);
        //navigate('/success');
        setSuccess(true);
      })
      .catch((error) => {
        // console.log("error", error);
        setEmailExisting(
          error.response
            ? error.response.data
              ? error.response.data
              : error.message
            : error.message
        );
      })
      .finally(() => {
        setLoader(false);
        //navigate('/success');
      });
  };
  const successClick = (event) => {
    setSuccess(false);
    navigate("/");
  };
  return (
    <div className={module["page-wrapers"]}>
      <div className={module["logo-wraper"]}>
        <img src={Logo} alt="" />
      </div>
      {success ? (
        <div className={module["auth-heading-info"]}>
          <div className={module["success-image"]}>
            <img src={Email} alt="" />
          </div>
          <h3 className="text-center">Almost Done</h3>
          <p className="text-center">
            An email sent to your registered email id <br /> please open it up
            to activate your <br /> account.
          </p>
        </div>
      ) : (
        <div className={module["auth-heading-info"]}>
          <h3 className="text-center">
            Sign up for FREE trial and start
            <br /> using Friender in seconds!
          </h3>
          <p className="text-center">
            Manage organic marketing through automation
          </p>
        </div>
      )}
      {success ? (
        <button className="btn-primary d-block" onClick={successClick}>
          Back to Login
        </button>
      ) : (
        <form onSubmit={handelerSubmit} autoComplete="new-password">
          <EmailInput
            labelText="Email"
            placeholderText="Enter Email"
            emailErrors={emailErrors}
            emailEntered={emailEnter}
          />
          {!emailValidation && emailExisting && (
            <span className="error-mesage existing-email">{emailExisting}</span>
          )}
          <TextInput
            labelText="Full Name"
            labelSubText="(Optional)"
            placeholderText="Enter Full Name"
          />
          <div className="remember-wraper">
            <label className="check-container d-block">
              I accept Friender <Link to="/">Terms and Conditions</Link>
              <input
                type="checkbox"
                value={isSubscribed}
                onChange={handleCheck}
              />
              <span className="checkmark"></span>
            </label>
          </div>
          {emailValidation === null && isSubscribed ? (
            <Button
              extraClass="btn-primary"
              loaderValue={loader}
              btnText="Sign Up"
            />
          ) : (
            <Button
              extraClass="btn-primary"
              loaderValue={loader}
              btnText="Sign Up"
              disable={true}
            />
          )}
        </form>
      )}
      {success ? (
        <p className={module["footer-text"]}>&nbsp;</p>
      ) : (
        <p className={module["footer-text"]}>
          Already have an account? <Link to="/">Log in</Link>
        </p>
      )}
    </div>
  );
};

export default SignupPage;
