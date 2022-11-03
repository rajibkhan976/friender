import { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { ModeContext } from "../context/ThemeContext"

const MainComponent = () => {
    const {darkMode} = useContext(ModeContext);

    return (
        <main className={darkMode ? 'main theme-default' : 'main theme-light'}>
            <Outlet />
        </main>
    );
};

export default MainComponent;