import React, {useContext} from 'react';
import {DarkModeContext} from '../../context/DarkModeContext';

function Themewitch() {
    const {darkMode, toggleDarkMode} = useContext(DarkModeContext);
    const handleClick = () => {
        toggleDarkMode();
    }
    return (
        <div className="Lightswitch">
          <button  onClick={handleClick}>
          {darkMode ? 
            `Light` : `Dark`}
          </button>
                  
        </div>
    )
}

export default Themewitch
