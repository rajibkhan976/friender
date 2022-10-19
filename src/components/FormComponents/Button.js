import React from "react";
const Button = (props) => {
  return (
      <button className={props.class}>{props.btnText}</button>
  );
}
export default Button;
