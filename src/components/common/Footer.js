import { useSelector } from "react-redux";

const Footer = () => {
  const logState = useSelector((state) => state.auth.isLoggedIn);

  return (
    <div className={`footer-infos text-center ${logState ? 'fr-signed-in' : ''}`}>
       <p>Powered by <a href="https://tier5.us/" target="_blank" >Tier5</a> - <a href="https://www.tier5.us/privacy_policy" target="_blank" >Privacy Policy</a> {/*- <a href="#" target="_blank" >GDPR</a>*/}</p> 
    </div>
  );
}
export default Footer;
