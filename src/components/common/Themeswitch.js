import React, {useContext} from 'react';
import {ModeContext} from '../../context/ThemeContext';
import Switch from './Switch';

function Themewitch({extraClass}) {
    const {darkMode, toggleDarkMode} = useContext(ModeContext);
    const handleClick = () => {
        toggleDarkMode();
        console.log('done');
    }
    return (
        <div className={`lightswitch ${extraClass ? extraClass : ''}`}>
          <Switch
            checked={darkMode}
            handleChange={handleClick}
          />                  
        </div>
    )
}

export default Themewitch
