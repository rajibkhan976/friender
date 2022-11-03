const Button = (props) => {
  return (
      <button className={props.loaderValue ? "btn-primary loaderbtn"  : props.extraClass } disabled={props.disable} >
        {props.loaderValue ?
          <div className="stage">
            <div className="dot-pulse"></div>
          </div>
        :
        props.btnText
        }
        
      </button>
  );
}
export default Button;
