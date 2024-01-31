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
	return new Promise((resolve, reject) => {
		axios
			.get(`${config.fetchCampaignUrl}?fb_user_id=${data?.fbUserId}&campaign_id=${data?.campaignId}`, {
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
				// console.log('<<<<<<<', res, 'config.createCampaignUrl', config.createCampaignUrl);
				resolve(res.data);
			})
			.catch((error) => {
				// console.log("Catching the error --- ", error);
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

export const addUsersToCampaignService=(payload)=>{
	return new Promise((resolve,reject)=>{
		axios.post(config.addUsersToCampaignUrl,payload,{
			headers: headers,
		}).then((res)=>{
			resolve(res.data);
		}).catch((err)=>{
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
				console.log("res", res);
				resolve(res.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
};