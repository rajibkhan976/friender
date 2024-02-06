import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import {
	fetchCampaign,
	fetchAllCampaign,
	createOrUpdateCampaignService,
	updateCampaignStatusService,
	addUsersToCampaignService,
	deleteCampaignService,
	fetchCampaignUsers,
} from "../services/campaigns/CampaignServices";

const initialState = {
	isLoading: false,
	editingCampaign: null,
	selected_campaigns: [],
	activeCampaignContext: null,
	campaignSchedule: [],
	selectedCampaignSchedule: null,
	campaignsArray: [],
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
		// console.log(res);
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
		// console.log(res);
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
	"messages/deleteCampaign",
	async (payload) => {
		const res = await deleteCampaignService(payload);
		// console.log('res', res, 'payload', payload);
		return { ...res, campaignIds: [...payload] };
	}
);

export const fetchUsers = createAsyncThunk(
	"messages/fetchUsers",
	async (payload) => {
		const res = await fetchCampaignUsers(payload)
		// console.log('res fetchUsers', res);
		return res;
	}
)

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
			let newAdd = true;

			console.log("PLACEHOLDER ARRAY -- ", placeholderArray);
			console.log("ACTION PAYLOAD -- ", action?.payload?.data);

			placeholderArray.forEach((campaign) => {
				if (campaign?.campaign_id === action?.payload?.data?._id) {
					newAdd = false;
				}
			});

			if (newAdd) {
				state.campaignsArray = [{ ...action?.payload?.data, friends_added: 0, friends_pending: 0 }, ...state.campaignsArray];
			} else {
				state.campaignsArray = action?.payload?.data
					? placeholderArray.map(
						(el) => el.campaign_id === action.payload.data._id
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

			// console.log("PLACEHOLDER ARRAY FOR THIS ONE -- ", placeholderArray);
			// console.log("ACTION.PAYLOAD.DATA -- ", action?.payload?.data);

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
			// return filteredArr2;

			// console.log("idsArr1 -- ", idsArr1);
			// console.log("THE PLACEHOLDER ARRAY - ", placeholderArray);
			// console.log('filteredArr2 -- ', filteredArr2);

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
			const placeholderArray = current(state.campaignsArray);

			state.campaignsArray = placeholderArray.map((campaign) => {
				if (campaign?.campaign_id === action?.payload?.campaignId) {
					return {
						...campaign,
						status: action?.payload?.campaignStatus,
					};
				}
				return campaign;
			});
		},
		[updateCampaignStatus.rejected]: (state) => {
			state.isLoading = false;
		},
		[fetchUsers.pending]: (state) => {
			state.isLoading = false
		},
		[fetchUsers.fulfilled]: (state, action) => {
			state.editingCampaign = { ...state.editingCampaign, friends: [...action?.payload?.data] }
			state.isLoading = false
		},
		[fetchUsers.rejected]: (state) => {
			state.isLoading = false
		},
	},
});
export const {
	updateCampaignContext,
	updateCampaignsArray,
	updateCampaignSchedule,
	updateSelectedCampaignSchedule,
	updateCampaignDetails,
} = campaignSlice.actions;
export default campaignSlice.reducer;
