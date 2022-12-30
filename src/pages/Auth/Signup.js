import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmailInput from "../../components/formComponents/EmailInput";
import Button from "../../components/formComponents/Button";
import Email from "../../assets/images/email.png";
import module from "./styling/authpages.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { register, regOut } from "../../actions/AuthAction";
import { Logo } from "../../assets/icons/Icons";

const SignupPage = () => {
  const dispatch = useDispatch();
  const regSuccess = useSelector((state) => state.auth.regSuccess);
  const [loader, setLoader] = useState(false);
  const [emailEntered, setEmailEntered] = useState("");
  const [nameEntered, setNameEntered] = useState("");
  const [emailAlreadyExists, setEmailAlreadyExists] = useState("");
  const [emailValidation, setEmailValidation] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [success, setSuccess] = useState(false);
  // const emailErrors = (error) => {
  //   setEmailValidation(error);
  //   setEmailAlreadyExists("");
  // };
  // const emailEnter = (enter) => {
  //   setEmailEntered(enter);
  // };
  // const nameEnter = (enter) => {
  //   setNameEntered(enter);
  // };
  const navigate = useNavigate();
  const handleCheck = (event) => {
    setIsSubscribed((current) => !current);
  };
  const handelerSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    //console.log("the email entered***",emailEntered);
    dispatch(register({ email: emailEntered, name: nameEntered }))
      .then((response) => {
        setEmailAlreadyExists(response.payload);
      })
      .catch((error) => {
        //console.log("error::::", error);
        setEmailAlreadyExists(error);
      })
      .finally(() => {
        setLoader(false);
        //navigate('/success');
      });
  };
  const successClick = (event) => {
    dispatch(regOut());
    navigate("/");
  };

  return (
    <div className={module["page-wrapers"]}>
      <div className={module["logo-wraper"]}>
        {/* <img src={Logo} alt="" /> */}
        <Logo />
      </div>
      {regSuccess ? (
        <div className={module["auth-heading-info"]}>
          <div className={module["success-image"]}>
            <img src={Email} alt="" loading="lazy" />
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
      {regSuccess ? (
        <button className="btn-primary d-block" onClick={successClick}>
          Back to Login
        </button>
      ) : (
        <form
          onSubmit={handelerSubmit}
          className="authpage-form"
          autoComplete="new-password"
        >
          <EmailInput
            labelText="Email"
            placeholderText="Enter Email"
            emailEntered={emailEntered}
            emailValidation={emailValidation}
            setEmailValidation={setEmailValidation}
            setEmailEntered={setEmailEntered}
          />
          {!emailValidation && emailAlreadyExists && (
            <span className="error-mesage existing-email">
              {emailAlreadyExists}
            </span>
          )}
          {/* <TextInput
            labelText="Full Name"
            labelSubText="(Optional)"
            placeholderText="Enter Full Name"
            nameEntered={nameEnter}
          /> */}
          <div className="remember-wraper signup-checkbox">
            <label className="check-container d-block">
              I accept Friender{" "}
              <Link to="/terms-conditions" target="_blank">
                Terms and Conditions
              </Link>
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
      {regSuccess ? (
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
