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
    ssList_data_obj: {},
    currlist_total_blacklist_count:0,
    currlist_total_whitelist_count:0,
    selected_friends_curr_count: 0,
    selected_friends_total_blackList_count: 0,
    selected_friends_total_whiteList_count: 0,
    listFetchParams:{
        queryParam: {},
        baseUrl: "",
        responseAdapter: ""
    },
    selectAcross : {
        selected:false,
        unSelected:[],
        unSelected_row_data:[],
    },
    MRT_selected_rows_state: {},
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
        { ...queryParam, local_time: new Date().toISOString().slice(0, 19).replace("T", " ")}
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
            { ...queryParam, local_time: new Date().toISOString().slice(0, 19).replace("T", " ") }
        );
        // console.log('RES ', res);
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
        const res = await bulkOperationContacts({...payload,local_time:new Date().toISOString().slice(0, 19).replace("T", " ")});
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
            state.selectAcross = {
                selected:false,
                unSelected:[],
                unSelected_row_data:[],
            };
            state.MRT_selected_rows_state = {};
            state.select_all_state = {};
            state.selected_friends_curr_count = 0;
            state.selected_friends_total_blackList_count = 0;
            state.selected_friends_total_whiteList_count = 0;
            state.selected_friends = [];
        },
        updateCurrlistCount: (state, action) => {
            state.list_unfiltered_count = action.payload;
        },
        updateMRTrowSelectionState : (state, action) =>{
            state.MRT_selected_rows_state = action.payload; 
            if(!state.selectAcross.selected){
                state.selected_friends_curr_count = Object.keys(state.MRT_selected_rows_state).length;
            }
        },
        updateSelectAcross: (state, action) => {
            //console.log("action.payload)))))0000",action.payload)
            state.selectAcross = {
                selected: action.payload.selected,
                unSelected: action.payload.unSelected
            };
            if (action.payload.selected) {
                state.selected_friends_curr_count = state.list_filtered_count - action.payload.unSelected.length;
                let { unselect_whitelist, unselect_blacklist } = action?.payload?.unSelected?.reduce((acc, curr) => {
                    return (
                        {
                            unselect_whitelist: acc.unselect_whitelist + (state?.ssList_data_obj[curr]?.whitelist_status ? 1 : 0),
                            unselect_blacklist: acc.unselect_blacklist + (state.ssList_data_obj[curr]?.blacklist_status ? 1 : 0)
                        })
                }, { unselect_whitelist: 0, unselect_blacklist: 0 })
                state.selected_friends_total_blackList_count = state.currlist_total_blacklist_count - unselect_blacklist;
                state.selected_friends_total_whiteList_count = state.currlist_total_whitelist_count - unselect_whitelist;

            }
        },
        removeMTRallRowSelection : (state,action) => {
            state.MRT_selected_rows_state = {};
            state.selectAcross = {
                selected:false,
                unSelected:[]
            };
            state.selected_friends_curr_count = 0;
            state.selected_friends_total_blackList_count = 0;
            state.selected_friends_total_whiteList_count = 0;
            state.selected_friends = [];
        },
        updateWhiteListStatusOfSelectesList: (state, action) => {
            state.ssList_data_obj[action.payload._id].whitelist_status = action.payload.status;
            action.payload.status===1? state.selected_friends_total_whiteList_count += 1 : state.selected_friends_total_whiteList_count -= 1;
            state.selected_friends = state.selected_friends.map(item => {
                if (item._id === action.payload._id) {
                    item.whitelist_status = action.payload.status;
                }
                return item;
            });

            state.ssList_data = state.ssList_data.map(item => {
                if (item._id === action.payload._id) {
                    item.whitelist_status = action.payload.status;
                }
                return item;
            });
        },
        updateBlackListStatusOfSelectesList: (state, action) => {
            state.ssList_data_obj[action.payload._id].blacklist_status = action.payload.status;
            action.payload.status? state.selected_friends_total_blackList_count += 1 : state.selected_friends_total_blackList_count -= 1;
            state.selected_friends = state.selected_friends.map(item => {
                if (item._id === action.payload._id) {
                    item.blacklist_status = action.payload.status;
                }
                return item;
            });
        },
        updateSelectionObj: (state, action) => {
            state.selection_obj = {...action.payload}
        },
        updateSelectedFriends: (state, action) => {
          //* VVI Selected friends must be updated always
          state.selected_friends = [...action?.payload];
          if (!state.selectAcross.selected) {
            let { whitelist, blacklist } = action?.payload?.reduce(
              (acc, curr) => {
                return {
                  whitelist: acc.whitelist + (curr?.whitelist_status ? 1 : 0),
                  blacklist: acc.blacklist + (curr?.blacklist_status ? 1 : 0),
                };
              },
              { whitelist: 0, blacklist: 0 }
            );
            state.selected_friends_total_blackList_count = blacklist;
            state.selected_friends_total_whiteList_count = whitelist;
          }
        },
        updateGlobalFilter: (state, action) => {
            state.global_searched_filter = action.payload;
        },
        crealGlobalFilter: (state) => {
            //console.log(":Clear Search Reducer fired");
            state.global_searched_filter = "";
        },
        updateListNumCount: (state, action) => {
            state.list_filtered_count = action.payload.count
        },
        resetFilters: (state, action) => {
            state.filter_state = {
                filter_key_value: null,
                filter_fun_state: null,
            }
        },
        updateLocalListState: (state, action) => {
            state.ssList_data = [...action?.payload]
        }
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
            if(action.payload?.res?.data[0]?.total_blacklist_count){
                state.currlist_total_blacklist_count = action.payload.res?.data[0]?.total_blacklist_count;
            }
            if(action.payload?.res?.data[0]?.total_whitelist_count){
                state.currlist_total_whitelist_count = action.payload.res?.data[0]?.total_whitelist_count;
            }
            state.ssList_data = action.payload.data; 
            //let listObj = {};
            action.payload.data?.forEach((item) => {
                state.ssList_data_obj[item._id] = item;
            });
            //state.ssList_data_obj = listObj;
        },
    },
});

export const {
    resetFilters,
    updateSelectAcross,
    updateRowSelection,
    updateSelectionObj,
    updateMRTrowSelectionState,
    updateSelectAllState,
    updateFilterState,
    updateCurrlistCount,
    updateSelectedFriends,
    updateNumberofListing,
    countCurrentListsize,
    updateWhiteListStatusOfSelectesList,
    updateBlackListStatusOfSelectesList,
    removeMTRallRowSelection,
    crealGlobalFilter,
    updateLocalListState
} = ssListSlice.actions;
export default ssListSlice.reducer;