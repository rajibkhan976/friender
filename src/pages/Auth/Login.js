import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import EmailInput from "../../components/formComponents/EmailInput";
import PasswordInput from "../../components/formComponents/PasswordInput";
import Button from "../../components/formComponents/Button";
import module from "./styling/authpages.module.scss";
import { logUserIn } from "../../actions/AuthAction";
import { Logo } from "../../assets/icons/Icons";

const LoginPage = () => {
  //:::Login Parent page:::
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [emailEntered, setEmailEntered] = useState("");
  const [emailAlreadyExists, setEmailAlreadyExists] = useState("");
  const [emailValidation, setEmailValidation] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [passwordEntered, setPasswordEntered] = useState(false);

  useEffect(() => {}, []);
  const passwordEnter = (enter) => {
    setPasswordEntered(enter);
  };
  const passwordErrors = (error) => {
    setPasswordValidation(error);
  };

  const handelerSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    dispatch(logUserIn({ email: emailEntered, password: passwordEntered }))
      .unwrap()
      .then((res) => {
        // console.log('res >>>', res);
        localStorage.setItem("fr_default_email", emailEntered);
        localStorage.setItem("submenu_status", 0);
        localStorage.removeItem('registrationPayload');
        setEmailAlreadyExists(res.payload.message);
      })
      .catch((error) => {
        if (error.message === "Rejected") {
          setEmailAlreadyExists("Incorrect login Credentials!");
        } else {
          setEmailAlreadyExists(JSON.stringify(error.message));
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };
  useEffect(() => {}, [emailAlreadyExists]);

  return (
    <div className={module["page-wrapers"]}>
      <div className={module["logo-wraper"]}>
        <span className={module["logo-wraper-text"]}>
          <Logo />
          <span>Your organic marketing best friend</span>
        </span>
      </div>
      <div className={module["auth-heading-info"]}>
        <h3 className="text-center">Welcome Back !</h3>
        <p className="text-center">Login to continue with your account</p>
      </div>
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
        {emailAlreadyExists && (
          <span className="error-mesage existing-email text-center margin-up-down">
            {emailAlreadyExists}
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
