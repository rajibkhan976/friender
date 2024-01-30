import { createPortal } from "react-dom";

const CampaignSchedulerPopup = (props) => {
	const { children } = props;

	return createPortal(children, document.getElementById("root"));
};

export default CampaignSchedulerPopup;
