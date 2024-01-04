const Button = ({
  loaderValue=false, 
  extraClass="", 
  disable=false, 
  btnText="",
  clickEv
}) => {
  return (
      <button 
        className={`btn ${extraClass} ${loaderValue ? 'loaderbtn' : ''}`} 
        disabled={disable}
        onClick={e => clickEv ? clickEv(e) : ''}
      >
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
