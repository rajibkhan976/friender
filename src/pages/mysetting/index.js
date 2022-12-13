import { Outlet } from "react-router-dom";
import PageLeftMenuNav from "../../components/common/PageLeftMenuNav";

const Settings = () => {
  //::::This is the parent component of all the Settings::::
  const leftMenu = [
    {
      links: "/",
      linkString: "My Setting",
    },
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
