import { useContext } from 'react';
import { ModeContext } from "../context/ThemeContext"
import { Outlet } from "react-router-dom"

const MainComponent = () => {
    const {darkMode} = useContext(ModeContext);

    return (
        <main className={darkMode ? 'main' : 'main theme-light'}>
            <header>Header</header>
            <Outlet/>
        </main>
    );
};

export default MainComponent;