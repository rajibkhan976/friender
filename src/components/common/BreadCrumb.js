import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';

function BreadCrumb({ links }) {
  const params = useParams();
  const editingCampaign = useSelector((state) => state.campaign.editingCampaign);
  const campaignsArray = useSelector((state) => state.campaign.campaignsArray);
  const [breadLink, setBreadLink] = useState(() => links);

  const addBreadLinkName = (links, campaign) => {
    const placeholderLink = links?.length && links?.map(link => {
      if (link?.location === campaign?._id || link?.location === campaign?.campaign_id) {
        return { ...link, location: `${campaign?.campaign_name}` };
      }
      return link;
    });
    setBreadLink(placeholderLink);
  };

  useEffect(() => {
    if (editingCampaign) {
      addBreadLinkName(links, editingCampaign);

    } else {
      if (params?.campaignId) {
        const placeholderCampaign = campaignsArray?.length && campaignsArray?.find(camp => camp?.campaign_id === params?.campaignId);
        if (placeholderCampaign) {
          addBreadLinkName(links, placeholderCampaign);
        }
      }
    }
  }, [links, editingCampaign, params, campaignsArray]);

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
