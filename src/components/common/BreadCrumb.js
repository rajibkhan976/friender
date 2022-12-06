import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

function BreadCrumb({ links }) {
  return (
    <ul className="breadcrumb">
      {links.map((item, index) => {
        return links.length - 1 === index ? (
          <li key={index}>{item.location}</li>
        ) : (
          <li key={index}>
            <NavLink path={item.link}>{item.location}</NavLink>
          </li>
        );
      })}
    </ul>
  );
}

export default BreadCrumb;
