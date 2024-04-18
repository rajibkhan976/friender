import {
	fetchFriendsQueueSettings,
	fetchFriendsQueueRecords,
	moveFriendsQueueRecordsToTop,
	storeFriendsQueueSettings,
	removeFriendsQueueRecordsFromQueue,
	uploadFriendsQueueRecordsStepOne,
	uploadFriendsQueueRecordsStepTwo,
} from "../services/friends/FriendsQueueService";
import extensionMethods from "../configuration/extensionAccesories";
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { friendsQueueRecords } from "../object";

const initialState = {
	isListLoading: false,
	isLoading: false,
	friendsQueueSettings: null,
	savedFriendsQueueSettingsResponse: null,
	uploadedFriendsQueueCsvReport: null,
	uploadedFriendsQueueRecord: null,
	friendsQueueRecords: [],
	//[
	// {
	// 	friendName: "Chenno Styles",
	// 	friendProfilePicture:
	// 		"https://s3.amazonaws.com/dev.friender.io/profile/fbprofilepicture/100000024782683.jpeg",
	// 	friendProfileUrl:
	// 		"https://www.facebook.com/profile.php?id=100000024782683",
	// 	keywords: [
	// 		"Front-end Developer",
	// 		"Marketer",
	// 		"AI & UX",
	// 		"Founder",
	// 		"CEO",
	// 		"CTO",
	// 		"Digital",
	// 		"Co-Founder",
	// 		"Business",
	// 		"Design",
	// 		"Manager",
	// 		"Startup",
	// 	],
	// 	friend_request_sent_message_group: "My group",
	// 	friend_request_accept_message_group: "My group",
	// 	finalSource: "CSV Upload 1",
	// },
	// {
	// 	friendName: "Chenno Styles",
	// 	friendProfilePicture:
	// 		"https://s3.amazonaws.com/dev.friender.io/profile/fbprofilepicture/100000024782683.jpeg",
	// 	friendProfileUrl:
	// 		"https://www.facebook.com/profile.php?id=100000024782683",
	// 	keywords: [
	// 		"Front-end Developer",
	// 		"Marketer",
	// 		"AI & UX",
	// 		"Founder",
	// 		"CEO",
	// 		"CTO",
	// 		"Digital",
	// 		"Co-Founder",
	// 		"Business",
	// 		"Design",
	// 		"Manager",
	// 		"Startup",
	// 	],
	// 	friend_request_sent_message_group: "My group",
	// 	friend_request_accept_message_group: "My group",
	// 	finalSource: "CSV Upload 1",
	// },
	// {
	// 	friendName: "Chenno Styles",
	// 	friendProfilePicture:
	// 		"https://s3.amazonaws.com/dev.friender.io/profile/fbprofilepicture/100000024782683.jpeg",
	// 	friendProfileUrl:
	// 		"https://www.facebook.com/profile.php?id=100000024782683",
	// 	keywords: [
	// 		"Front-end Developer",
	// 		"Marketer",
	// 		"AI & UX",
	// 		"Founder",
	// 		"CEO",
	// 		"CTO",
	// 		"Digital",
	// 		"Co-Founder",
	// 		"Business",
	// 		"Design",
	// 		"Manager",
	// 		"Startup",
	// 	],
	// 	friend_request_sent_message_group: "My group",
	// 	friend_request_accept_message_group: "My group",
	// 	finalSource: "CSV Upload 1",
	// },
	//],
	movedFriendsQueueRecordsToTopResponse: null,
	removedRecordsFromFriendsQueueResponse: null,
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

export const getFriendsQueueRecords = createAsyncThunk(
	"friendsQueue/getFriendsQueueRecords",
	async (fbUserId) => {
		const response = await fetchFriendsQueueRecords(fbUserId);
		return response;
	}
);

export const getFriendsQueueSettings = createAsyncThunk(
	"friendsQueue/getFriendsQueueSettings",
	async () => {
		const response = await fetchFriendsQueueSettings(
			localStorage.getItem("fr_default_fb")
		);
		return response;
	}
);

export const popFriendsQueueRecordsFromQueue = createAsyncThunk(
	"friendsQueue/popFriendsQueueRecordsFromQueue",
	async (friendsQueueRecords) => {
		const response = await removeFriendsQueueRecordsFromQueue(
			friendsQueueRecords
		);
		return response;
	}
);

export const saveFriendsQueueSettings = createAsyncThunk(
	"friendsQueue/saveFriendsQueueSettings",
	async (friendsQueueSettings) => {
		const response = await storeFriendsQueueSettings(
			Object.assign(friendsQueueSettings, {
				fb_user_id: localStorage.getItem("fr_default_fb"),
			})
		);
		fRQueueExtMsgSendHandler(friendsQueueSettings);
		return response;
	}
);

export const reorderFriendsQueueRecordsToTop = createAsyncThunk(
	"friendsQueue/reorderFriendsQueueRecordsToTop",
	async (friendsQueueRecords) => {
		const response = await moveFriendsQueueRecordsToTop(friendsQueueRecords);
		return response;
	}
);

export const uploadFriendsQueueRecordsForReview = createAsyncThunk(
	"friendsQueue/uploadFriendsQueueRecordsForReview",
	async (friendsQueueRecords) => {
		const response = await uploadFriendsQueueRecordsStepOne(
			friendsQueueRecords.csvFile,
			friendsQueueRecords.taskName,
			friendsQueueRecords.fb_user_id
		);
		return response;
	}
);

export const uploadFriendsQueueRecordsForSaving = createAsyncThunk(
	"friendsQueue/uploadFriendsQueueRecordsForSaving",
	async (friendsQueueRecord) => {
		const response = await uploadFriendsQueueRecordsStepTwo(friendsQueueRecord);
		return response;
	}
);

export const friendsQueueSlice = createSlice({
	name: "friendsQueue",
	initialState,
	reducers: {
		resetSavedFriendsQueueSettingsResponse: (state, action) => {
			state.savedFriendsQueueSettingsResponse = action.payload;
		},
		resetFriendsQueueSettings: (state, action) => {
			state.friendsQueueSettings = action.payload;
		},
		resetUploadedFriendsQueueCsvReport: (state, action) => {
			state.uploadedFriendsQueueCsvReport = action.payload;
		},
	},
	extraReducers: {
		[getFriendsQueueRecords.pending]: (state) => {
			state.isListLoading = true;
		},
		[getFriendsQueueRecords.fulfilled]: (state, action) => {
			state.isListLoading = false;
			state.friendsQueueRecords = action.payload.data;
		},
		[getFriendsQueueRecords.rejected]: (state) => {
			state.isListLoading = false;
		},
		[getFriendsQueueSettings.pending]: (state) => {
			state.isLoading = true;
		},
		[getFriendsQueueSettings.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.friendsQueueSettings = action.payload.data;
		},
		[getFriendsQueueSettings.rejected]: (state) => {
			state.isLoading = false;
		},
		[popFriendsQueueRecordsFromQueue.pending]: (state) => {
			state.isLoading = true;
		},
		[popFriendsQueueRecordsFromQueue.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.removedRecordsFromFriendsQueueResponse = action.payload.data;
		},
		[popFriendsQueueRecordsFromQueue.rejected]: (state) => {
			state.isLoading = false;
		},
		[saveFriendsQueueSettings.pending]: (state) => {
			state.isLoading = true;
		},
		[saveFriendsQueueSettings.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.friendsQueueSettings = action.payload;
			state.savedFriendsQueueSettingsResponse = action.payload;
		},
		[saveFriendsQueueSettings.rejected]: (state) => {
			state.isLoading = false;
		},
		[reorderFriendsQueueRecordsToTop.pending]: (state) => {
			state.isLoading = true;
		},
		[reorderFriendsQueueRecordsToTop.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.movedFriendsQueueRecordsToTopResponse = action.payload;
		},
		[reorderFriendsQueueRecordsToTop.rejected]: (state) => {
			state.isLoading = false;
		},
		[uploadFriendsQueueRecordsForReview.pending]: (state) => {
			state.isLoading = true;
		},
		[uploadFriendsQueueRecordsForReview.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.uploadedFriendsQueueCsvReport = action.payload;
		},
		[uploadFriendsQueueRecordsForReview.rejected]: (state) => {
			state.isLoading = false;
		},
		[uploadFriendsQueueRecordsForSaving.pending]: (state) => {
			state.isLoading = true;
		},
		[uploadFriendsQueueRecordsForSaving.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.uploadedFriendsQueueRecord = action.payload;
		},
		[uploadFriendsQueueRecordsForSaving.rejected]: (state) => {
			state.isLoading = false;
		},
	},
});

export const {
	resetFriendsQueueSettings,
	resetSavedFriendsQueueSettingsResponse,
	resetUploadedFriendsQueueCsvReport,
} = friendsQueueSlice.actions;

export default friendsQueueSlice.reducer;
