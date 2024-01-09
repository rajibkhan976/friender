import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import {
	deleteSegmentMessage,
	addNewSegmentMessage,
	deleteOneSegment,
	fetchAllSegments,
	addOneSegment,
	addNewDMF,
	addNewGroupMessage,
	addNewSubDMF,
	addOneGroup,
	deleteDMF,
	deleteGroupMessage,
	deleteOneGroup,
	deleteSubDMF,
	fetchAllGroups,
	fetchDMFs,
	prioritySubDMF,
	fetchClickedCampaign,
} from "../services/messages/MessagesServices";

const messageType = localStorage.getItem("fr_messageTabType");
/**@param args messageType="dmf"|"segment"|"group" */
const initialState = {
	isLoading: false,
	messageType: messageType ? messageType : "dmf",
	dmfArray: [],
	segmentsArray: [],
	groupArray: [],
	campaignsArray: [
		{
			_id: 1,
			campaign_name: "Now or never",
			created_at: "2023-11-13 09:41:15",
			status: true,
			friends_added: 965,
			friends_pending: 200,
			campaign_end_time: "2023-12-31 09:41:15",
			campaign_label_color: "#C0A9EB", // #C0A9EB,#9FC999,#95D6D4,#E0A8B8,#92B0EA,#D779D9,#CFC778,#8A78CF,#CF7878,#F2C794
			message: "I want you to be my friend",
			message_limit: 20,
			// time_delay:
			schedule: [
				{
					day: "Monday",
					from_time: "2023-12-10 09:41:15",
					to_time: "2023-12-13 09:41:15",
				},
				{
					day: "Wednesday",
					from_time: "2023-12-10 09:41:15",
					to_time: "2023-12-13 09:41:15",
				},
				{
					day: "Friday",
					from_time: "2023-12-10 09:41:15",
					to_time: "2023-12-13 09:41:15",
				},
			],
		},
		{
			_id: 2,
			campaign_name: "Now or never 2",
			created_at: "2023-11-13 09:41:15",
			status: false,
			friends_added: 965,
			friends_pending: 0,
			// campaign_end_time: '2023-12-31 09:41:15',
			campaign_label_color: "#C0A9EB", // #C0A9EB,#9FC999,#95D6D4,#E0A8B8,#92B0EA,#D779D9,#CFC778,#8A78CF,#CF7878,#F2C794
			message: "I want you to be my friend",
			message_limit: 20,
			// time_delay:
			schedule: [
				{
					day: "Monday",
					from_time: "2023-12-10 09:41:15",
					to_time: "2023-12-13 09:41:15",
				},
				{
					day: "Wednesday",
					from_time: "2023-12-10 09:41:15",
					to_time: "2023-12-13 09:41:15",
				},
				{
					day: "Friday",
					from_time: "2023-12-10 09:41:15",
					to_time: "2023-12-13 09:41:15",
				},
			],
		},
		{
			_id: 3,
			campaign_name: "Now or never 3",
			created_at: "2023-11-13 09:41:15",
			status: false,
			friends_added: 17,
			friends_pending: 10,
			campaign_end_time: "2023-11-30 09:41:15",
			campaign_label_color: "#C0A9EB", // #C0A9EB,#9FC999,#95D6D4,#E0A8B8,#92B0EA,#D779D9,#CFC778,#8A78CF,#CF7878,#F2C794
			message: "I want you to be my friend",
			message_limit: 20,
			// time_delay:
			schedule: [
				{
					day: "Monday",
					from_time: "2023-12-10 09:41:15",
					to_time: "2023-12-13 09:41:15",
				},
				{
					day: "Wednesday",
					from_time: "2023-12-10 09:41:15",
					to_time: "2023-12-13 09:41:15",
				},
				{
					day: "Friday",
					from_time: "2023-12-10 09:41:15",
					to_time: "2023-12-13 09:41:15",
				},
			],
		},
	],
	editingCampaign: null,
	selected_campaigns: [],
	activeCampaignContext: null,
};

export const getDmfList = createAsyncThunk(
	"messages/getDMFs",
	async (payload) => {
		const res = await fetchDMFs(payload);
		// console.log("************res***********",res)
		return res;
	}
);

export const addDmf = createAsyncThunk("messages/addDMF", async (payload) => {
	const res = await addNewDMF(payload);
	return res;
});

export const updateDmf = createAsyncThunk(
	"messages/updateDMF",
	async (payload) => {
		const res = await addNewDMF(payload);
		return res;
	}
);

export const addSubDmf = createAsyncThunk(
	"messages/addSubDMF",
	async (payload) => {
		const res = await addNewSubDMF(payload);
		return res;
	}
);

export const deleteDmf = createAsyncThunk(
	"messages/deleteDmf",
	async (payload) => {
		const res = await deleteDMF(payload);
		return res;
	}
);

export const deleteSubDmf = createAsyncThunk(
	"messages/deleteSubDMF",
	async (payload) => {
		const res = await deleteSubDMF(payload);
		return res;
	}
);

export const updateSubPriority = createAsyncThunk(
	"messages/prioritySubDMF",
	async (payload) => {
		const res = await prioritySubDMF(payload);
		return res;
	}
);

export const fetchGroups = createAsyncThunk(
	"messages/getAllGroups",
	async (payload) => {
		const res = await fetchAllGroups(payload);
		return res;
	}
);

export const fetchSegments = createAsyncThunk(
	"messages/getAllSegments",
	async (payload) => {
		const res = await fetchAllSegments(payload);
		return res;
	}
);

export const addNewSegment = createAsyncThunk(
	"messages/addNewMessageSegment",
	async (payload) => {
		const res = await addOneSegment(payload);
		// console.log('Response of new Segment: ', res);
		return res;
	}
);

export const deleteSegment = createAsyncThunk(
	"messages/deleteSegment",
	async (payload) => {
		const res = await deleteOneSegment(payload);
		return payload;
	}
);

export const addNewSegmentMessageItem = createAsyncThunk(
	"messages/newSegmentMessage",
	async (payload) => {
		const res = await addNewSegmentMessage(payload);
		return res;
	}
);

export const deleteSegmentItemMessage = createAsyncThunk(
	"messages/deleteMessage",
	async (payload) => {
		const res = await deleteSegmentMessage(payload);
		return res;
	}
);

export const addNewGroup = createAsyncThunk(
	"messages/addNewMessageGroup",
	async (payload) => {
		const res = await addOneGroup(payload);
		console.log("done n dusted", res);
		return res;
	}
);

export const deleteGroup = createAsyncThunk(
	"messages/deleteGroup",
	async (payload) => {
		const res = await deleteOneGroup(payload);
		return res;
	}
);

export const addNewGroupMessageItem = createAsyncThunk(
	"messages/newGroupMessage",
	async (payload) => {
		const res = await addNewGroupMessage(payload);
		return res;
	}
);

export const deleteGroupItemMessage = createAsyncThunk(
	"messages/deleteMessage",
	async (payload) => {
		const res = await deleteGroupMessage(payload);
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

export const messageSlice = createSlice({
	name: "message",
	initialState,
	reducers: {
		updateMessageType: (state, action) => {
			localStorage.setItem("fr_messageTabType", action.payload);
			state.messageType = action.payload;
		},
		updatelocalDmf: (state, action) => {
			console.log("update local", action.payload);
			state.dmfArray = action.payload;
			state.isLoading = false;
		},
		updateCampaignContext: (state, action) => {
			state.activeCampaignContext =
				state.activeCampaignContext == action.payload ? null : action.payload;
		},
		updateCampaignsArray: (state, action) => {
			state.campaignsArray = action.payload;
		},
	},
	extraReducers: {
		[getDmfList.pending]: (state) => {
			state.isLoading = true;
		},
		[getDmfList.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.dmfArray = action?.payload?.data ? action?.payload?.data : [];
		},
		[getDmfList.rejected]: (state) => {
			state.isLoading = false;
		},
		[addDmf.pending]: (state) => {
			state.isLoading = true;
		},
		[addDmf.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.dmfArray = action?.payload?.data
				? [...state.dmfArray, action?.payload?.data]
				: [...state.dmfArray];
			// console.log("action", action.payload);
		},
		[updateDmf.pending]: (state) => {
			state.isLoading = true;
		},
		[updateDmf.rejected]: (state) => {
			state.isLoading = false;
			// console.log('update dmf rejected');
		},
		[addSubDmf.pending]: (state) => {
			state.isLoading = true;
		},
		[addSubDmf.fulfilled]: (state, action) => {
			state.isLoading = false;
			// console.log("action", action.payload);
		},
		[addSubDmf.rejected]: (state) => {
			state.isLoading = false;
		},
		[deleteDmf.pending]: (state) => {
			state.isLoading = true;
		},
		[deleteDmf.fulfilled]: (state, action) => {
			state.isLoading = false;
			// console.log("in delete", action.payload);
		},
		[deleteDmf.rejected]: (state) => {
			state.isLoading = false;
		},
		[deleteSubDmf.pending]: (state) => {
			state.isLoading = true;
		},
		[deleteSubDmf.fulfilled]: (state, action) => {
			state.isLoading = false;
			// console.log("in delete", action.payload);
		},
		[deleteSubDmf.rejected]: (state) => {
			state.isLoading = false;
		},

		[addNewSegment.pending]: (state) => {
			state.isLoading = true;
		},
		[addNewSegment.fulfilled]: (state, action) => {
			const placeholderArray = current(state.segmentsArray);
			let newAdd = true;
			placeholderArray.forEach((el) => {
				if (el._id === action.payload.data._id) {
					newAdd = false;
				}
			});
			// state.segmentsArray = action?.payload?.data ? [action?.payload?.data, ...state.segmentsArray] : [...state.segmentsArray];
			console.log(placeholderArray, action);
			// state.segmentsArray = action?.payload?.data ? placeholderArray.map(el => el._id === action.payload.data._id ? action.payload.data : [el, ...placeholderArray]) : placeholderArray;
			if (newAdd) {
				state.segmentsArray = [action?.payload?.data, ...state.segmentsArray];
			} else {
				state.segmentsArray = action?.payload?.data
					? placeholderArray.map((el) =>
							el._id === action.payload.data._id ? action.payload.data : el
					  )
					: placeholderArray;
			}
			state.isLoading = false;
		},
		[addNewSegment.rejected]: (state) => {
			state.isLoading = false;
		},
		[fetchSegments.pending]: (state) => {
			state.isLoading = true;
		},
		[fetchSegments.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.segmentsArray = action?.payload?.data ? action?.payload?.data : [];
		},
		[fetchSegments.rejected]: (state) => {
			state.isLoading = false;
		},
		[deleteSegment.pending]: (state) => {
			state.isLoading = true;
		},
		[deleteSegment.fulfilled]: (state, action) => {
			const placeholderArray = current(state.segmentsArray);
			state.segmentsArray = placeholderArray?.filter(
				(el) => el._id !== action.payload.segmentId
			);
			state.isLoading = false;
		},
		[deleteSegment.rejected]: (state) => {
			state.isLoading = false;
		},
		[addNewSegmentMessageItem.pending]: (state) => {
			state.isLoading = true;
		},
		[addNewSegmentMessageItem.fulfilled]: (state, action) => {
			state.isLoading = false;
		},
		[addNewSegmentMessageItem.rejected]: (state) => {
			state.isLoading = false;
		},

		[addNewGroup.pending]: (state) => {
			state.isLoading = true;
		},
		[addNewGroup.fulfilled]: (state, action) => {
			state.groupArray = action?.payload?.data
				? [action?.payload?.data, ...state.groupArray]
				: [...state.groupArray];
			state.isLoading = false;
		},
		[addNewGroup.rejected]: (state) => {
			state.isLoading = false;
		},
		[fetchGroups.pending]: (state) => {
			state.isLoading = true;
		},
		[fetchGroups.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.groupArray = action?.payload?.data ? action?.payload?.data : [];
		},
		[fetchGroups.rejected]: (state) => {
			state.isLoading = false;
		},
		[deleteGroup.pending]: (state) => {
			state.isLoading = true;
		},
		[deleteGroup.fulfilled]: (state, action) => {
			state.isLoading = false;
		},
		[deleteGroup.rejected]: (state) => {
			state.isLoading = false;
		},
		[addNewGroupMessageItem.pending]: (state) => {
			state.isLoading = true;
		},
		[addNewGroupMessageItem.fulfilled]: (state, action) => {
			console.log("action", state, action?.payload?.data);
			// state.groupArray = [action.payload.data, ...state.groupArray]
			state.isLoading = false;
		},
		[addNewGroupMessageItem.rejected]: (state) => {
			state.isLoading = false;
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
	updateMessageType,
	updatelocalDmf,
	deleteLocalDmf,
	updateCampaignContext,
	updateCampaignsArray,
} = messageSlice.actions;
export default messageSlice.reducer;
