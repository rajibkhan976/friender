import { memo, useEffect } from "react";
import { InfoIcon, QueryIcon } from "../../assets/icons/Icons";

import '../../assets/scss/component/common/_tooltip.scss'

const Tooltip = ({direction='bottom', textContent='Hello World', type="query",position=null,iconColor=null,iconbackground=null}) => {
    console.log("tghe mouse position",position)
    
    useEffect(() => {
        //console.log("textContent");
    }, [textContent])
    return (
        <span className={'fr-tooltip fr-tooltip-'+direction+` fr-tooltip-${type}`}>
            <figure
                className="fr-tooltip-icon"
            >
                {type === 'query'? 
                  <QueryIcon  color={iconColor} background={iconbackground}/>
                : <InfoIcon />
                }
            </figure>
            <span className="fr-tooltip-content" style={position&&{top:position.y-85,left:position.x-109}}>
                {textContent}
            </span>
        </span>
    );
};

export default memo(Tooltip);