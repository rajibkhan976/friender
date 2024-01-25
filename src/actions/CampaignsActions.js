import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import {
	fetchCampaign,
	fetchAllCampaign,
	createOrUpdateCampaignService,
	updateCampaignStatusService,
	deleteCampaignService,
} from "../services/campaigns/CampaignServices";

const initialState = {
	isLoading: false,
	editingCampaign: null,
	selected_campaigns: [],
	activeCampaignContext: null,
	campaignSchedule: [],
	selectedCampaignSchedule: null,
	campaignsArray: [],
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
	// 				from_time: "2023-12-10 09:41:15",
	// 				to_time: "2023-12-13 09:41:15",
	// 			},
	// 			{
	// 				day: "Wednesday",
	// 				from_time: "2023-12-10 09:41:15",
	// 				to_time: "2023-12-13 09:41:15",
	// 			},
	// 			{
	// 				day: "Friday",
	// 				from_time: "2023-12-10 09:41:15",
	// 				to_time: "2023-12-13 09:41:15",
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
	// 		// campaign_end_time: '2023-12-31 09:41:15',
	// 		campaign_label_color: "#C0A9EB", // #C0A9EB,#9FC999,#95D6D4,#E0A8B8,#92B0EA,#D779D9,#CFC778,#8A78CF,#CF7878,#F2C794
	// 		message: "I want you to be my friend",
	// 		message_limit: 20,
	// 		// time_delay:
	// 		schedule: [
	// 			{
	// 				day: "Monday",
	// 				from_time: "2023-12-10 09:41:15",
	// 				to_time: "2023-12-13 09:41:15",
	// 			},
	// 			{
	// 				day: "Wednesday",
	// 				from_time: "2023-12-10 09:41:15",
	// 				to_time: "2023-12-13 09:41:15",
	// 			},
	// 			{
	// 				day: "Friday",
	// 				from_time: "2023-12-10 09:41:15",
	// 				to_time: "2023-12-13 09:41:15",
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
	// 				from_time: "2023-12-10 09:41:15",
	// 				to_time: "2023-12-13 09:41:15",
	// 			},
	// 			{
	// 				day: "Wednesday",
	// 				from_time: "2023-12-10 09:41:15",
	// 				to_time: "2023-12-13 09:41:15",
	// 			},
	// 			{
	// 				day: "Friday",
	// 				from_time: "2023-12-10 09:41:15",
	// 				to_time: "2023-12-13 09:41:15",
	// 			},
	// 		],
	// 	},
	// ]
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
	"messages/addCampaign",
	async (payload) => {
		const res = await createOrUpdateCampaignService(payload);
		console.log(res);
		return res;
	}
);

export const updateCampaign = createAsyncThunk(
	"messages/updateCampaign",
	async (payload) => {
		const res = await createOrUpdateCampaignService(payload);
		return res;
	}
);

export const updateCampaignStatus = createAsyncThunk(
	"messages/updateCampaignStatus",
	async (payload) => {
		const res = await updateCampaignStatusService(payload);
		return res;
	}
);

export const fetchCampaignById = createAsyncThunk(
	"messages/getCampaign",
	async (payload) => {
		const res = await fetchCampaign(payload);
		return res;
	}
);

export const deleteCampaign = createAsyncThunk(
	"messages/deleteCampaign",
	async (payload) => {
		const res = await deleteCampaignService(payload);
		return {...res, campaignId: payload[0]?.campaignId};
	}
);

export const campaignSlice = createSlice({
	name: "campaign",
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
	},
	extraReducers: {
		[fetchAllCampaigns.pending]: (state) => {
			state.isLoading = true;
		},
		[fetchAllCampaigns.fulfilled]: (state, action) => {
			state.isLoading = false;
			// console.log("action?.payload", action?.payload);
			state.campaignsArray = action?.payload;
		},
		[fetchAllCampaigns.rejected]: (state) => {
			state.isLoading = false;
		},

		[fetchCampaignById.pending]: (state) => {
			state.isLoading = true;
		},
		[fetchCampaignById.fulfilled]: (state, action) => {
			state.isLoading = false;
			console.log("ACTION PAYLOAD DATA -- ", action?.payload?.data);
			state.editingCampaign = action?.payload?.data?.length
				? action?.payload?.data[0]
				: null;

			console.log("Checking the State -- ", state.editingCampaign);
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

			placeholderArray.forEach((campaign) => {
				if (campaign?.campaign_id === action?.payload?.campaign_id) {
					newAdd = false;
				}
			});

			if (newAdd) {
				state.campaignsArray = [ action?.payload?.data, ...state.campaignsArray];
			} else {
				state.campaignsArray = action?.payload?.data ? placeholderArray.map((el) => el.campaign_id === action.payload.data._id) : placeholderArray;
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
			state.campaignsArray = placeholderArray.map((campaign) => {
				if (campaign?.campaign_id === action?.payload?.data?._id) {
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
			const placeholderArray = current(state.campaignsArray);
			state.campaignsArray = placeholderArray.map((campaign) => {
				if (campaign?.campaign_id === action?.payload?.campaignId) {
					return {
						...campaign,
						campaign_status: false,
					};
				}
				return campaign;
			});
			state.isLoading = false;
		},
		[deleteCampaign.rejected]: (state) => {
			state.isLoading = false;
		},
	},
});
export const {
	updateCampaignContext,
	updateCampaignsArray,
	updateCampaignSchedule,
	updateSelectedCampaignSchedule,
} = campaignSlice.actions;
export default campaignSlice.reducer;
