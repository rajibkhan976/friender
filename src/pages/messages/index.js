import { Outlet } from "react-router-dom";
import { createContext, useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchSegments } from "../../actions/MessageAction";

import "./scss/_messages.scss";

export const CampaignContext = createContext();

const Messages = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchSegments());
	}, []);

	return (
		<div className='d-flex justifyContent-start fr-messages w-100'>
			<Outlet />
		</div>
	);
};

export default Messages;
