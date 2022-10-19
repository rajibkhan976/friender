import React from "react";
const Checkbox = (props) => {
  return (
  <div className="remember-wraper">
    <label className="check-container d-block">{props.boxText}
      <input type="checkbox" value={props.labelValue} />
      <span className="checkmark"></span>
    </label>
  </div>
  );
}

export default Checkbox;
