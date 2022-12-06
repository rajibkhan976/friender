import React from 'react'

function Switch({checked,handleChange}) {
  return (
    <label className="switch">
        <input type="checkbox" checked={checked}
          onChange={handleChange}
/>
        <span className="slider round" />
    </label>)
}

export default Switch
