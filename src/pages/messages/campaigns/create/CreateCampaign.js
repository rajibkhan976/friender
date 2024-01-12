import React, { memo } from 'react';
import CampaignCreateEditLayout from "./../layout/CampaignCreateEditLayout";
import CreateCampaignWrapper from "components/messages/campaigns/CreateCampaignWrapper";

const CreateCampaign = () => {
    // HANDLE SAVED DATA FROM CHILD..
    const handleSavedData = (data) => {
        console.log("DATA -- ", data);
    };

    return (
        <CampaignCreateEditLayout type="CREATE" handleClickSaveForm={handleSavedData}>
            <CreateCampaignWrapper />
        </CampaignCreateEditLayout>
    );
};

export default memo(CreateCampaign);