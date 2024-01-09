import { useEffect } from "react";
import "../../assets/scss/component/form/_input.scss"

const NumberInput = ({
  numberValue,
  numberChange,
  numberName,
  hasControl = false,
  setValuation,
  hasPrefix = "",
  extraClass = "extraClass"
}) => {
  useEffect(() => {
    console.log('numberValue', numberValue);
  }, [])
  return (
    <>
      {hasPrefix !== "" ? <span className="number-prefix">{hasPrefix}</span> : ''}
      <input
        type="number"
        name={numberName}
        value={numberValue}
        onInput={e => numberChange(e.nativeEvent.data === "-" ? 1.00 : e.target.value)}
        min='0'
        step="1"
        pattern="^\d*(\.\d{0,2})?$"
        className={extraClass}
      />
      {hasControl &&
        <span
          className="number-control"
        >
          <button className="number-up" onClick={(e) => {
            e.preventDefault();
            setValuation(previousValue => (Number(previousValue) + 1).toFixed(2));
          }}>
            <svg width="33" height="19" viewBox="0 0 33 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 13.6663L16.6667 8.33301L11.3333 13.6663" stroke="#767485" strokeWidth="1.33333" />
            </svg>
          </button>
          <button className="number-down" onClick={(e) => {
            e.preventDefault();
            setValuation(previousValue => Number(previousValue) <= 1 ? 1 : (Number(previousValue) - 1).toFixed(2))
          }}>
            <svg width="33" height="19" viewBox="0 0 33 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 5.33268L16.6667 10.666L11.3333 5.33268" stroke="#767485" strokeWidth="1.33333" />
            </svg>
          </button>
        </span>
      }
    </>
  );
};

export default NumberInput;
