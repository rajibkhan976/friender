import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

function PageLeftMenuNav({ menus, startMenu }) {
    // const [menuActive, setMenuActive] = useState(startMenu.linkString)

    //startMenu is the starting object from menus
    // menus must be array of object
    // like {
    //     link:"path",
    //     linkString:""
    // }
    return (
        <div className='page-left-menu-nav' style={{ background: '#131314' }}>
            {/* <ul className="nav-bar"> */}
                {menus.map((item, index) => {
                    return (
                        // <li className={`nav-menu ${item.linkString === menuActive ? 'darknav_active' : null}`} key={index} onClick={() => { setMenuActive(item.linkString) }}>
                            <NavLink
                                className={({ isActive }) =>
                                isActive ? 'nav-menu darknav_active' : 'nav-menu'
                              }
                                to={item.links}
                                key={'settings-pg-'+index}
                            >
                                {item.linkString}
                            </NavLink>
                        // </li>

                    )
                })}
            {/* </ul> */}

        </div>
    )
}

export default PageLeftMenuNav
