import { Outlet } from "react-router-dom";

const MainComponent = () => {
    return (
        <main className="main">
            <Outlet />
        </main>
    );
};

export default MainComponent;