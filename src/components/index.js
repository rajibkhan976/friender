import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LoaderContext } from "../context/PageLoaderContext";
import { ModeContext } from "../context/ThemeContext";

import PageLoader from "../components/common/loaders/PageLoader";
import Sidebar from "./common/Sidebar";
import Footer from "./common/Footer";
import PageHeader from "./common/PageHeader";
import { ToastContainer } from "react-toastify";

const MainComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useContext(ModeContext);
  const { pageLoaderMode, switchLoaderOn, switchLoaderOff } = useContext(LoaderContext);
  const [isHeader, setIsHeader] = useState(false);

  const showHeader = () => {
    if(
      location.pathname == '/' ||
      location.pathname == '/onboarding' ||
      location.pathname == '/reset-password' || 
      location.pathname == '/extension.success'
    ) {
      return false
    }
    else {
      return true
    }
  }

  useEffect(() => {
    let password_reset_status = localStorage.getItem("fr_pass_changed");
    let user_onbording_status = localStorage.getItem("fr_onboarding");
    // console.log(password_reset_status, user_onbording_status);

    if (password_reset_status != 1) {
      navigate("/reset-password");
    } else {
      if (user_onbording_status != 1) {
        navigate("/onboarding");
      }
    }
    switchLoaderOn();

    const onPageLoad = () => {
      switchLoaderOff();
    };

    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);

  return (
    <main className={darkMode ? `main theme-default ${location.pathname == '/extension.success' ? 'success-page' : ''}` : `main theme-light ${location.pathname == '/extension.success' ? 'success-page' : ''}`}>
       <ToastContainer />
      <div className="main-wrapper">
        <div className="body-content-wraper">
          <Sidebar />
          <div className="main-content rightside-content d-flex">
            {showHeader() && <PageHeader />}
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
      {pageLoaderMode ? <PageLoader /> : ""}
    </main>
  );
};

export default MainComponent;
