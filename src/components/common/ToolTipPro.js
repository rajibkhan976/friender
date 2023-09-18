import React, { memo, useEffect } from "react";
import {InfoIcon, InfoIcon2, QueryIcon, QueryIconGrey} from "../../assets/icons/Icons";
import '../../assets/scss/component/common/_tooltip.scss'
import useComponentVisible from "../../helpers/useComponentVisible";

function ToolTipPro({
  direction = "bottom",
  textContent = "Hello World",
  type = "",
  isInteract = true,
  extraClassToOptimise = "",
}) {
  const { clickedRef, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  useEffect(() => {
    console.log("textContent");
  }, [textContent]);
  return (
    <span
      className={"fr-tooltipPro fr-tooltipPro-" + direction + ` fr-tooltipPro-${type}`}
    >
      <figure
        className="fr-tooltipPro-icon"
        onMouseEnter={() => setIsComponentVisible(true)}
        ref={clickedRef}
        onMouseLeave={() => !isInteract && setIsComponentVisible(false)}
      >
        {type === "query" ? <QueryIcon /> : type === "info" ? <InfoIcon2 /> : type === "query-gray" ? <QueryIconGrey /> : <InfoIcon />}
      </figure>
      {isComponentVisible && <span className={`fr-tooltipPro-content ${extraClassToOptimise}`}>
        {isInteract && <h3>Quick Info</h3>}

        {textContent}
        {isInteract && <div className="footer"><button className="btn-primary" onClick={() => { setIsComponentVisible(false) }}>Got it</button></div>}
      </span>}

    </span>
  );
}

export default memo(ToolTipPro);
