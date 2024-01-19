import axios from "axios";
import config from "../../configuration/config";

let headers = {
	"Content-Type": "application/json",
	Authorization: localStorage.getItem("fr_token"),
};

export const fetchDMFs = () => {
	// console.log('called fetch', config.fetchDmfUrl);
	return new Promise((resolve, reject) => {
		axios
			.get(config.fetchDmfUrl, { headers: headers })
			.then((result) => {
				// console.log('got result');
				resolve(result.data);
			})
			.catch((error) => {
				console.log("error", error);
				reject(error?.response?.data ? error.response.data : error.message);
			});
	});
};

export const addNewDMF = (newDMF) => {
	// console.log("newDMF", newDMF);
	return new Promise((resolve, reject) => {
		axios
			.post(config.addUpdateDmfUrl, newDMF, { headers: headers })
			.then((result) => {
				// console.log('got result');
				resolve(result.data);
			})
			.catch((error) => {
				console.log("error", error);
				reject(error?.response?.data ? error.response.data : error.message);
			});
	});
};

export const addNewSubDMF = (newSubDMF) => {
	console.log("newDMF", newSubDMF);
	return new Promise((resolve, reject) => {
		axios
			.post(config.addUpdateSubDmfUrl, newSubDMF, { headers: headers })
			.then((result) => {
				// console.log('got result', result.data);
				resolve(result.data);
			})
			.catch((error) => {
				console.log("error", error);
				reject(error?.response?.data ? error.response.data : error.message);
			});
	});
};

export const deleteDMF = (deleteDmf) => {
	return new Promise((resolve, reject) => {
		axios
			.post(config.deleteDmfUrl, deleteDmf, { headers: headers })
			.then((result) => {
				// console.log('got deleted', result.data);
				resolve(result.data);
			})
			.catch((error) => {
				console.log("error", error);
				reject(error?.response?.data ? error.response.data : error.message);
			});
	});
};

export const deleteSubDMF = (deleteSubDmf) => {
	return new Promise((resolve, reject) => {
		axios
			.post(config.deleteSubDmfUrl, deleteSubDmf, { headers: headers })
			.then((result) => {
				// console.log('got deleted', result.data);
				resolve(result.data);
			})
			.catch((error) => {
				console.log("error", error);
				reject(error?.response?.data ? error.response.data : error.message);
			});
	});
};

export const prioritySubDMF = (updatePrioritySubDmf) => {
	return new Promise((resolve, reject) => {
		axios
			.post(config.prioritySubDMF, updatePrioritySubDmf, { headers: headers })
			.then((result) => {
				// console.log('got deleted', result.data);
				resolve(result.data);
			})
			.catch((error) => {
				console.log("error", error);
				reject(error?.response?.data ? error.response.data : error.message);
			});
	});
};

export const fetchAllGroups = (pageRef) => {
	const url = pageRef
		? `${config.fetchMessageGroupsUrl}/${pageRef}`
		: `${config.fetchMessageGroupsUrl}/all`;

	return new Promise((resolve, reject) => {
		axios
			.get(`${url}`, { headers: headers })
			.then((res) => {
				resolve(res.data);
			})
			.catch((error) => {
				if (error === "Request failed with status code 500") {
					resolve(error);
				} else {
					reject(error?.response?.data ? error.response.data : error.message);
				}
			});
	});
};

export const fetchAllSegments = (pageRef) => {
	const url = pageRef
		? `${config.fetchMessageSegmentsUrl}/${pageRef}`
		: `${config.fetchMessageSegmentsUrl}/all`;

	return new Promise((resolve, reject) => {
		axios
			.get(`${url}`, { headers: headers })
			.then((res) => {
				resolve(res.data);
			})
			.catch((error) => {
				// console.log("error fount in fetching", err);
				reject(error?.response?.data ? error.response.data : error.message);
			});
	});
};

export const addOneSegment = (newSegment) => {
	return new Promise((resolve, reject) => {
		axios
			.post(config.createMessageSegmentUrl, newSegment, { headers: headers })
			.then((result) => {
				resolve(result?.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export const deleteOneSegment = (groupId) => {
	return new Promise((resolve, reject) => {
		axios
			.post(config.deleteMessageSegmentUrl, groupId, { headers: headers })
			.then((res) => {
				resolve(res.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const addNewSegmentMessage = (newSegmentMessage) => {
	return new Promise((resolve, reject) => {
		axios
			.post(config.addNewMessageSegmentMessageUrl, newSegmentMessage, {
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

export const deleteSegmentMessage = (messageId) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				config.deleteMessageSegmentMessageUrl,
				{
					messageId: messageId,
				},
				{ headers: headers }
			)
			.then((res) => {
				resolve(res?.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export const addOneGroup = (newGroup) => {
	console.log("got new message group", newGroup);
	return new Promise((resolve, reject) => {
		axios
			.post(config.createMessageGroupUrl, newGroup, { headers: headers })
			.then((result) => {
				resolve(result?.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export const deleteOneGroup = (groupId) => {
	return new Promise((resolve, reject) => {
		axios
			.post(config.deleteMessageGroupUrl, groupId, { headers: headers })
			.then((res) => {
				resolve(res.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const addNewGroupMessage = (newGroupMessage) => {
	return new Promise((resolve, reject) => {
		axios
			.post(config.addNewMessageGroupMessageUrl, newGroupMessage, {
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

export const deleteGroupMessage = (messageId) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				config.deleteMessageGroupMessageUrl,
				{
					messageId: messageId,
				},
				{ headers: headers }
			)
			.then((res) => {
				resolve(res?.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

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
			.post(config.createCampaignUrl, newCampaign, {
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