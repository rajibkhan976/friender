import { toast } from "react-toastify";
import { ErrorIcon, OpenInNewTab, SuccessIcon, WarningIcon } from "../../assets/icons/Icons";
import { NavLink } from "react-router-dom";

// import "react-toastify/dist/ReactToastify.css";
// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';

const Alertbox = (msg = "success", type = "success", delay,position="top-right", groupLink="") => {
  switch (type) {
    case "success":
      return toast.success(
        <div className="alert-inner">
          <div className="alert-inner-sec">
            <div className="msg-header success-header">Congratualtions!</div>
            <div className="msg success-txt">{msg}</div>
          </div>
          <span className="alert-divider"></span>
        </div>,
        {
          icon: (<SuccessIcon/>),
          position: position,
          autoClose: delay,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    case "error":
      return toast.error(
        <div className="alert-inner">
          <div className="alert-inner-sec">
            <div className="msg-header error-header">Something is wrong!</div>
            <div className="msg error-txt">{msg}</div>
          </div>
          <span className="alert-divider"></span>
        </div>,
        {
          icon:(<ErrorIcon/>),
          position: position,
          autoClose: delay,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      
      case "error-toast":
        return toast.error(
          <div className="alert-inner">
            <div className="alert-inner-sec">
              <div className="msg-header error-header">Error</div>
              <div className="msg error-txt">{msg} <NavLink target="_blank" to={groupLink}>{groupLink} <OpenInNewTab/></NavLink></div>
            </div>
            <span className="alert-divider"></span>
          </div>,
          {
            icon:(<ErrorIcon/>),
            position: position,
            autoClose: delay,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
    case "warning":
      return toast.warning(
        <div className="alert-inner">
        <div className="alert-inner-sec">
          <div className="msg-header warning-header">Warning!</div>
          <div className="msg warning-txt">{msg}</div>
        </div>
        <span className="alert-divider"></span>
      </div>,
        {
          icon:(<WarningIcon/>),
          position: position,
          autoClose: delay,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      case "warning-toast":
      return toast.warning(
        <div className="alert-inner">
        <div className="alert-inner-sec">
          <div className="msg-header warning-header">Warning!</div>
          <div className="msg warning-txt">{msg}</div>
        </div>
        <span className="alert-divider"></span>
      </div>,
        {
          icon:(<WarningIcon/>),
          position: position,
          autoClose: delay,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    default:
      return toast.warning(
        <div className="alert-inner">
          <div className="alert-inner-sec">
            <div className="msg-header warning-header">Warning!</div>
            <div className="msg warning-txt">{msg}</div>
          </div>
          <span className="alert-divider"></span>
        </div>,
        {
          icon:(<WarningIcon/>),
          position: position,
          autoClose: delay,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
  }
};

export default Alertbox;
