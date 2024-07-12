import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import apiClient from "../services";

const initialState = {
    isLoading: true,
    reFetching: false,
    selected_friends: null,
    filter_state: {
        filter_key_value: null,
        filter_fun_state: null,
    },
    select_all_state: {},
    curr_list_count: 0,
    global_searched_filter: "",
};

export const getListData = createAsyncThunk(
    "sslist/getListData",
    async (payload) => {
        const queryParam = payload.queryParam
      const res  = await apiClient(
        "get",
        `${payload.baseUrl}`,
        {},
        { ...queryParam }
      );
      return res;
    }
  );


export const ssListSlice = createSlice({
    name: "sslist",
    initialState,
    reducers: {
        updateFilterState: (state, action) => {
            state.filter_state = action.payload;
        },
        updateCurrlistCount: (state, action) => {
            state.curr_list_count = action.payload;
        },
        updateWhiteListStatusOfSelectesList: (state, action) => {
            // console.log("list satussss   action ommmmm",action.payload)
            let statusObj = {};
            action.payload.forEach((item) => {
                statusObj[item.friendFbId] = item.status;
            });
            state.selected_friends = state.selected_friends.map((item) => {
                if (item.friendFbId in statusObj) {
                    item.whitelist_status = statusObj[item.friendFbId];
                }
                return item;
            });
        },
        updateBlackListStatusOfSelectesList: (state, action) => {
            let statusObj = {};
            action.payload.forEach((item) => {
                statusObj[item.friendFbId] = item.status;
            });
            state.selected_friends = state.selected_friends.map((item) => {
                if (item.friendFbId in statusObj) {
                    item.blacklist_status = statusObj[item.friendFbId];
                }
                return item;
            });
        },
        updateSelectedFriends: (state, action) => {
            state.selected_friends = action.payload;
        },
        removeSelectedFriends: (state, action) => {
            state.selected_friends = [];
        },
        updateGlobalFilter: (state, action) => {
            state.global_searched_filter = action.payload;
        },
        crealGlobalFilter: (state) => {
            //console.log(":Clear Search Reducer fired");
            state.global_searched_filter = "";
        },
    },
    extraReducers: {
        [getListData.pending]: (state) => {
            state.isLoading = true;
        },
        [getListData.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.reFetching = false;
        },
    },
});

export const {
    updateFilterState,
    updateCurrlistCount,
    updateSelectedFriends,
    removeSelectedFriends,
    updateNumberofListing,
    countCurrentListsize,
    updateWhiteListStatusOfSelectesList,
    updateBlackListStatusOfSelectesList
} = ssListSlice.actions;
export default ssListSlice.reducer;