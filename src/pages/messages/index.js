import { Outlet } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { fetchSegments } from "../../actions/MessageAction";

import "./scss/_messages.scss";

export const CampaignContext = createContext();

const Messages = () => {
	const dispatch = useDispatch();
	const [campaignViewMode, setCampaignViewMode] = useState("list");

	useEffect(() => {
		dispatch(fetchSegments());
	}, []);

	return (
		<div className='d-flex justifyContent-start fr-messages w-100'>
			<CampaignContext.Provider
				value={{ campaignViewMode, setCampaignViewMode }}
			>
				<Outlet />
			</CampaignContext.Provider>
		</div>
	);
};

export default Messages;
