import React from 'react'

function DropSelector({selects,value, handleChange,height="40px",width="103px",setDisable=false}) {
// selects should be array of Object 
// {
//     value:"",
//     label:""
// }

  return (
    <span className="select-wrapers">
    <select  value={value} onChange={handleChange} className="selector_box" style={{height:height,width:width}} disabled={setDisable}>
    {selects.map((item,index)=>{return(
        <option value={item.value} key={'fr-select'+index}>{item.label}</option>
    )})}
  </select>
  <span className="select-arrow"></span>
  </span>
  )
}

export default DropSelector
