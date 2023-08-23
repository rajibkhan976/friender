import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { LoaderContext } from "../context/PageLoaderContext";
import { ModeContext } from "../context/ThemeContext";
import PageLoader from "../components/common/loaders/PageLoader";
import { ToastContainer } from "react-toastify";
import {
  fetchUserProfile,
} from "../services/authentication/facebookData";
// import socket  from "../configuration/socket-connection";
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const Sidebar = lazy(() => import("./common/Sidebar"));
const PageHeader = lazy(() => import("./common/PageHeader"));
const Footer = lazy(() => import("./common/Footer"));

// if (!socket.connected || !socket.auth || !socket.auth.token){
//   console.log("socket connection from page index")
//   const socket = io(SOCKET_URL, {
//     transports: ["websocket"], // use WebSocket first, if available
//     auth: {token: localStorage.getItem("fr_token")}
//   });
//   socket.on('connect', function () {
//     socket.emit('join', {token: localStorage.getItem("fr_token")});
//   });
// }
// socket.on("disconnect", (reason) => {
//   console.log("disconnect due to " + reason);
//   socket.connect();
// });

// socket.on("connect_error", (e) => {
//   console.log("There Is a connection Error", e);
//   socket.io.opts.transports = ["websocket", "polling"];
//   socket.connect();
// });

// socket.on("facebookLoggedOut", (logoutUpdate)=>{
//   console.log("updates :::  ", logoutUpdate);
//   localStorage.removeItem("fr_update")
//   localStorage.removeItem("fr_isSyncing")
//   localStorage.removeItem("friendLength")
// });

const MainComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useContext(ModeContext);
  const { pageLoaderMode, switchLoaderOn, switchLoaderOff } = useContext(LoaderContext);
  const [isSynced, setIsSynced] = useState(false);
  //const [isHeader, setIsHeader] = useState(false);

  const showHeader = () => {
    if(
      location.pathname == '/' ||
      location.pathname == '/onboarding' ||
      location.pathname == '/reset-password' || 
      location.pathname == '/extension-success'
    ) {
      return false
    }
    else {
      return true
    }
  }

  useEffect(() => {
    switchLoaderOn();
    const fetchUserData = async () => {
      try {
        let password_reset_status = await localStorage.getItem("fr_pass_changed");
        let user_onbording_status = await localStorage.getItem("fr_onboarding");
        const userProfile = await fetchUserProfile();
        let fbAuthValidation =  userProfile[0]?.fb_auth_info
        
        if(fbAuthValidation!=undefined && user_onbording_status == 1){
          localStorage.setItem('fr_facebook_auth',JSON.stringify(fbAuthValidation))
        }

        console.log("****** user profile",userProfile,user_onbording_status,(fbAuthValidation == undefined || fbAuthValidation!=undefined) &&  password_reset_status== 1 && user_onbording_status == "0")
        if(fbAuthValidation==undefined){
          console.log("1")
          localStorage.removeItem("fr_facebook_auth")
          navigate("/facebook-auth")

          // facebook auth : true && reset password  : false = go to reset password
        }else if(fbAuthValidation!=undefined && password_reset_status != 1){
          console.log("2")
          localStorage.setItem('fr_facebook_auth',JSON.stringify(fbAuthValidation))
          navigate("/reset-password")
          // facebook auth : true && user onboarding : false =  go back to facebook auth
        }else if(fbAuthValidation!=undefined  && user_onbording_status !=1){
          console.log("3")
          localStorage.removeItem("fr_facebook_auth")
          navigate("/facebook-auth")
        }else{
          // facebook auth : true && reset password : true && onboarding : true = getting started
            // console.log("4")
            // navigate("/getting-started")
        }
        onPageLoad()
        
        // if((fbAuthValidation == undefined || fbAuthValidation!=undefined) &&  password_reset_status== 1 && user_onbording_status == "0"){
        //   navigate("/")
        // }



        


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    fetchUserData()

    
  

    // console.log("*******************user_onboarding_status",user_onbording_status)

    // if (password_reset_status != 1) {
    //   navigate("/reset-password");
    // } else {
    //   if (user_onbording_status != 1) {
    //     navigate("/onboarding");
    //   }
    // }
 

   

    const onPageLoad = () => {
      switchLoaderOff();
    };

    if (document.readyState === "complete") {
      // onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);

  return (
    <main className={darkMode ? `main theme-default ${location.pathname == '/extension-success' ? 'success-page' : ''}` : `main theme-light ${location.pathname == '/extension-success' ? 'success-page' : ''}`}>
       <ToastContainer />
      <div className="main-wrapper">
        <div className="body-content-wraper">
          <Suspense fallback={""}>
            <Sidebar  isSynced={isSynced}/>
          </Suspense>
          <div className="main-content rightside-content d-flex">
            {showHeader() && 
            <Suspense fallback={""}>
              <PageHeader />
            </Suspense>}
            <Outlet  context={{isSynced, setIsSynced}}/>
          </div>
        </div>
        <Suspense fallback={""}>
          <Footer />
        </Suspense>
      </div>
      {pageLoaderMode ? <PageLoader /> : ""}
    </main>
  );
};

export default MainComponent;
