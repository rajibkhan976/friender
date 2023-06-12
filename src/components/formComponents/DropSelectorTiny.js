import React from 'react'

function DropSelectorTiny({selects,value, handleChange,height="30px",width="90px",setDisable=false}) {
// selects should be array of Object 
// {
//     value:"",
//     label:""
// }

  return (
    <span className="select-wrapers">
    <select  value={value} onChange={handleChange} className="tiny_selector_box" style={{height:height,width:width}} disabled={setDisable}>
    {selects.map((item,index)=>{return(
        <option value={item.value} key={'fr-select'+index}>{item.label}</option>
    )})}
  </select>
  <span className="select-arrow_small"></span>
  </span>
  )
}

export default DropSelectorTiny
