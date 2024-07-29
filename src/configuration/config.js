const env = process.env,
    appAuth = env.REACT_APP_AUTH,
    appEnv = env.REACT_APP_ENV,
    profileService = env.REACT_APP_PROFILE_SERVICE,
    messageService = env.REACT_APP_MESSAGE_SERVICE,
    campaignService = env.REACT_APP_CAMPAIGN_SERVICE;


// console.log("process.env.REACT_APP_AUTH -- ", process.env.REACT_APP_AUTH);  
module.exports = {
	appUrl: process.env.REACT_APP_APP_URL,
	registerUrl:
		"https://" +
		process.env.REACT_APP_AUTH +
		".execute-api.us-east-1.amazonaws.com/" +
		process.env.REACT_APP_ENV +
		"/register",
	checkRegisterEmail:
		`https://${process.env.REACT_APP_AUTH}.execute-api.us-east-1.amazonaws.com/${process.env.REACT_APP_ENV}/check-user-email`,
	loginsUrl:
		"https://" +
		process.env.REACT_APP_AUTH +
		".execute-api.us-east-1.amazonaws.com/" +
		process.env.REACT_APP_ENV +
		"/login",
	forgetpasswordUrl:
		"https://" +
		process.env.REACT_APP_AUTH +
		".execute-api.us-east-1.amazonaws.com/" +
		process.env.REACT_APP_ENV +
		"/forget-password",
	resetpasswordUrl:
		"https://" +
		process.env.REACT_APP_AUTH +
		".execute-api.us-east-1.amazonaws.com/" +
		process.env.REACT_APP_ENV +
		"/reset-password",
	resetuserpasswordUrl:
		"https://" +
		process.env.REACT_APP_AUTH +
		".execute-api.us-east-1.amazonaws.com/" +
		process.env.REACT_APP_ENV +
		"/user-reset-password",
	mysettingSaveUrl:
		"https://" +
		process.env.REACT_APP_PROFILE_SERVICE +
		".execute-api.us-east-1.amazonaws.com/" +
		process.env.REACT_APP_ENV +
		"/save-user-profile-settings",
	onboardingUrl:
		"https://" +
		process.env.REACT_APP_AUTH +
		".execute-api.us-east-1.amazonaws.com/" +
		process.env.REACT_APP_ENV +
		"/user-onbording-step-one",
	// // // resetuserpasswordUrl: "https://"+appAuth+".execute-api.us-east-1.amazonaws.com/"+appEnv+"/user-reset-password",
	// Profile Service
	saveprofileDataUrl:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/store-user-profile",
	fetchprofileDataUrl:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-user-profiles",
	fetchprofileSettingUrl:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-user-profile-settings",
	fetchFriendListUrl:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-user-friendlist",
	fetchFriendListUrlv2:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-user-friendlistv2",
	fetchPendingListv2:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-send-friend-request-log-v2",
	whiteListFriend:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/user-whitelist-friend",
	blockListUserUrl:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/user-blacklist-friend",
	deleteFriend:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/user-delete-friend",
	bulkOperationFriends:
		"https://"+
		profileService +
		".execute-api.us-east-1.amazonaws.com/"+
		appEnv+
		"/friend-list-bulk-operation",
	fetchFriendCount:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/"+
		appEnv+
		"/fetch-contact-count",
	fetchFriendLostUrl:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-lost-friends",
	fetchSendFriendReqUrl:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-send-friend-request-log",
	fetchDiviceHistoryUrl:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-device-information",
	fetchDeleteDiviceUrl:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/delete-device-information",
	storeDeviceInformationUrl:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/store-device-information",
	fetchRequestSettingsUrl:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-friend-request-settings",
	updateDefaultFriendRequestSettings:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/update-friend-request-send-default-settings",
	updateDeviceNameUrl:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/update-device-information",
	deleteDeviceUrl:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/delete-device-information",
	fetchAllPendingFrnds:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-pending-friend-request",
	deletePendingFrndsRequest:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/delete-pending-friend-request-log",
	// Friends Queue Service
	uploadFriendsQueueRecordStepOne:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/upload-friends-queue-records",
	uploadFriendsQueueRecordStepTwo:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/upload-friends-queue-records-step2",
	storeFriendsQueueSettings:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/store-friends-queue-setting",
	fetchFriendsQueueRecord:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-friends-queue-records-portal",
	fetchFriendsQueueRecordv2:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-friend-queue-records-v2",
	fetchFriendsQueueSettings:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-friend-request-queue-setting",
	fetchFriendsRequestSentInsight:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/queue-friend-request-sent-insights",
	moveFriendsQueueRecordsToTop:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/move-to-top",
	removeFriendsQueueRecordsFromQueue:
		"https://" +
		profileService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/remove-friends-queue",
	bulkOperationFriendsQueue:
		"https://"+
		profileService +
		".execute-api.us-east-1.amazonaws.com/"+
		appEnv+
		"/friend-queue-bulk-operation",
	fetchSendableCount:
		"https://"+
		profileService +
		".execute-api.us-east-1.amazonaws.com/"+
		appEnv+
		"/fetch-sendable-count",
	// Messages Service
	fetchDmfUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-dmfs",
	addUpdateDmfUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/store-dmf",
	addUpdateSubDmfUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/store-subdmf",
	deleteDmfUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/delete-dmf",
	deleteSubDmfUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/delete-subdmf",
	prioritySubDMF:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/update-subdmf-priority",
	fetchAllGroupMessagesUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-groups/all",
	fetchGroupByIdUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-group",
	// new message services
	fetchMessageGroupsUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-groups",
	createMessageGroupUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/create-group",
	deleteMessageGroupUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/delete-group",
	addNewMessageGroupMessageUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/create-group-message",
	deleteMessageGroupMessageUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/delete-group-message",
	// new segment message services
	createMessageSegmentUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/create-segment",
	fetchMessageSegmentsUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-segments",
	deleteMessageSegmentUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/delete-segment",
	addNewMessageSegmentMessageUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/create-segment-message",
	deleteMessageSegmentMessageUrl:
		"https://" +
		messageService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/delete-segment-message",
	// campaign services
	fetchAllCampaignsUrl:
		"https://" +
		campaignService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-user-campaigns-v2",
	fetchAllCampaignsCountUrl:
		"https://" +
		campaignService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/count-user-campaigns",
	createCampaignUrl:
		"https://" +
		campaignService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/create-campaign",
	deleteCampaignUrl:
		"https://" +
		campaignService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/delete-campaign",
	updateCampaignStatusUrl:
		"https://" +
		campaignService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/update-campaign-status",
	addUsersToCampaignUrl: `https://${campaignService}.execute-api.us-east-1.amazonaws.com/${appEnv}/add-friends-to-campaign`,
	fetchCampaignUrl:
		"https://" +
		campaignService +
		".execute-api.us-east-1.amazonaws.com/" +
		appEnv +
		"/fetch-campaign",
	fetchCampaignUsers: `https://${campaignService}.execute-api.us-east-1.amazonaws.com/${appEnv}/fetch-campaign-users`,
	fetchCampaignUsersv2: `https://${campaignService}.execute-api.us-east-1.amazonaws.com/${appEnv}/fetch-campaign-users-v2`,
	deleteCampaignContactsUrl: `https://${campaignService}.execute-api.us-east-1.amazonaws.com/${appEnv}/delete-campaign-contacts`,
	deleteCampaignContactsv2: `https://${campaignService}.execute-api.us-east-1.amazonaws.com/${appEnv}/delete-campaign-contacts-v2`,
	kyubiServerCheckUserUrl: `https://app.kyubi.io/api/end-user/get-status`,
	userAlertStatusUpdateUrl: `https://${profileService}.execute-api.us-east-1.amazonaws.com/${appEnv}/update-alert-message-status`,
};
