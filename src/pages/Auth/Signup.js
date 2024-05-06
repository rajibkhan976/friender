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

    const registerPayload = {
      email: emailEntered,
      registrationType: 1,
      plan: 1
    }

    localStorage.setItem('registrationPayload', JSON.stringify(registerPayload))
    navigate('/facebook-auth');
    // setLoader(true);
    // COMMENTED OUT DUE TO FLOW CHANGE
    //console.log("the email entered***",emailEntered);
    // dispatch(register({ email: emailEntered, name: nameEntered }))
    //   .then((response) => {
    //     setEmailAlreadyExists(response.payload);
    //   })
    //   .catch((error) => {
    //     //console.log("error::::", error);
    //     setEmailAlreadyExists(error);
    //   })
    //   .finally(() => {
    //     setLoader(false);
    //     //navigate('/success');
    //   });
    // COMMENTED OUT DUE TO FLOW CHANGE
  };
  const successClick = (event) => {
    dispatch(regOut());
    navigate("/");
  };

  return (
    <div className={`${module["page-wrapers"]} ${module['signup-wrapper']}`}>
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
            <span>Create</span>  your account, gain<br/>access to all features
          </h3>
          <p className="text-center">
            Use friender for free. No credit card required
          </p>
        </div>
      )}
      {regSuccess ? (
        <button className="btn-primary d-block w-100" onClick={successClick}>
          Back to Login
        </button>
      ) : (
        <form
          onSubmit={handelerSubmit}
          className="authpage-form signup-form"
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
          {/* <div className="remember-wraper signup-checkbox">
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
          </div> */}
          {emailValidation === null ? (
            <Button
              extraClass="btn-primary w-100"
              loaderValue={loader}
              btnText="Sign Up"
            />
          ) : (
            <Button
              extraClass="btn-primary w-100"
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
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      )}
    </div>
  );
};

export default SignupPage;
