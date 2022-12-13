import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchFriendList } from "../services/friends/FriendListServices";
import { fetchFriendLost } from "../services/friends/FriendListServices";
const initialState = {
  isLoading: true,
  current_fb_id: null,
  fb_data: null,
  current_friend_list: [],
};

export const getFriendList = createAsyncThunk(
  "facebook/getFriendList",
  async (payload) => {
    const res = await fetchFriendList(payload);
    console.log("************res***********",res)
    return res;
  }
);

export const getFriendLost = createAsyncThunk(
  "facebook/getFriendLost",
  async (payload) => {
    const res = await fetchFriendLost(payload);
    return res;
  }
);

const fbSlice = createSlice({
  name: "facebook",
  initialState,
  reducers: {
    updateId: () => {},
    setFriendListArray: (state, action) => {
      state.current_friend_list = action.payload;
    },
  },
  extraReducers: {
    [getFriendList.pending]: (state) => {
      state.isLoading = true;
    },
    [getFriendList.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.fb_data = action?.payload?.data ? action?.payload?.data[0] : "";
      state.current_fb_id = action?.payload?.data
        ? action.payload.data[0].fb_user_id
        : "";
      state.current_friend_list = action?.payload?.data?.length > 0
        ? action.payload.data[0].friend_details
        : [];
    },
    [getFriendList.rejected]: (state, action) => {
      state.isLoading = true;
    },
  },
});

export const { updateId, setFriendListArray } = fbSlice.actions;
export default fbSlice.reducer;
