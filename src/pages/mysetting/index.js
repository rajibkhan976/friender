import { Outlet } from "react-router-dom";
import PageLeftMenuNav from "../../components/common/PageLeftMenuNav";
import "./styling/settings.scss"

const Settings = () => {
  //::::This is the parent component of all the Settings::::
  const leftMenu = [
    {
      links: "/settings/settings",
      linkString: "Settings",
    },
    {
      links: "/settings/request-history",
      linkString: "Request History",
    },
    {
      links: "/settings/browser-manager",
      linkString: "Browser Manager",
    }
  ];
  return (
    <div
      className="main-content-inner d-flex justifyContent-start main-mysetting"
      style={{ width: "100%" }}
    >
      <div className="setting-menu">
        <PageLeftMenuNav menus={leftMenu} startMenu={leftMenu[0]} />
      </div>
      <Outlet />
    </div>
  );
};
export default Settings;
