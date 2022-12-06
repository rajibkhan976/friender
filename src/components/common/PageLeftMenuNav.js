import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

function PageLeftMenuNav({ menus, startMenu }) {
    const [menuActive, setMenuActive] = useState(startMenu.linkString)

    //startMenu is the starting object from menus
    // menus must be array of object
    // like {
    //     link:"path",
    //     linkString:""
    // }
    return (
        <div className='paper page-left-menu-nav'>
            <ul className="nav-bar">
                {menus.map((item, index) => {
                    return (
                        <li className={`nav-menu ${item.linkString === menuActive ? 'darknav_active' : null}`} key={index} onClick={() => { setMenuActive(item.linkString) }}>
                            <NavLink to={item.link}>{item.linkString}
                            </NavLink>
                        </li>

                    )
                })}
            </ul>

        </div>
    )
}

export default PageLeftMenuNav
