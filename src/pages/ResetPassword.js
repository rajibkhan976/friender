import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Lottie from "react-lottie-player";
import passwordAnimation from "../assets/animations/password-animation.json";
import PasswordInput from "../components/formComponents/PasswordInput";
import Button from "../components/formComponents/Button";
import module from "./Auth/styling/authpages.module.scss";
//import AuthAction from "../actions/AuthAction";
import { resetUserPass } from "../actions/AuthAction";
const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [resetPass, setResetPass] = useState(true);
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [confirmPasswordValidation, setConfirmPasswordValidation] =
    useState(false);
  const [passwordNew, setPasswordNew] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState(false);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const passwordErrors = (error) => {
    setPasswordValidation(error);
  };
  const ConfirmPasswordErrors = (error) => {
    setConfirmPasswordValidation(error);
  };
  const passwordEnterFn = (enter) => {
    setPasswordNew(enter);
  };
  const passwordReEnteredFn = (enter) => {
    setPasswordConfirm(enter);
  };

  const handelerSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    //console.log("the loader state is", loader);

    if (passwordNew === passwordConfirm) {
      dispatch(
        resetUserPass({
          token: localStorage.getItem("fr_token"),
          password: passwordNew,
        })
      )
        .unwrap() // token:resetToken,
        .then((response) => {
          // console.log('here', response);
          if (response) {
            window.localStorage.setItem("fr_pass_changed", 1);
            setEmailAlreadyExists(false);
            navigate("/onboarding");
            //console.log("the loader state now is", loader);
          }
        })
        .catch((error) => {
          //console.log('here', error);
          setEmailAlreadyExists(error.message);
        })
        .finally(() => {
          setLoader(false);
          //console.log("the loader state finally is", loader);
        });
    } else {
      setEmailAlreadyExists("Passwords do not match!");
    }
  };

  useEffect(() => {
    let passChanged = localStorage.getItem("fr_pass_changed");

    if (passChanged != 1) {
      let userToken = localStorage.getItem("fr_token");
      setResetToken(userToken);
    } else {
      //console.log('in next');
      setResetToken("");

      navigate("/");
    }
  }, []);
  return (
    <div className="page-wrapers">
      <div className={module["auth-heading-info"]}>
        <h3 className="text-center onboarding-heading">Welcome to Friender</h3>
        <p className="text-center reset-password">
          First thing first, Let’s secure your account
        </p>
      </div>
      <div className="animation-wraper">
        <Lottie
          loop={4}
          animationData={passwordAnimation}
          play
          background="transparent"
          style={{ width: "140px", height: "140px", margin: "0 auto" }}
        />
      </div>
      <form
        onSubmit={handelerSubmit}
        className="authpage-form"
        autoComplete="new-password"
      >
        <PasswordInput
          labelText="Set new Password"
          placeholderText="Set new Password"
          passwordErrors={passwordErrors}
          passwordEntered={passwordEnterFn}
          typeValidation={true}
        />
        <PasswordInput
          labelText="Confirm new password"
          placeholderText="Confirm new Password"
          passwordErrors={ConfirmPasswordErrors}
          passwordEntered={passwordReEnteredFn}
          typeValidation={true}
        />
        {passwordValidation === null && confirmPasswordValidation === null ? (
          <div className="reset-password">
            {passwordNew === passwordConfirm ? (
              <Button
                extraClass="btn-primary w-100"
                loaderValue={loader}
                btnText="Next"
              />
            ) : (
              <Button
                extraClass="btn-primary mismatched w-100"
                loaderValue={loader}
                btnText="Passwords did not matched"
                disable={true}
              />
            )}
          </div>
        ) : (
          <Button
            extraClass="btn-primary w-100"
            loaderValue={loader}
            btnText="Next"
            disable={true}
          />
        )}
        {emailAlreadyExists && (
          <span className="error-mesage existing-email text-center margin-up-down">
            {emailAlreadyExists}
          </span>
        )}
      </form>
      <p className={module["footer-text"]}>&nbsp;</p>
    </div>
  );
};

export default ResetPasswordPage;
