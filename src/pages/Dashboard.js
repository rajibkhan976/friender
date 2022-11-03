import React from "react";
import { useDispatch } from "react-redux";
import AuthAction from "../actions/AuthAction";
import Logo from "../assets/images/logo.png";
import module from "./Auth/styling/authpages.module.scss";
const Dashboard = () => {
  const dispatch = useDispatch();
  const logoOut = (e) => {
    e.preventDefault();
    dispatch(AuthAction.logout());
  };
  return (
    <div className={module["page-wrapers"]}>
      <div className={module["logo-wraper"]}>
        <img src={Logo} alt="" />
      </div>
      <div className={module["auth-heading-info"]}>
        <h3 className="text-center">Welcome to Dashboard</h3>
        <p className="text-center">Click the button to logout from account.</p>
      </div>
      <button className="btn-primary" onClick={logoOut}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
