import axios from "axios"
import config from "../../configuration/config"

let headers = {
	"Content-Type": "application/json",
	Authorization: localStorage.getItem("fr_token"),
};

export const fetchAllCampaign = () => {
    return new Promise((resolve, reject) => {
        axios
            .get(config.fetchAllCampaigns, { headers: headers })
            .then((res) => {
                // console.log('res >>>>', res?.data?.data);
                resolve(res?.data?.data)
            }).catch((error) => {
                // console.log(error);
                reject(error)
            })
    })
}

export const fetchClickedCampaign = (campaignId) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			let result;

			if (campaignId == 1) {
				result = {
					data: {
						_id: 1,
						friends: [
							{
								friendName: "Friend in ID 1",
								friendProfilePicture:
									"https://s3.amazonaws.com/dev.friender.io/profile/fbprofilepicture/100001469604723.jpeg",
								friendProfileUrl:
									"https://www.facebook.com/profile.php?id=100001469604723",
								groupName: "KFC Group Rocksssss.......",
								groupUrl: "https://www.facebook.com/groups/kfcrockss",
								keywords: [
									{
										selected_keywords: ["FIFA", "soccer", "football"],
										matchedKeyword: "FIFA",
									},
								],
								matchedKeyword: "FIFA, soccer, football",
								status: "Successful",
								finalSource: "Sync",
								created_at: "2014-11-13 09:41:15",
								updated_at: "2023-11-13 09:41:15",
								message: "Message Group 1",
							},
						],
					},
				};
			} else if (campaignId == 2) {
				result = {
					data: {
						_id: 2,
						friends: [
							{
								friendName: "Friend in ID 2",
								friendProfilePicture:
									"https://s3.amazonaws.com/dev.friender.io/profile/fbprofilepicture/100001469604723.jpeg",
								friendProfileUrl:
									"https://www.facebook.com/profile.php?id=100001469604723",
								groupName: "KFC Group Rocksssss.......",
								groupUrl: "https://www.facebook.com/groups/kfcrockss",
								keywords: [
									{
										selected_keywords: ["FIFA", "gamse", "PC"],
										matchedKeyword: "FIFA, PC",
									},
								],
								matchedKeyword: "FIFA, games, PC",
								status: "Pending",
								finalSource: "Sync",
								created_at: "2014-11-13 09:41:15",
								updated_at: "2023-11-13 09:41:15",
								message: "Message Group 2",
							},
						],
					},
				};
			} else {
				result = {
					data: {
						_id: 3,
						friends: [
							{
								friendName: "Friend in ID 3",
								friendProfilePicture:
									"https://s3.amazonaws.com/dev.friender.io/profile/fbprofilepicture/100001469604723.jpeg",
								friendProfileUrl:
									"https://www.facebook.com/profile.php?id=100001469604723",
								groupName: "KFC Group Rocksssss.......",
								groupUrl: "https://www.facebook.com/groups/kfcrockss",
								keywords: [
									{
										selected_keywords: ["FIFA", "gamse", "PC"],
										matchedKeyword: "PC",
									},
								],
								matchedKeyword: "FIFA",
								finalSource: "Sync",
								status: "Successful",
								created_at: "2014-11-13 09:41:15",
								updated_at: "2023-11-13 09:41:15",
							},
						],
					},
				};
			}

			resolve(result);
		}, 1000);
	});
};

/**
 * CAMPAIGN CREATE/UPDATE SERVICE..
 * @param {Object} newCampaign 
 * @returns 
 */
export const createOrUpdateCampaignService = (newCampaign) => {
	return new Promise((resolve, reject) => {
		axios
			.post(config.createCampaign, newCampaign, {
				headers: headers,
			})
			.then((res) => {
				console.log('<<<<<<<', res, 'config.createCampaignUrl', config.createCampaignUrl);
				resolve(res.data);
			})
			.catch((error) => {
				console.log("Catching the error --- ", error);
				reject(error);
			});
	});
};

/**
 * CAMPAIGN UPDATE SATATUS WITH (campaignId, campaignStatus)..
 * @param {Object} campaignData 
 * @returns 
 */
export const updateCampaignStatusService = (campaignData) => {
	return new Promise((resolve, reject) => {
		axios
			.post(config.updateCampaignStatusUrl, campaignData, {
				headers: headers,
			})
			.then((res) => {
				console.log("res", res);
				resolve(res.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
};