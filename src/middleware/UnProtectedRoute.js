import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const UnProtectedRoute = ({ component: Component, ...rest }) => {
    const logState = useSelector((state) => state.auth.isLoggedIn);
    
    return (
        logState ? 
            <Navigate to="/" /> : <Outlet />
    )
};

export default UnProtectedRoute;