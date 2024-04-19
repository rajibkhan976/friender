import axios from "axios";
import config from "../../configuration/config";

let headers = {
	"Content-Type": "application/json",
};

export const fetchFriendsQueueSettings = async (fbUserId) => {
	try {
		const response = await axios.get(
			`${config.fetchFriendsQueueSettings}?fb_user_id=${fbUserId}`,
			{
				headers: headers,
			}
		);
		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error(
				"There is an issue while fetching friends queue settings. Please contact support."
			);
		}
	} catch (e) {
		if (!typeof e.data === "undefined") {
			throw new Error(e.response.data.message);
		} else if (e.response && e.response.data) {
			throw new Error(e.response.data);
		} else {
			throw new Error(e.message + ". Please contact support.");
		}
	}
};

export const fetchFriendsRequestSentInsight = async (fbUserId, rangeType) => {
	try {
		const response = await axios.get(
			`${config.fetchFriendsRequestSentInsight}?fbUserId=${fbUserId}&rangeType=${rangeType}`,
			{
				headers: headers,
			}
		);
		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error(
				"There is an issue while fetching friend request sent insights. Please contact support."
			);
		}
	} catch (e) {
		if (!typeof e.data === "undefined") {
			throw new Error(e.response.data.message);
		} else if (e.response && e.response.data) {
			throw new Error(e.response.data);
		} else {
			throw new Error(e.message + ". Please contact support.");
		}
	}
};

export const storeFriendsQueueSettings = async (friendsQueueSettings) => {
	try {
		const response = await axios.post(
			config.storeFriendsQueueSettings,
			friendsQueueSettings,
			{ headers: headers }
		);
		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error(
				"There is an issue while storing friends queue settings. Please contact support."
			);
		}
	} catch (e) {
		if (!typeof e.data === "undefined") {
			throw new Error(e.response.data.message);
		} else if (e.response && e.response.data) {
			throw new Error(e.response.data);
		} else {
			throw new Error(e.message + ". Please contact support.");
		}
	}
};

export const fetchFriendsQueueRecords = async (fbUserId, skip) => {
	try {
		const response = await axios.get(
			`${config.fetchFriendsQueueRecord}?fbUserId=${fbUserId}&skip=${skip}`,
			{
				headers: headers,
			}
		);
		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error(
				"There is an issue while fetching friends queue records. Please contact support."
			);
		}
	} catch (e) {
		if (!typeof e.data === "undefined") {
			throw new Error(e.response.data.message);
		} else if (e.response && e.response.data) {
			throw new Error(e.response.data);
		} else {
			throw new Error(e.message + ". Please contact support.");
		}
	}
};

export const uploadFriendsQueueRecordsStepOne = async (
	friendsQueueRecords,
	taskName,
	fb_user_id
) => {
	try {
		const data = new FormData();
		data.append("csvFile", friendsQueueRecords);

		const response = await axios.post(
			`${config.uploadFriendsQueueRecordStepOne}?taskName=${taskName}&fb_user_id=${fb_user_id}`,
			data,
			{ headers: { "Content-Type": "text/csv" } }
		);
		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error(
				"There is an issue while uploading friends queue record. Please contact support."
			);
		}
	} catch (e) {
		if (!typeof e.data === "undefined") {
			throw new Error(e.response.data.message);
		} else if (e.response && e.response.data) {
			throw new Error(e.response.data);
		} else {
			throw new Error(e.message + ". Please contact support.");
		}
	}
};

export const uploadFriendsQueueRecordsStepTwo = async (friendsQueueRecords) => {
	try {
		const response = await axios.post(
			config.uploadFriendsQueueRecordStepTwo,
			friendsQueueRecords,
			{ headers: headers }
		);
		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error(
				"There is an issue while uploading friends queue record. Please contact support."
			);
		}
	} catch (e) {
		if (!typeof e.data === "undefined") {
			throw new Error(e.response.data.message);
		} else if (e.response && e.response.data) {
			throw new Error(e.response.data);
		} else {
			throw new Error(e.message + ". Please contact support.");
		}
	}
};

export const moveFriendsQueueRecordsToTop = async (friendsQueueRecords) => {
	try {
		const response = await axios.post(
			config.moveFriendsQueueRecordsToTop,
			friendsQueueRecords,
			{ headers: headers }
		);
		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error(
				"There is an issue while moving friends queue records to top. Please contact support."
			);
		}
	} catch (e) {
		if (!typeof e.data === "undefined") {
			throw new Error(e.response.data.message);
		} else if (e.response && e.response.data) {
			throw new Error(e.response.data);
		} else {
			throw new Error(e.message + ". Please contact support.");
		}
	}
};

export const removeFriendsQueueRecordsFromQueue = async (
	friendsQueueRecords
) => {
	try {
		const response = await axios.post(
			config.removeFriendsQueueRecordsFromQueue,
			friendsQueueRecords,
			{ headers: headers }
		);
		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error(
				"There is an issue while removing records from friends queue. Please contact support."
			);
		}
	} catch (e) {
		if (!typeof e.data === "undefined") {
			throw new Error(e.response.data.message);
		} else if (e.response && e.response.data) {
			throw new Error(e.response.data);
		} else {
			throw new Error(e.message + ". Please contact support.");
		}
	}
};
