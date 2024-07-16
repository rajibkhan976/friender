import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import apiClient from "../services";
import { bulkOperationContacts, fetchFriendCount } from "../services/SSListServices";

//way to use adapter function stringyfy
//
let adapter = {}; 
const initialState = {
    isLoading: true,
    ssList_data: [],
    isRefetching: false,
    selected_friends: [],
    listFetchParams:{
        queryParam: {},
        baseUrl: "",
        responseAdapter: ""
    },
    MRT_selected_rows_state: {},
    selection_obj: {},
    filter_state: {
        filter_key_value: null,
        filter_fun_state: null,
    },
    pagination_state: {
        page_number: 0,
        page_size: 15,
    },
    list_filtered_count: 0,
    list_unfiltered_count: 0,
    select_all_state: {},
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
      if(payload.responseAdapter){
        adapter = payload.responseAdapter;
      }
      //adapter = payload.responseAdapter? payload.responseAdapter(res) : res;
      return adapter(res);
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
            state.list_unfiltered_count = action.payload;
        },
        updateMRTrowSelectionState : (state, action) =>{
            state.MRT_selected_rows_state = action.payload;  
        },
        removeMTRallRowSelection : (state,action) => {
            state.MRT_selected_rows_state = {};
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
        [getListData.pending]: (state,action) => {
            if(!state.ssList_data.length || state.ssList_data.length === 0){
                state.isLoading = true;
            }else{
                state.isLoading = true;
                state.isRefetching = true;
            }
            state.pagination_state = {
                page_number:action.meta?.arg?.page_number,
                page_size:action.meta?.arg?.page_size,
            };
            state.listFetchParams = {
                queryParam: action.meta?.arg?.queryParam,
                baseUrl: action.meta?.arg?.baseUrl,
                responseAdapter: action.meta?.arg?.responseAdapter?.toString(),
            }
            //console.log("action.payload>>>", action);
        },
        [getListData.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.isRefetching = false;
            state.list_filtered_count = action.payload.count;
            if( !action.meta?.arg?.queryParam?.filter || action.meta?.arg?.queryParam?.filter === 0 ){
                state.list_unfiltered_count = action.payload.count;
              }
            state.ssList_data = action.payload.data; 
        },
    },
});

export const {
    updateRowSelection,
    updateSelectionObj,
    updateMRTrowSelectionState,
    updateSelectAllState,
    updateFilterState,
    updateCurrlistCount,
    updateSelectedFriends,
    removeSelectedFriends,
    updateNumberofListing,
    countCurrentListsize,
    updateWhiteListStatusOfSelectesList,
    updateBlackListStatusOfSelectesList,
    removeMTRallRowSelection
} = ssListSlice.actions;
export default ssListSlice.reducer;