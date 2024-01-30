import React, { memo } from "react";
import CampaignCreateEditLayout from "components/messages/campaigns/CampaignCreateEditLayout";
import CreateCampaignWrapper from "components/messages/campaigns/CreateCampaignWrapper";

const CreateCampaign = () => {
	return (
		<CampaignCreateEditLayout>
			<CreateCampaignWrapper />
		</CampaignCreateEditLayout>
	);
};

export default memo(CreateCampaign);
