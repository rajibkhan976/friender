import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';

function BreadCrumb({ links }) {
  const editingCampaign = useSelector((state) => state.campaign.editingCampaign);
  const [breadLink, setBreadLink] = useState(() => links);

  useEffect(() => {
    if (editingCampaign) {
      const placeholderLink = links?.length && links?.map(link => {
        if (link?.location === editingCampaign?._id) {
          return { ...link, location: `${editingCampaign?.campaign_name}` };
        }
        return link;
      });
      setBreadLink(placeholderLink);
    }
  }, [links, editingCampaign]);

  return (
    <ul className="breadcrumb">
      {breadLink.map((item, index) => {
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
