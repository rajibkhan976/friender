import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import EmailInput from "../../components/formComponents/EmailInput";
import Button from "../../components/formComponents/Button";
import Email from "../../assets/images/email.png";
import module from "./styling/authpages.module.scss";
import { forgetpassword } from "../../actions/AuthAction";
import { Logo } from "../../assets/icons/Icons";

const ForgetPasswordPage = () => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [emailEntered, setEmailEntered] = useState("");
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const [successMailSent, setSuccessMailSent] = useState(false);
  const emailErrors = (error) => {
    setEmailValidation(error);
  };
  const emailEnter = (enter) => {
    setEmailEntered(enter);
  };
  const navigate = useNavigate();
  const handelerSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await dispatch(
        forgetpassword({ email: emailEntered })
      ).unwrap();
      if (res) {
        setEmailAlreadyExists(false);
        setSuccessMailSent(true);
      }
    } catch (err) {
      setEmailAlreadyExists(err.message);
    } finally {
      setLoader(false);
    }
  };
  const successMailClick = (event) => {
    setSuccessMailSent(false);
    navigate("/");
  };

  return (
    <div className={module["page-wrapers"]}>
      <div className={module["logo-wraper"]}>
        <Logo />
      </div>
      {successMailSent ? (
        <div className={module["auth-heading-info"]}>
          <div className={module["success-image"]}>
            <img src={Email} alt="" loading="lazy" />
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
            {emailValidation === null ? (
              <Button
                extraClass="btn-primary w-100"
                loaderValue={loader}
                btnText="Continue"
              />
            ) : (
              <Button
                extraClass="btn-primary w-100"
                loaderValue={loader}
                btnText="Continue"
                disable={true}
              />
            )}
          </form>
          {emailAlreadyExists && (
            <span className="error-mesage text-center existing-email">
              {emailAlreadyExists}
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
