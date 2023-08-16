import { memo, useEffect } from "react";
import "../../assets/scss/component/form/_checkbox.scss"

const Checkbox = ({checkValue=false, onChangeCheck, checkText="", extraClass=""}) => {
  return (
    <label className={"fr-custom-check "+extraClass}>
      <input 
        type="checkbox" 
        checked={checkValue} 
        onChange={(e) => onChangeCheck(e.target.checked)}
      />
      <span className="checkmark"></span>
      {checkText ? <span className="checkmark-text">{checkText}</span> : ''}
    </label>
  );
}

export default memo(Checkbox);