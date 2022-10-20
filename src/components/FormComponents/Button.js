import React from "react";
const Button = (props) => {
  return (
      <button className={props.class} disabled={props.disable} onClick={()=> props.navigate(props.pageLink)}>{props.btnText}</button>
  );
}
export default Button;
