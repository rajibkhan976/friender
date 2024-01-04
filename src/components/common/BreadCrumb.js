import React from "react";
import { NavLink } from "react-router-dom";

function BreadCrumb({ links }) {
  return (
    <ul className="breadcrumb">
      {links.map((item, index) => {
        return links.length - 1 === index ? (
          <li key={index}>{item.location?.replace('-', ' ')}</li>
        ) : (
          <li key={index}>
            <NavLink to={item.location}>{item.location?.replace('-', ' ')}</NavLink>
          </li>
        );
      })}
    </ul>
  );
}

export default BreadCrumb;
