import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = (props) => {
    const logState = useSelector((state) => state.auth.isLoggedIn);

    return (
        logState ? 
            <Outlet /> :
            <Navigate to="/login" />
        // <Route
        //     render={(props) =>
        //         props.isLoggedIn ? (
        //             <>
        //                 <Component {...props} params={props.match}/>
        //             </>
        //         ) : (
        //             <Navigate to="/login" />
        //         )
        //     }
        // />
    )
};  

export default PrivateRoutes;