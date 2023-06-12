import React, { useState, useEffect, useRef } from "react";
import { 
   Cross2
  } from '../../assets/icons/Icons';
import "../../assets/scss/component/common/_kewords.scss"

const Keywords = (props) => {
  const [reFrndngInput2, setReFrndngInput2] = useState();
 // const [reFriendSaveActive, setReFriendSaveActive] = useState(false);
 

  return (
    <div className="inputBlock">
                        <div className="keywords">CEO <button className="cross"><Cross2/></button></div>
                        <div className="keywords">SassCEO  <button className="cross"><Cross2/></button></div>
                        <div className="keywords">Scss  <button className="cross"><Cross2/></button></div><div className="keywords">CEO <button className="cross"><Cross2/></button></div>
                        <div className="keywords">SassCEO  <button className="cross"><Cross2/></button></div>
                        <div className="keywords">Scss  <button className="cross"><Cross2/></button></div><div className="keywords">CEO <button className="cross"><Cross2/></button></div>
                        <div className="keywords">SassCEO  <button className="cross"><Cross2/></button></div>
                        <div className="keywords">Scss  <button className="cross"><Cross2/></button></div><div className="keywords">CEO <button className="cross"><Cross2/></button></div>
                        <div className="keywords">SassCEO  <button className="cross"><Cross2/></button></div>
                        <div className="keywords">Scss  <button className="cross"><Cross2/></button></div><div className="keywords">CEO <button className="cross"><Cross2/></button></div>
                        <div className="keywords">SassCEO  <button className="cross"><Cross2/></button></div>
                        <div className="keywords">Scss  <button className="cross"><Cross2/></button></div><div className="keywords">CEO <button className="cross"><Cross2/></button></div>
                        <div className="keywords">SassCEO  <button className="cross"><Cross2/></button></div>
                        <div className="keywords">Scss  <button className="cross"><Cross2/></button></div>
                        <textarea
                          className="keyword-input"
                          placeholder= "Add keyword"
                          value={reFrndngInput2}
                          onChange={(e) => {
                            setReFrndngInput2(e.target.value); 
                          }}
                          onMouseDown = {props.onMouseDownHandler}
                          onBlur={props.onBlurHandler}
                        />
                      </div>
  );
}
export default Keywords;