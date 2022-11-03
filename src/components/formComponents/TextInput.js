const TextInput = (props) => {
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
          placeholder={props.placeholderText}
        />
      </div>
    </div>
  );
};

export default TextInput;
