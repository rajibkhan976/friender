import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import apiClient from "../services";
import { bulkOperationContacts, fetchFriendCount } from "../services/SSListServices";

const initialState = {
    isLoading: true,
    friends_data: [],
    reFetching: false,
    selected_friends: [],
    selection_obj: {},
    filter_state: {
        filter_key_value: null,
        filter_fun_state: null,
    },
    select_all_state: {},
    curr_list_count: 0,
    global_searched_filter: "",
    pluginRowSelection: {}
};

export const getListData = createAsyncThunk(
    "sslist/getListData",
    async (payload) => {
        const queryParam = payload.queryParam
        console.log('queryParam', queryParam);
      const res  = await apiClient(
        "get",
        `${payload.baseUrl}`,
        {},
        { ...queryParam }
      );
      return res;
    }
  );


export const getFriendCountAction = createAsyncThunk(
    "sslist/getFriendCount",
    async (payload) => {    
        const queryParam = payload.queryParam
        const res = await apiClient(
            "get",
            `${payload.baseUrl}`,
            {},
            { ...queryParam }
        );
        console.log('RES ', res);
        return res;
    }
);


// export const bulkAction = createAsyncThunk(
//     "sslist/bulkAction",
//     async (payload) => {    
//         let queryParam = payload.queryParam
//             queryParam = {
//                 ...queryParam,
//                 include_list: JSON.parse(queryParam.include_list)
//             }
//             console.log('queryParam', queryParam);
//         const res = await apiClient(
//             "post",
//             `${payload.baseUrl}`,
//             {...queryParam},
//             {}
//         );
//         console.log('RES ', res);
//         return res;
//     }
// );

export const bulkAction = createAsyncThunk(
    "sslist/bulkAction",
    async (payload) => {
        console.log('PAYLOAD IN ACTION', payload);
        const res = await bulkOperationContacts(payload);
        console.log('RES IN ACTION', res);
        return res;
    }
)

// export const getSendFriendReqstCount = createAsyncThunk(
//     "facebook/getSendFriendReqst",
//     async (payload) => {
//       const res = await fetchFriendCount(payload);
//       console.log('res', res);
//       return res;
//     }
//   );

export const ssListSlice = createSlice({
    name: "sslist",
    initialState,
    reducers: {
        updateFriendsData: () => {

        },
        updateRowSelection: (state, action) => {
            state.pagination = action.payload
        },
        updateSelectAllState: (state, action) => {
            state.select_all_state = action.payload;
        },
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
        updateSelectionObj: (state, action) => {
            state.selection_obj = {...action.payload}
        },
        updateSelectedFriends: (state, action) => {
            console.log('action', action?.payload);
            // console.log('COMPARE OLDER ::: WITH NEW >>>', state.selected_friends.filter(id => !(id in rowSelection)));
            state.selected_friends = [...action?.payload];
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
    updateRowSelection,
    updateSelectionObj,
    updateSelectAllState,
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