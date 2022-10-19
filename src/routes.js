import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom"

import MainComponent from "./components"
import Login from "./pages/Login"
import UnProtectedRoute from "./middleware/UnProtectedRoute";
import PrivateRoutes from "./middleware/PrivateRoutes";
// import ForgetPassword from "./pages/ForgetPassword";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<PrivateRoutes />}>
                <Route path="/" element={<MainComponent />}>
                    {/* <Route index element={<Dashboard />} /> */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Route>
            </Route>
            <Route element={<UnProtectedRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;