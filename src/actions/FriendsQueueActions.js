import {
	fetchFriendsQueueSettings,
	fetchFriendsQueueRecords,
	storeFriendsQueueSettings,
	uploadFriendsQueueRecordsStepOne,
	uploadFriendsQueueRecordsStepTwo,
} from "../services/friends/FriendsQueueService";
import extensionMethods from "../configuration/extensionAccesories";
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

const initialState = {
	isLoading: false,
	friendsQueueSettings: null,
	savedFriendsQueueSettingsResponse: null,
	uploadedFriendsQueueCsvReport: null,
	uploadedFriendsQueueRecord: null,
	friendsQueueRecords: [
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
	],
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
	async (fbUserId) => {
		const response = await fetchFriendsQueueSettings(fbUserId);
		return response;
	}
);

export const saveFriendsQueueSettings = createAsyncThunk(
	"friendsQueue/saveFriendsQueueSettings",
	async (friendsQueueSettings) => {
		const response = await storeFriendsQueueSettings(friendsQueueSettings);
		fRQueueExtMsgSendHandler(friendsQueueSettings);
		return response;
	}
);

export const uploadFriendsQueueRecordsForReview = createAsyncThunk(
	"friendsQueue/uploadFriendsQueueRecordsForReview",
	async (friendsQueueRecord) => {
		const response = await uploadFriendsQueueRecordsStepOne(
			friendsQueueRecord.csvFile,
			friendsQueueRecord.taskName,
			friendsQueueRecord.fb_user_id
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
		resetUploadedFriendsQueueCsvReport: (state, action) => {
			state.uploadedFriendsQueueCsvReport = action.payload;
		},
	},
	extraReducers: {
		[getFriendsQueueRecords.pending]: (state) => {
			state.isLoading = true;
		},
		[getFriendsQueueRecords.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.friendsQueueRecords = action.payload.data;
		},
		[getFriendsQueueRecords.rejected]: (state) => {
			state.isLoading = false;
		},
		[getFriendsQueueSettings.pending]: (state) => {
			state.isLoading = true;
		},
		[getFriendsQueueSettings.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.friendsQueueSettings = action.payload;
		},
		[getFriendsQueueSettings.rejected]: (state) => {
			state.isLoading = false;
		},
		[saveFriendsQueueSettings.pending]: (state) => {
			state.isLoading = true;
		},
		[saveFriendsQueueSettings.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.savedFriendsQueueSettingsResponse = action.payload;
		},
		[saveFriendsQueueSettings.rejected]: (state) => {
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

export const { resetUploadedFriendsQueueCsvReport } = friendsQueueSlice.actions;

export default friendsQueueSlice.reducer;
