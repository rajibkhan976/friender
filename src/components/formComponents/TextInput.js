
const TextInput = ({label="Enter",onChange,maxlength,value="",required=true, isReadOnly=false}) => {

  return (
    <div className="element-wraper">
      <label>
        {label} 
        {/* <span>{props.labelSubText}</span> */}
      </label>
      <div className="form-field">
        <input
          type="text"
          className="form-control"
          autoComplete="new-password"
          onChange={onChange}
          maxlength={maxlength}
          value={value}
          // onPaste={(e)=>{
          //   e.preventDefault()
          //   return false;
          // }} onCopy={(e)=>{
          //   e.preventDefault()
          //   return false;
          // }}
          required={required}
          readOnly={isReadOnly}
        />
      </div>
    </div>
  );
};


export const TextAreaInput = ({label="Enter",onChange,value="",required=true}) => {

  return (
    <div className="element-wraper">
      <label>
        {label} 
        {/* <span>{props.labelSubText}</span> */}
      </label>
      <div className="form-field">
        <textarea
          type="text"
          className="form-control"
          autoComplete="new-password"
          onChange={onChange}
          value={value}
          // onPaste={(e)=>{
          //   e.preventDefault()
          //   return false;
          // }} onCopy={(e)=>{
          //   e.preventDefault()
          //   return false;
          // }}
          required={required}
        />
      </div>
    </div>
  );
};

export default TextInput;
