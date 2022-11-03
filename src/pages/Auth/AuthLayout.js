import Footer from "../../components/common/Footer";
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
