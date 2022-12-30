import React, {memo, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { DragHoldIcon, FileDocIcon } from "../../../assets/icons/Icons";

const Card = (props) => {
  const renderCount=useRef(0)
  const [previous, setPrevious] = useState(0);
  const [colorSt,setColor]=useState(props.color)
  const bgColorArr=["#ee37ff1e","#ff8f6b1e","#ff906b1e","#605bbf1e","#26bfe21e"]
  const iconColorArr=["#ee37ff","#ff8f6b","#ff906b","#605bbf","#26bfe2"]
  
    let ColorIndex=Math.floor(Math.random() * 4) + 1
    
    useEffect(()=>{
      
      setPrevious(previous+1)
      renderCount.current=renderCount.current+1;
      
    },[])
  
  return (
    <div className={`subdmf_card ${ props.active&&"active"} ${props?.item?.is_default && props?.item?.is_default === 1 && "default"}`}>
      <div className="subdmf_card_icons">
        <figure className="dragable-item-dots">
          <DragHoldIcon />
        </figure>        
        <span className="dragable-file" style={{background:`${props.color+"1e"}`}}><FileDocIcon  fillColor={props.color}/></span>
        
      </div>{" "}
      <div className="dragable-item-infos">
        <h4>{props?.item?.subdmf_name}</h4>
        <p>{props?.item?.subdmf_content.length > 29 ? props?.item?.subdmf_content.slice(0, 30).concat("...") : props?.item?.subdmf_content}</p>
      </div>
    </div>
  );
};

Card.propTypes = {
  item: PropTypes.object,
};

export default memo(Card);

