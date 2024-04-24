import {
	fetchFriendsRequestSentInsight,
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
import { clientDB } from "../app/db";

const initialState = {
	friendRequestSentInsight: null,
	friendsQueueSettings: null,
	friendsQueueRecords: [],
	friendsQueueRecordsLimit: 0,
	friendsQueueRecordsFirstChunkLength: 0,
	friendsQueueRecordsCount: 0,
	isCsvSubmittedForReview: false,
	isChunkedDataFetchedFromApi: false,
	isDataFetchedFromApi: false,
	isListLoading: false,
	isLoading: false,
	movedFriendsQueueRecordsToTopResponse: null,
	savedFriendsQueueSettingsResponse: null,
	removedRecordsFromFriendsQueueResponse: null,
	uploadedFriendsQueueCsvReport: null,
	uploadedFriendsQueueRecordResponse: null,
};

export const fRQueueExtMsgSendHandler = async (data) => {
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

export const saveFriendsQueueRecordsInIndexDb = async (
	fbUserId,
	friendsQueueRecords,
	recordCount
) => {
	try {
		await clientDB.friendsQueueRecords.put({
			fbId: fbUserId,
			friendsQueueData: friendsQueueRecords,
			recordCount: recordCount,
		});
	} catch (error) {
		throw new Error(error);
	}
};

export const getFriendsQueueRecordsInChunk = createAsyncThunk(
	"friendsQueue/getFriendsQueueRecordsInChunk",
	async (totalRecordCount, friendsQueueRecordsLimit) => {
		const fbUserId = localStorage.getItem("fr_default_fb");
		const compiledChunkData = [];
		let incrementBy = friendsQueueRecordsLimit;
		let response = null;

		for (let i = 0; i < totalRecordCount; i += incrementBy) {
			response = await fetchFriendsQueueRecords(fbUserId, i);
			if (response && Array.isArray(response.data)) {
				incrementBy = response.data.length;
				response.data.forEach((item) => {
					compiledChunkData.push(item);
				});
			}
		}

		saveFriendsQueueRecordsInIndexDb(
			fbUserId,
			compiledChunkData,
			compiledChunkData.length
		);

		return response;
	}
);

export const getFriendsQueueRecords = createAsyncThunk(
	"friendsQueue/getFriendsQueueRecords",
	async () => {
		const fbUserId = localStorage.getItem("fr_default_fb");
		let skip = 0;

		const response = await fetchFriendsQueueRecords(fbUserId, skip);

		if (response && response.data) {
			saveFriendsQueueRecordsInIndexDb(
				fbUserId,
				response.data,
				response.totalNumberOfRecords
			);
		}

		return response;
	}
);

export const getFriendsQueueRecordsFromIndexDB = createAsyncThunk(
	"friendsQueue/getFriendsQueueRecordsFromIndexDB",
	async (fbUserId) => {
		const response = await clientDB.friendsQueueRecords
			.where("fbId")
			.equals(fbUserId)
			.first();

		return response;
	}
);

export const reorderFriendsQueueRecordsInIndexDB = createAsyncThunk(
	"friendsQueue/reorderFriendsQueueRecordsInIndexDB",
	async (recordIds) => {
		const fbUserId = localStorage.getItem("fr_default_fb");
		let oldData = [];

		const response = await clientDB.friendsQueueRecords
			.where("fbId")
			.equals(fbUserId)
			.first();

		if (
			response &&
			Array.isArray(response.friendsQueueData) &&
			response.friendsQueueData.length
		) {
			oldData = [...response.friendsQueueData];
		}

		if (oldData.length && Array.isArray(recordIds) && recordIds.length) {
			const sortedOldData = [
				...oldData.sort((a, b) => b.order_id - a.order_id),
			];

			const selectedData = oldData.filter((item) =>
				recordIds.includes(item._id)
			);

			const filteredData = oldData.filter(
				(item) => !recordIds.includes(item._id)
			);

			selectedData.forEach((item) => {
				Object.assign(item, {
					order_id: sortedOldData[0].order_id + 1,
				});
			});

			selectedData.forEach((item) => {
				filteredData.unshift(item);
			});

			clientDB.friendsQueueRecords.clear();

			await clientDB.friendsQueueRecords.put({
				fbId: fbUserId,
				friendsQueueData: filteredData,
				recordCount: filteredData.length,
			});
		}

		const newResponse = await clientDB.friendsQueueRecords
			.where("fbId")
			.equals(fbUserId)
			.first();

		return newResponse;
	}
);

export const removeFriendsQueueRecordsFromIndexDB = createAsyncThunk(
	"friendsQueue/removeFriendsQueueRecordsFromIndexDB",
	async (recordIds) => {
		const fbUserId = localStorage.getItem("fr_default_fb");
		let oldData = [];

		const response = await clientDB.friendsQueueRecords
			.where("fbId")
			.equals(fbUserId)
			.first();

		if (
			response &&
			Array.isArray(response.friendsQueueData) &&
			response.friendsQueueData.length
		) {
			oldData = [...response.friendsQueueData];
		}

		if (oldData.length && Array.isArray(recordIds) && recordIds.length) {
			oldData = oldData.filter((item) => !recordIds.includes(item._id));

			clientDB.friendsQueueRecords.clear();

			await clientDB.friendsQueueRecords.put({
				fbId: fbUserId,
				friendsQueueData: oldData,
				recordCount: oldData.length,
			});
		}

		const newResponse = await clientDB.friendsQueueRecords
			.where("fbId")
			.equals(fbUserId)
			.first();

		return newResponse;
	}
);

export const getFriendsRequestSentInsight = createAsyncThunk(
	"friendsQueue/getFriendsRequestSentInsight",
	async (rangeType) => {
		const response = await fetchFriendsRequestSentInsight(
			localStorage.getItem("fr_default_fb"),
			rangeType
		);
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
		resetIsCsvSubmittedForReview: (state, action) => {
			state.isCsvSubmittedForReview = action.payload;
		},
		resetIsChunkedDataFetchedFromApi: (state, action) => {
			state.isChunkedDataFetchedFromApi = action.payload;
		},
		resetIsDataFetchedFromApi: (state, action) => {
			state.isDataFetchedFromApi = action.payload;
		},
		resetFriendsQueueSettings: (state, action) => {
			state.friendsQueueSettings = action.payload;
		},
		resetFriendsQueueRecordsMetadata: (state, action) => {
			const { firstChunkLength, limitUsed, totalCount } = action.payload;
			state.friendsQueueRecordsFirstChunkLength = firstChunkLength;
			state.friendsQueueRecordsLimit = limitUsed;
			state.friendsQueueRecordsCount = totalCount;
		},
		resetSavedFriendsQueueSettingsResponse: (state, action) => {
			state.savedFriendsQueueSettingsResponse = action.payload;
		},
		resetUploadedFriendsQueueCsvReport: (state, action) => {
			state.uploadedFriendsQueueCsvReport = action.payload;
		},
		resetUploadedFriendsQueueRecordResponse: (state, action) => {
			state.uploadedFriendsQueueRecordResponse = action.payload;
		},
	},
	extraReducers: {
		[getFriendsQueueRecords.pending]: (state, action) => {
			state.isDataFetchedFromApi = false;
		},
		[getFriendsQueueRecords.fulfilled]: (state, action) => {
			const { data, limit_used, totalNumberOfRecords } = action.payload;
			state.isDataFetchedFromApi = true;
			state.friendsQueueRecordsFirstChunkLength = data.length;
			state.friendsQueueRecordsLimit = limit_used;
			state.friendsQueueRecordsCount = totalNumberOfRecords;
		},
		[getFriendsQueueRecords.rejected]: (state) => {
			state.isDataFetchedFromApi = false;
		},
		[getFriendsQueueRecordsInChunk.pending]: (state) => {
			state.isChunkedDataFetchedFromApi = false;
		},
		[getFriendsQueueRecordsInChunk.fulfilled]: (state, action) => {
			state.isChunkedDataFetchedFromApi = true;
		},
		[getFriendsQueueRecordsInChunk.rejected]: (state) => {
			state.isChunkedDataFetchedFromApi = false;
		},
		[getFriendsQueueRecordsFromIndexDB.pending]: (state) => {
			state.isListLoading = true;
		},
		[getFriendsQueueRecordsFromIndexDB.fulfilled]: (state, action) => {
			const { friendsQueueData } = action.payload;
			state.isListLoading = false;
			state.friendsQueueRecords = friendsQueueData;
		},
		[getFriendsQueueRecordsFromIndexDB.rejected]: (state) => {
			state.isListLoading = false;
		},
		[removeFriendsQueueRecordsFromIndexDB.pending]: (state) => {
			state.isListLoading = true;
		},
		[removeFriendsQueueRecordsFromIndexDB.fulfilled]: (state, action) => {
			const { friendsQueueData, recordCount } = action.payload;
			state.isListLoading = false;
			state.friendsQueueRecords = friendsQueueData;
			state.friendsQueueRecordsCount = recordCount;
		},
		[removeFriendsQueueRecordsFromIndexDB.rejected]: (state) => {
			state.isListLoading = false;
		},
		[reorderFriendsQueueRecordsInIndexDB.pending]: (state) => {
			state.isListLoading = true;
		},
		[reorderFriendsQueueRecordsInIndexDB.fulfilled]: (state, action) => {
			const { friendsQueueData } = action.payload;
			state.isListLoading = false;
			state.friendsQueueRecords = friendsQueueData;
		},
		[reorderFriendsQueueRecordsInIndexDB.rejected]: (state) => {
			state.isListLoading = false;
		},
		[getFriendsRequestSentInsight.pending]: (state) => {
			state.isLoading = true;
		},
		[getFriendsRequestSentInsight.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.friendRequestSentInsight = action.payload.count;
		},
		[getFriendsRequestSentInsight.rejected]: (state) => {
			state.isLoading = false;
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
			state.isCsvSubmittedForReview = true;
		},
		[uploadFriendsQueueRecordsForReview.fulfilled]: (state, action) => {
			state.isCsvSubmittedForReview = false;
			state.uploadedFriendsQueueCsvReport = action.payload;
		},
		[uploadFriendsQueueRecordsForReview.rejected]: (state) => {
			state.isCsvSubmittedForReview = false;
		},
		[uploadFriendsQueueRecordsForSaving.pending]: (state) => {
			state.isListLoading = true;
		},
		[uploadFriendsQueueRecordsForSaving.fulfilled]: (state, action) => {
			state.isListLoading = true;
			state.uploadedFriendsQueueRecordResponse = action.payload;
		},
		[uploadFriendsQueueRecordsForSaving.rejected]: (state) => {
			state.isListLoading = false;
		},
	},
});

export const {
	resetIsCsvSubmittedForReview,
	resetIsChunkedDataFetchedFromApi,
	resetIsDataFetchedFromApi,
	resetFriendsQueueSettings,
	resetFriendsQueueRecordsMetadata,
	resetSavedFriendsQueueSettingsResponse,
	resetUploadedFriendsQueueCsvReport,
	resetUploadedFriendsQueueRecordResponse,
} = friendsQueueSlice.actions;

export default friendsQueueSlice.reducer;
