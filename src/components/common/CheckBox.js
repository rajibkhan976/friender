import React from 'react'

function CheckBox({boxType="normal",label="", checked, checkFun }) {
    /**@param arg type="normal|wrraped" */
    
  return (
    <label className={(checked===true) ?"checkbox-wrapper active":"checkbox-wrapper"}> 
     <input
        type="checkbox"
        checked={checked}
        onChange={checkFun}
       
      />
      {/* {console.log("The this particularchecked Value is ",checked )} */}
      <span>{label}</span>
      
    </label>
  )
}

export default CheckBox
