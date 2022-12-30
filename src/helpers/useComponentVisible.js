import { useState, useEffect, useRef } from "react";

export default function useComponentVisible() {
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const clickedRef = useRef(null);

  const handleClickOutside = (event) => {
    
    const newTarget = event.target.closest('div[dir="dmf-list"]');
    if (clickedRef.current && !clickedRef.current.contains(event.target)) {
      
      if(newTarget && newTarget.getAttribute("dir") === "dmf-list")
        isComponentVisible && setIsComponentVisible(true);
      else
        isComponentVisible && setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    
    document.addEventListener("click", handleClickOutside, !isComponentVisible);

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside,
        !isComponentVisible
      );
    };
  });

  return { clickedRef, isComponentVisible, setIsComponentVisible };
}
