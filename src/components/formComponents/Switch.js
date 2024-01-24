import { memo, useEffect } from 'react'

function Switch({checked,handleChange,isDisabled=false, upComing=false, handleOnBlur, smallVariant = false}) {
  return (
    <label className={`switch ${smallVariant ? 'switch-sm' : ''}`}>
        <input type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={isDisabled}
          onBlur={handleOnBlur}
/>
        <span className={`slider round ${upComing && 'muted-slider'} ${smallVariant ? 'slider-sm' : ''}`} />
    </label>)
}

export default memo(Switch)
