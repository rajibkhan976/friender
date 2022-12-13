import { memo, useEffect } from "react";
import { InfoIcon, QueryIcon } from "../../assets/icons/Icons";

import '../../assets/scss/component/common/_tooltip.scss'

const Tooltip = ({direction='bottom', textContent='Hello World', type="query"}) => {
    
    useEffect(() => {
        console.log("textContent");
    }, [textContent])
    return (
        <span className={'fr-tooltip fr-tooltip-'+direction+` fr-tooltip-${type}`}>
            <figure
                className="fr-tooltip-icon"
            >
                {type == 'query'? 
                  <QueryIcon />
                : <InfoIcon />
                }
            </figure>
            <span className="fr-tooltip-content">
                {textContent}
            </span>
        </span>
    );
};

export default memo(Tooltip);