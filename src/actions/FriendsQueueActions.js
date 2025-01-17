
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
// import { clientDB } from "../app/db";

const initialState = {
	friendRequestSentInsight: null,
	friendsQueueSettings: null,
	friendsQueueRecords: [],
	friendsQueueRecordsLimit: 0,
	friendsQueueRecordsFirstChunkLength: 0,
	friendsQueueRecordsCount: 0,
	friendsQueueErrorRecordsCount: 0,
	isCsvSubmittedForReview: false,
	isChunkedDataFetchedFromApi: false,
	isDataFetchingFromApi: false,
	isFriendsQueueListLoading: false,
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

// export const saveFriendsQueueRecordsInIndexDb = async (
// 	fbUserId,
// 	friendsQueueRecords,
// 	recordCount
// ) => {
// 	try {
// 		await clientDB.friendsQueueRecords.put({
// 			fbId: fbUserId,
// 			friendsQueueData: friendsQueueRecords,
// 			recordCount: recordCount,
// 		});
// 	} catch (error) {
// 		throw new Error(error);
// 	}
// };

export const getNewFriendsQueueRecordsInChunk = createAsyncThunk(
	"friendsQueue/getNewFriendsQueueRecordsInChunk",
	async () => {
		// const fbUserId = localStorage.getItem("fr_default_fb") ?? '';
		// let compiledChunkData = [];

		// const oldData = fbUserId ? await clientDB.friendsQueueRecords
		// 	.where("fbId")
		// 	.equals(fbUserId)
		// 	.first() : {};
		// console.log("oldData", oldData);
		// const { friendsQueueData, recordCount } = oldData;
		// compiledChunkData = friendsQueueData?.length ? [...friendsQueueData] : [];
		// let skip = friendsQueueData?.length ? friendsQueueData?.length : 0;
		// let totalRecordCount = recordCount ? recordCount + 1 : 0;
		// let response = null;

		// if (!totalRecordCount) {
		// 	response = await fetchFriendsQueueRecords(fbUserId, skip);

		// 	if (response && Array.isArray(response?.data)) {
		// 		skip = response?.data?.length;
		// 		totalRecordCount = response?.totalNumberOfRecords;
		// 		response?.data.forEach((item) => {
		// 			compiledChunkData.push(item);
		// 		});
		// 	}
		// }

		// for (let i = skip; i < totalRecordCount; i += skip) {
		// 	response = await fetchFriendsQueueRecords(fbUserId, i);
		// 	if (response && Array.isArray(response?.data)) {
		// 		console.log("newResponse", response);
		// 		skip = response?.data?.length;
		// 		totalRecordCount = response?.totalNumberOfRecords;
		// 		response?.data.forEach((item) => {
		// 			compiledChunkData.push(item);
		// 		});
		// 	}
		// }

		// // saveFriendsQueueRecordsInIndexDb(
		// // 	fbUserId,
		// // 	compiledChunkData,
		// // 	compiledChunkData.length
		// // );

		// return response;
	}
);

export const getAllFriendsQueueRecordsInChunk = createAsyncThunk(
	"friendsQueue/getAllFriendsQueueRecordsInChunk",
	async () => {
		const fbUserId = localStorage.getItem("fr_default_fb");
		const compiledChunkData = [];
		let skip = 0;
		let totalRecordCount = 0;
		let response = null;

		response = await fetchFriendsQueueRecords(fbUserId, skip);

		if (response && Array.isArray(response?.data)) {
			skip = response?.data?.length;
			totalRecordCount = response?.totalNumberOfRecords;
			response?.data.forEach((item) => {
				compiledChunkData.push(item);
			});
		}

		for (let i = skip; i < totalRecordCount; i += skip) {
			response = await fetchFriendsQueueRecords(fbUserId, i);
			if (response && Array.isArray(response?.data)) {
				skip = response?.data?.length;
				totalRecordCount = response?.totalNumberOfRecords;
				response?.data.forEach((item) => {
					compiledChunkData.push(item);
				});
			}
		}

		// saveFriendsQueueRecordsInIndexDb(
		// 	fbUserId,
		// 	compiledChunkData,
		// 	compiledChunkData.length
		// );

		return response;
	}
);

export const getFriendsQueueRecords = createAsyncThunk(
	"friendsQueue/getFriendsQueueRecords",
	async () => {
		const fbUserId = localStorage.getItem("fr_default_fb");
		let skip = 0;

		const response = await fetchFriendsQueueRecords(fbUserId, skip);

		// if (response && response.data) {
		// 	saveFriendsQueueRecordsInIndexDb(
		// 		fbUserId,
		// 		response.data,
		// 		response.totalNumberOfRecords
		// 	);
		// }

		return response;
	}
);

// export const getFriendsQueueRecordsFromIndexDB = createAsyncThunk(
// 	"friendsQueue/getFriendsQueueRecordsFromIndexDB",
// 	async (fbUserId) => {
// 		const response = await clientDB.friendsQueueRecords
// 			.where("fbId")
// 			.equals(fbUserId)
// 			.first();

// 		return response;
// 	}
// );

// export const reorderFriendsQueueRecordsInIndexDB = createAsyncThunk(
// 	"friendsQueue/reorderFriendsQueueRecordsInIndexDB",
// 	async (recordIds) => {
// 		const fbUserId = localStorage.getItem("fr_default_fb");
// 		let oldData = [];

// 		const response = await clientDB.friendsQueueRecords
// 			.where("fbId")
// 			.equals(fbUserId)
// 			.first();

// 		if (
// 			response &&
// 			Array.isArray(response.friendsQueueData) &&
// 			response.friendsQueueData.length
// 		) {
// 			oldData = [...response.friendsQueueData];
// 		}

// 		if (oldData.length && Array.isArray(recordIds) && recordIds.length) {
// 			const sortedOldData = [
// 				...oldData.sort((a, b) => b.order_id - a.order_id),
// 			];

// 			const selectedData = oldData.filter((item) =>
// 				recordIds.includes(item._id)
// 			);

// 			const filteredData = oldData.filter(
// 				(item) => !recordIds.includes(item._id)
// 			);

// 			selectedData.forEach((item) => {
// 				Object.assign(item, {
// 					order_id: sortedOldData[0].order_id + 1,
// 				});
// 			});

// 			selectedData.forEach((item) => {
// 				filteredData.unshift(item);
// 			});

// 			clientDB.friendsQueueRecords.clear();

// 			await clientDB.friendsQueueRecords.put({
// 				fbId: fbUserId,
// 				friendsQueueData: filteredData,
// 				recordCount: filteredData.length,
// 			});
// 		}

// 		const newResponse = await clientDB.friendsQueueRecords
// 			.where("fbId")
// 			.equals(fbUserId)
// 			.first();

// 		return newResponse;
// 	}
// );

export const removeFriendsQueueRecordsFromIndexDB = createAsyncThunk(
	"friendsQueue/removeFriendsQueueRecordsFromIndexDB",
	async (recordIds) => {
		// const fbUserId = localStorage.getItem("fr_default_fb");
		// let oldData = [];

		// const response = await clientDB.friendsQueueRecords
		// 	.where("fbId")
		// 	.equals(fbUserId)
		// 	.first();

		// if (
		// 	response &&
		// 	Array.isArray(response.friendsQueueData) &&
		// 	response.friendsQueueData.length
		// ) {
		// 	oldData = [...response.friendsQueueData];
		// }

		// if (oldData.length && Array.isArray(recordIds) && recordIds.length) {
		// 	oldData = oldData.filter((item) => !recordIds.includes(item._id));

		// 	clientDB.friendsQueueRecords.clear();

		// 	await clientDB.friendsQueueRecords.put({
		// 		fbId: fbUserId,
		// 		friendsQueueData: oldData,
		// 		recordCount: oldData.length,
		// 	});
		// }

		// const newResponse = await clientDB.friendsQueueRecords
		// 	.where("fbId")
		// 	.equals(fbUserId)
		// 	.first();

		// return newResponse;
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
		return { response: response, friendsQueueSettings: friendsQueueSettings };
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
			state.isDataFetchingFromApi = action.payload;
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
		setFriendsQueueErrorRecordsCount: (state, action) => {
			state.friendsQueueErrorRecordsCount = action.payload;
		}
	},
	extraReducers: {
		[getFriendsQueueRecords.pending]: (state) => {
			state.isDataFetchingFromApi = true;
		},
		[getFriendsQueueRecords.fulfilled]: (state, action) => {
			const { data, limit_used, totalNumberOfRecords } = action?.payload ?? {};
			state.isDataFetchingFromApi = false;
			state.friendsQueueRecordsFirstChunkLength = data.length;
			state.friendsQueueRecordsLimit = limit_used;
			state.friendsQueueRecordsCount = totalNumberOfRecords;

			if (data.length > 0) {
				state.friendsQueueErrorRecordsCount = data.filter(queueData => queueData?.is_active === true && queueData?.status === 0)?.length;
			}
		},
		[getFriendsQueueRecords.rejected]: (state) => {
			state.isDataFetchingFromApi = false;
		},
		[getAllFriendsQueueRecordsInChunk.pending]: (state) => {
			state.isDataFetchingFromApi = true;
		},
		[getAllFriendsQueueRecordsInChunk.fulfilled]: (state, action) => {
			state.isDataFetchingFromApi = false;
		},
		[getAllFriendsQueueRecordsInChunk.rejected]: (state) => {
			state.isDataFetchingFromApi = false;
		},
		// [getNewFriendsQueueRecordsInChunk.pending]: (state) => {
		// 	state.isDataFetchingFromApi = true;
		// },
		// [getNewFriendsQueueRecordsInChunk.fulfilled]: (state, action) => {
		// 	state.isDataFetchingFromApi = false;
		// },
		// [getNewFriendsQueueRecordsInChunk.rejected]: (state) => {
		// 	state.isDataFetchingFromApi = false;
		// },
		// [getFriendsQueueRecordsFromIndexDB.pending]: (state) => {
		// 	state.isFriendsQueueListLoading = true;
		// },
		// [getFriendsQueueRecordsFromIndexDB.fulfilled]: (state, action) => {
		// 	const { friendsQueueData } = action?.payload ?? {};
		// 	state.isFriendsQueueListLoading = false;
		// 	state.friendsQueueRecords = friendsQueueData;

		// 	if (friendsQueueData.length > 0) {
		// 		state.friendsQueueErrorRecordsCount = friendsQueueData.filter(queueData => queueData?.is_active === true && queueData?.status === 0)?.length;
		// 	}
		// },
		// [getFriendsQueueRecordsFromIndexDB.rejected]: (state) => {
		// 	state.isFriendsQueueListLoading = false;
		// },
		[removeFriendsQueueRecordsFromIndexDB.pending]: (state) => {
			state.isListLoading = true;
		},
		[removeFriendsQueueRecordsFromIndexDB.fulfilled]: (state, action) => {
			const { friendsQueueData, recordCount } = action?.payload ?? {};
			state.isListLoading = false;
			state.friendsQueueRecords = friendsQueueData;
			state.friendsQueueRecordsCount = recordCount;

			if (friendsQueueData?.length > 0) {
				state.friendsQueueErrorRecordsCount = friendsQueueData.filter(queueData => queueData?.is_active === true && queueData?.status === 0)?.length;
			}
		},
		[removeFriendsQueueRecordsFromIndexDB.rejected]: (state) => {
			state.isListLoading = false;
		},
		// [reorderFriendsQueueRecordsInIndexDB.pending]: (state) => {
		// 	state.isListLoading = true;
		// },
		// [reorderFriendsQueueRecordsInIndexDB.fulfilled]: (state, action) => {
		// 	const { friendsQueueData } = action?.payload ?? {};
		// 	state.isListLoading = false;
		// 	state.friendsQueueRecords = friendsQueueData;
		// },
		// [reorderFriendsQueueRecordsInIndexDB.rejected]: (state) => {
		// 	state.isListLoading = false;
		// },
		[getFriendsRequestSentInsight.pending]: (state) => {
			state.isLoading = true;
		},
		[getFriendsRequestSentInsight.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.friendRequestSentInsight = action?.payload?.count;
		},
		[getFriendsRequestSentInsight.rejected]: (state) => {
			state.isLoading = false;
		},
		[getFriendsQueueSettings.pending]: (state) => {
			state.isLoading = true;
		},
		[getFriendsQueueSettings.fulfilled]: (state, action) => {
			state.isLoading = false;
			localStorage.setItem(
				"fr_queue_settings",
				JSON.stringify(action?.payload?.data)
			);
			state.friendsQueueSettings = action?.payload?.data;
		},
		[getFriendsQueueSettings.rejected]: (state) => {
			state.isLoading = false;
		},
		[popFriendsQueueRecordsFromQueue.pending]: (state) => {
			state.isLoading = true;
		},
		[popFriendsQueueRecordsFromQueue.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.removedRecordsFromFriendsQueueResponse = action?.payload?.data;
		},
		[popFriendsQueueRecordsFromQueue.rejected]: (state) => {
			state.isLoading = false;
		},
		[saveFriendsQueueSettings.pending]: (state) => {
			state.isLoading = true;
		},
		[saveFriendsQueueSettings.fulfilled]: (state, action) => {
			state.isLoading = false;
			const { friendsQueueSettings, response } = action?.payload ?? {};
			console.log(friendsQueueSettings);
			localStorage.setItem(
				"fr_queue_settings",
				JSON.stringify([friendsQueueSettings])
			);
			state.friendsQueueSettings = friendsQueueSettings;
			state.savedFriendsQueueSettingsResponse = response;
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
			if (action.payload?.status === 200)
				state.uploadedFriendsQueueCsvReport = action.payload?.data;
		},
		[uploadFriendsQueueRecordsForReview.rejected]: (state) => {
			state.isCsvSubmittedForReview = false;
		},
		[uploadFriendsQueueRecordsForSaving.pending]: (state) => {
			state.isListLoading = true;
		},
		[uploadFriendsQueueRecordsForSaving.fulfilled]: (state, action) => {
			state.isListLoading = true;
			state.uploadedFriendsQueueRecordResponse = action?.payload ? action?.payload : 0;
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