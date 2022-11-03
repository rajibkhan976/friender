import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Logo from "../../assets/images/logo.png";
import PasswordInput from "../../components/formComponents/PasswordInput";
import Button from "../../components/formComponents/Button";
import module from "./styling/authpages.module.scss";
import AuthAction from "../../actions/AuthAction";

const CreatePasswordPage = () => {
  const dispatch = useDispatch();
  let { token } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [passwordEntered, setPasswordEntered] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState(false);
  const [passwordNew, setPasswordNew] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState(false);
  const [emailExisting, setEmailExisting] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const passwordErrors = (error) => {
    setPasswordValidation(error);
  };
  const ConfirmPasswordErrors = (error) => {
    setConfirmPasswordValidation(error);
  };
  const passwordEnter = (enter) => {
    setPasswordNew(enter);
  };
  const passwordReEntered = (enter) => {
    setPasswordConfirm(enter);
  };
  const handelerSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    // console.log("passwordNew", passwordNew, "passwordConfirm", passwordConfirm);
    if (passwordNew === passwordConfirm) {
      dispatch(AuthAction.resetPass(resetToken, passwordNew))
        .then((response) => {
          if (response) {
            window.localStorage.removeItem("fr_reset");
            setEmailExisting(false);
            navigate("/login");
          }
        })
        .catch((error) => {
          setEmailExisting(error.message);
        })
        .finally(() => {
          setLoader(false);
        });
    } else {
      setEmailExisting("Passwords do not match!");
    }
  };

  useEffect(() => {
    if (token === "") {
      navigate("/forget-password");
    }
  }, []);

  return (
    <div className={module["page-wrapers"]}>
      <div className={module["logo-wraper"]}>
        <img src={Logo} alt="" />
      </div>
      <div className={module["auth-heading-info"]}>
        <h3 className="text-center">Create Password</h3>
        <p className="text-center">
          Create a new strong password to
          <br /> continue using friender
        </p>
      </div>
      <form onSubmit={handelerSubmit} autoComplete="new-password">
        <PasswordInput
          labelText="New Password"
          placeholderText="New Password"
          passwordErrors={passwordErrors}
          passwordEntered={passwordEnter}
        />
        <PasswordInput
          labelText="Confirm new password"
          placeholderText="Re-enter Password"
          passwordErrors={ConfirmPasswordErrors}
          passwordEntered={passwordReEntered}
        />
        {passwordValidation === null && confirmPasswordValidation === null ? (
          <div className="reset-password">
            {passwordNew === passwordConfirm ? (
              <Button extraClass="btn-primary" btnText="Continue" />
            ) : (
              <Button
                extraClass="btn-primary"
                loaderValue={loader}
                btnText="Passwords did not matched"
                disable={true}
              />
            )}
          </div>
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
        If you don’t want to reset password <Link to="/">Log in</Link>
      </p>
    </div>
  );
};

export default CreatePasswordPage;
