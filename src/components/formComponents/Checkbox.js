import { memo, useEffect } from "react";

const Checkbox = ({checkValue=false, onChangeCheck, checkText=""}) => {
  useEffect(() => {
    console.log('checkValue', checkValue);
  }, [checkValue])
  return (
    <label className="fr-custom-check">
      <input 
        type="checkbox" 
        checked={checkValue}
        onChange={(e) => onChangeCheck(e.target.checked)}
      />
      <span className="checkmark"></span>
      {checkText ? <span className="checkmark-text"></span> : ''}
    </label>
  );
}

export default memo(Checkbox);