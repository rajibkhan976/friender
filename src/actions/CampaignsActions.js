import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import {
	fetchClickedCampaign,
	fetchAllCampaign,
	createOrUpdateCampaignService,
	updateCampaignStatusService,
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

export const fetchEditCampaign = createAsyncThunk(
	"messages/getCampaign",
	async (payload) => {
		const res = await fetchClickedCampaign(payload);
		return res;
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
			console.log("action?.payload", action?.payload);
			state.campaignsArray = action?.payload;
		},
		[fetchEditCampaign.pending]: (state) => {
			state.isLoading = true;
		},
		[fetchEditCampaign.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.editingCampaign = action?.payload?.data
				? action?.payload?.data
				: null;
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
