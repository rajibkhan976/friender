import { createContext, useEffect, useState } from "react";

const ModeContext = createContext();

const themedUser = JSON.parse(localStorage.getItem("fr_theme"));

const ThemeContextProvider = (props) => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    //console.log("themedUser", themedUser, "changing to:::", !darkMode);
    localStorage.setItem("fr_theme", !darkMode);
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    //console.log(":::", themedUser);
    themedUser != null && setDarkMode(themedUser)
  }, [])

  return (
    <>
      <ModeContext.Provider value={{ darkMode, toggleDarkMode }}>
        {props.children}
      </ModeContext.Provider>
    </>
  );
};

export { ModeContext, ThemeContextProvider };