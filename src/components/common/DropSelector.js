import {React} from 'react';

function DropSelector({selects,value, handleChange,height="40px",width="103px"}) {
// selects should be array of Object 
// {
//     value:"",
//     label:""
// }

  return (
    <select  value={value} onChange={handleChange} className="selector_box" style={{height:height,width:width}}>
    {selects.map((item,idx)=>{return(
        <option  value={item.value} key={idx}>{item.label}</option>
    )})}
   
  </select>
  )
}

export default DropSelector
