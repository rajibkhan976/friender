const Button = ({loaderValue=false, extraClass="", disable=false, btnText=""}) => {
  return (
      <button className={loaderValue ? "btn-primary loaderbtn"  : extraClass } disabled={disable} >
        {loaderValue ?
          <div className="stage">
            <div className="dot-pulse"></div>
          </div>
        :
        btnText
        }
        
      </button>
  );
}
export default Button;
