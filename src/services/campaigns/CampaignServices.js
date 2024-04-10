import axios from "axios"
import config from "../../configuration/config"

let headers = {
	"Content-Type": "application/json",
	Authorization: localStorage.getItem("fr_token"),
};


/**
 * FETCH ALL CAMPAIGNS
 * @returns
 */
export const fetchAllCampaign = () => {
	return new Promise((resolve, reject) => {
		axios
			.get(config.fetchAllCampaignsUrl, { headers: headers })
			.then((res) => {
				// console.log('res >>>>', res?.data?.data);
				resolve(res?.data?.data)
			}).catch((error) => {
				// console.log(error);
				reject(error)
			})
	})
}

/**
 * FETCH SINGLE CAMPAIGN
 * @param {String} campaignId
 * @param {String} fbUserId
 * @returns
 */
export const fetchCampaign = (data) => {
	// console.log('looking for :::', data);
	return new Promise((resolve, reject) => {
		axios
			.get(`${config.fetchCampaignUrl}?fb_user_id=${data?.fbUserId}&campaign_id=${data?.campaignId}`, {
				headers: headers,
			})
			.then((res) => {
				// console.log("res", res);
				resolve(res.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

/**
 * FETCH USERS OF CAMPAIGN..
 * @param {*} data
 * @returns
 */
export const fetchCampaignUsers = async (data) => {
	return new Promise((resolve, reject) => {
		axios.get(`${config.fetchCampaignUsers}?fb_user_id=${data?.fbUserId}&campaign_id=${data?.campaignId}&status=${data?.status}`, {
			headers: headers,
		})
			.then((result) => {
				resolve(result?.data)
			})
			.catch((error) => {
				reject(error);
			});
	})
}

/**
 * CAMPAIGN CREATE/UPDATE SERVICE..
 * @param {Object} newCampaign
 * @returns
 */
export const createOrUpdateCampaignService = (newCampaign) => {
	return new Promise((resolve, reject) => {
		axios
			.post(config.createCampaignUrl, newCampaign, {
				headers: headers,
			})
			.then((res) => {
				resolve(res.data);
			})
			.catch((error) => {
				reject(error?.response?.data ? error.response.data : `Server responded with an error: Invalid Request`);
			});
	});
};

// export const createOrUpdateCampaignService = (newCampaign) => {
// 	return new Promise((resolve, reject) => {
// 		fetch(config.createCampaignUrl, {
// 			method: 'POST',
// 			headers: headers,
// 			body: JSON.stringify(newCampaign),
// 		})
// 			.then((response) => {
// 				if (!response.ok) {
// 					console.log("NOT OKAY -- ", response);
// 					// Check if the response status is not in the range 200-299
// 					throw new Error(`Server responded with an error ${response.statusText}`);
// 				}
// 				return response.json(); // Parse JSON if the response is successful
// 			})
// 			.then((data) => {
// 				console.log("Response data:", data);
// 				resolve(data);
// 			})
// 			.catch((error) => {
// 				console.error("Error during fetch:", error?.response);
// 				reject(error?.response?.data ? error.response.data : error?.message);
// 			});
// 	});
// };


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
				// console.log("res", res);
				resolve(res.data);
			})
			.catch((error) => {
				reject(error?.response?.data ? error.response.data : error.message);
			});
	});
};

export const addUsersToCampaignService = (payload) => {
	return new Promise((resolve, reject) => {
		axios.post(config.addUsersToCampaignUrl, payload, {
			headers: headers,
		}).then((res) => {
			resolve(res.data);
		}).catch((err) => {
			reject(err);
		})

	});
}

/**
 * CAMPAIGN UPDATE SATATUS WITH (campaignId, campaignStatus)..
 * @param {Object} campaignData
 * @returns
 */
export const deleteCampaignService = (campaignData) => {
	return new Promise((resolve, reject) => {
		axios
			.post(config.deleteCampaignUrl, campaignData, {
				headers: headers,
			})
			.then((res) => {
				// console.log("res", res);
				resolve(res.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
};


/**
 * CAMPAIGN UPDATE SATATUS WITH (campaignId, campaignStatus)..
 * @param {Object} campaignData
 * @returns
 */
export const deleteCampaignContactsService = (campaignContactsData) => {
	return new Promise((resolve, reject) => {
		axios
			.post(config.deleteCampaignContactsUrl, campaignContactsData, {
				headers: headers,
			})
			.then((res) => {
				// console.log("RESPONSE FROM SERVICE ==>> ", res);
				resolve(res.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
};
