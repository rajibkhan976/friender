import {
	fetchFriendsQueueSettings,
	fetchFriendsQueueRecords,
	storeFriendsQueueSettings,
	uploadFriendsQueueRecordsStepOne,
	uploadFriendsQueueRecordsStepTwo,
} from "../services/friends/FriendsQueueService";
import * as actionTypes from "./types";
import extensionMethods from "../configuration/extensionAccesories";

const initialState = {
	friendsQueueSettings: null,
	savedFriendsQueueSettingsResponse: null,
	uploadedFriendsQueueCsvReport: null,
	uploadedFriendsQueueRecord: null,
	friendsQueueRecords: [],
};

const fRQueueExtMsgSendHandler = async (data) => {
	console.log("sent fRQueueExtMsgSendHandler", data);

	let payload = {
		frQueueRunning: data?.run_friend_queue,
		requestLimited: data?.request_limited,
		requestLimitValue: data?.request_limit_value,
	};
	const extRes = await extensionMethods.sendMessageToExt({
		action: "fRqueSettingUpdate",
		frLoginToken: localStorage.getItem("fr_token"),
		payload: payload,
	});
	console.log("message res", extRes);
};

export const getFriendsQueueRecords = (fbUserId) => {
	return async (dispatch) => {
		return fetchFriendsQueueRecords(fbUserId)
			.then((response) => {
				if (response) {
					dispatch({
						type: actionTypes.FETCH_FRIENDS_QUEUE_RECORDS,
						data: response.data,
					});
				}
			})
			.catch((error) => error);
	};
};

export const getFriendsQueueSettings = (fbUserId) => {
	return async (dispatch) => {
		return fetchFriendsQueueSettings(fbUserId)
			.then((response) => {
				if (response) {
					dispatch({
						type: actionTypes.FETCH_FRIENDS_QUEUE_SETTINGS,
						data: response.data,
					});
				}
			})
			.catch((error) => error);
	};
};

export const saveFriendsQueueSettings = (friendsQueueSettings) => {
	return async (dispatch) => {
		return storeFriendsQueueSettings(friendsQueueSettings)
			.then((response) => {
				if (response) {
					dispatch({
						type: actionTypes.SAVED_FRIENDS_QUEUE_SETTINGS_RESPONSE,
						data: response.data,
					});
					fRQueueExtMsgSendHandler(friendsQueueSettings);
				}
			})
			.catch((error) => error);
	};
};

export const uploadFriendsQueueRecordsForAssessment = (friendsQueueRecord) => {
	return async (dispatch) => {
		return uploadFriendsQueueRecordsStepOne(friendsQueueRecord)
			.then((response) => {
				if (response) {
					dispatch({
						type: actionTypes.UPLOAD_FRIENDS_QUEUE_RECORDS_STEP_ONE,
						data: response.data,
					});
				}
			})
			.catch((error) => error);
	};
};

export const uploadFriendsQueueRecordsForSaving = (friendsQueueSettings) => {
	return async (dispatch) => {
		return uploadFriendsQueueRecordsStepTwo(friendsQueueSettings)
			.then((response) => {
				if (response) {
					dispatch({
						type: actionTypes.UPLOAD_FRIENDS_QUEUE_RECORDS_STEP_TWO,
						data: response.data,
					});
				}
			})
			.catch((error) => error);
	};
};

export const friendsQueueReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.FETCH_FRIENDS_QUEUE_SETTINGS:
			state.friendsQueueSettings = action.data;
			break;
		case actionTypes.SAVED_FRIENDS_QUEUE_SETTINGS_RESPONSE:
			state.savedFriendsQueueSettingsResponse = action.data;
			break;
		case actionTypes.FETCH_FRIENDS_QUEUE_RECORDS:
			state.friendsQueueRecords = action.data;
			break;
		case actionTypes.UPLOAD_FRIENDS_QUEUE_RECORDS_STEP_ONE:
			state.uploadedFriendsQueueCsvReport = action.data;
			break;
		case actionTypes.UPLOAD_FRIENDS_QUEUE_RECORDS_STEP_TWO:
			state.uploadedFriendsQueueRecord = action.data;
			break;
		default:
			return state;
	}
	return state;
};
