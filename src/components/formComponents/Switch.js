import { memo } from 'react'

function Switch({checked,handleChange,isDisabled=false, upComing=false, handleOnBlur}) {
  return (
    <label className="switch">
        <input type="checkbox" defaultChecked={checked}
          onChange={handleChange}
          disabled={isDisabled}
          onBlur={handleOnBlur}
/>
        <span className={`slider round ${upComing && 'muted-slider'}`} />
    </label>)
}

export default memo(Switch)
