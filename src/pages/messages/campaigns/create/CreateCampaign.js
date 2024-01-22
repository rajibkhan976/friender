import React, { memo, useContext, useEffect } from "react";
import CampaignCreateEditLayout from "components/messages/campaigns/CampaignCreateEditLayout";
import CreateCampaignWrapper from "components/messages/campaigns/CreateCampaignWrapper";
import { CampaignContext } from "../../index";

const CreateCampaign = () => {
	// HANDLE SAVED DATA FROM CHILD..
	const handleSavedData = (data) => {
		console.log("DATA -- ", data);
	};
	const { setCampaignViewMode } = useContext(CampaignContext);

	useEffect(() => {
		setCampaignViewMode("createCampaign");
	}, []);

	return (
		<CampaignCreateEditLayout
			type='CREATE'
			handleClickSaveForm={handleSavedData}
		>
			<CreateCampaignWrapper />
		</CampaignCreateEditLayout>
	);
};

export default memo(CreateCampaign);
