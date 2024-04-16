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

export const fetchFriendsQueueRecords = async (fbUserId) => {
	try {
		const response = await axios.get(
			`${config.fetchFriendsQueueRecord}?fb_user_id=${fbUserId}`,
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

export const uploadFriendsQueueRecordsStepOne = async (friendsQueueRecord) => {
	try {
		const response = await axios.post(
			config.uploadFriendsQueueRecordStepOne,
			friendsQueueRecord,
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

export const uploadFriendsQueueRecordsStepTwo = async (friendsQueueRecord) => {
	try {
		const response = await axios.post(
			config.uploadFriendsQueueRecordStepTwo,
			friendsQueueRecord,
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
