import React from 'react'

function DropSelector({selects,value,defaultValue , id, handleChange ,height="40px",width="103px",setDisable=false, extraClass }) {
// selects should be array of Object 
// {
//     value:"",
//     label:""
// }

  return (
    <span className={`select-wrapers ${extraClass}`}>
    <select id={id} value={value} defaultValue ={defaultValue} onChange={handleChange} className="selector_box" style={{height:height,width:width}} disabled={setDisable}>
    {selects.map((item,index)=>{return(
        <option value={item.value} key={'fr-select'+index}>{item.label}</option>
    )})}
  </select>
  <span className="select-arrow"></span>
  </span>
  )
}

export default DropSelector
