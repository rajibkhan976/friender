import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = (props) => {
    const logState = useSelector((state) => state.auth.isLoggedIn);

    return (
        logState ? 
            <Outlet /> :
            <Navigate to="/login" />
    )
};  

export default PrivateRoutes;