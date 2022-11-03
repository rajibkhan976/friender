import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthAction from "../../actions/AuthAction";
import Logo from "../../assets/images/logo.png";
import EmailInput from "../../components/formComponents/EmailInput";
import PasswordInput from "../../components/formComponents/PasswordInput";
import Button from "../../components/formComponents/Button";
import module from "./styling/authpages.module.scss";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [emailEntered, setEmailEntered] = useState(false);
  const [emailExisting, setEmailExisting] = useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [passwordEntered, setPasswordEntered] = useState(false);
  const emailEnter = (enter) => {
    setEmailEntered(enter);
  };
  const emailErrors = (error) => {
    setEmailValidation(error);
  };
  const passwordEnter = (enter) => {
    setPasswordEntered(enter);
  };
  const passwordErrors = (error) => {
    setPasswordValidation(error);
  };
  const navigate = useNavigate();

  const handelerSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    dispatch(AuthAction.login(emailEntered, passwordEntered))
      .then((response) => {
        console.log("response", response);
        setEmailExisting(false);
        navigate("/");
      })
      .catch((error) => {
        setEmailExisting(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <div className={module["page-wrapers"]}>
      <div className={module["logo-wraper"]}>
        <img src={Logo} alt="" />
      </div>
      <div className={module["auth-heading-info"]}>
        <h3 className="text-center">Welcome Back !</h3>
        <p className="text-center">Login to continue with your account</p>
      </div>
      <form onSubmit={handelerSubmit} autoComplete="new-password">
        <EmailInput
          labelText="Email"
          placeholderText="Enter Email"
          emailErrors={emailErrors}
          emailEntered={emailEnter}
        />

        <PasswordInput
          labelText="Password"
          placeholderText="Enter Password"
          passwordErrors={passwordErrors}
          passwordEntered={passwordEnter}
        >
          <span className="forget-wraper float-right">
            <Link to="/forget-password" className="text-right">
              Forgot Password
            </Link>
          </span>
        </PasswordInput>
        {/* <Checkbox labelValue="Remember" boxText="Remember Me" /> */}
        {emailValidation === null && passwordValidation === null ? (
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
        {emailExisting && (
          <span className="error-mesage existing-email text-center margin-up-down">
            {emailExisting}
          </span>
        )}
      </form>

      <p className={module["footer-text"]}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
