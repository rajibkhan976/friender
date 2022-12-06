import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
//import AuthAction from "../../actions/AuthAction";
import EmailInput from "../../components/formComponents/EmailInput";
import PasswordInput from "../../components/formComponents/PasswordInput";
import Button from "../../components/formComponents/Button";
import module from "./styling/authpages.module.scss";
import { logUserIn } from "../../actions/AuthAction";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [emailEntered, setEmailEntered] = useState(false);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState("");
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

    console.log("login component  pass****",passwordEntered)

    dispatch(logUserIn({email:emailEntered,password:passwordEntered}))
      .then((response) => {
        // password_reset_status user_onbording_status
  
        // console.log("++++++ole response",response.payload)
        setEmailAlreadyExists(response.payload);
        // if(response.password_reset_status != 1) {
        //   console.log("response>>>", response);
        //   navigate("/reset-password");
        // }
        // else {
        //   console.log("response>>>", response);
        //   if(response.user_onbording_status != 1) {
        //     console.log("response>>>", response);
        //     navigate("/onboarding");
        //   }
        //   else {
        //     console.log("response>>>", response);
        //     navigate('/');
        //   }
        // }
     
        localStorage.setItem('fr_default_email', emailEntered);  
        localStorage.setItem('submenu_status', 0);  
      })
      .catch((error) => {
        console.log("ole rejected___+++",error);
        setEmailAlreadyExists(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  useEffect(()=>{
    console.log("ddddddddddddd",emailAlreadyExists);

  },[emailAlreadyExists])

  return (
    <div className={module["page-wrapers"]}>
      <div className={module["logo-wraper"]}>
        {/* <img src={Logo} alt="" /> */}
        <svg width="150" height="31" viewBox="0 0 150 31" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.13419 0.433594H22.8304C24.7224 0.433779 26.5368 1.1855 27.8746 2.5234C29.2123 3.8613 29.9639 5.6758 29.9639 7.56779V23.264C29.9637 25.156 29.212 26.9704 27.8741 28.3082C26.5362 29.6459 24.7217 30.3975 22.8297 30.3975H7.1335C5.24151 30.3973 3.42708 29.6456 2.08931 28.3077C0.75154 26.9698 -9.02521e-09 25.1553 0 23.2633V7.56709C0.0001848 5.67511 0.751902 3.86067 2.0898 2.5229C3.4277 1.18513 5.24221 0.433594 7.13419 0.433594V0.433594Z" fill="#605BFF"/>
          <path d="M7.14062 16.808L12.6001 22.2677V11.8066H7.75401L7.14062 16.808Z" fill="#3F3AD5"/>
          <path d="M12.1733 11.7822H7.14062V16.8146L12.1733 11.7822Z" fill="#11E6B4"/>
          <mask id="mask0_2164_36245" style={{maskType: "alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="30" height="31">
          <path d="M7.13419 0.433594H22.8304C24.7224 0.433779 26.5368 1.1855 27.8746 2.5234C29.2123 3.8613 29.9639 5.6758 29.9639 7.56779V23.264C29.9637 25.156 29.212 26.9704 27.8741 28.3082C26.5362 29.6459 24.7217 30.3975 22.8297 30.3975H7.1335C5.24151 30.3973 3.42708 29.6456 2.08931 28.3077C0.75154 26.9698 -9.02521e-09 25.1553 0 23.2633V7.56709C0.0001848 5.67511 0.751902 3.86067 2.0898 2.5229C3.4277 1.18513 5.24221 0.433594 7.13419 0.433594V0.433594Z" fill="#605BFF"/>
          </mask>
          <g mask="url(#mask0_2164_36245)">
          <path d="M20.6532 4.27148L29.9592 13.5777L29.8547 44.3381L12.1602 26.5812V10.7944L20.6532 4.27148Z" fill="#3F3AD5"/>
          </g>
          <path d="M20.6676 9.33137C18.5016 9.14485 17.4183 9.9602 17.4179 11.7774H20.6676V16.81H17.4177V26.5806H12.1758V11.7774C12.1758 9.26139 12.8863 7.3451 14.3072 6.02855C15.7282 4.71199 17.8482 4.1353 20.6672 4.29848L20.6676 9.33137Z" fill="white"/>
          <path d="M144.614 13.2555V10.1997H139.332C140.04 10.1997 140.54 10.6932 140.604 11.2023C140.615 12.1836 140.621 13.3057 140.621 14.6793V26.7065H144.613V19.2349C144.613 14.8274 146.659 13.2391 149.998 13.2613V10.2074C147.217 10.245 145.387 11.2526 144.613 13.256" fill="white"/>
          <path d="M56.2034 13.2555V10.1997H50.9219C51.6295 10.1997 52.1297 10.6932 52.1936 11.2023C52.2051 12.1836 52.211 13.3057 52.211 14.6793V26.7065H56.2028V19.2349C56.2028 14.8274 58.2484 13.2391 61.5875 13.2613V10.2074C58.8064 10.245 56.9768 11.2526 56.2028 13.256" fill="white"/>
          <path d="M126.712 18.6512C126.722 21.1508 127.977 23.2918 130.429 23.2918C132.569 23.2918 133.215 22.3326 133.68 21.2645H137.682C137.075 23.3158 135.283 26.4669 130.319 26.4669C124.965 26.4669 122.688 22.3509 122.688 18.0478C122.688 12.9609 125.283 9.18994 130.49 9.18994C136.043 9.18994 137.909 13.3485 137.909 17.267C137.92 17.7291 137.902 18.1914 137.854 18.6512H126.712ZM133.898 16.1132C133.866 13.9241 132.897 12.1175 130.47 12.1175C128.041 12.1175 127.027 13.7997 126.808 16.1132H133.898Z" fill="white"/>
          <path d="M74.9425 18.6512C74.9521 21.1508 76.2073 23.2918 78.6596 23.2918C80.7996 23.2918 81.4454 22.3326 81.91 21.2645H85.9123C85.305 23.3158 83.5131 26.4669 78.5495 26.4669C73.1957 26.4669 70.918 22.3509 70.918 18.0478C70.918 12.9609 73.5137 9.18994 78.7203 9.18994C84.2737 9.18994 86.1398 13.3485 86.1398 17.267C86.1506 17.7291 86.1322 18.1914 86.0849 18.6512H74.9425ZM82.1288 16.1132C82.0969 13.9241 81.1273 12.1175 78.7009 12.1175C76.2717 12.1175 75.2577 13.7997 75.0389 16.1132H82.1288Z" fill="white"/>
          <path d="M41.9133 26.716V13.2716H39.8438V10.2092H41.9133C41.9133 10.2092 41.6492 4.63867 47.0243 4.63867C47.7309 4.63867 48.6388 4.71288 49.0477 4.8411V8.04881C48.6763 7.98092 48.2994 7.94704 47.9218 7.94759C45.6459 7.94759 45.9052 10.209 45.9052 10.209H48.9329V13.2716H45.9052V26.716H41.9133Z" fill="white"/>
          <path d="M97.5808 9.69325C94.5887 9.69325 93.2487 11.2211 92.655 12.3865C92.6425 11.8689 92.6338 10.0788 92.6338 10.0788H87.3711C88.1036 10.0788 88.6146 10.607 88.6503 11.1343C88.6628 12.1252 88.6629 13.205 88.6629 14.2373V26.5847H92.6548V17.5408C92.6548 14.491 93.8145 12.9774 96.1502 12.9774C98.3365 12.9774 99.0739 14.4349 99.0739 16.5045V26.5845H103.066V16.0449C103.066 11.8151 100.822 9.69238 97.5808 9.69238" fill="white"/>
          <path d="M120.967 21.8491V4H115.594C116.366 4 116.902 4.58817 116.902 5.15411V10.8952C116.504 10.0621 115.196 9.07394 112.591 9.07394C107.87 9.07394 105 12.9186 105 18.1904C105 23.4914 107.688 27 111.96 27C114.552 27 116.085 26.0908 116.902 24.596L116.918 26.6004H121C120.968 25.005 120.968 23.4258 120.968 21.8496M113.081 23.636C110.683 23.636 109.186 21.6839 109.186 18.0771C109.186 14.5343 110.62 12.4376 113.238 12.4376C116.528 12.4376 117.06 14.7169 117.06 17.9415C117.06 20.837 116.525 23.6353 113.081 23.6353" fill="white"/>
          <path d="M64.3084 9.91357H63.0234C63.7802 9.91357 64.3054 10.4775 64.3084 11.0212V26.4212H68.3002V9.91357H64.3084Z" fill="white"/>
          <path d="M68.2937 5.23958L68.2946 4.63525H64.3125V9.21311H64.3202C65.3737 9.21209 66.3837 8.79315 67.1286 8.04822C67.8736 7.30329 68.2925 6.29324 68.2935 5.23976" fill="#11E6B4"/>
        </svg>
      </div>
      <div className={module["auth-heading-info"]}>
        <h3 className="text-center">Welcome Back !</h3>
        <p className="text-center">Login to continue with your account</p>
      </div>
      <form onSubmit={handelerSubmit} className="authpage-form" autoComplete="new-password">
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