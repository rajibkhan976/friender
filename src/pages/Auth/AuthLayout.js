import React from "react";
import Footer from "../../components/Common/Footer";
import module from "./styling/authpages.module.scss";
const AuthLayout = (Component) => ({...props}) => {
 
  return (
    <div className={module['body-wraper']}>
      <Component {...props} />
      <Footer />
    </div>
    );
}

export default AuthLayout;
