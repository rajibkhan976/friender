import { useState, useEffect } from "react";
const TextInput = (props) => {
  const [nameEnter, setNameEnter] = useState("");
  useEffect(() => {}, [nameEnter]);
  const handleChangeName = (event) => {
    setNameEnter(event.target.value.trim());
    props.nameEntered(event.target.value.trim());
  };
  return (
    <div className="element-wraper">
      <label>
        {props.labelText} <span>{props.labelSubText}</span>
      </label>
      <div className="form-field">
        <input
          type="text"
          className="form-control"
          autoComplete="new-password"
          onChange={handleChangeName}
          placeholder={props.placeholderText}
          onPaste={(e)=>{
            e.preventDefault()
            return false;
          }} onCopy={(e)=>{
            e.preventDefault()
            return false;
          }}
        />
      </div>
    </div>
  );
};

export default TextInput;
