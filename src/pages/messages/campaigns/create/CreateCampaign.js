import React, { memo, useContext, useEffect } from "react";
import CampaignCreateEditLayout from "components/messages/campaigns/CampaignCreateEditLayout";
import CreateCampaignWrapper from "components/messages/campaigns/CreateCampaignWrapper";
import { CampaignContext } from "pages/messages/index";

const CreateCampaign = () => {
	const { setCampaignViewMode } = useContext(CampaignContext);

	useEffect(() => {
		setCampaignViewMode("createCampaign");
	}, []);

	return (
		<CampaignCreateEditLayout>
			<CreateCampaignWrapper />
		</CampaignCreateEditLayout>
	);
};

export default memo(CreateCampaign);
