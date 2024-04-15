import {
	fetchFriendsQueueSettings,
	storeFriendsQueueSettings,
} from "../services/friends/FriendsQueueService";
import * as actionTypes from "./types";

const initialState = {
	friendsQueueSettings: null,
	savedFriendsQueueSettings: null,
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
						type: actionTypes.SAVE_FRIENDS_QUEUE_SETTINGS,
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
		case actionTypes.SAVE_FRIENDS_QUEUE_SETTINGS:
			state.savedFriendsQueueSettings = action.data;
			break;
		default:
			return state;
	}
	return state;
};
