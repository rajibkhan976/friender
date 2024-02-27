import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import {
	fetchCampaign,
	fetchAllCampaign,
	createOrUpdateCampaignService,
	updateCampaignStatusService,
	addUsersToCampaignService,
	deleteCampaignService,
	fetchCampaignUsers,
	deleteCampaignContactsService
} from "../services/campaigns/CampaignServices";

const initialState = {
	isLoading: false,
	editingCampaign: null,
	selected_campaigns: [],
	activeCampaignContext: null,
	campaignSchedule: [],
	selectedCampaignSchedule: null,
	campaignsArray: [],
	campaignStatusChanges: {},
	campaignsDetails: {},
	// campaignsArray: [
	// 	{
	// 		_id: 1,
	// 		campaign_name: "Now or never",
	// 		created_at: "2023-11-13 09:41:15",
	// 		status: true,
	// 		friends_added: 965,
	// 		friends_pending: 200,
	// 		campaign_end_time: "2023-12-31 09:41:15",
	// 		campaign_label_color: "#C0A9EB", // #C0A9EB,#9FC999,#95D6D4,#E0A8B8,#92B0EA,#D779D9,#CFC778,#8A78CF,#CF7878,#F2C794
	// 		message: "I want you to be my friend",
	// 		message_limit: 20,
	// 		// time_delay:
	// 		schedule: [
	// 			{
	// 				day: "Monday",
	// 				from_time: "09:41:15",
	// 				to_time: "10:41:15",
	// 			},
	// 			{
	// 				day: "Wednesday",
	// 				from_time: "11:41:15",
	// 				to_time: "13:41:15",
	// 			},
	// 			{
	// 				day: "Friday",
	// 				from_time: "15:41:15",
	// 				to_time: "18:41:15",
	// 			},
	// 		],
	// 	},
	// 	{
	// 		_id: 2,
	// 		campaign_name: "Now or never 2",
	// 		created_at: "2023-11-13 09:41:15",
	// 		status: false,
	// 		friends_added: 965,
	// 		friends_pending: 0,
	// 		campaign_end_time: "2023-12-31 09:41:15",
	// 		campaign_label_color: "#C0A9EB", // #C0A9EB,#9FC999,#95D6D4,#E0A8B8,#92B0EA,#D779D9,#CFC778,#8A78CF,#CF7878,#F2C794
	// 		message: "I want you to be my friend",
	// 		message_limit: 20,
	// 		// time_delay:
	// 		schedule: [
	// 			{
	// 				day: "Monday",
	// 				from_time: "09:41:15",
	// 				to_time: "10:41:15",
	// 			},
	// 			{
	// 				day: "Wednesday",
	// 				from_time: "11:41:15",
	// 				to_time: "13:41:15",
	// 			},
	// 			{
	// 				day: "Friday",
	// 				from_time: "15:41:15",
	// 				to_time: "18:41:15",
	// 			},
	// 		],
	// 	},
	// 	{
	// 		_id: 3,
	// 		campaign_name: "Now or never 3",
	// 		created_at: "2023-11-13 09:41:15",
	// 		status: false,
	// 		friends_added: 17,
	// 		friends_pending: 10,
	// 		campaign_end_time: "2023-11-30 09:41:15",
	// 		campaign_label_color: "#C0A9EB", // #C0A9EB,#9FC999,#95D6D4,#E0A8B8,#92B0EA,#D779D9,#CFC778,#8A78CF,#CF7878,#F2C794
	// 		message: "I want you to be my friend",
	// 		message_limit: 20,
	// 		// time_delay:
	// 		schedule: [
	// 			{
	// 				day: "Monday",
	// 				from_time: "09:41:15",
	// 				to_time: "10:41:15",
	// 			},
	// 			{
	// 				day: "Wednesday",
	// 				from_time: "11:41:15",
	// 				to_time: "13:41:15",
	// 			},
	// 			{
	// 				day: "Friday",
	// 				from_time: "15:41:15",
	// 				to_time: "18:41:15",
	// 			},
	// 		],
	// 	},
	// ],
};

export const fetchAllCampaigns = createAsyncThunk(
	"campaigns/getAllCampaigns",
	async () => {
		const res = await fetchAllCampaign();
		// console.log(res);
		return res;
	}
);

export const createCampaign = createAsyncThunk(
	"campaigns/addCampaign",
	async (payload) => {
		const res = await createOrUpdateCampaignService(payload);
		return res;
	}
);

export const updateCampaign = createAsyncThunk(
	"campaigns/updateCampaign",
	async (payload) => {
		const res = await createOrUpdateCampaignService(payload);
		return res;
	}
);

export const updateCampaignStatus = createAsyncThunk(
	"campaigns/updateCampaignStatus",
	async (payload) => {
		const res = await updateCampaignStatusService(payload);
		return { ...res, ...payload };
	}
);

export const fetchCampaignById = createAsyncThunk(
	"campaigns/getCampaign",
	async (payload) => {
		const res = await fetchCampaign(payload);
		return res;
	}
);

export const addUsersToCampaign = createAsyncThunk(
	"campaigns/addUsersToCampaign",
	async (payload) => {
		const res = await addUsersToCampaignService(payload);
		return res;
	}
);

export const deleteCampaign = createAsyncThunk(
	"campaigns/deleteCampaign",
	async (payload) => {
		const res = await deleteCampaignService(payload);
		return { ...res, campaignIds: [...payload] };
	}
);

export const fetchUsers = createAsyncThunk(
	"campaigns/fetchUsers",
	async (payload) => {
		const res = await fetchCampaignUsers(payload);
		return res;
	}
)

export const deleteCampaignContacts = createAsyncThunk(
	"campaigns/deleteCampaignContacts",
	async (payload) => {
		const res = await deleteCampaignContactsService(payload);
		return { ...res, payloadData: [...payload] };
	}
);


export const campaignSlice = createSlice({
	name: "campaigns",
	initialState,
	reducers: {
		updateCampaignContext: (state, action) => {
			state.activeCampaignContext =
				state.activeCampaignContext == action.payload ? null : action.payload;
		},
		updateCampaignsArray: (state, action) => {
			state.campaignsArray = action.payload;
		},
		updateCampaignSchedule: (state, action) => {
			state.campaignSchedule = action.payload;
		},
		updateSelectedCampaignSchedule: (state, action) => {
			state.selectedCampaignSchedule = action.payload;
		},
		updateCampaignDetails: (state, action) => {
			state.campaignsDetails = action.payload;
		},
		syncCampaignStatus: (state) => {
			const statusObj = state.campaignStatusChanges;
			if (Object.keys(statusObj).length > 0) {
				const campaignArr = state.campaignsArray;
				state.campaignsArray = campaignArr.map((item) => {
					if (item.campaign_id in statusObj) {
						item.status = statusObj[item.campaign_id];
					}
					return item;
				})
			}
			state.campaignStatusChanges = {};

		}
	},
	extraReducers: {
		[fetchAllCampaigns.pending]: (state) => {
			state.isLoading = true;
		},
		[fetchAllCampaigns.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.campaignsArray = action?.payload;
		},
		[fetchAllCampaigns.rejected]: (state) => {
			state.isLoading = false;
		},

		[fetchCampaignById.pending]: (state) => {
			state.isLoading = false;
		},
		[fetchCampaignById.fulfilled]: (state, action) => {
			state.isLoading = false;

			// console.log('here');
			state.editingCampaign = action?.payload?.data?.length
				? { ...action?.payload?.data[0], friends: [] }
				: null;
		},
		[fetchCampaignById.rejected]: (state) => {
			state.isLoading = false;
		},

		[createCampaign.pending]: (state) => {
			state.isLoading = false;
		},
		[createCampaign.fulfilled]: (state, action) => {
			// PlaceholderArray id is -> campaign_id..
			// Action payload id is -> _id..
			const placeholderArray = current(state.campaignsArray);
			const actionResponse = { ...action?.payload?.data };
			let newAdd = true;

			if (actionResponse?._id) {
				actionResponse.campaign_id = actionResponse._id;
				delete actionResponse._id;
			}

			placeholderArray.forEach((campaign) => {
				if (campaign?.campaign_id === actionResponse?.campaign_id) {
					newAdd = false;
				}
			});

			if (newAdd) {
				state.campaignsArray = [{ ...actionResponse, friends_added: 0, friends_pending: 0 }, ...state.campaignsArray];
			} else {
				state.campaignsArray = action?.payload?.data
					? placeholderArray.map(
						(el) => el.campaign_id === actionResponse?.campaign_id
					)
					: placeholderArray;
			}

			state.isLoading = false;
		},
		[createCampaign.rejected]: (state) => {
			state.isLoading = false;
		},

		[updateCampaign.pending]: (state) => {
			state.isLoading = false;
		},
		[updateCampaign.fulfilled]: (state, action) => {
			// PlaceholderArray id is -> campaign_id..
			// Action payload id is -> _id..
			const placeholderArray = current(state.campaignsArray);

			// const findThePickedCampaign = placeholderArray.find((arr) => arr._id === action?.payload?.data?._id || arr.campaign_id === action?.payload?.data?._id);
			// console.log("FIND THE PICKED CAMPAIGN -- ", findThePickedCampaign);

			state.campaignsArray = placeholderArray.map((campaign) => {
				if (
					campaign?.campaign_id === action?.payload?.data?._id ||
					campaign?._id === action?.payload?.data?._id
				) {
					return {
						...campaign,
						...action?.payload?.data,
					};
				}
				return campaign;
			});
			state.isLoading = false;
		},
		[updateCampaign.rejected]: (state) => {
			state.isLoading = false;
		},

		[deleteCampaign.pending]: (state) => {
			state.isLoading = true;
		},
		[deleteCampaign.fulfilled]: (state, action) => {
			let placeholderArray = current(state.campaignsArray);

			placeholderArray = placeholderArray.map(array => {
				if (array?._id) {
					return {
						...array,
						campaign_id: array?._id,
					};
				} else {
					return array;
				}
			});

			let idsArr1 = action?.payload?.campaignIds.map(obj => obj.campaignId);
			const filteredArr2 = placeholderArray.filter(obj => !idsArr1.includes(obj.campaign_id));

			state.campaignsArray = filteredArr2
			state.isLoading = false;
		},
		[deleteCampaign.rejected]: (state) => {
			state.isLoading = false;
		},

		[updateCampaignStatus.pending]: (state) => {
			state.isLoading = false;
		},
		[updateCampaignStatus.fulfilled]: (state, action) => {
			let campaignStatusObj = { ...state.campaignStatusChanges }

			if (action?.payload?.campaignId) {
				campaignStatusObj[action.payload.campaignId] = action.payload.campaignStatus;
			}
			state.campaignStatusChanges = campaignStatusObj;
		},
		[updateCampaignStatus.rejected]: (state) => {
			state.isLoading = false;
		},
		[fetchUsers.pending]: (state) => {
			state.isLoading = false;
		},
		[fetchUsers.fulfilled]: (state, action) => {
			const payloadData = action?.payload?.data;
			const filteredPayloadData = payloadData?.length && payloadData?.filter(payload => !payload?.deleted_at);
			state.editingCampaign = { ...state.editingCampaign, friends: [...filteredPayloadData] };
			state.isLoading = false;
		},
		[fetchUsers.rejected]: (state) => {
			state.isLoading = false;
		},
		[deleteCampaignContacts.pending]: (state) => {
			state.isLoading = false;
		},
		[deleteCampaignContacts.fulfilled]: (state, action) => {
			const placeholderArray = current(state.editingCampaign);
			const actionPayloadData = action?.payload?.payloadData;

			const friendFbIds = actionPayloadData?.length && actionPayloadData?.map(obj => obj?.friendFbId);
			const filteredFriendsList = placeholderArray?.friends?.length && placeholderArray?.friends?.filter(obj => !friendFbIds.includes(obj.friendFbId));

			state.editingCampaign = { ...state.editingCampaign, friends: [...filteredFriendsList] };
			state.isLoading = false;
		},
		[deleteCampaignContacts.rejected]: (state) => {
			state.isLoading = false;
		},
	},
});
export const {
	updateCampaignContext,
	updateCampaignsArray,
	updateCampaignSchedule,
	updateSelectedCampaignSchedule,
	updateCampaignDetails,
	syncCampaignStatus
} = campaignSlice.actions;
export default campaignSlice.reducer;
