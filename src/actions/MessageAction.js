import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addNewDMF, addNewSubDMF, deleteDMF, deleteSubDMF, fetchDMFs, prioritySubDMF } from "../services/messages/MessagesServices";

const messageType = localStorage.getItem("fr_messageTabType");
/**@param args messageType="dmf"|"segment"|"group" */
const initialState = {
  isLoading: false,
  messageType: messageType ? messageType : "dmf",
  dmfArray: [],
  segmentsArray: [],
  groupArray: [],
};

export const getDmfList = createAsyncThunk(
  "messages/getDMFs",
  async (payload) => {
    const res = await fetchDMFs(payload);
    // console.log("************res***********",res)
    return res;
  }
);

export const addDmf = createAsyncThunk(
  "messages/addDMF",
  async (payload) => {
    const res = await addNewDMF(payload);
    return res;
  }
)

export const updateDmf = createAsyncThunk(
  "messages/updateDMF",
  async (payload) => {
    const res = await addNewDMF(payload);
    return res;
  }
)

export const addSubDmf = createAsyncThunk(
  "messages/addSubDMF",
  async (payload) => {
    const res = await addNewSubDMF(payload);
    return res;
  }
)

export const deleteDmf = createAsyncThunk(
  "messages/deleteDmf",
  async (payload) => {
    const res = await deleteDMF(payload);
    return res;
  }
)

export const deleteSubDmf = createAsyncThunk(
  "messages/deleteSubDMF",
  async (payload) => {
    const res = await deleteSubDMF(payload);
    return res;
  }
)

export const updateSubPriority = createAsyncThunk(
  "messages/prioritySubDMF",
  async (payload) => {
    const res = await prioritySubDMF(payload);
    return res;
  }
)

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
    }
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
      state.dmfArray = action?.payload?.data ? [...state.dmfArray, action?.payload?.data] : [...state.dmfArray];
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
  }
});
export const { updateMessageType, updatelocalDmf, deleteLocalDmf } = messageSlice.actions;
export default messageSlice.reducer;
